import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

export const getMessage = (params) =>
  request({
    url: url + '/messages',
    method: 'get',
    params,
  })

/**
 *
 * @param {修改密码} params
 */
export const postChangePassword = (data) =>
  request({
    url: url + '/users/changePassword',
    method: 'post',
    data,
  })
/**
 *
 * @param {修改pin码} params
 */
export const postChangePinCode = (data) =>
  request({
    url: url + '/users/pinCode',
    method: 'put',
    data,
  })
export const getTasks = () =>
  request({
    url: url + '/users/tasks',
    method: 'get',
  })

export const ignoreTasks = (data) =>
  request({
    url: url + '/ignoreTasks',
    method: 'post',
    data,
  })
