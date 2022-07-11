<template>
  <VxeTable v-bind="gridOptions" max-height="500">
    <template #pager />
  </VxeTable>
</template>

<script lang="ts">
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, toRefs, onMounted } from 'vue'
  import { VxeGridProps } from 'vxe-table'
  import { useI18n } from 'vue-i18n'
  import { getStudentScheduleHis } from '/@/api/opm/roles'
  import { useRoute } from 'vue-router'
  export default defineComponent({
    name: 'History',
    components: {
      VxeTable,
    },
    setup() {
      const route = useRoute()
      const { t } = useI18n()
      const state = reactive({
        gridOptions: {
          columns: [
            // { type: "checkbox", width: 50 },
            { type: 'seq', width: 60, title: t('text.seq') },
            {
              field: 'clazzVO.courseNumber',
              title: t('text.training_course_no'),
              // sortable: true,
              minWidth: 100,
            },
            {
              field: 'clazzVO.course.name',
              title: t('text.training_course'),
              // sortable: true,
              minWidth: 100,
            },
            {
              field: 'clazzVO.type',
              title: t('text.training_type'),
              // sortable: true,
              minWidth: 100,
              formatter: 'formatType',
            },
            {
              field: 'groupNames',
              title: t('text.flight_team'),
              // sortable: true,
              minWidth: 100,
            },
            // {
            //     field: "",
            //     title: t('text.connection'),
            //     // sortable: true,
            //     minWidth: 100,
            // },
            {
              field: 'startTime',
              title: t('text.training_start_time'),
              // sortable: true,
              minWidth: 100,
              formatter: 'formatDateTime',
            },
            {
              field: 'endTime',
              title: t('text.training_end_time'),
              // sortable: true,
              minWidth: 100,
              formatter: 'formatDateTime',
            },
            {
              field: 'theoryTeachers',
              title: t('text.theory_teacher'),
              // sortable: true,
              minWidth: 100,
            },
            {
              field: 'flightTeachers',
              title: t('text.flight_instructor'),
              // sortable: true,
              minWidth: 100,
            },
            {
              field: 'student',
              title: t('text.Identity'),
              // sortable: true,
              minWidth: 100,
              formatter: ({ cellValue }) => (!cellValue ? t('text.teacher') : t('text.student')),
            },
          ],

          data: [],
        } as VxeGridProps,
      })
      const getStudentSchedule = () => {
        getStudentScheduleHis(+route.params.id).then((res) => {
          state.gridOptions.data = res.data
        })
      }
      onMounted(() => {
        getStudentSchedule()
      })
      return {
        ...toRefs(state),
      }
    },
  })
</script>

<style scoped></style>
