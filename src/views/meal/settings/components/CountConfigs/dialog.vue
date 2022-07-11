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
      <el-form-item :label="$t('state.timesName')" prop="name">
        <el-input v-model="state.form.name" :placeholder="$t('tip.pleaseEnter')" />
      </el-form-item>
      <el-form-item :label="$t('state.applicableMeals')" prop="mealTimeIds">
        <el-checkbox-group v-model="state.form.mealTimeIds">
          <el-checkbox v-for="(item, key) in mealTimesList" :key="key" :label="item.id"
            >{{ item.name }}
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
  import {
    getCountConfigsDetail,
    postCountConfigs,
    PostCountConfigs,
    putCountConfigsId,
  } from '/@/api/countConfigs'
  import useMealTimes from '/@/hooks/useMealTimes'

  interface Prop {
    modelValue: boolean
    id?: number
  }

  const { t } = useI18n()

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
    form: PostCountConfigs
    rules: Partial<Record<keyof PostCountConfigs, FormItemRule>>
  }>({
    form: {
      name: '',
      mealTimeIds: [],
    },
    rules: {
      mealTimeIds: {
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
          api = postCountConfigs
        } else {
          api = putCountConfigsId
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

  const { mealTimesList, getMealTimesList } = useMealTimes()

  const open = () => {
    getMealTimesList()
    if (props.id) {
      getCountConfigsDetail(props.id).then((res) => {
        state.form = res.data
      })
    }
  }
  const close = () => {
    formRef.value.resetFields()
  }
</script>
<style lang="scss" scoped></style>
