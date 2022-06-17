<template>
  <vxe-grid
    ref="tableRef"
    :data="tableData"
    v-bind="gridOptions"
    @checkbox-all="getChecked"
    @checkbox-change="getChecked"
  >
    >
    <!-- <template #form>
      <el-form :model="form" ref="headerFormRef" inline class="header-form">
        <el-form-item prop="trainingCategoryId" :label="t('menus.trainCategoryConfig')">
          <el-select
            v-model="form.trainingCategoryId"
            :placeholder="$t('tip.please_select')"
            @change="trainingCategoryChange"
          >
            <el-option
              v-for="(item, index) in configs?.trainingCategories || []"
              :key="index"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="trainingItemId" :label="t('state.training_program')">
          <el-select
            clearable
            v-model="form.trainingItemId"
            :placeholder="$t('tip.please_select')"
            @change="getTableData"
          >
            <el-option
              v-for="(item, index) in trainingItemList "
              :key="index"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="trainingTypeConfigId" :label="t('state.trainingTypeName')">
          <el-select
            v-model="form.trainingTypeConfigId"
            :placeholder="$t('tip.please_select')"
            @change="getTableData"
          >
            <el-option
              v-for="(item, index) in configs?.trainingTypeConfigs || [] "
              :key="index"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>-->

    <template #trainCategory="{ data }">
      <vxe-select v-model="data.trainingCategoryId" transfer @change="trainingCategoryChange">
        <vxe-option
          v-for="item in configs?.trainingCategories || []"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></vxe-option>
      </vxe-select>
    </template>

    <template #trainingItem="{ data }">
      <vxe-select v-model="data.trainingItemId" clearable transfer @change="getTableData">
        <vxe-option
          v-for="item in trainingItemList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></vxe-option>
      </vxe-select>
    </template>

    <template #trainingTypeConfig="{ data }">
      <vxe-select v-model="data.trainingTypeConfigId" clearable transfer @change="getTableData">
        <vxe-option
          v-for="item in trainingTypeConfigs || []"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></vxe-option>
      </vxe-select>
    </template>
  </vxe-grid>
</template>

<script lang="ts" setup>
  import { computed, reactive, onMounted, ref, onBeforeUnmount } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { VxeGridInstance, VxeTableEvents } from 'vxe-table'

  export interface Prop {
    // modelValue: any[],
    configs: any
    itemData: {
      id: number
      name: string
      list: {
        trainingItemId: number
        trainingItemName: string
        trainingCategoryName: string
        trainingCategoryId: number
        trainingTypeConfigId: number
        trainingTypeConfigName: string
        trainingItemCode: string
        positionId: number
        positionName: string
        composeId: string
      }[]
    }
    selectedList?: {
      trainingItemId: number
      trainingItemName: string
      trainingCategoryName: string
      trainingCategoryId: number
      trainingTypeConfigId: number
      trainingTypeConfigName: string
      trainingItemCode: string
      positionId: number
      positionName: string
      composeId: string
    }[]
  }

  const { t } = useI18n()

  const props = withDefaults(defineProps<Prop>(), {
    // modelValue: () => [{ id: 1 }],
    configs: () => ({}),
    list: () => [],
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
        title: t('menus.trainCategoryConfig'),
        field: 'trainingCategoryName',
      },
      {
        title: t('state.training_item_code'),
        field: 'trainingItemCode',
      },
      {
        title: t('state.name_of_training_program'),
        field: 'trainingItemName',
      },
      {
        title: t('state.trainingTypeName'),
        field: 'trainingTypeConfigName',
      },
    ],
    maxHeight: 400,
    checkboxConfig: {
      reserve: true,
    },
    rowId: 'composeId',
    formConfig: {
      data: {
        trainingCategoryId: undefined,
        trainingItemId: undefined,
        trainingTypeConfigId: undefined,
      },
      items: [
        {
          field: 'trainingCategoryId',
          span: 8,
          title: t('menus.trainCategoryConfig'),
          slots: { default: 'trainCategory' },
        },
        {
          field: 'trainingItemId',
          span: 8,
          title: t('state.training_program'),
          slots: { default: 'trainingItem' },
        },
        {
          field: 'trainingTypeConfigId',
          span: 8,
          title: t('state.trainingTypeName'),
          slots: { default: 'trainingTypeConfig' },
        },
      ],
    },
  })

  const trainingItemList = ref([])
  const trainingCategoryChange = () => {
    trainingItemList.value = props.configs?.trainingItems?.filter(
      (v) => v.trainingCategory?.id == gridOptions.formConfig.data.trainingCategoryId,
    )
    gridOptions.formConfig.data.trainingItemId = undefined
    getTableData()
  }

  const tableData = ref([])

  const getTableData = () => {
    gridOptions.loading = true

    tableData.value = props.itemData.list.filter((item) => {
      return (
        (props.selectedList.length > 0
          ? props.selectedList.every((v) => v.composeId !== item.composeId)
          : true) &&
        item.trainingCategoryId == gridOptions.formConfig.data.trainingCategoryId &&
        (gridOptions.formConfig.data.trainingItemId
          ? gridOptions.formConfig.data.trainingItemId == item.trainingItemId
          : true) &&
        (gridOptions.formConfig.data.trainingTypeConfigId
          ? gridOptions.formConfig.data.trainingTypeConfigId == item.trainingTypeConfigId
          : true)
      )
    })
    // console.log(tableData.value);

    gridOptions.loading = false
  }

  const tableRef = ref<VxeGridInstance>()

  const getChecked = () => {
    emit('selected', {
      positionId: props.itemData.id,
      positionName: props.itemData.name,
      selected: [
        ...tableRef.value.getCheckboxRecords(),
        ...tableRef.value.getCheckboxReserveRecords(),
      ],
    })
  }

  defineExpose({
    getChecked,
  })

  const trainingTypeConfigs = computed(() =>
    props.configs.trainingTypeConfigs.filter((v) => v.position.id == props.itemData.id),
  )

  onMounted(() => {
    gridOptions.formConfig.data.trainingCategoryId = props.configs?.trainingCategories[0]?.id
    gridOptions.formConfig.data.trainingTypeConfigId = trainingTypeConfigs.value[0]?.id
    trainingCategoryChange()
  })
  onBeforeUnmount(() => {
    tableRef.value.clearCheckboxRow()
    tableRef.value.clearCheckboxReserve()
  })
</script>

<style lang="scss" scoped></style>
