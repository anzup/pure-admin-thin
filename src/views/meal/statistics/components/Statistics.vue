<template>
  <Table v-bind="gridOptions" @cell-click="onClickDetail">
    <template #form>
      <el-form ref="headerFormRef" :model="form" class="header-form" inline>
        <el-form-item prop="prohibited">
          <el-date-picker
            v-model="form.dateRange"
            :clearable="false"
            type="daterange"
            @change="getList"
          />
        </el-form-item>
      </el-form>
    </template>
    <!--<template #line="{}">-->
    <!--  -->
    <!--</template>-->
  </Table>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import Table from '/@/components/Table/index.vue'
  import type { VxeGridProps, VxeTableDefines } from 'vxe-table'
  import { useI18n } from '/@/hooks/useI18n'
  import { getTransactionRecordStates, TransactionRecords } from '/@/api/transactionRecords'
  import { transactionTypeEnum } from '/@/enums/transactionTypeEnum'
  import dayjs from 'dayjs'
  import { usePayMethod } from '/@/hooks/useEnumToMap'
  import { payMethodEnum } from '/@/enums/payMethodEnum'
  import { setDetailChange } from '/@/views/meal/statistics/ts/detailChange'
  import { VxeGridEvents } from 'vxe-table'

  const emits = defineEmits<{
    (e: 'changeTab', data: string): void
  }>()

  const { t } = useI18n()
  const { payMethodMap } = usePayMethod()

  const gridOptions = reactive<VxeGridProps>({
    height: 'auto',
    columns: [
      { type: 'seq', width: 50, title: t('state.seq') },
      {
        field: 'canteen.name',
        title: t('state.restaurantName'),
        minWidth: 100,
        type: 'html',
        formatter: ({ cellValue }) =>
          `<span class="underline cursor-pointer" style="color: var(--el-color-primary)">${cellValue}</span>`,
      },
      {
        field: 'totalSums',
        title: t('state.total'),
        children: [
          {
            field: 'totalSums[0].amount',
            title: payMethodMap[payMethodEnum.COUNT],
            minWidth: 80,
            type: 'html',
            formatter: ({ cellValue }) =>
              `<span class="underline cursor-pointer" style="color: var(--el-color-primary)">${cellValue}</span>`,
          },
          {
            field: 'totalSums[1].amount',
            title: payMethodMap[payMethodEnum.BALANCE],
            minWidth: 80,
            type: 'html',
            formatter: ({ cellValue }) =>
              `<span class="underline cursor-pointer" style="color: var(--el-color-primary)">${cellValue}</span>`,
          },
        ],
      },
    ],
  })

  const form = reactive<{ dateRange: Date[] }>({
    dateRange: [],
  })
  const headerFormRef = ref<FormInstance>()

  let loaded = false
  const getList = () => {
    gridOptions.loading = true
    getTransactionRecordStates({
      startTime: dayjs(form.dateRange[0]).startOf('date').toDate(),
      endTime: dayjs(form.dateRange[1]).endOf('date').toDate(),
      type: transactionTypeEnum.CONSUME,
    }).then((res) => {
      if (!loaded && res.data.length > 0 && res.data[0].mealTimeSum.length > 0) {
        const arr = res.data[0].mealTimeSum.map((v, index) => {
          return {
            field: `mealTimeSum[${index}]`,
            title: v.mealTime.name,
            children: [
              {
                field: `mealTimeSum[${index}].sums[0].amount`,
                title: payMethodMap[payMethodEnum.COUNT],
                minWidth: 80,
                type: 'html',
                formatter: ({ cellValue }) =>
                  `<span class="underline cursor-pointer" style="color: var(--el-color-primary)">${cellValue}</span>`,
              },
              {
                field: `mealTimeSum[${index}].sums[1].amount`,
                title: payMethodMap[payMethodEnum.BALANCE] + ' / ' + t('state.dollar'),
                minWidth: 80,
                type: 'html',
                formatter: ({ cellValue }) =>
                  `<span class="underline cursor-pointer" style="color: var(--el-color-primary)">${cellValue}</span>`,
              },
            ],
          } as VxeTableDefines.ColumnOptions
        })
        gridOptions.columns.splice(2, 0, ...arr)
        gridOptions.columns = [...gridOptions.columns]
        loaded = true
      }
      gridOptions.data = res.data
      gridOptions.loading = false
    })
  }

  const onClickDetail: VxeGridEvents.CellClick = ({ column, row, $columnIndex }) => {
    if (!$columnIndex) return
    const indexArr = column.field.match(/[1-9]{'0'|\d}*/g)
    const isMealTime = column.field.includes('mealTimeSum')
    const isCateen = column.field.includes('canteen')
    const detailInfo: TransactionRecords = {
      canteenId: row.canteen.id,
      mealTimeId: isMealTime && !isCateen ? row.mealTimeSum[indexArr[0]].mealTime.id : undefined,
      type: !isCateen ? row.mealTimeSum[indexArr[0]].sums[indexArr[1]].type : undefined,
      createdDateGE: dayjs(form.dateRange[0]).startOf('date').toDate(),
      createdDateLE: dayjs(form.dateRange[1]).endOf('date').toDate(),
    }
    setDetailChange(detailInfo)
    emits('changeTab', 'detail')
  }

  onMounted(async () => {
    form.dateRange = [
      dayjs().startOf('month').startOf('date').toDate(),
      dayjs().endOf('month').endOf('date').toDate(),
    ]
    await getList()
  })
</script>

<style scoped></style>
