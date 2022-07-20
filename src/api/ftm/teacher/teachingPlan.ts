import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

// 课程大纲
export const getSyllabuses = (params) =>
  request({
    url: url + '/syllabuses',
    method: 'get',
    params,
  })
export const postSyllabuses = (data) =>
  request({
    url: url + '/syllabuses',
    method: 'post',
    data,
  })
export const getSyllabusesId = (params) =>
  request({
    url: url + '/syllabuses/' + params.id,
    method: 'get',
    params,
  })
export const putSyllabusesId = (data) =>
  request({
    url: url + '/syllabuses/' + data.id,
    method: 'put',
    data,
  })
export const deleteSyllabusesId = (data) =>
  request({
    url: url + '/syllabuses/' + data.id,
    method: 'delete',
    data,
  })
export const getSyllabusesAll = (params) =>
  request({
    url: url + '/syllabuses/all',
    method: 'get',
    params,
  })
export const postSyllabusesBatchDelete = (data) =>
  request({
    url: url + '/syllabuses/batchDelete',
    method: 'post',
    data,
  })

// 班级
export const getClazzs = (params) =>
  request({
    url: url + '/clazzs',
    method: 'get',
    params,
  })
export const postClazzs = (data) =>
  request({
    url: url + '/clazzs',
    method: 'post',
    data,
  })
export const getClazzsId = (params) =>
  request({
    url: url + '/clazzs/' + params.id,
    method: 'get',
    params,
  })
export const putClazzsId = (data) =>
  request({
    url: url + '/clazzs/' + data.id,
    method: 'put',
    data,
  })
export const deleteClazzsId = (data) =>
  request({
    url: url + '/clazzs/' + data.id,
    method: 'delete',
    data,
  })
export const getClazzsAll = (params) =>
  request({
    url: url + '/clazzs/all',
    method: 'get',
    params,
  })
export const postClazzsBatchDelete = (data) =>
  request({
    url: url + '/clazzs/batchDelete',
    method: 'post',
    data,
  })
// 班级课程进度表
export const getClazzTeachingSchedules = (params) =>
  request({
    url: url + '/clazzTeachingSchedules',
    method: 'get',
    params,
  })
// 修改
export const putClazzTeachingSchedules = (data) =>
  request({
    url: url + '/clazzTeachingSchedules/' + data.id,
    method: 'put',
    data,
  })
// 学员、教员签名
export const postClazzTeachingSchedules = (data) =>
  request({
    url: url + `/clazzTeachingSchedules/${data.id}/sign`,
    method: 'post',
    data,
  })
// 班级获取学员信息
export const getClazzStudents = (params) =>
  request({
    url: url + `/clazzs/${params.id}/students`,
    method: 'get',
    params,
  })
export const getClazzAllStudents = (params) =>
  request({
    url: url + `/clazzs/${params.id}/allStudents`,
    method: 'get',
    params,
  })

// 班级删除学员
export const postClazzStudentsDelete = (data) =>
  request({
    url: url + `/clazzs/${data.id}/deleteStudent`,
    method: 'post',
    data,
  })
// 添加学员
export const postClazzAddStudents = (data) =>
  request({
    url: url + `/clazzs/${data.id}/addStudent`,
    method: 'post',
    data,
  })
// 取最新课号
export const getClazzNumber = (params) =>
  request({
    url: url + '/clazzs/number',
    method: 'get',
    params,
  })
// 获取班级进度
export const clazzTeachSchedule = (params) =>
  request({
    url: url + `/clazzs/${params.id}/clazzTeachSchedule`,
    method: 'get',
    params,
  })

// // 大纲项目
export const getSyllabusItems = (params) =>
  request({
    url: url + '/syllabusItems',
    method: 'get',
    params,
  })
// export const getSyllabusItems = function (params) {
//   const url= '/syllabusItems';
//   return http(url, params, "get", );
// };
export const postSyllabusItems = (data) =>
  request({
    url: url + '/syllabusItems',
    method: 'post',
    data,
  })
export const getSyllabusItemsId = (params) =>
  request({
    url: url + '/syllabusItems/' + params.id,
    method: 'get',
    params,
  })
export const putSyllabusItemsId = (data) =>
  request({
    url: url + '/syllabusItems/' + data.id,
    method: 'put',
    data,
  })
export const deleteSyllabusItemsId = (data) =>
  request({
    url: url + '/syllabusItems/' + data.id,
    method: 'delete',
    data,
  })
export const getSyllabusItemsAll = (params) =>
  request({
    url: url + '/syllabusItems/all',
    method: 'get',
    params,
  })
export const postSyllabusItemsBatchDelete = (data) =>
  request({
    url: url + '/syllabusItems/batchDelete',
    method: 'post',
    data,
  })

/**
 *
 * @param {获取剩余课时击资源列表} params
 * @returns
 */
export const getResourcesCoursewareType = (params) =>
  request({
    url: url + `/syllabusItems/coursewareType/${params.id}`,
    method: 'get',
    params,
  })
/**
 *
 * @param {资源列表} params
 * @returns
 */
export const getResources = (params) =>
  request({
    url: url + '/resources',
    method: 'get',
    params,
  })

// 飞行计划
export const getEvaluations = (params) =>
  request({
    url: url + '/evaluations',
    method: 'get',
    params,
  })
export const postEvaluations = (data) =>
  request({
    url: url + '/evaluations',
    method: 'post',
    data,
  })
export const getEvaluationsId = (params) =>
  request({
    url: url + '/evaluations/' + params.id,
    method: 'get',
    params,
  })
export const putEvaluationsId = (data) =>
  request({
    url: url + '/evaluations/' + data.id,
    method: 'put',
    data,
  })
export const deleteEvaluationsId = (data) =>
  request({
    url: url + '/evaluations/' + data.id,
    method: 'delete',
    data,
  })
export const getEvaluationsAll = (params) =>
  request({
    url: url + '/evaluations/all',
    method: 'get',
    params,
  })
export const postEvaluationsBatchDelete = (data) =>
  request({
    url: url + '/evaluations/batchDelete',
    method: 'post',
    data,
  })

// 学员审核
export const getRegistries = (params) =>
  request({
    url: url + '/registries',
    method: 'get',
    params,
  })
export const postRegistriesApprove = (data) =>
  request({
    url: url + '/registries/approve',
    method: 'post',
    data,
  })
export const getRegistriesAll = (params) =>
  request({
    url: url + '/registries/all',
    method: 'get',
    params,
  })

// 分组
export const getGroupings = (params) =>
  request({
    url: url + '/groupings',
    method: 'get',
    params,
  })
export const postGroupings = (data) =>
  request({
    url: url + '/groupings',
    method: 'post',
    data,
  })
export const putGroupingsId = (data) =>
  request({
    url: url + '/groupings/' + data.id,
    method: 'put',
    data,
  })
export const deleteGroupingsId = (data) =>
  request({
    url: url + '/groupings/' + data.id,
    method: 'delete',
    data,
  })
export const getGroupingsOperateClazzId = (params) =>
  request({
    url: url + '/groupings/operate/' + params.clazzId,
    method: 'get',
    params,
  })
export const postGroupingsOperate = (data) =>
  request({
    url: url + '/groupings/operate',
    method: 'post',
    data,
  })
