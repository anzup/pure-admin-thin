import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

export const putSettings = (data) =>
  request({
    url: url + '/settings',
    method: 'put',
    data,
  })
// 获取登陆日志
export const getJournals = (params) =>
  request({
    url: url + '/journals',
    method: 'get',
    params,
  })
// 生成登录日志
export const postJournals = (data) =>
  request({
    url: url + '/journals',
    method: 'post',
    data,
  })

/**
 * 功能设置
 */
// 分页列表
export const getConfigs = (params) =>
  request({
    url: url + '/configs',
    method: 'get',
    params,
  })
// 新增
export const postConfigs = (data) =>
  request({
    url: url + '/configs',
    method: 'post',
    data,
  })
// 批量删除
export const batchDeleteConfigs = (data) =>
  request({
    url: url + '/configs/batchDelete',
    method: 'post',
    data,
  })
// 详情
export const getConfigsDetail = (params) =>
  request({
    url: url + '/configs/' + params.id,
    method: 'get',
    params,
  })
// 修改
export const putConfigs = (data) =>
  request({
    url: url + '/configs/' + data.id,
    method: 'put',
    data,
  })
// 删除
export const deleteConfigs = (data) =>
  request({
    url: url + '/configs/' + data.id,
    method: 'delete',
    data,
  })
