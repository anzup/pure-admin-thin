import { defineStore } from 'pinia'
import { store } from '/@/store'

export const useLiveStore = defineStore({
  id: 'ftm-live',
  state: () => ({
    appId: '',
    channelId: '',
    gslb: '',
    nonce: '',
    timestamp: '',
    token: '',
    classNum: '', // 教室号
    userName: '', // 用户名
    userId: null, // userId
    role: null, // 角色
    client: null, // rtc 实例
    isShowSetting: false, // 是否显示配置项
    isPublish: false,
    isPreview: false,
    isPublishScreen: false, //屏幕分享
    isSwitchScreen: false, // 是否切换大小流
    switchUserId: '',
    userList: [],
    supportInfo: {},
  }),
  getters: {},
  actions: {
    SET_ATTR_OBJECT(attr) {
      for (const [key, value] of Object.entries(attr)) {
        this[key] = value
      }
    },
    SET_ATTR({ name, value }) {
      this[name] = value
    },
  },
})

export function useLiveStoreHook() {
  return useLiveStore(store)
}
