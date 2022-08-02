import request from '/@/utils/request/index'
const url = import.meta.env.VITE_BASE_API_FTM
// 部门
export const getDepartments = (params) =>
  request({
    url: url + '/departments',
    method: 'get',
    params,
  })
export const postDepartments = (data) =>
  request({
    url: url + '/departments',
    method: 'post',
    data,
  })
export const getDepartmentsId = (params) =>
  request({
    url: url + '/departments/' + params.id,
    method: 'get',
    params,
  })
export const putDepartmentsId = (data) =>
  request({
    url: url + '/departments/' + data.id,
    method: 'put',
    data,
  })
export const deleteDepartmentsId = (data) =>
  request({
    url: url + '/departments/' + data.id,
    method: 'delete',
    data,
  })
export const getDepartmentsAll = (params) =>
  request({
    url: url + '/departments/all',
    method: 'get',
    params,
  })

// 职员
export const getEmployees = (params) =>
  request({
    url: url + '/employees',
    method: 'get',
    params,
  })
export const postEmployees = (data) =>
  request({
    url: url + '/employees',
    method: 'post',
    data,
  })
export const getEmployeesId = (params) =>
  request({
    url: url + '/employees/' + params.id,
    method: 'get',
    params,
  })
export const putEmployeesId = (data) =>
  request({
    url: url + '/employees/' + data.id,
    method: 'put',
    data,
  })
export const deleteEmployeesId = (data) =>
  request({
    url: url + '/employees/' + data.id,
    method: 'delete',
    data,
  })
export const putEmployeesIdPassword = (data) =>
  request({
    url: url + `/employees/${data.id}/password`,
    method: 'put',
    data,
  })
export const getEmployeesAll = (params) =>
  request({
    url: url + '/employees/all',
    method: 'get',
    params,
  })
export const postEmployeesBatchDelete = (data) =>
  request({
    url: url + '/employees/batchDelete',
    method: 'post',
    data,
  })
export const postEmployeesProhibit = (data) =>
  request({
    url: url + '/employees/prohibit',
    method: 'post',
    data,
  })

// 职位
export const getRoles = (params) =>
  request({
    url: url + '/roles',
    method: 'get',
    params,
  })
export const postRoles = (data) =>
  request({
    url: url + '/roles',
    method: 'post',
    data,
  })
export const getRolesId = (params) =>
  request({
    url: url + '/roles/' + params.id,
    method: 'get',
    params,
  })
export const putRolesId = (data) =>
  request({
    url: url + '/roles/' + data.id,
    method: 'put',
    data,
  })
export const deleteRolesId = (data) =>
  request({
    url: url + '/roles/' + data.id,
    method: 'delete',
    data,
  })
export const getRolesAll = (params) =>
  request({
    url: url + '/roles/all',
    method: 'get',
    params,
  })

// 学员
export const getStudents = (params) =>
  request({
    url: url + '/students',
    method: 'get',
    params,
  })
export const postStudents = (data) =>
  request({
    url: url + '/students',
    method: 'post',
    data,
  })
export const getStudentsId = (params) =>
  request({
    url: url + '/students/' + params.id,
    method: 'get',
    params,
  })
export const putStudentsId = (data) =>
  request({
    url: url + '/students/' + data.id,
    method: 'put',
    data,
  })
export const deleteStudentsId = (data) =>
  request({
    url: url + '/students/' + data.id,
    method: 'delete',
    data,
  })
export const getStudentsAll = (params) =>
  request({
    url: url + '/students/all',
    method: params,
    params,
  })
export const putStudentsIdPassword = (data) =>
  request({
    url: url + `/students/${data.id}/resetPassword`,
    method: 'put',
    data,
  })
export const postStudentsBatchDelete = (data) =>
  request({
    url: url + '/students/batchDelete',
    method: 'post',
    data,
  })
export const postStudentsProhibit = (data) =>
  request({
    url: url + '/students/prohibit',
    method: 'post',
    data,
  })
// 批量结业
export const postStudentsGraduate = (data) =>
  request({
    url: url + '/students/graduate',
    method: 'post',
    data,
  })
// 获取当前用户基础设置信息
export const getNavigationBarId = (params) =>
  request({
    url: url + '/settings',
    method: 'get',
    params,
  })
