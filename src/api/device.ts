import request from '/@/utils/request'

const url = import.meta.env.VITE_BASE_API_CPM
;
/**
 *
 * @param {
 * 机型列表
 * }
 */

export const getAirplaneTypesList = function (params) {
  return request({
    url: url + `/airplaneTypes`,
    method: 'get',
    params,
  })
}
