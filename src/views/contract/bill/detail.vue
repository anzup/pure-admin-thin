<template>
  <div class="relative">
    <vxe-grid ref="gridRef" v-bind="gridOptions">
      <template #form>
        <el-descriptions :column="3" border class="mb-4">
          <el-descriptions-item :label="t('state.customer_name')" align="center" width="15%">
            {{ customerInfo.name }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="t('state.customer_abbreviation')"
            align="center"
            width="15%"
          >
            {{ customerInfo.shortName }}
          </el-descriptions-item>
          <el-descriptions-item :label="t('state.customer_code')" align="center" width="15%">
            {{ customerInfo.code }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="flex justify-between">
          <el-form ref="headerFormRef" :model="form" class="header-form" inline>
            <el-form-item prop="">
              <el-date-picker
                v-model="form.year"
                :placeholder="t('tip.please_select')"
                type="year"
              />
            </el-form-item>
            <el-form-item prop="">
              <el-select v-model="form.positionId">
                <el-option
                  v-for="item in positionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="searchKey">
              <el-input
                v-model="form.searchKey"
                :placeholder="$t('tip.please_enter')"
                prefix-icon="Search"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <FormBtn @submit="submit" />
            </el-form-item>
          </el-form>
          <!--<el-button type="primary" @click="showCycleDialog = true"> 导出 </el-button>-->
        </div>
      </template>
      <template #bottom>
        <div class="w-full text-center leading-none pt-3">
          <el-button type="primary" @click="$router.back()">{{ t('buttons.back') }}</el-button>
        </div>
      </template>
    </vxe-grid>
    <CycleDialog v-model="showCycleDialog" @updateData="getList" />
    <BillItemDetail v-model="showDetail" />
    <OtherFee v-model="showOtherFee" @updateData="getList" />
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, provide, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import useCourseClass from '/@/hooks/useCourseClass'
  import dayjs from 'dayjs'
  import { VxeGridInstance } from 'vxe-table'
  import { setObjInject } from '/@/injects'
  import { GetBillItemsWetLease, GetBills, getBills } from '/@/api/bills'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import CycleDialog from './components/cycle.vue'
  import BillItemDetail from './components/drawer.vue'
  import OtherFee from './components/otherFee.vue'

  const { t } = useI18n()
  const gridOptions = reactive<VxeTableAllProps>({
    height: 'auto',
    columns: [
      {
        type: 'checkbox',
        width: 50,
      },
      {
        type: 'seq',
        width: 50,
        title: t('state.seq'),
      },
      {
        field: 'startDate',
        title: t('state.billingCycle'),
        formatter: ({ cellValue, row }) =>
          dayjs(cellValue).format('YYYY-MM-DD') + ' - ' + dayjs(row.endDate).format('YYYY-MM-DD'),
      },
      {
        field: 'position.name',
        title: t('state.trainingPosts'),
      },
      {
        field: 'num',
        title: t('state.number_of_trainees'),
      },
      {
        field: 'totalPrice',
        title: t('state.totalTrainingPrice'),
        formatter: ({ cellValue }) => (cellValue || 0) / 100,
      },
      {
        field: 'realPrice',
        title: t('state.trainingDiscount'),
        formatter: ({ cellValue }) => (cellValue || 0) / 100,
      },
      {
        field: 'otherPrice',
        title: t('state.otherFee'),
        formatter: ({ cellValue }) => (cellValue || 0) / 100,
      },
      {
        field: 'sumPrice',
        title: t('state.totalPrice'),
        formatter: ({ cellValue }) => (cellValue || 0) / 100,
      },

      {
        width: 150,
        field: 'operationTypes',
        title: t('state.operation'),
        cellRender: {
          name: 'buttons',
          props: {
            buttons: ({ row }) => {
              return [
                {
                  name: t('buttons.hsDetail'),
                  event: () => {
                    rowData = {
                      positionId: row.position.id,
                      startDate: row.startDate,
                      endDate: row.endDate,
                      billId: row.id,
                      customerId: form.customerId,
                    }
                    nextTick(() => {
                      showDetail = true
                    })
                  },
                },
                {
                  name: t('state.otherFee'),
                  event: () => {
                    rowData = {
                      positionId: row.position.id,
                      startDate: row.startDate,
                      endDate: row.endDate,
                      billId: row.id,
                      customerId: form.customerId,
                    }
                    showOtherFee = true
                  },
                },
              ]
            },
          },
        },
      },
    ],
    data: [],

    columnConfig: {
      minWidth: 200,
    },
    mergeCells: [],
  })

  let showDetail = $ref<boolean>(false),
    showOtherFee = $ref<boolean>(false)
  let rowData = $ref<GetBillItemsWetLease & { billId: number }>(undefined)
  provide(setObjInject, $$(rowData) as any)

  const form = reactive<Omit<GetBills, 'year'> & { year: Date }>({
    searchKey: undefined,
    customerId: undefined,
    positionId: undefined,
    year: new Date(),
  })
  let showCycleDialog = $ref(false)

  const route = useRoute()

  const headerFormRef = ref()
  const submit = (type: string) => {
    if (type == 'reset') {
      headerFormRef.value.resetFields()
    }
    getList()
  }

  let gridRef = $ref<VxeGridInstance>()

  const genMergeCells = () => {
    let cellMap = new Map()
    gridOptions.data.forEach((item, index) => {
      if (cellMap.has(item.id)) {
        let obj = cellMap.get(item.id)
        obj.rowspan++
        cellMap.set(item.id, obj)
      } else {
        cellMap.set(item.id, {
          col: 2,
          row: index,
          rowspan: 1,
          // colspan: 1,
        })
      }
    })
    gridOptions.mergeCells = [...cellMap.values()]
    // gridRef.setMergeCells([...cellMap.values()])
  }
  const getList = () => {
    gridOptions.loading = true
    const data: GetBills = JSON.parse(JSON.stringify(form))
    data.year = dayjs(form.year).year()
    getBills(data).then((res) => {
      gridOptions.data = res.data
      genMergeCells()
      gridOptions.loading = false
    })
  }
  let customerInfo = $ref<{
    code: string
    id: number
    name: string
    shortName: string
  }>({
    code: undefined,
    id: undefined,
    name: undefined,
    shortName: undefined,
  })

  const { getPositionList, positionList } = useCourseClass()

  onMounted(() => {
    customerInfo = JSON.parse(decodeURI(route.query.customerInfo as string))
    form.customerId = customerInfo.id
    getPositionList()
    getList()
  })
</script>
<script lang="ts">
  export default {
    name: 'contractBillDetail',
  }
</script>

<style lang="scss" scoped></style>
