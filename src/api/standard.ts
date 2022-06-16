import { AxiosPromise } from "axios";
import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CSM;

/**
 * @function 岗位设置分页列表
 */

export interface GetPositions extends PageBase {
  enabled?: boolean
  ids?: string
}

export const getPositions = function (params: GetPositions): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/positions`,
    method: 'get',
    params
  })
}

/**
 * @function 岗位设置新增
 */

export interface PostPositions {
  name: string
  remark: string
  id?: number
  planeJobs?: object[]
}

export const postPositions = function (data: PostPositions) {
  return request({
    url: url + `/positions`,
    method: 'post',
    data
  })
}
/**
 * @function  岗位设置修改
 */

export const putPositions = function (params: PostPositions) {
  const { id, ...data } = params
  return request({
    url: url + `/positions/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 岗位设置详情
 */
export const getPositionsDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/positions/${id}`,
    method: 'get'
  })
}
/**
 *@function 岗位设置删除
 */
export const deletePositions = function (id: number) {
  return request({
    url: url + `/positions/${id}`,
    method: 'delete'
  })
}

/**
 * @function 培训类别分页列表
 */

export interface GetTrainingCategorys extends PageBase {
  enabled?: boolean
  ids?: string
}

export const getTrainingCategorys = function (
  params: GetTrainingCategorys
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/trainingCategorys`,
    method: 'get',
    params
  })
}

/**
 * @function 培训类别新增
 */

export interface PostTrainingCategorys {
  name: string
  remark: string
  id?: number
}

export const postTrainingCategorys = function (data: PostTrainingCategorys) {
  return request({
    url: url + `/trainingCategorys`,
    method: 'post',
    data
  })
}
/**
 * @function  培训类别修改
 */

export const putTrainingCategorys = function (params: PostTrainingCategorys) {
  const { id, ...data } = params
  return request({
    url: url + `/trainingCategorys/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 培训类别详情
 */
export const getTrainingCategorysDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/trainingCategorys/${id}`,
    method: 'get'
  })
}
/**
 *@function 培训类别删除
 */
export const deleteTrainingCategorys = function (id: number) {
  return request({
    url: url + `/trainingCategorys/${id}`,
    method: 'delete'
  })
}

/**
 * @function 培训项目分页列表
 */

export interface GetTrainingItems extends PageBase {
  enabled?: boolean
  ids?: string
  trainingCategoryId?: number
}

export const getTrainingItems = function (
  params: GetTrainingItems
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/trainingItems`,
    method: 'get',
    params
  })
}

/**
 * @function 培训项目新增
 */

export interface PostTrainingItems {
  name: string
  remark: string
  shortName: string
  trainingCategoryId: number
  trainingCode: string
  limited: boolean
  id?: number
  qualificationIds?: number[]
}

export const postTrainingItems = function (data: PostTrainingItems) {
  return request({
    url: url + `/trainingItems`,
    method: 'post',
    data
  })
}
/**
 * @function  培训项目修改
 */

export const putTrainingItems = function (params: PostTrainingItems) {
  const { id, ...data } = params
  return request({
    url: url + `/trainingItems/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 培训项目详情
 */
export const getTrainingItemsDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/trainingItems/${id}`,
    method: 'get'
  })
}
/**
 *@function 培训项目删除
 */
export const deleteTrainingItems = function (id: number) {
  return request({
    url: url + `/trainingItems/${id}`,
    method: 'delete'
  })
}

/**
 * @function 培训类型分类分页列表
 */

export interface GetTrainingTypes extends PageBase {
  enabled?: boolean
  ids?: string
}

export const getTrainingTypes = function (
  params: GetTrainingTypes
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/trainingTypes`,
    method: 'get',
    params
  })
}

/**
 * @function 培训类型分类新增
 */

export interface PostTrainingTypes {
  name: string
  remark: string
  id?: number
}

export const postTrainingTypes = function (data: PostTrainingTypes) {
  return request({
    url: url + `/trainingTypes`,
    method: 'post',
    data
  })
}
/**
 * @function  培训类型分类修改
 */

export const putTrainingTypes = function (params: PostTrainingTypes) {
  const { id, ...data } = params
  return request({
    url: url + `/trainingTypes/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 培训类型分类详情
 */
export const getTrainingTypesDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/trainingTypes/${id}`,
    method: 'get'
  })
}
/**
 *@function 培训类型分类删除
 */
export const deleteTrainingTypes = function (id: number) {
  return request({
    url: url + `/trainingTypes/${id}`,
    method: 'delete'
  })
}

/**
 * @function 培训类型配置分页列表
 */

export interface GetTrainingTypeConfig extends PageBase {
  enabled?: boolean
  ids?: string
  trainingTypeId?: number
}

