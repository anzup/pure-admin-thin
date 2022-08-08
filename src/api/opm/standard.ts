import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_OPM
const ftmUrl = import.meta.env.VITE_BASE_API_FTM
export default interface IFrom {
  page: number
  size: number
  searchKey?: string
  [propName: string]: any
}

/**
 *
 * @param {
 * 证照列表
 * }
 */

export const getEmployeeQualificationsList = function (params) {
  return request({
    url: url + `/employeeQualifications`,
    method: 'get',
    params,
  })
}

/**
 *
 * @param {
 * 资质列表
 * }
 */

export const getEmployeeQualificationsLicense = function (params: IFrom) {
  return request({
    url: url + `/employeeQualifications/license`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 客户详情
 * }
 */

export const getEmployeeQualificationsDetail = function (params) {
  return request({
    url: url + `/employeeQualifications/${params}`,
    method: 'get',
  })
}

/* ******************* 课程类型 *********************** */

/**
 *
 * @param {
 * 课程列表
 * }
 */

export const getCoursesList = function (params: IFrom) {
  return request({
    url: ftmUrl + `/courses`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {
 * 课程列表
 * }
 */

export const getCourseClassifies = function () {
  return request({
    url: ftmUrl + `/courseClassifies/all`,
    method: 'get',
  })
}

/**
 * @param {
 * 课程详情
 * }
 */

export const getCoursesDetail = function (params) {
  return request({
    url: ftmUrl + `/courses/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 课程新增
 * }
 */

export const postCourses = function (data) {
  return request({
    url: ftmUrl + `/courses`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 课程修改
 * }
 */

export const putCoursesId = function (data) {
  return request({
    url: ftmUrl + `/courses/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 课程删除
 * }
 */

export const deleteCoursesId = function (data) {
  return request({
    url: ftmUrl + `/courses/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 课程批量删除
 * }
 */

export const postCoursesBatchDelete = function () {
  return request({
    url: ftmUrl + `/courses/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getCoursesAll = function () {
  return request({
    url: ftmUrl + `/courses/all`,
    method: 'get',
  })
}
/**
 * @param {
 * 机型拆分下拉列表
 * }
 */

export const getCoursesAirplaneTypeAll = function () {
  return request({
    url: ftmUrl + `/courses/all/airplaneType`,
    method: 'get',
  })
}

/* ******************* 大纲 *********************** */

/**
 *
 * @param {
 * 大纲列表
 * }
 */

export const getSyllabusesList = function (params: IFrom) {
  return request({
    url: ftmUrl + `/syllabuses`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 大纲详情
 * }
 */

export const getSyllabusesDetail = function (params) {
  return request({
    url: ftmUrl + `/syllabuses/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 大纲新增
 * }
 */

export const postSyllabuses = function (data) {
  return request({
    url: ftmUrl + `/syllabuses`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 大纲修改
 * }
 */

export const putSyllabusesId = function (data) {
  return request({
    url: ftmUrl + `/syllabuses/${data.id}`,
    method: 'put',
    data,
  })
}
/**
 * @param {
 * 强制刷新排课
 * }
 */

export const putSyllabusesRefresh = function (id) {
  return request({
    url: ftmUrl + `/syllabuses/${id}/refresh`,
    method: 'put',
  })
}

/**
 * @param {
 * 大纲复制
 * }
 */

export const putSyllabusesCopy = function (data: { id: number; value: number }) {
  return request({
    url: ftmUrl + `/syllabuses/${data.id}/copy`,
    method: 'put',
    data: { value: data.value },
  })
}

/**
 * @param {
 * 大纲删除
 * }
 */

export const deleteSyllabusesId = function (data) {
  return request({
    url: ftmUrl + `/syllabuses/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 大纲批量删除
 * }
 */

export const postSyllabusesBatchDelete = function (data: number[]) {
  return request({
    url: ftmUrl + `/syllabuses/batchDelete`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getSyllabusesAll = function (params: { courseType: string; courseId?: number }) {
  return request({
    url: ftmUrl + `/syllabuses/all`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 大纲内容排序
 * }
 */

export const putSyllabusesSortItem = function (data?: {
  level: number
  desSyllabusItemId: number
  syllabusId: number
  syllabusItemId: number
  type: string
  [propsName: string]: any
}) {
  return request({
    url: ftmUrl + `/syllabusItems/sortItem`,
    method: 'put',
    data,
  })
}

/******************* 大纲管理 ************************** */
/**
 *
 * @param {
 * 大纲管理列表
 * }
 */

export const getSyllabusItemsList = function (params: TemplatesSyllabus) {
  return request({
    url: ftmUrl + `/syllabusItems`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 大纲管理详情
 * }
 */

export const getSyllabusItemsDetail = function (params) {
  return request({
    url: ftmUrl + `/syllabusItems/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 大纲管理新增
 * }
 */

export const postSyllabusItems = function (data) {
  return request({
    url: ftmUrl + `/syllabusItems`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 大纲管理修改
 * }
 */

export const putSyllabusItemsId = function (data) {
  return request({
    url: ftmUrl + `/syllabusItems/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 大纲管理删除
 * }
 */

export const deleteSyllabusItemsId = function (data) {
  return request({
    url: ftmUrl + `/syllabusItems/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 大纲管理批量删除
 * }
 */

export const postSyllabusItemsBatchDelete = function (data) {
  return request({
    url: ftmUrl + `/syllabusItems/batchDelete`,
    method: 'post',
    data,
  })
}
/**
 * @param {
 * 获取剩余课时信息
 * }
 */

export const getResourcesCoursewareType = function (data) {
  return request({
    url: ftmUrl + `/syllabusItems/coursewareType/${data.id}`,
    method: 'get',
  })
}
/**
 * @param {
 * 大纲项目批量复制
 * }
 */

export const putSyllabusItemsCopy = function (
  data: {
    ids: number[]
    number: number
  },
  syllabusId: number,
) {
  return request({
    url: ftmUrl + `/syllabusItems/copys/${syllabusId}`,
    method: 'put',
    data,
  })
}
/**
 * @param {
 * 大纲项目批量删除
 * }
 */

export const postSyllabusesItemsBatchDelete = function (data: number[]) {
  return request({
    url: ftmUrl + `/syllabusItems/batchDelete`,
    method: 'post',
    data,
  })
}

/* ************** 训练机型 ******************* */
/**
 *
 * @param {
 * 机型列表
 * }
 */

export const getAirplaneTypesList = function (params: IFrom) {
  return request({
    url: url + `/airplaneTypes`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param {
 * 模板列表分页
 * }
 */
export interface TemplatesSyllabus extends PageBase {
  courseId?: number
  courseType?: courseType
  customerId?: number
  [_: string]: any
}
export const getTemplatesSyllabus = function (params: TemplatesSyllabus) {
  return request({
    url: url + `/templates/syllabuses`,
    method: 'get',
    params,
  })
}
/**
 *
 * @param 新增模板
 * @returns
 */
export const postTemplates = function (data: Syllabus.SyllabusTemplate) {
  return request({
    url: url + `/templates`,
    method: 'post',
    data,
  })
}
/**
 *
 * @param 修改模板
 * @returns
 */
export const putTemplates = function (params: Syllabus.SyllabusTemplate) {
  const { id, ...data } = params
  return request({
    url: url + `/templates/${id}`,
    method: 'put',
    data,
  })
}
/**
 *
 * @param 模板排序
 * @returns
 */
export const putTemplatesSort = function (data: { ids: number[] }) {
  return request({
    url: url + `/templates/sort`,
    method: 'put',
    data,
  })
}
/**
 *
 * @param 删除模板
 * @returns
 */
export const deleteTemplates = function (id: number) {
  return request({
    url: url + `/templates/${id}`,
    method: 'delete',
  })
}
/**
 *
 * @param 大纲下的模板列表
 * @returns
 */
export const getTemplatesSyllabusId = function (syllabusId: number) {
  return request({
    url: url + `/templates/${syllabusId}`,
    method: 'get',
  })
}
/**
 *
 * @param 面板上的班级的模板
 * @returns
 */
export const getTemplatesClazz = function (clazzId: number) {
  return request({
    url: url + `/templates/clazz/${clazzId}`,
    method: 'get',
  })
}
/**
 *
 * @param 面板上的模板排课
 * @returns
 */
export const putScheduleTemplate = function (params: {
  clazzId: number
  templateId: number
  resourceId: number
  resourceTypeId: number
  start: string
  groupName: string
}) {
  const { clazzId, templateId, groupName, ...data } = params
  return request({
    url: url + `/templates/scheduleTemplate/${clazzId}/${templateId}/${groupName}`,
    method: 'put',
    data,
  })
}
/**
 *
 * @param 面板上的模板撤销
 * @returns
 */
export const putScheduleTemplateCancel = function (params: {
  clazzId: number
  templateId: number
  groupName: string
  clearTeacher: boolean
}) {
  const { clazzId, templateId, groupName, clearTeacher } = params
  return request({
    url:
      url +
      `/templates/scheduleTemplate/cancel/${clazzId}/${templateId}/${groupName}/${clearTeacher}`,
    method: 'put',
  })
}
