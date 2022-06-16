import { AxiosPromise } from "axios";
import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 * @function 设施类型分页列表
 */

export interface GetFacilityTypes extends PageBase {
  enabled?: boolean
  ids?: string
}

export const getFacilityTypes = function (
  params: GetFacilityTypes
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/facilityTypes`,
    method: 'get',
    params
  })
}

/**
 * @function 设施类型新增
 */

export interface PostFacilityTypes {
  name: string
  remark: string
  id?: number
}

export const postFacilityTypes = function (data: PostFacilityTypes) {
  return request({
    url: url + `/facilityTypes`,
    method: 'post',
    data
  })
}
/**
 * @function  设施类型修改
 */

export const putFacilityTypes = function (params: PostFacilityTypes) {
  const { id, ...data } = params
  return request({
    url: url + `/facilityTypes/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 设施类型详情
 */
export const getFacilityTypeDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/facilityTypes/${id}`,
    method: 'get'
  })
}
/**
 *@function 设施类型删除
 */
export const deleteFacilityType = function (id: number) {
  return request({
    url: url + `/facilityTypes/${id}`,
    method: 'delete'
  })
}

/**
 * @function 设施分页列表
 */
export interface GetFacility extends PageBase {
  enabled?: boolean
  ids?: string
  facilityTypeId?: number
}

export const getFacility = function (params: GetFacility): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/facilities`,
    method: 'get',
    params
  })
}

/**
 * @function 设施类型新增
 */

export interface PostFacilities {
  name: string
  remark: string
  id?: number
  capacity: number
  facilityTypeId: number
  preferred: number
}

export const postFacilities = function (data: PostFacilities) {
  return request({
    url: url + `/facilities`,
    method: 'post',
    data
  })
}

/**
 * @function  设施类型修改
 */
export const putFacilities = function (params: PostFacilityTypes) {
  const { id, ...data } = params
  return request({
    url: url + `/facilities/${id}`,
    method: 'put',
    data
  })
}

/**
 *@function 设施类型详情
 */
export const getFacilitiesDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/facilities/${id}`,
    method: 'get'
  })
}

/**
 *@function 设施类型删除
 */
export const deleteFacilities = function (id: number) {
  return request({
    url: url + `/facilities/${id}`,
    method: 'delete'
  })
}
