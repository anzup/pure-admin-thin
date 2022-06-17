import { AxiosPromise } from 'axios'
import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 * @function 授课时段分页列表
 */

export interface GetTrainingTimes extends PageBase {
  enabled?: boolean
  ids?: string
}

export const getTrainingTimes = function (
  params: GetTrainingTimes
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/trainingTimes`,
    method: 'get',
    params
  })
}

/**
 * @function 授课时段新增
 */

export interface PostTrainingTimes {
  name: string
  startMinute: any
  endMinute: any
  start: any
  end: any
  id?: number
  canHide?:boolean
}

export const postTrainingTimes = function (data: PostTrainingTimes) {
  return request({
    url: url + `/trainingTimes`,
    method: 'post',
    data
  })
}
/**
 * @function  授课时段修改
 */

export const putTrainingTimes = function (params: PostTrainingTimes) {
  const { id, ...data } = params
  return request({
    url: url + `/trainingTimes/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 授课时段详情
 */
export const getTrainingTimesDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/trainingTimes/${id}`,
    method: 'get'
  })
}
/**
 *@function 授课时段删除
 */
export const deleteTrainingTimes = function (id: number) {
  return request({
    url: url + `/trainingTimes/${id}`,
    method: 'delete'
  })
}
