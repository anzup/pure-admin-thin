<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :title="getTitle"
      center
      destroy-on-close
      width="750px"
      @close="close"
      @open="open"
    >
      <el-form ref="formRef" :model="form" :rules="rules" class="demo-form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('state.job')" prop="roleIds">
              <el-checkbox-group v-model="form.roleIds" @change="roleChange">
                <el-checkbox v-for="(item, index) in roleAllList" :key="index" :label="item.roleId"
                  >{{ item.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('state.full_name')" prop="name">
              <el-input v-model="form.name" :placeholder="$t('tip.please_enter')"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('state.gender')" prop="gender">
              <el-select v-model="form.gender" :placeholder="$t('tip.please_select')">
                <el-option
                  v-for="item in genderList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="hasTeacherRole" :span="12">
            <el-form-item :label="$t('state.teacherTeam')" prop="teamId">
              <el-select v-model="form.teamId" :placeholder="$t('tip.please_select')">
                <el-option
                  v-for="item in teacherTeamsList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('state.supervisor')" prop="supervisor">
              <el-select v-model="form.supervisor" :placeholder="$t('tip.please_select')">
                <el-option
                  v-for="item in booleanList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="hasTeacherRole" :span="12">
            <el-form-item :label="$t('state.type_of_teacher')" prop="teacherTypeId">
              <el-select v-model="form.teacherTypeId" :placeholder="$t('tip.please_select')">
                <el-option
                  v-for="item in teacherTypesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('state.identification_number')" prop="idNumber">
              <el-input v-model="form.idNumber" :placeholder="$t('tip.please_enter')"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('state.phone_number')" prop="phone">
              <el-input v-model="form.phone" :placeholder="$t('tip.please_enter')"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('state.loginName')" prop="username">
              <el-input v-model="form.username" :placeholder="$t('tip.please_enter')"></el-input>
              <text class="tip-red">{{ $t('state.originalPassword') }}：111111</text>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('state.landline_number')" prop="landline">
              <el-input v-model="form.landline" :placeholder="$t('tip.please_enter')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('state.email')" prop="email">
              <el-input v-model="form.email" :placeholder="$t('tip.please_enter')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('state.remarks')" prop="remark">
              <el-input
                v-model="form.remark"
                :placeholder="$t('tip.please_enter')"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('button.hscancel') }}</el-button>
          <el-button :loading="loading" type="primary" @click="confirm">{{
            $t('button.hsdefine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
  import { ElMessage } from 'element-plus'
  import useList from '/@/hooks/useUser'
  import useCommon from '/@/hooks/useCommon'
  import useTeacher from '/@/hooks/teacher'
  import { useI18n } from '/@/hooks/useI18n'
  import { getUsersDetail, postUsers, putUsersId } from '/@/api/user'

  interface IForm {
    gender: string
    idNumber: string
    name: string
    phone: string
    roleId: number
    username: string
    customerId: number
    landline: string
    email: string
    remark: string
    teacherTypeId: number
    teamId: number
    roleIds: Array<string>
    supervisor: boolean
  }

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
      const hasTeacherRole = ref(false)
      const validateUsername = (rule, value, callback) => {
        if (
          !/[a-zA-Z0-9]{3,12}/.test(value) ||
          value.length < 3 ||
          value.length > 12 ||
          /[\u4e00-\u9fa5]/.test(value)
        ) {
          callback(new Error(t('tip.please_enter_combination')))
        } else {
          callback()
        }
      }
      const validateIdentify = (rule, value, callback) => {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!value) {
          callback()
        } else if (!reg.test(value)) {
          callback(new Error(t('tip.please_enter_identify')))
        } else {
          callback()
        }
      }
      const validatePhone = (rule, value, callback) => {
        let reg = /^1(3\d|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
        if (!value) {
          callback()
        } else if (!reg.test(value)) {
          callback(new Error(t('tip.please_enter_phone')))
        } else {
          callback()
        }
      }
      const { genderList, booleanList } = useCommon()
      const { roleAllList, getRolesStaffList } = useList()
      const { teacherTypesList, teacherTeamsList, getTeacherTypes, getTeacherTeams } = useTeacher()
      const formRef = ref(null)
      const dialogVisible = computed({
        get: (): boolean => props.isShow,
        set: (val: boolean) => emit('update:isShow', val),
      })
      const getTitle = computed(() => {
        return props.type == 'add' ? t('state.new_account') : t('state.modify_account_number')
      })
      const state = reactive({
        form: {
          gender: undefined,
          idNumber: undefined,
          name: undefined,
          phone: undefined,
          // roleId: props.roleInfo.roleId,
          username: undefined,
          customerId: undefined,
          roleIds: [],
          supervisor: false,
        } as IForm,
        rules: {
          roleIds: [
            {
              required: true,
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
          idNumber: [
            {
              required: false,
              message: t('tip.please_enter'),
              trigger: 'change',
            },
            {
              validator: validateIdentify,
              trigger: 'change',
            },
          ],
          gender: [
            {
              required: true,
              message: t('tip.please_select'),
              trigger: 'change',
            },
          ],
          phone: [
            {
              required: false,
              message: t('tip.please_enter'),
              trigger: 'change',
            },
            {
              validator: validatePhone,
              trigger: 'change',
            },
          ],
          username: [
            {
              required: true,
              message: t('tip.please_enter'),
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
              message: t('tip.please_enter'),
              trigger: 'change',
            },
          ],
          teacherTypeId: [
            {
              required: true,
              message: t('tip.please_enter'),
              trigger: 'change',
            },
          ],
          teamId: [
            {
              required: true,
              message: t('tip.please_enter'),
              trigger: 'change',
            },
          ],
        },
        loading: false,
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
      const roleChange = (val) => {
        let index = roleAllList.value.findIndex((item) => {
          return state.form.roleIds.includes(item.roleId) && item.builtinRole == 'TEACHER'
        })
        hasTeacherRole.value = index != -1
      }
      const open = () => {
        getRolesStaffList().then(() => {
          roleChange(false)
        })
        getTeacherTypes()
        getTeacherTeams()
        state.form.roleIds = [props.roleInfo.roleId]

        if (props.type == 'edit') {
          getUsersDetail(props.id).then((res) => {
            if (res.status == 200) {
              let data = res.data
              data.roleIds = data.roles.map((item) => item.id)
              data.teacherTypeId = data.teacherType?.id
              data.teamId = data.team?.id
              state.form = data
              roleChange(false)
            }
          })
        }
      }
      const confirm = () => {
        formRef.value.validate((valid: boolean) => {
          if (valid) {
            let api = undefined
            if (props.type == 'add') {
              api = postUsers
            } else {
              api = putUsersId
            }
            state.loading = true
            api(state.form)
              .then((res) => {
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
                  state.loading = false
                }
              })
              .catch(() => {
                state.loading = false
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
        roleAllList,
        genderList,
        teacherTeamsList,
        teacherTypesList,
        roleChange,
        hasTeacherRole,
        booleanList,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .tip-red {
    position: absolute;
    right: 0px;
    top: 24px;
    font-size: 12px;
    color: $systemRed;
  }
</style>
