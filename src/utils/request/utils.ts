/*
 * @Author: 冉茂廷 1012377328@qq.com
 * @Date: 2022-05-19 18:45:14
 * @LastEditors: xiongrui 1315220447@qq.com
 * @LastEditTime: 2022-05-20 16:43:06
 * @FilePath: \crew-web\src\utils\request\utils.ts
 * @Description:
 *
 * Copyright (c) 2022 by 冉茂廷 1012377328@qq.com, All Rights Reserved.
 */
export function removeEmptyProp<T = any>(data: T) {
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      for (const item of data) {
        removeEmptyProp(item)
      }
    } else {
      for (const key in data) {
        if (data[key] === null || data[key] === undefined || (data[key] as any) === '') {
          delete data[key]
        } else if (typeof data[key] === 'object') {
          if (Object.keys(data[key]).length === 0) {
            delete data[key]
          } else {
            removeEmptyProp(data[key])
          }
        }
      }
    }
  }
}
