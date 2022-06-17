import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 *
 * @param {
 * 题库列表
 * }
 */

export const getExamQuestionBanksList = function (params) {
  return request({
    url: url + `/examQuestionBanks`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 题库详情
 * }
 */

export const getExamQuestionBanksDetail = function (params) {
  return request({
    url: url + `/examQuestionBanks/${params.id}`,
    method: 'get',
  })
}
/**
 * @param {
 * 专属题库详情
 * }
 */
export const getExamQuestionBanksDetailCustomerPositions = function (params) {
  return request({
    url: url + `/examQuestionBanks/${params}/customerPositions`,
    method: 'get',
  })
}
/**
 * @param {
 * 题库新增
 * }
 */

export const postExamQuestionBanks = function (data) {
  return request({
    url: url + `/examQuestionBanks`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 题库修改
 * }
 */

export const putExamQuestionBanksId = function (data) {
  return request({
    url: url + `/examQuestionBanks/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 题库删除
 * }
 */

export const deleteExamQuestionBanksId = function (data) {
  return request({
    url: url + `/examQuestionBanks/${data}`,
    method: 'delete',
  })
}
/**
 * @param {
 * 试题 批量导入
 * }
 */
export const importExamQuestionBanks = function (formData, data) {
  return request({
    url: url + `/examQuestionBanks/${data.id}/questionImport`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  })
}
/**
 * @param {
 * 试题 获取导入模板
 * }
 */
export const getTemplateExamQuestionBanks = function () {
  return request({
    url: url + `/examQuestionBanks/questionImport`,
    method: 'get',
    responseType: 'blob',
    // data,
  })
}
/**
 *
 * @param {
 * 题库列表
 * }
 */

export const getExamQuestionBanksBySyllabus = function (params) {
  return request({
    url: url + `/examQuestionBanks/bySyllabus`,
    method: 'get',
    params,
  })
}
