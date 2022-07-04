<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="getTitle"
      center
      destroy-on-close
      width="500px"
      @close="close"
      @open="open"
    >
      <el-form ref="formRef" :model="form" :rules="rules" class="demo-form" label-width="80px">
        <el-form-item :label="$t('state.departmentName')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('tip.pleaseEnter')" />
        </el-form-item>
        <el-form-item :label="$t('state.owningSystem')" prop="subsystem">
          <el-select v-model="form.subsystem" :placeholder="$t('tip.pleaseChoose')">
            <el-option
              v-for="(value, key) in subsystemMap"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('buttons.cancel') }}</el-button>
          <el-button type="primary" @click="confirm">{{ $t('buttons.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useI18n } from '/@/hooks/useI18n'
  import {
    getDepartmentsDetail,
    PostDepartment,
    postDepartments,
    putDepartmentsId,
  } from '/@/api/departments'
  import useDepartment from '/@/hooks/useDepartment'

  export default defineComponent({
    name: 'RolesDiaLog',
    props: {
      isShow: Boolean,
      type: {
        type: String,
        default: 'add',
      },
      id: Number,
    },
    emits: ['updateData', 'update:isShow'],
    setup(props, { emit }) {
      const { t } = useI18n()
      const formRef = ref(null)
      const dialogVisible = computed({
        get: (): boolean => props.isShow,
        set: (val: boolean) => emit('update:isShow', val),
      })
      const getTitle = computed(() => {
        return props.type == 'add' ? t('state.newPosition') : t('state.modifyPosition')
      })

      const { subsystemMap } = useDepartment()
      const state = reactive<{
        form: PostDepartment
        rules: Partial<Record<keyof PostDepartment, FormItemRule>>
      }>({
        form: {
          subsystem: undefined,
          name: undefined,
        },
        rules: {
          subsystem: [
            {
              required: true,
              message: t('tip.pleaseChoose'),
              trigger: 'change',
            },
          ],
          name: [
            {
              required: true,
              message: t('tip.pleaseEnter'),
              trigger: 'change',
            },
          ],
        },
      })
      const resetForm = () => {
        formRef.value.resetFields()
      }
      const close = () => {
        resetForm()
      }
      const open = () => {
        if (props.type == 'edit') {
          getDepartmentsDetail(props.id).then((res) => {
            if (res.status == 200) {
              state.form = res.data
            }
          })
        }
      }
      const confirm = () => {
        formRef.value.validate((valid: boolean) => {
          if (valid) {
            let api
            if (props.type == 'add') {
              api = postDepartments
            } else {
              api = putDepartmentsId
            }
            api(state.form).then((res) => {
              const { status } = res
              if (status == 200) {
                ElMessage.success({
                  message:
                    props.type == 'add'
                      ? t('status.addedSuccessfully')
                      : t('status.successfullyModified'),
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

      return {
        dialogVisible,
        getTitle,
        ...toRefs(state),
        formRef,
        close,
        confirm,
        open,
        subsystemMap,
      }
    },
  })
</script>

<style scoped></style>
