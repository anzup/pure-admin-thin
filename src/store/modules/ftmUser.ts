import { defineStore } from 'pinia'
import { store } from '/@/store'
import { getUserInfo } from '/@/api/ftm/teacher/account'
import { accountType } from '/@/store/modules/types'
export interface IUserState {
  accountType: accountType // 账号类型
  builtinRole: string // 内置职位
  filiale: {
    // 公司信息
    id: number
    name: string
  }
  id: number
  idNumber: string //	身份证
  lastLoginTime: string // 最后一次登录时间
  name: string // 姓名
  phone: string // 手机号
  roleAuthorities: string[] // 角色权限
  roleName: string // 职位
  selfAuthorities: string[] // 自定义权限
  signatureFileUuid: string
  student: boolean // 是否学员
  teacher: boolean // 是否教员
  teacherAdmin: boolean // 是否教务员
  tempStudent: boolean // 是否临时考生
  totalAuthorities: string[] // 全部权限
  userId: number
  username: string
}
export const useFtmUserStore = defineStore({
  id: 'ftm-user-store',
  state: (): IUserState => ({
    accountType: null,
    builtinRole: '',
    filiale: {
      id: null,
      name: '',
    },
    id: null,
    idNumber: '',
    lastLoginTime: '',
    name: '',
    phone: '',
    roleAuthorities: [],
    roleName: '',
    selfAuthorities: [],
    signatureFileUuid: '',
    student: null,
    teacher: null,
    teacherAdmin: null,
    tempStudent: null,
    totalAuthorities: [],
    userId: null,
    username: '',
  }),
  getters: {},
  actions: {
    SET_ATTRS(ob) {
      for (const [key, value] of Object.entries(ob)) {
        this[key] = value
      }
    },
    // 判断是否含有权限
    ContainsPermissions(key: string): boolean {
      return this.totalAuthorities.includes(key)
    },
    async getUserInfo({ id }) {
      await getUserInfo({ id })
        .then((res) => {
          console.log(res)
          this.SET_ATTRS(res.data)
          return Promise.resolve()
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    },
  },
})

export function useFtmUserStoreHook() {
  return useFtmUserStore(store)
}
