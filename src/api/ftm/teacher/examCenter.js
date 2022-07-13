import http from '@/utils/http'

// 题库配置
export const getQuestionBankProperties = function (params) {
  const url= '/questionBankProperties';
  return http(url, params, "get", );
};
export const postQuestionBankProperties = function (params) {
  const url= '/questionBankProperties';
  return http(url, params, "post", );
};
export const getQuestionBankPropertiesId = function (params) {
  const url= '/questionBankProperties/{id}';
  return http(url, params, "get_p", );
};
export const putQuestionBankPropertiesId = function (params) {
  const url= '/questionBankProperties/{id}';
  return http(url, params, "put", );
};
export const deleteQuestionBankPropertiesId = function (params) {
  const url= '/questionBankProperties/{id}';
  return http(url, params, "delete", );
};
export const getQuestionBankPropertiesAll = function (params) {
  const url= '/questionBankProperties/all';
  return http(url, params, "get", );
};

// 题库目录
export const getQuestionBanks = function (params) {
  const url= '/questionBanks';
  return http(url, params, "get", );
};
export const postQuestionBanks = function (params) {
  const url= '/questionBanks';
  return http(url, params, "post", );
};
export const getQuestionBanksId = function (params) {
  const url= '/questionBanks/{id}';
  return http(url, params, "get_p", );
};
export const putQuestionBanksId = function (params) {
  const url= '/questionBanks/{id}';
  return http(url, params, "put", );
};
export const deleteQuestionBanksId = function (params) {
  const url= '/questionBanks/{id}';
  return http(url, params, "delete", );
};
export const getQuestionBanksAll = function (params) {
  const url= '/questionBanks/all';
  return http(url, params, "get", );
};
export const postQuestionBanksBatchDelete = function (params) {
  const url= '/questionBanks/batchDelete';
  return http(url, params, "post", );
};
export const getQuestionBanksBatchDeleteImport = function (params) {
  const url= '/questionBanks/questionImport';
  return http(url, params, "get", 'json', 1);
};
export function getQuestionBanksMove(params){
  return http('/questionBanks/moveTeacherQuestion', params, 'post')
}
export function exportQuestionBanks(params){
  return http('/questionBanks/{id}/questionExport', params, 'post', 'json', 1)
}
// 获取题库题目统计信息
export const getQuestionBanksStats = function (params) {
  const url= '/questionBanks/stats';
  return http(url, params, "get", );
};

// 获取章节信息
export const getQuestionBanksChapters = function (params) {
  const url= '/questionBanks/chapters';
  return http(url, params, "get", );
};

// 试题
export const getQuestions = function (params) {
  const url= '/questions';
  return http(url, params, "get", );
};
export const postQuestions = function (params) {
  const url= '/questions';
  return http(url, params, "post", );
};
export const getQuestionsId = function (params) {
  const url= '/questions/{id}';
  return http(url, params, "get_p", );
};
export const putQuestionsId = function (params) {
  const url= '/questions/{id}';
  return http(url, params, "put", );
};
export const deleteQuestionsId = function (params) {
  const url= '/questions/{id}';
  return http(url, params, "delete", );
};
export const postQuestionsBatchDelete = function (params) {
  const url= '/questions/batchDelete';
  return http(url, params, "post", );
};

// 考试配置
export const getExamTypes = function (params) {
  const url= '/examTypes';
  return http(url, params, "get", );
};
export const postExamTypes = function (params) {
  const url= '/examTypes';
  return http(url, params, "post", );
};
export const getExamTypesId = function (params) {
  const url= '/examTypes/{id}';
  return http(url, params, "get_p", );
};
export const putExamTypesId = function (params) {
  const url= '/examTypes/{id}';
  return http(url, params, "put", );
};
export const deleteExamTypesId = function (params) {
  const url= '/examTypes/{id}';
  return http(url, params, "delete", );
};
export const getExamTypesAll = function (params) {
  const url= '/examTypes/all';
  return http(url, params, "get", );
};
export const postExamTypesBatchDelete = function (params) {
  const url= '/examTypes/batchDelete';
  return http(url, params, "post", );
};

