import request from '/@/utils/request'
import { transactionTypeEnum } from '/@/enums/transactionTypeEnum'
import { payMethodEnum } from '/@/enums/payMethodEnum'

const url = import.meta.env.VITE_BASE_API_LOGISTICS

/**
 *
 * @description 消费记录列表
 */

export type TransactionRecords = PageBase

export const getTransactionRecordsList = function (params: TransactionRecords) {
  return request<DefaultPagingData>({
    url: url + `/transactionRecord`,
    method: 'get',
    params,
  })
}

/**
 * @description  消费记录详情
 */

export const getTransactionRecordsDetail = function (id: number) {
  return request({
    url: url + `/transactionRecord/${id}`,
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
    url: url + `/transactionRecord`,
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
    url: url + `/transactionRecord/${data.id}`,
    method: 'put',
    data,
  })
}
