import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

// 题库配置
export const getQuestionBankProperties = (params) =>
  request({
    url: url + '/questionBankProperties',
    method: 'get',
    params,
  })
export const postQuestionBankProperties = (data) =>
  request({
    url: url + '/questionBankProperties',
    method: 'post',
    data,
  })
export const getQuestionBankPropertiesId = (params) =>
  request({
    url: url + '/questionBankProperties/' + params.id,
    method: 'get',
    params,
  })
export const putQuestionBankPropertiesId = (data) =>
  request({
    url: url + '/questionBankProperties/' + data.id,
    method: 'put',
    data,
  })
export const deleteQuestionBankPropertiesId = (data) =>
  request({
    url: url + '/questionBankProperties/' + data.id,
    method: 'delete',
    data,
  })
export const getQuestionBankPropertiesAll = (params) =>
  request({
    url: url + '/questionBankProperties/all',
    method: 'get',
    params,
  })

// 题库目录
export const getQuestionBanks = (params) =>
  request({
    url: url + '/questionBanks',
    method: 'get',
    params,
  })
export const postQuestionBanks = (data) =>
  request({
    url: url + '/questionBanks',
    method: 'post',
    data,
  })
export const getQuestionBanksId = (params) =>
  request({
    url: url + '/questionBanks/' + params.id,
    method: 'get',
    params,
  })
export const putQuestionBanksId = (data) =>
  request({
    url: url + '/questionBanks/' + data.id,
    method: 'put',
    data,
  })
export const deleteQuestionBanksId = (data) =>
  request({
    url: url + '/questionBanks/' + data.id,
    method: 'delete',
    data,
  })
export const getQuestionBanksAll = (params) =>
  request({
    url: url + '/questionBanks/all',
    method: 'get',
    params,
  })
export const postQuestionBanksBatchDelete = (data) =>
  request({
    url: url + '/questionBanks/batchDelete',
    method: 'post',
    data,
  })
export const getQuestionBanksBatchDeleteImport = (params) =>
  request({
    url: url + '/questionBanks/questionImport',
    method: 'get',
    params,
  })
export const getQuestionBanksMove = (data) =>
  request({
    url: url + '/questionBanks/moveTeacherQuestion',
    method: 'post',
    data,
  })
export const exportQuestionBanks = (data) =>
  request({
    url: url + `/questionBanks/${data.id}/questionExport`,
    method: 'post',
    data,
  })
// 获取题库题目统计信息
export const getQuestionBanksStats = (params) =>
  request({
    url: url + '/questionBanks/stats',
    method: 'get',
    params,
  })

// 获取章节信息
export const getQuestionBanksChapters = (params) =>
  request({
    url: url + '/questionBanks/chapters',
    method: 'get',
    params,
  })

// 试题
export const getQuestions = (params) =>
  request({
    url: url + '/questions',
    method: 'get',
    params,
  })
export const postQuestions = (data) =>
  request({
    url: url + '/questions',
    method: 'post',
    data,
  })
export const getQuestionsId = (params) =>
  request({
    url: url + '/questions/' + params.id,
    method: 'get',
    params,
  })
export const putQuestionsId = (data) =>
  request({
    url: url + '/questions/' + data.id,
    method: 'put',
    data,
  })
export const deleteQuestionsId = (data) =>
  request({
    url: url + '/questions/' + data.id,
    method: 'delete',
    data,
  })
export const postQuestionsBatchDelete = (data) =>
  request({
    url: url + '/questions/batchDelete',
    method: 'post',
    data,
  })

// 考试配置
export const getExamTypes = (params) =>
  request({
    url: url + '/examTypes',
    method: 'get',
    params,
  })
export const postExamTypes = (data) =>
  request({
    url: url + '/examTypes',
    method: 'post',
    data,
  })
export const getExamTypesId = (params) =>
  request({
    url: url + '/examTypes/' + params.id,
    method: 'get',
    params,
  })
export const putExamTypesId = (data) =>
  request({
    url: url + '/examTypes/' + data.id,
    method: 'put',
    data,
  })
export const deleteExamTypesId = (data) =>
  request({
    url: url + '/examTypes/' + data.id,
    method: 'delete',
    data,
  })
export const getExamTypesAll = (params) =>
  request({
    url: url + '/examTypes/all',
    method: 'get',
    params,
  })
export const postExamTypesBatchDelete = (data) =>
  request({
    url: url + '/examTypes/batchDelete',
    method: 'post',
    data,
  })

// 考试管理
export const getExams = (params) =>
  request({
    url: url + '/exams',
    method: 'get',
    params,
  })
export const postExams = (data) =>
  request({
    url: url + '/exams',
    method: 'post',
    data,
  })
export const getExamsId = (params) =>
  request({
    url: url + '/exams/' + params.id,
    method: 'get',
    params,
  })
