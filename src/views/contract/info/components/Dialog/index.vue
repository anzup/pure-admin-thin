<template>
  <vxe-modal
    v-model="dialogVisible"
    :esc-closable="true"
    :showFooter="true"
    :title="t('state.trainingProgramSelection')"
    destroy-on-close
    height="auto"
    margin-size="-500"
    position="center"
    size="medium"
    type="modal"
    width="50%"
    @close="close"
    @show="open"
  >
    <!-- destroy-on-close
    :close-on-click-modal="false"

    -->
    <el-tabs v-model="activeTab" class="base-tabs">
      <el-tab-pane
        v-for="(item, index) in tabsList"
        :key="item.id"
        :label="item.name"
        :name="item.id + ''"
      >
        <Table
          :configs="configs"
          :itemData="item"
          :selectedList="getItemList(item)"
          @selected="selected"
        />
      </el-tab-pane>
      <el-tab-pane :label="t('state.facilities_type')" name="resource">
        <ResourceTable
          :facilityList="facilityList"
          :selectedList="contractFacilities"
          @selected="facilitySelect"
        />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ t('buttons.hscancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ t('buttons.hsdefine') }}</el-button>
      </div>
    </template>
  </vxe-modal>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Table from './table.vue'
  import ResourceTable from './resourceTable.vue'

  const { t } = useI18n()

  interface Prop {
    modelValue: boolean
    allConfigList: any[]
    configs: any
    selectedList: any[]
    facilityList: any[]
    contractFacilities: any[]
  }

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: false,
    allConfigList: () => [],
    configs: () => ({}),
    selectedList: () => [],
    facilityList: () => [],
    contractFacilities: () => [],
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData', data: any[]): void
    (e: 'facilitySelect', data: any[]): void
  }>()
  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
  })

  const getItemList = (item) => {
    return props.selectedList.find((v) => v.positionId == item.id)?.selected || []
  }

  const activeTab = ref()

  const confirm = () => {
    emit('updateData', currentList.value)
    emit(
      'facilitySelect',
      currentFacilityList.value.map((v) => ({ ...v, remark: '' })),
    )

    dialogVisible.value = false
  }

  const currentList = ref([])

  const selected = (val) => {
    const index = currentList.value.findIndex((v) => v.positionId == val.positionId)
    if (index !== -1) {
      currentList.value.splice(index, 1, val)
    } else {
      currentList.value.push(val)
    }
  }
  const currentFacilityList = ref([])
  const facilitySelect = (val) => {
    currentFacilityList.value = val
  }

  const tabsList = ref([])

  const open = async () => {
    activeTab.value = props.allConfigList[0]?.id + ''
    tabsList.value = props.allConfigList
    currentList.value = []
    currentFacilityList.value = []
  }
  const close = () => {
    // currentList.value = []
  }
</script>
<style lang="scss" scoped>
  .dialog-footer {
    text-align: center;
  }
</style>
