import { AxiosPromise } from 'axios'
import request from '/@/utils/request'

const url = import.meta.env.VITE_BASE_API_CPM

export interface GetConfigs extends PageBase {
  ids?: string
  name?: string
  names?: string
}
export const getConfigs = (params: GetConfigs): AxiosPromise<DefaultPagingData> =>
  request({
    url: url + '/configs',
    method: 'get',
    params,
  })

/**
 * @function  配置详情

 */

export const getConfigsDetail = function (id: number) {
  return request({
    url: url + `/configs/${id}`,
    method: 'get',
  })
}

/**
 * @function  配置新增

 */
export interface PostConfigs {
  name?: string
  value?: string
  valueType?: 'INT' | 'STRING' | 'DOUBLE' | 'FLOAT' | 'BOOLEAN'
  id?: number
}
export const postConfigs = function (data: PostConfigs) {
  return request({
    url: url + `/configs`,
    method: 'post',
    data,
  })
}

/**
 * @function  配置修改

 */

export const putConfigsId = function (params: PostConfigs) {
  const { id, ...data } = params
  return request({
    url: url + `/configs/${id}`,
    method: 'put',
    data,
  })
}

/**
 * @function  配置删除

 */

export const deleteConfigsId = function (id: number) {
  return request({
    url: url + `/configs/${id}`,
    method: 'delete',
  })
}

/**@interface 修改 */
export interface PutConfigs {
  id: number
  name?: string
  value?: string
  valueType?: string
}
/**@function 修改 */
export const putConfigs = (data: PutConfigs) =>
  request({
    url: `${url}/configs/${data.id}`,
    method: 'put',
    data,
  })
