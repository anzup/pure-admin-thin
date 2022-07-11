<template>
  <el-dialog
    :title="getTitle"
    v-model="dialogVisible"
    width="500px"
    @close="close"
    @open="open"
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="demo-form">
      <el-form-item :label="$t('text.position_attribute')" prop="property">
        <el-select v-model="form.property" :placeholder="$t('text.please_select')">
          <el-option
            v-for="type in propertyList"
            :key="type.id"
            :label="type.name"
            :value="type.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('text.job_title')" prop="name">
        <el-input v-model="form.name" :placeholder="$t('text.please_enter')" />
      </el-form-item>

      <el-form-item :label="$t('text.job_description')" prop="decription">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          v-model="form.decription"
          :placeholder="$t('text.please_enter')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('message.hscancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('message.hsdefine') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
  import { postRoles, getRolesDetail, putRolesId, getRolesPropertyAll } from '/@/api/opm/roles'
  import { ElMessage } from 'element-plus'
  interface IForm {
    name: string
    decription: string
    property: string
  }
  import { useI18n } from 'vue-i18n'
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
        return props.type == 'add' ? t('text.new_position') : t('text.modify_position')
      })
      const state = reactive({
        form: {
          decription: undefined,
          name: undefined,
          property: undefined,
        } as IForm,
        rules: {
          property: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          decription: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],

          name: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
        },
        propertyList: [],
      })
      const resetForm = () => {
        formRef.value.resetFields()
      }
      const getPropertyList = () => {
        getRolesPropertyAll().then((res) => {
          state.propertyList = res.data
        })
      }
      const close = () => {
        resetForm()
      }
      const open = () => {
        getPropertyList()
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
