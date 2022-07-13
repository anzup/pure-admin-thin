<template>
  <OverViewCmp v-bind="state" :required="true" />
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import OverViewCmp from '../overViewCmp/index.vue'
  import { VxeGridProps } from 'vxe-table'
  import { getStatisticsMalfunction } from '/@/api/opm/statistical'
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

  const chartList = ref([])
  const state = reactive({
    title: t('text.statistical_overview_of_facility_maintenance_hours'),
    tip: t('text.unit') + '：' + t('text.hour'),
    gridOptions: {
      columns: [
        { field: 'facilityName', title: t('text.facility_name') },
        ...Array.from(new Array(12), (v, index) => {
          return {
            field: `periods[${index}]`,
            title: t(monthList[index]),
            // formatter: formatDate
          }
        }),
        {
          field: `total`,
          title: t('text.total'),
          // formatter: formatDate
        },
      ],
      loading: false,
    } as VxeGridProps,
    chartOptions: {
      xAxis: [],
      series: [],
      loading: false,
      tooltip: {
        // trigger: 'item',
        // formatter: function (params) {
        //     return `<p>${params.name}</p>
        //         <p>${params.seriesName + state.chartOptions.series[params.seriesIndex].stack}: ${params.data}</p>`
        // }
      },
    },
    getData: (params: { year: string; resourceId: number }) => {
      state.gridOptions.loading = true
      getStatisticsMalfunction(params).then((res) => {
        chartList.value = res.data.malfunctions || []
        state.gridOptions.data =
          res.data.malfunctions?.length > 0
            ? [
                ...res.data.malfunctions,
                {
                  facilityName: t('text.total'),
                  periods: res.data.periods,
                  total: res.data.total,
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
    const arr = [...Array(12)].map((val, index) => {
      return {
        name: t(monthList[index]),
        type: 'bar',
        stack: 'hour',
        emphasis: {
          focus: 'series',
        },
        label: {
          show: true,
        },
        // 按月取出当前币种的数据
        data: chartList.value.map((item) => item.periods[index] || undefined),
      }
    })
    state.chartOptions.xAxis = [
      {
        type: 'category',
        data: chartList.value.map((v) => v.teacherName),
        axisLabel: { interval: 0, rotate: chartList.value.length > 7 ? 40 : 0 },
      },
    ]
    state.chartOptions.series = arr
    state.chartOptions.loading = false
  }
</script>
<style lang="scss" scoped></style>
