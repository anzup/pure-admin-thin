<template>
  <VxeTable :data="tableData" :loading="loading" :columns="tableColumns" :buttons="tableButtons">
    <template #pager />
    <template #coursewareFinishTask="{ row }">
      <span>{{ row.coursewareFinishTask + ' / ' + row.coursewareAllTask }}</span>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { flyTrainEva } from '/@/api/ftm/student/teachingCenter'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import XEUtils from 'xe-utils'
  export default {
    name: 'cusotm',
    components: { VxeTable },
    data() {
      return {
        loading: false,
        tableData: [], // 学员列表
        tableColumns: [
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          {
            field: 'studentTrainingRecord.clazz.course.code',
            title: this.$t('table.courseClass'),
            minWidth: 90,
          },
          {
            field: 'studentTrainingRecord.clazz.course.airplaneTypes',
            title: this.$t('table.trainingModel'),
            minWidth: 120,
            formatter: this.arrFormat,
          },
          { field: 'name', title: this.$t('table.flightTrainingMission'), minWidth: 180 },
          {
            field: 'status',
            title: this.$t('table.writeStatus'),
            minWidth: 100,
            formatter: this.fillFormat,
          },
          {
            field: 'studentSignature',
            title: this.$t('table.signatureStatus'),
            minWidth: 100,
            formatter: this.isFill,
          },
          {
            field: 'studentSignTime',
            title: this.$t('table.confirmTime'),
            minWidth: 200,
            formatter: this.dateFormat,
          },
          {
            field: 'type',
            title: this.$t('table.sessionType'),
            formatter: this.typeFormat,
            minWidth: 100,
          },
          {
            field: 'coursewareFinishTask',
            title: this.$t('table.AssignCoursewareTask'),
            minWidth: 160,
            slots: { default: 'coursewareFinishTask' },
          },
          { title: this.$t('table.operation'), minWidth: 200, slots: { default: 'operate' } },
        ],
        pagination: {
          // 表格分页信息
          page: 1,
          size: 1000,
          total: 0,
        },
      }
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      seqMethod(row) {
        return (this.pagination.page - 1) * this.pagination.size + row.seq
      },
      handleSizeChange(val) {
        this.pagination.size = val
        let page = this.pagination.page
        let total = this.pagination.total
        if ((page / val) % 1 == 0) {
          this.pagination.page = total / val
        } else {
          this.pagination.page = parseInt(total / val) + 1
        }
        this.getTableData()
      },
      handleCurrentChange(e) {
        this.pagination.page = e
        this.getTableData()
      },
      checkboxOne({ records }) {
        console.log(records, '选择一行')
      },
      checkboxAll({ records }) {
        console.log(records, '全选')
      },
      // 格式化状态
      fillFormat({ cellValue }) {
        switch (cellValue) {
          case 'NOT_FILLED':
            return this.$t('button.notFillIn')
          case 'FILLED':
            return this.$t('button.filledIn')
          default:
            return ''
        }
      },
      // 格式化机型
      arrFormat({ cellValue }) {
        return (cellValue instanceof Array && cellValue.join(',')) || ''
      },
      dateFormat({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
      },
      // 是否填写签名
      isFill({ cellValue = '' }) {
        return (
          (cellValue && cellValue.toString().length > 0 && this.$t('status.signed')) ||
          this.$t('status.notSign')
        )
      },
      // 场次类型
      typeFormat({ cellValue }) {
        switch (cellValue) {
          case 'ADDITIONAL':
            return this.$t('table.additional')
          case 'NORMAL':
            return this.$t('table.normalSession')
          default:
            return ''
        }
      },
      async getTableData() {
        let params = {
          page: this.pagination.page,
          size: this.pagination.size,
        }
        this.loading = true
        let { data } = await flyTrainEva(params).catch((e) => {
          this.loading = false
        })
        this.loading = false
        this.tableData = data.content
        this.pagination.total = data.totalElements
      },
      tableButtons({ row }) {
        return [
          {
            name:
              row.status == 'FILLED' && !row.studentSignature
                ? this.$t('button.sign')
                : this.$t('button.view'),
            event: () => {
              this.routerGo(`flightSign/details?id=${row.id}`)
            },
          },
          {
            name: this.$t('router.readingTask'),
            event: () => {
              this.routerGo(`flightSign/coursewareReadingTask?id=${row.id}`)
            },
          },
        ]
      },
    },
    mounted() {
      this.getTableData()
    },
    activated() {
      this.getTableData()
    },
  }
</script>
