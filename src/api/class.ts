import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 * @param {
 * 班级列表
 * }
 */

export const getClazzsList = function (params) {
  return request({
    url: url + `/clazzs`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 班级详情
 * }
 */
export const getClazzsById = function (params) {
  return request({
    url: url + `/clazzs/${params}`,
    method: 'get'
  })
}
/**
 * @param {
 * 班级新增
 * }
 */

export const postClazzs = function (data) {
  return request({
    url: url + `/clazzs`,
    method: 'post',
    data
  })
}
/**
 * @param {
 * 班级修改
 * }
 */

export const putClazzs = function (data) {
  return request({
    url: url + `/clazzs/${data.id}`,
    method: 'put',
    data
  })
}
// interface aa {
//   courseNumber: ''
//   endTime: ''
//   name: ''
//   status: ''
//   syllabusId: 0
// }

/**
 * @param {
 * 班级 获取客户对应的岗位列表
 * }
 */
export const getClazzsPositions = function (params) {
  return request({
    url: url + `/clazzs/${params.id}/positions`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 班级 获取客户对应的岗位的培训类型列表
 * }
 */
export const getClazzsPositionsTrainingTypeConfigs = function (params) {
  return request({
    url: url + `/clazzs/${params.id}/trainingTypeConfigs`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 班级 获取客户对应的岗位的培训类型的大纲列表
 * }
 */
export const getClazzsPositionsTrainingTypeConfigsSyllabus = function (params) {
  return request({
    url: url + `/clazzs/${params.id}/syllabus`,
    method: 'get',
    params
  })
}
/**
 * @param {
 * 班级 客户列表
 * }
 */
export const getClazzsCustomers = function (params) {
  return request({
    url: url + `/clazzs/${params}/customers`,
    method: 'get'
  })
}/**
 * @param {
 * 班级 分组列表
 * }
 */
export const getClazzsGroups = function (params) {
  return request({
    url: url + `/clazzs/${params}/groups`,
    method: 'get',
    params
  })
}/**
 * @param {
 * 班级 学员列表
 * }
 */
export const getClazzsStudents = function (params) {
  return request({
    url: url + `/clazzs/${params.id}/students`,
    method: 'get',
    params
  })
}
