/*
 * @Author: 冉茂廷 1012377328@qq.com
 * @Date: 2022-05-19 17:52:39
 * @LastEditors: 冉茂廷 1012377328@qq.com
 * @LastEditTime: 2022-05-19 21:02:46
 * @FilePath: \crew-web\src\utils\request\types.ts
 * @Description:
 *
 * Copyright (c) 2022 by 冉茂廷 1012377328@qq.com, All Rights Reserved.
 */
import {AxiosRequestConfig} from 'axios'

// 添加一个私有前缀,以免和请求参数混合
export interface HttpCustomConfig {
  /**
   * @description: 重复请求处理，默认为ture
   */
  P_repeatRequestCancel?: boolean
  /**
   * @description: 是否处理对象的空值，默认为false
   */
  P_removeEmptyProp?: boolean
  /**
   * @description: 是否显示请求时的loading，默认为false
   */
  // P_showLoading?: boolean
}

export type HttpRequesrConfig = AxiosRequestConfig & HttpCustomConfig
