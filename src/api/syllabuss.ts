import { AxiosPromise } from 'axios'
import request from '/@/utils/request'
import { SyllabusApiData } from './customerSyllabuses'
import { CourseWare } from './coursewares'
const url = import.meta.env.VITE_BASE_API_CSM

/**
 * @function 当前及未来大纲列表
 */

export interface SyllabussItem {
  endDate?: string
  id?: number
  lastModifiedDate?: string
  name: string
  startDate?: string
  version: string
  duration?: number
  syllabusItems: SyllabusItems[]
  syllabusSelfstudies: SyllabusSelfstudies[]
}

export type SyllabusSelfstudyPeriod =
  | 'BEFORE_CLAZZ_START'
  | 'BEFORE_LAST_THEORY_EXAM'
  | 'BEFORE_CLAZZ_END'
  | 'BEFORE_CERTAIN_COURSE'
export interface SyllabusSelfstudies {
  /**
   * @description: 是否影响成绩
   */
  affectGrade?: boolean
  /**
   * @description: 是否可下载
   */
  canDownload?: boolean
  courseware?: CourseWare
  lastModifiedDate?: string
  readDuration?: number
  syllabusItemId?: number
  syllabusSelfstudyPeriod?: SyllabusSelfstudyPeriod
  id?: number
  coursewareName?: string
  coursewareVersion?: string
  coursewareId?: number
  uuid: string
}
export interface PostSyllabusSelfstudies
  extends Exclude<SyllabusSelfstudies, 'courseware'> {}

export interface SyllabusItemFacilities {
  /**@param endDuration 结束课时 */
  endDuration: number
  /**@param startDuration 开始课时 */
  startDuration: number
  /**@param syllabusItemFacilities 设施类型 */
  syllabusItemFacilities: {
    /**@param facilityCount 设施数量 */
    facilityCount: number
    /**@param facilityTypeIds 设施类型 */
    facilityTypeIds: number[]
  }[]
  uuid?: string
}

export interface SyllabusItems {
  /**@param aliasName 别名*/
  aliasName: string
  /**@params assistantCount 辅讲人数*/
  assistantCount: number
  /**@param duration 课时 */
  duration: number
  /**@param keynoteCount 主讲人数 */
  keynoteCount: number
  /**@param name 名称 */
  name: string
  /**@param preItemIds 前置项目 */
  preItemIds: number[]
  /**@param standardCourseIds  标准课程 */
  standardCourseIds: number[]
  /**@param standardCourseNames 标准课程名称 */
  standardCourseNames?: string[]
  /**@param syllabusId 大纲 */
  syllabusId: number
  /**@param exam 是否包含考试 */
  exam: boolean
  /**@param syllabusItemPeriods 大纲项目设施 */
  syllabusItemPeriods: SyllabusItemFacilities[]
  /**@param remark 备注 */
  remark: string
  id?: number
  seq?: number
  examStartDuration: number
  examEndDuration: number
  uuid: string
  courseSegment: string
  // courseTypeName?: string
  practice?: boolean
  coursewares: CourseWare[]
  standardCourses?: DefaultAllListItem[]
}

export const getSyllabuss = function (
  params: SyllabusApiData,
): AxiosPromise<SyllabussItem[]> {
  const { customerId, positionId, trainingItemId, trainingTypeConfigId } =
    params
  return request({
    url:
      url +
      `/syllabuss/${customerId}/${positionId}/${trainingItemId}/${trainingTypeConfigId}`,
    method: 'get',
  })
}
export const getSyllabussStandardCourses = function (
  params: SyllabusApiData,
): AxiosPromise<SyllabussItem[]> {
  const { customerId, positionId, trainingItemId, trainingTypeConfigId } =
    params
  return request({
    url:
      url +
      `/syllabuss/${customerId}/${positionId}/${trainingItemId}/${trainingTypeConfigId}/standardCourses`,
    method: 'get',
  })
}
export interface PostSyllabuss extends Partial<SyllabusApiData> {
  // name: string
  version: string
  startDate: string
  id?: number
}
export const postSyllabuss = function (data) {
  return request({
    url: url + `/syllabuss`,
    method: 'post',
    data,
  })
}

/**
 *@function 详情
 */
export const getSyllabussDetail = function (id) {
  return request({
    url: url + `/syllabuss/${id}`,
    method: 'get',
  })
}
/**
 *@function 下载
 */
export const getSyllabussExport = function (id: number) {
  return request({
    url: url + `/syllabuss/export/${id}`,
    method: 'get',
    responseType: 'arraybuffer',
  })
}
/**
 *@function 修改
 */
export interface PutSyllabuss
  extends Exclude<PostSyllabuss, keyof SyllabusApiData> {
  id: number
}
export const putSyllabuss = function (params: PutSyllabuss) {
  const { id, ...data } = params
  return request({
    url: url + `/syllabuss/${id}`,
    method: 'put',
    data,
  })
}

/**
 * @description: 课件启用禁用
 * @param {number} id
 * @param {number} coursewareId
 * @param {boolean} enabled
 */
export const putSyllabussCourseware = function (
  id: number,
  coursewareId: number,
  enabled: boolean,
) {
  return request({
    url: url + `/syllabuss/${id}/${coursewareId}/${enabled}`,
    method: 'put',
  })
}

/**
 *@function 历史大纲
 */
export const getHistorySyllabuss = function (params) {
  return request({
    url: url + `/syllabuss/history`,
    method: 'get',
    params,
  })
}

/**
 *@function 历史大纲版本
 */
export const getSyllabussVersionList = function (data) {
  return request({
    url:
      url +
      `/syllabuss/history/${data.customerId}/${data.positionId}/${data.trainingItemId}/${data.trainingTypeConfigId}`,
    method: 'get',
  })
}
