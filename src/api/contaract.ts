import { AxiosPromise } from "axios";
import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CPM;

/**
 * @function 合同信息分页列表
 */

export interface GetContracts extends PageBase {
  enabled?: boolean
  ids?: string
  customerTypeId?: number
  customerId?: number
  contractType: 'TRAINING' | 'OTHER'
}

export const getContracts = function (params: GetContracts): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/contracts`,
    method: 'get',
    params
  })
}
export const getContractsHistory = function (
  params: GetContracts
): AxiosPromise<DefaultPagingData> {
  return request({
    url: url + `/contracts/history`,
    method: 'get',
    params
  })
}

/**
 * @function 合同信息新增
 */

export interface ContractItem {
  /**@param dayOfAccommodation 住宿天数 */
  dayOfAccommodation: number
  /**@param dayOfDinner 用餐天数 */
  dayOfDinner: number
  /**@param dinners 用餐需求 */
  dinners: string[]
  /**@param discount 折扣比例 */
  discount: number
  id?: number
  /**@param needVehicle 用车需求 */
  needVehicle: boolean
  /**@param payType 结算方式 */
  payType: 'PRE' | 'POST'
  /**@param positionId 岗位 */
  positionId: number
  /**@param positionId 岗位名称 */
  positionName?: string
  /**@param price 单价 */
  price: number
  /**@param roomType 住宿需求 */
  roomType: 'NONE' | 'SINGLE' | 'DOUBLE' | 'MULTIPLE'
  /**@param trainingItemId 培训项目 */
  trainingItemId: number
  /**@param trainingTypeConfigId 培训类型*/
  trainingTypeConfigId: number
  /**@param composeId 自定义id 用于组合数据时使用 */
  composeId?: string
  [_: string]: any
}
export type ContractFacilities = Exclude<ContractItem, 'trainingItemId' | 'trainingTypeConfigId'>

export interface PostContracts {
  id?: number
  /**@param attachmentId 附件id */
  attachmentId: string
  /**@param autoRenew 自动续约 */
  autoRenew: boolean
  /**@param contractCourses 培训项目 */
  contractCourses: ContractItem[]
  /**@param contractFacilities 培训设施 */
  contractFacilities: ContractFacilities[]
  /**@param contractName 合同名称 */
  contractName: string
  /**@param contractNo 合同编号 */
  contractNo: string
  /**@param currency 结算货币 */
  currency: string
  /**@param customerId 客户 */
  customerId: number
  /**@param customerName 客户名称 */
  customerName?: number
  /**@param endDate 结束时间 */
  endDate: string
  /**@param operatorId 经办人 */
  operatorId: number
  /**@param operatorName 经办人名称 */
  operatorName?: string
  /**@param remark 备注 */
  remark: string
  /**@param signerId 签订人 */
  signerId: number
  /**@param signerName 签订人名称 */
  signerName?: string
  /**@param startDate 开始时间 */
  startDate: string
  /**@param contractType 合同类型 */
  contractType: 'TRAINING' | 'OTHER'
}

export const postContracts = function (data: PostContracts) {
  return request({
    url: url + `/contracts`,
    method: 'post',
    data
  })
}
/**
 * @function  合同信息修改
 */

export const putContracts = function (params: PostContracts) {
  const { id, ...data } = params
  return request({
    url: url + `/contracts/${id}`,
    method: 'put',
    data
  })
}
/**
 *@function 合同信息详情
 */
export const getContractDetail = function (id: number): AxiosPromise<PostContracts> {
  return request({
    url: url + `/contracts/${id}`,
    method: 'get'
  })
}
/**
 *@function 合同信息配置信息
 */
export const getContractConfigs = function (customerId: number): AxiosPromise<{
  positions: any[]
  trainingCategories: any[]
  trainingItems: any[]
  trainingTypeConfigs: any[]
  trainingTypes: any[]
}> {
  return request({
    url: url + `/contracts/configs/${customerId}`,
    method: 'get'
  })
}
/**
 *@function 合同信息删除
 */
export const deleteContract = function (id: number) {
  return request({
    url: url + `/contracts/${id}`,
    method: 'delete'
  })
}

/**
 * @function 合同信息批量删除
 */

export const postContractsBatchDelete = function (data: { ids: number[] }) {
  return request({
    url: url + `/contracts/batchDelete`,
    method: 'post',
    data
  })
}
/**
 * @function 合同信息上传附件
 */

export const postContractsUpload = function (data: FormData) {
  return request({
    url: url + `/contracts/upload`,
    method: 'post',
    data
  })
}
