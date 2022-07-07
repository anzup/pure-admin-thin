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
    <el-form ref="formRef" :model="state.form" :rules="state.rules" label-width="100px">
      <el-form-item :label="$t('state.restaurantName')" prop="name">
        <el-input v-model="state.form.name" :placeholder="$t('tip.pleaseEnter')" />
      </el-form-item>
      <el-form-item :label="$t('state.cashierMethod')" prop="types">
        <el-checkbox-group v-model="state.form.types">
          <el-checkbox v-for="(value, key) in payMethodMap" :key="key" :label="key"
            >{{ value }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ t('buttons.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ t('buttons.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
  import { ElMessage } from 'element-plus'
  import { ref, computed, reactive } from 'vue'
  import { useVModel } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { getCanteensDetail, postCanteens, PostCanteens, putCanteensId } from '/@/api/canteens'
  import { usePayMethod } from '/@/hooks/useEnumToMap'

  interface Prop {
    modelValue: boolean
    id?: number
  }

  const { t } = useI18n()
  const { payMethodMap } = usePayMethod()

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: false,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()
  const dialogVisible = useVModel(props, 'modelValue', emit)
  const getTitle = computed(() => (!props.id ? t('buttons.hsAdd') : t('buttons.edit')))
  const state = reactive<{
    form: PostCanteens
    rules: Partial<Record<keyof PostCanteens, FormItemRule>>
  }>({
    form: {
      name: '',
      types: [],
    },
    rules: {
      types: {
        required: true,
        message: t('tip.pleaseEnter'),
        type: 'array',
      },
      name: {
        required: true,
        message: t('tip.pleaseChoose'),
      },
    },
  })
  const formRef = ref<ElFormInstance>()
  const confirm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        let api = undefined
        if (!props.id) {
          api = postCanteens
        } else {
          api = putCanteensId
        }
        api(state.form).then(() => {
          ElMessage.success({
            message: !props.id ? t('status.addedSuccessfully') : t('status.successfullyModified'),
            type: 'success',
          })
          emit('updateData')
          dialogVisible.value = false
        })
      }
    })
  }

  const open = () => {
    if (props.id) {
      getCanteensDetail(props.id).then((res) => {
        state.form = res.data
      })
    }
  }
  const close = () => {
    formRef.value.resetFields()
  }
</script>
<style lang="scss" scoped></style>
