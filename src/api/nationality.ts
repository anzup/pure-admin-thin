import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 *
 * @param {
 * 国籍列表
 * }
 */

export const getNationalityList = function (params) {
  return request<DefaultPagingData>({
    url: url + `/nationalities`,
    method: 'get',
    params
  })
}
