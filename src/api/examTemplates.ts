import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 *
 * @param {
 * 考试模板 列表
 * }
 */

export const getExamTemplatesList = function (params) {
  return request({
    url: url + `/examTemplates`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 考试模板 详情
 * }
 */

export const getExamTemplatesDetail = function (params) {
  return request({
    url: url + `/examTemplates/${params.id}`,
    method: 'get'
  })
}
/**
 * @param {
 * 考试模板 新增
 * }
 */

export const postExamTemplates = function (data) {
  return request({
    url: url + `/examTemplates`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 考试模板 修改
 * }
 */

export const putExamTemplatesId = function (data) {
  return request({
    url: url + `/examTemplates/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 考试模板 删除
 * }
 */
export const deleteExamTemplatesId = function (data) {
  return request({
    url: url + `/examTemplates/${data}`,
    method: 'delete'
  })
}
/**
 * @param {
 * 考试规则 默认
 * }
 */

export const getExamRegulationsDefault = function (params) {
  return request({
    url: url + `/examRegulations/default`,
    method: 'get'
  })
}
/**
 * @param {
 * 考试规则 修改
 * }
 */

export const putExamRegulationsId = function (data) {
  return request({
    url: url + `/examRegulations/${data.id}`,
    method: 'put',
    data
  })
}