// 考试管理
export const getExams = function (params) {
  const url= '/exams';
  return http(url, params, "get", );
};
export const postExams = function (params) {
  const url= '/exams';
  return http(url, params, "post", );
};
export const getExamsId = function (params) {
  const url= '/exams/{id}';
  return http(url, params, "get_p", );
};
export const putExamsId = function (params) {
  const url= '/exams/{id}';
  return http(url, params, "put", );
};
export const deleteExamsId = function (params) {
  const url= '/exams/{id}';
  return http(url, params, "delete", );
};
export const getExamsIdQuestions = function (params) {
  const url= '/exams/{id}/questions';
  return http(url, params, "get_p", );
};
export const getExamsAll = function (params) {
  const url= '/exams/all';
  return http(url, params, "get", );
};
export const postExamsBatchDelete = function (params) {
  const url= '/exams/batchDelete';
  return http(url, params, "post", );
};
export const getExamsStudentImport = function (params) {
  const url= '/exams/studentImport';
  return http(url, params, "get", 'json', 1);
};
export const postExamsStudentImport = function (params) {
  const url= '/exams/studentImport';
  return http(url, params, "post", );
};
export const getExamsIdStudentExportInline= function (params) {
  const url= '/exams/{id}/studentExport/inline';
  return http(url, params, "get_p", 'json', 1);
};
export const postExamsExport = function (params) {
  const url= '/exams/export';
  return http(url, params, "post", "json", 1);
};

export const getListByexamType = function (params) {
  const url= '/exams/stats/examType';
  return http(url, params, "get", );
};
export const getExamsExam = function (params) {
  const url= 'exams/stats/exam';
  return http(url, params, "get", );
};


// 考试记录
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

export function postExamRecordsSign(params){
  return http('/examRecords/signature', params, 'post')
}
export const exportExamRecords = function (params) {
  const url= '/examRecords/export';
  return http(url, params, "get", "json", 1 );
};


// 考试记录试题
export const getExamRecordQuestions = function (params) {
  const url= '/examRecordQuestions';
  return http(url, params, "get", );
};
export const getExamRecordQuestionsId = function (params) {
  const url= '/examRecordQuestions/{id}';
  return http(url, params, "get_p", );
};
export const putExamRecordQuestionsId = function (params) {
  const url= '/examRecordQuestions/{id}';
  return http(url, params, "put", );
};
export const getExamRecordQuestionsStats = function (params) {
  const url= '/examRecordQuestions/stats';
  return http(url, params, "get", );
};
// 题目章节
export const questionChapters = function (params) {
  const url= '/questionChapters';
  return http(url, params, "get", );
};
export const questionChaptersPost = function (params) {
  const url= '/questionChapters';
  return http(url, params, "post", );
};
export function questionChaptersGet(params){
  return http('/questionChapters/{id}', params, 'get_p')
}
export function questionChaptersPut(params){
  return http('/questionChapters/{id}', params, 'put')
}
export function questionChaptersDel(params){
  return http('/questionChapters/{id}', params, 'delete')
}

// 试题难度
export const questionDifficultiesGet = function (params) {
  const url= '/questionDifficulties/';
  return http(url, params, "get", );
};
export function questionDifficultiesPut(params){
  return http('/questionDifficulties/', params, 'put')
}

// 考试模板
export function getExamTemplate(params){
  return http('/examTemplates', params, 'get')
}
export function postExamTemplate(params){
  return http('/examTemplates', params, 'post')
}
export function getpExamTemplate(params){
  return http('/examTemplates/{id}', params, 'get_p')
}
export function putExamTemplate(params){
  return http('/examTemplates/{id}', params, 'put')
}
export function delExamTemplate(params){
  return http('/examTemplates/{id}', params, 'delete')
}
export function postDelExamTemplate(params){
  return http('/examTemplates/batchDelete', params, 'post')
}