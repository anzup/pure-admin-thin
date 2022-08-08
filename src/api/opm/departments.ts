import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_OPM
const ftmUrl = import.meta.env.VITE_BASE_API_FTM
/**
 *
 * @param {
 * 部门下拉列表
 * }
 */

export const getDepartmentsAll = function () {
  return request({
    url: ftmUrl + `/departments/all`,
    method: 'get',
  })
}
