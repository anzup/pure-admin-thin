// noinspection AllyPlainJsInspection

import { AxiosPromise } from 'axios'
import request from '/@/utils/request'

const accountUrl = import.meta.env.VITE_BASE_API_ACCOUNT
// const opmUrl = import.meta.env.VITE_BASE_API_OPM
const url = import.meta.env.VITE_BASE_API_CPM

export type DegreeType =
  | 'HIGH_SCHOOL'
  | 'TECHNICAL_SECONDARY_SCHOOL'
  | 'ASSOCIATE_DEGREE'
  | 'BACHELOR_DEGREE'
  | 'MASTER_DEGREE'
  | 'DOCTOR_DEGREE'

export const getCurrentUserInfo = (): AxiosPromise<CurrentUserInfo> =>
  request<CurrentUserInfo>({
    url: url + '/users/current/userInfo',
    method: 'get',
  })
export const getSubsystemRoles = (params: {
  subsystem: string
}): AxiosPromise<DefaultAllListItem[]> =>
  request({
    url: url + '/users/current/subsystemRoles',
    method: 'get',
    params,
  })
export const getUserInfo = (userId: number) =>
  request({
    url: accountUrl + `/public/userInfo/${userId}`,
    method: 'get',
    // params
    headers: {
      Authorization: 'Basic aHVheXVleGluZzpodWF5dWV4aW5n',
    },
  })

/**@function getRoleUserInfo 获取当前职位下的角色信息 */
export const getRoleUserInfo = (
  roleId: number,
): AxiosPromise<{
  // 所有权限
  totalAuthorities: string[]
  selfAuthorities: string[]
  roleAuthorities: string[]
}> =>
  request({
    url: url + `/users/current/roleUserInfo`,
    method: 'get',
    params: {
      roleId,
    },
  })

export interface UserForm {
  password: string
  username: string
}

export interface LoginRes {
  access_token: string
  expires_in: string
  refresh_expires_in: string
  refresh_token: string
  token_type: string
}

export const login = (data: UserForm) =>
  request<LoginRes>({
    url: accountUrl + '/users/token',
    method: 'post',
    data,
  })

export const logout = () =>
  request({
    url: accountUrl + '/users/logout',
    method: 'post',
  })

/**
 *
 * @function  用户列表

 */
export interface GetUsers extends PageBase {
  customerId?: number
  roleId?: number
  prohibited?: boolean
  nationalityId?: number
  studentTypeId?: number
  teacherTypeId?: number
  teamId?: number
  //ADMIN,PLANNER,TEACHER,STUDENT,CUSTOMER_CONTACTER
  builtinRoles?: string
  builtinRolesNI?: string
  fromTrainingCenter?: boolean
}

export const getUsersList = function (params: GetUsers): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/users`,
    method: 'get',
    params,
  })
}

/**
 * 用户详情
 * }
 * @param params
 */

export const getUsersDetail = function (params) {
  return request({
    url: url + `/users/${params}`,
    method: 'get',
  })
}
/**
 * 用户新增
 * }
 * @param data
 */

export const postUsers = function (data) {
  return request({
    url: url + `/users`,
    method: 'post',
    data,
  })
}
/**
 * 用户修改
 * }
 * @param data
 */

export const putUsersId = function (data) {
  return request({
    url: url + `/users/${data.id}`,
    method: 'put',
    data,
  })
}
/**
 * 用户删除
 * }
 * @param data
 */

export const deleteUsersId = function (data) {
  return request({
    url: url + `/users/${data}`,
    method: 'delete',
  })
}
/**
 * 用户批量删除
 * }
 * @param data
 */
export const batchDeleteUsersId = function (data) {
  return request({
    url: url + `/users/batchDelete`,
    method: 'post',
    data,
  })
}
/**
 * 用户禁用启用
 * }
 * @param data
 */

export const postUsersProhibit = function (data) {
  return request({
    url: url + `/users/prohibit`,
    method: 'post',
    data,
  })
}
/**
 * 用户修改密码
 * }
 * @param data
 */

export const putUsersPassword = function (data: {
  oldPassword?: string
  password: string
  smsCode?: string
  id: number
}) {
  return request({
    url: url + `/users/${data.id}/password`,
    method: 'put',
    data,
  })
}
//修改用户签名
export const postSignature = function (params: { file: File; pinCode: string }) {
  const data = new FormData()
  data.append('file', params.file)
  data.append('pinCode', params.pinCode)
  return request({
    url: url + `/users/signature`,
    method: 'post',
    data,
  })
}

/**
 * @function putPinCode 修改pin码
 * */
export interface PutPinCode {
  forceChange?: boolean
  oldPinCode: string
  pinCode: string
  smsCode?: string
}

export const putPinCode = (data: PutPinCode) => {
  return request({
    url: url + `/users/pinCode`,
    method: 'put',
    data,
  })
}

/**
 * @function getSmsCode 获取验证码
 * */

export interface GetSmsCode {
  phone: string
  type: 'VERIFY_PHONE' | 'LOGIN'
}

export const getSmsCode = (data: GetSmsCode) =>
  request({
    url: accountUrl + `/users/smsCode`,
    method: 'post',
    data,
  })

/**
 * @function getSmsCode 获取验证码
 * */

export interface PostChangePassword {
  oldPassword?: string
  password: string
  smsCode?: string
}

export const postChangePassword = (data: PostChangePassword) =>
  request({
    url: url + `/users/changePassword`,
    method: 'post',
    data,
  })
