import http from '@/utils/http'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export const postUsersRefreshToken = function (params) {
  const url= '/users/refreshToken';
  return http(url, params, "post");
};
/**
 * 
 * @param {修改密码} params 
 * @returns 
 */
export const postChangePassword = function (params) {
  const url= '/users/changePassword';
  return http(url, params, "post");
};
/**
 * 
 * @param {修改pin码} params 
 * @returns 
 */
export const postChangePinCode = function (params) {
  const url= '/users/pinCode';
  return http(url, params, "put");
};
export const getUsersInfo = function (params) {
  const url= `/users/${params.id}`;
  return http(url, params, "get", );
};

export function getTasks(){
  return http('/users/tasks',false,'get')
}

export function ignoreTasks(params){
  return http('/ignoreTasks', params, 'post')
}

/**
 * 
 * @param {
 *   order: 排序方向(asc/desc),默认为asc
 *   page: 当前页,默认为1
 *   searchKey: 模糊匹配搜索
 *   size: 每页数量,默认为10
 *   sort: 排序参数,默认为id
 *   sourceId: 源id
 *   sourceSubType: 源类子类型
 *   sourceType: 源类型:0.公告
 *   userId: 用户id
 * } 
 */
export function getMessage(params){
  return http('/messages', params, 'get')
}