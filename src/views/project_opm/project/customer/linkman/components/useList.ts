import { ref } from 'vue'
import { getRolesAll, postStaffsProhibit, postStaffsPassword } from '/@/api/opm/roles'
import { getCustomersAll } from '/@/api/opm/customer'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
export default function useList() {
  const { t } = useI18n()
  const roleAllList = ref([])
  const clientAllList = ref([])
  const getRolesAllList = () => {
    getRolesAll().then((res) => {
      roleAllList.value = res.data.map((v: any) => {
        v.cmp = 'Cmp'
        v.roleId = v.id
        delete v.id
        return v
      })
    })
  }
  const getCustomersAllList = () => {
    getCustomersAll().then((res) => [(clientAllList.value = res.data)])
  }
  interface IStstus {
    ids: number[]
    prohibited: boolean
  }

  /**
   * 禁用启用账号
   */
  const postStaffsSattus = (val: IStstus, callBack) => {
    ElMessageBox.confirm(
      `${t('text.this_operation_will')}${val.prohibited ? t('text.disable') : t('text.enable')}${t(
        'text.select_account',
      )}`,
      {
        type: 'warning',
      },
    )
      .then(() => {
        postStaffsProhibit(val).then(() => {
          ElMessage.success(t('message.operation_succeeded'))
          callBack()
        })
      })
      .catch((_) => {})
  }
  const resetPassword = (val: { password: string; id: number }) => {
    ElMessageBox.confirm(`${t('tip.this_operation_will_reset_the_selected_account_password')}`, {
      type: 'warning',
    })
      .then(() => {
        postStaffsPassword(val).then(() => {
          ElMessage.success(t('message.operation_succeeded'))
        })
      })
      .catch((_) => {})
  }
  return {
    roleAllList,
    getRolesAllList,
    clientAllList,
    getCustomersAllList,
    postStaffsSattus,
    resetPassword,
  }
}
