<template>
  <div>
    <VxeTable v-bind="gridOptions" v-model:form="form" @action="btnClick">
      <template #toolbar_tools>
        <el-button type="primary" @click="add">{{ $t('message.hsadd') }}</el-button>
      </template>
    </VxeTable>
    <DiaLog v-model:isShow="isShow" :id="detailId" :type="type" @updateData="updateData" />
  </div>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, ref, reactive, onMounted, watch } from 'vue'
  import { deleteResourcesId, getResourcesList } from '/@/api/opm/contract'
  import DiaLog from './components/diaLog.vue'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const formatType = ({ cellValue }) => {
    return cellValue == 'FACILITIES' ? t('text.training_facilities') : t('text.trainer')
  }
  const formatCourseType = ({ cellValue }) => {
    return cellValue == 'WET_LEASE' ? t('text.wet_lease') : t('text.dry_lease')
  }
  const formatUnit = ({ cellValue }) => {
    return cellValue + ' · ' + t('text.hour')
  }
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
  const gridOptions = reactive({
    columns: [
      // { type: "checkbox", width: 50 },
      { type: 'seq', width: 60, title: t('text.seq') },
      {
        field: 'name',
        title: t('text.resource_type_name'),
        // sortable: true,
        minWidth: 100,
      },
      // {
      //     field: "airplaneType",
      //     title: "机型",
      //     // sortable: true,
      //     minWidth: 100,
      // },
      {
        // sortable: true,
        field: 'resourceType',
        title: t('text.resource_type'),
        // width:300
        minWidth: 100,
        formatter: formatType,
      },
      {
        // sortable: true,
        field: 'unit',
        title: t('text.settlement_unit'),
        // width:300
        minWidth: 100,
        formatter: formatUnit,
      },
      {
        // sortable: true,
        field: 'courseType',
        title: t('text.bill_type'),
        // width:300
        minWidth: 100,
        formatter: formatCourseType,
      },
      {
        // sortable: true,
        field: 'remark',
        title: t('text.remarks'),
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
    resourceType: undefined,
  })
  const isShow = ref(false)
  onMounted(() => {
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
  const getList = () => {
    gridOptions.loading = true
    getResourcesList(form).then((res) => {
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
  const deleData = (id: number) => {
    ElMessageBox.confirm(t('tip.this_operation_will_delete_the_selected_data'), {
      type: 'warning',
    })
      .then((res) => {
        deleteResourcesId(id).then((res) => {
          form.page = judgePage(form.total, form)
          ElMessage.success(t('message.delete_succeeded'))
          getList()
        })
      })
      .catch((_) => {})
  }
  watch([() => form.page, () => form.size], ([page, size], [oldPage, oldSize]) => {
    if (size != oldSize) {
      form.page = setPage(form.total, form)
    }
    getList()
  })
</script>

<style scoped></style>
