import axios, { AxiosRequestConfig } from 'axios'
import { message as ElMessage } from '/@/utils/resetMessage'
import { useUserStoreHook } from '/@/store/modules/user'
import { storageLocal } from '/@/utils/storage'

import XEUtils from 'xe-utils'
const reqList: AxiosRequestConfig[] = []

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = function (
  reqList: AxiosRequestConfig[],
  config: AxiosRequestConfig,
  cancel,
  errorMessage,
) {
  if (config.headers['Content-Type'] !== 'multipart/form-data') return false
  const errorMsg = errorMessage || ''

  for (let i = 0; i < reqList.length; i++) {
    if (
      reqList[i].url === config.url &&
      XEUtils.isEqual(reqList[i].data, config.data) &&
      XEUtils.isEqual(reqList[i].params, config.params)
    ) {
      cancel(errorMsg)
      return
    }
  }
  reqList.push(config)
}
/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function (reqList: AxiosRequestConfig[], config: AxiosRequestConfig) {
  for (let i = 0; i < reqList.length; i++) {
    if (
      reqList[i].url === config.url &&
      XEUtils.isEqual(reqList[i].data, config.data) &&
      XEUtils.isEqual(reqList[i].params, config.params)
    ) {
      reqList.splice(i, 1)
      break
    }
  }
}

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: 300000,
  headers: {
    'Accept-Language': storageLocal.getItem('responsive-locale')?.locale || 'zh-CN',
  },
})

// service.defaults.headers['Authorization'] = UserModule.token
// Request interceptors
service.interceptors.request.use(
  async (config) => {
    config.url = decodeURI(encodeURI(config.url).replace(/%E2%80%8B/g, ''))
    if (
      config.headers['Content-Type'] !== 'multipart/form-data' &&
      XEUtils.isObject(config.data) &&
      !Array.isArray(config.data)
    ) {
      config.data = XEUtils.pick(config.data, ((val: any) => val !== undefined) as any)
    }
    if (config.params && XEUtils.isObject(config.params) && !Array.isArray(config.params)) {
      config.params = XEUtils.pick(config.params, ((val: any) => val !== undefined) as any)
    }
    // 设置cancelToken对象
    let cancel
    config.cancelToken = new axios.CancelToken((c) => (cancel = c))
    // 阻止重复请求。当上个请求未完成时，相同的请求不会进行
    stopRepeatRequest(reqList, config, cancel, `${config.url} 请求被中断`)

    if (!config.headers['Authorization'] && useUserStoreHook().token) {
      config.headers['Authorization'] = 'Bearer ' + useUserStoreHook().token
    }
    if (config.method == 'get' && config.params) {
      Object.keys(config.params).forEach((item) => {
        if ([undefined, null, ''].includes(config.params[item])) {
          delete config.params[item]
        }
      })
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    // 增加延迟，相同请求不得在短时间内重复发送
    setTimeout(() => {
      allowRequest(reqList, response.config)
    }, 1000)
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  (error) => {
    if (axios.isCancel(error)) {
      // 区分错误是因为被防抖阻止还是404
      // console.log(error.message);
    } else {
      // console.log(error);

      // 取消了延迟，相同请求不得在短时间内重复发送，除非上一次的请求404了
      allowRequest(reqList, error?.config)
      if (error?.response?.status) {
        // console.log(error.response);
        switch (error.response.status) {
          // 401: 未登录
          // 未登录则跳转登录页面，并携带当前页面的路径
          // 在登录成功后返回当前页面，这一步需要在登录页操作。
          case 401:
            // ElMessageBox.confirm("登录信息已失效！请重新登录", "提示", {
            //     confirmButtonText: "确认",
            //     cancelButtonText: "取消",
            //     type: "warning"
            // }).then(() => {
            sessionStorage.clear()
            location.reload()
          // });

          // 404请求不存在
          // case 404:
          //   ElMessage({
          //     message: '网络请求不存在',
          //     type: 'error',
          //     duration: 5 * 1000
          //   })

          //   break;
          // 其他错误，直接抛出错误提示
          default:
            // console.log( error.response, 127) // for debug
            ElMessage({
              message: error.response.data.msg || 'Error',
              type: 'error',
              duration: 5 * 1000,
            })
            break
        }
        // return Promise.reject(new Error(error.response.data.msg || 'Error'));
      }
    }
    return Promise.reject(error)
  },
)

export default service
