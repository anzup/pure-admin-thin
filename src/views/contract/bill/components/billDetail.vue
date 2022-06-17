<template>
  <div class="h-full p-4 flex flex-col">
    <div class="h-3/5 pb-4 flex-shrink-0 flex-grow-0">
      <vxe-grid
        :columns="trainingColumn"
        :data="trainingData"
        :mergeCells="mergeCells"
        v-bind="gridOptions"
      >
        <template #form>
          <div class="w-full h-10 bg-system text-white text-center text-base leading-10">
            {{ t('state.trainingBill') }} ({{ dateRange }})
          </div>
        </template>
        <template #bottom>
          <div class="h-9 w-full text-center leading-none p-3">
            {{ t('state.totalAmount') }}: {{ trainingTotalAmount }}
          </div>
        </template>
      </vxe-grid>
    </div>
    <div class="h-2/5 flex-shrink-0 flex-grow-0">
      <vxe-grid :columns="otherColumns" :data="otherData" v-bind="gridOptions">
        <template #form>
          <div class="w-full h-10 bg-system text-white text-center leading-10">
            {{ t('state.otherBills') }} ({{ dateRange }})
          </div>
        </template>
        <template #bottom>
          <div class="h-9 w-full text-center leading-none p-3">
            {{ t('state.totalAmount') }}: {{ otherTotalAmount }}
          </div>
        </template>
      </vxe-grid>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, onMounted, Ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { VxeColumnProps, VxeGridProps } from 'vxe-table'
  import { getBillItemsOther, GetBillItemsWetLease, putBillItem } from '/@/api/bills'
  import { setObjInject } from '/@/injects'
  import dayjs from 'dayjs'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useBill from '/@/hooks/useBill'

  interface Props {
    trainingData: any[]
    mergeCells: any[]
  }

  const props = withDefaults(defineProps<Props>(), {
    trainingData: () => [],
    mergeCells: () => [],
  })

  const { t } = useI18n()
  const gridOptions = $ref<VxeGridProps>({
    height: 'auto',
    columnConfig: {
      minWidth: 150,
    },
  })
  const trainingColumn = $ref<VxeColumnProps[]>([
    {
      type: 'seq',
      width: 50,
      title: t('state.seq'),
    },
    {
      field: 'trainingItemName',
      title: t('state.training_program'),
    },
    {
      field: 'clazzName',
      title: t('state.clazz'),
    },
    {
      field: 'num',
      title: t('state.number_of_trainees'),
    },
    {
      field: 'startDate',
      title: t('state.trainingPeriod'),
      formatter: ({ cellValue, row }) =>
        dayjs(cellValue).format('YYYY-MM-DD') + ' - ' + dayjs(row.endDate).format('YYYY-MM-DD'),
      width: 160,
    },
    {
      field: 'contractNo',
      title: t('state.contractNo'),
    },
    {
      field: 'discount',
      title: t('state.discount'),
    },
    {
      field: 'price',
      title: t('state.unitPrice'),
      formatter: ({ cellValue }) => (cellValue || 0) / 100,
    },
    {
      field: 'discountPrice',
      title: t('state.priceAfterDiscount'),
      formatter: ({ cellValue }) => (cellValue || 0) / 100,
    },
    {
      field: 'realPrice',
      title: t('state.totalSettlementPrice'),
      formatter: ({ cellValue }) => (cellValue || 0) / 100,
    },
    {
      field: 'remark',
      title: t('state.remarks'),
    },
    {
      field: 'operationTypes',
      title: t('state.operation'),
      width: 50,
      cellRender: {
        name: 'buttons',
        props: {
          buttons: [
            {
              name: t('state.remarks'),
              event: ({ row }) => {
                ElMessageBox.prompt(t('tip.please_enter'))
                  .then(({ value }) => {
                    row.remark = value
                    putBillItem({ id: row.id, remark: value }).then((res) => {
                      ElMessage.success(t('message.save_succeeded'))
                    })
                  })
                  .catch(() => {})
              },
            },
          ] as ButtonArr,
        },
      },
    },
  ])

  const { feeTypeMap } = useBill()

  const otherColumns = $ref<VxeColumnProps[]>([
    {
      type: 'seq',
      width: 50,
      title: t('state.seq'),
    },
    {
      field: 'feeType',
      title: t('state.typesOfFee'),
      formatter: ({ cellValue }) => feeTypeMap[cellValue],
    },
    {
      field: 'num',
      title: t('state.quantity'),
    },
    {
      field: 'price',
      title: t('state.unitPrice'),
      formatter: ({ cellValue }) => (cellValue || 0) / 100,
    },
    {
      field: 'realPrice',
      title: t('state.totalSettlementPrice'),
      formatter: ({ cellValue }) => (cellValue || 0) / 100,
    },
    {
      field: 'remark',
      title: t('state.remarks'),
    },
  ])

  const rowData = $(inject<Ref<GetBillItemsWetLease & { billId: number }>>(setObjInject))
  const dateRange = $computed(
    () =>
      dayjs(rowData.startDate).format('YYYY-MM-DD') +
      ' - ' +
      dayjs(rowData.endDate).format('YYYY-MM-DD'),
  )
  let otherData = $ref<any[]>([])

  const trainingTotalAmount = $computed(() => {
    return props.trainingData.reduce((cur, next) => cur + next.realPrice, 0) / 100
  })
  const otherTotalAmount = $computed(() => {
    return otherData.reduce((cur, next) => cur + next.realPrice, 0) / 100
  })

  const getDetailList = () => {
    getBillItemsOther(rowData).then((res) => {
      otherData = res.data
    })
  }

  onMounted(() => {
    getDetailList()
  })
</script>

<style scoped></style>
