<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('text.audit')"
    width="500px"
    close-on-press-escape
    :append-to-body="false"
    @close="close"
    destroy-on-close
  >
    <el-form :model="state.form" :rules="state.auditRules" ref="auditFormRef" label-width="100px">
      <el-form-item :label="$t('text.audit_results')" prop="auditValue">
        <el-radio-group v-model="state.form.auditValue">
          <el-radio label="APPROVED">{{ $t('text.disposal_is_recommended') }}</el-radio>
          <el-radio label="REJECTED">{{ $t('text.rejection_is_recommended') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- pin码 -->
      <el-form-item :label="$t('text.pin_code')" prop="pinCode">
        <el-input
          type="password"
          maxlength="6"
          :placeholder="$t('text.please_enter')"
          v-model="state.form.pinCode"
        />
      </el-form-item>
      <el-form-item :label="$t('text.illustrate')">
        <el-input type="textarea" autosize v-model="state.form.reasons" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('message.hscancel') }}</el-button>
        <el-button type="primary" @click="submitAudit">{{ $t('message.hsdefine') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import to from 'await-to-js'
  import { ElMessage } from 'element-plus'
  import { ref, computed, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { postAdditionalTrainingAudit } from '/@/api/opm/train'
  const { t } = useI18n()
  const props = defineProps({
    modelValue: Boolean,
    id: Number,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()

  const dialogVisible = computed({
    get() {
      return props.modelValue
    },
    set(val: boolean) {
      emit('update:modelValue', val)
    },
  })

  const state = reactive({
    form: {
      auditValue: undefined,
      reasons: undefined,
      pinCode: undefined,
    },
    auditRules: {
      auditValue: { required: true, message: t('text.please_select') },
      pinCode: [{ required: true, message: t('text.please_enter') }],
    },
  })
  const loadingDialog = ref(false)
  const auditFormRef = ref<ElFormInstance>()
  // 提交审核
  function submitAudit() {
    auditFormRef.value.validate(async (valid) => {
      if (valid) {
        loadingDialog.value = true
        let params = {
          id: props.id,
          status: state.form.auditValue,
          remark: state.form.reasons,
          pinCode: state.form.pinCode,
        }
        let [err] = await to(postAdditionalTrainingAudit(params))
        loadingDialog.value = false
        if (!err) {
          dialogVisible.value = false
          ElMessage.success(t('message.save_succeeded'))
          emit('updateData')
        }
      }
    })
  }
  function close() {
    auditFormRef.value.resetFields()
  }
</script>
