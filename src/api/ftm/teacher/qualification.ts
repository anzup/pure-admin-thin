import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

// 分页列表
export const getCourseQualifications = (params) =>
  request({
    url: url + '/courseQualifications',
    method: 'get',
    params,
  })
// 新增
export const postCourseQualification = (data) =>
  request({
    url: url + '/courseQualifications',
    method: 'post',
    data,
  })
// 批量删除
export const batchDeleteCourseQualifications = (data) =>
  request({
    url: url + '/courseQualifications/batchDelete',
    method: 'post',
    data,
  })
// 详情
export const getCourseQualificationDetail = (params) =>
  request({
    url: url + '/courseQualifications/' + params.id,
    method: 'get',
    params,
  })
// 修改
export const putCourseQualification = (data) =>
  request({
    url: url + '/courseQualifications/' + data.id,
    method: 'put',
    data,
  })
// 删除
export const deleteCourseQualification = (data) =>
  request({
    url: url + '/courseQualifications/' + data.id,
    method: 'delete',
    data,
  })
// 绑定题库
export const putCourseQualificationBinding = (data) =>
  request({
    url: url + `/courseQualifications/${data.id}/binding`,
    method: 'put',
    data,
  })
// 取消绑定题库
export const putCourseQualificationCancelBinding = (data) =>
  request({
    url: url + `/courseQualifications/${data.id}/cancelBinding`,
    method: 'put',
    data,
  })

/**
 * 资质配置
 */
// 资质配置分页列表
export const getQualificationConfigurations = (params) =>
  request({
    url: url + '/employeeQualificationConfigurations',
    method: 'get',
    params,
  })
// 新增配置
export const postQualificationConfigurations = (data) =>
  request({
    url: url + '/employeeQualificationConfigurations',
    method: 'post',
    data,
  })
// 批量删除配置
export const batchDeleteQualificationConfigurations = (data) =>
  request({
    url: url + '/employeeQualificationConfigurations/batchDelete',
    method: 'post',
    data,
  })
// 配置详情
export const getQualificationConfigurationsDetail = (params) =>
  request({
    url: url + '/employeeQualificationConfigurations/' + params.id,
    method: 'get',
    params,
  })
// 配置修改
export const putQualificationConfigurations = (data) =>
  request({
    url: url + '/employeeQualificationConfigurations/' + data.id,
    method: 'put',
    data,
  })
// 删除配置
export const deleteQualificationConfigurations = (data) =>
  request({
    url: url + '/employeeQualificationConfigurations/' + data.id,
    method: 'delete',
    data,
  })

// 资质列表
export const getQualificationList = (params) =>
  request({
    url: url + '/employeeQualificationConfigurations/qualification',
    method: 'get',
    params,
  })
// 职位列表
export const getQualificationRoles = (params) =>
  request({
    url: url + '/employeeQualificationConfigurations/roles',
    method: 'get',
    params,
  })
// 删除资质
export const deleteQualificationConList = (data) =>
  request({
    url: url + '/employeeQualificationConfigurations/single/' + data.id,
    method: 'delete',
    data,
  })

/**
 * 个人资质
 */
// 查询申请列表
export const getQualificationRequest = (params) =>
  request({
    url: url + '/qualificationRequests/request',
    method: 'get',
    params,
  })
// 通过userId查询个人资质管理表
export const getQualificationUser = (params) =>
  request({
    url: url + '/qualifications/user',
    method: 'get',
    params,
  })
// 申請新增
export const postQualifications = (data) =>
  request({
    url: url + '/qualificationRequests',
    method: 'post',
    data,
  })
// 资质审核
export const postQualificationsApprove = (data) =>
  request({
    url: url + '/qualificationRequests/approve',
    method: 'post',
    data,
  })

/**
 * 运规资质审核
 */
// 分页列表
export const getQualificationProvide = (params) =>
  request({
    url: url + '/qualificationProvideRequests',
    method: 'get',
    params,
  })
// 资质审核
export const postQualificationProvide = (data) =>
  request({
    url: url + '/qualificationProvideRequests/approve',
    method: 'post',
    data,
  })
// 详情
export const getQualificationProvideDetail = (params) =>
  request({
    url: url + '/qualificationProvideRequests/' + params.id,
    method: 'get',
    params,
  })
// 单机型新增
export const postQualificationProvideSingle = (data) =>
  request({
    url: url + '/qualificationProvideRequests/singleAirProvide',
    method: 'post',
    data,
  })

/**
 * @description: 修改审核查看状态
 * @param {*} data id: 记录id; userLookUp: 用户是否查看;
 */
export const putQualificationProvideRequest = (data) =>
  request({
    url: url + '/qualificationProvideRequests/' + data.id,
    method: 'put',
    data,
  })

/**
 * @description: 修改资质申请查看状态
 * @param {*} data id: 记录id; userLookUp: 用户是否查看;
 * @return {*}
 */
export const putQualificationRequest = (data) =>
  request({
    url: url + '/qualificationRequests/' + data.id,
    method: 'put',
    data,
  })

/**
 * @description: 问卷分类下拉列表
 * @param {*} params builtIn: 是否内置
 * @return {*}
 */
export const getQualificationClassificationAll = (params) =>
  request({
    url: url + '/questionnaireClassifications/all',
    method: 'get',
    params,
  })
