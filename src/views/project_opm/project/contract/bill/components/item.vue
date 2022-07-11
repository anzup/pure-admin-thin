<template>
  <VxeTable v-bind="gridOptions" :data="data">
    <template #pager />
    <template #button="{ row }">
      <vxe-button type="text" status="primary" :content="$t('text.remove')" @click="remove(row)" />
    </template>
  </VxeTable>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, toRefs } from 'vue'
  import { putBillItemsRemove } from '/@/api/opm/contract'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    name: 'Item',
    components: {
      VxeTable,
    },
    props: {
      data: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['updateData'],
    setup(props, { attrs, emit }) {
      const { t } = useI18n()
      const state = reactive({
        gridOptions: {
          border: true,
          height: 500,
          columns: [
            // { type: "checkbox", width: 50 },
            { type: 'seq', width: 60, title: t('text.seq') },
            {
              field: 'studentNames',
              title: t('text.student_name'),
              minWidth: 100,
            },
            {
              field: 'courseNumber',
              title: t('text.training_course_no'),
              minWidth: 100,
            },
            {
              field: 'courseName',
              title: t('text.training_program'),
              minWidth: 100,
            },
            {
              field: 'airplaneType',
              title: t('text.training_model'),
              minWidth: 100,
            },
            {
              field: 'startDate',
              title: t('text.training_start_time'),
              minWidth: 100,
              formatter: 'formatDateTime',
            },
            {
              field: 'endDate',
              title: t('text.training_end_time'),
              minWidth: 100,
              formatter: 'formatDateTime',
            },
            {
              field: 'currency',
              title: t('text.settlement_currency'),
              minWidth: 80,
            },
            {
              field: 'amount',
              title: t('text.cost'),
              minWidth: 100,
            },
            {
              field: '',
              title: t('text.operation'),
              width: 60,
              slots: {
                default: 'button',
              },
            },
          ],
          data: [],
        } as VxeGridProps,
      })

      const remove = (row) => {
        console.log(row)
        putBillItemsRemove(row.id).then((res) => {
          emit('updateData')
        })
      }

      return {
        ...toRefs(state),
        remove,
      }
    },
  })
</script>
