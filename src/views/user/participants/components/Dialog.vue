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
            <el-form-item :label="$t('state.connection')" prop="customerId">
              <el-select v-model="form.customerId" :placeholder="$t('tip.please_select')">
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('state.student_classification')" prop="studentTypeId">
              <el-select v-model="form.studentTypeId" :placeholder="$t('tip.please_select')">
                <el-option
                  v-for="item in studentTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('state.nationality')" prop="nationalityId">
              <el-select v-model="form.nationalityId" :placeholder="$t('tip.please_select')">
                <el-option
                  v-for="item in nationalityList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('state.companyPositon')" prop="title">
              <el-input v-model="form.title" :placeholder="$t('tip.please_enter')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('state.post')" prop="positionId">
              <el-select v-model="form.positionId" :placeholder="$t('tip.please_select')" clearable>
                <el-option
                  v-for="item in positionList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('state.airplanePosition')" prop="planeJobId">
              <el-select v-model="form.planeJobId" :placeholder="$t('tip.please_select')" clearable>
                <el-option
                  v-for="item in positionList.find((ele) => ele.id == form.positionId)?.planeJobs"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
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
          <el-button @click="dialogVisible = false">
            {{ $t('button.hscancel') }}
          </el-button>
          <el-button type="primary" @click="confirm">{{ $t('button.hsdefine') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
  import { ElMessage } from 'element-plus'
  import common from '/@/hooks/useCommon'
  import useList from '/@/hooks/customer'
  import useCourseClass from '/@/hooks/useCourseClass'
  import { useI18n } from '/@/hooks/useI18n'
  import useStudentType from '/@/hooks/studentsType'
  import { getUsersDetail, postUsers, putUsersId } from '/@/api/user'

  interface IForm {
    customerId: string
    gender: string
    idNumber: string
    name: string
    phone: string
    type: string
    username: string
    studentTypeId: number
    nationalityId: number
    landline: string
    email: string
    remark: string
    title: string
    roleIds: [4]
    planeJobId: number
    positionId: number
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
      clazzId: Number,
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
        return props.type == 'add' ? t('state.new_participants') : t('state.modify_participants')
      })
      var validateIdentify = (rule, value, callback) => {
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
      var validateUsername = (rule, value, callback) => {
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
      var validatePhone = (rule, value, callback) => {
        let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
        if (!value) {
          callback()
        } else if (!reg.test(value)) {
          callback(new Error(t('tip.please_enter_phone')))
        } else {
          callback()
        }
      }
      const { genderList } = common()
      const { getNationality, getCustomers, nationalityList, customerList } = useList()
      const { getPositionList, positionList } = useCourseClass()
      const { getUsersType, studentTypeList } = useStudentType()
      const state = reactive({
        form: {
          customerId: undefined,
          gender: undefined,
          idNumber: undefined,
          name: undefined,
          phone: undefined,
          type: undefined,
          landline: undefined,
          email: undefined,
          remark: undefined,
          username: undefined,
          title: undefined,
          roleIds: [4],
          planeJobId: undefined,
          positionId: undefined,
        } as IForm,
        rules: {
          name: [
            {
              required: true,
              message: t('tip.please_enter'),
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
          type: [
            {
              required: true,
              message: t('tip.please_select'),
              trigger: 'change',
            },
          ],
          customerId: [
            {
              required: true,
              message: t('tip.please_select'),
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
          nationalityId: [
            {
              required: true,
              message: t('tip.please_select'),
              trigger: 'change',
            },
          ],
          studentTypeId: [
            {
              required: true,
              message: t('tip.please_select'),
              trigger: 'change',
            },
          ],
        },
        typeList: [],
      })
      const resetForm = () => {
        formRef.value.resetFields()
      }
      const close = () => {
        resetForm()
      }
      const open = () => {
        getUsersType()
        getCustomers()
        getNationality()
        getPositionList()

        if (props.type == 'edit') {
          getUsersDetail(props.id).then((res) => {
            if (res.status == 200) {
              res.data.customerId = res.data.customer?.id
              res.data.studentTypeId = res.data.studentType?.id
              res.data.nationalityId = res.data.nationality?.id
              res.data.roleIds = [4]
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
              api = postUsers
            } else {
              api = putUsersId
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
                emit('updateData', res.data)
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
        genderList,
        studentTypeList,
        nationalityList,
        customerList,
        positionList,
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
