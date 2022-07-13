import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

/**
 * @description: 政治面貌下拉列表
 * @return {Promise} Promise
 */
export const getPilotLicensesAll = (params) =>
  request({
    url: url + '/pilotLicenses/politically',
    method: 'get',
    params,
  })

/**
 * @description: 学历下拉列表
 * @return {Promise} Promise
 */
export const getPilotLicensesDegreesAll = (params) =>
  request({
    url: url + '/pilotLicenses/degrees',
    method: 'get',
    params,
  })

/**
 * @description: 分页列表
 */
export const getPilotLicenses = (params) =>
  request({
    url: url + '/pilotLicenses',
    method: 'get',
    params,
  })

/**
 * @description: 详情
 * @param {*} params 参数
 * - id
 * @return {Promise} Promise
 */
export const getPilotLicensesDetail = (params) =>
  request({
    url: url + '/pilotLicenses/' + params.id,
    method: 'get',
    params,
  })

/**
 * @description: 飞行执照-新增
 * @param {*} data 参数
 * @return {*} Promise
 */
export const postPilotLicenses = (data) =>
  request({
    url: url + '/pilotLicenses',
    method: 'post',
    data,
  })

/**
 * @description: 修改
 * @param {*} data 参数
 * - id
 * - pilotLicenseUpdateBO
 * @return {*} Promise
 */
export const putPilotLicenses = (data) =>
  request({
    url: url + '/pilotLicenses/' + data.id,
    method: 'put',
    data,
  })

/**
 * @description: 个人培训记录-分页列表
 * @param {*} params 分页参数
 * @return {*} Promise
 */
export const getPilotTrainingRecord = (params) =>
  request({
    url: url + '/pilotTrainingRecords',
    method: 'get',
    params,
  })

/**
 * @description: 飞行执照-根据userId查询详情
 * @param {*} params 参数
 * - id
 * @return {*} Promise
 */
export const getPilotcensesUserInfo = (params) =>
  request({
    url: url + '/pilotLicenses/userInfo/' + params.id,
    method: 'get',
    params,
  })

/**
 * @description: 个人培训记录-新增-修改
 * @param {*} data 参数
 * @return {*} Promist
 */
export const postPilotTrainingRecordsAddUpdate = (data) =>
  request({
    url: url + '/pilotTrainingRecords/addAndUpdate',
    method: 'post',
    data,
  })
