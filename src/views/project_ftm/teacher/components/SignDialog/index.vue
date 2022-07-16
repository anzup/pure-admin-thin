<template>
  <!-- 签名码 -->
  <el-dialog
    center
    width="400px"
    top="30vh"
    :title="t('table.sign')"
    :modal="false"
    :close-on-click-modal="false"
    v-model="signDialogVisible"
    @close="closeDialog"
    @closed="fresh"
  >
    <el-form :inline="true" ref="formRef" label-width="100px" :rules="pinRules" :model="form">
      <el-form-item :label="t('table.pinCode')" prop="pinCode">
        <el-input
          type="password"
          v-model="form.pinCode"
          :placeholder="t('holder.pleaseEnterSignPinCode')"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleDialogCancel" type="primary" plain size="medium">{{
        t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handDialogConfirm" :loading="loadingDialog">{{
        t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  interface Props {
    modelValue: boolean
    id: number | string
    loadingDialog: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    id: null,
    loadingDialog: false,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'handleConfirm', value: unknown): void
    (e: 'update:loadingDialog', value: boolean): void
  }>()
  const signDialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => {
      emit('update:modelValue', val)
    },
  })

  const form = reactive({
    pinCode: '',
  })
  const formRef = ref()
  const pinRules = reactive({
    pinCode: [{ required: true, message: t('holder.pleaseEnterSignPinCode'), trigger: 'click' }],
  })

  // 取消按钮（签名码）
  const handleDialogCancel = () => {
    emit('update:modelValue', false)
  }
  // 确定按钮（签名码）
  const handDialogConfirm = () => {
    formRef.value.validate((bool) => {
      if (bool) {
        emit('handleConfirm', form)
      }
    })
  }
  const closeDialog = () => {
    emit('update:loadingDialog', false)
  }
  const fresh = () => {
    form.pinCode = ''
  }
</script>
