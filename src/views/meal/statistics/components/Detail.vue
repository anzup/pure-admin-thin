<template>
  <VxeTable v-model:form="form" v-bind="gridOptions" @handlePageChange="handlePageChange">
    <template #form>
      <el-form ref="headerFormRef" :model="form" class="header-form" inline>
        <el-form-item :label="$t('state.diningTime')">
          <el-date-picker v-model="form.dateRange" :clearable="false" type="daterange" />
        </el-form-item>
        <el-form-item :label="$t('state.airline')">
          <el-select v-model="form.customerId" :placeholder="$t('tip.pleaseChoose')">
            <el-option
              v-for="item in customerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('state.department')">
          <el-select v-model="form.departmentId" :placeholder="$t('tip.pleaseChoose')">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('state.restaurantName')">
          <el-select v-model="form.canteenId" :placeholder="$t('tip.pleaseChoose')">
            <el-option
              v-for="item in canteensList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('state.paymentMethod')">
          <el-select v-model="form.type" :placeholder="$t('tip.pleaseChoose')">
            <el-option
              v-for="(value, key) in payMethodMap"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('state.typeOfMeal')">
          <el-select v-model="form.mealTimeId" :placeholder="$t('tip.pleaseChoose')">
            <el-option
              v-for="item in mealTimesList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { setPage } from '/@/utils/utils'
  import type { FormInstance } from 'element-plus'
  import { useI18n } from '/@/hooks/useI18n'
  import { getTransactionRecordsList, TransactionRecords } from '/@/api/transactionRecords'

  import { usePayMethod } from '/@/hooks/useEnumToMap'
  import { transactionTypeEnum } from '/@/enums/transactionTypeEnum'
  import { payMethodEnum } from '/@/enums/payMethodEnum'
  import { useCustomers } from '/@/hooks/useOtherList'
  import useDepartment from '/@/hooks/useDepartment'
  import useCanteens from '/@/hooks/useCanteens'
  import useMealTimes from '/@/hooks/useMealTimes'
  import {
    listenerDetailChange,
    removeDetailChangeListener,
  } from '/@/views/meal/statistics/ts/detailChange'

  const { t } = useI18n()

  const { payMethodMap } = usePayMethod()

  const gridOptions = reactive<VxeTableAllProps>({
    height: 'auto',
    columns: [
      { type: 'seq', width: 60, title: t('state.seq') },
      {
        field: 'user.name',
        title: t('state.fullName'),
        minWidth: 100,
      },
      {
        field: 'user.phone',
        title: t('state.phoneNumber'),
        minWidth: 100,
      },
      {
        field: 'mealTime.name',
        title: t('state.typeOfMeal'),
      },
      {
        field: 'type',
        title: t('state.paymentMethod'),
        formatter: ({ cellValue }) => payMethodMap[cellValue] ?? '',
      },
      {
        field: 'amount',
        title: t('state.amountOfConsumption'),
        formatter: ({ cellValue, row }) => {
          return (
            cellValue +
            ' ' +
            (row.type === payMethodEnum.COUNT ? t('state.secondary') : t('state.dollar'))
          )
        },
      },
      {
        field: 'createdDate',
        title: t('state.diningTime'),
        formatter: 'formatDateTime',
      },
    ],
    loading: false,
  })

  const form = reactive<TransactionRecords & { dateRange?: Date[] }>({
    page: 1,
    size: 10,
    total: 0,
    transactionType: transactionTypeEnum.CONSUME,
  })
  listenerDetailChange((data) => {
    Object.assign(form, { ...(data || {}), page: 1 })
    form.dateRange = [form.createdDateGE, form.createdDateLE]
    getList()
  }, false)

  const getList = async () => {
    gridOptions.loading = true
    getTransactionRecordsList(form).then((res) => {
      gridOptions.data = res.data.content
      form.total = res.data.totalElements
      gridOptions.loading = false
    })
  }
  const headerFormRef = ref<FormInstance>()

  const submit = (val: string) => {
    if (val == 'reset') {
      headerFormRef.value.resetFields()
    }
    form.page = 1
    getList()
  }

  const handlePageChange = (val) => {
    if (val.type == 'size') {
      form.page = setPage(form.total, form)
    }
    getList()
  }

  const { getCustomersList, customerList } = useCustomers()
  const { getDepartmentList, departmentList } = useDepartment()
  const { getCanteensList, canteensList } = useCanteens()
  const { getMealTimesList, mealTimesList } = useMealTimes()

  onMounted(() => {
    getCustomersList()
    getMealTimesList()
    getDepartmentList()
    getCanteensList()
    getList()
  })
  onBeforeUnmount(() => {
    removeDetailChangeListener()
  })
</script>

<style scoped></style>
