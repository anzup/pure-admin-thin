import request from '/@/utils/request/opm'
const url = import.meta.env.VITE_BASE_API_OPM

/**
 *
 * @param {
 * 班级列表
 * }
 */

export const getClazzsList = function (params: { page: number; size: number; [_: string]: any }) {
  return request({
    url: url + `/clazzs`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 班级详情
 * }
 */

export const getClazzsDetail = function (params: number | string) {
  return request({
    url: url + `/clazzs/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 班级详情下的班级所有学员
 * }
 */
export interface IClazzsStudents {
  id: number | string
  excludeIds?: string
}
export const getClazzsStudents = function (data: IClazzsStudents) {
  const { id, ...params } = data
  return request({
    url: url + `/clazzs/${id}/students`,
    method: 'get',
    params,
  })
}
/**
 * @param {
 * 班级历史
 * }
 */

export const getClazzScheduleHis = function (id: number | string) {
  return request({
    url: url + `/schedules/${id}/clazzScheduleHis`,
    method: 'get',
  })
}

/**
 * @param {
 * 班级新增
 * }
 */

export const postClazzs = function (data) {
  return request({
    url: url + `/clazzs`,
    method: 'post',
    data,
  })
}
/**
 * @param {
 * 班级新增学员
 * }
 */

export const postClazzsAddStudent = function (data) {
  return request({
    url: url + `/clazzs/${data.id}/addStudent`,
    method: 'post',
    data: data.data,
  })
}
/**
 * @param {
 * 班级学员关注
 * }
 */

export const putClazzFocus = function (params: {
  id: number
  focus: boolean
  studentIds: number[]
}) {
  const { id, ...data } = params
  return request({
    url: url + `/clazzs/focus/${id}`,
    method: 'put',
    data: data,
  })
}
/**
 * @param {
 * 班级删除学员
 * }
 */

export const postClazzsDeleteStudent = function (data: { id: number | string; data: object }) {
  return request({
    url: url + `/clazzs/${data.id}/deleteStudent`,
    method: 'post',
    data: data.data,
  })
}

/**
 * @param {
 * 班级修改
 * }
 */

export const putClazzsId = function (data) {
  return request({
    url: url + `/clazzs/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 班级删除
 * }
 */

export const deleteClazzsId = function (data) {
  return request({
    url: url + `/clazzs/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 班级批量删除
 * }
 */

export const postClazzsBatchDelete = function () {
  return request({
    url: url + `/clazzs/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getClazzsAll = function (params) {
  return request({
    url: url + `/clazzs/all`,
    method: 'get',
    params,
  })
}
/**
 * @param {
 * 获取最新课号
 * }
 */

export const getClazzsNumber = function (params: { courseId: number; year: number }) {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `​/clazzs​/number`,
    method: 'get',
    params,
  })
}
/**
 * @param {
 * 干租班级导出
 * }
 */

export const getClazzsTemplate = function (data: {
  customerId: number
  dateRange: string
  syllabusId: number
  number: number
}) {
  const { customerId, ...params } = data
  return request({
    url: url + `/clazzs/import/template/${customerId}`,
    method: 'get',
    responseType: 'blob',
    params,
  })
}
/**
 * @param {
 * 干租班级导入
 * }
 */

export const postClazzsImport = function (data) {
  return request({
    url: url + `/clazzs/import`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
/********** 班级分组 ***************/
/**
 * @param {
 * 班级分组分页列表
 * }
 */

export const getGroupingsList = function (params: {
  page: number
  size: number
  clazzId: number | string
  [propName: string]: any
}) {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `​/groupings`,
    method: 'get',
    params,
  })
}
export const getGroupingsAll = function (params: { clazzId?: number | string }) {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `​/groupings/all`,
    method: 'get',
    params,
  })
}
/**
 * @param {
 * 班级分组操作列表
 * }
 */

export const getGroupingsOperateList = function (clazzId: number | string) {
  return request({
    url: url + `/groupings/operate/${clazzId}`,
    method: 'get',
  })
}
/**
 * @param {
 * 分组批量修改
 * }
 */

export const putGroupingsBatchUpdate = function (data: { clazzId: number | string; data: any[] }) {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `/groupings​/batchUpdate​/${data.clazzId}`,
    method: 'put',
    data: data.data,
  })
}
/**
 * @param {
 * 分组人员批量操作
 * }
 */

export const postGroupingsOperate = function (data: {
  clazzId: number | string
  groupings: any[]
}) {
  return request({
    url: url + `/groupings/operate`,
    method: 'post',
    data,
  })
}
/**************** 理论教员绑定 *******************/
/**
 * @param {
 * 理论教员绑定列表
 * }
 */

export const getTeacherBinding = function (classId: number | string) {
  return request({
    url: url + `/schedules/teacherBinding/${classId}`,
    method: 'get',
  })
}
/**
 * @param {
 * 设施绑定列表
 * }
 */

export const getFacilityBinding = function (classId: number | string) {
  return request({
    url: url + `/schedules/facilityBinding/${classId}`,
    method: 'get',
  })
}
/**
 * @param {
 * 理论教员绑定
 * }
 */
export interface ClazzTheorySeting {
  ids: number[]
  resourceTypeId: number
  resourceIds: number[]
}
export const putSchedulesBind = function (params: ClazzTheorySeting) {
  const { resourceTypeId, ...data } = params
  return request({
    url: url + `/schedules/bind/${resourceTypeId}`,
    method: 'put',
    data,
  })
}
/**
 * @param {
 *  解绑
 * }
 */

export const putSchedulesUnbind = function (params: { clearTeacher: boolean; ids: number[] }) {
  const { clearTeacher, ...data } = params
  return request({
    url: url + `/schedules/unbind/${clearTeacher}`,
    method: 'put',
    data,
  })
}

/********************* 加训管理 *********************/

/**
 * @param {
 * 列表
 * }
 */

type AdditionalStatus = 'APPROVED' | 'REJECTED' | 'WAITING_APPROVE'
export interface AdditionalTraining extends PageBase {
  status?: AdditionalStatus
}
export interface AdditionalTrainingResponse {
  // 审核状态
  status: string
  // 类型
  type: 'EXAM' | 'TRAINING'
  // 源id
  sourceId: number
  remark: string
  name: string
  id: number
  flightEvaluation: any
  auditor: DefaultAllListItem[]
}

export const getAdditionalTraining = function (
  params: AdditionalTraining,
): Promise<DefaultReturn<DefaultPagingData<AdditionalTraining[]>>> {
  return request({
    url: url + `/additionalTrainingNotices`,
    method: 'get',
    params,
  })
}
/**
 * @param {
 *  审核
 * }
 */

export const postAdditionalTrainingAudit = function (params: {
  pinCode: string
  id: number
  remark: string
  status: AdditionalStatus
}) {
  const { id, ...data } = params
  return request({
    url: url + `/additionalTrainingNotices/${id}/audit`,
    method: 'post',
    data,
  })
}
/**
 * @param {
 *  详情
 * }
 */

export const getAdditionalTrainingDetail = function (id: number) {
  return request({
    url: url + `/additionalTrainingNotices/${id}`,
    method: 'get',
  })
}

/********************* 考试管理 *********************/

/**
 * @param {
 * 列表
 * }
 */

type StudentStatus = 'GRADUATED' | 'NOT_GRADUATED' | 'NOT_STARTED'
export interface FlightExamRecords extends PageBase {
  // 是否已签办
  audited?: boolean
  clazzId: number
  clazzStatusIN?: string
  customerId?: number
  groupingId: number
  ids?: string
  studentStatus?: StudentStatus
  studentStatusIN?: string
  type?: string
}
type AuditType = 'ABNORMAL_GRADUATE' | 'ADDITION' | 'NORMAL_GRADUATE'
export interface FlightExamRecordsResponse {
  auditRemark: string
  auditType: AuditType
  auditor: DefaultAllListItem
  // 签名时间
  auditorSignTime: string
  // 签名人
  auditorSignature: string
  // 。。。。。
}

export const getFlightExamRecords = function (
  params: FlightExamRecords,
): Promise<DefaultReturn<DefaultPagingData<AdditionalTraining[]>>> {
  return request({
    url: url + `/flightExamRecords`,
    method: 'get',
    params,
  })
}
/**
 * @param {
 *  审核
 * }
 */

export const postFlightExamRecordsAudit = function (params: {
  auditRemark: string
  id: number
  auditType: AuditType
  pinCode: string
}) {
  const { id, ...data } = params
  return request({
    url: url + `/flightExamRecords/${id}/audit`,
    method: 'post',
    data,
  })
}
/**
 * @param {
 *  生成pdf
 * }
 */

export const postFlightExamRecordsGenPdf = function (data: {
  ids: number[]
  templateHtml?: string
}) {
  return request({
    url: url + `/flightExamRecords/genPdf`,
    method: 'post',
    data,
    // 设置文件返回类型
    responseType: 'blob',
  })
}
/**
 * @param {
 *  详情
 * }
 */

export const getFlightExamRecordsDetail = function (id: number) {
  return request({
    url: url + `/flightExamRecords/${id}`,
    method: 'get',
  })
}
/**
 * @param 考试列表
 */

export const getExams = function () {
  return request({
    url: url + `/exams`,
    method: 'get',
    params: {},
  })
}
/**
 * @param 考试提交
 */

export const postExams = function (id: number) {
  return request({
    url: url + `/exams/${id}`,
    method: 'post',
  })
}
/**
 * @param 考试学员详情
 */

export const getExamsDetail = function (id: number) {
  return request({
    url: url + `/exams/${id}`,
    method: 'get',
  })
}
