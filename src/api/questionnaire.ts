import { AxiosPromise } from 'axios'
import {
  Classification,
  OptionSetting,
  RecordType,
  RecordStatus,
  QuestionType,
  Status,
  Validation,
  SourceType,
  AuditStatus,
  FileType,
  Property
} from '../enums/questionnaire'
import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM
/**
 * 问卷
 */

/**@interface 新增 */
export interface PostQuestionnaires {
  name: string // 名称
  startTime: string // 开始时间 永久填0
  endTime: string // 结束时间 永久填0
  templateId?: string | number // 模板id
  type?: string // 类型
  userIds: string[] | number[] // 用户id 所有填[0]
  // classification: Classification; // 分类 教学问卷或防疫问卷
  classificationId: number // 问卷分类id
  property: Property
}
/**@function 新增 */
export function postQuestionnaires(data: PostQuestionnaires): AxiosPromise {
  return request({
    url: `${url}/questionnaires`,
    method: 'post',
    data
  })
}

/**@interface 复制 */
export interface PostCopyQuestionnaire{
  id: number
  name: string
  endTime: string
  startTime: string
}
/**@function 复制 */
export const postCopyQuestionnaire = (data: PostCopyQuestionnaire): AxiosPromise => request({
  url: `${url}/questionnaires/${data.id}/copy`,
  method: 'post',
  data
})

/**@interface 分页列表 */
export interface GetQuestionnaires extends PageBase {
  classificationId: number // 分类id 教学问卷或防疫问卷
  createdBy?: number // 创建者userId
  status?: Status // 状态 未开始、进行中、已过期/已结束、已中止
  type?: string // 类型,可用值:PUBLIC,INTERNAL
  userId?: number // 	用户id
  property?: Property
}
/**@function 分页列表 */
export function getQuestionnaires(params: GetQuestionnaires): AxiosPromise {
  return request({
    url: `${url}/questionnaires`,
    method: 'get',
    params
  })
}

/**@interface 批量删除 */
export interface BatchDeleteQuestionnaires {
  ids: number[]
}
/** @function 批量删除 */
export function batchDeleteQuestionnaires(data: BatchDeleteQuestionnaires): AxiosPromise {
  return request({
    url: `${url}/questionnaires/batchDelete`,
    method: 'post',
    data
  })
}

/** @interface 详情 */
export interface GetQuestionnairesDetail {
  id: number
}
/**@function 详情*/
export function getQuestionnairesDetail(params: GetQuestionnairesDetail): AxiosPromise {
  return request({
    url: `${url}/questionnaires/${params.id}`,
    method: 'get',
    params
  })
}

/**@interface 修改 */
export interface PutQuestionnaires {
  id: number
  startTime?: string // 	开始时间,永久填0
  endTime?: string // 结束时间,永久填0
  name?: string // 名称
  templateId?: number // 模板id
  type?: string //	类型,可用值:PUBLIC,INTERNAL
  userIds?: number[] // 用户id
}
/**@function 修改*/
export function putQuestionnaires(data: PutQuestionnaires): AxiosPromise {
  return request({
    url: `${url}/questionnaires/${data.id}`,
    method: 'put',
    data
  })
}

/**@interface 删除 */
export interface DeleteQuestionnaires {
  id: number
}
/**@function 删除 */
export function deleteQuestionnaires(data: DeleteQuestionnaires) {
  return request({
    url: `${url}/questionnaires/${data.id}`,
    method: 'delete',
    data
  })
}

/**@interface 项目结构 */
export interface ClassficationOption {
  id: number
  file: any[] // 文件
  name: string // 名称
  optionSetting: OptionSetting | undefined // 选项设置
  showInput: boolean // 	显示输入框
  needAudit: boolean // 是否审核
  fileType: FileType // 文件类型(当选项设置为上传附件时必填)
}
/**@interface 问题结构 */
export interface ClassficationQuestion {
  id: number
  name: string // 名称
  isRequired: boolean // 是否必选
  preCondition: any[] | string | number // 前置条件(问题选项id)
  showRiskArea: boolean // 显示风险地区链接
  fileRemark: string // 附件说明
  terminatedRemark: string // 中止说明
  type: QuestionType | undefined // 问题类型
  validation: Validation | undefined // 文本验证类型
  options: ClassficationOption[]
  file: any[] // 图片文件
}
/**@interface 分类结构 */
export interface ClassficationClassify {
  name: string
  questions: ClassficationQuestion[]
}

/**@interface 设置题目 */
export interface PostQuestionnairesClassfication {
  id: number
  classifications: ClassficationClassify[]
}
/**@function 设置题目  */
export function postQuestionnairesClassfication(
  data: PostQuestionnairesClassfication
): AxiosPromise {
  return request({
    url: `${url}/questionnaires/${data.id}/classFication`,
    method: 'post',
    data
  })
}

