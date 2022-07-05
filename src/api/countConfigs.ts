import request from '/@/utils/request'

const url = import.meta.env.VITE_BASE_API_LOGISTICS

/**
 *
 * @description 餐厅列表
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
 * @description  餐厅详情
 */

export const getCountConfigsDetail = function (id: number) {
  return request({
    url: url + `/countConfigs/${id}`,
    method: 'get',
  })
}

/**
 * @description  餐厅新增
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
 * @description  餐厅修改
 */

export const putCountConfigsId = function (data) {
  return request({
    url: url + `/countConfigs/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @description  餐厅删除

 */

export const deleteCountConfigsId = function (data) {
  return request({
    url: url + `/countConfigs/${data}`,
    method: 'delete',
  })
}

/**
 * @description  餐厅批量删除
 */

export const postCountConfigsBatchDelete = function () {
  return request({
    url: url + `/countConfigs/batchDelete`,
    method: 'post',
  })
}
