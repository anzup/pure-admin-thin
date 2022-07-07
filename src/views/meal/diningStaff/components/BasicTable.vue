<template>
  <VxeTable
    v-model:form="form"
    :columns="getColumns"
    class="mt-2"
    v-bind="gridOptions"
    @handlePageChange="handlePageChange"
  />
</template>
<script lang="ts" setup>
  import type { VxeColumnProps, VxeGridProps } from 'vxe-table'
  import { computed, reactive, watch } from 'vue'
  import { useI18n } from '/@/hooks/useI18n'
  import { getTransactionRecordsList, TransactionRecords } from '/@/api/transactionRecords'
  import { useRoute } from 'vue-router'
  import { transactionTypeEnum } from '/@/enums/transactionTypeEnum'
  import { payMethodEnum } from '/@/enums/payMethodEnum'
  import { Balances, getBalancesList } from '/@/api/balances'
  import VxeTable from '/@/components/Table/index.vue'
  import { setPage } from '/@/utils/utils'
  import dayjs from 'dayjs'
  import { usePayMethod } from '/@/hooks/useEnumToMap'

  export interface Props {
    type: string
  }

  // eslint-disable-next-line vue/no-setup-props-destructure
  const { type } = defineProps<Props>()

  const { t } = useI18n()

  const gridOptions = reactive<VxeGridProps>({
    height: 500,
    data: [],
  })

  const { payMethodMap } = usePayMethod()
  const getColumns = computed<VxeColumnProps[]>(() => {
    switch (type) {
      case payMethodEnum.COUNT:
        return [
          {
            type: 'seq',
            width: 50,
            title: t('state.seq'),
          },
          {
            field: 'countConfig.name',
            title: t('state.mealManner'),
          },
          {
            field: 'amount',
            title: t('state.frequency'),
          },
          {
            field: 'startTime',
            title: t('state.validityPeriod'),
            formatter: ({ cellValue, row }) => {
              return (
                dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') +
                ' - ' +
                dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss')
              )
            },
          },
        ]
      case payMethodEnum.BALANCE:
        return [
          {
            type: 'seq',
            width: 50,
            title: t('state.seq'),
          },
          {
            field: 'amount',
            title: t('state.sum'),
          },
          {
            field: 'startTime',
            title: t('state.validityPeriod'),
            formatter: ({ cellValue, row }) => {
              return (
                dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') +
                ' - ' +
                dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss')
              )
            },
          },
        ]
      case transactionTypeEnum.CHARGE:
        return [
          {
            type: 'seq',
            width: 50,
            title: t('state.seq'),
          },
          {
            field: 'balance.type',
            title: t('state.rechargeType'),
            formatter: ({ cellValue }) => payMethodMap[cellValue] ?? '',
          },
          {
            field: 'amount',
            title: t('state.rechargeAmount'),
          },
          {
            field: 'creator',
            title: t('state.operator'),
          },
          {
            title: t('state.rechargeTime'),
            field: 'createdDate',
            formatter: 'formatDateTime',
          },
          {
            field: 'remark',
            title: t('state.remark'),
          },
        ]
      case transactionTypeEnum.CONSUME:
        return [
          {
            type: 'seq',
            width: 50,
            title: t('state.seq'),
          },
          {
            field: 'canteen.name',
            title: t('state.restaurantName'),
          },
          {
            field: 'mealTime.name',
            title: t('state.meal'),
          },
          {
            field: 'balance.type',
            title: t('state.mealManner'),
            formatter: ({ cellValue }) => payMethodMap[cellValue] ?? '',
          },
          {
            field: 'amount',
            title: t('state.amount'),
          },
          {
            field: 'createdDate',
            title: t('state.usageTime'),
            formatter: 'formatDateTime',
          },
        ]
      default:
        return []
    }
  })

  let form = $ref<TransactionRecords & Balances>({
    size: 10,
    page: 1,
    total: 0,
  })

  const route = useRoute()

  const getTransactionRecords = () => {
    gridOptions.data = []
    gridOptions.loading = true
    form.userId = +route.params?.id
    form.transactionType = type as any
    getTransactionRecordsList(form).then((res) => {
      gridOptions.data = res.data.content
      form.total = res.data.totalElements
      gridOptions.loading = false
    })
  }
  const getBalances = () => {
    form.type = type as any
    gridOptions.data = []
    gridOptions.loading = true
    form.userId = +route.params?.id
    getBalancesList(form).then((res) => {
      gridOptions.data = res.data.content
      form.total = res.data.totalElements
      gridOptions.loading = false
    })
  }
  const getList = () => {
    if (type in transactionTypeEnum) {
      getTransactionRecords()
    } else {
      getBalances()
    }
  }
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      form.page = setPage(form.total, form)
    }
    getList()
  }
  watch(
    $$(type),
    () => {
      form = {
        page: 1,
        size: 10,
        total: 0,
      }
      getList()
    },
    {
      immediate: true,
    },
  )
</script>
