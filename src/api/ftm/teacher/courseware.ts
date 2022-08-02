import request from '/@/utils/request/index'
import { toExport } from '/@/utils'
const url = import.meta.env.VITE_BASE_API_FTM
// 课件属性
export const getCoursewareProperties = (params) =>
  request({
    url: url + '/coursewareProperties',
    method: 'get',
    params,
  })
export const postCoursewareProperties = (data) =>
  request({
    url: url + '/coursewareProperties',
    method: 'post',
    data,
  })
export const getCoursewarePropertiesId = (params) =>
  request({
    url: url + '/coursewareProperties/' + params.id,
    method: 'get',
    params,
  })
export const putCoursewarePropertiesId = (data) =>
  request({
    url: url + '/coursewareProperties/' + data.id,
    method: 'put',
    data,
  })
export const deleteCoursewarePropertiesId = (data) =>
  request({
    url: url + '/coursewareProperties/' + data.id,
    method: 'delete',
    data,
  })
export const postCoursewarePropertiesBatchDelete = (data) =>
  request({
    url: url + '/coursewareProperties/batchDelete',
    method: 'post',
    data,
  })

// 课件
export const getCoursewares = (params) =>
  request({
    url: url + '/coursewares',
    method: 'get',
    params,
  })
export const deleteCoursewares = (data) =>
  request({
    url: url + '/coursewares/' + data.id,
    method: 'delete',
    data,
  })
export const postCoursewaresBatchDelete = (data) =>
  request({
    url: url + '/coursewares/batchDelete',
    method: 'post',
    data,
  })
export const getCoursewaresAirplaneTypes = (params) =>
  request({
    url: url + '/coursewares/airplaneTypes',
    method: 'get',
    params,
  })
export const getCoursewaresSystemTypes = (params) =>
  request({
    url: url + '/coursewares/systemTypes',
    method: 'get',
    params,
  })
export const postCoursewares = (data) =>
  request({
    url: url + '/coursewares',
    method: 'post',
    data,
  })
export const getCoursewaresId = (params) =>
  request({
    url: url + '/coursewares/' + params.id,
    method: 'get',
    params,
  })
export const postCoursewaresId = (data) =>
  request({
    url: url + '/coursewares/' + data.id,
    method: 'post',
    data,
  })
export const postCoursewaresIdIncreaseReadCount = (data) =>
  request({
    url: url + `/coursewares/${data.id}/increaseReadCount`,
    method: 'post',
    data,
  })
export const postCoursewaresIdPlayProgress = (data) =>
  request({
    url: url + `/coursewares/${data.id}/playProgress`,
    method: 'post',
    data,
  })
export const postCoursewaresIdPlayStart = (data) =>
  request({
    url: url + `/coursewares/${data.id}/playStart`,
    method: 'post',
    data,
  })
export const postCoursewareModifyPublic = (data) =>
  request({
    url: url + '/coursewares/modifyPublic',
    method: 'post',
    data,
  })
export const postCoursewareModifyApproval = (data) =>
  request({
    url: url + '/coursewares/modifyApproval',
    method: 'post',
    data,
  })
/**
 *
 * @param {指定课件位置} params
 * @returns
 */
export const postCoursewaresUpdateSeqNo = (data) =>
  request({
    url: url + '/coursewares/updateSeqNo',
    method: 'post',
    data,
  })

// 课件评论
export const getCoursewareComments = (params) =>
  request({
    url: url + '/coursewareComments',
    method: 'get',
    params,
  })
export const postCoursewareComments = (data) =>
  request({
    url: url + '/coursewareComments',
    method: 'post',
    data,
  })
export const deleteCoursewareCommentsId = (data) =>
  request({
    url: url + '/coursewareComments/' + data.id,
    method: 'delete',
    data,
  })

// 课件回复
export const getCoursewareReplys = (params) =>
  request({
    url: url + '/coursewareReplys',
    method: 'get',
    params,
  })
export const deleteCoursewareReplysId = (data) =>
  request({
    url: url + '/coursewareReplys/' + data.id,
    method: 'delete',
    data,
  })
export const postCoursewareReplysComment = (data) =>
  request({
    url: url + '/coursewareReplys/comment',
    method: 'post',
    data,
  })
export const postCoursewareReplysReply = (data) =>
  request({
    url: url + '/coursewareReplys/reply',
    method: 'post',
    data,
  })

