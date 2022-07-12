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
    total: 0,
  })

  interface IStstus {
    ids: number[]
    prohibited: boolean
  }

  const userList = ref([])
  const roleAllList = ref([])
  /**
   *
   * 用户列表
   */
  const getUsersList = async () => {
    const [err, res] = await to(getUsers(userForm))
    if (err) {
      userForm.total = 0
      userList.value = []
      return
    }
    userList.value = res.data.content
    userForm.total = res.data.totalElements
  }
  /**
   *
   * 获取职员列表（除了学员\）
   */
  const getRolesStaffList = async () => {
    const [err, res] = await to(
      getRoles({
        size: 1000,
        sort: 'createdDate',
        order: 'asc',
        builtinRoleNI: 'STUDENT',
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
  const postUsersStatus = (val: IStstus, callBack) => {
    ElMessageBox.confirm(
      val.prohibited ? t('tip.enableSelectedAccount') : t('tip.disableTheSelectedAccount'),
      {
        type: 'warning',
      },
    )
      .then(() => {
        postUsersProhibit(val).then(() => {
          ElMessage.success(t('message.successfulOperation'))
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
          ElMessage.success(t('message.successfulOperation'))
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
    postUsersStatus,
    resetPassword,
    rolesForm,
    getRolesList,
  }
}
