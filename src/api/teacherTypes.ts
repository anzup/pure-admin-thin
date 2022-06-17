import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 *
 * @param {
 * 类型列表
 * }
 */

export const getTeacherTypesList = function (params) {
  return request({
    url: url + `/teacherTypes`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 类型详情
 * }
 */

export const getTeacherTypesDetail = function (params) {
  return request({
    url: url + `/teacherTypes/${params}`,
    method: 'get'
  })
}

/**
 * @param {
 * 类型新增
 * }
 */

export const postTeacherTypes = function (data) {
  return request({
    url: url + `/teacherTypes`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 类型修改
 * }
 */

export const putTeacherTypesId = function (data) {
  return request({
    url: url + `/teacherTypes/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 类型删除
 * }
 */

export const deleteTeacherTypesId = function (data) {
  return request({
    url: url + `/teacherTypes/${data}`,
    method: 'delete'
  })
}
