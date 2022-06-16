import request from "/@/utils/request";

const baseUrl = import.meta.env.VITE_BASE_API_CPM;


export const putQuestionBanksId = function (params) {
  const url = `/questionBanks/${params.id}`
  return request({ url: baseUrl + url, params, method: 'put' })
}
// 获取题库题目统计信息
export const getExamQuestionBanksStats = function (params) {
  const url = '/examQuestionBanks/stats'
  return request({ url: baseUrl + url, params, method: 'get' })
}

// 试题
export const getQuestions = function (params) {
  const url = '/examQuestions'
  return request({ url: baseUrl + url, params, method: 'get' })
}
export const postQuestions = function (data) {
  const url = '/examQuestions'
  return request({ url: baseUrl + url, data, method: 'post' })
}
export const getQuestionsId = function (params) {
  const url = `/examQuestions/${params.id}`
  return request({ url: baseUrl + url, params, method: 'get' })
}
export const putQuestionsId = function (data) {
  const url = `/examQuestions/${data.id}`
  return request({ url: baseUrl + url, data, method: 'put' })
}
export const deleteQuestionsId = function (params) {
  const url = `/examQuestions/${params.id}`
  return request({ url: baseUrl + url, params, method: 'delete' })
}
export const postQuestionsBatchDelete = function (data) {
  const url = '/examQuestions/batchDelete'
  return request({ url: baseUrl + url, data, method: 'post' })
}
