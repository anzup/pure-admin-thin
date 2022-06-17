import { AxiosPromise } from 'axios'
import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 * @function 计划预排 分页列表
 */

export interface GetPreschedules extends PageBase {
  enabled?: boolean
  ids?: string
  time: any
}

export const getPreschedules = function (
  params: GetPreschedules
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/preschedules`,
    method: 'get',
    params
  })
}

/**
 * @function 新增
 */

export interface PostPreschedules {
  name: string
  id?: number
}

export const postPreschedules = function (data: PostPreschedules) {
  return request({
    url: url + `/preschedules`,
    method: 'post',
    data
  })
}
/**
 * @function  修改
 */

export const putPreschedules = function (params) {
  const { id, ...data } = params
  return request({
    url: url + `/preschedules/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 详情
 */
export const getPreschedulesDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/preschedules/${id}`,
    method: 'get'
  })
}
/**
 *@function 删除
 */
export const deletePreschedules = function (id: number) {
  return request({
    url: url + `/preschedules/${id}`,
    method: 'delete'
  })
}
/**
 *@function 未排列表
 */
export const getPreschedulesUnscheduled =
  function (params: GetPreschedules): AxiosPromise {
    return request({
      url: url + `/preschedules/unscheduled`,
      method: 'get',
      params
    })
  }
/**
 *@function 计划预排-发布
 */
export const publishPreschedules = function (data) {
  return request({
    url: url + `/preschedules/publish`,
    method: 'post',
    data
  })
}

/**
 *@function 计划预排-班级安排
 */
export const postPrescheduleArranges = function (data) {
  return request({
    url: url + `/prescheduleArranges`,
    method: 'post',
    data
  })
}
/**
 * @function  班级安排-修改
 */

export const putPrescheduleArranges = function (params: PostPreschedules) {
  const { id, ...data } = params
  return request({
    url: url + `/prescheduleArranges/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 班级安排-删除
 */
export const deletePrescheduleArranges = function (id: number) {
  return request({
    url: url + `/prescheduleArranges/${id}`,
    method: 'delete'
  })
}

/**
 *@function 班级大纲优先级
 */
export const getClazzSyllabusSelectPriorities = function (params): AxiosPromise {
  return request({
    url: url + `/clazzSyllabusSelectPriorities`,
    method: 'get',
    params
  })
}
/**
 * @function  班级大纲优先级-修改
 */

export const putClazzSyllabusSelectPriorities = function (params: PostPreschedules) {
  const { id, ...data } = params
  return request({
    url: url + `/clazzSyllabusSelectPriorities/${id}`,
    method: 'put',
    data
  })
}
/**
 * @function  班级大纲优先级-批量修改
 */

export const putBatchUpdateClazzSyllabusSelectPriorities = function (data) {
  return request({
    url: url + `/clazzSyllabusSelectPriorities/batchUpdate`,
    method: 'put',
    data
  })
}
