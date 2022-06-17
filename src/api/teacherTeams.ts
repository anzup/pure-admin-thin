import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 *
 * @param {
 * 类型列表
 * }
 */

export const getTeacherTeamsList = function (params) {
  return request({
    url: url + `/teams`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 类型详情
 * }
 */

export const getTeacherTeamsDetail = function (params) {
  return request({
    url: url + `/teams/${params}`,
    method: 'get'
  })
}

/**
 * @param {
 * 类型新增
 * }
 */

export const postTeacherTeams = function (data) {
  return request({
    url: url + `/teams`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 类型修改
 * }
 */

export const putTeacherTeamsId = function (data) {
  return request({
    url: url + `/teams/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 类型删除
 * }
 */

export const deleteTeacherTeamsId = function (data) {
  return request({
    url: url + `/teams/${data}`,
    method: 'delete'
  })
}
