<template>
  <VxeTable
    v-bind="state.gridOptions"
    v-model:form="state.form"
    @action="btnClick"
    @handle-page-change="handlePageChange"
  >
    <template #form>
      <el-form :model="state.form" ref="headerFormRef" inline class="header-form">
        <el-form-item :label="$t('text.customer_name')" prop="customerId">
          <el-select
            clearable
            v-model="state.form.customerId"
            :placeholder="$t('text.please_select')"
          >
            <el-option
              v-for="item in state.typeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchKey">
          <el-input v-model="state.form.searchKey" :placeholder="$t('text.please_enter')" />
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
    </template>
    <!--自定义插槽 toolbar buttons 插槽-->
    <template #toolbar_tools>
      <el-button type="primary" @click="add">{{ $t('message.hsadd') }}</el-button>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { reactive, onMounted } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { deleteContractsId, getContractsList } from '/@/api/opm/contract'
  import { getCustomersAll } from '/@/api/opm/customer'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useGo } from '/@/hooks/usePage'
  import to from 'await-to-js'

  const props = defineProps({
    valid: {
      type: Boolean,
      default: true,
    },
  })

  const router = useRouter()
  const route = useRoute()
  const routerGo = useGo(router)
  const formatCustomer = ({ cellValue }) => {
    return state.typeList.find((v) => v.id == cellValue)?.name
  }
  const { t } = useI18n()
  const getButtons = ({ row }) => {
    if (props.valid) {
      return [
        {
          name: t('text.supplementary_provisions'),
          type: 'supplement',
        },
        {
          name: t('message.hsDetail'),
          type: 'detail',
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
      ]
    } else {
      return [
        {
          name: t('message.hsDetail'),
          type: 'detail',
        },
      ]
    }
  }
  const state = reactive({
    typeList: [],
    gridOptions: {
      columns: [
        // { type: "checkbox", width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'contractNo',
          title: t('text.contract_no'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'customerId',
          title: t('text.customer_name'),
          // sortable: true,
          minWidth: 100,
          formatter: formatCustomer,
        },

        {
          field: 'createdDate',
          title: t('text.signing_time'),
          minWidth: 100,
          formatter: 'formatDateTime',
        },
        {
          field: 'lastModifiedDate',
          title: t('text.last_maintenance_time'),
          minWidth: 100,
          formatter: 'formatDateTime',
        },
        {
          title: t('text.operation'),
          width: 250,
          slots: { default: 'operate' },
          field: 'operationTypes',
          // fixed:'right'
        },
      ],

      data: [],
      buttons: getButtons,
      toolbarConfig: props.valid
        ? {
            // custom: true,
            size: 'medium',
            perfect: true,
            slots: {
              tools: 'toolbar_tools',
            },
          }
        : undefined,
      loading: false,
    } as VxeGridProps,
    form: {
      page: 1,
      size: 10,
      total: 0,
      customerId: undefined,
      searchKey: undefined,
      valid: props.valid,
    },

    headerFormRef: null,
  })
  if (route.query.id) {
    state.form.customerId = +route.query.id
  }
  onMounted(async () => {
    await getTypeList()
    getList()
  })

  const btnClick = ({ type: btnType, row }) => {
    switch (btnType) {
      case 'edit':
        routerGo(row.id + '/edit')
        break
      case 'detail':
        routerGo(row.id + '/detail')
        break
      case 'supplement':
        routerGo(row.id + '/supplement')
        break

      default:
        deleData(row.id)
        break
    }
  }
  const getList = async () => {
    state.gridOptions.loading = true
    const [err, res] = await to(getContractsList(state.form))
    state.gridOptions.loading = false
    if (!err && res.status == 200) {
      const {
        data: { content, totalElements },
      } = res
      state.gridOptions.data = content
      state.form.total = totalElements
    }
  }
  const add = () => {
    router.push({
      path: 'add',
    })
    // state.isShow = true;
    // state.type = "add";
    // state.detailId = undefined;
  }
  const updateData = () => {
    getList()
  }
  const deleData = (id: number) => {
    ElMessageBox.confirm(t('tip.this_operation_will_delete_the_selected_data'), {
      type: 'warning',
    })
      .then((res) => {
        deleteContractsId(id).then((res) => {
          state.form.page = judgePage(state.form.total, state.form)
          ElMessage.success(t('message.delete_succeeded'))
          getList()
        })
      })
      .catch((_) => {})
  }
  const getTypeList = async () => {
    const { data } = await getCustomersAll()
    state.typeList = data
  }
  const submit = (val: string) => {
    if (val == 'reset') {
      state.headerFormRef.resetFields()
    }
    state.form.page = 1
    getList()
  }
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      state.form.page = setPage(state.form.total, state.form)
    }
    getList()
  }
</script>

<style scoped></style>
