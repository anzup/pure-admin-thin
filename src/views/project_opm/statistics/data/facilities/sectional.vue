<template>
  <SectionalCmp v-bind="state" :required="true" />
</template>
<script lang="ts" setup>
  import { StatiStics, getStatisticsFacilitySections } from '/@/api/opm/statistical'
  import SectionalCmp from '../sectionalCmp/index.vue'
  import { reactive } from 'vue'
  import { VxeGridProps, VxeTablePropTypes } from 'vxe-table'
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
  const state = reactive({
    tip: t('text.unit') + '：' + t('text.hour'),
    gridOptions: {
      printConfig: {
        isMerge: true,
        useStyle: true,
        style: `
                .vxe-table {
                  color: #000; // 修改表格默认颜色
                  font-size: 12px; // 修改表格默认字体大小
                  font-family: "Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu; // 修改表格默认字体
                }

                .vxe-table colgroup col:first-child{
                    width: 500px !important;
                }
                .vxe-table tbody tr:nth-child(4n){
                    background-color: #f4f4f5;
                }

            `,
        // beforePrintMethod({ content }) {

        //     return content
        // }
      },
      data: [],
      columns: [
        {
          field: 'facilityId',
          title: t('text.facility_name'),
          formatter: ({ row }) => row.facilityName,
        },
        {
          field: 'time',
          title: t('text.time_interval'),
        },
        ...Array.from(new Array(12), (v, index) => {
          return {
            field: `session[${index}]`,
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

      mergeCells: [],
    } as VxeGridProps,
    getData(params: StatiStics) {
      state.gridOptions.loading = true
      getStatisticsFacilitySections(params).then(
        (res: {
          data: Array<{
            hours: number[]
            sectionVOList: any[]

            facilityId: number
            facilityName: string
            totalHours: number
          }>
        }) => {
          const arr: VxeTablePropTypes.MergeCells = []
          const data = res.data
            .map((v, index) => {
              const { facilityName, facilityId, totalHours, sectionVOList, hours } = v
              arr.push({ row: index * 4, col: 0, rowspan: 4, colspan: 1 })
              return [
                ...sectionVOList.map((item) => {
                  return {
                    facilityName,
                    facilityId,
                    time: item.title,
                    session: item.hours,
                    total: item.total,
                  }
                }),
                {
                  facilityName,
                  facilityId,
                  time: t('text.total'),
                  session: hours,
                  total: totalHours,
                  merge: true,
                },
              ]
            })
            .flat()
          state.gridOptions.mergeCells = arr
          state.gridOptions.data = data
          state.gridOptions.loading = false
        },
      )
    },
    title: t('text.segment_statistics_of_class_hours'),
  })
</script>
