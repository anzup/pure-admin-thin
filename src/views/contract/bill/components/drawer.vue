<template>
  <div
    v-if="dialogVisible"
    :style="{ zIndex }"
    class="w-full h-full absolute top-0 left-0 bg-white flex flex-col"
  >
    <div class="flex-grow-0 flex-shrink-0" style="height: calc(100% - 48px)">
      <Tabs v-model="tabName">
        <TabPanel :label="t('state.billingDetails')" name="billingDetails">
          <BillDetail :mergeCells="mergeCells" :trainingData="trainingData" />
        </TabPanel>
        <TabPanel :label="t('state.participantsPeople')" name="participantsPeople">
          <People :mergeCells="mergeCells" :trainingData="trainingData" />
        </TabPanel>
      </Tabs>
    </div>
    <div class="h-12 pb-4 text-center">
      <el-button type="primary" @click="dialogVisible = false">{{ t('buttons.back') }}</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { inject, Ref, ref, watch } from 'vue'
  import { useZIndex } from 'element-plus'
  import { useVModel } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { TabPanel, Tabs } from '/@/components/Tabs'
  import Template from './components/Template.vue'
  import BillDetail from './billDetail.vue'
  import People from './people.vue'
  import { GetBillItemsWetLease, getBillItemsWetLease } from '/@/api/bills'
  import { setObjInject } from '/@/injects'
  import { VxeTablePropTypes } from 'vxe-table'

  const { t } = useI18n()

  interface Prop {
    modelValue: boolean
  }

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: false,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()
  const dialogVisible = useVModel(props, 'modelValue', emit)
  const tabName = ref('billingDetails')

  const zIndex = $ref(useZIndex().nextZIndex())
  const rowData = $(inject<Ref<GetBillItemsWetLease & { billId: number }>>(setObjInject))
  let trainingData = $ref<any[]>([]),
    mergeCells = $ref<VxeTablePropTypes.MergeCell[]>([])
  const genMergeCells = () => {
    let cellMap = new Map()
    trainingData.forEach((item, index) => {
      if (cellMap.has(item.trainingItemName)) {
        let obj = cellMap.get(item.trainingItemName)
        obj.rowspan++
        cellMap.set(item.trainingItemName, obj)
      } else {
        cellMap.set(item.trainingItemName, {
          col: 1,
          row: index,
          rowspan: 1,
          // colspan: 1,
        })
      }
    })
    mergeCells = [...cellMap.values()]
    // gridRef.setMergeCells([...cellMap.values()])
  }
  const getDetailList = () => {
    getBillItemsWetLease(rowData).then((res) => {
      trainingData = res.data
      genMergeCells()
    })
  }
  watch(
    () => props.modelValue,
    (val) => {
      if (val) getDetailList()
    },
  )
</script>

<style scoped>
  .d-tab-pane {
    height: 100%;
  }
</style>
