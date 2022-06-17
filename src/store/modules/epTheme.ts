import { store } from '/@/store'
import { defineStore } from 'pinia'
import { getConfig } from '/@/config'
import { storageLocal } from '/@/utils/storage'

export const useEpThemeStore = defineStore({
  id: 'pure-epTheme',
  state: () => ({
    epThemeColor: storageLocal.getItem('-layout')?.epThemeColor ?? getConfig().EpThemeColor,
    epTheme: storageLocal.getItem('-layout')?.theme ?? getConfig().Theme,
  }),
  getters: {
    getEpThemeColor() {
      return this.epThemeColor
    },
    // 用于mix导航模式下hamburger-svg的fill属性
    fill() {
      if (this.epTheme === 'light') {
        return '#409eff'
      } else if (this.epTheme === 'yellow') {
        return '#d25f00'
      } else {
        return '#fff'
      }
    },
  },
  actions: {
    setEpThemeColor(newColor) {
      const layout = storageLocal.getItem('-layout')
      this.epTheme = layout?.theme
      this.epThemeColor = newColor
      layout.epThemeColor = newColor
      storageLocal.setItem('-layout', layout)
    },
  },
})

export function useEpThemeStoreHook() {
  return useEpThemeStore(store)
}
