import { AxiosPromise } from 'axios'
import { RiskType } from '../enums/area';
import request from '/@/utils/request'
const url = import.meta.env.VITE_BASE_API_CPM

/**
 * 区域
 */
/**@interface 分页列表-区域 */
export interface GetAreas extends PageBase{
  ids?: string; // 	查询多个id,逗号分隔
  parentId?: number; // 上级区域id
}
/** @function 分页列表-区域 */
export const getAreas = (params: GetAreas): AxiosPromise => request({
  url: `${url}/areas`,
  method: 'get',
  params
})

/**@interface 新增-区域 */
export interface PostAreas{
  code?: string; // 编号
  name?: string; // 名称
  parent?: number; // 上级
}
/**@function 新增-区域 */
export const postAreas = (data: PostAreas): AxiosPromise => request({
  url: `${url}/areas`,
  method: 'post',
  data
})

/** @interface 批量删除-区域 */
export interface BatchDeleteAreas{
  ids?: number[]
}
/**@function 批量删除-区域 */
export const batchDeleteAreas = (data: BatchDeleteAreas): AxiosPromise => request({
  url: `${url}/areas/batchDelete`,
  method: 'post',
  data
})

/**@interface 详情-区域 */
export interface GetAreaDetails{
  id: number
}
/**@function 详情-区域 */
export const getAreaDetails = (params: GetAreaDetails): AxiosPromise => request({
  url: `${url}/areas/${params.id}`,
  method: 'get',
  params
})

/**@interface 修改-区域 */
export interface PutAreas{
  id: number;
  code?: string;
  name?: string;
}
/**@function 修改-区域 */
export const putAreas = (data: PutAreas): AxiosPromise => request({
  url: `${url}/areas/${data.id}`,
  method: 'put',
  data
})

/**@interface 删除-区域 */
export interface DeleteAreas{
  id: number;
}
/**@function 删除-区域 */
export const deleteAreas = (data: DeleteAreas): AxiosPromise => request({
  url: `${url}/areas/${data.id}`,
  method: 'delete',
  data
})

/**
 * 风险区域
 */
/**@interface 分页列表-风险区域 */
export interface GetRiskAreas extends PageBase{
  ids?: string;
  type?: RiskType;
}
/**@function 分页列表-风险区域 */
export const getRiskAreas = (params: GetRiskAreas): AxiosPromise => request({
  url: `${url}/riskAreas`,
  method: 'get',
  params
})

/**@interface 详情-风险区域 */
export interface GetRiskAreasDetail{
  id: number
}
/**@function 详情-风险区域 */
export const getRiskAreasDetail = (params: GetRiskAreasDetail): AxiosPromise => request({
  url: `${url}/riskAreas/${params.id}`,
  method: 'get',
  params
})

/**@interface 修改-风险区域-地区 */
export interface RiskArea{
  area?: string;
  type?: RiskType;
}
/**@interface 修改-风险区域 */
export interface PutRiskAreas{
  id: number;
  bos?: RiskArea[];
}
/**@function 修改-风险区域 */
export const putRiskAreas = (data: PutRiskAreas): AxiosPromise => request({
  url: `${url}/riskAreas/${data.id}`,
  method: 'put',
  data
})