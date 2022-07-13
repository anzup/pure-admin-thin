declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

declare type RefType<T> = T | null

declare type LabelValueOptions = {
  label: string
  value: any
}[]

declare type EmitType = (event: string, ...args: any[]) => void

declare type TargetContext = '_self' | '_blank'

declare interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

declare type ComponentRef<T extends HTMLElement = HTMLDivElement> = ComponentElRef<T> | null

declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

declare type ForDataType<T> = {
  [P in T]?: ForDataType<T[P]>
}

declare type AnyFunction<T> = (...args: any[]) => T

/**
 * @param PageBase 基础分页接口
 */
declare interface PageBase {
  page?: number
  size?: number
  order?: string
  sort?: string
  total?: number
  searchKey?: string
  ids?: string
  enabled?: boolean
}

/**
 * @param DefaultPagingData 默认分页返回格式
 */
declare interface DefaultPagingData<T = any[]> {
  content: T
  totalElements: number
  totalPages: number
}

/**
 * @param DefaultReturn 默认接口返回格式
 */
declare interface DefaultReturn<T = DefaultPagingData> {
  data?: T
  code?: string
  msg?: string
  infos?: string
}

/**
 * @param DefaultAllListItem 默认下拉格式
 */
declare interface DefaultAllListItem<T = number> {
  id: T
  name: string
}

/**@interface 文件类型_后端返回格式 */
declare interface ResponseFileType {
  id: number
  name: string
  size: number
  suffix: string
  url: string
  uuid: string
  playFilePath: string
  fileType: string
}

declare type FileType =
  | 'JPG'
  | 'JPEG'
  | 'PNG'
  | 'XML'
  | 'PDF'
  | 'EXCEL'
  | 'EXCELX'
  | 'DOC'
  | 'DOCX'
  | 'PPT'
  | 'PPTX'
  | 'SCORM'
  | 'H5'
  | 'ZIP'
  | 'RAR'
  | 'MOV'
  | 'AVI'
  | 'WMV'
  | 'MP4'
  | 'RMVB'
  | 'MP3'
  | 'WAV'
  | 'UNKNOWN'

declare type DegreeType =
  | 'HIGH_SCHOOL'
  | 'TECHNICAL_SECONDARY_SCHOOL'
  | 'ASSOCIATE_DEGREE'
  | 'BACHELOR_DEGREE'
  | 'MASTER_DEGREE'
  | 'DOCTOR_DEGREE'

declare interface UserInfo {
  // 用户id
  address: string
  airplaneTypes: string
  customer: DefaultAllListItem
  degreeType: DegreeType
  email: string
  gender: 'M' | 'F'
  graduationSchool: string
  id: number
  idNumber: string
  landline: string
  lastLoginTime: string
  major: string
  name: string
  nationality: DefaultAllListItem
  phone: string
  planejob: DefaultAllListItem
  politicalType: string
  position: DefaultAllListItem
  positions: DefaultAllListItem
  postTitle: string
  prohibited: boolean
  remark: string
  signatureFileUuid: string
  studentType: DefaultAllListItem
  teacherType: DefaultAllListItem
  team: DefaultAllListItem
  title: string
  userId: number
  username: string
  workStartTime: string
  roles: {
    builtin: boolean
    builtinRole: 'ADMIN' | 'PLANNER' | 'TEACHER' | 'STUDENT' | 'CUSTOMER_CONTACTER'
    id: number
    name: string
  }[]
  subsystems: ['ACC', 'OPM', 'FTM', 'DMM', 'CPM', 'CTM', 'CSM']
  department: DefaultAllListItem
  canteen: DefaultAllListItem
}

declare type AccountType = 'UNKNOWN' | 'STUDENT' | 'EMPLOYEE' | 'ADMIN'

declare interface CurrentUserInfo {
  /**@param 创建人id */
  createdBy: number
  /**@param 创建时间 */
  createdDate: string
  /**@param 数据所有者,可用值:ACC,OPM,FTM,DMM,CPM,CTM,CSM,PUB,SETTING,JOINT,LOG,DBS */
  dataOwner: string
  /**@param 数据是否有效(删除) */
  enabled: boolean
  /**@param 分公司id */
  filialeId: number
  /**@param 分公司名称 */
  filialeName: string
  /**@param id */
  id: number
  /**@param 身份证/护照/台胞证 */
  idNumber: string
  /**@param 最后登录时间 */
  lastLoginTime: string
  /**@param 修改时间 */
  lastModifiedDate: string
  /**@param 姓名 */
  name: string
  /**@param 可操作类型 */
  operationTypes: string[]
  /**@param 	手机号 */
  phone: string
  /**@param  签名文件uuid */
  signatureFileUuid: string
  /**@param 子系统管理员 */
  subsystemAdmin: boolean
  /**@param 子系统权限,可用值:ACC,OPM,FTM,DMM,CPM,CTM,CSM,LOG,DBS */
  subsystems: string[]
  /**@param 用户名/登录名 */
  username: string
}
declare interface DefaultReturn<T = DefaultPagingData> {
    data?: T;
    code?: string;
    msg?: string;
    infos?: string;
}
// 大纲类型|课程累心|训练类型|模板类型
declare type courseType = "DRY_LEASE" | "WET_LEASE" | "INTERNAL_TRAINING";
// 教员类型
declare type BuiltinRole = "THEORY_TEACHER" | "FLIGHT_TEACHER";
// 工作性质
declare type WorkType = "FULL_TIME" | "PART_TIME";