import { AxiosPromise } from "axios";
import request from "/@/utils/request";

const url = import.meta.env.VITE_BASE_API_CSM;

/**
 * @function 客户可用大纲列表
 */

export interface CustomerSyllabuse {
  children: CustomerSyllabuse[]
  id: number
  lastModifiedDate: string
  name: string
  operationTypes: string[]
  uuid: string
}

export const getCustomerSyllabuses = function (): AxiosPromise<
  CustomerSyllabuse[]
> {
  return request({
    url: url + `/customerSyllabuses`,
    method: 'get',
  })
}
export const getCustomerSyllabusesAirplaneTypes = function (): AxiosPromise<
  CustomerSyllabuse[]
> {
  return request({
    url: url + `/customerSyllabuses/airplaneTypes`,
    method: 'get',
  })
}
export const getCustomerSyllabusesAddible = function (
  customerId: number,
  positionId: number,
): AxiosPromise<CustomerSyllabuse[]> {
  return request({
    url: url + `/customerSyllabuses/addible/${customerId}/${positionId}`,
    method: 'get',
  })
}
export interface SyllabusApiData {
  customerId: number
  positionId: number
  trainingItemId: number
  trainingTypeConfigId: number
  airplaneTypes?:string
}
export const postCustomerSyllabuses = function (data: SyllabusApiData[]) {
  return request({
    url: url + `/customerSyllabuses`,
    method: 'post',
    data,
  })
}

/**
 *@function 删除
 */
export const deleteCustomerSyllabuses = function (params: SyllabusApiData) {
  const { customerId, positionId, trainingItemId, trainingTypeConfigId } =
    params
  return request({
    url:
      url +
      `/customerSyllabuses/${customerId}/${positionId}/${trainingItemId}/${trainingTypeConfigId}`,
    method: 'delete',
  })
}
