import { AxiosPromise } from 'axios'
import request from '/@/utils/request/opm'
const url = import.meta.env.VITE_BASE_API_OPM

/**
 *
 * @param {
 * 班级排课状态
 * }
 */

export const getClazzSchedules = function (params?: { month: string }) {
  return request({
    url: url + `/clazzSchedules/all`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {
 * 生成课表时查询的班级
 * }
 */

export const getSchedulesClazz = function (params?: { month: string }) {
  return request({
    url: url + `/schedules/clazz`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {
 * 班级课程列表
 * }
 */

export const getSchedulesClass = function (classId: number, isTeacher: boolean) {
  return request({
    url: url + `/schedules/class/${classId}/${isTeacher}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 班级已完成课程
 * }
 */

export const getSchedulesFinished = function (classId: number) {
  return request({
    url: url + `/schedules/finished/${classId}`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 课程安排
 * }
 */
export interface GetScheduler {
  startDate?: string
  dateNum?: number
  facilityResourceId?: number
  teacherResourceId?: number
  clazzId?: number
  searchKey?: string
  teacherIds?: string
  facilityIds?: string
}
export const getSchedulesList = function (params: GetScheduler): AxiosPromise<{
  schedules: Scheduler.ISchedulerItem[]
  teacherColors: Scheduler.ColorConfig[]
  specialColors: Scheduler.ColorConfig[]
  facilityColors: Scheduler.ColorConfig[]
  classColors: Scheduler.ColorConfig[]
}> {
  return request({
    url: url + `/schedules`,
    method: 'get',
    params,
  })
}
export const getSchedulesConflicts = function () {
  return request({
    url: url + `/schedules/conflicts`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 课程在右侧修改保存
 * }
 */
export const putSchedules = function (data: Scheduler.ISchedulerItem) {
  return request({
    url: url + `/schedules/${data.id}`,
    method: 'put',
    data,
  })
}
/**
 *
 * @param {
 * 课程拖动和添加
 * }
 */
export interface SchedulerUpdate {
  startDate?: string
  endDate?: string
  facilityResourceId?: number
  facilityId?: number
  teacherResourceId?: number
  oldTeacherId?: number
  teacherId?: number
  id: number
}
export const putSchedulesUpdate = function (params: SchedulerUpdate) {
  const { id, ...data } = params
  return request({
    url: url + `/schedules/drag/${id}`,
    method: 'put',
    data,
  })
}
/**
 *
 * @param {
 * 课程清空
 * }
 */
export const putSchedulesClear = function (data: {
  ids: { id: number; resourceId: number }[]
  clearTeacher: boolean
}) {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `/schedules/batchClear​/${data.clearTeacher}`,
    method: 'put',
    data: data.ids,
  })
}
/**
 *
 * @param {
 * 课程删除
 * }
 */
export const deleteSchedules = function (id: number) {
  return request({
    url: url + `/schedules/${id}`,
    method: 'delete',
  })
}
/**
 *
 * @param {
 * 课程交换
 * }
 */
export const putSchedulesSwap = function (data: {
  resourceId1: number
  resourceId2: number
  resourceType: 'FACILITIES' | 'TEACHER'
  scheduleId1: number
  scheduleId2: number
}) {
  return request({
    url: url + `/schedules/swap`,
    method: 'put',
    data,
  })
}
/**
 *
 * @param {
 * 拆分时间
 * }
 */
export const putSchedulesTime = function (data: { scheduleIds: number[]; periods: number[] }) {
  return request({
    url: url + `/schedules/time`,
    method: 'put',
    data,
  })
}

/**
 *
 * @param {
 * scheduler 人员详情
 * }
 */

export const getScheduleDetail = function (scheduleId: number) {
  return request({
    url: url + `/schedules/${scheduleId}/detail`,
    method: 'get',
    // params
  })
}
/**
 *
 * @param {
 * 干租班级随训教员查询
 * }
 */

export const getScheduleSearchKey = function (params: {
  searchKey: string
  builtinRole?: string
  self?: boolean
}) {
  return request({
    url: url + `/schedules/searchKey`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {
 * 干租班级随训教员类型
 * }
 */

export const getScheduleDryTeacherRole = function () {
  return request({
    url: url + `/scheduleDryTeachers/teacherRole`,
    method: 'get',
    // params
  })
}
/**
 *
 * @param {
 * 修改干租班级随训教员
 * }
 */
interface IScheduleDryTeachers {
  scheduleId: number
  data: any[]
}
export const putScheduleDryTeachers = function (data: IScheduleDryTeachers) {
  return request({
    url: url + `/scheduleDryTeachers/${data.scheduleId}`,
    method: 'put',
    data: data.data,
  })
}
/**
 *
 * @param {
 * 生成课表
 * }
 */
interface IScheduleBuild {
  clazzIds: number[]
  month: string
  check: boolean
}
export const postScheduleBuild = function (data: IScheduleBuild) {
  return request({
    url: url + `/scheduleBuild`,
    method: 'post',
    data: data,
  })
}
/**
 *
 * @param {
 * 班级下添加自定义任务
 * }
 */
export type Addbo = Array<{
  facilityId?: number
  facilityResourceId?: number
  num?: number
  occupiedNumber?: string
  period?: number
  scheduleDates?: Array<{
    startDate: string
    endDate: string
  }>
  scheduleId?: number
  syllabusItemName?: string
}>
export interface IAddScheduler {
  scheduleType: string
  addBOS: Addbo
  classId?: number
}
export const postSchedules = function (data: IAddScheduler) {
  return request({
    url: url + `/schedules`,
    method: 'post',
    data: data,
  })
}

export const putScheduleConfigs = function (data: Scheduler.AsideListSet) {
  return request({
    url: url + `/scheduleConfigs`,
    method: 'put',
    data,
  })
}
// 时间限制
export const getTimeLimits = function () {
  return request({
    url: url + `/timeLimits`,
    method: 'get',
  })
}
export interface ITimeLimits {
  personTimeLimit: number
  personTimeLimitPeriod: number
  simulatorIntervalTimeLimits: Array<{
    limit: number
    limitPeriod: number
  }>
}
export const putTimeLimits = function (data: ITimeLimits) {
  return request({
    url: url + `/timeLimits`,
    method: 'put',
    data,
  })
}
export interface SpecialTimes {
  endDate: string
  name: string
  startDate: string
  id?: number
}
export const postSpecialTime = function (data: SpecialTimes) {
  return request({
    url: url + `/timeLimits`,
    method: 'post',
    data,
  })
}
export const putSpecialTime = function (params: SpecialTimes) {
  const { id, ...data } = params
  return request({
    url: url + `/timeLimits/${id}`,
    method: 'put',
    data,
  })
}
export const deleteSpecialTime = function (id: number) {
  return request({
    url: url + `/timeLimits/${id}`,
    method: 'delete',
  })
}
export const putTimeLimitsBaseTime = function (data: {
  saleBaseTime: number
  useBaseTime: number
}) {
  return request({
    url: url + `/timeLimits/${data.saleBaseTime}/${data.useBaseTime}`,
    method: 'put',
  })
}
export interface IStatistics {
  date: string
  deviceType?: string
  resourceId?: string
}
// 教员统计
export const getStatisticsTeacher = function (params: IStatistics) {
  return request({
    url: url + `/schedules/statistics/teacher`,
    method: 'get',
    params,
  })
}
// 模拟机统计
export const getStatisticsSimulator = function (params: IStatistics) {
  return request({
    url: url + `/schedules/statistics/simulator`,
    method: 'get',
    params,
  })
}
// 获取占位信息列表
export const getOccupied = function () {
  return request({
    url: url + `/schedules/occupied`,
    method: 'get',
  })
}
// 占位删除
export const deleteOccupied = function (occupiedNumber: string) {
  return request({
    url: url + `/schedules/occupied/${occupiedNumber}`,
    method: 'delete',
  })
}
// 占位修改
export const putOccupied = function (
  oldOccupiedNumber: string,
  num: number,
  newOccupiedNumber: string,
) {
  return request({
    url: url + `/schedules/occupied/${oldOccupiedNumber}/${num}/${newOccupiedNumber}`,
    method: 'put',
  })
}
// 占位导出
export const getOccupiedTemplate = function (params: {
  occupiedNumber: string
  dateRange: string
}) {
  return request({
    url: url + `/schedules/occupied/template`,
    method: 'get',
    params,
    responseType: 'blob',
  })
}
// 占位转班级
export const putConvertOccupied = function (
  data: Array<{
    clazzId: number
    occupiedNumber: any
  }>,
) {
  return request({
    url: url + `/schedules/convertOccupied`,
    method: 'put',
    data,
  })
}
// 占位创建班级
export const putOccupiedToClazz = function (data) {
  return request({
    url: url + `/schedules/occupiedToClazz`,
    method: 'put',
    data,
  })
}
// 冲突信息
export const getConflicts = function () {
  return request({
    url: url + `/schedules/conflicts`,
    method: 'get',
  })
}
// 所有资源分组
export const getResourcesGroup = function (useSetting = false) {
  return request({
    url: url + `/resources/group/${useSetting}`,
    method: 'get',
  })
}
// 根据账号来设置备注和是否显示
export type ResourceSettings = Array<{
  display: boolean
  id: number
  remark: string
  resourceId: number
  rid: number
}>
export const postResourceSettings = function (data: ResourceSettings) {
  return request({
    url: url + `/resourceSettings/batch`,
    method: 'post',
    data,
  })
}

// 查询可顺移的课程
export const getDelaySchedules = function (scheduleId) {
  return request({
    url: url + `/schedules/delay/${scheduleId}`,
    method: 'get',
  })
}
// 保存可顺移的课程
export const getDelaySchedulesStep = function (params: {
  startScheduleId: number
  endScheduleId: number
  step: number
}) {
  const { startScheduleId, endScheduleId, step } = params
  return request({
    url: url + `/schedules/delay/${startScheduleId}/${endScheduleId}/${step}`,
    method: 'get',
  })
}
// 拆分学员
export const putSchedulesSplitStudent = function (data: {
  facilityId: number
  scheduleIds: number[]
  studentIds: number[]
  teacherId: number
}) {
  return request({
    url: url + `/schedules/student`,
    method: 'put',
    data,
  })
}
// 课程复制
export const putSchedulesCopy = function (id: number) {
  return request({
    url: url + `/schedules/copy/${id}`,
    method: 'put',
  })
}
// 撤销拆分和复制
export const putSchedulesRecover = function (id: number) {
  return request({
    url: url + `/schedules/recover/${id}`,
    method: 'put',
  })
}
// 右键新增占位
export interface BaseRightEvent {
  endDate: string
  id: number

  resourceId: number
  startDate: string
}
export interface Occupied extends BaseRightEvent {
  occupiedNumber: string
}
export const postOccupied = function (data: Occupied) {
  return request({
    url: url + `/schedules/occupied`,
    method: 'post',
    data,
  })
}

/**
 *
 * @param data 新增教员外派
 * @returns void
 */
export const postDispatch = function (data: BaseRightEvent) {
  return request({
    url: url + `/schedules/dispatch`,
    method: 'post',
    data,
  })
}
/**
 *
 * @param data 新增场地验收
 * @returns void
 */
export const postCheck = function (data: BaseRightEvent) {
  return request({
    url: url + `/schedules/check`,
    method: 'post',
    data,
  })
}
/**
 *
 * @param data
 * @returns void
 */

export interface PutColorConfigs {
  builtinResource?: Scheduler.BuiltinResource
  color?: string
  colorType?: Scheduler.ColorType
  fontColor?: string
  groupId?: number
}
export const putColorConfigs = function (data: PutColorConfigs) {
  return request({
    url: url + `/colorConfigs`,
    method: 'put',
    data,
  })
}
// 取消标记
export const deleteColorConfigs = function (
  data: Required<Omit<PutColorConfigs, 'color' | 'fontColor'>>,
) {
  return request({
    url: url + `/colorConfigs`,
    method: 'delete',
    data,
  })
}
// 锁定占位
export const putLockOccupied = function (data: string[]) {
  return request({
    url: url + `/schedules/lockOccupied`,
    method: 'put',
    data,
  })
}
