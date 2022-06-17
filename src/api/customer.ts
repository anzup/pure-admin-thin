import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 *
 * @param {
 * 客户列表
 * }
 */
export interface Customers extends PageBase {
  customerTypeId?: number
  name?: string
}
export const getCustomersList = function (params: Customers, cancel = true) {
  return request<DefaultPagingData>({
    url: url + `/customers`,
    method: 'get',
    params,
    P_repeatRequestCancel: cancel
  })
}

/**
 * @param {
 * 客户详情
 * }
 */

export const getCustomersDetail = function (id: number) {
  return request({
    url: url + `/customers/${id}`,
    method: 'get'
  })
}

/**
 * @param {
 * 客户新增
 * }
 */

export const postCustomers = function (data) {
  return request({
    url: url + `/customers`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 客户修改
 * }
 */

export const putCustomersId = function (data) {
  return request({
    url: url + `/customers/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 客户删除
 * }
 */

export const deleteCustomersId = function (data) {
  return request({
    url: url + `/customers/${data}`,
    method: 'delete'
  })
}

/**
 * @param {
 * 客户批量删除
 * }
 */

export const postCustomersBatchDelete = function () {
  return request({
    url: url + `/customers/batchDelete`,
    method: 'post'
  })
}

/**
 *
 * @param {
 * 客户类型列表
 * }
 */

export const getCustomersTypesList = function (params) {
  return request({
    url: url + `/customerTypes`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 客户类型详情
 * }
 */

export const getCustomersTypesDetail = function (params) {
  return request({
    url: url + `/customerTypes/${params}`,
    method: 'get'
  })
}

/**
 * @param {
 * 客户类型新增
 * }
 */

export const postCustomersTypes = function (data) {
  return request({
    url: url + `/customerTypes`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 客户类型修改
 * }
 */

export const putCustomersTypesId = function (data) {
  return request({
    url: url + `/customerTypes/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 客户类型删除
 * }
 */

export const deleteCustomersTypesId = function (data) {
  return request({
    url: url + `/customerTypes/${data}`,
    method: 'delete'
  })
}

/**
 * @param {
 * 客户批量删除
 * }
 */

export const postCustomersTypesBatchDelete = function () {
  return request({
    url: url + `/customerTypes/batchDelete`,
    method: 'post'
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getCustomersTypesAll = function () {
  return request({
    url: url + `/customerTypes/all`,
    method: 'get'
  })
}
