import { defineStore } from 'pinia'
import { store } from '/@/store'
import { login, logout, getUserInfo } from '/@/api/user'
import { useAppStoreHook } from '../modules/app'
// import { getToken, setToken, removeToken } from '@/utils/cookies'
// import {resetRouter} from '@/roter/index';
// import { resetRouter } from '/@/router';
// let jwt = require('jsonwebtoken');
// import {decode} from 'jsonwebtoken';
import jwt_decode from 'jwt-decode'
export interface IUserState {
  token: string
  name: string
  roles: string[]
  userId: string | number | undefined | null
  panelFit: Scheduler.AsideListSet
  userInfo: {
    name: string
    lastLoginTime: string
    roleName: string
    totalAuthorities: string
    accountType: string
  }
}
export const useUserStore = defineStore({
  id: 'opm-user-store',
  state: (): IUserState => ({
    token: sessionStorage.getItem('access_token'),
    name: '',
    roles: [],
    userId: sessionStorage.getItem('userId'),
    panelFit: {
      noArrangeName: [],
      noArrangeColor: undefined,
      arrangeShow: undefined,
      arrangeName: [],
      arrangeColor: undefined,
      unusedTemplateColor: undefined,
      unfinishedTemplateColor: undefined,
      finishedTemplateColor: undefined,
    },
    userInfo: {
      name: undefined,
      lastLoginTime: undefined,
      roleName: undefined,
      totalAuthorities: undefined,
      accountType: undefined,
    },
  }),
  getters: {
    getToken() {
      return this.token
    },
  },
  actions: {
    SET_NAME(name: string) {
      this.name = name
    },
    SET_USERID(userId: number | string) {
      this.userId = userId
      sessionStorage.setItem('userId', userId as string)
    },
    SET_TOKEN(token: string) {
      this.token = token
      sessionStorage.setItem('access_token', token)
    },

    SET_ROLES(roles: string[]) {
      this.roles = roles
      sessionStorage.setItem('roles', JSON.stringify(roles))
    },
    SET_PANEL_FIT(val: IUserState['panelFit']) {
      this.panelFit = val
    },
    SET_USER_INFO(val: any) {
      this.userInfo = val
    },
    Login(userInfo: { username: string; password: string }): Promise<any> {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username: username.trim(), password: password })
          .then((response) => {
            const { data } = response
            this.SET_TOKEN(data.access_token)
            // window.sessionStorage.setItem('access_token',data.access_token)

            const str: { [propname: string]: any } = jwt_decode(data.access_token)

            window.sessionStorage.setItem('userId', str.userId)
            this.SET_USERID(str.userId)
            // setToken(data.access_token)
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    UnifiedLogin(access_token: string) {
      this.SET_TOKEN(access_token)
      const str: { [propname: string]: any } = jwt_decode(access_token)
      window.sessionStorage.setItem('userId', str.userId)
      this.SET_USERID(str.userId)
    },
    ResetToken() {
      // removeToken()
      this.SET_TOKEN('')
      this.SET_ROLES([])
    },
    GetUserInfo(): Promise<any> {
      return new Promise((resolve, reject) => {
        // this.token
        getUserInfo({ userId: this.userId })
          .then((response) => {
            const { data } = response

            if (!data) {
              reject('Verification failed, please Login again.')
            }

            const { userInfoVO, scheduleConfigVO } = data
            // 面板操作设置信息
            this.SET_PANEL_FIT({
              ...scheduleConfigVO,
              arrangeName: scheduleConfigVO.arrangeName || [],
              noArrangeName: scheduleConfigVO.noArrangeName || [],
            })

            // 设置用户相关信息
            // 设置用户名
            this.SET_NAME(userInfoVO.name)
            // 设置用户信息
            this.SET_USER_INFO(userInfoVO)

            // roles must be a non-empty array
            // 暂时放开权限验证
            // if (!totalAuthorities || totalAuthorities.length <= 0) {
            //   reject('getInfo: roles must be a non-null array!')
            // }

            // commit('SET_ROLES', roles)
            // commit('SET_NAME', name)
            // 放开权限 totalAuthorities
            this.SET_ROLES([12312])

            resolve(userInfoVO)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
})

export function useOpmUserStoreHook() {
  return useUserStore(store)
}