/**@interface 终止-取消终止 */
export interface PutQuestionnairesFinished {
  termination: boolean // true中止 false取消中止
  endTime?: string
  startTime?: string
  id: number
}
/** @function 终止-取消终止 */
export function putQuestionnairesFinished(data: PutQuestionnairesFinished): AxiosPromise {
  return request({
    url: `${url}/questionnaires/${data.id}/finished`,
    method: 'put',
    data
  })
}

/**
 * 问卷分类
 */
/**@interface 分页列表 */
export interface GetQuestionnaireClassifications extends PageBase {
  ids?: string
}
/** @function 分页列表 */
export function getQuestionnaireClassifications(
  params: GetQuestionnaireClassifications
): AxiosPromise {
  return request({
    url: `${url}/questionnaireClassifications`,
    method: 'get',
    params
  })
}

/**@interface 新增 */
export interface PostQuestionnaireClassifications {
  name: string // 分类名
  remark: string // 说明
}
/** @function 新增 */
export function postQuestionnaireClassifications(
  data: PostQuestionnaireClassifications
): AxiosPromise {
  return request({
    url: `${url}/questionnaireClassifications`,
    method: 'post',
    data
  })
}

/**@interface 下拉列表 */
export interface GetQuestionnaireClassificationsAll {
  builtIn?: boolean // 是否为内置属性
}
/** @function 下拉列表 */
export function getQuestionnaireClassificationsAll(params: GetQuestionnaireClassificationsAll) {
  return request({
    url: `${url}/questionnaireClassifications/all`,
    method: 'get',
    params
  })
}

/**@interface 批量删除 */
export interface BatchDeleteQuestionnaireClassification {
  ids: number[]
}
/** @function 批量删除  */
export function batchDeleteQuestionnaireClassification(
  data: BatchDeleteQuestionnaireClassification
): AxiosPromise {
  return request({
    url: `${url}/questionnaireClassifications/batchDelete`,
    method: 'post',
    data
  })
}

/**@interface 详情 */
export interface GetQuestionnaireClassificationsDetail {
  id: number
}
/** @function 详情 */
export function getQuestionnaireClassificationsDetail(
  params: GetQuestionnaireClassificationsDetail
): AxiosPromise {
  return request({
    url: `${url}/questionnaireClassifications/${params.id}`,
    method: 'get'
  })
}

/**@interface 修改 */
export interface PutQuestionnaireClassificationsDetail {
  id: number
  code?: string // 编码
  name?: string // 分类名
  remark?: string // 说明
}
/** @function 修改 */
export function putQuestionnaireClassificationsDetail(
  data: PutQuestionnaireClassificationsDetail
): AxiosPromise {
  return request({
    url: `${url}/questionnaireClassifications/${data.id}`,
    method: 'put',
    data
  })
}

/**@interface 删除 */
export interface DeleteQuestionnaireClassificationsDetail {
  id: number
}
/** @function 删除 */
export function deleteQuestionnaireClassificationsDetail(
  data: DeleteQuestionnaireClassificationsDetail
): AxiosPromise {
  return request({
    url: `${url}/questionnaireClassifications/${data.id}`,
    method: 'delete'
  })
}

/**
 * 问卷记录
 */

/**@interface 问题结构-记录 */
export interface ClassficationQuestionRecord extends Exclude<ClassficationQuestion, 'options'> {
  answer: string | null // 答案
  options: ClassficationOptionRecord[]
}
/**@interface 选项结构-记录 */
export interface ClassficationOptionRecord extends ClassficationOption {
  uploadFile: string[] // 用户上传文件列表
  uploadFileVO: ResponseFileType[] // 用户上传文件详情列表
  inputValue: string // 用户输入内容
}

/**@interface 分页列表-问卷记录 */
export interface GetqRecords extends PageBase{
  classId?: number; //	班级
  classIds?: string; // 	班级ids
  createDate?: string; // 创建时间,用户临时学员组织
  createdBy?: string; // 创建者userId
  ids?: string; // 查询多个id,逗号分隔
  organizeName?: string; // 组织名
  questionnaireId?: number; // 问卷id
  sendDate?: string; // 	发送时间
  sendDateRange?: string
  sendStatus?: RecordStatus | ''; // 发送状态,可用值:SUCCESS,FAIL,WAIT_SEND
  sourceType?: SourceType; // 所属分类(班级学员or临时人员),可用值:CLASS,ORGANIZE
  property?: Property
  status?: AuditStatus; // 审核状态,
  userId?: number; // 用户id
  customerName?: string
}
/**@function 分页列表-问卷记录 */
export const getqRecord = (params: GetqRecords): AxiosPromise =>
  request({
    url: `${url}/qRecords`,
    method: 'get',
    params
  })

