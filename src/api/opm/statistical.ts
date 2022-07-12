import request from '/@/utils/request/opm'
const url = import.meta.env.VITE_BASE_API_OPM
export interface StatiStics {
  year: string | number
  resourceId?: number
  builtinRole?: string
  month?: number | string
}
/**
 *
 * @param {
 * 销售数据统计
 * }
 */

export const getStatisticsIncome = function (year: string) {
  return request({
    url: url + `/statistics/income/${year}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 教员统计
 * }
 */

export const getStatisticsTeacherHours = function (params: StatiStics) {
  const { year, builtinRole } = params
  return request({
    url: url + `/statistics/statTeacherHours/${year}/${builtinRole}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 课时分段统计
 * }
 */

export const getStatisticsTeacherSections = function (params: StatiStics) {
  const { year, builtinRole } = params
  return request({
    url: url + `/statistics/statTeacherSections/${year}/${builtinRole}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 课时详情
 * }
 */

export const getTeacherPeriodDetailList = function (params: StatiStics) {
  const { year, builtinRole, month } = params
  return request({
    url: url + `/statistics/teacherPeriodDetailList/${year}/${month}/${builtinRole}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 教员夜场
 * }
 */

export const getTeacherNightSessionList = function (params: StatiStics) {
  const { year, builtinRole, month } = params
  return request({
    url: url + `/statistics/teacherNightSessionList/${year}/${month}/${builtinRole}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 设施故障统计
 * }
 */

export const getStatisticsMalfunction = function (params: StatiStics) {
  const { year, resourceId } = params
  return request({
    url: url + `/statistics/malfunction/${year}/${!resourceId ? 0 : resourceId}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 设施利用率
 * }
 */

export const getStatisticsUseRatio = function (params: StatiStics) {
  const { year, resourceId } = params
  return request({
    url: url + `/statistics/useRatio/${year}/${!resourceId ? 0 : resourceId}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 设施销售利用率
 * }
 */

export const getStatFacilitySalePercent = function (params: StatiStics) {
  const { year, resourceId } = params
  return request({
    url: url + `/statistics/statFacilitySalePercent/${year}/${resourceId || 0}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 设施运行概览
 * }
 */

export const getStatisticsFacilityHours = function (params: StatiStics) {
  const { year, resourceId } = params
  return request({
    url: url + `/statistics/statFacilityHours/${year}/${!resourceId ? 0 : resourceId}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 设施分段
 * }
 */

export const getStatisticsFacilitySections = function (params: StatiStics) {
  const { year, resourceId } = params
  return request({
    url: url + `/statistics/statFacilitySections/${year}/${!resourceId ? 0 : resourceId}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 补考
 * }
 */

export interface TextraTraining {
  clazzId: number
  customerId: number
  end: string
  start: string
}

export const getEextraTraining = function (params: TextraTraining) {
  return request({
    url: url + `/statistics/extraTraining`,
    method: 'get',
    params,
  })
}
// 补训
export const getExtraExam = function (params: TextraTraining) {
  return request({
    url: url + `/statistics/extraExam`,
    method: 'get',
    params,
  })
}
// 补训补考
export const getExtraBills = function (year: number) {
  return request({
    url: url + `/statistics/extraBills/${year}`,
    method: 'get',
  })
}
