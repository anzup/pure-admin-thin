<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :title="t('state.otherFee')"
    center
    destroy-on-close
    width="600px"
    @close="close"
    @open="open"
  >
    <vxe-grid ref="gridRef" v-bind="gridOptions" @edit-closed="editClosedEvent">
      <template #feeType="{ row }">
        <el-select v-model="row.feeType">
          <el-option v-for="(value, key) in feeTypeMap" :key="key" :label="value" :value="key" />
        </el-select>
      </template>
      <template #bottom>
        <div class="w-full p-2 text-right">
          <el-button size="small" type="primary" @click="onAddRow"
            >{{ t('buttons.hsadd') }}
          </el-button>
        </div>
      </template>
    </vxe-grid>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ t('buttons.hscancel') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ t('buttons.hsdefine') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { useVModel } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { VxeGridInstance, VxeGridProps, VxeTableEvents } from 'vxe-table'
  import useBill from '/@/hooks/useBill'
  import { ElMessage } from 'element-plus'
  import {
    BillItemOther,
    getBillItemsOther,
    GetBillItemsWetLease,
    putBillItemOther,
  } from '/@/api/bills'
  import { inject, Ref } from 'vue'
  import { setObjInject } from '/@/injects'

  const { t } = useI18n()

  interface Prop {
    modelValue: boolean
  }

  const { feeTypeMap } = useBill()

  interface FeeType {
    feeType: keyof typeof feeTypeMap
    num: number
    price: number
    remark: string
  }

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: false,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()
  const dialogVisible = useVModel(props, 'modelValue', emit)

  const gridOptions = $ref<VxeGridProps>({
    height: 300,
    columns: [
      {
        field: 'feeType',
        title: t('state.typesOfFee'),
        formatter: ({ cellValue }) => feeTypeMap[cellValue],
        slots: {
          edit: 'feeType',
        },
        editRender: {},
        width: 120,
      },
      {
        field: 'num',
        title: t('state.quantity'),
        editRender: {
          name: '$input',
          props: {
            type: 'integer',
            min: 1,
          },
        },
      },
      {
        field: 'price',
        title: t('state.unitPrice'),
        editRender: {
          name: '$input',
          props: {
            type: 'integer',
            min: 1,
          },
        },
      },
      {
        field: 'realPrice',
        title: t('state.totalPrice'),
        // formatter: ({ row }) => row.num * row.price,
      },
      {
        field: 'remark',
        title: t('state.remarks'),
        editRender: {
          name: '$input',
        },
      },
      {
        field: '',
        title: t('state.operation'),
        cellRender: {
          name: 'buttons',
          props: {
            buttons: [
              {
                name: t('buttons.hsdelete'),
                status: 'danger',
                event: ({ rowIndex }) => {
                  gridOptions.data.splice(rowIndex, 1)
                  gridOptions.data = [...gridOptions.data]
                },
              },
            ] as ButtonArr,
          },
        },
      },
    ],
    data: [],
    editConfig: {
      mode: 'cell',
      trigger: 'click',
    },
    editRules: {
      feeType: [
        {
          required: true,
          message: t('tip.please_select'),
        },
      ],
      price: [
        {
          required: true,
          message: t('tip.please_enter'),
          type: 'number',
        },
      ],
      num: [
        {
          required: true,
          message: t('tip.please_enter'),
          type: 'number',
        },
      ],
    },
  })

  const onAddRow = () => {
    gridOptions.data = [
      ...gridOptions.data,
      {
        feeType: 'DINNER',
        num: 1,
        price: 1,
        remark: '',
      } as FeeType,
    ]
  }
  let gridRef = $ref<VxeGridInstance>()

  const confirm = async () => {
    const errMap = await gridRef.validate(true)
    if (errMap) return ElMessage.error(t('message.checkFailed'))
    const data: BillItemOther[] = gridRef.data.map<BillItemOther>((v) => {
      const { id, feeType, num, price, remark } = v
      return {
        id,
        feeType,
        num,
        price: price * 100,
        remark,
        billId: rowData.billId,
        positionId: rowData.positionId,
      }
    })
    putBillItemOther(data).then(() => {
      dialogVisible.value = false
      emit('updateData')
    })
  }
  const rowData = $(inject<Ref<GetBillItemsWetLease & { billId: number }>>(setObjInject))
  const editClosedEvent: VxeTableEvents.EditClosed = ({ row }) => {
    row.realPrice = Number(row.num) * Number(row.price)
  }

  const open = () => {
    getBillItemsOther(rowData).then((res) => {
      gridOptions.data = res.data.map((v) => ({
        ...v,
        price: v.price / 100,
        realPrice: v.realPrice / 100,
      }))
    })
  }
  const close = () => {
    gridRef.clearValidate()
  }
</script>
<style lang="scss" scoped></style>
