import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM
const pubUrl = import.meta.env.VITE_BASE_API_PUB

// 文件详情
export const getFileDetail = (params) =>
  request({
    url: pubUrl + `/files/${params.uuid}`,
    method: 'get',
    params,
  })
// 文件下载
export const getFileDownload = (params) =>
  request({
    url: pubUrl + `/files/${params.uuid}/download`,
    method: 'get',
    params,
  })

/**
 * 文件中心相关接口
 */
// 文件列表
export const getFileFolder = (params) =>
  request({
    url: url + `/folders`,
    method: 'get',
    params,
  })
// 新增
export const postFileFolder = (data) =>
  request({
    url: url + `/folders`,
    method: 'post',
    data,
  })
// 详情
export const getFileFolderId = (params) =>
  request({
    url: url + `/folders/${params.uuid}`,
    method: 'get',
    params,
  })
// 修改
export const putFileFolder = (data) =>
  request({
    url: url + `/folders/${data.uuid}`,
    method: 'put',
    data,
  })
// 删除
export const putFileFolderDisable = (data) =>
  request({
    url: url + `/folders/${data.uuid}`,
    method: 'delete',
    data,
  })

// 上传文件
export const postUpload = (data) =>
  request({
    url: pubUrl + `/files/upload`,
    method: 'post',
    data,
  })
// 资源新增
export const postResource = (data) =>
  request({
    url: url + `/fileResources`,
    method: 'post',
    data,
  })
// 资源修改
export const putResource = (data) =>
  request({
    url: url + `/fileResources/${data.uuid}`,
    method: 'put',
    data,
  })
// 资源详情
export const getResourceId = (params) =>
  request({
    url: url + `/fileResources/${params.uuid}`,
    method: 'get',
    params,
  })
// 文件详情
export const getFilesId = (params) =>
  request({
    url: pubUrl + `/files/${params.uuid}`,
    method: 'get',
    params,
  })
// 资源删除
export const pustResourceDisAble = (data) =>
  request({
    url: url + `/fileResources/${data.uuid}`,
    method: 'delete',
    data,
  })
/**
 * 预览文件（返回axios对象）
 */
export const previewFile = (uuid) =>
  request({
    url: pubUrl + `/files/${uuid}/inline`,
    method: 'get',
    responseType: 'arraybuffer',
  })

// 判断文件是否存在
export const isHaveFile = (params) =>
  request({
    url: pubUrl + `/files/${params.uuid}/fileExists`,
    method: 'get',
    params,
  })

/**
 * 批量文件查询
 * @param { uuids : 多个uuid, 用逗号','分隔 }
 */
export const detailsFiles = (params) =>
  request({
    url: pubUrl + `/files/list`,
    method: 'get',
    params,
  })

// 文件详情
export const getFiles = (params) =>
  request({
    url: pubUrl + `/files/${params.uuid}`,
    method: 'get',
    params,
  })