// 课件点赞
export const postCoursewareLikesIdComment = (data) =>
  request({
    url: url + `/coursewareLikes/${data.sourceId}/comment`,
    method: 'post',
    data,
  })
export const postCoursewareLikesIdReply = (data) =>
  request({
    url: url + `/coursewareLikes/${data.sourceId}/reply`,
    method: 'post',
    data,
  })

// 课件指派
export const getCoursewareAssignments = (params) =>
  request({
    url: url + '/coursewareAssignments',
    method: 'get',
    params,
  })
export const postCoursewareAssignments = (data) =>
  request({
    url: url + '/coursewareAssignments',
    method: 'post',
    data,
  })
export const getCoursewareAssignmentsId = (params) =>
  request({
    url: url + '/coursewareAssignments/' + params.id,
    method: 'get',
    params,
  })
export const deleteCoursewareAssignmentsId = (data) =>
  request({
    url: url + '/coursewareAssignments/' + data.id,
    method: 'delete',
    data,
  })

// 课件评审申请
export const getCoursewareApprovalRequests = (params) =>
  request({
    url: url + '/coursewareApprovalRequests',
    method: 'get',
    params,
  })
export const postCoursewareApprovalRequests = (data) =>
  request({
    url: url + '/coursewareApprovalRequests',
    method: 'post',
    data,
  })
export const putCoursewareApprovalRequestsIdApprove = (data) =>
  request({
    url: url + `/coursewareApprovalRequests/${data.id}/approve`,
    method: 'put',
    data,
  })
export const putCoursewareApprovalRequestsIdReject = (data) =>
  request({
    url: url + `/coursewareApprovalRequests/${data.id}/reject`,
    method: 'put',
    data,
  })
export const postCoursewareApprovalRequestsBatch = (data) =>
  request({
    url: url + '/coursewareApprovalRequests/batch',
    method: 'post',
    data,
  })

// 课件评审
export const getCoursewareApprovals = (params) =>
  request({
    url: url + '/coursewareApprovals',
    method: 'get',
    params,
  })
export const getCoursewareApprovalId = (params) =>
  request({
    url: url + `/coursewareApprovals/${params.id}`,
    method: 'get',
    params,
  })
export const deleteCoursewareApprovals = (data) =>
  request({
    url: url + '/coursewareApprovals/' + data.id,
    method: 'delete',
    data,
  })
export const putCoursewareApprovalIdApprove = (data) =>
  request({
    url: url + `/coursewareApprovals/${data.id}/approve`,
    method: 'put',
    data,
  })
export const putCoursewareApprovalIdReject = (data) =>
  request({
    url: url + `/coursewareApprovals/${data.id}/reject`,
    method: 'put',
    data,
  })

// 课件指派阅读记录
export const getCoursewareAssignmentReadRecords = (params) =>
  request({
    url: url + '/coursewareAssignmentReadRecords',
    method: 'get',
    params,
  })
export const getCousewareAssignmentReadRecordDetail = (params) =>
  request({
    url: url + `/coursewareAssignmentReadRecords/${params.id}`,
    method: 'get',
    params,
  })
export const deleteCoursewareAssignmentReadRecordsId = (data) =>
  request({
    url: url + `/coursewareAssignmentReadRecords/${data.id}`,
    method: 'delete',
    data,
  })
// 课件指派阅读记录 导出
export const coursewareExport = (data) =>
  request({
    url: url + '/coursewareAssignmentReadRecords/export',
    method: 'post',
    responseType: 'blob',
    data,
  })
    .then(async (res) => {
      await toExport(res)
      Promise.resolve(res)
    })
    .catch((e) => {
      Promise.reject(e)
    })

// 课件阅读记录
export const getCoursewareReadRecords = (params) =>
  request({
    url: url + '/coursewareReadRecords',
    method: 'get',
    params,
  })

// 课件评审结果
export const putCoursewareApprovalResultsIdApprove = (data) =>
  request({
    url: url + `/coursewareApprovalResults/${data.id}/approve`,
    method: 'put',
    data,
  })
export const putCoursewareApprovalResultsIdReject = (data) =>
  request({
    url: url + `/coursewareApprovalResults/${data.id}/reject`,
    method: 'put',
    data,
  })
// 被指派人查看
export const getCoursewareByAssignee = (params) =>
  request({
    url: url + '/coursewareAssignmentReadRecords/byAssignee',
    method: 'get',
    params,
  })
