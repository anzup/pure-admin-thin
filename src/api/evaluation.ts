import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CSM;

/**
 *
 * @param {
 * 评估类型列表
 * }
 */

export const getEvaluationTypesList = function (params) {
  return request({
    url: url + `/evaluationTypes`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 评估类型详情
 * }
 */
export const getEvaluationTypesDetail = function (params) {
  return request({
    url: url + `/evaluationTypes/${params}`,
    method: 'get'
  })
}
/**
 * @param {
 * 评估类型新增
 * }
 */
export const postEvaluationTypes = function (data) {
  return request({
    url: url + `/evaluationTypes`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 评估类型修改
 * }
 */
export const putEvaluationTypesId = function (data) {
  return request({
    url: url + `/evaluationTypes/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * @param {
 * 评估类型删除
 * }
 */

export const deleteEvaluationTypesId = function (data) {
  return request({
    url: url + `/evaluationTypes/${data}`,
    method: 'delete'
  })
}
/**
 *
 * @param {
 * 评估项目列表
 * }
 */
export const getEvaluationItemsList = function (params) {
  return request({
    url: url + `/evaluationItems`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 评估项目详情
 * }
 */
export const getEvaluationItemsDetail = function (params) {
  return request({
    url: url + `/evaluationItems/${params}`,
    method: 'get'
  })
}
/**
 * @param {
 * 评估项目新增
 * }
 */
export const postEvaluationItems = function (data) {
  return request({
    url: url + `/evaluationItems`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 评估项目修改
 * }
 */
export const putEvaluationItemsId = function (data) {
  return request({
    url: url + `/evaluationItems/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * @param {
 * 评估项目删除
 * }
 */
export const deleteEvaluationItemsId = function (data) {
  return request({
    url: url + `/evaluationItems/${data}`,
    method: 'delete'
  })
}
// 评估条目
export interface EvaluationSubItems {
  type: any
  content: any
  score: any
  itemId: any
  teacherId: any
  id?: number
}
/**
 *
 * @param {
 * 评估条目列表
 * }
 */
export const getEvaluationSubItemsList = function (params) {
  return request({
    url: url + `/evaluationSubItems`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 评估条目详情
 * }
 */
export const getEvaluationSubItemsDetail = function (params) {
  return request({
    url: url + `/evaluationSubItems/${params}`,
    method: 'get'
  })
}
/**
 * @param {
 * 评估条目新增
 * }
 */
export const postEvaluationSubItems = function (data) {
  return request({
    url: url + `/evaluationSubItems`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 评估条目修改
 * }
 */
export const putEvaluationSubItemsId = function (data) {
  return request({
    url: url + `/evaluationSubItems/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * @param {
 * 评估条目删除
 * }
 */
export const deleteEvaluationSubItemsId = function (data) {
  return request({
    url: url + `/evaluationSubItems/${data}`,
    method: 'delete'
  })
}

/**
 * @param {
 * 评估条目 批量删除
 * }
 */
export const batchDeleteEvaluationSubItems = function (data) {
  return request({
    url: url + `/evaluationSubItems/batchDelete`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 评估条目 批量导入
 * }
 */
export const importEvaluationSubItems = function (data) {
  return request({
    url: url + `/evaluationSubItems/import/${data.itemId}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: data.formData
  })
}
/**
 * @param {
 * 评估条目 获取导入模板
 * }
 */
export const getTemplateEvaluationSubItems = function () {
  return request({
    url: url + `/evaluationSubItems/import`,
    method: 'get',
    responseType: 'blob'
    // data,
  })
}

//评估申请
export interface EvaluationApply {
  id?: number
  courseId: any
  itemId: any
  teacherId: any
  teachingType: any
  trainingItemIds?: Array<number>
  remark?: string
  requestRemark?: string
}
//评估
export interface Evaluation {
  id?: number
  courseId: any
  itemId: any
  teacherId: any
  averageScore: number
  clazz: any
  course: any
  createdDate: any
  creator: any
  endTime: any
  facility: any
  item: any
  method: any
  operationTypes: any
  remark: any
  result: any
  reviewers: any
  startTime: any
  status: any
  syllabusItem: any
  syllabusItemId: any
  teacher: any
  teachingType: any
  facilityId: any
  reviewerIds: any
  rangeDate: Array<string>
  typeIds?: Array<number>
}
// 安排评估
export interface ArrangeEvaluation {
  clazzId: any
  courseId: any
  endTime: ''
  facilityId: any
  id: any
  method: any
  reviewerIds: any
  startTime: any
  syllabusItemId: any
  teachingType: any
}
/**
 *
 * @param {
 * 评估条目列表
 * }
 */
export const getEvaluationList = function (params) {
  return request({
    url: url + `/evaluations`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 评估条目详情
 * }
 */
export const getEvaluationDetail = function (params) {
  return request({
    url: url + `/evaluations/${params}`,
    method: 'get'
  })
}
/**
 * @param {
 * 评估条目新增
 * }
 */
export const postEvaluation = function (data: Evaluation) {
  return request({
    url: url + `/evaluations`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 评估-安排评估
 * }
 */
export const postArrangeEvaluation = function (data) {
  return request({
    url: url + `/evaluations/arrange`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 评估-排课信息列表
 * }
 */
export const postEvaluationSchedules = function (data) {
  return request({
    url: url + `/evaluations/schedules`,
    method: 'post',
    data
  })
}
// 安排评估
export interface ResultEvaluation {
  id: number
  remark: any
  result: boolean
  averageScore?: number
}
/**
 *
 * @param data 评估-设置结果
 * @returns
 */
export const postResultEvaluation = function (data: ResultEvaluation) {
  return request({
    url: url + `/evaluations/${data.id}/result`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 评估条目修改
 * }
 */
export const putEvaluationId = function (data) {
  return request({
    url: url + `/evaluations/${data.id}`,
    method: 'put',
    data
  })
}
/**
 *
 * @param data 评估-取消
 * @returns
 */
export const postCancelEvaluation = function (data) {
  return request({
    url: url + `/evaluations/${data.id}/cancel`,
    method: 'post',
    data
  })
}
/**
 *
 * @function 评估-确认
 * @returns
 */
export const postConfirmEvaluation = function (data) {
  return request({
    url: url + `/evaluations/${data.id}/confirm`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 评估条目删除
 * }
 */
export const deleteEvaluationId = function (data) {
  return request({
    url: url + `/evaluations/${data}`,
    method: 'delete'
  })
}

/**
 * @param {
 * 评估条目 批量删除
 * }
 */
export const batchDeleteEvaluation = function (data) {
  return request({
    url: url + `/evaluations/batchDelete`,
    method: 'post',
    data
  })
}
/**
 * 评估记录 教员评估
 */
/**
 * @param {
 * 评估记录 列表
 * }
 */
export const getEvaluationRecordsList = function (params) {
  return request({
    url: url + `/evaluationRecords`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 评估记录 详情
 * }
 */
export const getEvaluationRecordsDetail = function (params) {
  return request({
    url: url + `/evaluationRecords/${params.id}`,
    method: 'get'
  })
}
/**
 * @param {
 * 评估记录 获取批量评审信息
 * }
 */
export const getBatchEvaluationRecordsDetail = function (params) {
  return request({
    url: url + `/evaluationRecords/batch`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 评估记录 签名
 * }
 */
export const signEvaluationRecords = function (data) {
  return request({
    url: url + `/evaluationRecords/sign`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 评估记录 修改
 */
export const putEvaluationRecord = function (data) {
  return request({
    url: url + `/evaluationRecords/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * @param {
 * 评估记录 批量修改
 */
export const putEvaluationRecordByIds = function (data) {
  return request({
    url: url + `/evaluationRecords/`,
    method: 'put',
    data
  })
}
/**
 * @param {
 * 评估子项目 打分
 */
export const scoreEvaluationRecord = function (data) {
  return request({
    url: url + `/evaluationRecords/${data.id}/score/${data.subItemId}`,
    method: 'post',
    data
  })
}
