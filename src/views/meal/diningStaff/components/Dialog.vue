<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :title="getTitle"
    center
    destroy-on-close
    width="500px"
    @close="close"
    @open="open"
  >
    <el-form ref="formRef" :model="state.form" :rules="state.rules" label-width="80px">
      <el-form-item label-width="0px">
        <el-radio-group v-model="type">
          <el-radio-button label="frequency">{{ $t('state.frequency') }}</el-radio-button>
          <el-radio-button label="sum">{{ $t('state.sum') }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="type === 'frequency'"
        :label="$t('state.rechargeTimes')"
        prop="countConfigs"
      >
        <ul class="flex flex-warp">
          <li v-for="item in countConfigsList" :key="item.id" class="mr-4 flex-none">
            <span class="mr-2">{{ item.name }}</span>
            <el-input-number
              v-model="item.amount"
              :controls="false"
              :label="$t('tip.pleaseEnter')"
              :min="0"
              :precision="0"
              class="!w-16"
              @change="onItemAmountChange"
            />
          </li>
        </ul>
      </el-form-item>
      <el-form-item v-else :label="$t('state.rechargeSum')">
        <el-input-number
          v-model="state.form.amount"
          :controls="false"
          :label="$t('tip.pleaseEnter')"
          :min="0"
          :precision="2"
          class="!w-full"
        />
      </el-form-item>
      <el-form-item :label="$t('state.department')">
        <el-select v-model="state.form.departmentId">
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('state.effectiveTime')">
        <el-date-picker
          v-model="state.form.dateRange"
          :shortcuts="shortcuts"
          type="daterange"
          @change="onDateChange"
        />
      </el-form-item>
      <el-form-item :label="$t('state.remark')">
        <el-input
          v-model="state.form.remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          :placeholder="$t('tip.pleaseEnter')"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('buttons.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('buttons.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { ElMessage } from 'element-plus'
  import { computed, reactive, ref } from 'vue'
  import { useVModel } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { PostTransactionRecords, postTransactionRecordsBatch } from '/@/api/transactionRecords'
  import useCountConfigs from '/@/hooks/useCountConfigs'
  import dayjs from 'dayjs'
  import { transactionTypeEnum } from '/@/enums/transactionTypeEnum'
  import { payMethodEnum } from '/@/enums/payMethodEnum'
  import useDepartment from '/@/hooks/useDepartment'

  const { t } = useI18n()

  interface Prop {
    modelValue: boolean
    id: number
  }

  interface Form extends PostTransactionRecords {
    dateRange: Date[]
    countConfigs: (DefaultAllListItem & { amount: number })[]
  }

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: false,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()
  const dialogVisible = useVModel(props, 'modelValue', emit)
  const getTitle = computed(() => (!props.id ? t('buttons.hsAdd') : t('buttons.modify')))

  const type = ref('frequency')

  const state = reactive<{
    form: Form
    rules: Partial<Record<keyof Form, FormItemRule>>
  }>({
    form: {
      dateRange: [],
      countConfigs: [],
    },
    rules: {},
  })

  const onDateChange = (val: Date[] | null) => {
    if (val) {
      state.form.startTime = dayjs(val[0]).startOf('date').toDate()
      state.form.endTime = dayjs(val[1]).endOf('date').toDate()
    }
  }
  const shortcuts = [
    {
      text: t('state.permanent'),
      value: () => {
        const start = new Date()
        const end = dayjs(start).add(100, 'year').toDate()
        return [start, end]
      },
    },
  ]

  const onItemAmountChange = () => {
    state.form.countConfigs = countConfigsList.value.filter((v) => v.amount > 0)
  }

  const formRef = ref<ElFormInstance>()
  const confirm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        const { startTime, endTime, remark, amount } = state.form
        const data: PostTransactionRecords[] = state.form.countConfigs.map<PostTransactionRecords>(
          (item) => {
            const { amount, id: countConfigId } = item
            return {
              amount,
              countConfigId,
              startTime,
              endTime,
              remark,
              transactionType: transactionTypeEnum.CHARGE,
              type: payMethodEnum.COUNT,
              userId: props.id,
              departmentId: state.form.departmentId,
            }
          },
        )
        if (amount)
          data.push({
            amount,
            startTime,
            endTime,
            remark,
            transactionType: transactionTypeEnum.CHARGE,
            type: payMethodEnum.BALANCE,
            userId: props.id,
            departmentId: state.form.departmentId,
          })
        postTransactionRecordsBatch(data).then(() => {
          ElMessage.success({
            message: t('status.successfulRecharge'),

            type: 'success',
          })
          emit('updateData')
          dialogVisible.value = false
        })
      }
    })
  }

  const { countConfigsList, getCountConfigsList } = useCountConfigs()

  const { departmentList, getDepartmentList } = useDepartment()
  const open = async () => {
    await getCountConfigsList()
    await getDepartmentList()
  }
  const close = () => {
    formRef.value.resetFields()
  }
</script>
<style lang="scss" scoped></style>
