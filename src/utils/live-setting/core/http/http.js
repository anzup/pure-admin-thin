import axios from 'axios'
import config from '../data/config'
import { useLiveStore } from '/@/store/modules/live'
const store = useLiveStore()
export default class Http {
  constructor() {}
  /**
   * 获取鉴权信息
   * @param {*} channel
   * @param {*} userName
   */
  static async getAuthInfo(channel, userName) {
    return new Promise((resolve, reject) => {
      let info = { ...store.state }
      let data = {
        appid: info.appId,
        userid: info.userId,
        timestamp: info.timestamp,
        nonce: info.nonce,
        token: info.token,
        gslb: [info.gslb],
        channel: channel || info.channelId,
        userName: userName,
      }
      // let _data = this.GenerateAliRtcAuthInfo(info)
      // console.log(_data,'生成')
      resolve(data)
    })
  }
  /**
   * 生成鉴权信息
   * @param {*} channelId
   */
  static GenerateAliRtcAuthInfo(info) {
    let appId = config.appId // 修改为自己的appid 该方案仅为开发测试使用，正式上线需要使用服务端的AppServer
    let appKey = config.appKey // 修改为自己的appkey 该方案仅为开发测试使用，正式上线需要使用服务端的AppServer
    let timestamp = parseInt(new Date().getTime() / 1000 + 48 * 60 * 60)
    let nonce =
      'AK-' +
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    let userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })

    let channelId = info.channelId
    userId = info.userId
    nonce = info.nonce
    timestamp = info.timestamp

    let token = sha256(appId + appKey + channelId + userId + nonce + timestamp)
    return {
      appid: appId,
      userid: userId,
      timestamp: timestamp,
      nonce: nonce,
      token: token,
      gslb: [info.gslb],
      channel: channelId,
    }
  }
}
