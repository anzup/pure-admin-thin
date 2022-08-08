import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_OPM
const ftmUrl = import.meta.env.VITE_BASE_API_FTM
// interface IBase {
//   page: number
//   size: number
//   sort?: string
//   searchKey?: string
//   order?: string
// }
/**
 *
 * @param {
 * 资源配置列表
 * }
 */
export enum EResourceType {
  FACILITIES = 'FACILITIES',
  TEACHER = 'TEACHER',
}
export interface IResourcesList extends PageBase {
  builtin?: boolean
  resourceType?: 'FACILITIES' | 'TEACHER'
  builtinAndMFTD?: boolean
}
export const getResourcesList = function (params: IResourcesList) {
  return request({
    url: url + `/resources`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 资源配置详情
 * }
 */

export const getResourcesDetail = function (params) {
  return request({
    url: url + `/resources/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 资源配置新增
 * }
 */

export const postResources = function (data) {
  return request({
    url: url + `/resources`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 资源配置修改
 * }
 */

export const putResourcesId = function (data) {
  return request({
    url: url + `/resources/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 资源配置删除
 * }
 */

export const deleteResourcesId = function (data) {
  return request({
    url: url + `/resources/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 资源配置批量删除
 * }
 */

export const postResourcesBatchDelete = function () {
  return request({
    url: url + `/resources/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getResourcesAll = function () {
  return request({
    url: url + `/resources/all`,
    method: 'get',
  })
}
/**
 * @param {
 * 普通资源下拉列表
 * }
 */

export const getResourcesNormal = function () {
  return request({
    url: url + `/resources/normal`,
    method: 'get',
  })
}
/**
 * @param {
 * 排课相关资源下拉列表
 * }
 */

export const getResourcesoSchedule = function (params?: {
  resourceType: 'FACILITIES' | 'TEACHER'
}) {
  return request({
    url: url + `/resources/schedule`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 保存课程资源
 * }
 */

export const putSyllabusesResources = function (params?: { id: number | string; data: number[] }) {
  return request({
    url: ftmUrl + `/syllabuses/resources/${params.id}`,
    method: 'put',
    data: params.data,
  })
}

/**************** 合同管理 *********************/
/**
 *
 * @param {
 * 合同列表
 * }
 */

export const getContractsList = function (params) {
  return request({
    url: url + `/contracts`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {
 * 历史合同列表
 * }
 */

export const getContractsHistoryList = function (params) {
  return request({
    url: url + `/contracts/history`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 合同详情
 * }
 */

export const getContractsDetail = function (params) {
  return request({
    url: url + `/contracts/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 合同新增
 * }
 */

export const postContracts = function (data) {
  return request({
    url: url + `/contracts`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 合同修改
 * }
 */

export const putContractsId = function (data) {
  return request({
    url: url + `/contracts/${data.id}`,
    method: 'put',
    data,
  })
}
/**
 * @param {
 * 合同中止
 * }
 */

export const putContractsIdValid = function (id: number) {
  return request({
    url: url + `/contracts/${id}/valid`,
    method: 'put',
  })
}

/**
 * @param {
 * 合同删除
 * }
 */

export const deleteContractsId = function (data) {
  return request({
    url: url + `/contracts/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 合同批量删除
 * }
 */

export const postContractsBatchDelete = function () {
  return request({
    url: url + `/contracts/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getContractsAll = function () {
  return request({
    url: url + `/contracts/all`,
    method: 'get',
  })
}

/**
 * @param {
 * 结算单位下拉列表
 * }
 */

export const getCurrencyAll = function () {
  return request({
    url: url + `/currency/all`,
    method: 'get',
  })
}
/**************** 账单条目管理 *********************/
/**
 *
 * @param {
 * 账单条目列表
 * }
 */

export const getBillItemsList = function (params) {
  return request({
    url: url + `/billItems`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 账单条目详情
 * }
 */

export const getBillItemsDetail = function (params) {
  return request({
    url: url + `/billItems/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 账单条目新增
 * }
 */

export const postBillItems = function (data) {
  return request({
    url: url + `/billItems`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 账单条目修改
 * }
 */

export const putBillItemsId = function (data) {
  return request({
    url: url + `/billItems/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 账单条目删除
 * }
 */

export const deleteBillItemsId = function (data) {
  return request({
    url: url + `/billItems/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 账单条目忽略
 * }
 */

export const putBillItemsIgnore = function (data: { ids: number[] }) {
  return request({
    url: url + `/billItems/ignore`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 账单条目取消忽略
 * }
 */

export const putBillItemsIgnoreDelete = function (data: { ids: number[] }) {
  return request({
    url: url + `/billItems/ignore/delete`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 账单条目批量删除
 * }
 */

export const postBillItemsBatchDelete = function () {
  return request({
    url: url + `/billItems/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 账单条目批量删除
 * }
 */

export const putBillItemsRemove = function (id: number) {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `/billItems/` + id + `/remove`,
    method: 'put',
  })
}

/**************** 账单 *******************/
/**
 * @param {
 * 检查是否新结算客户
 * }
 */

export const getBillcheck = function (data: { value: string; customerId: number }) {
  const { customerId, ...params } = data
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `/bills/check/${customerId}`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 账单新增
 * }
 */

export const postBills = function (data: {
  billItemIds: number[]
  endDate: string
  startDate: string
  present: boolean
}) {
  return request({
    url: url + `/bills`,
    method: 'post',
    data,
  })
}
/**
 *
 * @param {
 * 账单列表
 * }
 */

export const getBillsList = function (params) {
  return request({
    url: url + `/bills`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {
 * 历史账单列表
 * }
 */

export const getBillsHistoryList = function (params) {
  return request({
    url: url + `/bills/history`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 账单详情
 * }
 */

export const getBillsDetail = function (params) {
  return request({
    url: url + `/bills/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 账单批量详情
 * }
 */

export const getBillsDetailList = function (params: { value: string }) {
  return request({
    url: url + `/bills/detailList`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 账单添加备注
 * }
 */

export const putBillsRemark = function (data: { id: number; data: { value: string } }) {
  return request({
    url: url + `/bills/${data.id}/remark`,
    method: 'put',
    data: data.data,
  })
}

/**
 * @param {
 * 账单修改
 * }
 */

export const putBillsId = function (data) {
  return request({
    url: url + `/bills/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 账单删除
 * }
 */

export const deleteBillsId = function (data) {
  return request({
    url: url + `/bills/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 账单批量删除
 * }
 */

export const postBillsBatchDelete = function () {
  return request({
    url: url + `/bills/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 账单结算
 * }
 */

export const putBillsSettle = function (id: number) {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `/bills/${id}/settle`,
    method: 'put',
  })
}
