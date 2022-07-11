<template>
  <div>
    <VxeTable
      v-bind="gridOptions"
      v-model:form="form"
      @action="btnClick"
      @handlePageChange="handlePageChange"
    >
      <!--自定义插槽 toolbar buttons 插槽-->
      <template #toolbar_tools>
        <el-button type="primary" @click="add">{{ $t('message.hsadd') }}</el-button>
      </template>
    </VxeTable>
    <DiaLog v-model:isShow="isShow" :id="detailId" :type="type" @updateData="updateData" />
  </div>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, ref, reactive, onMounted } from 'vue'
  import { deleteRolesId, getRolesList } from '/@/api/opm/roles'
  import DiaLog from './components/diaLog.vue'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'

  export default defineComponent({
    components: {
      VxeTable,
      DiaLog,
    },
    setup() {
      const { t } = useI18n()
      const gridOptions = reactive({
        columns: [
          // { type: "checkbox", width: 50 },
          { type: 'seq', width: 60, title: t('text.seq') },
          {
            field: 'name',
            title: t('text.job_title'),
            // sortable: true,
            minWidth: 100,
          },
          {
            // sortable: true,
            field: 'decription',
            title: t('text.job_description'),
            // width:300
            minWidth: 100,
          },
          {
            // sortable: true,
            field: 'staffNum',
            title: t('text.number_of_positions'),
            minWidth: 100,
          },
          {
            title: t('text.operation'),
            width: 200,
            slots: { default: 'operate' },
            field: 'operationTypes',
            // fixed:'right'
          },
        ],

        data: [],
        buttons: [
          {
            name: t('text.jurisdiction'),
            type: 'permission',
          },
          {
            name: t('message.modify'),
            type: 'edit',
          },

          {
            name: t('message.hsdelete'),
            type: 'delete',
            status: 'danger',
          },
        ],
        toolbarConfig: {
          // custom: true,
          size: 'medium',
          perfect: true,
          slots: {
            tools: 'toolbar_tools',
          },
        },
        loading: false,
      } as VxeGridProps)
      const form = reactive({
        page: 1,
        size: 10,
        total: 0,
      })
      const isShow = ref(false)
      onMounted(() => {
        getList()
      })

      const detailId = ref(undefined)
      const type = ref('')
      const btnClick = ({ type: btnType, row }) => {
        switch (btnType) {
          case 'permission':
            break
          case 'edit':
            isShow.value = true
            type.value = btnType
            detailId.value = row.id
            break

          default:
            deleData(row.id)
            break
        }
      }
      const getList = async () => {
        gridOptions.loading = true
        const [err, res] = await to(getRolesList(form))
        gridOptions.loading = false
        if (!err && res.status == 200) {
          const {
            data: { content, totalElements },
          } = res
          gridOptions.data = content
          form.total = totalElements
        }
      }
      const add = () => {
        isShow.value = true
        type.value = 'add'
        detailId.value = undefined
      }
      const updateData = () => {
        getList()
      }
      const deleData = (id: number) => {
        ElMessageBox.confirm(t('tip.this_operation_will_delete_the_selected_data'), {
          type: 'warning',
        })
          .then(() => {
            deleteRolesId(id).then(() => {
              form.page = judgePage(form.total, form)
              ElMessage.success(t('message.delete_succeeded'))
              getList()
            })
          })
          .catch((_) => {})
      }
      const handlePageChange = (val) => {
        if (val.type == 'size') {
          form.page = setPage(form.total, form)
        }
        getList()
      }
      return {
        gridOptions,
        form,
        btnClick,
        isShow,
        add,
        type,
        detailId,
        updateData,
        handlePageChange,
      }
    },
  })
</script>

<style scoped></style>
