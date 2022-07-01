<template>
  <VxeTable
    v-model:form="form"
    v-bind="gridOptions"
    @action="btnClick"
    @handlePageChange="handlePageChange"
  >
    <!--自定义插槽 toolbar buttons 插槽-->
    <template #toolbar_tools>
      <div class="px-4">
        <el-button type="primary" @click="add">{{ $t('buttons.hsAdd') }}</el-button>
        <DiaLog :id="detailId" v-model:isShow="isShow" :type="type" @updateData="updateData" />
      </div>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { onMounted, reactive, ref } from 'vue'
  import { deleteRolesId, getRolesList } from '/@/api/roles'
  import DiaLog from './components/Dialog.vue'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from '/@/hooks/useI18n'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()

  const gridOptions = reactive<VxeTableAllProps>({
    height: 'auto',
    columns: [
      // { type: "checkbox", width: 50 },
      { type: 'seq', width: 60, title: t('state.seq') },
      {
        field: 'name',
        title: t('state.positionName'),
        // sortable: true,
        minWidth: 100,
      },
      {
        title: t('state.operation'),
        width: 200,
        slots: { default: 'operate' },
        field: 'operationTypes',
        // fixed:'right'
      },
    ],

    data: [],
    buttons: ({ row }) => [
      {
        name: t('buttons.modify'),
        type: 'edit',
      },
      {
        name: t('buttons.hsDelete'),
        type: 'delete',
        status: 'danger',
        disabled: row.builtin,
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
  })
  const form = reactive({
    page: 1,
    size: 10,
    total: 0,
    builtinRoleNI: 'STUDENT',
  })
  const isShow = ref(false)
  onMounted(() => {
    getList()
  })
  const router = useRouter()
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
      case 'competence':
        router.push({
          path: '/user/roles/competence',
          query: {
            id: row.id,
          },
        })
        break

      default:
        deleteData(row.id)
        break
    }
  }
  const getList = () => {
    gridOptions.loading = true
    getRolesList(form).then((res) => {
      const {
        data: { content, totalElements },
      } = res
      gridOptions.data = content
      form.total = totalElements
      gridOptions.loading = false
    })
  }
  const add = () => {
    isShow.value = true
    type.value = 'add'
    detailId.value = undefined
  }
  const updateData = () => {
    getList()
  }
  const deleteData = (id: number) => {
    ElMessageBox.confirm(t('tip.deleteTheSelectedData'), {
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
</script>

<style scoped></style>
