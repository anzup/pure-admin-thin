import mitt from 'mitt'
import { TransactionRecords } from '/@/api/transactionRecords'

const emitter = mitt()

const key = Symbol()

let lastChangeDetail: TransactionRecords

export function setDetailChange(data: TransactionRecords) {
  lastChangeDetail = data
  emitter.emit(key, lastChangeDetail)
}

export function listenerDetailChange(
  callback: (data: TransactionRecords) => void,
  immediate = true,
) {
  emitter.on(key, callback)
  immediate && lastChangeDetail && callback(lastChangeDetail)
}

export function removeDetailChangeListener() {
  emitter.all.clear()
}
