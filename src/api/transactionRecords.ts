import request from '/@/utils/request'
import { transactionTypeEnum } from '/@/enums/transactionTypeEnum'
import { payMethodEnum } from '/@/enums/payMethodEnum'

const url = import.meta.env.VITE_BASE_API_LOGISTICS

/**
 *
 * @description 消费记录列表
 */

export interface TransactionRecords extends PageBase {
  userId?: number
  userUserId?: number
  transactionType?: transactionTypeEnum
  canteenId?: number
  consumeCode?: string
  countConfigId?: number
  courseNumberId?: number
  courseNumberLK?: string
  departmentId?: number
  mealTimeId?: number
  trainingItemId?: number
  trainingItemLK?: string
  customerId?: number
  type?: payMethodEnum
  createdDateLE?: Date
  createdDateGE?: Date
}

export const getTransactionRecordsList = function (params: TransactionRecords) {
  return request<DefaultPagingData>({
    url: url + `/transactionRecords`,
    method: 'get',
    params,
  })
}

/**
 * @description  消费记录详情
 */

export const getTransactionRecordsDetail = function (id: number) {
  return request<DefaultPagingData>({
    url: url + `/transactionRecords/${id}`,
    method: 'get',
  })
}

/**
 * @description  消费记录新增
 */
export interface PostTransactionRecords {
  amount?: number
  balanceId?: number
  canteenId?: number
  countConfigId?: number
  courseNumber?: DefaultAllListItem
  customer?: DefaultAllListItem
  departmentId?: number
  endTime?: Date
  remark?: string
  startTime?: Date
  trainingItem?: DefaultAllListItem
  transactionType?: transactionTypeEnum
  type?: payMethodEnum
  userId?: number
}

export const postTransactionRecords = function (data: PostTransactionRecords) {
  return request({
    url: url + `/transactionRecords`,
    method: 'post',
    data,
  })
}
export const postTransactionRecordsBatch = function (data: PostTransactionRecords[]) {
  return request({
    url: url + `/transactionRecords/batchAdd`,
    method: 'post',
    data,
  })
}

/**
 * @description  消费记录修改
 */

export const putTransactionRecordsId = function (data) {
  return request({
    url: url + `/transactionRecords/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * @description  消费记录修改
 */
export interface ConsumeCodesUse {
  amount: number
  canteenId: number
  code: string
  type: string
}

export const postConsumeCodesUse = function (data: ConsumeCodesUse) {
  return request({
    url: url + `/transactionRecords/consumeCodes/use`,
    method: 'post',
    data,
  })
}

/**消费记录统计**/
export interface GetTransactionRecordStates {
  endTime: Date
  startTime: Date
  type: transactionTypeEnum
}

export const getTransactionRecordStates = (params: GetTransactionRecordStates) =>
  request({
    url: url + '/transactionRecords/stats',
    method: 'get',
    params,
  })
