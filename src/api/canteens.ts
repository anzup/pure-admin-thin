import request from '/@/utils/request'

const url = import.meta.env.VITE_BASE_API_LOGISTICS

/**
 *
 * @description 餐厅列表
 */

export type Canteens = PageBase

export const getCanteensList = function (params: Canteens) {
  return request<DefaultPagingData>({
    url: url + `/canteens`,
    method: 'get',
    params,
  })
}

/**
 * @description  餐厅详情
 */

export const getCanteensDetail = function (id: number) {
  return request({
    url: url + `/canteens/${id}`,
    method: 'get',
  })
}

/**
 * @description  餐厅新增
 */

export interface PostCanteens {
  name: string
  types: string[]
}

export const postCanteens = function (data: PostCanteens) {
  return request({
    url: url + `/canteens`,
    method: 'post',
    data,
  })
}

/**
 * @description  餐厅修改
 */

export const putCanteensId = function (data) {
  return request({
    url: url + `/canteens/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @description  餐厅删除

 */

export const deleteCanteensId = function (data) {
  return request({
    url: url + `/canteens/${data}`,
    method: 'delete',
  })
}

/**
 * @description  餐厅批量删除
 */

export const postCanteensBatchDelete = function () {
  return request({
    url: url + `/canteens/batchDelete`,
    method: 'post',
  })
}
