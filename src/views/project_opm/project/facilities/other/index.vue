<template>
  <VxeTable
    v-bind="gridOptions"
    v-model:form="form"
    @action="btnClick"
    @handlePageChange="handlePageChange"
  >
    <!--自定义插槽 toolbar buttons 插槽-->
    <template #toolbar_tools>
      <el-button type="primary" @click="add">{{ $t('message.hsadd') }}</el-button>
      <DiaLog v-model="isShow" :id="detailId" :type="type" @updateData="updateData" />
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, ref, reactive, onMounted } from 'vue'
  import { deleteFacilitiesId, getFacilitiesList } from '/@/api/opm/device'
  import DiaLog from './components/diaLog.vue'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import useResources from '/@/commonTs/resources'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'

  const { t } = useI18n()
  const getButtons = ({ row }) => {
    return (
      !row.builtinResource && [
        {
          name: t('message.modify'),
          type: 'edit',
        },

        {
          name: t('message.hsdelete'),
          type: 'delete',
          status: 'danger',
        },
      ]
    )
  }

  const { getResourcesNormalList, resourcesList } = useResources()
  const formatResource = ({ cellValue }) => {
    return resourcesList.value.find((v) => v.id == cellValue)?.name
  }
  const gridOptions = reactive({
    columns: [
      // { type: "checkbox", width: 50 },
      { type: 'seq', width: 60, title: t('text.seq') },
      {
        field: 'name',
        title: t('text.facility_name'),
        // sortable: true,
        minWidth: 100,
      },
      {
        field: 'resourceId',
        title: t('text.facility_type'),
        // sortable: true,
        minWidth: 100,
        formatter: formatResource,
      },

      {
        // sortable: true,
        field: 'location',
        title: t('text.facility_location'),
        // width:300
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'lastModifiedDate',
        title: t('text.maintenance_time'),
        // width:300
        minWidth: 100,
        formatter: 'formatDateTime',
      },
      {
        // sortable: true,
        field: 'remark',
        title: t('text.remark_information'),
        // width:300
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
    buttons: getButtons,
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
  onMounted(async () => {
    await getResourcesNormalList()

    getList()
  })
  const detailId = ref(undefined)
  const type = ref('')
  const btnClick = ({ type: btnType, row }) => {
    switch (btnType) {
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
    const [err, res] = await to(getFacilitiesList(form))
    gridOptions.loading = false
    if (!err && res.status === 200) {
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
        deleteFacilitiesId(id).then(() => {
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
