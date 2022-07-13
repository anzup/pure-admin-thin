<template>
  <OverViewCmp v-bind="state" />
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import OverViewCmp from '../overViewCmp/index.vue'
  import { VxeGridProps } from 'vxe-table'
  import { getExtraBills } from '/@/api/opm/statistical'
  import { useI18n } from 'vue-i18n'
  import { sumNum } from '/@/utils/operation'

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

  const formatDate = ({ cellValue }) => {
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
    title: t('text.statistics_of_training_and_examination'),
    showResources: false,
    gridOptions: {
      columns: [
        { field: 'customerName', title: t('text.customer_name') },

        {
          field: `trainingCount`,
          title: '补训次数',
        },
        {
          field: `trainingAmount`,
          title: '补训金额',
        },
        {
          field: `examCount`,
          title: '补考次数',
        },
        {
          field: `examBillAmount`,
          title: '补考金额',
        },
      ],
      loading: false,
      showFooter: true,
      footerMethod({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return t('text.total')
            }
            return sumNum(data, column.property)
          }),
        ]
      },
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
      getExtraBills(+params.year).then((res) => {
        // currencies.value = res.data.currencies
        // chartList.value = res.data.incomes
        state.gridOptions.data = res.data

        // initChart()
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
