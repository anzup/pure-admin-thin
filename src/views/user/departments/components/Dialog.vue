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
        <el-form-item :label="$t('state.positionName')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('tip.pleaseEnter')" />
        </el-form-item>
        <el-form-item :label="$t('state.positionName')" prop="name">
          <el-select v-model="form">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
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
  import { postRoles, getRolesDetail, putRolesId } from '/@/api/roles'
  import { ElMessage } from 'element-plus'
  import { useI18n } from '/@/hooks/useI18n'
  import { departmentList } from '/@/enums/departmentEnum'

  interface IForm {
    name: string
    remark: string
    fromTrainingCenter: boolean
  }

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
      const state = reactive({
        form: {
          remark: undefined,
          name: undefined,
        } as IForm,
        rules: {
          remark: [
            {
              required: false,
              message: t('tip.pleaseEnter'),
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
        console.log(departmentList)
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
      }
    },
  })
</script>

<style scoped></style>
