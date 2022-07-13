import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_ACCOUNT
const opmUrl = import.meta.env.VITE_BASE_API_OPM
// import { navigationSettings } from '/@/store/modules/app'

export const getUserInfo = (params: any) =>
  request({
    url: `/opm/api/public/userInfo/${params.userId}`,
    method: 'get',
    // params
    headers: {
      Authorization: 'Basic aHVheXVleGluZzpodWF5dWV4aW5n',
    },
  })

export const login = (data: any) =>
  request({
    url: url + '/users/token',
    method: 'post',
    data,
  })

export const logout = () =>
  request({
    url: url + '/users/logout',
    method: 'post',
  })

// 获取当前的导航栏设置
export const getSettings = () =>
  request({
    url: opmUrl + `/settings`,
    method: 'get',
  })
// 导航栏设置
export const putSettings = (data) =>
  request({
    url: opmUrl + `/settings`,
    method: 'put',
    data,
  })
