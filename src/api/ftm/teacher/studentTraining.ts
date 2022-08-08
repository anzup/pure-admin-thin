import request from '/@/utils/request/index'
import { toPdf } from '/@/utils/print'
import { toExport } from '/@/utils'
const url = import.meta.env.VITE_BASE_API_FTM
const pubUrl = import.meta.env.VITE_BASE_API_PUB

function _filter(param) {
  return Object.assign(
    {
      page: 1, // 当前页,默认为1
      size: 10, // 每页数量,默认为10
      sort: undefined, // 排序参数,默认为id
      order: 'asc', // 排序方向(asc/desc),默认为asc
      searchKey: undefined, // 模糊匹配:name,username,grouping.teachers.name
    },
    param,
  )
}

/**
 * 获取学员列表
 */
export function getStudents(param = {}) {
  const Interface = _filter({
    customerId: undefined, // 航空公司id
    year: undefined, // 学年
    clazzId: undefined, // 班级id
    status: undefined, // 结业状态
    studentId: undefined, // 学员id
  })
  const params = Object.assign(Interface, param)
  return request({
    url: url + '/studentTrainingRecords',
    method: 'get',
    params,
  })
}

/**
 * 航空公司菜单
 */
export const airlinesMenu = (params) =>
  request({
    url: url + '/customers/all',
    method: 'get',
    params,
  })

/**
 * 班级课号
 */
export const clazzsAll = (params) =>
  request({
    url: url + '/clazzs/all',
    method: 'get',
    params,
  })
// 未完训班级
export const noFinishedClazzs = (params) =>
  request({
    url: url + '/clazzs',
    method: 'get',
    params: { size: 1000, statusIN: 'NOT_STARTED,TRAINING', type: 'WET_LEASE', ...params },
  })

/**
 * 飞行小组
 */
export const groupAll = (params) =>
  request({
    url: url + '/groupings/all',
    method: 'get',
    params,
  })

// 学员培训记录（学员详情）
export const getStudentDetails = (params) =>
  request({
    url: url + '/studentTrainingRecords/' + params.id,
    method: 'get',
    params,
  })

/**
 * 课件学习记录
 */
export function getStudentRecords(param) {
  const Interface = _filter({
    coursewareType: undefined, // 课件类型
    status: undefined, // 状态
    type: undefined, // 学习类型
  })
  const params = Object.assign(Interface, param)
  return request({
    url: url + '/coursewareReadRecords',
    method: 'get',
    params,
  })
}
/**
 * 课件学习导出
 */
export const exportStudentRecords = (params) =>
  request({
    url: url + '/coursewareReadRecords/coursewareExport',
    method: 'get',
    params,
  })

/**
 * 考试
 */
export function getExam(param) {
  const Interface = _filter({
    studentId: '', // 学员id #必填
    clazzId: '', // 班级id #必填
    type: undefined, // 考试类型
    status: undefined, // 考试状态
    result: undefined, // 考试结果
  })
  const params = Object.assign(Interface, param)
  return request({
    url: url + '/studentTrainingRecords/examRecords',
    method: 'get',
    params,
  })
}

/**
 *  考试状态下拉列表
 */
export const getExamStatusFilter = (params) =>
  request({
    url: url + '/studentTrainingRecords/statusAll',
    method: 'get',
    params,
  })

/**
 * 考试类型下拉列表
 */
export const getExamTypeFilter = (params) =>
  request({
    url: url + '/studentTrainingRecords/typeAll',
    method: 'get',
    params,
  })
/**
 * 核心胜任力分数统计
 */
export const coreCapabilityScoreStats = (params) =>
  request({
    url: url + '/studentTrainingRecords/coreCapabilityScoreStats',
    method: 'get',
    params,
  })
/**
 * 核心胜任力平均分数统计
 */
export const coreCapabilityAverageScoreStats = (params) =>
  request({
    url: url + '/studentTrainingRecords/coreCapabilityAverageScoreStats',
    method: 'get',
    params,
  })
// 学员教学进度
export const studentTrainingSchedule = (params) =>
  request({
    url: url + '/studentTrainingRecords/studentTrainingSchedule',
    method: 'get',
    params,
  })

/**
 * 获取飞行考试详情
 */
export const getFilghtExamDetails = (params) =>
  request({
    url: url + '/flightExamRecords/' + params.id,
    method: 'get',
    params,
  })
