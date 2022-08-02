import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM
const pubUrl = import.meta.env.VITE_BASE_API_PUB
/**
 *  上传、更新签名
 */
export const updateSignForm = (data) =>
  request({
    url: url + '/users/signature',
    method: 'post',
    header: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })

/**
 * 获取当前用户信息
 */
export const getPersonCurrnt = () =>
  request({
    url: url + '/users/current',
    method: 'get',
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

/**
 * 获取文件信息
 */
export const getfileInfo = (uuid) =>
  request({
    url: pubUrl + `/files/${uuid}`,
    method: 'get',
  })

/**
 * 预览文件（返回url）
 */
export const previewURL = (uuid) => {
  return pubUrl + `/open/${uuid}/inline`
}

/**
 * 获取消息列表
 */
export const getMessages = (params) =>
  request({
    url: url + '/messages',
    method: 'get',
    params,
  })

/**
 * 详情
 */
export const getMessagesId = (params) =>
  request({
    url: url + '/messages/' + params.id,
    method: 'get',
    params,
  })

/**
 * 删除
 */
export const deleteMessagesId = (data) =>
  request({
    url: url + '/messages/' + data.id,
    method: 'delete',
    data,
  })

/**
 * 更新状态
 */
export const putMessagesId = (data) =>
  request({
    url: url + '/messages/' + data.id,
    method: 'put',
    data,
  })

// 标记附件已读未读
export const putMessageMarkRead = (data) =>
  request({
    url: url + '/messages/markRead',
    method: 'put',
    data,
  })
