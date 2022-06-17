import { AxiosPromise } from 'axios'
import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CSM

/**
 *
 * @param {
 * 类型列表
 * }
 */

export interface CourseTypesList extends PageBase { }
export const getCourseTypesList = function (params: CourseTypesList): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/courseTypes`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 类型详情
 * }
 */

export const getCourseTypesDetail = function (params) {
  return request({
    url: url + `/courseTypes/${params}`,
    method: 'get'
  })
}

/**
 * @param {
 * 类型新增
 * }
 */

export const postCourseTypes = function (data) {
  return request({
    url: url + `/courseTypes`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 类型修改
 * }
 */

export const putCourseTypesId = function (data) {
  return request({
    url: url + `/courseTypes/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 类型删除
 * }
 */

export const deleteCourseTypesId = function (data) {
  return request({
    url: url + `/courseTypes/${data}`,
    method: 'delete'
  })
}
