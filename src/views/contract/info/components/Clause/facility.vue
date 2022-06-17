<template>
  <VxeTable ref="vxTable" :data="data" v-bind="gridOptions"></VxeTable>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue'
  import VxeTable from '/@/components/Table/index.vue'
  import { ContractItem } from '/@/api/contaract'
  import { useI18n } from 'vue-i18n'
  import useCommon from '/@/hooks/useCommon'

  export interface Prop {
    modelValue: any[]
    isDetail?: boolean
  }

  const { t } = useI18n()

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: () => [],
    isDetail: false,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: any[]): void
  }>()

  const data = computed<ContractItem[]>({
    get: () => props.modelValue,
    set: (val: any[]) => emit('update:modelValue', val),
  })
  const { booleanList, dinnerList, payTypeList, roomTypeList } = useCommon()
  const gridOptions = reactive<VxeTableAllProps>({
    columns: [
      {
        type: 'seq',
        title: t('state.seq'),
        width: 50,
      },
      {
        title: t('state.facilities_type'),
        field: 'facilityName',
      },

      {
        title: t('state.facilityPrice'),
        field: 'price',
        editRender: props.isDetail
          ? undefined
          : {
              name: '$input',
              props: {
                type: 'integer',
                min: 0,
                clearable: false,
                placeholder: t('tip.please_enter'),
              },
            },
        width: 150,
      },
      {
        title: t('state.vehicle_demand'),
        field: 'needVehicle',
        editRender: props.isDetail
          ? undefined
          : {
              name: '$select',
              props: {
                placeholder: t('tip.please_select'),
                options: booleanList.value,
                optionProps: {
                  label: 'name',
                  value: 'id',
                },
                transfer: true,
              },
            },
        formatter: 'formatBool',
        width: 100,
      },
      {
        title: t('state.meal_demand'),
        field: 'dinners',
        editRender: props.isDetail
          ? undefined
          : {
              name: '$select',
              props: {
                placeholder: t('tip.please_select'),
                options: dinnerList.value,
                multiple: true,
                optionProps: {
                  label: 'name',
                  value: 'id',
                },
                transfer: true,
              },
            },
        formatter: ({ cellValue }) => {
          return cellValue?.map((v) => dinnerList.value.find((i) => i.id == v)?.name)
        },
        width: 150,
      },
      {
        title: t('state.mealDays'),
        field: 'dayOfDinner',
        editRender: props.isDetail
          ? undefined
          : {
              name: '$input',
              props: {
                type: 'integer',
                min: 0,
                clearable: false,
                placeholder: t('tip.please_enter'),
              },
            },
        width: 100,
      },
      {
        title: t('state.accommodation_demand'),
        field: 'roomType',
        editRender: props.isDetail
          ? undefined
          : {
              name: '$select',
              props: {
                placeholder: t('tip.please_select'),
                options: roomTypeList.value,
                optionProps: {
                  label: 'name',
                  value: 'id',
                },
                transfer: true,
              },
            },
        formatter: ({ cellValue }) => roomTypeList.value.find((v) => v.id == cellValue)?.name,
        width: 100,
      },
      {
        title: t('state.daysOfStay'),
        field: 'dayOfAccommodation',
        editRender: props.isDetail
          ? undefined
          : {
              name: '$input',
              props: {
                type: 'integer',
                min: 0,
                clearable: false,
                placeholder: t('tip.please_enter'),
              },
            },
        width: 100,
      },
      {
        title: t('state.settlementMethod'),
        field: 'payType',
        editRender: props.isDetail
          ? undefined
          : {
              name: '$select',
              props: {
                placeholder: t('tip.please_select'),
                options: payTypeList.value,
                optionProps: {
                  label: 'name',
                  value: 'id',
                },
                transfer: true,
              },
            },
        formatter: ({ cellValue }) => payTypeList.value.find((v) => v.id == cellValue)?.name,
        width: 100,
      },
      {
        title: t('state.discountRatio'),
        field: 'discount',
        editRender: props.isDetail
          ? undefined
          : {
              name: '$input',
              props: {
                type: 'float',
                min: 0,
                max: 100,
                clearable: false,
                placeholder: t('tip.please_enter'),
                step: 1,
                digits: 2,
              },
            },
        width: 100,
      },
      {
        title: t('state.remarks'),
        field: 'remark',
        editRender: props.isDetail
          ? undefined
          : {
              name: '$input',
              props: {
                clearable: false,
                placeholder: t('tip.please_enter'),
              },
            },
      },
      {
        visible: !props.isDetail,
        width: 60,
        field: '',
        title: t('state.operation'),
        slots: {
          default: 'operate',
        },
        fixed: 'right',
      },
    ],
    height: 400,
    buttons: [
      {
        name: t('buttons.hsdelete'),
        status: 'danger',
        event: ({ row, rowIndex }) => {
          data.value.splice(rowIndex, 1)
          data.value = [...data.value]
        },
      },
    ],
    editConfig: props.isDetail
      ? undefined
      : {
          trigger: 'click',
          mode: 'row',
        },
    columnConfig: {
      minWidth: 200,
    },
    editRules: {
      price: [
        {
          required: true,
          content: t('tip.please_enter'),
        },
      ],
      needVehicle: [
        {
          required: true,
          content: t('tip.please_select'),
        },
      ],
      roomType: [
        {
          required: true,
          content: t('tip.please_select'),
        },
      ],
      payType: [
        {
          required: true,
          content: t('tip.please_select'),
        },
      ],
    },
  })

  const vxTable = ref()
  defineExpose({
    vxTable,
  })
</script>

<style lang="scss" scoped></style>
