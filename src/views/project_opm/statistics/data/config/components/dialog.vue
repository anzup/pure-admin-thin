<template>
  <el-dialog
    :title="getTitle"
    v-model="dialogVisible"
    width="500px"
    @close="close"
    @open="open"
    destroy-on-close
  >
    <el-form
      :model="state.form"
      :rules="state.rules"
      ref="formRef"
      label-width="120px"
      class="demo-form"
    >
      <el-form-item :label="$t('text.shift_name')" prop="name">
        <el-input v-model="state.form.name" :placeholder="$t('text.please_enter')" />
      </el-form-item>
      <el-form-item :label="$t('text.start_time')" prop="startDate">
        <el-time-picker
          v-model="state.form.startDate"
          value-format="HH:mm"
          format="HH:mm"
          :placeholder="$t('text.please_select')"
          :default-value="defaultValue"
        />
      </el-form-item>
      <el-form-item :label="$t('text.end_time')" prop="endDate">
        <el-time-picker
          v-model="state.form.endDate"
          value-format="HH:mm"
          format="HH:mm"
          :placeholder="$t('text.please_select')"
          :default-value="defaultValue"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('message.hscancel') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ $t('message.hsdefine') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue'
  import { postSpecialTime, putSpecialTime } from '/@/api/opm/controlPanel'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import dayjs from 'dayjs'
  interface IForm {
    name: string
    startDate: string
    endDate: string
    id?: number
  }

  const props = defineProps({
    modelValue: Boolean,
    rowData: Object as PropType<any>,
  })
  const emit = defineEmits(['updateData', 'update:modelValue'])
  const { t } = useI18n()
  const formRef = ref(null)
  const dialogVisible = computed({
    get: (): boolean => props.modelValue,
    set: (val: boolean) => emit('update:modelValue', val),
  })
  const getTitle = computed(() => {
    return !props.rowData ? t('message.hsadd') : t('message.modify')
  })
  const state = reactive({
    form: {
      name: undefined,
      startDate: undefined,
      endDate: undefined,
      id: undefined,
    } as IForm,
    rules: {
      startDate: [
        {
          required: true,
          message: t('text.please_select'),
          trigger: 'blur',
        },
      ],
      endDate: [
        {
          required: true,
          message: t('text.please_select'),
          trigger: 'blur',
        },
      ],

      name: [
        {
          required: true,
          message: t('text.please_enter'),
          trigger: 'blur',
        },
      ],
    },
  })

  const resetForm = () => {
    state.form = {
      name: undefined,
      startDate: undefined,
      endDate: undefined,
      id: undefined,
    }
    defaultValue.value = undefined
  }

  const close = () => {
    resetForm()
  }
  const defaultValue = ref()
  const open = () => {
    defaultValue.value = dayjs().startOf('day').toDate()
    if (props.rowData) {
      const data = JSON.parse(JSON.stringify(props.rowData))
      data.startDate = dayjs(data.startDate).format('HH:mm')
      data.endDate = dayjs(data.endDate).format('HH:mm')
      state.form = data
    }
  }
  const confirm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        const api = !props.rowData ? postSpecialTime : putSpecialTime
        const data = state.form
        data.startDate = dayjs(
          dayjs().format('YYYY-MM-DD ') + state.form.startDate + ':00',
        ).toString()
        data.endDate = dayjs(dayjs().format('YYYY-MM-DD ') + state.form.endDate + ':00').toString()
        api(state.form).then((res) => {
          ElMessage.success(
            !props.rowData ? t('message.successfully_added') : t('message.modified_successfully'),
          )
          dialogVisible.value = false
          emit('updateData')
        })
      } else {
        return false
      }
    })
  }
</script>

<style scoped></style>
