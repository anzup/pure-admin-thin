import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

export const login = (data) =>
  request({
    url: url + '/vue-admin-template/user/login',
    method: 'post',
    data,
  })

export const getInfo = (token) =>
  request({
    url: url + '/vue-admin-template/user/info',
    method: 'get',
    params: { token },
  })

export const logout = () =>
  request({
    url: url + '/vue-admin-template/user/logout',
    method: 'post',
  })

export const postUsersRefreshToken = (data) =>
  request({
    url: url + '/users/refreshToken',
    method: 'post',
    data,
  })

export const postChangePassword = (data) =>
  request({
    url: url + '/users/changePassword',
    method: 'post',
    data,
  })

export const postChangePinCode = (data) =>
  request({
    url: url + '/users/pinCode',
    method: 'put',
    data,
  })

export const getUsersInfo = (params) =>
  request({
    url: url + `/users/${params.id}`,
    method: 'get',
    params,
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

export const getMessage = (params) =>
  request({
    url: url + '/messages',
    method: 'get',
    params,
  })
