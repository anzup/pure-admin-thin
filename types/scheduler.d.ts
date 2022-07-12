declare namespace Scheduler {
  declare enum resourceType {
    'TEACHER' = 'teacherId',
    'FACILITIES' = 'facilityId',
  }
  declare type BuiltinResource =
    | 'ADD_SIMULATOR'
    | 'FLIGHT_TEACHER'
    | 'INSPECTOR'
    | 'MFTD'
    | 'SIMULATOR'
    | 'THEORY_TEACHER'
    | 'TRANSLATOR'
  declare interface IResourcesTypeList {
    id: number
    name: string
    resources?: IResourcesList
    resourceType: keyof typeof resourceType
    builtinResource: BuiltinResource
  }
  declare type IResourcesList = Array<{
    id?: number
    name: string
    rid: number
    remark?: string
    resourceId?: number
    display?: boolean
  }>
  declare interface IClassItem {
    id: number
    courseNumber: string
    clazzId: number
    status: 'NOT_STARTED' | 'SCHEDULE' | 'FINISHED'
    type: 'DRY_LEASE' | 'WET_LEASE'
  }
  declare interface IPatternForm {
    pattern: 'operation' | 'browse'
    resourceType: keyof typeof resourceType
    viewMode: 'company' | 'teacher' | 'course'
    searchKey: string
    currentDate: Date
    colorConfig: ColorType
    snapToTime: number
    cellWidth: number
    cellHeight: number
    color: string
    fontColor: string
    timeStep: number
  }

  // 人员类型
  type PersonRole =
    | 'ACCOMPANYING_STUDENT'
    | 'FOLLOWING_TEACHER'
    | 'INTERNAL_INSPECTOR'
    | 'MAIN_INSPECTOR'
    | 'MAIN_STUDENT'
    | 'MAIN_TEACHER'
    | 'OBSERVING_STUDENT'
    | 'TRANSLATOR'

  // scheduler 类型
  type ScheduleType =
    | 'EXTRA'
    | 'MALFUNCTION'
    | 'NORMAL'
    | 'OCCUPIED'
    | 'REMEDY'
    | 'MAINTAINING'
    | 'DISPATCH'
    | 'CHECK'
  // 人员详情
  declare interface People {
    classId?: number
    customerId?: number
    customerName?: string
    personId: number
    personName?: string
    personRole: PersonRole
    self: boolean
    valueKey?: string
  }

  declare interface PersonGroups {
    personRole: PersonRole
    personRoleName?: string
    people: People[]
    selectPeople?: string[]
    loading?: boolean
  }
  declare interface ISchedulerItem {
    /** @param classId 班级id */
    classId?: number
    /** @param conflict 是否冲突 */
    conflict?: boolean
    /** @param courseNumber 班级课号 */
    courseNumber?: string
    /** @param courseType 课程类型 */
    courseType?: courseType
    /** @param enabled 数据是否有效 */
    enabled?: boolean
    /** @param endDate 结束时间 */
    endDate?: string
    /** @param facilityBuiltinResource 设施资源类型 */
    facilityBuiltinResource?:
      | 'ADD_SIMULATOR'
      | 'FLIGHT_TEACHER'
      | 'INSPECTOR'
      | 'MFTD'
      | 'SIMULATOR'
      | 'THEORY_TEACHER'
      | 'TRANSLATOR'
    /** @param facilityId 设施id */
    facilityId?: number
    /** @param facilityResourceId 设施资源类型id */
    facilityResourceId?: number
    /** @param groupName 分组名称 */
    groupName?: string
    /** @param id scheduler id 唯一标识符 */
    id?: number
    /** @param needGroup 是否需要分组 */
    needGroup?: boolean
    /** @param needResource 是否需要设施 */
    needResource?: boolean
    /** @param needStudents 是否需要学员 */
    needStudents?: boolean
    /** @param needTeacher 是否需要教员 */
    needTeacher?: boolean
    /** @param needInspector 是否需要检查员 */
    needInspector?: boolean
    /** @param occupiedNumber 占位号 */
    occupiedNumber?: string
    /** @param period 课时 */
    period?: number
    /** @param periodByStudent 是否按学员计算课时 */
    periodByStudent?: boolean
    /** @param remark 备注 */
    remark?: string
    /** @param scheduleType 类型 */
    scheduleType?: ScheduleType
    /** @param startDate 开始时间 */
    startDate?: string
    /** @param syllabusItemId 大纲项目id */
    syllabusItemId?: number
    /** @param syllabusItemName 大纲项目名称 */
    syllabusItemName?: string
    /** @param teacherBuiltinResource 教员资源类型 */
    teacherBuiltinResource?: BuiltinResource
    /** @param teacherId 教员id 用于在教员视图下的显示 无其他作用 */
    teacherId?: number
    /** @param teacherResourceId 教员资源id */
    teacherResourceId?: number
    /** @param type 课程类型 */
    type?: string
    /** @param customers 客户 */
    customers?: IResourcesList
    /** @param searchField 搜索字段 */
    searchField?: string[]
    /** @param exchangeItem 交换时储存schedulerid */
    exchangeItem?: {
      scheduleId1: number
      resourceId1: number
    }
    /** @param syllabusItemFullName 大纲项目全称 */
    syllabusItemFullName?: string
    /** @param splitType 拆分类型 */
    splitType?: 'STUDENT' | 'TIME'
    /** @param dataType 用于左侧判断是课程还是模板 */
    dataType?: 'template'
    /** @param occupiedNumber 占位名称 */
    occupiedNumber?: string
    /** @param facilityName 设施名称 */
    facilityName?: string
    // teacherName?: string;
    /** @param copy 这个色块是否是复制 */
    copy?: boolean
    /** @param originEndDate 跨天时的真实结束时间 */

    originEndDate?: string
    /** @param originStartDate 跨天时的真实开始时间 */
    originStartDate?: string
    /**
     * @param personGroups 所有的人员
     */
    personGroups?: PersonGroups[]
    /**
     * @param oldTeacherId 在教员模式下拖拽时确认拖动的是哪个id
     */
    oldTeacherId?: number
    /**
     * @param mainTeacherId 主讲教员第一个，用于教员分组颜色显示
     */
    mainTeacherId?: number
    /** @param intervalPeriod 休息时长 **/
    intervalPeriod?: number
  }
  declare interface ISetColor {
    color: string
    fontColor: string
    colorType: ColorType
  }
  declare interface IStudentsItem {
    id: number
    name: string
    classId: number
    courseNumber: string
    customerId: number
    customerName: string
    isFocus: boolean
    type: 'NORMAL' | 'VIP' | 'VIP2' | 'VIP3'
  }
  declare interface ITeacherTypeItem {
    teacherRole: 'EMPLOEEY' | 'INSPECTOR' | 'OBSERVER' | 'TRANSLATOR'
    teacherRoleName: string
    teachers: Array<ITeacherItem>
    loading?: boolean
    teacherOptions: Array<ITeacherItem>
  }
  declare interface ITeacherItem {
    builtinRole:
      | 'AVIATION_INSPECTOR'
      | 'CUSTOMER_CONTACTOR'
      | 'FLIGHT_TEACHER'
      | 'PLANNER'
      | 'THEORY_TEACHER'
      | 'TRAINING_ADMIN'
    customerId: number
    customerName: string
    id: number
    name: string
    selfTeacher: boolean
    teacherRole: 'EMPLOEEY' | 'INSPECTOR' | 'OBSERVER' | 'TRANSLATOR'
    fullId: string
  }
  declare interface IMenuReturn {
    type: 'student' | 'copy' | 'split'
    data?: any
  }
  declare interface AsideListSet {
    noArrangeName: 'name' | 'shortName' | 'period'[]
    noArrangeGroupColors: string[]
    noArrangeColor: string
    arrangeShow: boolean
    arrangeName: ArrangeName[]
    arrangeColor: string
    unusedTemplateColor: string
    unfinishedTemplateColor: string
    finishedTemplateColor: string
  }
  declare type ArrangeName = 'name' | 'period' | 'facilities' | 'teacher' | 'time' | 'shortName'
  declare type ColorType = 'CLASS' | 'FACILITY' | 'TEACHER' | 'SPECIAL'
  declare interface ColorConfig {
    color: string
    colorType?: ColorType
    groupId?: number
    fontColor: string
    builtinResource?: BuiltinResource
  }
}
