<template>
  <el-dialog
    :title="getTitle"
    v-model="dialogVisible"
    width="1000px"
    @close="close"
    @open="open"
    destroy-on-close
  >
    <el-form
      :model="form"
      :rules="rules as any"
      ref="formRef"
      label-width="100px"
      class="demo-form"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('text.full_name')" prop="name">
            <el-input v-model="form.name" :placeholder="$t('text.please_enter')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.gender')" prop="gender">
            <el-select v-model="form.gender" :placeholder="$t('text.please_select')">
              <el-option
                v-for="item in genderList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.identification_number')" prop="idNumber">
            <el-input v-model="form.idNumber" :placeholder="$t('text.please_enter')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.contact_number')" prop="phone">
            <el-input v-model="form.phone" :placeholder="$t('text.please_enter')" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="roleInfo.property == 'CUSTOMER_CONTACTOR'">
          <el-form-item :label="$t('text.customer')" prop="customerId">
            <el-select v-model="form.customerId" :placeholder="$t('text.please_select')">
              <el-option
                v-for="item in clientAllList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.account')" prop="username">
            <el-input v-model="form.username" :placeholder="$t('text.please_enter')" />
          </el-form-item>
        </el-col>
      </el-row>
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
  import { postStaffs, getStaffsDetail, putStaffsId } from '/@/api/opm/roles'
  import { ElMessage } from 'element-plus'
  import useList from './useList'
  import useCommonData from './commonData'
  interface IForm {
    gender: string
    idNumber: string
    name: string
    phone: string
    roleId: number
    username: string
    customerId: number
  }
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    name: 'ClassRoomDiaLog',
    props: {
      isShow: Boolean,
      type: {
        type: String,
        default: 'add',
      },
      id: Number,
      roleInfo: Object,
    },
    emits: ['updateData', 'update:isShow'],
    setup(props, { emit }) {
      const { t } = useI18n()
      var validateUsername = (rule, value, callback) => {
        if (
          !/[a-zA-Z0-9]{3,12}/.test(value) ||
          value.length < 3 ||
          value.length > 12 ||
          /[\u4e00-\u9fa5]/.test(value)
        ) {
          callback(new Error(t('text.please_enter_combination')))
        } else {
          callback()
        }
      }
      const { genderList } = useCommonData()
      const { roleAllList, clientAllList, getCustomersAllList } = useList()
      const formRef = ref(null)
      const dialogVisible = computed({
        get: (): boolean => props.isShow,
        set: (val: boolean) => emit('update:isShow', val),
      })
      const getTitle = computed(() => {
        return props.type == 'add' ? t('text.new_account') : t('text.modify_account_number')
      })
      const state = reactive({
        form: {
          gender: undefined,
          idNumber: undefined,
          name: undefined,
          phone: undefined,
          roleId: props.roleInfo.roleId,
          username: undefined,
          customerId: undefined,
        } as IForm,
        rules: {
          name: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          idNumber: [
            {
              required: false,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          gender: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          phone: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          username: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
            {
              validator: validateUsername,
              trigger: 'change',
            },
          ],
          customerId: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
        },
      })
      const cpdRolesList = computed(() =>
        roleAllList.value.filter((v) => v.property !== 'CUSTOMER_CONTACTOR'),
      )
      const resetForm = () => {
        formRef.value.resetFields()
      }
      const close = () => {
        resetForm()
      }
      const open = () => {
        // getRolesAllList()
        if (props.roleInfo.property == 'CUSTOMER_CONTACTOR') {
          getCustomersAllList()
        }
        if (props.type == 'edit') {
          getStaffsDetail(props.id).then((res) => {
            if (res.status == 200) {
              // if (props.roleInfo.property == "CUSTOMER_CONTACTOR") {
              //     res.data.customerId = res.data.customerId;
              // }
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
              api = postStaffs
            } else {
              api = putStaffsId
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
        cpdRolesList,
        genderList,
        clientAllList,
      }
    },
  })
</script>

<style scoped></style>
