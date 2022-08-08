<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :buttons="tableButtons"
    :toolbar-config="tableTools"
    v-model:form="form"
    :span-method="rowspanMethod"
    @handlePageChange="handleCurrentChange"
  >
    <template #right_tools>
      <el-button
        v-if="containsPermissions(menuName + ':ADD')"
        type="primary"
        size="mini"
        @click="add"
        >{{ $t('button.add') }}</el-button
      >
    </template>
  </VxeTable>

  <!-- 评价内容dialog -->
  <add-dialog
    :evaluationsDialog="evaluationsDialog"
    :evaluationsId="evaluationsId"
    @cancelDialog="cancelDialog"
    @getData="getEvaluations"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import addDialog from './addDialog2.vue'
  import { getEvaluations, deleteEvaluationsId } from '/@/api/ftm/teacher/teachingPlan'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        menuName: 'EVALUATION',
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: undefined,
          order: 'asc',
          searchKey: undefined,
        },
        loading: true,
        allAlign: null,
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          {
            field: 'superior.name',
            title: this.$t('table.evaluationCoreCompetenceProj'),
            width: 200,
          },
          { field: 'code', title: this.$t('table.indicatorsCode'), width: 160 },
          { field: 'name', title: this.$t('table.behavioralIndicators'), minWidth: 100 },
          { title: this.$t('table.tableEdit'), width: 140, slots: { default: 'operate' } },
        ],
        evaluationsDialog: false,
        evaluationsId: undefined,
      }
    },
    mounted() {
      this.getEvaluations()
    },
    components: {
      VxeTable,
      addDialog,
    },
    methods: {
      // 通用行合并函数（将相同多列数据合并为一行）
      rowspanMethod({ row, _rowIndex, column, visibleData }) {
        const fields = ['superior.name']
        const cellValue = row.superior.name
        if (cellValue && fields.includes(column.property)) {
          const prevRow = visibleData[_rowIndex - 1]
          let nextRow = visibleData[_rowIndex + 1]
          if (prevRow && prevRow.superior.name === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && nextRow.superior.name === cellValue) {
              nextRow = visibleData[++countRowspan + _rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getEvaluations()
      },
      add() {
        this.evaluationsDialog = true
      },
      getEvaluations() {
        let params = {
          level: 1,
          sort: 'superior.seq,superior.id,seq,id',
          page: this.form.page,
          size: this.form.size,
        }
        this.loading = true
        getEvaluations(params)
          .then((res) => {
            if (res.status == 200) {
              this.tableData = res.data.content
              this.form.total = res.data.totalElements
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      },
      modify(id) {
        this.evaluationsDialog = true
        this.evaluationsId = id
      },
      deleteEvaluationsId(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteEvaluationsId({ id: id }).then((res) => {
            if (res.status == 200) {
              if (
                parseInt(this.form.total / this.form.size) < this.form.page &&
                this.form.page !== 1
              ) {
                this.form.page = parseInt(this.form.total / this.form.size)
              }
              this.$message.success(this.$t('tip.delsuccessTip'))
              this.getEvaluations()
            }
          })
        })
      },
      cancelDialog() {
        this.evaluationsDialog = false
        this.evaluationsId = undefined
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.modify'),
            visible: userStore.ContainsPermissions(this.menuName + ':UPDATE'),
            event: () => {
              this.modify(row.id)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: userStore.ContainsPermissions(this.menuName + ':DELETE'),
            event: () => {
              this.deleteEvaluationsId(row.id)
            },
          },
        ]
      },
    },
  }
</script>
