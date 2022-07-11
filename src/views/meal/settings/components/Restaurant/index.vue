<template>
  <vxe-grid :data="list" v-bind="gridOptions">
    <template #toolbar_tools>
      <el-button class="mr-4" type="primary" @click="showDialog()"
        >{{ $t('buttons.hsAdd') }}
      </el-button>
    </template>
  </vxe-grid>
  <RestaurantDialog :id="rowId" v-model="isShow" @updateData="getCanteensList" />
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import { VxeGridProps } from 'vxe-table'
  import { useI18n } from '/@/hooks/useI18n'
  import RestaurantDialog from './dialog.vue'
  import useCanteens from '/@/hooks/useCanteens'
  import { usePayMethod } from '/@/hooks/useEnumToMap'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { deleteCanteensId } from '/@/api/canteens'

  const { payMethodMap } = usePayMethod()

  const { t } = useI18n()
  const gridOptions = reactive<VxeGridProps>({
    height: 'auto',
    columns: [
      {
        field: 'name',
        title: t('state.restaurantName'),
      },
      {
        field: 'types',
        title: t('state.cashierMethod'),
        formatter: ({ cellValue }) => cellValue?.map((v) => payMethodMap[v]),
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
                      return deleteCanteensId(row.id)
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

  const { getCanteensList, canteensList: list } = useCanteens()

  onMounted(() => getCanteensList())
</script>

<style scoped></style>
