import request from '/@/utils/request/opm'
const url = import.meta.env.VITE_BASE_API_OPM

/**
 *
 * @param {
 * 教学系统职位(教员类型查询接口)
 * }
 */

export const getFtmRolesAll = function () {
  return request({
    url: url + `/employees/ftm/roles`,
    method: 'get',
  })
}
/**
 *
 * @param {
 * 教员列表
 * }
 */
export interface IEmployees extends PageBase {
  builtinRole?: BuiltinRole
  isShowSignature?: boolean
  prohibited?: boolean
  workType?: WorkType
  excludeIds?: string
  enabled?: boolean
}
export const getEmployeesList = function (params: IEmployees) {
  return request({
    url: url + `/employees`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 教员详情
 * }
 */

export const getEmployeesDetail = function (params) {
  return request({
    url: url + `/employees/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 教员新增
 * }
 */

export const postEmployees = function (data) {
  return request({
    url: url + `/employees`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 教员修改
 * }
 */

export const putEmployeesId = function (data) {
  return request({
    url: url + `/employees/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 教员删除
 * }
 */

export const deleteEmployeesId = function (data) {
  return request({
    url: url + `/employees/${data}`,
    method: 'delete',
  })
}
/**
 * @param {
 * 教员启用/禁用
 * }
 */

export const postEmployeesProhibit = function (data: { ids: number[]; prohibited: boolean }) {
  return request({
    url: url + `/employees/prohibit`,
    method: 'post',
    data,
  })
}
/**
 * @param {
 * 教员删除
 * }
 */

export const postUsersProhibit = function (data: { ids: number[]; prohibited: boolean }) {
  return request({
    url: url + `/users/prohibit`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 教员批量删除
 * }
 */

export const postEmployeesBatchDelete = function () {
  return request({
    url: url + `/employees/batchDelete`,
    method: 'post',
  })
}

/**
 *
 * @param {
 * 参训人员列表
 * }
 */
export interface IStudentList {
  page: number
  size: number
  clazzId?: number | string
  customerIds?: number[] | string
  searchKey?: string
  excludeIds?: number[] | string
  contracts?: string
}
export const getStudentsList = function (params: IStudentList) {
  return request({
    url: url + `/students`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 参训人员详情
 * }
 */

export const getStudentsDetail = function (params) {
  return request({
    url: url + `/students/${params}`,
    method: 'get',
  })
}
/**
 * @param {
 * 参训人员训练历史
 * }
 */

export const getStudentScheduleHis = function (id: number) {
  return request({
    url: url + `/schedules/${id}/studentScheduleHis`,
    method: 'get',
  })
}

/**
 * @param {
 * 参训人员新增
 * }
 */

export const postStudents = function (data) {
  return request({
    url: url + `/students`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 参训人员修改
 * }
 */

export const putStudentsId = function (data) {
  return request({
    url: url + `/students/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 参训人员删除
 * }
 */

export const deleteStudentsId = function (data) {
  return request({
    url: url + `/students/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 参训人员批量删除
 * }
 */

export const postStudentsBatchDelete = function () {
  return request({
    url: url + `/students/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 参训人员批量结业
 * }
 */

export const postStudentsGraduate = function (data: {
  clazzId: number | string
  graduate: boolean
  ids: number[]
  ignoreNotFinished?: boolean
  graduateType?: 'ABNORMAL'
  graduateRemark?: 'ABNORMAL'
}) {
  return request({
    url: url + `/students/graduate`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getStudentsAll = function () {
  return request({
    url: url + `/students/all`,
    method: 'get',
  })
}
/**
 * @param {
 * 学员类型
 * }
 */

export const getStudentTypeAll = function () {
  return request({
    url: url + `/students/studentType`,
    method: 'get',
  })
}
/**
 * @param {
 * 下载模板
 * }
 */

export const getStudentsTemplate = function () {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `​/students​/import​/template`,
    method: 'get',
    responseType: 'blob',
    // headers: {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json; charset=utf-8',
    //   withCredentials: true,
    // },
  })
}
/**
 * @param {
 * 导入
 * }
 */

export const postStudentsImport = function (data) {
  return request({
    url: url + `/students/import`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 *
 * @param {
 * 职位列表
 * }
 */

export const getRolesList = function (params) {
  return request({
    url: url + `/roles`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 职位详情
 * }
 */

export const getRolesDetail = function (params) {
  return request({
    url: url + `/roles/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 职位新增
 * }
 */

export const postRoles = function (data) {
  return request({
    url: url + `/roles`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 职位修改
 * }
 */

export const putRolesId = function (data) {
  return request({
    url: url + `/roles/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 职位删除
 * }
 */

export const deleteRolesId = function (data) {
  return request({
    url: url + `/roles/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 职位批量删除
 * }
 */

export const postRolesBatchDelete = function () {
  return request({
    url: url + `/roles/batchDelete`,
    method: 'post',
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getRolesAll = function () {
  return request({
    url: url + `/roles/all`,
    method: 'get',
  })
}
/**
 * @param {
 * 职位属性下拉列表
 * }
 */

export const getRolesPropertyAll = function () {
  return request({
    // eslint-disable-next-line no-irregular-whitespace
    url: url + `/roles​/property`,
    method: 'get',
  })
}

/**
 *
 * @param {
 * 职员列表
 * }
 */

export const getStaffsList = function (params) {
  return request({
    url: url + `/staffs`,
    method: 'get',
    params,
  })
}

/**
 * @param {
 * 职员详情
 * }
 */

export const getStaffsDetail = function (params) {
  return request({
    url: url + `/staffs/${params}`,
    method: 'get',
  })
}

/**
 * @param {
 * 职员新增
 * }
 */

export const postStaffs = function (data) {
  return request({
    url: url + `/staffs`,
    method: 'post',
    data,
  })
}

/**
 * @param {
 * 职员修改
 * }
 */

export const putStaffsId = function (data) {
  return request({
    url: url + `/staffs/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 职员删除
 * }
 */

export const deleteStaffsId = function (data) {
  return request({
    url: url + `/staffs/${data}`,
    method: 'delete',
  })
}

/**
 * @param {
 * 职员批量删除
 * }
 */

export const postStaffsBatchDelete = function () {
  return request({
    url: url + `/staffs/batchDelete`,
    method: 'post',
  })
}
/**
 * @param {
 * 职员禁用启用
 * }
 */

export const postStaffsProhibit = function (data) {
  return request({
    url: url + `/staffs/prohibit`,
    method: 'post',
    data,
  })
}
/**
 * @param {
 * 职员修改密码
 * }
 */

export const postStaffsPassword = function (data: {
  oldPassword?: string
  password: string
  smsCode?: string
  id: number
}) {
  return request({
    url: url + `/staffs/${data.id}/password`,
    method: 'put',
    data,
  })
}

/**
 * @param {
 * 下拉列表
 * }
 */

export const getStaffsAll = function () {
  return request({
    url: url + `/staffs/all`,
    method: 'get',
  })
}
