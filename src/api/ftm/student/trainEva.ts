import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM
const pubUrl = import.meta.env.VITE_BASE_API_PUB

function _params(sw = {}) {
  const searchWhere = {
    size: 10,
    page: 1,
    sort: 'id',
    order: 'asc',
    keyWord: undefined,
  }
  const Interface = {
    page: searchWhere.page,
    size: searchWhere.size,
    sort: searchWhere.sort,
    order: searchWhere.order,
    searchKey: searchWhere.keyWord,
  }
  return Object.assign(Interface, sw)
}

function _export(d = {}) {
  const Interface = {
    studentId: '',
    clazzId: '',
  }
  return Object.assign(Interface, d)
}

const Api = {
  /**
   * 获取培训记录
   * 用于渲染飞行训练评价中的列表
   */
  getTrainHistory: (params) =>
    request({
      url: url + '/studentTrainingRecords',
      method: 'get',
      params: _params(params),
    }),
  /**
   * 飞行训练评价
   */
  flyTrainEva: async (params) =>
    request({
      url: url + '/flightTrainingEvaluationRecords',
      method: 'get',
      params: _params(params),
    }),
  flyExam: (params) =>
    request({
      url: url + '/flightExamRecords',
      method: 'get',
      params: _params(params),
    }),
  getFlyExamDetails: (params) =>
    request({
      url: url + '/flightExamRecords/' + params.id,
      method: 'get',
      params,
    }),
  setFlyExamDetails: (data) =>
    request({
      url: url + '/flightExamRecords/' + data.id,
      method: 'put',
      data,
    }),
  setFlyExamSign: (data) =>
    request({
      url: url + `/flightExamRecords/${data.id}/sign`,
      method: 'post',
      data,
    }),
  studentAll: (params) =>
    request({
      url: url + '/studentFinalEvaluationRecords',
      method: 'get',
      params,
    }),
  studentDetails: (params) =>
    request({
      url: url + `/studentFinalEvaluationRecords/` + params.id,
      method: 'get',
      params,
    }),
  setStudentDetails: (data) =>
    request({
      url: url + `/studentFinalEvaluationRecords/${data.id}`,
      method: 'put',
      data,
    }),
  studentRecordsSign: (data) =>
    request({
      url: url + `/studentFinalEvaluationRecords/${data.id}/sign`,
      method: 'post',
      data,
    }),
  getFlyTrainDetails: (params) =>
    request({
      url: url + `/flightTrainingEvaluationRecords/${params.id}`,
      method: 'get',
      params,
    }),
  setFlyTrainSign: (data) =>
    request({
      url: url + `/flightTrainingEvaluationRecords/${data.id}/sign`,
      method: 'post',
      data,
    }),
  setFlyTrainDetails: (data) =>
    request({
      url: url + `/flightTrainingEvaluationRecords/${data.id}`,
      method: 'put',
      data,
    }),
  /**
   * 获取签名图片地址（返回url）
   */
  getSignURL: (uuid) => `${pubUrl}/open/${uuid}/inline`,
  cbtaExport: (params) =>
    request({
      url: url + '/studentTrainingRecords/cbtaExport',
      method: 'get',
      params: _export(params),
    }),
  failExamExport: (params) =>
    request({
      url: url + '/studentTrainingRecords/failExamExport',
      method: 'get',
      params: _export(params),
    }),
  examExport: (params) =>
    request({
      url: url + '/studentTrainingRecords/examExport',
      method: 'get',
      params: _export(params),
    }),
  // 训练评价，实践考试记录
  evaluationRecords: (params) =>
    request({
      url: url + '/studentTrainingRecords/evaluationRecords',
      method: 'get',
      params,
    }),
  getFlyTrainReadTask: (params) =>
    request({
      url: url + `/flightTrainingEvaluationRecords/${params.id}/readTask`,
      method: 'get',
      params,
    }),
}

export default Api
