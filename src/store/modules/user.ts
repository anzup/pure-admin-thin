import { defineStore } from 'pinia'
import { store } from '/@/store'
import to from 'await-to-js'
import jwtDecode from 'jwt-decode'
import { userType } from './types'
import { router } from '/@/router'
import { storageSession } from '/@/utils/storage'
import { login, getAuthorizedSubsystem, getUserInfo, getUserInfos } from '/@/api/user'
import { useFtmSettingsStore } from '/@/store/modules/ftmSetting'

export const useUserStore = defineStore({
  id: 'pure-user',
  state: (): userType => ({
    token: sessionStorage.getItem('access_token') ?? '',
    refresh_token: sessionStorage.getItem('refresh_token') ?? '',
    totalAuthorities: [],
    userInfo: storageSession.getItem('-userInfo') ?? {},
    // 这个id是该用户全局id,各个子系统里面的userid不一样
    userId: +sessionStorage.getItem('userId') ?? null,
    lastUpdateTime: 0,
    // 登陆显示组件判断 0：登陆 1：手机登陆 2：二维码登陆 3：注册 4：忘记密码，默认0：登陆
    currentPage: 0,
    // 授权的系统
    subsystems: [],
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime
    },
  },
  actions: {
    SET_TOKEN(data: { refresh_token: string; access_token: string }) {
      const res: any = jwtDecode(data.access_token)
      sessionStorage.setItem('access_token', data.access_token)
      sessionStorage.setItem('refresh_token', data.refresh_token)
      sessionStorage.setItem('userId', res.userId)
      this.token = data.access_token
      this.refresh_token = data.refresh_token
      this.userId = res.userId
    },

    SET_CURRENTPAGE(value) {
      this.currentPage = value
    },
    setUserInfo(info: CurrentUserInfo | null) {
      this.userInfo = info
      this.lastUpdateTime = new Date().getTime()
      storageSession.setItem('-userInfo', info)
    },
    async loginByUsername(data) {
      return new Promise<void>((resolve, reject) => {
        login(data)
          .then((res) => {
            if (data) {
              this.SET_TOKEN(res.data)
              resolve()
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 登出 清空缓存
    logOut() {
      this.token = ''
      storageSession.clear()
      router.push('/login')
    },
    resetState() {
      this.token = ''
      this.userInfo = undefined
      this.userId = undefined
      this.lastUpdateTime = 0
    },
    // 获取当前用户信息(用于在右上角显示用户信息)
    async getUserInfo(): Promise<CurrentUserInfo> {
      const [err, res] = await to(getUserInfos(this.userId))
      if (!err) {
        const { scheduleConfigVO } = res.data
        this.setUserInfo(res.data)
        // const ftmSettingsStore = useFtmSettingsStore()
        // await ftmSettingsStore.getUserSettings()
        return Promise.resolve<CurrentUserInfo>(res.data)
      } else {
        return Promise.reject(err)
      }
    },
    // 获取当前用户子系统
    async getUserSubsystem() {
      const [err, res] = await to(getAuthorizedSubsystem(this.userInfo.filialeId))
      if (!err && res.status === 200) {
        this.subsystems = res.data
      }
    },
    // 刷新token
    async refreshToken() {
      // return refreshToken(data).then(data => {
      //   if (data) {
      //     setToken(data);
      //     return data;
      //   }
      // });
    },
    // 判断权限
    ContainsPermissions(key) {
      // TODO 暂时全放开
      return true
      return this.userInfo.totalAuthorities.includes(key)
    },
  },
})

export function useUserStoreHook() {
  return useUserStore(store)
}
