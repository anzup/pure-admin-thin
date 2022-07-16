<template>
  <VxeTable
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    :toolbarConfig="tableTools"
    :form="{ page: form.page, size: form.size, total }"
    @action="btnClick"
    @handle-page-change="handleCurrentChange"
  >
    <template #finished="{ row }">
      <span
        :class="{
          'is-red': !row.finished,
        }"
        >{{ formatStatus(row.finished) }}</span
      >
    </template>

    <template #edit="{ row }">
      <!-- v-permission="menuName + ':PLAY'" -->
      <span class="buttonEdit" @click="playClick(row)">{{ $t('button.play') }}</span>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  import { deleteEmptyParams, formatTime } from '/@/utils/index'
  import Api from '/@/api/ftm/teacher/trainEva'
  import to from 'await-to-js'
  export default {
    components: {
      VxeTable,
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
          default:
            return this.$t('button.notComplete')
        }
      },
      formatReadDuration({ cellValue }) {
        return this.getDuration(cellValue)
      },
      getDuration(second) {
        return formatTime(second, {
          dayName: this.$t('common.day'),
          hourName: this.$t('common.hour'),
          minutesName: this.$t('common.minutes'),
        })
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getFlyTrainReadTask()
      },
      btnClick() {},
    },
  }
</script>
<style lang="scss" scoped>
  .is-red {
    color: red;
  }
</style>
