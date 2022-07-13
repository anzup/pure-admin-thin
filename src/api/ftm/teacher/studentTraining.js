/* 学员培训记录
   Student Training Record Controller
*/
import http from '@/utils/http'
const baseURL = process.env.VUE_APP_BASE_API_PUB

function _filter(param){
   return Object.assign({
      page: 1, // 当前页,默认为1
      size: 10, // 每页数量,默认为10
      sort: undefined, // 排序参数,默认为id
      order: 'asc', // 排序方向(asc/desc),默认为asc
      searchKey: undefined, // 模糊匹配:name,username,grouping.teachers.name
   }, param)
}

/**
 * 获取学员列表
 */
export function getStudents(param = {}){
   const Interface = _filter({
      customerId: undefined, // 航空公司id
      year: undefined, // 学年
      clazzId: undefined, // 班级id
      status: undefined, // 结业状态
      studentId: undefined, // 学员id
   })
   const data = Object.assign(Interface, param)
   return http('/studentTrainingRecords', data, 'get')
}

/**
 * 航空公司菜单
 */
export function airlinesMenu(){
   return http('/customers/all', false, 'get')
}

/**
 * 班级课号
 */
export function clazzsAll(){
   return http('/clazzs/all', false, 'get')
}
// 未完训班级
export function noFinishedClazzs(param={}){
   return http('/clazzs', { size: 1000, statusIN: 'NOT_STARTED,TRAINING', type: 'WET_LEASE', ...param }, 'get')
}

/**
 * 飞行小组
 */
export function groupAll(params){
   return http('/groupings/all', params,'get')
}

// 学员培训记录（学员详情）
export function getStudentDetails(param){
   return http('/studentTrainingRecords/{id}', param, 'get_p')
}

/**
 * 课件学习记录
 */
export function getStudentRecords(param){
   const Interface = _filter({
      coursewareType: undefined, // 课件类型
      status: undefined, // 状态
      type: undefined // 学习类型
   })
   let data = Object.assign(Interface, param)
   return http('/coursewareReadRecords', data, 'get')
}
/**
 * 课件学习导出
 */
export function exportStudentRecords(params){
   return http('/coursewareReadRecords/coursewareExport', params, 'get', 'json', 1)
}


/**
 * 考试
 */
export function getExam(param){
   const Interface = _filter({
      studentId : '', // 学员id #必填
      clazzId : '', // 班级id #必填
      type: undefined, // 考试类型
      status: undefined, // 考试状态
      result: undefined // 考试结果
   })
   let data = Object.assign(Interface, param)
   return http('/studentTrainingRecords/examRecords', data, 'get')
}

/**
 *  考试状态下拉列表
 */
export function getExamStatusFilter(){
   return http('/studentTrainingRecords/statusAll', false, 'get')
}

/**
 * 考试类型下拉列表
 */
export function getExamTypeFilter(){
   return http('/studentTrainingRecords/typeAll', false, 'get')
}
/**
 * 核心胜任力分数统计
 */
export function coreCapabilityScoreStats(param){
   return http('/studentTrainingRecords/coreCapabilityScoreStats', param, 'get')
}
/**
 * 核心胜任力平均分数统计
 */
export function coreCapabilityAverageScoreStats(param){
   return http('/studentTrainingRecords/coreCapabilityAverageScoreStats', param, 'get')
}
// 学员教学进度
export function studentTrainingSchedule(param){
   return http('/studentTrainingRecords/studentTrainingSchedule', param, 'get')
}

/**
 * 获取飞行考试详情
 */
export function getFilghtExamDetails(param){
   return http('/flightExamRecords/{id}', param , 'get_p')
}
// 飞行考试pdf
export const flightExamGetPdf = function (params) {
const url= '/flightExamRecords/genPdf';
   return http(url, params, "post", "json", params.download ? 1 : 'pdf' );
};
// 学员总评pdf
export const studentFinalGetPdf = function (params) {
const url= '/studentFinalEvaluationRecords/genPdf';
   return http(url, params, "post", "json", params.download ? 1 : 'pdf' );
};
// 飞行训练pdf
export const flightTrainingGetPdf = function (params) {
const url= '/flightTrainingEvaluationRecords/genPdf';
   return http(url, params, "post", "json", params.download ? 1 : 'pdf' );
};
// 通过班级id和学员id生成pdf
export const genPdfByClazzIdAndStudentId = function (params) {
const url= '/studentTrainingRecords/genPdfByClazzIdAndStudentId';
   return http(url, params, "post", "json", 'pdf' );
};
// 通过记录id生成pdf
export const genPdfByRecords = function (params) {
const url= '/studentTrainingRecords/genPdfByRecords';
   return http(url, params, "post", "json", 'pdf' );
};

/**
 * 预览文件（返回url）
 */
export function previewURL(uuid){
   return `${baseURL}/open/${uuid}/inline`
}

/**
 * 学员核心能力
 */
export function getEchartsData(param){
   return http('/studentFinalEvaluationRecords/coreCapabilities', param, 'get')
}

// 培训档案
export function getStudentTrainingFiles(params){
   return http('/studentTrainingFiles',params,'get')
}
export function postStudentTrainingFiles(params){
   return http('/studentTrainingFiles',params,'post')
}
export function getStudentTrainingFilesDetail(params){
   return http('/studentTrainingFiles/{id}',params,'get_p')
}
export function putStudentTrainingFiles(params){
   return http('/studentTrainingFiles/{id}',params,'put')
}
export function getStudentTrainingFilesDownload(params){
   return http('/studentTrainingFiles/download',params,'get')
}
export function getStudentTrainingFilesInline(id){
   return http(`/studentTrainingFiles/inline`, { studentTrainingRecordId: id }, 'get', 'json', 'arraybuffer')
}
export function getStudentTrainingFileDownload(params){
   return http('/studentTrainingFiles/{id}/download', params, 'get_p')
}
export function getStudentTrainingFileInline(params){
   return http('/studentTrainingFiles/{id}/inline', params, 'get_p')
}
export function getStudentTrainingRecord(params){
   return http('/studentTrainingFiles/{id}/records', params, 'get_p')
}

export function getStudentsSchedules(params) {
   return http('/students/schedules', params, 'get')
}