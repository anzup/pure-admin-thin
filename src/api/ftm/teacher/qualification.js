/**
 * 课程资质
 */
import http from "@/utils/http";

// 分页列表
export function getCourseQualifications(params){
    return http('/courseQualifications', params, 'get')
}
// 新增
export function postCourseQualification(params){
    return http('/courseQualifications', params, 'post')
}
// 批量删除
export function batchDeleteCourseQualifications(params){
    return http('/courseQualifications/batchDelete', params, 'post')
}
// 详情
export function getCourseQualificationDetail(params){
    return http('/courseQualifications/{id}', params, 'get_p')
}
// 修改
export function putCourseQualification(params){
    return http('/courseQualifications/{id}', params, 'put')
}
// 删除
export function deleteCourseQualification(params){
    return http('/courseQualifications/{id}', params, 'delete')
}
// 绑定题库
export function putCourseQualificationBinding(params){
    return http('/courseQualifications/{id}/binding', params, 'put')
}
// 取消绑定题库
export function putCourseQualificationCancelBinding(params){
    return http('/courseQualifications/{id}/cancelBinding', params, 'put')
}

/**
 * 资质配置
 */
// 资质配置分页列表
export function getQualificationConfigurations(params){
    return http('/employeeQualificationConfigurations', params, 'get');
}
// 新增配置
export function postQualificationConfigurations(params){
    return http('/employeeQualificationConfigurations', params, 'post');
}
// 批量删除配置
export function batchDeleteQualificationConfigurations(params){
    return http('/employeeQualificationConfigurations/batchDelete', params, 'post');
}
// 配置详情
export function getQualificationConfigurationsDetail(params){
    return http('/employeeQualificationConfigurations/{id}', params, 'get_p');
}
// 配置修改
export function putQualificationConfigurations(params){
    return http('/employeeQualificationConfigurations/{id}', params, 'put');
}
// 删除配置
export function deleteQualificationConfigurations(params){
    return http('/employeeQualificationConfigurations/{id}', params, 'delete');
}

// 资质列表
export function getQualificationList(params){
    return http('/employeeQualificationConfigurations/qualification', params, 'get');
}
// 职位列表
export function getQualificationRoles(params){
    return http('/employeeQualificationConfigurations/roles', params, 'get');
}
// 删除资质
export function deleteQualificationConList(params){
    return http('/employeeQualificationConfigurations/single/{id}', params, 'delete')
}

/**
 * 个人资质
 */
// 查询申请列表
export function getQualificationRequest(params){
    return http('/qualificationRequests/request', params, 'get')
}
// 通过userId查询个人资质管理表
export function getQualificationUser(params){
    return http('/qualifications/user', params, 'get_p')
}
// 申請新增
export function postQualifications(params){
    return http('/qualificationRequests', params, 'post')
}
// 资质审核
export function postQualificationsApprove(params){
    return http('/qualificationRequests/approve', params, 'post')
}

/**
 * 运规资质审核
 */
// 分页列表
export function getQualificationProvide(params){
    return http('/qualificationProvideRequests', params, 'get')
}
// 资质审核
export function postQualificationProvide(params){
    return http('/qualificationProvideRequests/approve', params, 'post')
}
// 详情
export function getQualificationProvideDetail(params){
    return http('/qualificationProvideRequests/{id}', params, 'get_p')
}
// 单机型新增
export function postQualificationProvideSingle(params){
    return http('/qualificationProvideRequests/singleAirProvide', params, 'post')
}

/**
 * @description: 修改审核查看状态
 * @param {*} data id: 记录id; userLookUp: 用户是否查看;
 */
export function putQualificationProvideRequest(data){
    return http('/qualificationProvideRequests/{id}', data, 'put')
}

/**
 * @description: 修改资质申请查看状态
 * @param {*} data id: 记录id; userLookUp: 用户是否查看;
 * @return {*}
 */
export function putQualificationRequest(data){
    return http('/qualificationRequests/{id}', data, 'put')
}

/**
 * @description: 问卷分类下拉列表
 * @param {*} params builtIn: 是否内置
 * @return {*}
 */
export function getQualificationClassificationAll(params){
    return http('/questionnaireClassifications/all', params, 'get')
}