<template>
  <div class="h-full p-4">
    <vxe-grid :data="trainingData" :mergeCells="mergeCells" v-bind="gridOptions">
      <template #user="{ row }">
        <el-tag v-for="item in row.students || []" :key="item.id" class="mr-2 mt-1 mb-1"
          >{{ item.name }}
        </el-tag>
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import { useI18n } from 'vue-i18n'
  import dayjs from 'dayjs'

  interface Props {
    trainingData: any[]
    mergeCells: any[]
  }

  const props = withDefaults(defineProps<Props>(), {
    trainingData: () => [],
    mergeCells: () => [],
  })

  const { t } = useI18n()
  const gridOptions = $ref<VxeGridProps>({
    height: 'auto',
    columnConfig: {
      minWidth: 150,
    },
    columns: [
      {
        type: 'seq',
        width: 50,
        title: t('state.seq'),
      },
      {
        field: 'trainingItemName',
        title: t('state.training_program'),
        width: 150,
      },
      {
        field: 'clazzName',
        title: t('state.clazz'),
        width: 150,
      },
      {
        field: 'num',
        title: t('state.number_of_trainees'),
        width: 100,
      },
      {
        field: 'startDate',
        title: t('state.trainingPeriod'),
        formatter: ({ cellValue, row }) =>
          dayjs(cellValue).format('YYYY-MM-DD') + ' - ' + dayjs(row.endDate).format('YYYY-MM-DD'),
        width: 160,
      },
      {
        field: '',
        title: t('state.traineeDetails'),
        slots: {
          default: 'user',
        },
        align: 'left',
        headerAlign: 'center',
      },
    ],
  })
</script>

<style scoped></style>
