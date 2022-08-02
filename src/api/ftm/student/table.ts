import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

export const getList = (params) =>
  request({
    url: url + '/vue-admin-template/table/list',
    method: 'get',
    params,
  })
