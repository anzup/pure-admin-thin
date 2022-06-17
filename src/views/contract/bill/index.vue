<template>
  <div>
    <VxeTable v-model:form="form" v-bind="gridOptions" @handle-page-change="handlePageChange">
      <template #form>
        <div class="flex justify-between">
          <el-form ref="headerFormRef" :model="form" class="header-form" inline>
            <el-form-item prop="searchKey">
              <el-input
                v-model="form.searchKey"
                :placeholder="$t('tip.please_enter')"
                prefix-icon="Search"
              />
            </el-form-item>
            <el-form-item>
              <FormBtn @submit="submit" />
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="showCycleDialog = true"> 结算周期设置</el-button>
        </div>
      </template>
    </VxeTable>
    <CycleDialog v-model="showCycleDialog" @updateData="getList" />
  </div>
</template>

<script lang="ts" setup>
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import VxeTable from '/@/components/Table/index.vue'
  import CycleDialog from './components/cycle.vue'

  import { onActivated, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { setPage } from '/@/utils/utils'
  import { useRouter } from 'vue-router'
  import { getBillsCustomers } from '/@/api/bills'

  const { t } = useI18n()
  const gridOptions = reactive<VxeTableAllProps>({
    height: 'auto',
    columns: [
      {
        type: 'seq',
        width: 50,
        title: t('state.seq'),
      },
      {
        field: 'customer.name',
        title: t('state.customer_name'),
        minWidth: 150,
      },
      {
        field: 'customer.code',
        title: t('state.code'),
      },
      {
        field: 'num',
        title: t('state.total_number_of_trainees'),
      },
      {
        field: 'lastDate',
        title: t('state.last_billing_time'),
        formatter: 'formatDate',
      },

      {
        width: 150,
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
            const { code, id, name, shortName } = row.customer || {}
            router.push({
              path: 'detail',
              query: {
                customerInfo: encodeURI(JSON.stringify({ code, id, name, shortName })),
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

  const form = reactive<PageBase>({
    page: 1,
    size: 10,
    total: 0,
    searchKey: undefined,
  })
  let showCycleDialog = $ref(false)

  const router = useRouter()

  const headerFormRef = ref()
  const submit = (type: string) => {
    if (type == 'reset') {
      headerFormRef.value.resetFields()
    }
    form.page = 1
    getList()
  }

  const getList = () => {
    gridOptions.loading = true
    getBillsCustomers(form).then((res) => {
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

  onActivated(() => {
    getList()
  })
  /*onMounted(() => {
getList()
})*/
</script>
<script lang="ts">
  export default {
    name: 'contractBillIndex',
  }
</script>

<style lang="scss" scoped></style>
