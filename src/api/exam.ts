import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 *
 * @param {
 * 考试 列表
 * }
 */

export const getExamsList = function (params) {
  return request({
    url: url + `/exams`,
    method: 'get',
    params
  })
}

/**
 * @param {
 * 考试 详情
 * }
 */

export const getExamsDetail = function (params) {
  return request({
    url: url + `/exams/${params.id}`,
    method: 'get'
  })
}
/**
 * @param {
 * 考试 修改
 * }
 */
export const putExamId = function (data) {
  return request({
    url: url + `/exams/${data.id}`,
    method: 'put',
    data
  });
};

/**
 * @param {
 * 考试 记录列表
 * }
 */
export const getExamRecords = function (params) {
  return request({
    url: url + `/examRecords`,
    method: 'get',
    params
  });
};
/**
 * @param {
 * 考试 记录详情
 * }
 */
export const getExamRecordsId = function (params) {
  return request({
    url: url + `/examRecords/${params.id}`,
    method: 'get',
    params
  });
};
/**
 * @param {
 * 考试 记录修改
 * }
 */
export const putExamRecordsId = function (data) {
  return request({
    url: url + `/examRecords/${data.id}`,
    method: 'put',
    data
  });
};
/**
 * @param {
 * 考试 记录修改-批量
 * }
 */
export const putExamRecordsBatchUpdate = function (data) {
  return request({
    url: url + `/examRecords/batchUpdate`,
    method: 'put',
    data
  });
};
/**
 * @param {
 * 考试 试题
 * }
 */
export const getExamRecordsIdQuestions = function (params) {
  return request({
    url: url + `/examRecords/${params.id}/questions`,
    method: 'get',
    params
  });
};
/**
 * @param {
 * 考试 试题-重新打分
 * }
 */
export const postExamRecordsIdRetake = function (data) {
  return request({
    url: url + `/examRecords/retake`,
    method: 'post',
    data
  });
};
/**
 * @param {
 * 考试 试题修改
 * }
 */
export const putExamRecordQuestionsId = function (data) {
  return request({
    url: url + `/examRecordQuestions/${data.id}`,
    method: 'put',
    data
  });
};
/**
 * @param {
 * 考试 试题-修改答案
 * }
 */
export const putExamRecordQuestionsUpdateAnswer = function (data) {
  return request({
    url: url + `/examRecordQuestions/updateAnswer`,
    method: 'put',
    data
  });
};
