<template>
  <el-dialog
    :title="getTitle"
    v-model="dialogVisible"
    width="600px"
    @close="close"
    @open="open"
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="demo-form">
      <el-form-item :label="$t('text.facility_name')" prop="name">
        <el-input v-model="form.name" :placeholder="$t('text.please_enter')" />
      </el-form-item>
      <el-form-item :label="$t('text.facility_type')" prop="resourceId">
        <el-select v-model="form.resourceId" :placeholder="$t('text.please_select')">
          <el-option
            v-for="item in resourcesList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('text.facility_location')" prop="location">
        <el-input v-model="form.location" :placeholder="$t('text.please_enter')" />
      </el-form-item>

      <el-form-item :label="$t('text.remark_information')" prop="remark">
        <el-input type="textarea" v-model="form.remark" :placeholder="$t('text.please_enter')" />
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
  import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
  import { postFacilities, getFacilitiesDetail, putFacilitiesId } from '/@/api/opm/device'

  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import useResources from '/@/commonTs/resources'
  const props = defineProps({
    modelValue: Boolean,
    type: {
      type: String,
      default: 'add',
    },
    id: Number,
  })
  const emit = defineEmits(['updateData', 'update:modelValue'])

  const { t } = useI18n()
  const formRef = ref(null)
  const dialogVisible = computed({
    get: (): boolean => {
      console.log(props.modelValue)

      return props.modelValue
    },
    set: (val: boolean) => emit('update:modelValue', val),
  })
  const getTitle = computed(() => {
    return props.type == 'add' ? t('text.additional_facilities') : t('text.modify_other_facilities')
  })
  const state = reactive({
    form: {
      name: undefined,
      resourceId: undefined,
      location: undefined,
      remark: undefined,
    },
    rules: {
      name: [
        {
          required: true,
          message: t('text.please_enter'),
          trigger: 'change',
        },
      ],
      resourceId: [
        {
          required: true,
          message: t('text.please_select'),
          trigger: 'change',
        },
      ],
      location: [
        {
          required: false,
          message: t('text.please_enter'),
          trigger: 'change',
        },
      ],
      remark: [
        {
          required: false,
          message: t('text.please_enter'),
          trigger: 'change',
        },
      ],
    },
  })

  const { form, rules } = toRefs(state)
  const resetForm = () => {
    formRef.value.resetFields()
  }
  const close = () => {
    resetForm()
  }

  const { getResourcesNormalList, resourcesList } = useResources()
  const open = () => {
    getResourcesNormalList()

    if (props.type == 'edit') {
      getFacilitiesDetail(props.id).then((res) => {
        if (res.status == 200) {
          res.data.resourceId = res.data?.resource.id
          state.form = res.data
        }
      })
    }
  }
  const confirm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        let api = undefined
        if (props.type == 'add') {
          api = postFacilities
        } else {
          api = putFacilitiesId
        }
        api(state.form).then((res) => {
          const { status } = res
          if (status == 200) {
            ElMessage.success({
              message:
                props.type == 'add'
                  ? t('message.successfully_added')
                  : t('message.modified_successfully'),
              type: 'success',
            })
            emit('updateData')
            dialogVisible.value = false
          }
        })
      } else {
        return false
      }
    })
  }
</script>

<style scoped></style>
