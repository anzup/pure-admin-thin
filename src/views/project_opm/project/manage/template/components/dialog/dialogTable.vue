<template>
  <VxeTable v-bind="(gridOptions as any)">
    <template #pager />
  </VxeTable>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import VxeTable from '/@/components/Table/index.vue'
  const { t } = useI18n()
  const gridOptions = reactive<VxeTableAllProps>({
    columns: [
      { type: 'seq', width: 60, title: t('text.seq') },
      {
        field: '',
        title: '训练内容',
        // sortable: true,
        minWidth: 100,
      },
      {
        field: '',
        title: '分类',
        // sortable: true,
        minWidth: 100,
      },
      {
        field: '',
        title: '学时',
        // sortable: true,
        minWidth: 100,
      },
      {
        field: '',
        title: '训练时段',
        // sortable: true,
        minWidth: 100,
      },

      {
        title: t('text.operation'),
        width: 250,
        slots: { default: 'operate' },
        field: 'operationTypes',
        // fixed:'right'
      },
    ],
    height: '100%',
  })
</script>
<style lang="scss" scoped></style>
