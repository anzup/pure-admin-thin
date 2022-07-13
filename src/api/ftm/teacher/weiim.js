import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

export const logout = () =>
  request({
    url: url + '/vue-admin-template/user/logout',
    method: 'post',
  })
