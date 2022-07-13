import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM
/**
 * 课程配置类型
 */
// 分页列表
export const getCourseClassifies = (params) =>
  request({
    url: url + '/courseClassifies',
    method: 'get',
    params,
  })
// 新增
export const postCourseClassifies = (data) =>
  request({
    url: url + '/courseClassifies',
    method: 'post',
    data,
  })
// 批量删除
export const batchDeleteCourseClassifies = (data) =>
  request({
    url: url + '/courseClassifies/batchDelete',
    method: 'post',
    data,
  })
// 详情
export const getCourseClassifiesDetail = (params) =>
  request({
    url: url + `/courseClassifies/${params.id}`,
    method: 'get',
    params,
  })
// 修改
export const putCourseClassifies = (data) =>
  request({
    url: url + `/courseClassifies/${data.id}`,
    method: 'put',
    data,
  })
// 删除
export const deleteCourseClassifies = (data) =>
  request({
    url: url + `/courseClassifies/${data.id}`,
    method: 'delete',
    data,
  })
