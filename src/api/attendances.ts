import { AxiosPromise } from 'axios'
import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CSM

/**
 * @function 学员考勤配置 分页列表
 */

export interface GetAttendances extends PageBase {
  enabled?: boolean
  ids?: string
}

export const getAttendances = function (
  params: GetAttendances
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/attendances`,
    method: 'get',
    params
  })
}

/**
 * @function 学员考勤配置 新增
 */

export interface PostAttendances {
  name: string
  symbol: any
  id?: number
  defaultAttended: boolean
  defaultAbsent: boolean
}

export const postAttendances = function (data: PostAttendances) {
  return request({
    url: url + `/attendances`,
    method: 'post',
    data
  })
}
/**
 * @function  学员考勤配置 修改
 */

export const putAttendances = function (params: PostAttendances) {
  const { id, ...data } = params
  return request({
    url: url + `/attendances/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 学员考勤配置 详情
 */
export const getAttendancesDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/attendances/${id}`,
    method: 'get'
  })
}
/**
 *@function 学员考勤配置 删除
 */
export const deleteAttendances = function (id: number) {
  return request({
    url: url + `/attendances/${id}`,
    method: 'delete'
  })
}

