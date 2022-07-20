import { defineStore } from 'pinia'
import { store } from '/@/store'
import { getNavigationBarId } from '/@/api/ftm/teacher/account'
import { getConfigs } from '/@/api/ftm/teacher/systemSettings'
export interface SettingState {
  backgroundColor: string //	导航背景颜色
  fileUUID: string // logo UUID
  filialeId: number // 分公司id
  fontColor: string // 字体颜色
  iconUUID: string // icon UUID
  id: number
  lastModifiedDate: string // 修改时间
  operationTypes: string[] // 可操作类型
  others: string
  printUUID: string // print UUID
  systemName: string // 系统名称
  configs: any[] // 配置项
}

// 解析配置项字段值
const parseRowMethod = function (row) {
  switch (row.valueType.toLocaleLowerCase()) {
    case 'boolean':
      row.value = row.value ? row.value === 'true' : ''
      break
    case 'string':
      {
        try {
          if (row.value == !!row.value) {
            row.value = []
          } else if (JSON.parse(row.value) instanceof Array) {
            const list = JSON.parse(row.value)
            row.value = list.map((v) => ({ id: v.id || '', name: v.name || '' }))
          } else {
            row.value = []
          }
        } catch (e) {
          row.value = []
        }
      }
      break
  }
  return row
}

export const useFtmSettingsStore = defineStore({
  id: 'ftm-settings-store',
  state: (): SettingState => ({
    backgroundColor: '',
    fileUUID: '',
    filialeId: null,
    fontColor: '',
    iconUUID: '',
    id: null,
    lastModifiedDate: '',
    operationTypes: [],
    others: '',
    printUUID: '',
    systemName: '',
    configs: [],
  }),
  getters: {},
  actions: {
    SET_ATTRS(ob) {
      for (const [key, value] of Object.entries(ob)) {
        this[key] = value
      }
    },
    async getUserSettings() {
      await getNavigationBarId({})
        .then(async (res) => {
          this.SET_ATTRS(res.data)
          await this.getConfig()
          return Promise.resolve()
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    },
    async getConfig() {
      await getConfigs({}).then((res) => {
        this.SET_ATTRS({ configs: res.data.content.map((item) => parseRowMethod(item)) })
      })
    },
  },
})

export function useFtmSettingsStoreHook() {
  return useFtmSettingsStore(store)
}
