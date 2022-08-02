import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM
const pubUrl = import.meta.env.VITE_BASE_API_PUB

/**
 * 飞行训练评价
 */
export const flyTrainEva = (params) =>
  request({
    url: url + '/flightTrainingEvaluationRecords',
    method: 'get',
    params,
  })

/**
 * 飞行训练评价（详情）
 */
export const flyTrainEvaDetails = (params) =>
  request({
    url: url + '/flightTrainingEvaluationRecords/' + params.id,
    method: 'get',
    params,
  })

/**
 * 预览
 */
export const previewURL = (uuid) => {
  return `${pubUrl}/open/${uuid}/inline`
}

/**
 * 提交签名pin码
 */
export const flyTrainSign = (data) =>
  request({
    url: url + `/flightTrainingEvaluationRecords/${data.id}/sign`,
    method: 'post',
    data,
  })

// 飞行考试列表
export const flyExam = (params) =>
  request({
    url: url + '/flightExamRecords',
    method: 'get',
    params,
  })

/**
 * 班级课号
 */
export const clazzsAll = (params) =>
  request({
    url: url + '/clazzs/all',
    method: 'get',
    params,
  })

/**
 * 飞行小组
 */
export const groupAll = (params) =>
  request({
    url: url + '/groupings/all',
    method: 'get',
    params,
  })

// 飞行考试（详情）
export const getFlyExamDetails = (params) =>
  request({
    url: url + '/flightExamRecords/' + params.id,
    method: 'get',
    params,
  })

// 提交飞行详情签名
export const setFlyExamSign = (data) =>
  request({
    url: url + `/flightExamRecords/${data.id}/sign`,
    method: 'post',
    data,
  })

/**
 * 获取签名图片地址（返回url）
 */
export const getSignURL = (uuid) => {
  return `${pubUrl}/open/${uuid}/inline`
}

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

// 未完训班级
export const noFinishedClazzs = (params) =>
  request({
    url: url + '/clazzs',
    method: 'get',
    params: {
      size: 1000,
      statusIN: 'NOT_STARTED,TRAINING',
      type: 'WET_LEASE',
      ...params,
    },
  })

// 问卷列表
export const getQrecord = (params) =>
  request({
    url: url + '/qRecords',
    method: 'get',
    params,
  })
export const putQrecord = (data) =>
  request({
    url: url + '/qRecords/' + data.id,
    method: 'put',
    data,
  })
export const getDetailQrecord = (params) =>
  request({
    url: url + '/qRecords/byQuestionnaire/' + params.questionnaireId,
    method: 'get',
    params,
  })

export const getOldScheduleStudent = (params) =>
  request({
    url: url + '/oldSchedule/student',
    method: 'get',
    params,
  })
