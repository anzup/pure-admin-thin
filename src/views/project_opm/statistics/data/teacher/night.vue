<template>
  <OverViewCmp v-bind="state" :required="true" />
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import OverViewCmp from '../overViewCmp/index.vue'
  import { VxeGridProps } from 'vxe-table'
  import { getTeacherNightSessionList } from '/@/api/opm/statistical'
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

  const chartList = ref([])
  const state = reactive({
    title: t('text.teacher_night_teaching_statistics'),
    resourceType: 'TEACHER' as any,
    tip: t('text.unit') + '：' + t('text.number_of_sessions'),
    useBuiltinRole: true,
    timeScale: 'month' as any,
    gridOptions: {
      showFooter: true,
      columns: [
        { field: 'teacherName', title: t('text.teacher') },
        {
          title: t('text.times_of_crossing', { time: '00:00' }),
          field: 'passZero',
        },
        {
          title: t('text.times_of_crossing', { time: '02:00' }),
          field: 'passTwo',
        },
        {
          title: t('text.times_of_crossing', { time: '03:00' }),
          field: 'passThree',
        },
        {
          title: t('text.more_than_hours_of_continuous_night_teaching', { time: '4' }),
          field: 'passFourHours',
        },
      ],
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
    getData: (params) => {
      state.gridOptions.loading = true
      getTeacherNightSessionList(params).then((res) => {
        // chartList.value = res.data.teacherHourList
        state.gridOptions.data = res.data
        // initChart()
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
        data: chartList.value.map((item) => item.hours[index] || undefined),
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
