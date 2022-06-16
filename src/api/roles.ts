import { AxiosPromise } from "axios";
import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 *
 * @param {
 * 职位列表
 * }
 */

export interface Roles extends PageBase {
  builtinRoleIN?: string;
  builtin?: boolean;
  builtinRoleNI?: string;
  idNI?: string;
  name?: string;
  fromTrainingCenter?: boolean;
}

export const getRolesList = function (
  params: Roles
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/roles`,
    method: "get",
    params
  });
};

/**
 * @param {
 * 职位详情
 * }
 */

export const getRolesDetail = function (params) {
  return request({
    url: url + `/roles/${params}`,
    method: "get"
  });
};

/**
 * @param {
 * 职位新增
 * }
 */

export const postRoles = function (data) {
  return request({
    url: url + `/roles`,
    method: "post",
    data
  });
};

/**
 * @param {
 * 职位修改
 * }
 */

export const putRolesId = function (data) {
  return request({
    url: url + `/roles/${data.id}`,
    method: "put",
    data
  });
};

/**
 * @param {
 * 职位删除
 * }
 */

export const deleteRolesId = function (data) {
  return request({
    url: url + `/roles/${data}`,
    method: "delete"
  });
};

/**
 * @param {
 * 职位批量删除
 * }
 */

export const postRolesBatchDelete = function () {
  return request({
    url: url + `/roles/batchDelete`,
    method: "post"
  });
};

/**
 *
 * @param {
 * 学员类型
 * }
 */

export const getStudentTypesList = function (params) {
  return request({
    url: url + `/studentTypes`,
    method: "get",
    params
  });
};
/**
 * @function 获取职位的权限列表
 **/
export interface RolesAuth {
  authCode: string;
  authorized: boolean;
  name: string;
  superiorAuthCode: string;
  superiorName: string;
}

export const getRolesAuthConfigs = function (id: number) {
  return request<RolesAuth[]>({
    url: url + `/roles/${id}/authConfigs`,
    method: "get"
  });
};
export const postRolesAuthConfigs = function (
  id: number,
  data: { authCode: string; authorized: boolean }[]
) {
  return request<RolesAuth[]>({
    url: url + `/roles/${id}/authConfigs`,
    method: "post",
    data
  });
};
