<template>
  <OverViewCmp v-bind="state" :required="true" />
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import OverViewCmp from '../overViewCmp/index.vue'
  import { VxeGridProps } from 'vxe-table'
  import { getTeacherPeriodDetailList } from '/@/api/opm/statistical'
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
    title: t('text.details_of_instructors'),
    resourceType: 'TEACHER' as any,
    tip: t('text.unit') + '：' + t('text.hour'),
    timeScale: 'month' as any,
    useBuiltinRole: true,
    gridOptions: {
      columns: [
        { field: 'teacherName', title: t('text.teacher') },
        {
          field: 'wetLeaseTrainingInfo',
          title: t('text.wet_rent_training'),
          children: [
            {
              field: 'wetLeaseTrainingInfo.totalHours',
              title: t('text.teaching_time_'),
            },
            {
              field: 'wetLeaseTrainingInfo.totalInspectHours',
              title: t('text.inspector_time'),
            },
          ],
        },
        {
          field: 'dryLeaseTrainingInfo',
          title: t('text.dry_rent_training'),
          children: [
            {
              field: 'dryLeaseTrainingInfo.totalHours',
              title: t('text.teaching_time_'),
            },
            {
              field: 'dryLeaseTrainingInfo.totalInspectHours',
              title: t('text.inspector_time'),
            },
          ],
        },
        {
          field: 'internalLeaseTrainingInfo',
          title: t('text.internal_training'),
          children: [
            {
              field: '',
              title: t('text.training_time_'),
              children: [
                {
                  field: 'internalLeaseTrainingInfo.theoryHours',
                  title: t('text.ground'),
                },
                {
                  field: 'internalLeaseTrainingInfo.flightHours',
                  title: t('text.simulator'),
                },
              ],
            },
            {
              field: '',
              title: t('text.inspector_time'),
              children: [
                {
                  field: 'internalLeaseTrainingInfo.theoryInspectHours',
                  title: t('text.ground'),
                },
                {
                  field: 'internalLeaseTrainingInfo.flightInspectHours',
                  title: t('text.simulator'),
                },
              ],
            },
          ],
        },

        {
          field: 'authenticateHours',
          title: t('text.acceptance_of_simulated_airport'),
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
        // trigger: 'item',
        // formatter: function (params) {
        //     return `<p>${params.name}</p>
        //         <p>${params.seriesName + state.chartOptions.series[params.seriesIndex].stack}: ${params.data}</p>`
        // }
      },
    },
    getData: (params) => {
      state.gridOptions.loading = true
      getTeacherPeriodDetailList(params).then((res) => {
        if (firstLoad) {
          const arr = [
            ...(res.data[0]?.specialTimeSessionsVOList || []).map((v, index) => ({
              field: `specialTimeSessionsVOList[${index}].sessions`,
              title: v.name + `(${t('text.number_of_sessions')})`,
            })),
            {
              field: 'totalHours',
              title: t('text.total_time'),
            },
          ]

          state.gridOptions.columns = [...state.gridOptions.columns, ...arr]
          firstLoad = false
        }
        state.gridOptions.data = res.data
        state.gridOptions.loading = false
      })
    },
  })

  let firstLoad = true
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
