import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM
const pubUrl = import.meta.env.VITE_BASE_API_PUB
/**
 * 通知消息列表
 */
export const getNotice = (params) =>
  request({
    url: url + '/announcements',
    method: 'get',
    params,
  })

/**
 * 添加通知
 */
export const addNotice = (data) =>
  request({
    url: url + '/announcements',
    method: 'post',
    data,
  })

/**
 * 通知详情
 */
export const getNoticeDetails = (params) =>
  request({
    url: url + '/announcements/' + params.id,
    method: 'get',
    params,
  })

/**
 * 删除通知
 */
export const delNotice = ({ id }) =>
  id instanceof Array
    ? request({
        url: url + '/announcements/batchDelete',
        method: 'post',
        data: { ids: id },
      })
    : request({
        url: url + `/announcements/${id}`,
        method: 'delete',
      })

/**
 * 获取教员列表
 */
export const getTeachers = () =>
  request({
    url: url + '/employees',
    method: 'get',
    params: { size: 1000 },
  })
export const getEmployees = (params) =>
  request({
    url: url + '/employees',
    method: 'get',
    params,
  })

/**
 * 获取学员列表
 */
export const getStudents = (params) =>
  request({
    url: url + '/students',
    params: {
      ...{ size: 1000 },
      ...params,
    },
  })
/**
 * 获取班级列表
 */
export const getClazz = () =>
  request({
    url: url + '/clazzs',
    method: 'get',
    params: { size: 1000, type: 'WET_LEASE' },
  })

/**
 * 上传文件
 */
export const uploadFile = (formData) =>
  request({
    url: pubUrl + '/files/upload',
    method: 'post',
    header: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  })
/**
 * 获取证书列表
 */
export const getEmployeeQualifications = (params) =>
  request({
    url: url + '/employeeQualifications',
    method: 'get',
    params,
  })
/**
 * 新增证照
 */

export const postEmployeeQualifications = (data) =>
  request({
    url: url + '/employeeQualifications',
    method: 'post',
    data,
  })
/**
 * 修改证照
 */

export const putEmployeeQualifications = (data) =>
  request({
    url: url + '/employeeQualifications/' + data.id,
    method: 'put',
    data,
  })
/**
 * 删除
 */

export const deleteEmployeeQualifications = (data) =>
  request({
    url: url + '/employeeQualifications/' + data.id,
    method: 'delete',
    data,
  })
/**
 * 详情
 */

export const getEmployeeQualificationsId = (params) =>
  request({
    url: url + `/employeeQualifications/${params.id}`,
    method: 'get',
    params,
  })
/**
 * 资质管理
 */
export const getEmployeeQualificationsLicense = (params) =>
  request({
    url: url + '/employeeQualifications/license',
    method: 'get',
    params,
  })
/**
 * 保存
 */

export const getEmployeeQualificationsSava = (data) =>
  request({
    url: url + '/employeeQualifications/sava',
    method: 'post',
    data,
  })

/**
 * 获取问卷
 */
export const getQuestionnaires = (params) =>
  request({
    url: url + '/questionnaires',
    method: 'get',
    params,
  })
/**
 * 删除问卷
 */
export const delQuestionnaires = (data) =>
  request({
    url: url + '/questionnaires/' + data.id,
    method: 'delete',
    data,
  })
/**
 * 删除问卷（多选）
 */
export const delQuestionnairesAll = (data) =>
  request({
    url: url + '/questionnaires/batchDelete',
    method: 'post',
    data,
  })

/**
 * 新增问卷
 */
export const addQuestionnaires = (data) =>
  request({
    url: url + '/questionnaires',
    method: 'post',
    data,
  })

/**
 * 获取问卷信息
 */
export const getQuestionnairesInfo = (params) =>
  request({
    url: url + '/questionnaires/' + params.id,
    method: 'get',
    params,
  })

/**
 * 修改问卷信息
 */
export const infoQuestionnaires = (data) =>
  request({
    url: url + '/questionnaires/' + data.id,
    method: 'put',
    data,
  })

/**
 * 新增问卷模板
 */
export const addQuestionnairesTemplate = (data) =>
  request({
    url: url + '/qTemplates',
    method: 'post',
    data,
  })
/**
 * 修改问卷模板
 */
export const infoQuestionnairesTemplate = (data) =>
  request({
    url: url + '/qTemplates/' + data.id,
    method: 'put',
    data,
  })

/**
 * 查询问卷模板内容
 */
export const getQuestionnairesTemplate = (params) =>
  request({
    url: url + '/qTemplates/' + params.id,
    method: 'get',
    params,
  })

/**
 * 查询问卷模板列表
 */
export const getTemplate = (params) =>
  request({
    url: url + '/qTemplates',
    method: 'get',
    params,
  })

/**
 * 删除问卷模板
 */
export const deleteTemplate = (data) =>
  request({
    url: url + '/qTemplates/' + data.id,
    method: 'delete',
    data,
  })

/**
 * 学员获取教学任务
 */
export const getMessage = (params) =>
  request({
    url: url + '/messages',
    method: 'get',
    params,
  })

/**
 * 教学任务详情
 */
export const postMessage = (params) =>
  request({
    url: url + '/messages/' + params.id,
    method: 'get',
    params,
  })

/**
 * 教学任务已读
 */
export const putMessage = (data) =>
  request({
    url: url + '/messages/' + data.id,
    method: 'put',
    data,
  })
