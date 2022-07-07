import request from '/@/utils/request'
import { payMethodEnum } from '/@/enums/payMethodEnum'

const url = import.meta.env.VITE_BASE_API_LOGISTICS

/**
 *
 * @description 餐厅列表
 */

export interface Balances extends PageBase {
  type?: payMethodEnum
  userId?: number
  userUserId?: number
}

export const getBalancesList = function (params: Balances) {
  return request<DefaultPagingData>({
    url: url + `/balances`,
    method: 'get',
    params,
  })
}

/**
 * @description  餐厅详情
 */

export const getBalancesDetail = function (id: number) {
  return request({
    url: url + `/balances/${id}`,
    method: 'get',
  })
}

/**
 * @description  餐厅新增
 */

export interface PostBalances {
  name: string
  types: string[]
}

export const postBalances = function (data: PostBalances) {
  return request({
    url: url + `/balances`,
    method: 'post',
    data,
  })
}

/**
 * @description  餐厅修改
 */

export const putBalancesId = function (data) {
  return request({
    url: url + `/balances/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @description  餐厅删除

 */

export const deleteBalancesId = function (data) {
  return request({
    url: url + `/balances/${data}`,
    method: 'delete',
  })
}

/**
 * @description  餐厅批量删除
 */

export const postBalancesBatchDelete = function () {
  return request({
    url: url + `/balances/batchDelete`,
    method: 'post',
  })
}
