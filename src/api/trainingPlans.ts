import { AxiosPromise } from "axios";
import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 * @function 期数计划 列表按月
 */


export const getTrainingPlansMonthly = function (params): AxiosPromise {
  return request({
    url: url + `/trainingPlans/monthly`,
    method: 'get',
    params
  })
}

/**
 * @function  修改
 */

export const putTrainingPlans = function (params) {
  const { id, ...data } = params
  return request({
    url: url + `/trainingPlans/${id}`,
    method: 'put',
    data
  })
}

/**
 *@function 导出
 */
export const getTrainingPlansExport = function (params) {
  return request({
    url: url + `/trainingPlans/export`,
    method: 'get',
    responseType: 'blob',
    params
  })
}
/**
 * @function  期数计划-确认修改
 */

export const putTrainingPlanConfirmations = function (params) {
  const { id, ...data } = params
  return request({
    url: url + `/trainingPlanConfirmations/${id}`,
    method: 'put',
    data
  })
}
/**
 * @param {
 * 批量新增
 * }
 */

export const postBatchAddTrainingPlanConfirmations = function (data) {
  return request({
    url: url + `/trainingPlanConfirmations/batchAdd`,
    method: 'post',
    data
  })
}
