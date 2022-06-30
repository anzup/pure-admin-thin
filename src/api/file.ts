import { AxiosPromise } from 'axios'
import request from '/@/utils/request'

const pubUrl = import.meta.env.VITE_BASE_API_PUB
// const url = import.meta.env.VITE_BASE_API_LOGISTICS

// 开放接口下载文件
export const getOpenDownload = function (uuid: string) {
  // const url= '/quality/attachment/{attachmentId}/fileExists';
  return request({
    url: pubUrl + `/open/${uuid}/download`,
    method: 'get',
    responseType: 'blob',
  })
}

/**
 * 获取文件信息
 */
export function getfileInfo(uuid: string): AxiosPromise<ResponseFileType> {
  return request({
    url: pubUrl + '/files/' + uuid,
    method: 'get',
  })
}

/**
 * 批量获取文件信息
 * @param {String} uuids 逗号分割
 */
export function getfileInfoList(params: { uuids: string }): AxiosPromise<ResponseFileType[]> {
  return request({
    url: pubUrl + '/files/list',
    method: 'get',
    params,
  })
}

/**
 * 文件上传
 */
export interface UploadFile {
  file: File
  path: string
  unzip: boolean
}

export function postFileUpload(file: File, unzip?: boolean, P_repeatRequestCancel = false) {
  const data = new FormData()
  data.append('file', file)
  if (unzip) data.append('unzip', String(file.type === 'application/x-zip-compressed'))
  return request({
    url: pubUrl + `/files/upload`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
    P_repeatRequestCancel,
  })
}

/**
 * 文件批量上传
 */

export function postFilesUpload(files: File[]) {
  const data = new FormData()
  for (const file of files) {
    data.append('files', file)
  }
  return request({
    url: pubUrl + `/files/uploads`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

/**
 * 预览文件（返回url）
 */
export function previewURL(uuid: string) {
  return import.meta.env.VITE_BASE_URL + `${pubUrl}/open/${uuid}/inline`
}
