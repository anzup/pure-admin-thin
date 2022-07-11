import request from '/@/utils/request'

const url = import.meta.env.VITE_BASE_API_LOGISTICS

/**
 *
 * @description 次数配置列表
 */

export type CountConfigs = PageBase

export const getCountConfigsList = function (params: CountConfigs) {
  return request<DefaultPagingData>({
    url: url + `/countConfigs`,
    method: 'get',
    params,
  })
}

/**
 * @description  次数配置详情
 */

export const getCountConfigsDetail = function (id: number) {
  return request({
    url: url + `/countConfigs/${id}`,
    method: 'get',
  })
}

/**
 * @description  次数配置新增
 */

export interface PostCountConfigs {
  name: string
  mealTimeIds: number[]
}

export const postCountConfigs = function (data: PostCountConfigs) {
  return request({
    url: url + `/countConfigs`,
    method: 'post',
    data,
  })
}

/**
 * @description  次数配置修改
 */

export const putCountConfigsId = function (data) {
  return request({
    url: url + `/countConfigs/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @description  次数配置删除

 */

export const deleteCountConfigsId = function (data) {
  return request({
    url: url + `/countConfigs/${data}`,
    method: 'delete',
  })
}

/**
 * @description  次数配置批量删除
 */

export const postCountConfigsBatchDelete = function () {
  return request({
    url: url + `/countConfigs/batchDelete`,
    method: 'post',
  })
}