export const getTrainingTypeConfig = function (
  params: GetTrainingTypeConfig
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/trainingTypeConfigs`,
    method: 'get',
    params
  })
}
/**
 * @function 培训类型配置批量获取
 */
export const getTrainingTypeConfigs = function (
  customerId: number
): AxiosPromise<{ positions: any[]; typeConfigs: any[] }> {
  return request({
    url: url + `/trainingTypeConfigs/batch`,
    method: 'get',
    params: { customerId }
  })
}

export interface PostTrainingTypeConfigs {
  customerId: number
  typeConfigs: {
    airplaneTypes: string[]
    customerId: number
    id: number
    limited: boolean
    name: string
    positionId: number
    remark?: string
    trainingTypeId: number
  }[]
}

export const postTrainingTypeConfigs = function (data: PostTrainingTypeConfigs) {
  return request({
    url: url + `/trainingTypeConfigs/batch`,
    method: 'post',
    data
  })
}

/**
 * @function 培训类型配置新增
 */
export interface PostTrainingTypeConfig {
  name: string
  remark: string
  id?: number
  trainingTypeId: number
}

export const postTrainingTypeConfig = function (data: PostTrainingTypeConfig) {
  return request({
    url: url + `/trainingTypeConfigs`,
    method: 'post',
    data
  })
}
/**
 * @function  培训类型配置修改
 */

export const putTrainingTypeConfig = function (params: PostTrainingTypeConfig) {
  const { id, ...data } = params
  return request({
    url: url + `/trainingTypeConfigs/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 培训类型配置详情
 */
export const getTrainingTypeConfigDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/trainingTypeConfigs/${id}`,
    method: 'get'
  })
}
/**
 *@function 培训类型配置删除
 */
export const deleteTrainingTypeConfig = function (id: number) {
  return request({
    url: url + `/trainingTypeConfigs/${id}`,
    method: 'delete'
  })
}

/**
 *@function 培训类型-按合同
 */
export const getTrainingTypeConfigValid = function (params): AxiosPromise {
  return request({
    url: url + `/trainingTypeConfigs/valid`,
    method: 'get',
    params
  })
}
  /**
 *@function 培训类型-航空公司岗位下所有培训机型
 */
export const getTrainingTypeConfigsAirplanetypes = function (params): AxiosPromise {
  return request({
    url: url + `/trainingTypeConfigs/airplanetypes`,
    method: 'get',
    params
  })
}

/**
 * @function 标准课程分页列表
 */

export interface GetStandardCourses extends PageBase {
  enabled?: boolean
  ids?: string
  practice?: number
  standardCourseTypeId?: number
  trainingItemId?: number
}

export const getStandardCourses = function (
  params: GetStandardCourses
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/standardCourses`,
    method: 'get',
    params
  })
}

/**
 * @function 标准课程新增
 */

export interface PostStandardCourses {
  name: string
  remark: string
  id?: number
  trainingCategoryId: number
  trainingItemIds: number[]
  courseTypeId: number
  standardCourseTypeId: Array<number>
  practice: any
  validDays: number
  warningDays: number
}

export const postStandardCourses = function (data: PostStandardCourses) {
  return request({
    url: url + `/standardCourses`,
    method: 'post',
    data
  })
}
/**
 * @function  标准课程修改
 */

export const putStandardCourses = function (params: PostStandardCourses) {
  const { id, ...data } = params
  return request({
    url: url + `/standardCourses/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 标准课程详情
 */
export const getStandardCoursDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/standardCourses/${id}`,
    method: 'get'
  })
}
/**
 *@function 标准课程删除
 */
export const deleteStandardCours = function (id: number) {
  return request({
    url: url + `/standardCourses/${id}`,
    method: 'delete'
  })
}
/**
 *
 * @param {
 * 标准课程分类 列表
 * }
 */

export const getStandardCourseTypesList = function (params) {
  return request({
    url: url + `/standardCourseTypes`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 标准课程分类 详情
 * }
 */

export const getStandardCourseTypes = function (params) {
  return request({
    url: url + `/standardCourseTypes/${params}`,
    method: 'get'
  })
}

/**
 * @param {
 * 标准课程分类 新增
 * }
 */

export const postStandardCourseTypes = function (data) {
  return request({
    url: url + `/standardCourseTypes`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 标准课程分类 修改
 * }
 */

export const putStandardCourseTypesId = function (data) {
  return request({
    url: url + `/standardCourseTypes/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 标准课程分类 删除
 * }
 */

export const deleteStandardCourseTypesId = function (data) {
  return request({
    url: url + `/standardCourseTypes/${data}`,
    method: 'delete'
  })
}
