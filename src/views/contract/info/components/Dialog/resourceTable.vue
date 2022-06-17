<template>
  <vxe-grid
    ref="tableRef"
    :data="tableData"
    v-bind="gridOptions"
    @checkbox-all="getChecked"
    @checkbox-change="getChecked"
  ></vxe-grid>
</template>

<script lang="ts" setup>
  import { computed, reactive, onMounted, ref, onBeforeUnmount } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { VxeGridInstance, VxeTableEvents } from 'vxe-table'

  export interface Prop {
    facilityList: any[]
    selectedList: any[]
  }

  const { t } = useI18n()

  const props = withDefaults(defineProps<Prop>(), {
    facilityList: () => [],
    selectedList: () => [],
  })
  const emit = defineEmits<{
    (e: 'selected', data: any): void
  }>()

  const gridOptions = reactive<VxeTableAllProps>({
    columns: [
      {
        type: 'checkbox',
        width: 60,
      },
      {
        type: 'seq',
        title: t('state.seq'),
        width: 50,
      },
      {
        title: t('state.facility_type'),
        field: 'facilityName',
      },
      {
        title: t('state.remarks'),
        field: 'remark',
      },
    ],
    maxHeight: 400,
  })

  const tableData = ref([])

  const getTableData = () => {
    gridOptions.loading = true
    tableData.value = props.facilityList.filter((v) => {
      // v.facilityId = v.id
      // delete v.id
      return props.selectedList?.length > 0
        ? props.selectedList.every((i) => v.facilityId !== i.facilityId)
        : true
    })
    gridOptions.loading = false
  }

  const tableRef = ref<VxeGridInstance>()

  const getChecked = () => {
    emit('selected', [...tableRef.value.getCheckboxRecords()])
  }

  defineExpose({
    getChecked,
  })

  onMounted(() => {
    getTableData()
  })
  onBeforeUnmount(() => {
    tableRef.value.clearCheckboxRow()
  })
</script>

<style lang="scss" scoped></style>
