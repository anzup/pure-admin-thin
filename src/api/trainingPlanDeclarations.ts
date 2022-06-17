import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 *
 * @param {
 * 列表
 * }
 */

export const getTrainingPlanDeclarationsList = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 详情
 * }
 */

export const getTrainingPlanDeclarationsDetail = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/${params}`,
    method: 'get'
  })
}

export interface PostTrainingPlanDeclarationsInterface {
  name?: string
  id?: number
  customerId?: number
  positionId?: number
  time?:any
}
/**
 * @param {
 * 新增
 * }
 */

export const postTrainingPlanDeclarations = function (data) {
  return request({
    url: url + `/trainingPlanDeclarations`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 批量新增
 * }
 */

export const postBatchAddTrainingPlanDeclarations = function (data) {
  return request({
    url: url + `/trainingPlanDeclarations/batchAdd`,
    method: 'post',
    data
  })
}

/**
 * @param {
 * 修改
 * }
 */

export const putTrainingPlanDeclarationsId = function (data) {
  return request({
    url: url + `/trainingPlanDeclarations/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * @param {
 * 删除
 * }
 */

export const deleteTrainingPlanDeclarationsId = function (data) {
  return request({
    url: url + `/trainingPlanDeclarations/${data}`,
    method: 'delete'
  })
}

/**
 * @param {
 * 客户列表
 * }
 */

export const getTrainingPlanDeclarationsCustomers = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/management/customers`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 申报信息
 * }
 */

export const getTrainingPlanDeclarationsInfo = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/management/declarations`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 申报确认、拒绝
 * }
 */

export const postConfirmTrainingPlanDeclarations = function (data) {
  return request({
    url: url + `/trainingPlanDeclarations/${data.id}/confirm`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 申报管理-全部确认
 * }
 */

export const postConfirmAllTrainingPlanDeclarations = function (data) {
  return request({
    url: url + `/trainingPlanDeclarations/confirmAll`,
    method: 'post',
    data
  })
}
/**
 *@function 申报管理-导出
 */
export const getTrainingPlanDeclarationsExport = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/export`,
    method: 'get',
    responseType: 'blob',
    params
  })
}
/**
 * @function {
 * 申报管理-班级信息-列表
 * }
 */
export const getTrainingPlanDeclarationsClazzs = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/management/customer/clazzs`,
    method: 'get',
    params
  })
}
/**
 * @function {
 * 申报管理-班级信息-详情
 * }
 */
export const getTrainingPlanDeclarationsClazzsById = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/management/customer/clazzs/${params.id}`,
    method: 'get',
    params
  })
}
/**
 * @function {
 * 申报管理-班级信息-岗位机型列表
 * }
 */
export const getTrainingPlanDeclarationsClazzsAirplaneTypes = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/management/customer/clazzs/${params.id}/airplaneTypes`,
    method: 'get',
    params
  })
}
/**
 * @function {
 * 申报管理-班级信息-分组信息
 * }
 */
export const getTrainingPlanDeclarationsClazzsGroups = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/management/customer/clazzs/${params.id}/groups`,
    method: 'get',
    params
  })
}
/**
 * @function {
 * 申报管理-班级信息-岗位信息
 * }
 */
export const getTrainingPlanDeclarationsClazzsPositions = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/management/customer/clazzs/${params.id}/positions`,
    method: 'get',
    params
  })
}

/**
 * @function {
 * 申报管理-班级信息-学员列表
 * }
 */
export const getTrainingPlanDeclarationsClazzsStudents = function (params) {
  return request({
    url: url + `/trainingPlanDeclarations/management/customer/clazzs/${params.id}/students`,
    method: 'get',
    params
  })
}
/**
 * @function {
 * 申报管理-班级信息-添加学员
 * }
 */
export const postTrainingPlanDeclarationsClazzsStudents = function (data) {
  return request({
    url: url + `/trainingPlanDeclarations/management/customer/clazzs/${data.id}/students`,
    method: 'post',
    data: data.data
  })
}
/**
 * @function {
 * 委培端-培训学员
 * }
 */
export const getTrainingStudents = function (params) {
  return request({
    url: url + `/trainingStudents`,
    method: 'get',
    params
  })
}
/**
 * @function {
 * 委培端-培训学员-新增
 * }
 */
export const postTrainingStudents = function (data) {
  return request({
    url: url + `/trainingStudents`,
    method: 'post',
    data
  })
}
/**
 * @function {
 * 委培端-培训学员-详情
 * }
 */
export const getTrainingStudentsById = function (params) {
  return request({
    url: url + `/trainingStudents/${params}`,
    method: 'get'
  })
}
/**
 * @function {
 * 委培端-培训学员-详情
 * }
 */
export const putTrainingStudentsById = function (data) {
  return request({
    url: url + `/trainingStudents/${data.id}`,
    method: 'put',
    data
  })
}
/**
 * @function {
 * 申报管理-班级信息-学员-批量删除
 * }
 */
export const batchDeleteTrainingStudents = function (data) {
  return request({
    url: url + `/trainingStudents/batchDelete`,
    method: 'post',
    data: data
  })
}
/**
 * @function {
 * 申报管理-班级信息-学员-删除
 * }
 */

export const deleteTrainingStudentsById = function (data) {
  return request({
    url: url + `/trainingStudents/${data}`,
    method: 'delete'
  })
}

/**
 * @function {
 * 委培端-培训学员-修改状态
 * }
 */
export const putTrainingStudentsStatus = function (data) {
  return request({
    url: url + `/trainingStudents/${data.id}/status`,
    method: 'put',
    data
  })
}
/**
 *@function 培训学员-导出模板
 */
export const getTrainingStudentsTemplate = function (params) {
  return request({
    url: url + `/trainingStudents/import/template`,
    method: 'get',
    responseType: 'blob',
    params
  })
}
/**
 * @function 培训学员-批量导入
 * 
 */
export const importTrainingStudents = function (file, data) {
  return request({
    url: url + `/trainingStudents/import`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: file
  })
}