/** @interface 新增-问卷记录 */
export interface PostqRecord {
  classId?: number // 班级,如果分类是班级那么classId必填
  organizeName?: string // 组织名，如果分类是临时学员organizeName必填
  phone?: string // 	手机号
  questionnaireId: number // 问卷id
  reminderTime?: string // 提醒时间
  sendTime?: string // 发送时间
  sourceType: SourceType // 所属分类
  type: RecordType // 问卷记录类型,
  userId?: number // 用户id
  userName?: string // 学员姓名
}
/**@function 新增-问卷记录 */
export const postqRecord = (data: PostqRecord): AxiosPromise =>
  request({
    url: `${url}/qRecords`,
    method: 'post',
    data
  })

/**@interface 审核-问卷记录 */
export interface PostqRecordAudit{
  ids: string; // recordId集合
  status: AuditStatus; // 审核状态
  remark?: string; // 审核备注
}
/**@function 审核-问卷记录 */
export const postqRecordAudit = (data: PostqRecordAudit): AxiosPromise =>
  request({
    url: `${url}/qRecords/approve`,
    method: 'post',
    data
  })

/**@interface 班级人员批量新增-问卷记录 */
export interface PostqRecordBatchAddClassItem {
  classId?: number // 班级,如果分类是班级那么classId必填
  organizeName?: string // 组织名，如果分类是临时学员organizeName必填
  phone?: string //手机号
  questionnaireId: number // 问卷id
  reminderTime?: string // 提醒时间
  sendTime?: string // 发送时间
  sourceType: SourceType // 所属分类
  type: RecordType // 问卷记录类型,
  userId?: number // 用户id
  userName?: string // 学员姓名
}
export interface PostqRecordBatchAddClass {
  addBOS: PostqRecordBatchAddClassItem[]
  leaderPhone?: string // 班级负责人手机号(需要提醒就传)
  leaderReminderTime?: string // 班级负责人提醒时间---不用传，接口自动计算
  trainingTime?: string // 班级开训时间
}
/**@function 班级人员批量新增-问卷记录 */
export const postqRecordBatchAddClass = (data: PostqRecordBatchAddClass): AxiosPromise =>
  request({
    url: `${url}/qRecords/batchAddClass`,
    method: 'post',
    data
  })

/**@interface 批量删除-问卷记录 */
export interface PostqRecordBatchDelete {
  ids?: number[]
}
/**@function 批量删除-问卷记录 */
export const postqRecordBatchDelete = (data: PostqRecordBatchDelete): AxiosPromise =>
  request({
    url: `${url}/qRecords/batchDelete`,
    method: 'post',
    data
  })

