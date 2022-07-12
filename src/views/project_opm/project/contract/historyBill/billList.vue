<template>
  <div>
    <el-descriptions class="margin-top" :column="3" border>
      <el-descriptions-item :label="$t('text.customer_name')">{{
        customersDetail.name
      }}</el-descriptions-item>
      <el-descriptions-item :label="$t('text.customer_abbreviation')">{{
        customersDetail.shortName
      }}</el-descriptions-item>
      <el-descriptions-item :label="$t('text.customer_code')">{{
        customersDetail.code
      }}</el-descriptions-item>
    </el-descriptions>

    <el-divider />
    <VxeTable
      v-bind="state.gridOptions"
      v-model:form="state.form"
      :height="null"
      @action="btnClick"
      @checkbox="checkbox"
      @handle-page-change="handlePageChange"
    >
      <template #toolbar_buttons>
        <div class="header-form">
          <el-form :model="state.form" ref="headerFormRef" inline class="header-form">
            <el-form-item :label="$t('text.billing_year')" prop="year">
              <el-date-picker
                v-model="state.form.year"
                type="year"
                value-format="YYYY"
                :placeholder="$t('text.select_year')"
                :clearable="false"
              />
            </el-form-item>
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
        </div>
      </template>

      <template #toolbar_tools>
        <el-button type="primary" :disabled="checkList.length == 0" @click="batchPrint">{{
          $t('text.batch_printing')
        }}</el-button>
      </template>
    </VxeTable>
    <div class="print_container">
      <Print ref="printRef" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { ref, reactive, onMounted, computed, useAttrs } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { getBillsList, putBillsRemark } from '/@/api/opm/contract'
  import { getCustomersDetail } from '/@/api/opm/customer'

  import { setPage } from '/@/utils/utils'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessageBox } from 'element-plus'
  import { useAppStoreHook } from '/@/store/modules/app'
  import dayjs from 'dayjs'
  import Print from './components/print.vue'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'

  const props = defineProps({
    courseType: String,
    customerId: [Number],
  })
  const attrs = useAttrs()
  const { t } = useI18n()
  const formatDateRange = ({ row }) =>
    dayjs(row.startDate).format('YYYY-MM-DD') + ' - ' + dayjs(row.endDate).format('YYYY-MM-DD')

  const appStore = useAppStoreHook()
  const tableHeight = computed<number>(() => appStore.appHeight - 132)

  const printRef = ref()

  const router = useRouter(),
    route = useRoute()
  const state = reactive({
    gridOptions: {
      isTabs: attrs.isTabs,
      columns: [
        { type: 'checkbox', width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'year',
          title: t('text.billing_year'),
          minWidth: 100,
          formatter: () => state.form.year,
        },
        {
          field: 'startDate',
          title: t('text.billing_period'),
          minWidth: 100,
          formatter: formatDateRange,
        },
        {
          field: 'amount',
          title: t('text.total_bill_amount'),
          minWidth: 100,
        },
        {
          field: 'wetAmount',
          title: t('text.wet_rent_amount'),
          minWidth: 100,
        },
        {
          field: 'dryAmount',
          title: t('text.dry_rent_amount'),
          minWidth: 100,
        },
        {
          field: 'person',
          title: t('text.number_of_trainees'),
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
          name: t('message.hsDetail'),
          type: 'detail',
        },
        {
          name: t('text.print'),
          type: 'print',
        },

        {
          name: t('text.add_notes'),
          type: 'remark',
        },
      ],
      toolbarConfig: {
        // custom: true,
        slots: {
          buttons: 'toolbar_buttons',
          tools: 'toolbar_tools',
        },
      },
      loading: false,
    } as VxeGridProps,
    form: {
      page: 1,
      size: 10,
      total: 0,
      customerId: route.params.id,
      searchKey: undefined,
      settled: true,
      year: dayjs().year() + '',
    },
    isShow: false,

    headerFormRef: null,
  })
  const customersDetail = reactive({
    name: undefined,
    shortName: undefined,
    code: undefined,
  })

  const getList = async () => {
    state.gridOptions.loading = true
    const [err, res] = await to(getBillsList(state.form))
    state.gridOptions.loading = false
    if (!err && res.status === 200) {
      const {
        data: { content, totalElements },
      } = res
      state.gridOptions.data = content
      state.form.total = totalElements
    }
  }

  const submit = (val: string) => {
    if (val == 'reset') {
      state.headerFormRef.resetFields()
    }
    state.form.page = 1
    getList()
  }

  const btnClick = ({ row, type }) => {
    switch (type) {
      case 'remark':
        // state.isShow=true
        // router.push({
        //     path: "print",
        // });
        ElMessageBox.prompt(undefined, t('text.add_notes'), {
          inputType: 'textarea',
        })
          .then(({ action, value }) => {
            putBillsRemark({
              id: row.id,
              data: {
                value,
              },
            }).then((res) => {
              getList()
            })
          })
          .catch((_) => {})

        break

      case 'detail':
        router.push({
          path: '/contract/historicalBills/detail/' + row.id,
        })
        break
      case 'print':
        printRef.value.getDetail([row.id])
        break
    }
  }
  const checkList = ref([])
  const checkbox = ({ ids }) => {
    checkList.value = ids
  }
  const batchPrint = () => {
    printRef.value.getDetail(checkList.value)
  }

  onMounted(async () => {
    getCustomersDetail(route.params.id).then((res) => {
      const {
        data: { name, shortName, code },
      } = res
      customersDetail.name = name
      customersDetail.shortName = shortName
      customersDetail.code = code
    })

    getList()
  })

  const handlePageChange = (val) => {
    if (val.type == 'size') {
      state.form.page = setPage(state.form.total, state.form)
    }
    getList()
  }
</script>

<style scoped lang="scss">
  .info-table {
    padding: 10px;
  }
  .print_container {
    height: 0;
    overflow: hidden;
    display: none;
  }
</style>
