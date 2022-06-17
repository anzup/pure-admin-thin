<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :title="'结算周期设置'"
    center
    destroy-on-close
    width="500px"
    @close="close"
    @open="open"
  >
    <el-form ref="formRef" :model="state.form" :rules="state.rules" label-width="80px">
      <el-form-item label="结算方式" prop="billPeriodType">
        <el-select v-model="state.form.billPeriodType">
          <el-option v-for="item in cycleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="结算时长" prop="num">
        <el-input-number v-model="state.form.num" :min="1" :precision="0" />
      </el-form-item>
      <el-form-item label="结算周期" prop="originalDate">
        <div class="w-full flex">
          <el-date-picker v-model="state.form.originalDate" :disabled="isDisabled" />
          <span class="mx-4">{{ t('state.to') }}</span>
          <el-date-picker v-model="endDate" disabled />
        </div>
      </el-form-item>
    </el-form>
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
  import { reactive, ref } from 'vue'
  import { useVModel } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { BillPeriodSettings, getBillPeriodSettings, postBillPeriodSettings } from '/@/api/bills'
  import dayjs from 'dayjs'

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
  const state = reactive<{
    form: BillPeriodSettings
    rules: Partial<Record<keyof BillPeriodSettings, FormItemRule>>
  }>({
    form: {
      num: 1,
      billPeriodType: 'MONTH',
      originalDate: undefined,
    },
    rules: {
      num: {
        required: true,
        message: t('tip.please_enter'),
        trigger: 'blur',
      },
      billPeriodType: {
        required: true,
        message: t('tip.please_select'),
        trigger: 'blur',
      },
      originalDate: {
        required: true,
        message: t('tip.please_select'),
        trigger: 'blur',
      },
    },
  })

  const cycleList: DefaultAllListItem<string>[] = [
    {
      id: 'YEAR',
      name: t('moments.year'),
    },
    {
      id: 'MONTH',
      name: t('moments.month'),
    },
    {
      id: 'WEEK',
      name: t('moments.week'),
    },
    {
      id: 'DAY',
      name: t('moments.day'),
    },
  ]
  const endDate = $computed<Date>(() => {
    if (state.form.num && state.form.originalDate)
      return dayjs(state.form.originalDate)
        .add(
          state.form.billPeriodType === 'DAY' ? state.form.num * 24 : state.form.num,
          state.form.billPeriodType === 'DAY'
            ? 'h'
            : (state.form.billPeriodType.toLowerCase() as any),
        )
        .subtract(24, 'h')
        .toDate()
    else return undefined
  })

  const formRef = ref<ElFormInstance>()
  const confirm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        postBillPeriodSettings(state.form).then(() => {
          t('message.modified_successfully')
          close()
          dialogVisible.value = false
          emit('updateData')
        })
      }
    })
  }

  let isDisabled = $ref(true)

  const open = () => {
    getBillPeriodSettings().then((res) => {
      isDisabled = !!res.data.originalDate
      state.form = res.data || { num: 1, billPeriodType: 'MONTH', originalDate: undefined }
    })
  }
  const close = () => {
    formRef.value.resetFields()
  }
</script>
<style lang="scss" scoped></style>