export const putExamsId = (data) =>
  request({
    url: url + '/exams/' + data.id,
    method: 'put',
    data,
  })
export const deleteExamsId = (data) =>
  request({
    url: url + '/exams/' + data.id,
    method: 'delete',
    data,
  })
export const getExamsIdQuestions = (params) =>
  request({
    url: url + `/exams/${params.id}/questions`,
    method: 'get',
    params,
  })
export const getExamsAll = (params) =>
  request({
    url: url + '/exams/all',
    method: 'get',
    params,
  })
export const postExamsBatchDelete = (data) =>
  request({
    url: url + '/exams/batchDelete',
    method: 'post',
    data,
  })
export const getExamsStudentImport = (params) =>
  request({
    url: url + '/exams/studentImport',
    method: 'get',
    params,
  })
export const postExamsStudentImport = (data) =>
  request({
    url: url + '/exams/studentImport',
    method: 'post',
    data,
  })
export const getExamsIdStudentExportInline = (params) =>
  request({
    url: url + `/exams/${params.id}/studentExport/inline`,
    method: 'get',
    params,
  })
export const postExamsExport = (data) =>
  request({
    url: url + '/exams/export',
    method: 'post',
    data,
  })

export const getListByexamType = (params) =>
  request({
    url: url + '/exams/stats/examType',
    method: 'get',
    params,
  })
export const getExamsExam = (params) =>
  request({
    url: url + 'exams/stats/exam',
    method: 'get',
    params,
  })

// 考试记录
export const getExamRecords = (params) =>
  request({
    url: url + '/examRecords',
    method: 'get',
    params,
  })
export const getExamRecordsId = (params) =>
  request({
    url: url + '/examRecords/' + params.id,
    method: 'get',
    params,
  })
export const putExamRecordsId = (data) =>
  request({
    url: url + '/examRecords/' + data.id,
    method: 'put',
    data,
  })
export const getExamRecordsIdQuestions = (params) =>
  request({
    url: url + `/examRecords/${params.id}/questions`,
    method: 'get',
    params,
  })

export const postExamRecordsSign = (data) =>
  request({
    url: url + '/examRecords/signature',
    method: 'post',
    data,
  })
export const exportExamRecords = (params) =>
  request({
    url: url + '/examRecords/export',
    method: 'get',
    params,
  })

// 考试记录试题
export const getExamRecordQuestions = (params) =>
  request({
    url: url + '/examRecordQuestions',
    method: 'get',
    params,
  })
export const getExamRecordQuestionsId = (params) =>
  request({
    url: url + '/examRecordQuestions/' + params.id,
    method: 'get',
    params,
  })
export const putExamRecordQuestionsId = (data) =>
  request({
    url: url + '/examRecordQuestions/' + data.id,
    method: 'put',
    data,
  })
export const getExamRecordQuestionsStats = (params) =>
  request({
    url: url + '/examRecordQuestions/stats',
    method: 'get',
    params,
  })
// 题目章节
export const questionChapters = (params) =>
  request({
    url: url + '/questionChapters',
    method: 'get',
    params,
  })
export const questionChaptersPost = (data) =>
  request({
    url: url + '/questionChapters',
    method: 'post',
    data,
  })
export const questionChaptersGet = (params) =>
  request({
    url: url + '/questionChapters/' + params.id,
    method: 'get',
    params,
  })
export const questionChaptersPut = (data) =>
  request({
    url: url + '/questionChapters/' + data.id,
    method: 'put',
    data,
  })
export const questionChaptersDel = (data) =>
  request({
    url: url + '/questionChapters/' + data.id,
    method: 'delete',
    data,
  })

// 试题难度
export const questionDifficultiesGet = (params) =>
  request({
    url: url + '/questionDifficulties/',
    method: 'get',
    params,
  })

export const questionDifficultiesPut = (data) =>
  request({
    url: url + '/questionDifficulties/',
    method: 'put',
    data,
  })

// 考试模板
export const getExamTemplate = (params) =>
  request({
    url: url + '/examTemplates',
    method: 'get',
    params,
  })
export const postExamTemplate = (data) =>
  request({
    url: url + '/examTemplates',
    method: 'post',
    data,
  })
export const getpExamTemplate = (params) =>
  request({
    url: url + '/examTemplates/' + params.id,
    method: 'get',
    params,
  })
export const putExamTemplate = (data) =>
  request({
    url: url + '/examTemplates/' + data.id,
    method: 'put',
    data,
  })
export const delExamTemplate = (data) =>
  request({
    url: url + '/examTemplates/' + data.id,
    method: 'delete',
    data,
  })
export const postDelExamTemplate = (data) =>
  request({
    url: url + '/examTemplates/batchDelete',
    method: 'post',
    data,
  })
