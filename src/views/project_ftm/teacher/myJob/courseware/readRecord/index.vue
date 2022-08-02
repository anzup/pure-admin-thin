<template>
  <div>
    <VxeTable
      :loading="loading"
      :data="tableData"
      :columns="tableColumns"
      :toolbarConfig="tableTools"
      :buttons="tableButtons"
      v-model:form="form"
      @handlePageChange="handleCurrentChange"
    >
      <template #form>
        <el-form ref="form" :model="form" inline size="medium">
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
              suffix-icon="el-icon-search"
              v-model="form.searchKey"
              style="width: 280px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #readTime="{ row }">
        <span>{{ getDuration(row.readDuration) }}</span>
      </template>
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
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import videoPlayer from '/@/views/project_ftm/teacher/myJob/courseware/assigned/components/videoPlayer.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { deleteEmptyParams, formatTime } from '/@/utils/index'
  import { getCoursewareReadRecords } from '/@/api/ftm/teacher/courseware'
  import { isHaveFile } from '/@/api/ftm/teacher/file'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: {
      VxeTable,
      videoPlayer,
    },
    data() {
      return {
        menuName: 'COURSEWARE_READ_RECORD',
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: 'lastReadTime',
          order: 'desc',
          searchKey: undefined,
          coursewareType: undefined,
        },
        loading: false,
        tableData: [],
        tableTools: {
          enabled: false,
          slots: {
            buttons: 'left_tools',
          },
        },
        tableColumns: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'courseware.name', title: this.$t('table.title'), minWidth: 140 },
          {
            field: 'courseware.type',
            title: this.$t('table.coursewareType'),
            formatter: this.formatType,
            width: 180,
          },
          { field: 'courseware.creator.name', title: this.$t('table.publisher'), minWidth: 120 },
          {
            field: 'type',
            title: this.$t('table.howToRead'),
            formatter: this.formatContentType,
            width: 120,
          },
          {
            field: 'status',
            title: this.$t('table.readingStatus'),
            formatter: this.formatReadingStatus,
            width: 120,
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
            slots: { default: 'readTime' },
            width: 150,
          },
          {
            field: 'lastReadTime',
            title: this.$t('table.lastReadTime'),
            formatter: this.formatDate,
            minWidth: 180,
          },
          // { title: this.$t('table.tableEdit'), width: 80, slots: { default: 'edit' } }
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
    // TODO 原缓存页面执行activated
    mounted() {
      this.loading = true
      this.getCoursewareReadRecords()
    },
    computed: {
      userInfo() {
        return userStore.$state
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
        this.getCoursewareReadRecords()
      },
      async getCoursewareReadRecords() {
        this.form = deleteEmptyParams(this.form)
        this.form.userId = this.userInfo.userId
        this.loading = true
        let [err, res] = await to(getCoursewareReadRecords(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      getDuration(second) {
        return formatTime.call(this, second)
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
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getCoursewareReadRecords()
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.play'),
            visible: userStore.ContainsPermissions(this.menuName + ':PLAY'),
            event: () => {
              this.playClick(
                row.courseware.id,
                row.courseware.fileUuid,
                row.courseware.fileType,
                row.courseware.name,
                row.courseware.playFilePath,
              )
            },
          },
        ]
      },
    },
  }
</script>
