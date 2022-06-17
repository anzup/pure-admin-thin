import axios, {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import qs from 'qs'
import { message as ElMessage } from '../resetMessage'
import { useUserStoreHook } from '/@/store/modules/user'
import { storageLocal } from '/@/utils/storage'
import { removeEmptyProp } from './utils'
import { addPending, deletePendingMapKey, removePending } from './repeat'
import { isRefresh } from './refresh'
import { HttpCustomConfig, HttpRequesrConfig } from './types'
import { isArray } from '/@/utils/is'

export * from './types'

// axios 默认配置项

// Content-Type: application/json
// Content-Type: application/x-www-form-urlencoded
// Content-Type: multipart/form-data

const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: 300000,
  headers: {
    'Accept-Language': storageLocal.getItem('-locale')?.locale || 'zh-CN',
  },
  // 数组格式参数序列化
  paramsSerializer: (params) => qs.stringify(params, { indices: false }),
}

// 采用new一个对象的方式来构造http实例，而不是采用函数封装的方式，这样做的好处是可以减少axios实例的数量，每次调用的都是同一个axios对象实例
class Http {
  // 保存axios实例对象
  private static axiosInstance: AxiosInstance = axios.create(defaultConfig)

  // 构造函数
  constructor() {
    this._request()
    this._response()
  }

  // 通用请求工具函数
  public request<T = any, P = HttpCustomConfig>(
    axiosConfig: AxiosRequestConfig & P,
  ): AxiosPromise<T> {
    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      //get请求处理params对象里面的数组
      if (axiosConfig.method === 'get' && Object.keys(axiosConfig.params || {}).length) {
        const obj = {}
        for (const key in axiosConfig.params) {
          if (isArray(axiosConfig.params[key])) {
            obj[key] = axiosConfig.params[key].join()
            continue
          }
          obj[key] = axiosConfig.params[key]
        }
      }
      Http.axiosInstance
        .request(axiosConfig)
        .then((response: AxiosResponse) => {
          resolve(response)
        })
        .catch((error: AxiosError) => {
          reject(error)
        })
    })
  }

  // 请求拦截
  private _request(): void {
    Http.axiosInstance.interceptors.request.use(
      (config: HttpRequesrConfig) => {
        const {
          url,
          data,
          params,
          headers,
          P_removeEmptyProp = true,
          P_repeatRequestCancel = true,
        } = config
        // 处理url中的特殊字符
        config.url = decodeURI(encodeURI(url).replace(/%E2%80%8B/g, ''))
        // 处理请求头中的权限字段
        if (!config.headers['Authorization'] && useUserStoreHook().token) {
          config.headers['Authorization'] = 'Bearer ' + useUserStoreHook().token
          // let userInfo = sessionStorage.getItem('userInfo')
          useUserStoreHook()?.currentRole &&
            (config.headers['roleId'] = useUserStoreHook()?.currentRole)
        }
        // 删除重复的请求
        removePending(config)
        // 缓存正在请求的接口,如果设置了自定义状态,则以自定义状态为准
        P_repeatRequestCancel && addPending(config)
        // 处理请求数据中的空值
        if (P_removeEmptyProp && headers['Content-Type'] === 'application/json') {
          if (data) {
            removeEmptyProp(data)
            config.data = data
          }
          if (params) {
            removeEmptyProp(params)
            config.params = params
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }

  // 通用请求函数

  // 响应拦截
  private _response() {
    Http.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        deletePendingMapKey(response.config)
        return response
      },
      (error: AxiosError) => {
        console.log(error)
        error?.response?.config && deletePendingMapKey(error.response.config)

        if (!axios.isCancel(error) && error?.response?.status) {
          switch (error.response.status) {
            case 401:
              // 判断token是否过期，过期刷新token，刷新失败重定向到登录页
              return isRefresh(error.response)
            // 其他错误，直接抛出错误提示
            default:
              ElMessage({
                // @ts-ignore
                message: error.response.data.msg || 'Error',
                type: 'error',
                duration: 5 * 1000,
              })
              if (error.response.config.url.includes('/users/refreshToken')) {
                useUserStoreHook().logOut()
                location.reload()
              }
              break
          }
        }
        return Promise.reject(error)
      },
    )
  }
}

const http = new Http();

export { http, Http };
export default http.request;
