import http from '@/utils/http'
// import axios from 'axios'

const baseURL = process.env.VUE_APP_BASE_API_PUB
/**
 *  上传、更新签名
 *  param:{
 *      file: 图片文件
 *      pinCode: pin码
 *  }
 */
export function updateSignForm(param){
    return http('/users/signature', param, 'post', 'form')
}

/**
 * 获取当前用户信息
 */
export function getPersonCurrnt(){
    return http('/users/current', false, 'get')
}

/**
 * 预览文件（返回axios对象）
 */
export function previewFile(uuid){
    // return `${baseURL}/open/${uuid}/inline`
    return http(`${baseURL}/files/${uuid}/inline`, false, 'get', false, 'arraybuffer', true)
}
/**
 * 获取文件信息
 */
export function getfileInfo(uuid){
    // return `${baseURL}/open/${uuid}/inline`
    return http(`${baseURL}/files/${uuid}`, false, 'get','json',false,1)
}

/**
 * 预览文件（返回url）
 */
export function previewURL(uuid){
    return `${baseURL}/open/${uuid}/inline`
}
/**
 * 获取消息列表
 */
 
 export function getMessages(param){
    return http('/messages', param, 'get')
}
/**
 * 详情
 */
 
 export function getMessagesId(param){
    return http('/messages/{id}', param, 'get_p')
}
/**
 * 删除
 */
 
 export function deleteMessagesId(param){
    return http('/messages/{id}', param, 'delete')
}
/**
 * 更新状态
 */
 
 export function putMessagesId(param){
    return http('/messages/{id}', param, 'put')
}

// 标记附件已读未读
export function putMessageMarkRead(params) {
    return http('/messages/markRead', params, 'put');
}