import http from '@/utils/http'

// 课程大纲
export const getSyllabuses = function (params) {
  const url= '/syllabuses';
  return http(url, params, "get", );
};
export const postSyllabuses = function (params) {
  const url= '/syllabuses';
  return http(url, params, "post", );
};
export const getSyllabusesId = function (params) {
  const url= '/syllabuses/{id}';
  return http(url, params, "get_p", );
};
export const putSyllabusesId = function (params) {
  const url= '/syllabuses/{id}';
  return http(url, params, "put", );
};
export const deleteSyllabusesId = function (params) {
  const url= '/syllabuses/{id}';
  return http(url, params, "delete", );
};
export const getSyllabusesAll = function (params) {
  const url= '/syllabuses/all';
  return http(url, params, "get", );
};
export const postSyllabusesBatchDelete = function (params) {
  const url= '/syllabuses/batchDelete';
  return http(url, params, "post", );
};







// 班级
export const getClazzs = function (params) {
  const url= '/clazzs';
  return http(url, params, "get", );
};
export const postClazzs = function (params) {
  const url= '/clazzs';
  return http(url, params, "post", );
};
export const getClazzsId = function (params) {
  const url= '/clazzs/{id}';
  return http(url, params, "get_p", );
};
export const putClazzsId = function (params) {
  const url= '/clazzs/{id}';
  return http(url, params, "put", );
};
export const deleteClazzsId = function (params) {
  const url= '/clazzs/{id}';
  return http(url, params, "delete", );
};
export const getClazzsAll = function (params) {
  const url= '/clazzs/all';
  return http(url, params, "get", );
};
export const postClazzsBatchDelete = function (params) {
  const url= '/clazzs/batchDelete';
  return http(url, params, "post", );
};
// 班级课程进度表
export const getClazzTeachingSchedules = function (params) {
  const url= '/clazzTeachingSchedules';
  return http(url, params, "get", );
};
// 修改
export const putClazzTeachingSchedules = function (params) {
  const url= '/clazzTeachingSchedules/{id}';
  return http(url, params, "put", );
};
// 学员、教员签名
export const postClazzTeachingSchedules = function (params) {
  const url= '/clazzTeachingSchedules/{id}/sign';
  return http(url, params, "post", );
};
// 班级获取学员信息
export function getClazzStudents(params){
  return http('/clazzs/{id}/students',params,'get_p')
}
export function getClazzAllStudents(params) {
  return http('/clazzs/{id}/allStudents',params,'get_p')
}

// 班级删除学员
export function postClazzStudentsDelete(params){
  return http('/clazzs/{id}/deleteStudent', params, 'post')
}
// 添加学员
export function postClazzAddStudents(params){
  return http('/clazzs/{id}/addStudent', params, 'post')
}
// 取最新课号
export function getClazzNumber(params){
  return http('/clazzs/number', params, 'get')
}
// 获取班级进度
export function clazzTeachSchedule(params){
  return http('/clazzs/{id}/clazzTeachSchedule',params,'get_p')
}

// // 大纲项目
/**
 * 
 * @param {理论训练内容列表} params 
 * @returns 
 */
 export const getSyllabusItems = function (params) {
  const url= '/syllabusItems';
  return http(url, params, "get", );
};
// export const getSyllabusItems = function (params) {
//   const url= '/syllabusItems';
//   return http(url, params, "get", );
// };
export const postSyllabusItems = function (params) {
  const url= '/syllabusItems';
  return http(url, params, "post", );
};
export const getSyllabusItemsId = function (params) {
  const url= '/syllabusItems/{id}';
  return http(url, params, "get_p", );
};
export const putSyllabusItemsId = function (params) {
  const url= '/syllabusItems/{id}';
  return http(url, params, "put", );
};
export const deleteSyllabusItemsId = function (params) {
  const url= '/syllabusItems/{id}';
  return http(url, params, "delete", );
};
export const getSyllabusItemsAll = function (params) {
  const url= '/syllabusItems/all';
  return http(url, params, "get", );
};
export const postSyllabusItemsBatchDelete = function (params) {
  const url= '/syllabusItems/batchDelete';
  return http(url, params, "post", );
};

/**
 * 
 * @param {获取剩余课时击资源列表} params 
 * @returns 
 */
 export const getResourcesCoursewareType = function (params) {
  const url= `/syllabusItems/coursewareType/${params.id}`;
  return http(url, undefined, "get", );
};
/**
 * 
 * @param {资源列表} params 
 * @returns 
 */
 export const getResources = function (params) {
  const url= '/resources';
  return http(url, params, "get", );
};



// 飞行计划
export const getEvaluations = function (params) {
  const url= '/evaluations';
  return http(url, params, "get", );
};
export const postEvaluations = function (params) {
  const url= '/evaluations';
  return http(url, params, "post", );
};
export const getEvaluationsId = function (params) {
  const url= '/evaluations/{id}';
  return http(url, params, "get_p", );
};
export const putEvaluationsId = function (params) {
  const url= '/evaluations/{id}';
  return http(url, params, "put", );
};
export const deleteEvaluationsId = function (params) {
  const url= '/evaluations/{id}';
  return http(url, params, "delete", );
};
export const getEvaluationsAll = function (params) {
  const url= '/evaluations/all';
  return http(url, params, "get", );
};
export const postEvaluationsBatchDelete = function (params) {
  const url= '/evaluations/batchDelete';
  return http(url, params, "post", );
};

// 学员审核
export const getRegistries = function (params) {
  const url= '/registries';
  return http(url, params, "get", );
};
export const postRegistriesApprove = function (params) {
  const url= '/registries/approve';
  return http(url, params, "post", );
};
export const getRegistriesAll = function (params) {
  const url= '/registries/all';
  return http(url, params, "get", );
};

// 分组
export const getGroupings = function (params) {
  const url= '/groupings';
  return http(url, params, "get", );
};
export const postGroupings = function (params) {
  const url= '/groupings';
  return http(url, params, "post", );
};
export const putGroupingsId = function (params) {
  const url= '/groupings/{id}';
  return http(url, params, "put", );
};
export const deleteGroupingsId = function (params) {
  const url= '/groupings/{id}';
  return http(url, params, "delete", );
};
export const getGroupingsOperateClazzId = function (params) {
  const url= '/groupings/operate/{clazzId}';
  return http(url, params, "get_p", );
};
export const postGroupingsOperate = function (params) {
  const url= '/groupings/operate';
  return http(url, params, "post", );
};
