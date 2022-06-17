import { AxiosDefaults, AxiosPromise } from 'axios'
import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CSM

/**
 *
 * @param {
 * 授课资质列表
 * }
 */

export const getTeachingQualificationRecordsList = function (params) {
  return request({
    url: url + `/teachingQualificationRecords`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 授课资质详情
 * }
 */

export const getTeachingQualificationRecordsDetail = function (params) {
  return request({
    url: url + `/teachingQualificationRecords/${params}`,
    method: 'get'
  })
}

/**
 * @param {
 * 授课资质新增
 * }
 */

export const postTeachingQualificationRecords = function (data) {
  return request({
    url: url + `/teachingQualificationRecords`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 授课资质修改
 * }
 */

export const putTeachingQualificationRecordsId = function (data) {
  return request({
    url: url + `/teachingQualificationRecords/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 授课资质删除
 * }
 */

export const deleteTeachingQualificationRecordsId = function (data) {
  return request({
    url: url + `/teachingQualificationRecords/${data}`,
    method: 'delete'
  })
}
/**
 * @param {
 * 批量删除
 * }
 */
export const batchTeachingQualificationRecords = function (data) {
  return request({
    url: url + `/teachingQualificationRecords/batchDelete`,
    method: 'post',
    data
  })
}
/**
 *
 * @param {
 * 授课资质 统计列表
 * }
 */

export const getTeachingQualificationsList = function (params) {
  return request({
    url: url + `/teachingQualifications`,
    method: 'get',
    params
  })
}
/**
 *
 * @param {
 * 授课资质 有效天获取
 * }
 */

export const getTeachingQualificationValidDays = function (params) {
  return request({
    url: url + `/teachingQualificationValidDays`,
    method: 'get',
    params
  })
}
/**
 * 有效天-修改
 */
export const putTeachingQualificationValidDays = function (data) {
  return request({
    url: url + `/teachingQualificationValidDays`,
    method: 'put',
    data
  })
}

/**
 * 修改优先级
 */
export const putToggleIsPreferred = function (data) {
  return request({
    url: url + `/teachingQualificationRecords/toggleIsPreferred/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * 资质状态
 */
export const putToggleIsValid = function (data) {
  return request({
    url: url + `/teachingQualificationRecords/toggleIsValid/${data.id}`,
    method: 'put',
    data
  })
}
/**
 *@function 导出模板
 */
export const getTeachingQualificationRecordsExport = function (params) {
  return request({
    url: url + `/teachingQualificationRecords/import`,
    method: 'get',
    responseType: 'blob',
    params
  })
}
/**
 * @function 批量导入
 * 
 */
export const ImportTeachingQualificationRecords = function (file, data) {
  return request({
    url: url + `/teachingQualificationRecords/import/${data.teachingQualificationId}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: file
  })
}