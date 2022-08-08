<template>
  <div>
    <VxeTable
      ref="xTable"
      :data="tableData"
      :loading="tableLoading"
      :columns="tableColumns"
      v-model:form="form"
      @handlePageChange="handleCurrentChange"
    >
      <template #form>
        <el-form ref="form" :model="form" :inline="true" size="medium">
          <el-form-item :label="$t('table.coursewareType')">
            <el-select
              v-model="form.coursewareType"
              :placeholder="$t('holder.pleaseSelect')"
              style="width: 200px"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in coursewareTypeList"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              :placeholder="$t('holder.pleaseInputCoursewareName')"
              v-model="form.searchKey"
              style="width: 280px"
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
    </VxeTable>

    <component
      :is="componentName"
      v-model:videoDialog="videoDialog"
      @beforeHideMethod="beforeHideMethod"
      :playId="playId"
      :fileType="fileType"
      :fileUuid="fileUuid"
      :playFilePath="playFilePath"
      :name="name"
    />
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import videoPlayer from '/@/views/project_ftm/student/myJob/myCourseware/list/components/videoPlayer.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { deleteEmptyParams, formatTime } from '/@/utils/index'
  import { getCoursewareReadRecords } from '/@/api/ftm/student/courseware'
  import { isHaveFile } from '/@/api/ftm/student/file'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    components: {
      VxeTable,
      videoPlayer,
      Search,
    },
    data() {
      return {
        form: {
          page: 1,
          size: 10,
          total: 0,
          searchKey: undefined,
          coursewareType: undefined,
          sort: 'lastReadTime',
          order: 'desc',
        },
        tableLoading: false,
        tableData: [],
        tableColumns: [
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'courseware.name', title: this.$t('table.title'), minWidth: 140 },
          {
            field: 'courseware.type',
            title: this.$t('table.coursewareType'),
            formatter: this.formatType,
            width: 90,
          },
          { field: 'courseware.creator.name', title: this.$t('table.publisher'), minWidth: 120 },
          {
            field: 'status',
            title: this.$t('table.readingStatus'),
            formatter: this.formatReadingStatus,
            width: 90,
          },
          {
            field: 'startDate',
            title: this.$t('table.startReadingTime'),
            formatter: this.formatDate,
            minWidth: 180,
          },
          {
            field: 'readDuration',
            title: this.$t('table.readingTime'),
            formatter: this.formatTime,
            minWidth: 180,
          },
          {
            field: 'lastReadTime',
            title: this.$t('table.lastReadTime'),
            formatter: this.formatDate,
            minWidth: 180,
          },
        ],
        coursewareTypeList: [
          { id: 'PUBLIC', name: this.$t('table.openCourseware') },
          { id: 'THIRD_PARTY', name: this.$t('table.thirdPartyCourseware') },
          { id: 'SELF', name: this.$t('table.ownCourseware') },
        ],
        componentName: '',
        videoDialog: false,
        playId: undefined,
        fileUuid: '',
        fileType: '',
        playFilePath: '',
        name: '',
      }
    },
    // TODO 原缓存页面执行 activated
    mounted() {
      this.getCoursewareReadRecords()
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getCoursewareReadRecords()
      },
      // 点击播放 先判断文件是否存在
      async playClick(id, fileUuid, fileType, name, playFilePath) {
        let [fileErr, fileRes] = await to(isHaveFile({ uuid: fileUuid }))
        if (!fileErr && fileRes.status == 200) {
          if (!fileRes.data)
            return this.$message.error(this.$t('holder.ThisCoursewareHasBeenDeleted'))
          ;(this.componentName = 'videoPlayer'), (this.videoDialog = true)
          this.playId = id
          this.fileUuid = fileUuid
          this.fileType = fileType
          this.playFilePath = playFilePath
          this.name = name
        }
      },
      beforeHideMethod() {
        this.componentName = ''
        this.videoDialog = false
        this.playId = undefined
        this.fileUuid = undefined
        this.fileType = undefined
        this.playFilePath = undefined
        this.name = undefined
      },
      async getCoursewareReadRecords() {
        this.form = deleteEmptyParams(this.form)
        this.form.userId = this.userInfo.userId
        this.tableLoading = true
        let [err, res] = await to(getCoursewareReadRecords(this.form))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      formatType({ cellValue }) {
        if (this.coursewareTypeList.filter((v) => v.id == cellValue).length !== 0) {
          return this.coursewareTypeList.filter((v) => v.id == cellValue)[0].name
        }
      },
      formatContentType({ cellValue }) {
        return cellValue == 'ASSIGN'
          ? this.$t('status.assignedReading')
          : this.$t('status.selfReading')
      },
      formatReadingStatus({ cellValue }) {
        return cellValue == 'READING' ? this.$t('button.notComplete') : this.$t('button.complete')
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatTime({ cellValue }) {
        return formatTime(cellValue)
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.getCoursewareReadRecords()
      },
    },
  }
</script>
