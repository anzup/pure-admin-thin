<template>
  <VxeTable v-bind="state.gridOptions">
    <template #form>
      <el-form :model="state.form" ref="headerFormRef" inline class="header-form">
        <el-form-item prop="searchKey">
          <el-input
            v-model="state.form.searchKey"
            :placeholder="$t('text.please_enter_keyword_search')"
          />
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
    </template>

    <template #operate="{ row }">
      <vxe-button
        type="text"
        status="primary"
        :content="$t('message.hsDetail')"
        @click="viewBill(row)"
      />
    </template>
    <template #pager />
  </VxeTable>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, onMounted, toRefs } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { getBillsHistoryList } from '/@/api/opm/contract'
  import useCustomer from '/@/commonTs/customer'

  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'
  import { useGo } from '/@/hooks/usePage'

  const router = useRouter()
  const { t } = useI18n()
  const routerGo = useGo(router)
  const state = reactive({
    gridOptions: {
      columns: [
        { type: 'checkbox', width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'cusromerName',
          title: t('text.customer_name'),
          minWidth: 100,
        },
        {
          field: 'shortName',
          title: t('text.customer_abbreviation'),
          minWidth: 100,
        },
        {
          field: 'code',
          title: t('text.customer_code'),
          minWidth: 100,
        },
        {
          field: 'amount',
          title: t('text.total_bill_amount'),
          minWidth: 100,
        },
        {
          field: 'person',
          title: t('text.total_number_of_trainees'),
          minWidth: 100,
        },

        {
          field: 'lastDate',
          title: t('text.last_billing_time'),
          minWidth: 100,
          formatter: 'formatDate',
        },

        {
          title: t('text.operation'),
          width: 100,
          slots: { default: 'operate' },
          field: 'operationTypes',
          // fixed:'right'
        },
      ],

      data: [],
      loading: false,
    } as VxeGridProps,
    form: {
      searchKey: undefined,
    },
    isShow: false,
    detailId: undefined,
    type: '',
    headerFormRef: null,
  })

  const { customerList, getCustomers } = useCustomer()

  onMounted(async () => {
    await getCustomers()
    getList()
  })

  const getList = async () => {
    state.gridOptions.loading = false
    const [err, res] = await to(getBillsHistoryList(state.form))
    state.gridOptions.loading = false
    if (!err && res.status === 200) {
      const { data } = res
      state.gridOptions.data = data.map((v) => {
        const obj = customerList.value.find((i) => i.id == v.customerId)
        v.cusromerName = obj.name
        v.shortName = obj.shortName
        v.code = obj.code
        return v
      })
    }
  }

  const submit = (val: string) => {
    if (val == 'reset') {
      state.headerFormRef.resetFields()
    }

    getList()
  }

  const viewBill = (row) => {
    routerGo('billList/' + row.customerId)
  }
</script>

<style scoped></style>
