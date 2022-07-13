import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

// 客户
export const getCustomers = (params) =>
  request({
    url: url + '/customers',
    method: 'get',
    params,
  })
export const postCustomers = (data) =>
  request({
    url: url + '/customers',
    method: 'post',
    data,
  })
export const getCustomersId = (params) =>
  request({
    url: url + '/customers/' + params.id,
    method: 'get',
    params,
  })
export const putCustomersId = (data) =>
  request({
    url: url + '/customers/' + data.id,
    method: 'put',
    data,
  })
export const deleteCustomersId = (data) =>
  request({
    url: url + '/customers/' + data.id,
    method: 'delete',
    data,
  })
export const getCustomersAll = (params) =>
  request({
    url: url + '/customers/all',
    method: 'get',
    params,
  })
export const postCustomersBatchDelete = (data) =>
  request({
    url: url + '/customers/batchDelete',
    method: 'post',
    data,
  })
// 客户配置
export const getCustomerTypes = (params) =>
  request({
    url: url + '/customerTypes',
    method: 'get',
    params,
  })
export const getCustomerTypesAll = (params) =>
  request({
    url: url + '/customerTypes/all',
    method: 'get',
    params,
  })
export const postCustomerTypes = (data) =>
  request({
    url: url + '/customerTypes/add',
    method: 'post',
    data,
  })
export const putCustomerTypesId = (data) =>
  request({
    url: url + '/customerTypes/' + data.id,
    method: 'put',
    data,
  })
export const deleteCustomerTypesId = (data) =>
  request({
    url: url + '/customerTypes/' + data.id,
    method: 'delete',
    data,
  })

// 课程
export const getCourses = (params) =>
  request({
    url: url + '/courses',
    method: 'get',
    params,
  })
export const postCourses = (data) =>
  request({
    url: url + '/courses',
    method: 'post',
    data,
  })
export const getCoursesId = (params) =>
  request({
    url: url + '/courses/' + params.id,
    method: 'get',
    params,
  })
export const putCoursesId = (data) =>
  request({
    url: url + '/courses/' + data.id,
    method: 'put',
    data,
  })
export const deleteCoursesId = (data) =>
  request({
    url: url + '/courses/' + data.id,
    method: 'delete',
    data,
  })
export const getCoursesAll = (params) =>
  request({
    url: url + '/courses/all',
    method: 'get',
    params,
  })
export const postCoursesBatchDelete = (data) =>
  request({
    url: url + '/courses/batchDelete',
    method: 'post',
    data,
  })

// 机型
export const getAirplaneTypesAll = (params) =>
  request({
    url: url + '/airplaneTypes/all',
    method: 'get',
    params,
  })

// 加训学员
export const getRetraining = (params) =>
  request({
    url: url + '/additionalTrainingNotices',
    method: 'get',
    params: {
      page: 1, // 当前页,默认为1
      size: 10, // 每页数量,默认为10
      sort: undefined,
      order: undefined,
      status: undefined, // 状态
      searchKey: '', // 模糊匹配搜索:name
      ...params,
    },
  })

/**
 * 加训详情
 */
export const getReTrainingDetails = (params) =>
  request({
    url: url + '/additionalTrainingNotices/' + params.id,
    method: 'get',
    params,
  })

/**
 * 加训审核
 */
export const setReTrainingAudit = (data) =>
  request({
    url: url + `/additionalTrainingNotices/${data.id}/audit`,
    method: 'post',
    data,
  })
