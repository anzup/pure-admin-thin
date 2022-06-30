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
      <el-form ref="formRef" :model="form" :rules="rules" class="demo-form" label-width="110px">
        <el-form-item :label="$t('state.job_title')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('tip.please_enter')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('state.isCenterPerson')" prop="fromTrainingCenter">
          <el-switch
            v-model="form.fromTrainingCenter"
            :active-text="$t('state.yes')"
            :active-value="true"
            :inactive-text="$t('state.no')"
            :inactive-value="false"
            :width="40"
            class="switchStyle"
          ></el-switch>
        </el-form-item>
        <el-form-item :label="$t('state.remarks')" prop="remark">
          <el-input
            v-model="form.remark"
            :autosize="{ minRows: 2, maxRows: 5 }"
            :placeholder="$t('tip.please_enter')"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('button.hscancel') }}</el-button>
          <el-button type="primary" @click="confirm">{{ $t('button.hsdefine') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
  import { postRoles, getRolesDetail, putRolesId } from '/@/api/roles'
  import { ElMessage } from 'element-plus'

  interface IForm {
    name: string
    remark: string
    fromTrainingCenter: boolean
  }

  import { useI18n } from '/@/hooks/useI18n'

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
        return props.type == 'add' ? t('state.new_position') : t('state.modify_position')
      })
      const state = reactive({
        form: {
          remark: undefined,
          name: undefined,
          fromTrainingCenter: false,
        } as IForm,
        rules: {
          remark: [
            {
              required: false,
              message: t('tip.please_enter'),
              trigger: 'change',
            },
          ],
          name: [
            {
              required: true,
              message: t('tip.please_enter'),
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
          getRolesDetail(props.id).then((res) => {
            if (res.status == 200) {
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
              api = postRoles
            } else {
              api = putRolesId
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

      return {
        dialogVisible,
        getTitle,
        ...toRefs(state),
        formRef,
        close,
        confirm,
        open,
      }
    },
  })
</script>

<style scoped></style>
