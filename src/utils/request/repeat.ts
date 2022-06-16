/*
 * @Author: 冉茂廷 1012377328@qq.com
 * @Date: 2022-05-19 16:32:51
 * @LastEditors: 冉茂廷 1012377328@qq.com
 * @LastEditTime: 2022-05-23 09:55:46
 * @FilePath: \crew-web\src\utils\request\repeat.ts
 * @Description:
 *
 * Copyright (c) 2022 by 冉茂廷 1012377328@qq.com, All Rights Reserved.
 */
import axios, {AxiosRequestConfig} from 'axios'

// 缓存正在请求的列表
const pendingMap = new Map()
/**
 * 生成每个请求唯一的键
 * @param {*} config
 * @returns string
 */
function _getPendingKey(config: AxiosRequestConfig) {
  // eslint-disable-next-line prefer-const
  let { url, method, params, data } = config
  if (typeof data === 'string') data = JSON.parse(data) // response里面返回的config.data是个字符串对象
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config
 */
export function addPending(config) {
  const pendingKey = _getPendingKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!pendingMap.has(pendingKey)) {
        pendingMap.set(pendingKey, cancel)
      }
    })
}

/**
 * 删除重复的请求
 * @param {*} config
 */
export function removePending(config: AxiosRequestConfig) {
  const pendingKey = _getPendingKey(config)

  if (pendingMap.has(pendingKey)) {
    const cancelToken = pendingMap.get(pendingKey)
    cancelToken(pendingKey)
    pendingMap.delete(pendingKey)
  }
}

// 在刷新token时删除map里面的键值

export function deletePendingMapKey(config: AxiosRequestConfig) {
  const pendingKey = _getPendingKey(config)
  if (pendingMap.has(pendingKey)) {
    pendingMap.delete(pendingKey)
  }
}
