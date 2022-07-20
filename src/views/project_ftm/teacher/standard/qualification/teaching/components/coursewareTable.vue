<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColmns"
    :toolbarConfig="isModify ? tableToolbar : null"
    @checkbox="selectChangeEvent"
  >
    <template #form>
      <el-form ref="form" :inline="true" size="medium">
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
              v-for="item in formFilter.attrs"
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
              v-for="item in formFilter.system"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <!-- 所属课程 -->
        <el-form-item :label="$t('table.itsCouse')">
          <el-select
            v-model="form.courseId"
            :placeholder="$t('holder.pleaseSelect')"
            class="sort-input"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in formFilter.course"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <!-- 搜索 -->
        <el-form-item>
          <el-input
            class="searchInput"
            size="medium"
            :placeholder="$t('holder.pleaseEnterTheTitle')"
            suffix-icon="el-icon-search"
            v-model="form.searchKey"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="getCoursewares">{{
            $t('button.query')
          }}</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #right_tools>
      <el-button type="primary" size="mini" @click="uploadEvent">{{
        $t('button.upload')
      }}</el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="records.length == 0"
        @click="batchTopEvent"
        >{{ $t('button.bulkTop') }}</el-button
      >
    </template>

    <template #properties="{ row }">
      <span>{{ formatProperties(row.properties) }}</span>
    </template>
    <template #edit="{ row }">
      <div class="button-line">
        <span class="buttonEdit" @click="playEvent(row)">{{ $t('button.play') }}</span>
        <!-- <span class="buttonEdit" @click="commentEvent(row.id)">{{ $t("button.comment") }}</span> -->
        <span class="buttonEdit" @click="modifyEvent(row.id)" v-if="isModify">{{
          $t('button.modify')
        }}</span>
        <span class="buttonDelete" @click="deleteEvent(row.id)" v-if="isModify">{{
          $t('button.delete')
        }}</span>
        <span class="buttonEdit" @click="topEvent(row)" v-if="isModify">{{
          $t('button.top')
        }}</span>
      </div>
    </template>
    <template #pager />
  </VxeTable>

  <videoPlayer
    v-if="playDialogVisible"
    :videoDialog="playDialogVisible"
    @beforeHideMethod="hidePlayEvent"
    v-bind="playInfo"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import videoPlayer from '/@/views/project_ftm/teacher/myJob/courseware/assigned/components/videoPlayer.vue'
  import {
    getCoursewares,
    getCoursewareProperties,
    postCoursewaresUpdateSeqNo,
    deleteCoursewares,
  } from '/@/api/ftm/teacher/courseware'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import to from 'await-to-js'
  import { useCoursewareStore } from '/@/store/modules/courseware'
  const coursewareStore = useCoursewareStore()
  export default {
    data() {
      return {
        loading: false,
        tableToolbar: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableData: [],
        records: [],
        form: {
          page: 1,
          size: 1000,
          sort: 'createdDate',
          order: 'desc',
          type: 'PUBLIC',
          propertyId: '',
          systemType: '',
          airplaneType: '',
          courseId: '',
          searchKey: '',
        },
        formFilter: {
          attrs: [],
          system: [],
          course: [],
        },
        playDialogVisible: false,
        playInfo: {},
      }
    },
    props: {
      airplaneId: [String, Number],
      courseId: [String, Number],
      isModify: Boolean,
    },
    components: {
      VxeTable,
      videoPlayer,
    },
    computed: {
      coursewareSystem() {
        return coursewareStore.system
      },
      tableColmns() {
        return [
          this.isModify ? { type: 'checkbox', width: 40 } : null,
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.title'), minWidth: 280 }, // 标题
          {
            field: 'courses',
            title: this.$t('table.itsCouse'),
            minWidth: 200,
            formatter: this.formatCourses,
          }, // 所属课程
          {
            field: 'systemTypes',
            title: this.$t('table.system'),
            formatter: this.formatSystem,
            width: 150,
          }, // 系统
          {
            field: 'properties',
            title: this.$t('table.attribute'),
            formatter: this.formatProperties,
            minWidth: 180,
            slots: { default: 'properties' },
          }, // 属性
          { field: 'creator.name', title: this.$t('table.publisher'), minWidth: 120 }, // 发布人
          {
            field: 'createdDate',
            title: this.$t('table.releaseTime'),
            minWidth: 180,
            formatter: 'formatDateTime',
          }, // 发布时间
          { field: 'readCount', title: this.$t('table.readingsTotalNumber'), minWidth: 120 }, // 总阅读数量
          { field: 'commentCount', title: this.$t('table.commentTotalNumber'), minWidth: 120 }, // 总评论数
          this.isModify
            ? { title: this.$t('table.tableEdit'), width: 330, slots: { default: 'operate' } }
            : { title: this.$t('table.tableEdit'), width: 150, slots: { default: 'operate' } },
        ].filter((v) => !!v)
      },
    },
    async created() {
      this.loading = true
      this.form.airplaneType = this.airplaneId
      this.getCoursewareProperties()
      this.getCoursewaresSystemTypes()
      await this.getCourse()
      this.getCoursewares()
    },
    methods: {
      // 获取课件
      async getCoursewares() {
        const params = {}
        for (let [key, val] of Object.entries(this.form)) {
          if (val !== '') {
            params[key] = val
          }
        }
        this.loading = true
        const [err, res] = await to(getCoursewares(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      // 获取属性下拉列表
      async getCoursewareProperties() {
        const params = {
          page: 1,
          size: 10000,
          level: 0,
        }
        const [err, res] = await to(getCoursewareProperties(params))
        if (!err && res.status == 200) {
          this.formFilter.attrs = res.data.content
        }
      },
      // 获取系统下拉列表
      async getCoursewaresSystemTypes() {
        await coursewareStore.UPDATE_SYSTEM()
        this.formFilter.system = this.coursewareSystem
      },
      // 获取课程下拉列表
      async getCourse() {
        const [err, res] = await to(getCoursesAll())
        if (!err && res.status == 200) {
          this.formFilter.course = res.data
          this.form.courseId = this.courseId
        }
      },
      // 上传课件
      uploadEvent() {
        this.$emit('changePage', { type: 'upload' })
      },
      // 置顶课件（批量）
      batchTopEvent() {
        this.$confirm(this.$t('tip.batchCousewareTip'), this.$t('tip.tip'), {
          type: 'warning',
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
        }).then(() => {
          this.postCoursewaresUpdateSeqNo(this.records)
        })
      },
      // 置顶课件
      topEvent(row) {
        let { id } = row
        this.postCoursewaresUpdateSeqNo([id])
      },
      // 播放课件
      playEvent({ id, fileUuid, fileType, name, playFilePath }) {
        this.playDialogVisible = true
        this.playInfo = {
          playId: id,
          fileUuid,
          fileType,
          playFilePath,
          name,
          addListen: false,
        }
      },
      // 评论课件
      commentEvent(id) {
        this.$emit('changePage', { type: 'comment', id })
      },
      // 修改课件
      modifyEvent(id) {
        this.$emit('changePage', { type: 'modify', id })
      },
      // 删除课件
      deleteEvent(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(async () => {
          const [err, res] = await to(deleteCoursewares({ id }))
          if (!err && res.status == 200) {
            if (
              this.form.page > 1 &&
              this.form.total == (this.form.page - 1) * this.form.size + 1
            ) {
              this.form.page -= 1
            }
            this.getCoursewares()
            this.$message.success(this.$t('tip.delsuccessTip'))
          }
        })
      },
      // 选择课件
      selectChangeEvent() {},
      // 关闭课件预览
      hidePlayEvent() {
        this.playDialogVisible = false
      },
      // 置顶请求
      async postCoursewaresUpdateSeqNo(ids) {
        const { sort, order, type } = this.form
        const params = { sort, order, ids, type }
        const [err, res] = await to(postCoursewaresUpdateSeqNo(params))
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.editSuccessTip'))
          this.getCoursewares()
        }
      },
      selectChangeEvent({ records }) {
        this.records = records.map((item) => item.id)
      },
      // 格式化属性
      formatProperties(cellValue) {
        if (cellValue.length !== 0) {
          let properties = []
          cellValue.map((v) => {
            properties.push(v.superior.name + '-' + v.name)
          })
          return properties.toString()
        }
      },
      // 格式化所属课程
      formatCourses({ cellValue }) {
        return cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : cellValue
      },
      // 格式化匹配系统
      formatSystem({ cellValue }) {
        if (this.formFilter.system.filter((v) => cellValue.includes(v.key)).length !== 0) {
          return this.formFilter.system
            .filter((v) => cellValue.includes(v.key))
            .map((item) => item.keyTranslation)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
    height: 100%;
  }
</style>
