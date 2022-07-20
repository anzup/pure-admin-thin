<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :toolbar-config="tableTools"
    v-model:form="form"
    @handlePageChange="handleCurrentChange"
  >
    <template #right_tools>
      <!--TODO 按钮权限-->
      <!--v-permission="menuName + ':ADD'"-->
      <el-button type="primary" size="mini" @click="add">{{ $t('button.add') }}</el-button>
    </template>

    <template #edit="{ row }">
      <div class="button-line">
        <span class="buttonEdit" @click="modify(row.id)" v-permission="menuName + ':UPDATE'">{{
          $t('button.modify')
        }}</span>
        <span
          class="buttonDelete"
          @click="deleteEvaluationsId(row.id)"
          v-permission="menuName + ':DELETE'"
          >{{ $t('button.delete') }}</span
        >
      </div>
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
  import addDialog from './addDialog.vue'
  import { getEvaluations, deleteEvaluationsId } from '/@/api/ftm/teacher/teachingPlan'
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
          { field: 'name', title: this.$t('table.flightEvaluationContent'), minWidth: 200 },
          { field: 'seq', width: 100, title: this.$t('table.sort') },
          { field: 'normalScore', title: this.$t('table.normalScore'), width: 100 },
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
          level: 0,
          page: this.form.page,
          size: this.form.size,
          sort: 'seq,id',
          order: 'asc,asc',
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
    },
  }
</script>

<style scoped></style>
