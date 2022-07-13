<template>
  <OverViewCmp v-bind="state" />
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import OverViewCmp from '../overViewCmp/index.vue'
  import { VxeGridProps } from 'vxe-table'
  import { getStatisticsIncome } from '/@/api/opm/statistical'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const monthList = [
    'date.january',
    'date.february',
    'date.march',
    'date.april',
    'date.may',
    'date.june',
    'date.july',
    'date.august',
    'date.september',
    'date.october',
    'date.november',
    'date.december',
  ]

  const firmatCount = ({ cellValue }) => {
    const arr: string[] = []
    for (const key in cellValue) {
      if (Object.prototype.hasOwnProperty.call(cellValue, key)) {
        const element = cellValue[key]
        arr.push(element + ' ' + key)
      }
    }
    return arr.join()
  }
  const chartList = ref([]),
    currencies = ref<string[]>([])
  const state = reactive({
    title: t('text.sales_statistics_of_training_center'),
    showResources: false,
    gridOptions: {
      columns: [
        { field: 'customerName', title: t('text.customer_name') },
        ...Array.from(new Array(12), (v, index) => {
          return {
            field: `totalAmounts[${index}]`,
            title: t(monthList[index]),
            formatter: firmatCount,
          }
        }),
        {
          field: `sum`,
          title: t('text.total'),
          formatter: firmatCount,
        },
      ],
      loading: false,
    } as VxeGridProps,
    chartOptions: {
      xAxis: [],
      series: [],
      loading: false,
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return `<p>${params.name}</p>
                    <p>${
                      params.seriesName + state.chartOptions.series[params.seriesIndex].stack
                    }: ${params.data}</p>`
        },
      },
    },
    getData: (params: { year: string }) => {
      state.gridOptions.loading = true
      getStatisticsIncome(params.year).then((res) => {
        currencies.value = res.data.currencies
        chartList.value = res.data.incomes
        state.gridOptions.data =
          res.data.incomes.length > 0
            ? [
                ...res.data.incomes,
                {
                  customerName: t('text.total'),
                  totalAmounts: res.data.totalAmounts,
                  sum: res.data.sum,
                },
              ]
            : []

        initChart()
        state.gridOptions.loading = false
      })
    },
  })
  const initChart = () => {
    state.chartOptions.loading = true
    const arr = [...Array(12)]
      .map((val, index) => {
        return currencies.value.map((v) => ({
          name: t(monthList[index]),
          type: 'bar',
          stack: v,
          emphasis: {
            focus: 'series',
          },
          label: {
            show: true,
          },
          // 按月取出当前币种的数据
          data: chartList.value.map((item) => item.totalAmounts[index][v]),
        }))
      })
      .flat()
    state.chartOptions.xAxis = [
      {
        type: 'category',
        data: chartList.value.map((v) => v.customerName),
        axisLabel: { interval: 0, rotate: chartList.value.length > 7 ? 40 : 0 },
      },
    ]
    state.chartOptions.series = arr
    state.chartOptions.loading = false
  }
</script>
<style lang="scss" scoped></style>
