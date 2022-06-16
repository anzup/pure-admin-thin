import { AxiosPromise } from "axios";
import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 * @function 分页列表
 */

export interface GetByPageParams extends PageBase {
  enabled?: boolean
  ids?: string
}

export const getRestTimes = function (params: GetByPageParams): AxiosPromise {
  return request({
    url: url + `/restTimes`,
    method: 'get',
    params
  })
}
/**
 * @function  修改
 */

export const putRestTimes = function (data) {
  return request({
    url: url + `/restTimes`,
    method: 'put',
    data
  })
}
