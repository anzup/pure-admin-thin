import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_OPM
const ftmUrl = import.meta.env.VITE_BASE_API_FTM
/**
 *
 * @param {
 * 客户列表
 * }
 */

export const getCustomersList = function (params) {
  return request({
    url: ftmUrl + `/customers`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 客户详情
 * }
 */

export const getCustomersDetail = function (params) {
  return request({
    url: ftmUrl + `/customers/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 客户新增
 * }
 */

export const postCustomers = function (data) {
  return request({
    url: ftmUrl + `/customers`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 客户修改
 * }
 */

export const putCustomersId = function (data) {
  return request({
    url: ftmUrl + `/customers/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 客户删除
 * }
 */

export const deleteCustomersId = function (data) {
  return request({
    url: ftmUrl + `/customers/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 客户批量删除
 * }
 */

export const postCustomersBatchDelete = function () {
  return request({
    url: ftmUrl + `/customers/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getCustomersAll = function () {
  return request({
    url: ftmUrl + `/customers/all`,
    method: 'get',
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
    url: ftmUrl + `/customerTypes`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 客户类型详情
 * }
 */

export const getCustomersTypesDetail = function (params) {
  return request({
    url: ftmUrl + `/customerTypes/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 客户类型新增
 * }
 */

export const postCustomersTypes = function (data) {
  return request({
    url: ftmUrl + `/customerTypes`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 客户类型修改
 * }
 */

export const putCustomersTypesId = function (data) {
  return request({
    url: ftmUrl + `/customerTypes/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 客户类型删除
 * }
 */

export const deleteCustomersTypesId = function (data) {
  return request({
    url: ftmUrl + `/customerTypes/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 客户批量删除
 * }
 */

export const postCustomersTypesBatchDelete = function () {
  return request({
    url: ftmUrl + `/customerTypes/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getCustomersTypesAll = function () {
  return request({
    url: ftmUrl + `/customerTypes/all`,
    method: 'get',
  })
}
