<template>
  <div>
    <VxeTable
      :loading="loading"
      :data="tableData"
      :columns="tableColumns"
      :toolbarConfig="tableTools"
      :buttons="tableButtons"
    >
      <template #finished="{ row }">
        <span
          :class="{
            'is-red': !row.finished,
          }"
          >{{ formatStatus(row.finished) }}</span
        >
      </template>
    </VxeTable>

    <videoPlayer
      v-if="videoDialog"
      v-model:videoDialog="videoDialog"
      :name="name"
      :playId="playId"
      :fileType="fileType"
      :fileUuid="fileUuid"
      :playFilePath="playFilePath"
      @beforeHideMethod="beforeHideMethod"
    />
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import videoPlayer from '/@/views/project_ftm/student/myJob/myCourseware/list/components/videoPlayer.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { deleteEmptyParams, formatTime } from '/@/utils/index'
  import Api from '/@/api/ftm/student/trainEva'
  import { getCoursewaresId } from '/@/api/ftm/student/courseware'
  import { isHaveFile } from '/@/api/ftm/student/file'
  export default {
    components: {
      VxeTable,
      videoPlayer,
    },
    data() {
      return {
        menuName: 'COURSEWARE_ASSIGNMENT_READ_RECORD',
        form: {
          page: 1,
          size: 10,
        },
        total: 1,
        loading: false,
        tableData: [],
        tableTools: {
          enabled: false,
          // slots: {
          //   buttons: 'left_tools'
          // }
        },
        tableColumns: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.coursewareName'), minWidth: '140' },
          { field: 'creator', title: this.$t('table.publisher'), minWidth: 100 },
          {
            field: 'finished',
            title: this.$t('table.readingStatus'),
            minWidth: 80,
            slots: { default: 'finished' },
          },
          {
            field: 'readDuration',
            title: this.$t('table.readingTime'),
            formatter: this.formatReadDuration,
            minWidth: 90,
          },
          {
            field: 'lastReadTime',
            title: this.$t('table.lastReadTime'),
            formatter: this.formatDate,
            minWidth: 180,
          },
          { title: this.$t('table.tableEdit'), width: 80, slots: { default: 'operate' } },
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
    mounted() {
      this.getFlyTrainReadTask()
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getFlyTrainReadTask()
      },
      // 点击播放 先判断文件是否存在
      async playClick(row) {
        let [err, res] = await to(getCoursewaresId({ id: row.coursewareId }))
        let playData = res.data
        let [fileErr, fileRes] = await to(isHaveFile({ uuid: playData.fileUuid }))
        if (!fileErr && fileRes.status == 200) {
          if (!fileRes.data) {
            return this.$message.error(this.$t('holder.ThisCoursewareHasBeenDeleted'))
          }
          this.componentName = 'videoPlayer'
          this.videoDialog = true
          this.playId = playData.id
          this.fileUuid = playData.fileUuid
          this.fileType = playData.fileType
          this.playFilePath = playData.playFilePath
          this.name = playData.name
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
        this.getFlyTrainReadTask()
      },
      async getFlyTrainReadTask() {
        this.form = deleteEmptyParams(this.form)
        this.form.id = Number(this.$route.query.id)
        this.loading = true
        let [err, res] = await to(Api.getFlyTrainReadTask(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data
        }
      },
      formatType({ cellValue }) {
        if (this.coursewareTypeList.filter((v) => v.id == cellValue).length !== 0) {
          return this.coursewareTypeList.filter((v) => v.id == cellValue)[0].name
        }
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatStatus(cellValue) {
        switch (cellValue) {
          case true:
            return this.$t('button.completed')
          case false:
            return this.$t('button.notComplete')
          // case 'FINISHED_IN_TIME': return this.$t('status.finishedInTime')
          // case 'NOT_STARTED': return this.$t('button.notComplete')
          // case 'DELETED': return this.$t('status.deleted')
          default:
            return this.$t('button.notComplete')
        }
      },
      formatReadDuration({ cellValue }) {
        return this.getDuration(cellValue)
      },
      getDuration(second) {
        return formatTime.call(this, second)
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getFlyTrainReadTask()
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.play'),
            event: () => {
              this.playClick(row)
            },
          },
        ]
      },
    },
  }
</script>
<style lang="scss" scoped>
  .is-red {
    color: red;
  }
</style>
