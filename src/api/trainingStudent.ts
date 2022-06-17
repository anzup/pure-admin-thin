import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 * @function 学员考勤
 */
export interface TrainingStudentAttendances {
  scheduleId: number
  sourceScheduleId: number
  trainingStudentId: number
}

/**
 *
 * @param {
 * 学员考勤 列表
 * }
 */
export const getTrainingStudentAttendancesList = function (params) {
  return request({
    url: url + `/trainingStudentAttendances`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 学员考勤 详情
 * }
 */

export const getTrainingStudentAttendancesDetail = function (params) {
  return request({
    url: url + `/trainingStudentAttendances/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 学员考勤 新增
 * }
 */
export const postTrainingStudentAttendances = function (data) {
  return request({
    url: url + `/trainingStudentAttendances`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 学员考勤 修改
 * }
 */
export const putTrainingStudentAttendancesId = function (data) {
  return request({
    url: url + `/trainingStudentAttendances/${data.id}`,
    method: 'put',
    data,
  })
}
/**
 * @param {
 * 学员考勤 批量修改
 * }
 */
export const putTrainingStudentAttendancesBatch = function (data) {
  return request({
    url: url + `/trainingStudentAttendances/batch`,
    method: 'put',
    data,
  })
}
/**
 * @param {
 * 学员考勤 删除
 * }
 */
export const deleteTrainingStudentAttendancesId = function (data) {
  return request({
    url: url + `/trainingStudentAttendances/${data}`,
    method: 'delete',
  })
}
/**
 *
 * @param {
 * 学员考勤 班级分页列表
 * }
 */
export const getTrainingStudentAttendancesClazzById = function (params) {
  return request({
    url: url + `/trainingStudentAttendances/clazz`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {
 * 学员实操打分 列表
 * }
 */
export const getTrainingStudentGradesList = function (params) {
  return request({
    url: url + `/trainingStudentGrades`,
    method: 'get',
    params,
  })
}
/**
 * @param {
 * 学员实操打分 修改
 * }
 */
export const putTrainingStudentGradesBatch = function (data) {
  return request({
    url: url + `/trainingStudentGrades/batch`,
    method: 'put',
    data,
  })
}
/**
 * @param {
 * 学员成绩-班级
 * }
 */
export const putTrainingStudentGradesClazz = function (params) {
  return request({
    url: url + `/trainingStudentGrades/clazz`,
    method: 'get',
    params,
  })
}
