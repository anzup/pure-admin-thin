import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM
// 添加，个数需要>1
export const postAccountAssociations = (data) =>
  request({
    url: url + '/accountAssociations',
    method: 'post',
    data,
  })
// 详情
export const getAccountAssociations = (params) =>
  request({
    url: url + `/accountAssociations/${params.id}`,
    method: 'get',
    params,
  })
// 修改，个数小于2将删除关联
export const putAccountAssociations = (data) =>
  request({
    url: url + `/accountAssociations/${data.id}`,
    method: 'put',
    data,
  })
// 根据职员id获取关联
export const getAccountAssociationsByEmployeeId = (params) =>
  request({
    url: url + '/accountAssociations/byEmployeeId',
    method: 'get',
    params,
  })
// 自己的关联
export const getAccountAssociationsBySelf = (params) =>
  request({
    url: url + '/accountAssociations/self',
    method: 'get',
    params,
  })
// 自己添加账号
export const postAccountAssociationsAppendSelf = (data) =>
  request({
    url: url + '/accountAssociations/self/append',
    method: 'post',
    data,
  })
// 自己移除账号
export const postAccountAssociationsRemoveSelf = (data) =>
  request({
    url: url + '/accountAssociations/self/remove',
    method: 'post',
    data,
  })
// 切换账号
export const postAccountAssociationsSwitchSelf = (data) =>
  request({
    url: url + `/accountAssociations/self/switch/${data.employeeId}`,
    method: 'post',
    data,
  })
