<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('text.handle_make_up_training')"
    width="500px"
    close-on-press-escape
    :append-to-body="false"
    @close="close"
    destroy-on-close
  >
    <el-form :model="state.form" :rules="state.auditRules" ref="auditFormRef" label-position="top">
      <el-form-item prop="auditType">
        <el-radio-group v-model="state.form.auditType">
          <el-radio label="ADDITION">{{ $t('text.handle_make_up_training') }}</el-radio>
          <!-- <el-radio label="NORMAL_GRADUATE ">正常结训</el-radio> -->
          <el-radio label="ABNORMAL_GRADUATE">{{ $t('text.abnormal_training') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 异常结训说明 -->
      <el-form-item
        :label="$t('text.explanation_of_abnormal_training')"
        prop="auditRemark"
        v-if="state.form.auditType == 'ABNORMAL_GRADUATE'"
      >
        <el-input
          v-model="state.form.auditRemark"
          :autosize="{
            minRows: 2,
            maxRows: 5,
          }"
          :placeholder="$t('text.please_enter')"
          type="textarea"
          :rows="3"
        />
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
  import { postFlightExamRecordsAudit } from '/@/api/opm/train'
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
      auditRemark: undefined,
      auditType: undefined,
      pinCode: undefined,
    },
    auditRules: {
      auditType: [{ required: true, message: `${t('text.please_enter')}` }],
      auditRemark: [{ required: true, message: `${t('text.please_select')}` }],
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
          ...state.form,
        }
        let [err] = await to(postFlightExamRecordsAudit(params))
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
