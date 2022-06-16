import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 * @function 异常记录分页列表
 */

export type Type =
  | 'EXAM'
  | 'ATTENDANCE'
export const getAbnormalRecords = function (params) {
  return request<string>({
    url: url + `/AbnormalRecords`,
    method: 'get',
    params
  })
}
