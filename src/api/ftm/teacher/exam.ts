import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM

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
export const putExamRecordQuestionsId = (data) =>
  request({
    url: url + '/examRecordQuestions/' + data.id,
    method: 'put',
    data,
  })

// public
export const getPublicCurrentTime = (params) =>
  request({
    url: url + '/public/currentTime',
    method: 'get',
    params,
  })
