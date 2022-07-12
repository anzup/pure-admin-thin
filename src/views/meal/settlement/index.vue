<template>
  <VxeTable v-model:form="form" v-bind="gridOptions" @handlePageChange="handlePageChange">
    <template #form>
      <el-form ref="headerFormRef" :model="form">
        <el-form-item prop="subsystem">
          <el-radio-group v-model="payMethod" class="mr-4">
            <el-radio v-for="item in payMethodList" :key="item" :label="item">
              {{ payMethodMap[item] }}
            </el-radio>
          </el-radio-group>
          <el-input-number
            v-if="payMethod === payMethodEnum.BALANCE"
            v-model="amount"
            :controls="false"
            :label="$t('tip.pleaseEnter')"
            :min="0"
            :precision="2"
            class="!w-20"
            @blur="inputFocus"
            @change="inputFocus"
            @clear="inputFocus"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            ref="inputRef"
            v-model="barcode"
            :disabled="loading"
            @change="postConsumeCodes"
          />
        </el-form-item>
        <div class="flex">
          <el-form-item class="mr-4" prop="searchKey">
            <el-input
              v-model="form.searchKey"
              :placeholder="$t('tip.keywordToSearch')"
              class="width180"
              clearable
              @blur="inputFocus"
              @change="inputFocus"
              @clear="inputFocus"
            />
          </el-form-item>
          <el-form-item>
            <FormBtn @submit="submit" />
          </el-form-item>
        </div>
      </el-form>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { onMounted, reactive, ref } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  // import DiaLog from './components/Dialog.vue'
  import { setPage } from '/@/utils/utils'
  import type { FormInstance, InputInstance } from 'element-plus'
  import { useI18n } from '/@/hooks/useI18n'
  import {
    getTransactionRecordsList,
    postConsumeCodesUse,
    postTransactionRecordsRevoke,
    TransactionRecords,
  } from '/@/api/transactionRecords'
  import { useUserStoreHook } from '/@/store/modules/user'
  import { usePayMethod } from '/@/hooks/useEnumToMap'
  import { transactionTypeEnum } from '/@/enums/transactionTypeEnum'
  import { payMethodEnum } from '/@/enums/payMethodEnum'
  import { getCanteensDetail } from '/@/api/canteens'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const { t } = useI18n()

  const userStore = useUserStoreHook()
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
      {
        title: t('state.operation'),
        width: 120,
        field: 'operationTypes',
        cellRender: {
          name: 'buttons',
          props: {
            buttons: ({ row }) =>
              [
                {
                  name: t('state.revoke'),
                  disabled: row?.revoked,
                  event: ({ row }) => {
                    ElMessageBox.confirm(t('tip.cancelConsumptionRecords'), t('state.tip'), {
                      type: 'warning',
                    })
                      .then(() => {
                        return postTransactionRecordsRevoke(row.id)
                      })
                      .then(() => {
                        ElMessage.success(t('status.undoSucceeded'))
                        getList()
                      })
                      .catch(() => {})
                  },
                },
              ] as ButtonArr,
          },
        },
      },
    ],
    loading: false,
    rowClassName: ({ row }) => {
      return row.revoked ? 'revoked' : ''
    },
  })
  const form = reactive<TransactionRecords>({
    page: 1,
    size: 10,
    total: 0,
    canteenId: userStore.userInfo?.user?.canteen.id,
    transactionType: transactionTypeEnum.CONSUME,
  })

  const amount = ref<number>()
  const barcode = ref<string>()

  const getList = async () => {
    gridOptions.loading = true
    getTransactionRecordsList(form).then((res) => {
      gridOptions.data = res.data.content
      form.total = res.data.totalElements
      gridOptions.loading = false
    })
    inputFocus()
  }
  const headerFormRef = ref<FormInstance>()

  const inputRef = ref<InputInstance>()
  const inputFocus = () => {
    if (inputRef.value) inputRef.value.focus()
  }
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

  const loading = ref(false)
  const postConsumeCodes = () => {
    loading.value = true
    postConsumeCodesUse({
      canteenId: userStore.userInfo?.user?.canteen?.id,
      amount: payMethod.value === payMethodEnum.COUNT ? 1 : amount.value,
      code: barcode.value,
      type: payMethod.value,
    })
      .then(() => {
        getList()
      })
      .finally(() => {
        loading.value = false
        barcode.value = undefined
      })
  }

  const payMethod = ref<string>()

  const payMethodList = ref<string[]>([])

  onMounted(() => {
    console.log(userStore.userInfo)
    if (userStore.userInfo?.user?.canteen?.id) {
      getCanteensDetail(userStore.userInfo?.user?.canteen?.id).then((res) => {
        payMethodList.value = res.data.types
        payMethod.value = payMethodList.value[0]
      })
    }
    getList()
  })
</script>

<style scoped>
  :deep(.revoked) {
    background-color: var(--el-color-danger-light-9);
  }
</style>
