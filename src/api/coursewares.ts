import { AxiosPromise } from 'axios'
import request from '/@/utils/request'

const url = import.meta.env.VITE_BASE_API_CPM

/**
 * @function 课件管理分页列表
 */

export type CoursewareType = 'PUBLIC' | 'THIRD_PARTY' | 'SELF'
export type CoursewareUsageType = 'TEACHER' | 'STUDENT'

export interface GetCoursewares extends PageBase {
  airplaneType?: string
  courseId?: number
  customerId?: number
  propertyId?: number
  showUsageInfo?: boolean
  systemType?: string
  trainingItemId?: number
  type?: CoursewareType
  usageType?: CoursewareUsageType
  assigneeId?: number
}

export const getCoursewares = function (params: GetCoursewares): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/coursewares`,
    method: 'get',
    params,
  })
}

/**
 * @function 课件管理新增
 */

export interface PostCoursewares {
  fileUuid: string
  name: string
  remark?: string
  airplaneTypes?: string
  courseIds?: number[]
  customerIds?: number[]
  downloadable?: boolean
  propertyIds?: number[]
  trainingItemIds?: number[]
  systemTypes?: string
  type?: CoursewareType
  usageType?: CoursewareUsageType
  version?: string
  id?: number
}

export const postCoursewares = function (data: PostCoursewares) {
  return request({
    url: url + `/coursewares`,
    method: 'post',
    data,
  })
}

/** @function 批量新增 */
export const postCoursewaresBatch = function (data: PostCoursewares[]) {
  return request({
    url: url + `/coursewares/batchAdd`,
    method: 'post',
    data,
  })
}
/**
 * @function  课件管理修改
 */

export const putCoursewares = function (params: Partial<PostCoursewares>) {
  const { id, ...data } = params
  return request({
    url: url + `/coursewares/${id}`,
    method: 'put',
    data,
  })
}
/**
 *@function 课件管理详情
 */

export interface CourseWare {
  adminSeqNo: number
  airplaneTypes: string
  courseIds: number[]
  courses: DefaultAllListItem[]
  creator: DefaultAllListItem
  currentVersion: DefaultAllListItem
  customerIds: number[]
  customers: DefaultAllListItem[]
  downloadable: boolean
  downloadedCount: number
  fileType: FileType
  fileUuid: string
  id: number
  name: string
  playFilePath: string
  trainingItemIds: number
  trainingItems: DefaultAllListItem[]
  type: CoursewareType
  usageInfo: {
    downloaded: boolean
    readDuration: boolean
  }
  usageType: CoursewareUsageType
  versionCount: number
  lastModifiedDate: string
}

export const getCoursewareDetail = function (id: number): AxiosPromise {
  return request({
    url: url + `/coursewares/${id}`,
    method: 'get',
  })
}
/**
 *@function 课件管理删除
 */
export const deleteCourseware = function (id: number) {
  return request({
    url: url + `/coursewares/${id}`,
    method: 'delete',
  })
}

export const postCoursewaresIdPlayProgress = function (data) {
  return request({
    url: url + `/coursewares/${data.id}/playProgress`,
    method: 'post',
    data,
  })
}
export const postCoursewaresIdPlayStart = function (data) {
  return request({
    url: url + `/coursewares/${data.id}/playStart`,
    method: 'post',
    data,
  })
}
export const getCoursewaresTeachers = function (id: number): AxiosPromise<DefaultAllListItem[]> {
  return request({
    url: url + `/coursewares/${id}/teachers`,
    method: 'get',
  })
}
export const getCoursewaresHistoryVersions = function (
  id: number,
): AxiosPromise<DefaultAllListItem[]> {
  return request({
    url: url + `/coursewares/${id}/historyVersions`,
    method: 'get',
  })
}
export interface GetCoursewareReadRecords
  extends PageBase,
    Partial<
      Record<'courseNumber' | 'coursewareId' | 'createdBy' | 'userId' | 'versionId', number>
    > {
  coursewareType?: CoursewareType
  userIds?: number[]
}
export interface ResCoursewareReadRecords {
  assigner: DefaultAllListItem
  courseNumber: string
  courseware: CourseWare
  id: number
  lastReadTime: string
  progress: number
  readDuration: number
  startDate: string
  status: 'READING' | 'FINISHED'
  totalReadDuration: number
  type: 'SELF' | 'ASSIGN'
  user: DefaultAllListItem
  version: DefaultAllListItem
}
/**
 * @description: 课件阅读记录
 * @param {GetCoursewareReadRecords} params
 */
export const getCoursewareReadRecords = function (
  params: GetCoursewareReadRecords,
): AxiosPromise<DefaultPagingData<ResCoursewareReadRecords[]>> {
  return request({
    url: url + `/coursewareReadRecords`,
    method: 'get',
    params,
  })
}
/**
 * @description: 课件指派阅读记录
 * @param {GetCoursewareReadRecords} params
 */
export const getCoursewareAssignmentReadRecords = function (
  params: GetCoursewareReadRecords,
): AxiosPromise<DefaultPagingData<ResCoursewareReadRecords[]>> {
  return request({
    url: url + `/coursewareAssignmentReadRecords`,
    method: 'get',
    params,
  })
}
