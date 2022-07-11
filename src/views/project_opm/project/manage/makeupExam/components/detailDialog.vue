<template>
  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500px"
    close-on-press-escape
    :append-to-body="false"
    @open="open"
    destroy-on-close
  >
    <VxeTable v-bind="gridOptions">
      <template #pager />
    </VxeTable>
  </el-dialog>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { computed, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { getExamsDetail } from '/@/api/opm/train'
  import dayjs from 'dayjs'
  const { t } = useI18n()
  const props = defineProps({
    modelValue: Boolean,
    id: Number,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()

  const dialogVisible = computed({
    get() {
      return props.modelValue
    },
    set(val: boolean) {
      emit('update:modelValue', val)
    },
  })

  const gridOptions = reactive<VxeTableAllProps>({
    data: [],
    height: 400,
    columns: [
      { type: 'seq', width: 60, title: t('text.seq') },

      {
        // sortable: true,
        field: 'name',
        title: t('text.name'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'gender',
        title: t('text.gender'),
        minWidth: 100,
        formatter: 'formatGender',
      },
      {
        // sortable: true,
        field: 'customerName',
        title: t('text.connection'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'totalScore',
        title: t('text.examination_results'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'startDate',
        title: t('text.examination_duration', { unit: t('text.minute') }),
        minWidth: 100,
        formatter: ({ cellValue, row }) => dayjs(row.endDate).diff(cellValue, 'hour'),
      },
    ],
  })

  function open() {
    getExamsDetail(props.id).then((res) => {
      gridOptions.data = res.data
    })
  }
</script>