/**@interface 导入-问卷记录 */
export interface PostqRecordImport {
  file: File
  sendDate: string
}
/**@function 导入-问卷记录 */
export const postqRecordImport = (d: PostqRecordImport): AxiosPromise => {
  const data = new FormData();
  data.append('file', d.file);
  data.append('sendDate', d.sendDate);
  return request({
    url: `${url}/qRecords/import`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

/**@function 导入-下载模板-问卷记录 */
export const getqRecordImport = (): AxiosPromise =>
  request({
    url: `${url}/qRecords/import/template`,
    method: 'get',
    responseType: 'blob'
  })

/**@interface 问卷统计人员详情 */
export interface GetqRecordStatisticDetail extends PageBase{
  classificationId: number; // 问卷类型
  questionnaireId: number; // 查询问卷列表的时候需要传
  sourceType: SourceType; // 是否是班级学员
  auditStatus?: AuditStatus
  classId?: number; // 班级id
  sendDate?: string; // 	发送时间
  organizeName: string
  filled?: boolean
}
/**@function 问卷统计人员详情 */
export const getqRecordStatisticDetail = (params: GetqRecordStatisticDetail): AxiosPromise =>
  request({
    url: `${url}/qRecords/statisticDetail`,
    method: 'get',
    params
  })

/**@interface 问卷统计-问卷记录 */
export interface GetqRecordStatistics extends PageBase {
  classificationId: number // 	问卷类型
  sourceType: SourceType // 是否是班级学员
  classId?: number // 班级id
  ids?: string // 查询多个id,逗号分隔
  organizeName?: string // 组织名称
  sendDate?: string // 发送时间
  sendDateRange?: string
}
/**@function 问卷统计-问卷记录 */
export const getqRecordStatistics = (params: GetqRecordStatistics): AxiosPromise =>
  request({
    url: `${url}/qRecords/statistics`,
    method: 'get',
    params
  })

/**@interface 详情-问卷记录 */
export interface GetqRecordDetail {
  id: number
}
/**@function 详情-问卷记录 */
export const getqRecordDetail = (params: GetqRecordDetail): AxiosPromise =>
  request({
    url: `${url}/qRecords/${params.id}`,
    method: 'get',
    params
  })

/**@interface 重新发送-问卷记录 */
export interface PostqRecordResend {
  id: number
}
/**@function 重新发送-问卷记录 */
export const postqRecordResend = (data: PostqRecordResend): AxiosPromise =>
request({
  url: `${url}/qRecords/${data.id}/resend`,
  method: 'post',
  data
})

/**@interface 取消发送-问卷记录 */
export interface PostqRecordCancelSend{
  ids?: number[]
  organizeName?: string
  questionnaireId?: number
  customerName?: string
}
/**@function 取消发送-问卷记录 */
export const postqRecordCancelSend = (data: PostqRecordCancelSend): AxiosPromise => request({
  url: `${url}/qRecords/cancelSend`,
  method: 'post',
  data
})

// 问卷分类
export interface GetClassifications extends PageBase {
  builtIn?: boolean
}
/**@function 问卷分类--列表*/
export const getClassifications = (params: GetClassifications): AxiosPromise<DefaultPagingData> =>
  request({
    url: `${url}/questionnaireClassifications`,
    method: 'get',
    params
  })
/**@function 问卷分类--下拉列表*/
export const getClassificationsAll = (): AxiosPromise<DefaultAllListItem[]> =>
  request({
    url: `${url}/questionnaireClassifications/all`,
    method: 'get'
  })
/**@function 问卷分类--详情*/
export const getClassificationsDetail = (id: number): AxiosPromise =>
  request({
    url: `${url}/questionnaireClassifications/${id}`,
    method: 'get'
  })
export interface PostClassifications {
  code?: string
  name: string
  remark: string
  id?: number
}
/**@function 问卷分类--新增*/
export const postClassifications = (data: PostClassifications) =>
  request({
    url: `${url}/questionnaireClassifications`,
    method: 'post',
    data
  })
/**@function 问卷分类--修改*/
export const putClassifications = (params: PostClassifications) => {
  const { id, ...data } = params
  return request({
    url: `${url}/questionnaireClassifications/${id}`,
    method: 'put',
    data
  })
}
/**@function 问卷分类--删除*/
export const deleteClassifications = (id: number) => {
  return request({
    url: `${url}/questionnaireClassifications/${id}`,
    method: 'delete'
  })
}

// 问卷配置
export type SendType = 'SEND' | 'REMIND' | 'LEADER_REMIND'
export interface GetSmsTemplates extends PageBase {
  classificationId?: number
  sendType?: SendType
}
/**@function 问卷配置--列表*/
export const getSmsTemplates = (params: GetSmsTemplates): AxiosPromise<DefaultPagingData> =>
  request({
    url: `${url}/smsTemplates`,
    method: 'get',
    params
  })

/**@function 问卷配置--详情*/
export const getSmsTemplatesDetail = (id: number): AxiosPromise =>
  request({
    url: `${url}/smsTemplates/${id}`,
    method: 'get'
  })
export interface PostSmsTemplates {
  accessKeyId: string
  accessSecret: string
  classificationId: number
  sendType: SendType
  signName: string
  template: string
  id?: number
}
/**@function 问卷配置--新增*/
export const postSmsTemplates = (data: PostSmsTemplates) =>
  request({
    url: `${url}/smsTemplates`,
    method: 'post',
    data
  })
/**@function 问卷配置--修改*/
export const putSmsTemplates = (params: PostSmsTemplates) => {
  const { id, ...data } = params
  return request({
    url: `${url}/smsTemplates/${id}`,
    method: 'put',
    data
  })
}
/**@function 问卷配置--删除*/
export const deleteSmsTemplates = (id: number) => {
  return request({
    url: `${url}/smsTemplates/${id}`,
    method: 'delete'
  })
}
/**@interface 班级列表-问卷记录 */
export interface GetqRecordClassList{
  month: string
  sourceType: SourceType
}
/**@function 班级列表-问卷记录*/
export const getqRecordClassList = (params: GetqRecordClassList): AxiosPromise => request({
  url: `${url}/qRecords/class/list`,
  method: 'get',
  params
})

/**@interface 发送问卷分组列表 */
export interface GetqRecordGroupList extends PageBase{
  classificationId: number
  sourceType: SourceType
  auditStatus?: AuditStatus
  classId?: number
  filled?: boolean
  organizeName?: string
  property?: Property
  sendDate?: string
  sendDateRange?: string
  sendMonth?: string
}
/**@function 发送问卷分组列表*/
export const getqRecordGroupList = (params: GetqRecordGroupList): AxiosPromise => request({
  url: `${url}/qRecords/groupList`,
  method: 'get',
  params
})