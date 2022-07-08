<template>
  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :title="getTitle"
    center
    destroy-on-close
    width="650px"
    @close="close"
    @open="open"
  >
    <el-form
      ref="formRef"
      :model="state.form"
      :rules="state.rules"
      class="demo-form"
      label-width="80px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('state.position')" prop="roleIds">
            <el-checkbox-group v-model="state.form.roleIds" @change="roleChange">
              <el-checkbox v-for="(item, index) in roleAllList" :key="index" :label="item.id"
                >{{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('state.fullName')" prop="name">
            <el-input v-model="state.form.name" :placeholder="$t('tip.pleaseEnter')" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('state.gender')" prop="gender">
            <el-select v-model="state.form.gender" :placeholder="$t('tip.pleaseChoose')">
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
          <el-form-item :label="$t('state.logInName')" prop="username">
            <el-input v-model="state.form.username" :placeholder="$t('tip.pleaseEnter')" />
            <text class="color-red text-xs">{{ $t('state.initialPassword') }}：111111</text>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('state.department')" prop="departmentId">
            <el-select v-model="state.form.departmentId" :placeholder="$t('tip.pleaseChoose')">
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="getCanteen" :span="24">
          <el-form-item :label="$t('state.restaurantName')" prop="canteenId">
            <el-radio-group v-model="state.form.canteenId">
              <el-radio v-for="item in canteensList" :key="item.id" :label="item.id"
                >{{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('state.idNumber')" prop="idNumber">
            <el-input v-model="state.form.idNumber" :placeholder="$t('tip.pleaseEnter')" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('state.phoneNumber')" prop="phone">
            <el-input v-model="state.form.phone" :placeholder="$t('tip.pleaseEnter')" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="$t('state.email')" prop="email">
            <el-input v-model="state.form.email" :placeholder="$t('tip.pleaseEnter')" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('state.remark')" prop="remark">
            <el-input
              v-model="state.form.remark"
              :placeholder="$t('tip.pleaseEnter')"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
  import { ref, computed, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useVModel } from '@vueuse/core'
  import { useI18n } from '/@/hooks/useI18n'
  import useUser from '/@/hooks/useUser'
  import useCommon from '/@/hooks/useCommon'
  import { getUsersDetail, PostUser, postUsers, putUsersId } from '/@/api/user'
  import useDepartment from '/@/hooks/useDepartment'
  import useCanteens from '/@/hooks/useCanteens'

  const { t } = useI18n()

  interface Prop {
    modelValue: boolean
    id?: number
    roleInfo: any
  }

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: false,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()
  const dialogVisible = useVModel(props, 'modelValue', emit)
  const getTitle = computed(() => (!props.id ? t('buttons.hsAdd') : t('buttons.edit')))

  const getCanteen = computed(() =>
    state.form.roleIds?.includes(roleAllList.value.find((v) => v.builtinRole === 'CASHIER')?.id),
  )
  const hasTeacherRole = ref(false)
  const { genderList } = useCommon()

  const { departmentList, getDepartmentList } = useDepartment()
  const validateUsername = (rule, value, callback) => {
    if (
      !/[a-zA-Z0-9]{3,12}/.test(value) ||
      value.length < 3 ||
      value.length > 12 ||
      /[\u4e00-\u9fa5]/.test(value)
    ) {
      callback(new Error(t('tip.pleaseEnterLoginName')))
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
      callback(new Error(t('tip.pleaseEnterTheIDNumber')))
    } else {
      callback()
    }
  }
  const validatePhone = (rule, value, callback) => {
    let reg = /^1(3\d|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
    if (!value) {
      callback()
    } else if (!reg.test(value)) {
      callback(new Error(t('tip.pleaseEnterPhoneNumber')))
    } else {
      callback()
    }
  }
  const state = reactive<{
    form: PostUser
    // eslint-disable-next-line no-undef
    rules: Partial<Record<keyof PostUser, FormItemRule>>
  }>({
    form: {
      gender: undefined,
      idNumber: undefined,
      name: undefined,
      phone: undefined,
      username: undefined,
      roleIds: [],
    },
    rules: {
      roleIds: [
        {
          required: true,
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
      idNumber: [
        {
          required: false,
          message: t('tip.pleaseEnter'),
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
          message: t('tip.pleaseChoose'),
          trigger: 'change',
        },
      ],
      canteenId: [
        {
          required: true,
          message: t('tip.pleaseChoose'),
          trigger: 'blur',
        },
      ],
      departmentId: [
        {
          required: true,
          message: t('tip.pleaseChoose'),
          trigger: 'blur',
        },
      ],
      phone: [
        {
          required: false,
          message: t('tip.pleaseEnter'),
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
          message: t('tip.pleaseEnter'),
          trigger: 'change',
        },
        {
          validator: validateUsername,
          trigger: 'change',
        },
      ],
    },
  })
  const { roleAllList, getRolesList, rolesForm } = useUser()
  const roleChange = () => {
    let index = roleAllList.value.findIndex((item) => {
      return state.form.roleIds.includes(item.roleId) && item.builtinRole == 'TEACHER'
    })
    hasTeacherRole.value = index != -1
  }
  const formRef = ref<ElFormInstance>()
  const confirm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        let api = undefined
        if (!props.id) {
          api = postUsers
        } else {
          api = putUsersId
        }
        api(state.form).then(() => {
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

  const { canteensList, getCanteensList } = useCanteens()

  const open = () => {
    rolesForm.builtinRoleNI = 'STUDENT'
    rolesForm.order = 'asc'
    getRolesList()
    getDepartmentList()
    getCanteensList()
    state.form.roleIds = [props.roleInfo.roleId]
    if (props.id) {
      getUsersDetail(props.id).then((res) => {
        res.data.roleIds = res.data.roles.map((v) => v.id)
        res.data.canteenId = res.data?.canteen?.id
        res.data.departmentId = res.data?.department?.id
        state.form = res.data
      })
    }
  }
  const close = () => {
    formRef.value.resetFields()
  }
</script>
<style lang="scss" scoped></style>
