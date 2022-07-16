import RTCClient from '../rtc-client'
import { useLiveStore } from '/@/store/modules/live'
import { ElMessage } from 'element-plus'
const store = useLiveStore()

export default class Util {
  /**
   * 显示信息
   * @param {*} v
   */
  static toast(v) {
    ElMessage(v)
  }
  /**
   * 复制
   * @param {*} id
   */
  static hCopy(id) {
    if (id) {
      try {
        var range = document.createRange()
        var tar = document.getElementById(id)
        range.selectNodeContents(tar)
        var selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        document.execCommand('copy')
        selection.removeAllRanges()
      } catch (error) {
        console.log(error)
        return false
      }
      return true
    } else {
      return true
    }
  }
  /**
   *
   * @param {*} id
   */
  static inputCopy(id) {
    try {
      var Url2 = document.getElementById(id)
      Url2.select() // 选择对象
      document.execCommand('Copy')
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
  /**
   * 获取浏览器地址栏参数
   * @param {*} url
   * @param {*} name
   */
  static getUrlParam(name) {
    let url = window.location.href
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let urlArr = url.split('?')
    if (urlArr.length > 1) {
      url = '?' + urlArr[1]
      var r = url.substr(1).match(reg)
      if (r != null) return decodeURIComponent(r[2])
      return null
    } else {
      return null
    }
  }
  /**
   * 退出房间
   */
  static exitRoom() {
    RTCClient.instance.logout().then(() => {
      store.SET_ATTR_OBJECT({
        isPublishScreen: false,
        isPublish: false,
        isPreview: RTCClient.instance.isPreview,
      })
    })
  }
  /**
   * 开始预览
   */
  static startPreview(view) {
    return new Promise((resolve, reject) => {
      RTCClient.instance
        .startPreview(view)
        .then(() => {
          AppConfig.localStream = view.srcObject
          store.SET_ATTR_OBJECT({ isPreview: true })
          resolve()
        })
        .catch((err) => {
          reject(err)
          console.error('', err)
        })
    })
  }
  /**
   * 显示远端用户
   * @param {*} data
   */
  static showRemoteVideo(data) {
    let userInfo = RTCClient.instance.getUserInfo(data.userId)
    let video = document.getElementById('previewVideo' + data.userId)
    let subUserId = document.getElementById('localVideo').getAttribute('subUserId')
    if (subUserId) {
      if (subUserId == data.userId) {
        video = document.getElementById('localVideo')
      } else {
        if (userInfo.displayName.indexOf('_老师') > -1) {
          store.SET_ATTR_OBJECT({ switchUserId: data.userId })
        }
      }
    } else {
      if (userInfo.displayName.indexOf('_老师') > -1) {
        store.SET_ATTR_OBJECT({ switchUserId: data.userId })
      }
    }
    video.style.display = 'block'
    RTCClient.instance.setDisplayRemoteVideo(data.userId, video, data.code)
  }

  /**
   *
   * @param {*} code
   */
  static onByeMessage(code) {
    let messageTxt = ''
    if (code == 1) {
      messageTxt = hv.$to('status.liveEnd')
    } else if (code == 2) {
      messageTxt = hv.$to('status.liveEnd')
    } else {
      messageTxt = hv.$to('tip.LoginConflict')
    }
    hv.$alert(messageTxt, '', {
      confirmButtonText: hv.$to('button.confirm'),
      callback: (action) => {
        hv.$router.go(-1)
      },
    })
  }
  /**
   * 显示错误
   */
  static showErrorMsg(data) {
    let resmsg = ''
    console.log(data, '错误')
    switch (data.errorCode) {
      case 10000:
        resmsg += hv.$to('status.DeviceError')
        break
      case 10001:
        resmsg += hv.$to('status.NotFoundAudioDevice')
        break
      case 10002:
        resmsg += hv.$to('status.NotFoundVideoDevice')
        break
      case 10003:
        resmsg += hv.$to('status.DisabledAudioDevice')
        break
      case 10004:
        resmsg += hv.$to('status.DisabledVideoDevice')
        break
      case 10005:
        resmsg += hv.$to('status.SystemDisabledAudioDevice')
        break
      case 10006:
        resmsg += hv.$to('status.SystemDisabledVideoDevice')
        break
      case 10010:
        resmsg += hv.$to('status.ScreenSharingError')
        break
      case 10011:
        {
          resmsg += hv.$to('status.DisabledScreenSharing')
          store.SET_ATTR_OBJECT({ isPublishScreen: false })
        }
        break
      case 10012:
        resmsg += hv.$to('status.CanceledScreenSharing')
        store.SET_ATTR_OBJECT({ isPublishScreen: false })
        if (store.isSwitchScreen) {
          if (store.isPublishScreen) {
            document.getElementById(RTCClient.instance.userId).srcObject =
              RTCClient.instance.screenStream
          } else {
            document.getElementById(RTCClient.instance.userId).srcObject = AppConfig.localStream
          }
        } else {
          if (store.isPublishScreen) {
            document.getElementById('localVideo').srcObject = RTCClient.instance.screenStream
          } else {
            document.getElementById('localVideo').srcObject = AppConfig.localStream
          }
        }
        // if (document.getElementById(RTCClient.instance.userId).srcObject == AppConfig.localStream) {
        //     document.getElementById(RTCClient.instance.userId).srcObject = null;
        // }
        break
      case 10201:
        resmsg += hv.$to('status.AutoPlayFailed')
        break
      case 10300:
        resmsg += hv.$to('tip.publishFailedTip')
        document.getElementById('localVideo').srcObject = null
        break
      default:
        break
    }
    resmsg ? Util.toast(resmsg) : Util.toast(data)
  }
}
