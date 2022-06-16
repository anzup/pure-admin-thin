import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CSM;
/**
 *
 * @param {
 * 类型列表
 * }
 */
export interface GetParamsInterface extends PageBase {
  enabled?: boolean
}
export const getQualificationTypesList = function (params) {
  return request({
    url: url + `/qualificationTypes`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 类型详情
 * }
 */

export const getQualificationTypesDetail = function (params) {
  return request({
    url: url + `/qualificationTypes/${params}`,
    method: 'get'
  })
}

/**
 * @param {
 * 类型新增
 * }
 */
export interface PostParams {
  name: string
  validDays: number
  warningDays: number
}
export const postQualificationTypes = function (data) {
  return request({
    url: url + `/qualificationTypes`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 类型修改
 * }
 */

export const putQualificationTypesId = function (data) {
  return request({
    url: url + `/qualificationTypes/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 类型删除
 * }
 */

export const deleteQualificationTypesId = function (data) {
  return request({
    url: url + `/qualificationTypes/${data}`,
    method: 'delete'
  })
}
//---------------------------------
/**
 *
 * @param {
 * 资质列表
 * }
 */

export const getQualificationList = function (params) {
  return request({
    url: url + `/qualifications`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 资质详情
 * }
 */

export const getQualificationDetail = function (params) {
  return request({
    url: url + `/qualifications/${params}`,
    method: 'get'
  })
}

/**
 * @param {
 *资质新增
 * }
 */

export const postQualification = function (data) {
  return request({
    url: url + `/qualifications`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 资质修改
 * }
 */

export const putQualificationId = function (data) {
  return request({
    url: url + `/qualifications/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 资质删除
 * }
 */

export const deleteQualificationId = function (data) {
  return request({
    url: url + `/qualifications/${data}`,
    method: 'delete'
  })
}
