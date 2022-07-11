<template>
  <el-dialog
    :title="$t('text.select_completion_type')"
    v-model="isShow"
    width="400px"
    destroy-on-close
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      class="demo-ruleForm"
      label-width="100px"
    >
      <el-form-item prop="graduateType" :label="$t('text.type_of_completion')">
        <el-select
          v-model="ruleForm.graduateType"
          :placeholder="$t('text.please_select')"
          @change="graduateTypeChange"
        >
          <el-option :label="$t('text.normal_completion')" value="NORMAL" />
          <el-option :label="$t('text.abnormal_completion')" value="ABNORMAL" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('text.remarks')"
        prop="graduateRemark"
        :rules="[
          {
            required: ruleForm.graduateType == 'ABNORMAL',
            message: $t('text.please_enter'),
            trigger: 'change',
          },
        ]"
      >
        <el-input type="textarea" v-model="ruleForm.graduateRemark" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShow = false">{{ $t('message.hscancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('message.hsdefine') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { ElMessage } from 'element-plus'
  import { computed, defineComponent, PropType, inject, reactive, toRefs } from 'vue'
  import { postStudentsGraduate } from '/@/api/opm/roles'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    name: 'Graduation',
    props: {
      ids: Array as PropType<number[]>,
      modelValue: Boolean,
    },
    emits: ['update:modelValue', 'updateData'],
    setup(props, { emit }) {
      const { t } = useI18n()
      const clazzId = inject<string>('clazzId')
      const state = reactive({
        ruleForm: {
          graduateType: undefined,
          graduateRemark: undefined,
        },
        rules: {
          graduateType: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          // graduateRemark: [
          //     {
          //         required: true,
          //         message: t("text.please_enter"),
          //         trigger: "change",
          //     },
          // ],
        },
        formRef: undefined,
      })
      const isShow = computed<boolean>({
        get: () => props.modelValue,
        set: (val) => {
          emit('update:modelValue', val)
        },
      })
      const submitForm = () => {
        state.formRef.validate((valid) => {
          if (valid) {
            graduate()
          } else {
            return false
          }
        })
      }
      const graduate = () => {
        postStudentsGraduate({
          clazzId,
          ids: props.ids,
          graduate: true,
          ignoreNotFinished: props.ids?.length > 1,
          ...state.ruleForm,
        }).then(() => {
          ElMessage.success(t('message.operation_succeeded'))
          emit('updateData')
          isShow.value = false
        })
      }
      const graduateTypeChange = () => {
        state.ruleForm.graduateRemark = undefined
        state.formRef.clearValidate()
      }
      return {
        isShow,
        ...toRefs(state),
        submitForm,
        graduateTypeChange,
      }
    },
  })
</script>

<style scoped></style>
