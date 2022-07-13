import http from "@/utils/http"


/**
 * @description: 政治面貌下拉列表
 * @return {Promise} Promise
 */
export function getPilotLicensesAll(){
    return http('/pilotLicenses/politically', null, 'get')
}

/**
 * @description: 学历下拉列表
 * @return {Promise} Promise
 */
export function getPilotLicensesDegreesAll(){
    return http('/pilotLicenses/degrees', null, 'get')
}

/**
 * @description: 分页列表
 * @param {*} params 
 * @return {*} Promise
 */
export function getPilotLicenses(params){
    return http('/pilotLicenses', params, 'get')
}

/**
 * @description: 详情
 * @param {*} params 参数
 * - id
 * @return {Promise} Promise
 */
export function getPilotLicensesDetail(params){
    return http('/pilotLicenses/{id}', params, 'get_p')
}

/**
 * @description: 飞行执照-新增
 * @param {*} data 参数
 * @return {*} Promise
 */
export function postPilotLicenses(data){
    return http('/pilotLicenses', data, 'post')
}

/**
 * @description: 修改
 * @param {*} data 参数
 * - id
 * - pilotLicenseUpdateBO
 * @return {*} Promise
 */
export function putPilotLicenses(data){
    return http('/pilotLicenses/{id}', data, 'put')
}

/**
 * @description: 个人培训记录-分页列表
 * @param {*} params 分页参数
 * @return {*} Promise
 */
export function getPilotTrainingRecord(params){
    return http('/pilotTrainingRecords', params, 'get')
}

/**
 * @description: 飞行执照-根据userId查询详情
 * @param {*} params 参数
 * - id
 * @return {*} Promise
 */
export function getPilotcensesUserInfo(params){
    return http('/pilotLicenses/userInfo/{id}', params, 'get_p')
}

/**
 * @description: 个人培训记录-新增-修改
 * @param {*} data 参数
 * @return {*} Promist
 */
export function postPilotTrainingRecordsAddUpdate(data){
    return http('/pilotTrainingRecords/addAndUpdate', data, 'post')
}