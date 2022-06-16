import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 * @param {
 * 时间表 我的任务列表
 * }
 */

export const getTimeTablesMyTasks = function (params) {
  return request({
    url: url + `/timeTables/myTasks`,
    method: 'get',
    params
  })
}
  /**
 * @param {
 * 时间表 其他人任务列表
 * }
 */

export const getTimeTablesOtherTasks = function (params) {
  return request({
    url: url + `/timeTables/otherTasks`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 时间表 班级课表
 * }
 */

export const getTimeTablesClazzById = function (params) {
  return request({
    url: url + `/timeTables/clazz/${params.id}`,
    method: 'get',
    params
  })
}
  /**
 * @param {
 * 时间表 班级自学
 * }
 */

export const getTimeTablesSelfstudyById = function (params) {
  return request({
    url: url + `/timeTables/selfstudy/${params.id}`,
    method: 'get',
    params
  })
}
