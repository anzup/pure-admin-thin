<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :toolbar-config="tableTools"
    :span-method="rowspanMethod"
  >
    <template #pager />
    <template #behavior="{ row }">
      <span>{{ row.evaluationCode }} {{ row.evaluationName }}</span>
    </template>
  </VxeTable>
</template>

<script>
  import Api from '/@/api/ftm/teacher/trainEva'
  import VxeTable from '/@/components/Table/index.vue'
  export default {
    data() {
      return {
        menuName: 'EVALUATION',
        form: {
          studentId: null,
          clazzId: null,
        },
        loading: false,
        total: 1,
        allAlign: null,
        tableData: [],
        tableTools: {
          enabled: false,
          slots: {},
        },
        tableColumns: [
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.evaluationCoreCompetenceProj'), minWidth: 90 },
          // { field: "code", title: this.$t('table.indicatorsCode'), minWidth: 80 },
          {
            title: this.$t('table.noPassBehavioralIndicators'),
            minWidth: 200,
            slots: { default: 'behavior' },
          },
          { field: 'count', title: this.$t('table.appearTimes'), width: 80 },
          { field: 'course', title: this.$t('table.appearCourse'), minWidth: 90 },
        ],
      }
    },
    props: {
      details: Object,
      clazz: Object,
    },
    mounted() {
      this.getEvaluations()
    },
    components: {
      VxeTable,
    },
    methods: {
      // 通用行合并函数（将相同多列数据合并为一行）
      rowspanMethod({ row, _rowIndex, column, visibleData }) {
        const fields = ['name']
        const cellValue = row[column.property]
        if (cellValue && fields.includes(column.property)) {
          const prevRow = visibleData[_rowIndex - 1]
          let nextRow = visibleData[_rowIndex + 1]
          if (prevRow && prevRow[column.property] === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[column.property] === cellValue) {
              nextRow = visibleData[++countRowspan + _rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      },
      getEvaluations() {
        let params = {
          studentId: this.details.id,
          clazzId: this.clazz.id,
        }
        this.loading = true
        Api.evaluationStatistics(params)
          .then((res) => {
            if (res.status == 200) {
              this.tableData = res.data
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
    },
  }
</script>

<style scoped></style>
