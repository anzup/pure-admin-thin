<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    v-model:form="pagination"
    :toolbar-config="tableTools"
    @handlePageChange="handleCurrentChange"
  >
    <template #right_tools>
      <!-- <el-button type="primary" size="mini" :loading="loadingExport" @click="Export">{{ $t('button.leadingOut') }}</el-button> -->
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getStudentRecords, exportStudentRecords } from '/@/api/ftm/teacher/studentTraining'
  import XEutils from 'xe-utils'
  import { formatTime } from '/@/utils/index'
  export default {
    components: { VxeTable },
    data() {
      return {
        tableData: [],
        tableTools: {
          enabled: false,
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'courseware.name', title: this.$t('table.coursewareTitle'), minWidth: 120 },
          {
            field: 'courseware.type',
            title: this.$t('table.coursewareType'),
            minWidth: 150,
            formatter: this.coursewareFormatter,
          },
          {
            field: 'courseware.creator.name',
            title: this.$t('table.coursewarePublisher'),
            minWidth: 110,
          },
          {
            field: 'type',
            title: this.$t('table.howToRead'),
            minWidth: 120,
            formatter: this.readTypeFormatter,
          },
          {
            field: 'status',
            title: this.$t('table.readingStatus'),
            minWidth: 110,
            formatter: this.formatReadingStatus,
          },
          {
            field: 'readingNum',
            title: this.$t('table.readingNum'),
            minWidth: 110,
            formatter: this.formatReadingStatus,
          },
          {
            field: 'readDuration',
            title: this.$t('table.readingTime'),
            minWidth: 200,
            formatter: this.dateFormatter,
          },
          {
            field: 'lastReadTime',
            title: this.$t('table.lastReadTime'),
            minWidth: 160,
            formatter: this.datetimeFormatter,
          },
        ],
        loading: false,
        loadingExport: false,
        form: {
          studentType: undefined,
          studentTypes: [
            { label: this.$t('common.all'), value: undefined },
            { label: this.$t('status.studentTypeAssign'), value: 'ASSIGN' },
            { label: this.$t('status.studentTypeSelf'), value: 'SELF' },
          ],
        },
        pagination: {
          // 表格分页信息
          page: 1,
          size: 10,
          total: 0,
        },
      }
    },
    props: ['details'],
    mounted() {
      this.getData()
    },
    methods: {
      getData() {
        const param = {
          page: this.pagination.page,
          size: this.pagination.size,
          userId: this.details.userId,
        }
        this.loading = true
        getStudentRecords(param)
          .then((res) => {
            this.tableData = res.data.content
            this.pagination.total = res.data.totalElements
            this.loading = false
          })
          .catch((e) => {
            this.loading = false
          })
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      // 导出
      async Export() {
        this.loadingExport = true
        await exportStudentRecords({
          type: this.form.studentType,
        }).catch(() => {
          this.loadingExport = false
        })
        this.loadingExport = false
      },
      // 变更学习类型
      selectFilter(val) {
        this.form.studentType = val
        this.getData()
      },
      seqMethod(row) {
        return (this.pagination.page - 1) * this.pagination.size + row.seq
      },
      // 格式化课件类型
      coursewareFormatter({ cellValue }) {
        switch (cellValue) {
          case 'PUBLIC':
            return this.$t('table.openCourseware')
          case 'THIRD_PARTY':
            return this.$t('table.thirdPartyCourseware')
          case 'SELF':
            return this.$t('table.ownCourseware')
          default:
            return ''
        }
      },
      // 格式化时间格式
      datetimeFormatter({ cellValue }) {
        return XEutils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      dateFormatter({ cellValue }) {
        return formatTime.call(this, cellValue)
      },
      // 格式化状态
      formatReadingStatus({ cellValue }) {
        return cellValue == 'READING' ? this.$t('button.notComplete') : this.$t('button.complete')
      },
      // 格式化阅读方式
      readTypeFormatter({ cellValue }) {
        switch (cellValue) {
          case 'ASSIGN':
            return this.$t('status.studentTypeAssign')
          case 'SELF':
            return this.$t('status.studentTypeSelf')
        }
      },
    },
  }
</script>
