import { defineStore } from 'pinia'
import { store } from '/@/store'
import to from 'await-to-js'
import jwtDecode from 'jwt-decode'
import { userType } from './types'
import { router } from '/@/router'
import { storageSession } from '/@/utils/storage'
import { getRoleUserInfo, login } from '/@/api/user'

import { useMultiTagsStoreHook } from '/@/store/modules/multiTags'

export const useUserStore = defineStore({
  id: 'pure-user',
  state: (): userType => ({
    token: sessionStorage.getItem('access_token') ?? '',
    refresh_token: sessionStorage.getItem('refresh_token') ?? '',
    totalAuthorities: [],
    userInfo: storageSession.getItem('userInfo') || undefined,
    // 这个id是该用户全局id,各个子系统里面的userid不一样
    userId: +sessionStorage.getItem('userId'),
    // 登陆显示组件判断 0：登陆 1：手机登陆 2：二维码登陆 3：注册 4：忘记密码，默认0：登陆
    currentPage: 0,
  }),
  getters: {
    subsystems() {
      return this.userInfo?.subsystems || []
    },
  },
  actions: {
    // 设置权限
    SET_AUTHORITIES(val: string[]) {
      this.totalAuthorities = val || []
    },

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
    // 登入
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
      useMultiTagsStoreHook().handleTags('equal', [
        {
          path: '/welcome',
          parentPath: '/',
          meta: {
            title: 'menus.hshome',
            icon: 'home-filled',
          },
        },
      ])
      router.push('/login')
    },
    // 获取当前用户信息(用于在右上角显示用户信息)
    async getUserInfo() {
      const [err, res] = await to(getRoleUserInfo())
      if (!err) {
        this.userInfo = res.data
        storageSession.setItem('userInfo', res.data)
        return Promise.resolve<RoleUserInfo>(res.data)
      }
    },
    // 刷新token
    async refreshToken(data) {
      // return refreshToken(data).then(data => {
      //   if (data) {
      //     setToken(data);
      //     return data;
      //   }
      // });
    },
  },
})

export function useUserStoreHook() {
  return useUserStore(store)
}
