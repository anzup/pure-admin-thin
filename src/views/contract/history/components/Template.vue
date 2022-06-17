<template>
  <VxeTable v-model:form="form" v-bind="gridOptions" @handle-page-change="handlePageChange">
    <template #form>
      <el-form ref="headerFormRef" :model="form" class="header-form" inline>
        <el-form-item prop="customerTypeId">
          <el-select v-model="form.customerTypeId" :placeholder="$t('tip.please_select')">
            <el-option
              v-for="(item, index) in customerList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchKey">
          <el-input
            v-model="form.searchKey"
            :placeholder="$t('tip.please_enter')"
            prefix-icon="Search"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import VxeTable from '/@/components/Table/index.vue'

  import { onActivated, onMounted, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import useCustomers from '/@/hooks/customer'
  import { GetContracts, getContractsHistory } from '/@/api/contaract'
  import { judgePage, setPage } from '/@/utils/utils'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()
  const props = defineProps({
    contractType: String as PropType<'TRAINING' | 'OTHER'>,
  })
  const gridOptions = reactive<VxeTableAllProps>({
    height: 'auto',
    columns: [
      {
        type: 'seq',
        width: 50,
        title: t('state.seq'),
      },
      {
        field: 'contractNo',
        title: t('state.contract_no'),
        minWidth: 150,
      },
      {
        field: 'contractName',
        title: t('state.contractName'),
        minWidth: 150,
      },
      {
        field: 'customerName',
        title: t('state.customer_name'),
        minWidth: 150,
      },
      {
        field: 'operatorName',
        title: t('state.handler'),
        width: 100,
      },
      {
        field: 'signerName',
        title: t('state.signatory'),
        width: 100,
      },
      {
        field: 'createdDate',
        title: t('state.signing_time'),
        formatter: 'formatDateTime',
        width: 130,
      },
      {
        field: 'endDate',
        title: t('state.dueDate'),
        formatter: 'formatDate',
        width: 130,
      },
      {
        field: 'autoRenew',
        title: t('state.autoRenew'),
        formatter: 'formatBool',
        width: 70,
      },

      // {
      //   field: 'remark',
      //   title: t('state.remarks'),
      //   // width: 300

      // },
      {
        width: 60,
        field: 'operationTypes',
        title: t('state.operation'),
        slots: {
          default: 'operate',
        },
      },
    ],

    data: [],
    buttons: ({ row }) => {
      return [
        {
          name: t('buttons.hsDetail'),
          event: () => {
            router.push({
              path: 'detail',
              query: {
                id: row.id,
                contractType: props.contractType,
              },
            })
          },
        },
      ]
    },
    columnConfig: {
      minWidth: 200,
    },
  })

  const form = reactive<GetContracts>({
    page: 1,
    size: 10,
    total: 0,
    customerTypeId: undefined,
    contractType: props.contractType,
  })

  const router = useRouter()

  // const toPath = (id?: number) => {
  //   router.push({
  //     path: id ? 'edit' : 'add',
  //     query: {
  //       id,
  //       contractType: props.contractType
  //     }
  //   })
  // }

  const { getCustomers, customerList } = useCustomers()

  const headerFormRef = ref()
  const submit = (type: string) => {
    if (type == 'reset') {
      headerFormRef.value.resetFields()
    }
    form.page = 1
    getList()
  }

  const getList = () => {
    // gridOptions.loading = true
    getContractsHistory(form).then((res) => {
      gridOptions.data = res.data.content
      form.total = res.data.totalElements
      gridOptions.loading = false
    })
  }
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      form.page = setPage(form.total, form)
    }
    getList()
  }

  onActivated(async () => {
    getCustomers()
    getList()
  })
</script>
<script lang="ts">
  export default {
    name: 'contractHistoryIndex',
  }
</script>

<style lang="scss" scoped></style>
