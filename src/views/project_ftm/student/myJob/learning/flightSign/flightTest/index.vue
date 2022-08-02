<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :buttons="tableButtons"
    @handlePageChange="handleCurrentChange"
  >
    <template #pager />
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { flyExam } from '/@/api/ftm/student/teachingCenter'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  export default {
    components: { VxeTable },
    data() {
      return {
        form: {},
        loading: false,
        tableData: [],
        tableColumns: [
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          {
            field: 'studentTrainingRecord.student.name',
            title: this.$t('table.name'),
            minWidth: 120,
          },
          {
            field: 'studentTrainingRecord.student.gender',
            title: this.$t('table.gender'),
            width: 80,
            formatter: this.genderFormat,
          },
          {
            field: 'studentTrainingRecord.student.idNumber',
            title: this.$t('table.idNumber'),
            minWidth: 180,
          },
          {
            field: 'studentTrainingRecord.customer.name',
            title: this.$t('table.airlines'),
            minWidth: 100,
          },
          {
            field: 'studentTrainingRecord.clazz.courseNumber',
            title: this.$t('table.classNumber'),
            minWidth: 140,
          },
          {
            field: 'studentTrainingRecord.grouping.name',
            title: this.$t('table.filghtTeam'),
            minWidth: 90,
          },
          {
            field: 'studentTrainingRecord.grouping.teachers',
            title: this.$t('table.flightInstructor'),
            minWidth: 90,
            formatter: this.formatUser,
          },
          {
            field: 'status',
            title: this.$t('table.writeStatus'),
            minWidth: 90,
            formatter: this.statusFormat,
          },
          {
            field: 'type',
            title: this.$t('table.examType'),
            minWidth: 90,
            formatter: this.typeFormat,
          },
          {
            field: 'result',
            title: this.$t('table.examResults'),
            minWidth: 90,
            formatter: this.resultFormat,
          },
          { title: this.$t('table.tableEdit'), width: 120, slots: { default: 'operate' } },
        ],
        qrDialogVisible: false,
        pagination: {
          // 表格分页信息
          page: 1,
          size: 1000,
          total: 0,
        },
        rowData: {},
      }
    },
    created() {
      this.getTableData()
    },
    activated() {
      this.getTableData()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      formatUser({ cellValue }) {
        return cellValue && cellValue.map((v) => v.name)
      },
      qrView(row) {
        this.qrDialogVisible = true
        this.rowData = row
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getTableData()
      },
      // 获取列表
      getTableData() {
        this.loading = true
        let param = {
          page: this.pagination.page,
          size: this.pagination.size,
          searchKey: this.form.searchKey,
          clazzId: this.form.classNumber,
          groupingId: this.form.teamName,
        }
        flyExam(param)
          .then(({ data }) => {
            this.loading = false
            this.tableData = data.content
            this.pagination.total = data.totalElements
          })
          .catch((e) => {
            this.loading = false
          })
      },
      // 格式化性别
      genderFormat({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      // 格式化教员
      teacherFormat({ cellValue }) {
        return cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : ''
      },
      // 格式化填写状态
      statusFormat({ cellValue }) {
        switch (cellValue) {
          case 'FILLED':
            return this.$t('button.filledIn')
          case 'NOT_FILLED':
            return this.$t('button.notFillIn')
          default:
            return ''
        }
      },
      // 格式化考试类型
      typeFormat({ cellValue }) {
        switch (cellValue) {
          case 'NORMAL':
            return this.$t('status.normalTest')
          case 'SUPPLEMENTARY':
            return this.$t('status.makeUpTest')
          default:
            return ''
        }
      },
      // 格式化考试结果
      resultFormat({ cellValue }) {
        switch (cellValue) {
          case 'PASS':
            return this.$t('status.qualified')
          case 'ABORT':
            return this.$t('status.unqualified')
          case 'ADD_ONE':
            return this.$t('status.unqualified')
          case 'ADD_TWO':
            return this.$t('status.unqualified')
          default:
            return ''
        }
      },
      search() {
        this.pagination.page = 1
        this.getTableData()
      },
      tableButtons({ row }) {
        return [
          {
            name:
              row.status == 'FILLED'
                ? row.studentSignature
                  ? this.$t('button.details')
                  : this.$t('button.clickSign')
                : '',
            event: () => {
              this.routerGo(`flightSign/testDetails?id=${row.id}&status=${row.status}`)
            },
          },
        ]
      },
    },
  }
</script>
