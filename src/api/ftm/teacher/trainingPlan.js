import http from '@/utils/http'
import XEUtils from 'xe-utils'

// 客户
export const getCustomers = function (params) {
  const url= '/customers';
  return http(url, params, "get", );
};
export const postCustomers = function (params) {
  const url= '/customers';
  return http(url, params, "post", );
};
export const getCustomersId = function (params) {
  const url= '/customers/{id}';
  return http(url, params, "get_p", );
};
export const putCustomersId = function (params) {
  const url= '/customers/{id}';
  return http(url, params, "put", );
};
export const deleteCustomersId = function (params) {
  const url= '/customers/{id}';
  return http(url, params, "delete", );
};
export const getCustomersAll = function (params) {
  const url= '/customers/all';
  return http(url, params, "get", );
};
export const postCustomersBatchDelete = function (params) {
  const url= '/customers/batchDelete';
  return http(url, params, "post", );
};
// 客户配置
export const getCustomerTypes = function (params) {
  const url= '/customerTypes';
  return http(url, params, "get", );
};
export const getCustomerTypesAll = function (params) {
  const url= '/customerTypes/all';
  return http(url, params, "get", );
};
export const postCustomerTypes = function (params) {
  const url= '/customerTypes/add';
  return http(url, params, "post", );
};
export const putCustomerTypesId = function (params) {
  const url= '/customerTypes/{id}';
  return http(url, params, "put", );
};
export const deleteCustomerTypesId = function (params) {
  const url= '/customerTypes/{id}';
  return http(url, params, "delete", );
};

// 课程
export const getCourses = function (params) {
  const url= '/courses';
  return http(url, params, "get", );
};
export const postCourses = function (params) {
  const url= '/courses';
  return http(url, params, "post", );
};
export const getCoursesId = function (params) {
  const url= '/courses/{id}';
  return http(url, params, "get_p", );
};
export const putCoursesId = function (params) {
  const url= '/courses/{id}';
  return http(url, params, "put", );
};
export const deleteCoursesId = function (params) {
  const url= '/courses/{id}';
  return http(url, params, "delete", );
};
export const getCoursesAll = function (params) {
  const url= '/courses/all';
  return http(url, params, "get", );
};
export const postCoursesBatchDelete = function (params) {
  const url= '/courses/batchDelete';
  return http(url, params, "post", );
};

// 机型
export const getAirplaneTypesAll = function (params) {
  const url= '/airplaneTypes/all';
  return http(url, params, "get", );
};


// 加训学员
export const getRetraining = function(params){
  const Interface = {
    page: 1, // 当前页,默认为1
    size: 10, // 每页数量,默认为10
    sort: undefined,
    order: undefined,
    status: undefined, // 状态
    searchKey: '' // 模糊匹配搜索:name
  }
  return http('/additionalTrainingNotices', XEUtils.assign(Interface, params), 'get')
}

/**
 * 加训详情
 */
export function getReTrainingDetails(params){
  return http('/additionalTrainingNotices/{id}', params, 'get_p')
}

/**
 * 加训审核
 */
export function setReTrainingAudit(params){
  return http('/additionalTrainingNotices/{id}/audit',params,'post')
}
