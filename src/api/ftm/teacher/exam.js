import http from '@/utils/http'


export const getExamRecords = function (params) {
  const url= '/examRecords';
  return http(url, params, "get", );
};
export const getExamRecordsId = function (params) {
  const url= '/examRecords/{id}';
  return http(url, params, "get_p", );
};
export const putExamRecordsId = function (params) {
  const url= '/examRecords/{id}';
  return http(url, params, "put", );
};
export const getExamRecordsIdQuestions = function (params) {
  const url= '/examRecords/{id}/questions';
  return http(url, params, "get_p", );
};
export const putExamRecordQuestionsId = function (params) {
  const url= '/examRecordQuestions/{id}';
  return http(url, params, "put", 'json', null, null, 5000);
};

// public
export const getPublicCurrentTime = function (params) {
  const url= '/public/currentTime';
  return http(url, params, "get", );
};
