<template>
  <VxeTable
    ref="xTable"
    :data="tableData"
    :loading="loading"
    :columns="tableColmns"
    :toolbar-config="tableToolbar"
    :buttons="tableButtons"
    @checkbox="selectChangeEvent"
  >
    <template #form>
      <el-form ref="form" :model="form" :inline="true" size="medium">
        <!-- 机型 -->
        <el-form-item :label="$t('table.modelNumber')">
          <el-select
            v-model="form.airplaneType"
            :placeholder="$t('holder.pleaseSelect')"
            class="sort-input"
            clearable
          >
            <el-option
              :label="item.key"
              :value="item.key"
              v-for="item in airplaneTypesAll"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <!-- 属性 -->
        <el-form-item :label="$t('table.attribute')">
          <el-select
            v-model="form.propertyId"
            :placeholder="$t('holder.pleaseSelect')"
            class="sort-input"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in propertyList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <!-- 系统 -->
        <el-form-item :label="$t('table.system')">
          <el-select
            v-model="form.systemType"
            :placeholder="$t('holder.pleaseSelect')"
            class="sort-input"
            clearable
          >
            <el-option
              :label="item.keyTranslation"
              :value="item.key"
              v-for="item in systemTypeList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <!-- 所属课程 -->
        <el-form-item :label="$t('table.itsCouse')">
          <el-select v-model="form.courseId" :placeholder="$t('holder.pleaseSelect')" clearable>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in courseList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            class="searchInput"
            size="medium"
            :placeholder="$t('holder.pleaseEnterTheTitle')"
            v-model="form.searchKey"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="search">{{
            $t('button.query')
          }}</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #right_tools>
      <el-button
        :disabled="records.length == 0"
        type="primary"
        size="mini"
        @click="coursewareChangeType"
        >{{ $t('button.changeType') }}</el-button
      >
      <el-button
        :disabled="records.length == 0"
        type="primary"
        size="mini"
        @click="approvalDialogVisible = true"
        >{{ $t('button.submitReview') }}</el-button
      >
      <el-button
        :disabled="records.length == 0"
        type="primary"
        size="mini"
        @click="coursewareAssignment"
        >{{ $t('button.coursewareAssignment') }}</el-button
      >
      <el-button
        :disabled="records.length == 0"
        type="primary"
        size="mini"
        @click="applicationReview"
        >{{ $t('button.applicationReview') }}</el-button
      >
      <el-button type="primary" size="mini" @click="upload">{{ $t('button.upload') }}</el-button>
      <el-button type="primary" size="mini" :disabled="records.length == 0" @click="moveLocation">{{
        $t('button.bulkTop')
      }}</el-button>
    </template>

    <template #properties="{ row }">
      <span>{{ formatProperties(row.properties) }}</span>
    </template>
    <template #pager />
  </VxeTable>
  <component
    :is="componentName"
    :videoDialog="videoDialog"
    @beforeHideMethod="beforeHideMethod"
    :playId="playId"
    :fileType="fileType"
    :fileUuid="fileUuid"
    :playFilePath="playFilePath"
    :name="name"
  />
  <ReviewDialog v-model:visible="approvalDialogVisible" @submit="coursewareToReview" />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import videoPlayer from './videoPlayer.vue'
  import ReviewDialog from './reviewDialog.vue'
  import { Search } from '@element-plus/icons-vue'
  import {
    getCoursewares,
    deleteCoursewares,
    getCoursewareProperties,
    getCoursewaresAirplaneTypes,
    postCoursewareApprovalRequestsBatch,
    postCoursewaresUpdateSeqNo,
    postCoursewareModifyPublic,
    postCoursewareModifyApproval,
  } from '/@/api/ftm/teacher/courseware'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import { deleteEmptyParams } from '/@/utils/index'
  import { useCoursewareStore } from '/@/store/modules/courseware'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  const coursewareStore = useCoursewareStore()

  export default {
    props: ['type'],
    data() {
      return {
        records: [],
        airplaneTypesAll: [],
        propertyList: [],
        systemTypeList: [],
        courseList: [],
        tableData: [],
        tableToolbar: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        loading: false,
        form: {
          page: 1,
          size: 1000,
          sort: 'createdDate',
          order: 'desc',
          airplaneType: undefined,
          propertyId: undefined,
          systemType: undefined,
          courseId: undefined,
          searchKey: undefined,
          type: 'PUBLIC',
        },
        componentName: '',
        videoDialog: false,
        playId: undefined,
        fileUuid: '',
        fileType: '',
        playFilePath: '',
        name: '',
        total: 0,
        approvalDialogVisible: false,
      }
    },
    activated() {
      sessionStorage.removeItem('ids')
      this.getCoursewareProperties()
      this.getCoursewaresAirplaneTypes()
      this.getCoursewaresSystemTypes()
      this.getCourses()
      this.form.type = this.type
      this.getCoursewares()
    },
    mounted() {
      sessionStorage.removeItem('ids')
      this.getCoursewareProperties()
      this.getCoursewaresAirplaneTypes()
      this.getCoursewaresSystemTypes()
      this.getCourses()
      this.form.type = this.type
      this.getCoursewares()
    },
    components: {
      VxeTable,
      selectedView,
      videoPlayer,
      ReviewDialog,
      Search,
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
      coursewareSystem() {
        return coursewareStore.system
      },
      menuName() {
        switch (this.type) {
          case 'PUBLIC':
            return 'COURSEWARE_PUBLIC'
          case 'THIRD_PARTY':
            return 'COURSEWARE_THIRD_PARTY'
          case 'SELF':
            return 'COURSEWARE_SELF'
        }
      },
      tableColmns() {
        let colmns = [
          { type: 'checkbox', width: 40 },
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.title'), minWidth: 280 }, // 标题
          {
            field: 'courses',
            title: this.$t('table.itsCouse'),
            minWidth: 150,
            formatter: this.formatCourses,
          }, // 所属课程
          { field: 'airplaneTypes', title: this.$t('table.modelNumber'), minWidth: 120 }, // 机型
          {
            field: 'systemTypes',
            title: this.$t('table.system'),
            formatter: this.formatSystem,
            width: 100,
          }, // 系统
          {
            field: 'properties',
            title: this.$t('table.attribute'),
            formatter: this.formatProperties,
            minWidth: 180,
            slots: { default: 'properties' },
          }, // 属性
          this.type != 'SELF' || !this.userInfo.teacher
            ? { field: 'creator.name', title: this.$t('table.publisher'), minWidth: 120 }
            : null, // 发布人
          {
            field: 'createdDate',
            title: this.$t('table.releaseTime'),
            minWidth: 180,
            formatter: this.formatDate,
          }, // 发布时间
          this.type !== 'SELF'
            ? { field: 'readCount', title: this.$t('table.readingsTotalNumber'), minWidth: 120 }
            : null, // 总阅读数量
          { field: 'commentCount', title: this.$t('table.commentTotalNumber'), minWidth: 120 }, // 总评论数
          this.type == 'SELF'
            ? {
                field: 'publiced',
                title: this.$t('button.status'),
                formatter: this.formatPubliced,
                width: 140,
              }
            : null,
          { title: this.$t('table.tableEdit'), width: 330, slots: { default: 'operate' } },
        ].filter((item) => item)
        return colmns
      },
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      postCoursewaresUpdateSeqNo(ids) {
        const { sort, order, type } = this.form
        postCoursewaresUpdateSeqNo({
          sort,
          order,
          ids,
          type,
        }).then((res) => {
          this.$message.success(this.$t('tip.editSuccessTip'))
          this.getCoursewares()
        })
      },
      moveLocation() {
        this.$confirm(this.$t('tip.batchCousewareTip'), this.$t('tip.tip'), {
          type: 'warning',
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
        }).then(() => {
          this.postCoursewaresUpdateSeqNo(this.records)
        })
      },
      move(row) {
        let { id } = row
        this.postCoursewaresUpdateSeqNo([id])
      },
      selectChangeEvent({ records }) {
        this.records = XEUtils.map(records, (item) => item.id)
      },
      getClearAll() {
        this.xTable.clearSelectEvent()
        this.records = []
      },
      // 获取课程列表
      async getCourses() {
        const [err, res] = await to(getCoursesAll())
        if (!err && res.status == 200) {
          this.courseList = res.data
        }
      },
      getCoursewareProperties() {
        const data = {
          page: 1,
          size: 10000,
          level: 0,
        }
        getCoursewareProperties(data).then((res) => {
          if (res.status == 200) {
            this.propertyList = res.data.content
          }
        })
      },
      getCoursewaresAirplaneTypes() {
        getCoursewaresAirplaneTypes().then((res) => {
          if (res.status == 200) {
            this.airplaneTypesAll = res.data
          }
        })
      },
      async getCoursewaresSystemTypes() {
        await coursewareStore.UPDATE_SYSTEM()
        this.systemTypeList = this.coursewareSystem
      },
      async getCoursewares() {
        this.form.page = 1
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        const [err, res] = await to(getCoursewares(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.total = res.data.totalElements
          this.getClearAll()
        }
      },
      upload() {
        this.routerGo(`assigned/add?type=${this.form.type}`)
      },
      playClick(id, fileUuid, fileType, name, playFilePath) {
        ;(this.componentName = 'videoPlayer'), (this.videoDialog = true)
        this.playId = id
        this.fileUuid = fileUuid
        this.fileType = fileType
        this.playFilePath = playFilePath
        this.name = name
      },
      details(id) {
        this.routerGo(`assigned/details?id=${id}`)
      },
      modify(id) {
        this.routerGo(`assigned/info?type=${this.form.type}&id=${id}`)
      },
      deleteCoursewares(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteCoursewares({ id: id }).then((res) => {
            if (res.status == 200) {
              if (parseInt(this.total / this.form.size) < this.form.page && this.form.page !== 1) {
                this.form.page = parseInt(this.total / this.form.size)
              }
              this.getCoursewares()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      coursewareAssignment() {
        // 课件指派 教员指派学员
        sessionStorage.setItem('ids', JSON.stringify(this.records))
        this.routerGo(`assigned/student?ids=${this.records.join(',')}`)
      },
      // 类型变更
      async coursewareChangeType() {
        this.$confirm(this.$t('tip.areYouSureChangeType'), this.$t('tip.tip'), {
          type: 'warning',
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
        }).then(async () => {
          let [err] = await to(postCoursewareModifyPublic({ ids: this.records }))
          if (!err) {
            this.$message.success(this.$t('tip.modifySuccessTop'))
            this.getCoursewares()
          }
        })
      },
      // 提交审核
      async coursewareToReview(form) {
        let params = {
          ...form,
          coursewareIds: this.records,
        }
        let [err] = await to(postCoursewareModifyApproval(params))
        if (!err) {
          this.$message.success(this.$t('tip.subSuccessTip'))
          this.approvalDialogVisible = false
        }
      },
      applicationReview() {
        // 申请评审
        let coursewareIds = []
        this.records.forEach((v) => {
          coursewareIds.push({
            coursewareId: v,
          })
        })
        this.$confirm(this.$t('common.confirmWhetherToApplyForReview'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          postCoursewareApprovalRequestsBatch(coursewareIds).then((res) => {
            if (res.status == 200) {
              this.getCoursewares()
              this.$message.success(this.$t('tip.subSuccessTip'))
            }
          })
        })
      },
      beforeHideMethod() {
        this.componentName = ''
        this.videoDialog = false
        this.playId = undefined
        this.fileUuid = undefined
        this.fileType = undefined
        this.playFilePath = undefined
        this.name = undefined
        this.getCoursewares()
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatSystem({ cellValue }) {
        if (this.systemTypeList.filter((v) => cellValue.includes(v.key)).length !== 0) {
          return this.systemTypeList
            .filter((v) => cellValue.includes(v.key))
            .map((item) => item.keyTranslation)
        }
      },
      formatPubliced({ cellValue }) {
        return cellValue ? this.$t('table.openCourseware') : this.$t('table.ownCourseware')
      },
      formatProperties(cellValue) {
        if (cellValue.length !== 0) {
          let properties = []
          cellValue.map((v) => {
            properties.push(v.superior.name + '-' + v.name)
          })
          return properties.toString()
        }
      },
      formatCourses({ cellValue }) {
        return cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : cellValue
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getCoursewares()
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row, rowIndex }) {
        return [
          {
            name: this.$t('button.play'),
            visible: row.operationTypes.includes('PLAY'),
            event: () => {
              this.playClick(row.id, row.fileUuid, row.fileType, row.name, row.playFilePath)
            },
          },
          {
            name: this.$t('button.comment'),
            visible: row.operationTypes.includes('COMMENTS'),
            event: () => {
              this.details(row.id)
            },
          },
          {
            name: this.$t('button.modify'),
            visible: row.operationTypes.includes('UPDATE'),
            event: () => {
              this.modify(row.id)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: row.operationTypes.includes('DELETE'),
            event: () => {
              this.deleteCoursewares(row.id)
            },
          },
          {
            name: this.$t('button.top'),
            event: () => {
              this.move(row, rowIndex, 'up')
            },
          },
        ]
      },
    },
  }
</script>

<style lang="scss" scoped>
  .componentsContent {
    .sort-input {
      width: 140px;
    }
    .search-input {
      width: 200px;
      margin: 0 10px;
    }
  }
</style>
