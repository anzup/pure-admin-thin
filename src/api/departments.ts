import request from '/@/utils/request'
import { DepartmentEnum } from '/@/enums/departmentEnum'

const url = import.meta.env.VITE_BASE_API_LOGISTICS

/**
 *
 * @description 部门列表
 */

export interface Departments extends PageBase {
  subsystem?: DepartmentEnum
}

export const getDepartmentsList = function (params: Departments) {
  return request<DefaultPagingData>({
    url: url + `/departments`,
    method: 'get',
    params,
  })
}

/**
 * @description  部门详情
 */

export const getDepartmentsDetail = function (params) {
  return request({
    url: url + `/departments/${params}`,
    method: 'get',
  })
}

/**
 * @description  部门新增
 */

export interface PostDepartment {
  name: string
  subsystem: string
}

export const postDepartments = function (data) {
  return request({
    url: url + `/departments`,
    method: 'post',
    data,
  })
}

/**
 * @description  部门修改
 */

export const putDepartmentsId = function (data) {
  return request({
    url: url + `/departments/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @description  部门删除

 */

export const deleteDepartmentsId = function (data) {
  return request({
    url: url + `/departments/${data}`,
    method: 'delete',
  })
}

/**
 * @description  部门批量删除
 */

export const postDepartmentsBatchDelete = function () {
  return request({
    url: url + `/departments/batchDelete`,
    method: 'post',
  })
}

/**
 * @description 获取部门的权限列表
 **/
export interface DepartmentsAuth {
  authCode: string
  authorized: boolean
  name: string
  superiorAuthCode: string
  superiorName: string
}

export const getDepartmentsAuthConfigs = function (id: number) {
  return request<DepartmentsAuth[]>({
    url: url + `/departments/${id}/authConfigs`,
    method: 'get',
  })
}
export const postDepartmentsAuthConfigs = function (
  id: number,
  data: { authCode: string; authorized: boolean }[],
) {
  return request<DepartmentsAuth[]>({
    url: url + `/departments/${id}/authConfigs`,
    method: 'post',
    data,
  })
}
