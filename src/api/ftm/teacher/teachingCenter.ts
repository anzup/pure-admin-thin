import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

/**
 * 直播列表
 */
export const getLives = (params) =>
  request({
    url: url + '/lives',
    method: 'get',
    params,
  })

/**
 * 新增直播
 */
export const postLives = (data) =>
  request({
    url: url + '/lives',
    method: 'post',
    data,
  })

/**
 * 直播详情
 */
export const getpLives = (params) =>
  request({
    url: url + '/lives/' + params.id,
    method: 'get',
    params,
  })

/**
 * 修改直播
 */
export const putLives = (data) =>
  request({
    url: url + '/lives/' + data.id,
    method: 'put',
    data,
  })

/**
 * 删除直播
 */
export const delLives = (data) =>
  request({
    url: url + '/lives/' + data.id,
    method: 'delete',
    data,
  })

/**
 * 批量删除
 */
export const delAllLives = (data) =>
  request({
    url: url + '/lives/batchDelete',
    method: 'post',
    data,
  })

/**
 * 发送聊天
 */
export const postLivesChat = (data) =>
  request({
    url: url + `/lives/${data.id}/chat`,
    method: 'post',
    data,
  })

/**
 * 直播踢人
 */
export const postLivesOut = (data) =>
  request({
    url: url + `/lives/${data.id}/kickOutUser`,
    method: 'post',
    data,
  })

/**
 * 强制静音
 */
export const postLivesMute = (data) =>
  request({
    url: url + `/lives/${data.id}/mute`,
    method: 'post',
    data,
  })

/**
 * 开始录像
 */
export const postLivesStartRecord = (data) =>
  request({
    url: url + `/lives/${data.id}/startRecord`,
    method: 'post',
    data,
  })

/**
 * 结束录像
 */
export const postLivesEndRecord = (data) =>
  request({
    url: url + `/lives/${data.id}/stopRecord`,
    method: 'post',
    data,
  })

/**
 * 获取直播token
 */
export const getLivesToken = (params) =>
  request({
    url: url + `/lives/${params.id}/token`,
    method: 'get',
    params,
  })

/**
 * 获取直播用户信息
 */
export const getLivesUserInfo = (params) =>
  request({
    url: url + `/lives/${params.id}/userInfos`,
    method: 'get',
    params,
  })

/**
 * 老数据课表
 */
export const getOldScheduleClazz = (params) =>
  request({
    url: url + '/oldSchedule/clazz',
    method: 'get',
    params,
  })

export const getOldScheduleEmployee = (params) =>
  request({
    url: url + '/oldSchedule/employee',
    method: 'get',
    params,
  })
export const getOldScheduleStudent = (params) =>
  request({
    url: url + '/oldSchedule/student',
    method: 'get',
    params,
  })
export const getOldScheduleFacilitie = (params) =>
  request({
    url: url + '/oldSchedule/facilitie',
    method: 'get',
    params,
  })
/**
 * 训练结果配置
 */

export const trainingResults = (params) =>
  request({
    url: url + '/trainingResults',
    method: 'get',
    params,
  })
export const trainingResultsPost = (data) =>
  request({
    url: url + '/trainingResults',
    method: 'post',
    data,
  })
export const trainingResultsGetP = (params) =>
  request({
    url: url + '/trainingResults/' + params.id,
    method: 'get',
    params,
  })
export const trainingResultsPut = (data) =>
  request({
    url: url + '/trainingResults/' + data.id,
    method: 'put',
    data,
  })
export const trainingResultsDel = (data) =>
  request({
    url: url + '/trainingResults/' + data.id,
    method: 'delete',
    data,
  })

/**
 * 考勤管理
 */
export const getAttendances = (params) =>
  request({
    url: url + '/attendances',
    method: 'get',
    params,
  })
export const getAttendancesId = (params) =>
  request({
    url: url + '/attendances/' + params.id,
    method: 'get',
    params,
  })
export const postAttendancesId = (data) =>
  request({
    url: url + `/attendances/${data.id}/sign`,
    method: 'post',
    data,
  })
export const getAttendanceRecords = (params) =>
  request({
    url: url + '/attendances/attendanceRecords',
    method: 'get',
    params,
  })

/**
 * 学员离队训练
 */
export const getStudentOutTrainRecords = (params) =>
  request({
    url: url + '/studentOutTrainingRecords',
    method: 'get',
    params,
  })
export const getStudentOutTrainRecordsDetail = (params) =>
  request({
    url: url + '/studentOutTrainingRecords/' + params.id,
    method: 'get',
    params,
  })
export const putStudentOutTrainRecords = (data) =>
  request({
    url: url + '/studentOutTrainingRecords/' + data.id,
    method: 'put',
    data,
  })
export const postStudentOutTrainRecordsSign = (data) =>
  request({
    url: url + `/studentOutTrainingRecords/${data.id}/sign`,
    method: 'post',
    data,
  })

// TODO: data.download调用此接口的判断调用toPdf下载
export const downloadStudentOutTrainRecords = (data) =>
  request({
    url: url + '/studentOutTrainingRecords/genPdfByRecords',
    method: 'post',
    data,
  })

/**
 * 班级课程进度表
 */
export const getSchedulesStudents = (params) =>
  request({
    url: url + '/clazzTeachingSchedules/students/' + params.id,
    method: 'get',
    params,
  })
export const postSchedulesStudentSign = (data) =>
  request({
    url: url + `/clazzTeachingSchedules/${data.id}/sign`,
    method: 'post',
    data,
  })
export const postSchedulesStudentsSign = (data) =>
  request({
    url: url + '/clazzTeachingSchedules/batchSign',
    method: 'post',
    data,
  })
export const putSchedulesStudentSign = (data) =>
  request({
    url: url + '/clazzTeachingSchedules/' + data.id,
    method: 'put',
    data,
  })
export const getStudentSchedules = (params) =>
  request({
    url: url + '/clazzTeachingSchedules/students',
    method: 'get',
    params,
  })
