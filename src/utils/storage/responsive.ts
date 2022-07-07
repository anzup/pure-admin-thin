// 响应式storage
import { App } from 'vue'
import Storage from 'responsive-storage'

export const injectResponsiveStorage = (app: App, config: ServerConfigs) => {
  const configObj = {
    // 国际化 默认中文zh
    locale: {
      type: Object,
      default: Storage.getData(import.meta.env.VITE_APPNAME, 'locale') ?? {
        locale: config.Locale ?? 'zh-CN',
      },
    },
    // layout模式以及主题
    layout: {
      type: Object,
      default: Storage.getData(import.meta.env.VITE_APPNAME, 'layout') ?? {
        layout: config.Layout ?? 'vertical',
        theme: config.Theme ?? 'default',
        darkMode: config.DarkMode ?? false,
        sidebarStatus: config.SidebarStatus ?? true,
        epThemeColor: config.EpThemeColor ?? '#409EFF',
      },
    },
    configure: {
      type: Object,
      default: Storage.getData(import.meta.env.VITE_APPNAME, 'configure') ?? {
        grey: config.Grey ?? false,
        weak: config.Weak ?? false,
        hideTabs: config.HideTabs ?? false,
        showLogo: config.ShowLogo ?? true,
        showModel: config.ShowModel ?? '-smart',
        multiTagsCache: config.MultiTagsCache ?? false,
      },
    },
  }

  app.use(Storage, import.meta.env.VITE_APPNAME, configObj)
}
