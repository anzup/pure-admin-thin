<template>
  <vxe-grid :data="list" v-bind="gridOptions">
    <template #toolbar_tools>
      <el-button class="mr-4" type="primary" @click="showDialog()"
        >{{ $t('buttons.hsAdd') }}
      </el-button>
    </template>
  </vxe-grid>
  <Dialog :id="rowId" v-model="isShow" @updateData="getMealTimesList" />
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import { VxeGridProps } from 'vxe-table'
  import { useI18n } from '/@/hooks/useI18n'
  import Dialog from './dialog.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { deleteMealTimesId } from '/@/api/mealTimes'
  import useMealTimes from '/@/hooks/useMealTimes'
  import dayjs from 'dayjs'

  const { t } = useI18n()
  const gridOptions = reactive<VxeGridProps>({
    height: 'auto',
    columns: [
      {
        field: 'name',
        title: t('state.name'),
      },
      {
        field: 'startMinute',
        title: t('state.period'),
        formatter: ({ row, cellValue }) =>
          dayjs().startOf('date').add(cellValue, 'minutes').format('HH:mm') +
          ' - ' +
          dayjs().startOf('date').add(row.endMinute, 'minutes').format('HH:mm'),
      },
      {
        title: t('state.operation'),
        width: 120,
        field: 'operationTypes',
        cellRender: {
          name: 'buttons',
          props: {
            buttons: [
              {
                name: t('buttons.edit'),
                event: ({ row }) => {
                  showDialog(row.id)
                },
              },
              {
                name: t('buttons.hsDelete'),
                status: 'danger',
                event: ({ row }) => {
                  ElMessageBox.confirm(t('tip.deleteTheSelectedData'), {
                    type: 'warning',
                  })
                    .then(() => {
                      return deleteMealTimesId(row.id)
                    })
                    .then(() => {
                      ElMessage.success(t('status.successfullyDeleted'))
                    })
                    .catch(() => {})
                },
              },
            ] as ButtonArr,
          },
        },
      },
    ],
    toolbarConfig: {
      // custom: true,
      size: 'medium',
      perfect: true,
      slots: {
        tools: 'toolbar_tools',
      },
    },
  })
  const isShow = ref<boolean>(false)
  const rowId = ref<number>()
  const showDialog = (val?: number) => {
    !!val && (rowId.value = val)
    isShow.value = true
  }

  const { getMealTimesList, mealTimesList: list } = useMealTimes()

  onMounted(() => getMealTimesList())
</script>

<style scoped></style>
