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
 * 公告阅读记录
 */
export const getNoticeReadRecord = (params) =>
  request({
    url: url + '/announcements/readRecord',
    method: 'get',
    params,
  })

/**
 * 公告阅读记录导出
 */
export const postNoticeReadRecordExport = (data) =>
  request({
    url: url + `/announcements/${data.id}/readRecordExport`,
    method: 'post',
    responseType: 'blob',
    data,
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
 * 获取全部签名历史
 */
export const allsignatureHistory = (params) =>
  request({
    url: url + '/employees/signatureHistory',
    method: 'get',
    params,
  })
/**
 * 获取单人全部签名历史
 */
export const signatureHistory = (data) =>
  request({
    url: url + `/employees/${data.userId}/signatureHistory`,
    method: 'post',
    data,
  })

/**
 * 获取学员列表
 */
export const getStudents = (params) =>
  request({
    url: url + `/clazzs/${params.id}/students`,
    method: 'get',
    params,
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

// 资质管理列表
export const getEmployeeQualificationsLicenses = (params) =>
  request({
    url: url + '/employeeQualifications/licenses',
    method: 'get',
    params,
  })

/**
 * 获取问卷
 * @param {
 *  filialeId: 分公司Id
 *  order: 排序方向
 *  page: 当前页,默认为1
 *  searchKey: 模糊匹配搜索
 *  size: 每页数量,默认为10
 *  sort: 排序参数,默认为id
 *  status: 状态
 *  type: 类型
 * }
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

//  教员进度设置
export const teachScheduleSettings = (params) =>
  request({
    url: url + '/teachScheduleSettings',
    method: 'get',
    params,
  })
export const teachScheduleSettingsPut = (data) =>
  request({
    url: url + '/teachScheduleSettings/' + data.id,
    method: 'put',
    data,
  })

/**中心资质 */
// 分页列表
export const getCenterQualifications = (params) =>
  request({
    url: url + '/centerQualifications',
    method: 'get',
    params,
  })
// 新增
export const postCenterQualification = (data) =>
  request({
    url: url + '/centerQualifications',
    method: 'post',
    data,
  })
// 详情
export const getCenterQualificationsDetail = (params) =>
  request({
    url: url + '/centerQualifications/' + params.id,
    method: 'get',
    params,
  })
// 修改
export const putCenterQualification = (data) =>
  request({
    url: url + '/centerQualifications/' + data.id,
    method: 'put',
    data,
  })
// 删除
export const deleteCenterQualification = (data) =>
  request({
    url: url + '/centerQualifications/' + data.id,
    method: 'delete',
    data,
  })
