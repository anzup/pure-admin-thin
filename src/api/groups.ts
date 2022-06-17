import { AxiosPromise } from 'axios'
import request from '/@/utils/request'
import { Status } from '/@/enums/questionnaire'

const url = import.meta.env.VITE_BASE_API_CPM

/**
 * @function 分组分页列表
 */

export type GroupStatus = Omit<keyof Status, 'TERMINATED'>

export interface GetGroups extends PageBase {
  clazzId?: number
  clazzIdIN?: number[]
  endTime?: Date
  positionIds?: number[]
  startTime?: Date
  startTimeGE?: Date
  startTimeLT?: Date
  status?: GroupStatus
  trainingItemId?: number
  trainingTypeConfigId?: number
  time?: Date
  customerId?: number
}

export const getGroups = function (params: GetGroups): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/groups`,
    method: 'get',
    params,
  })
}

/**
 * @function 分组新增
 */

export interface PostGroups {
  name: string
  remark: string
  id?: number
  planeJobs?: object[]
}

export const postGroups = function (data: PostGroups) {
  return request({
    url: url + `/groups`,
    method: 'post',
    data,
  })
}
/**
 * @function  分组修改
 */

export const putGroups = function (params: PostGroups) {
  const { id, ...data } = params
  return request({
    url: url + `/groups/${id}`,
    method: 'put',
    data,
  })
}
/**
 *@function 分组详情
 */
export const getGroupsDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/groups/${id}`,
    method: 'get',
  })
}
/**
 *@function 分组删除
 */
export const deleteGroups = function (id: number) {
  return request({
    url: url + `/groups/${id}`,
    method: 'delete',
  })
}
