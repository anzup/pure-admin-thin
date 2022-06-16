/*
 * @Author: 冉茂廷 1012377328@qq.com
 * @Date: 2022-05-20 08:53:54
 * @LastEditors: 冉茂廷 1012377328@qq.com
 * @LastEditTime: 2022-05-23 10:08:29
 * @FilePath: \crew-web\src\utils\request\refresh.ts
 * @Description:
 *
 * Copyright (c) 2022 by 冉茂廷 1012377328@qq.com, All Rights Reserved.
 */
import {AxiosResponse} from 'axios'
import {useUserStoreHook} from '/@/store/modules/user'
import request from './index'
import {deletePendingMapKey} from './repeat'
// 是否正在刷新token的标记
let isRefreshing = false
// 请求队列
let requests = []
/**
 * 刷新token
 */
function refreshToken(response: AxiosResponse) {
  const refreshtoken = sessionStorage.getItem('refresh_token')
  // 判断 没有refresh_token的处理
  return request({
    method: 'post',
    url: import.meta.env.VITE_BASE_API_ACCOUNT + '/users/refreshToken',
    data: {
      refreshToken: refreshtoken
    }
  })
    .then((res) => {
      useUserStoreHook().SET_TOKEN(res.data)
      // 刷新完重新发起请求
      console.log(res.data)

      requests.forEach((cb) => cb(res.data.access_token))
      requests = []
      response.config.headers['Authorization'] = 'Bearer ' + res.data.access_token

      return request(response.config)
    })
    .catch(() => {
      // debugger
      useUserStoreHook().logOut()
      location.reload()
    })
    .finally(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isRefreshing = false
    })
}

export function isRefresh(response: AxiosResponse) {
  // debugger
  // 判断token是否过期
  const config = response.config
  // 如果没有刷新token则刷新
  if (!isRefreshing) {
    isRefreshing = true
    deletePendingMapKey(config)
    return refreshToken(response)
  } else {
    //   已经在刷新了则把请求存起来
    // 正在刷新token，返回一个未执行resolve的promise
    new Promise((resolve) => {
      // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      requests.push((access_token) => {
        config.headers['Authorization'] = 'Bearer ' + access_token
        deletePendingMapKey(config)
        resolve(request(config))
      })
    })
    return false
  }
}
