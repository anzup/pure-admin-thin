import to from 'await-to-js'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'

import {
  GetUsers,
  getUsersList as getUsers,
  postUsersProhibit,
  putUsersPassword,
} from '/@/api/user'
import { getRolesList as getRoles, Roles } from '/@/api/roles'

export default function useUser() {
  const { t } = useI18n()
  const userForm = reactive<GetUsers>({
    page: 1,
    size: 100,
  })

  interface IStstus {
    ids: number[]
    prohibited: boolean
  }

  const userList = ref([])
  const roleAllList = ref([])
  const teacherList = ref([])
  const evaluatePeopleList = ref([])
  /**
   *
   * 用户列表
   */
  const getUsersList = async () => {
    const [err, res] = await to(getUsers(userForm))
    if (err) return
    userList.value = res.data.content
  }
  /**
   *
   * 用户列表
   */
  const getTeacherList = async () => {
    const [err, res] = await to(
      getUsers({
        builtinRoles: 'TEACHER',
        size: 1000,
      }),
    )
    if (err) return
    teacherList.value = res.data.content
  }
  /**
   *
   * 评估人列表（除了学员、客户联络员）
   */
  const getEvaluatePeopleListList = async () => {
    const [err, res] = await to(
      getUsers({
        builtinRolesNI: 'STUDENT,CUSTOMER_CONTACTER',
        size: 1000,
      }),
    )
    if (err) return
    evaluatePeopleList.value = res.data.content
  }
  /**
   *
   * 获取职员列表（除了学员和客户联络员）
   */
  const getRolesStaffList = async () => {
    const [err, res] = await to(
      getRoles({
        size: 1000,
        sort: 'createdDate',
        order: 'asc',
        builtinRoleNI: 'STUDENT,CUSTOMER_CONTACTER',
      }),
    )
    if (err) return
    roleAllList.value = res.data.content.map((v: any) => {
      v.roleId = v.id
      delete v.id
      return v
    })
  }

  const rolesForm = reactive<Roles>({
    size: 1000,
  })

  const getRolesList = async () => {
    const [err, res] = await to(getRoles(rolesForm))
    if (err) return
    roleAllList.value = res.data.content
    rolesForm.total = res.data.totalElements
  }

  /**
   * 禁用启用账号
   */
  const postUsersSattus = (val: IStstus, callBack) => {
    ElMessageBox.confirm(
      `${t('state.this_operation_will')}${
        val.prohibited ? t('state.disable') : t('state.enable')
      }${t('state.select_account')}`,
      {
        type: 'warning',
      },
    )
      .then(() => {
        postUsersProhibit(val).then(() => {
          ElMessage.success(t('message.operation_succeeded'))
          callBack()
        })
      })
      .catch((_) => {})
  }
  /**
   * 修改密码、重置密码
   */
  const resetPassword = (val: { password: string; id: number }) => {
    ElMessageBox.confirm(`${t('tip.tipResetPwd')}`, {
      type: 'warning',
    })
      .then(() => {
        putUsersPassword(val).then(() => {
          ElMessage.success(t('message.operation_succeeded'))
        })
      })
      .catch((_) => {})
  }

  return {
    userForm,
    userList,
    roleAllList,
    getUsersList,
    getRolesStaffList,
    postUsersSattus,
    resetPassword,
    getTeacherList,
    teacherList,
    evaluatePeopleList,
    getEvaluatePeopleListList,
    rolesForm,
    getRolesList,
  }
}
