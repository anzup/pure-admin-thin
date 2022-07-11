<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :title="getTitle"
    center
    destroy-on-close
    width="400px"
    @close="close"
    @open="open"
  >
    <el-form ref="formRef" :model="state.form" :rules="state.rules" label-width="50px">
      <el-form-item :label="$t('state.name')" prop="name">
        <el-input v-model="state.form.name" :placeholder="$t('tip.pleaseEnter')" />
      </el-form-item>
      <el-form-item :label="$t('state.period')" prop="timeRange">
        <DatePicker
          v-model:value="state.form.timeRange"
          :popup-style="{
            zIndex: 10000,
          }"
          format="HH:mm"
          range
          type="time"
        />
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
  import DatePicker from 'vue-datepicker-next'
  import { ref, computed, reactive } from 'vue'
  import { useVModel } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { getMealTimesDetail, postMealTimes, PostMealTime, putMealTimesId } from '/@/api/mealTimes'
  import dayjs from 'dayjs'

  interface Prop {
    modelValue: boolean
    id?: number
  }

  export interface Form {
    name: string
    timeRange: Date[]
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
    form: Form
    rules: Partial<Record<keyof Form, FormItemRule>>
  }>({
    form: {
      name: '',
      timeRange: [],
    },
    rules: {
      timeRange: {
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
          api = postMealTimes
        } else {
          api = putMealTimesId
        }

        const data: PostMealTime & { id: number } = {
          name: state.form.name,
          startMinute:
            dayjs(state.form.timeRange[0]).hour() * 60 + dayjs(state.form.timeRange[0]).minute(),
          endMinute:
            dayjs(state.form.timeRange[1]).hour() * 60 + dayjs(state.form.timeRange[1]).minute(),
          id: state.form.id,
        }
        api(data).then(() => {
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
      getMealTimesDetail(props.id).then((res) => {
        state.form.name = res.data.name
        state.form.timeRange = [
          dayjs().startOf('date').add(res.data.startMinute, 'minutes').toDate(),
          dayjs().startOf('date').add(res.data.endMinute, 'minutes').toDate(),
        ]
        state.form.id = res.data.id
      })
    }
  }
  const close = () => {
    formRef.value.resetFields()
  }
</script>
<style lang="scss" scoped></style>
