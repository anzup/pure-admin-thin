import request from '/@/utils/request/opm'
const url = import.meta.env.VITE_BASE_API_OPM

/**
 *
 * @param {
 * 部门下拉列表
 * }
 */

export const getDepartmentsAll = function () {
  return request({
    url: url + `/departments/all`,
    method: 'get',
  })
}
