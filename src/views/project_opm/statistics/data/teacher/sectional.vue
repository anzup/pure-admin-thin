<template>
  <SectionalCmp v-bind="state" :required="true" />
</template>
<script lang="ts" setup>
  import { StatiStics, getStatisticsTeacherSections } from '/@/api/opm/statistical'
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
    tip: t('text.unit') + '：' + t('text.number_of_sessions'),
    useBuiltinRole: true,
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
                .vxe-table tbody tr:nth-child(5n-1),.vxe-table tbody tr:nth-child(5n){
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
          field: 'teacherId',
          title: t('text.teacher'),
          formatter: ({ row }) => row.teacherName,
          // type: "html",
        },
        {
          field: 'time',
          title: t('text.time_interval'),
          // type: 'html'
        },
        ...Array.from(new Array(12), (v, index) => {
          return {
            field: `session[${index}]`,
            title: t(monthList[index]),

            // type: 'html'
          }
        }),
        {
          field: `total`,
          title: t('text.total'),

          // type: 'html'
        },
      ],

      mergeCells: [],
      loading: false,
    } as VxeGridProps,
    resourceType: 'TEACHER' as any,
    getData(params: StatiStics) {
      state.gridOptions.loading = true
      getStatisticsTeacherSections(params).then(
        (res: {
          data: Array<{
            hours: number[]
            sectionVOList: any[]
            session: number[]
            teacherId: number
            teacherName: string
            totalHours: number
            totalSession: number
          }>
        }) => {
          const arr: VxeTablePropTypes.MergeCells = []
          const data = res.data
            .map((v, index) => {
              const {
                teacherName,
                teacherId,
                totalHours,
                totalSession,
                sectionVOList,
                session,
                hours,
              } = v
              arr.push({ row: index * 5, col: 0, rowspan: 5, colspan: 1 })
              return [
                ...sectionVOList.map((item) => {
                  return {
                    teacherName,
                    teacherId,
                    time: item.title,
                    session: item.sessions,
                    total: item.total,
                  }
                }),
                {
                  teacherName,
                  teacherId,
                  time: t('text.total_sessions'),
                  session,
                  total: totalSession,
                  merge: true,
                },
                {
                  teacherName,
                  teacherId,
                  time: t('text.hours_number'),
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
