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

declare interface CurrentUserInfo {
  /**@param 账号类型*/
  accountType: AccountType
  /**@param 内置职位*/
  builtinRole: BuiltinRole //
  /**@param 公司信息*/
  filiale: {
    id: number
    name: string
  }
  id: number
  /**@param 身份证*/
  idNumber: string
  /**@param 最后一次登录时间*/
  lastLoginTime: string
  /**@param 姓名*/
  name: string
  /**@param 手机号*/
  phone: string
  /**@param 角色权限*/
  roleAuthorities: string[]
  /**@param 职位*/
  roleName: string
  selfAuthorities: string[]
  signatureFileUuid: string
  /**@param 是否学员*/
  student: boolean
  /**@param 是否教员*/
  teacher: boolean
  /**@param 是否教务员*/
  teacherAdmin: boolean
  /**@param 是否临时考生*/
  tempStudent: boolean
  /**@param 全部权限*/
  totalAuthorities: string[]
  userId: number
  username: string
}

declare type AccountType = 'UNKNOWN' | 'STUDENT' | 'EMPLOYEE' | 'ADMIN'

declare interface DefaultReturn<T = DefaultPagingData> {
  data?: T
  code?: string
  msg?: string
  infos?: string
}
// 大纲类型|课程累心|训练类型|模板类型
declare type courseType = 'DRY_LEASE' | 'WET_LEASE' | 'INTERNAL_TRAINING'
// 教员类型
declare type BuiltinRole =
  | 'THEORY_TEACHER'
  | 'FLIGHT_TEACHER'
  | 'TRAINING_ADMIN'
  | 'PLANNER'
  | 'CUSTOMER_CONTACTOR'
  | 'AVIATION_INSPECTOR'
  | 'INSPECTOR'
// 工作性质
declare type WorkType = 'FULL_TIME' | 'PART_TIME'