// 飞行考试pdf
export const flightExamGetPdf = (data) =>
  request({
    url: url + '/flightExamRecords/genPdf',
    method: 'post',
    responseType: 'blob',
    data,
  })
    .then((res) => {
      if (data.download) {
        toExport(res)
      } else {
        toPdf(res)
      }
      Promise.resolve(res)
    })
    .catch((e) => {
      Promise.reject(e)
    })
// 学员总评pdf
export const studentFinalGetPdf = (data) =>
  request({
    url: url + '/studentFinalEvaluationRecords/genPdf',
    method: 'post',
    responseType: 'blob',
    data,
  })
    .then((res) => {
      if (data.download) {
        toExport(res)
      } else {
        toPdf(res)
      }
      Promise.resolve(res)
    })
    .catch((e) => {
      Promise.reject(e)
    })
// 飞行训练pdf
export const flightTrainingGetPdf = (data) =>
  request({
    url: url + '/flightTrainingEvaluationRecords/genPdf',
    method: 'post',
    responseType: 'blob',
    data,
  })
    .then((res) => {
      if (data.download) {
        toExport(res)
      } else {
        toPdf(res)
      }
      Promise.resolve(res)
    })
    .catch((e) => {
      Promise.reject(e)
    })
// 通过班级id和学员id生成pdf
export const genPdfByClazzIdAndStudentId = (data) =>
  request({
    url: url + '/studentTrainingRecords/genPdfByClazzIdAndStudentId',
    method: 'post',
    responseType: 'blob',
    data,
  })
    .then((res) => {
      if (data.download) {
        toExport(res)
      } else {
        toPdf(res)
      }
      Promise.resolve(res)
    })
    .catch((e) => {
      Promise.reject(e)
    })
// 通过记录id生成pdf
export const genPdfByRecords = (data) =>
  request({
    url: url + '/studentTrainingRecords/genPdfByRecords',
    method: 'post',
    responseType: 'blob',
    data,
  })
    .then((res) => {
      if (data.download) {
        toExport(res)
      } else {
        toPdf(res)
      }
      Promise.resolve(res)
    })
    .catch((e) => {
      Promise.reject(e)
    })

/**
 * 预览文件（返回url）
 */
export const previewURL = (uuid) => {
  return `${pubUrl}/open/${uuid}/inline`
}

/**
 * 学员核心能力
 */
export const getEchartsData = (params) =>
  request({
    url: url + '/studentFinalEvaluationRecords/coreCapabilities',
    method: 'get',
    params,
  })

// 培训档案
export const getStudentTrainingFiles = (params) =>
  request({
    url: url + '/studentTrainingFiles',
    method: 'get',
    params,
  })
export const postStudentTrainingFiles = (data) =>
  request({
    url: url + '/studentTrainingFiles',
    method: 'post',
    data,
  })
export const getStudentTrainingFilesDetail = (params) =>
  request({
    url: url + '/studentTrainingFiles/' + params.id,
    method: 'get',
    params,
  })
export const putStudentTrainingFiles = (data) =>
  request({
    url: url + '/studentTrainingFiles/' + data.id,
    method: 'put',
    data,
  })
export const getStudentTrainingFilesDownload = (params) =>
  request({
    url: url + '/studentTrainingFiles/download',
    method: 'get',
    params,
  })
export const getStudentTrainingFilesInline = (id) =>
  request({
    url: url + `/studentTrainingFiles/inline`,
    method: 'get',
    responseType: 'arraybuffer',
    params: { studentTrainingRecordId: id },
  })
export const getStudentTrainingFileDownload = (params) =>
  request({
    url: url + `/studentTrainingFiles/${params.id}/download`,
    method: 'get',
    params,
  })
export const getStudentTrainingFileInline = (params) =>
  request({
    url: url + `/studentTrainingFiles/${params.id}/inline`,
    method: 'get',
    params,
  })
export const getStudentTrainingRecord = (params) =>
  request({
    url: url + `/studentTrainingFiles/${params.id}/records`,
    method: 'get',
    params,
  })

export const getStudentsSchedules = (params) =>
  request({
    url: url + '/students/schedules',
    method: 'get',
    params,
  })

export const getClazzStudentScheduleProgress = (params) =>
  request({
    url: url + `/clazzs/student/${params.studentId}/${params.clazzId}/schedule/progress`,
    method: 'get',
    params,
  })
