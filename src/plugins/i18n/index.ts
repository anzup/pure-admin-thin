// 多组件库的国际化和本地项目国际化兼容
import { App, WritableComputedRef } from 'vue'
import { storageLocal } from '/@/utils/storage'
import { createI18n } from 'vue-i18n'

import { localesConfigs } from '/@/plugins/i18n/langs'

/**
 * 国际化转换工具函数（自动读取根目录locales文件夹下文件进行国际化匹配）
 * @param message message
 * @returns 转化后的message
 */
export function transformI18n(message: any = '') {
  if (!message) {
    return ''
  }

  // 处理存储动态路由的title,格式 {zh:"",en:""}
  if (typeof message === 'object') {
    const locale: string | WritableComputedRef<string> | any = i18n.global.locale
    return message[locale?.value]
  }

  const key = message.match(/(\S*)\./)?.[1]
  if (key && Object.keys(localesConfigs['zh-CN']).includes(key)) {
    return i18n.global.t.call(i18n.global.locale, message)
  } else if (!key && Object.keys(localesConfigs['en']).includes(message)) {
    // 兼容非嵌套形式的国际化写法
    return i18n.global.t.call(i18n.global.locale, message)
  } else {
    return message
  }
}

export const i18n: ReturnType<typeof createI18n> = createI18n({
  legacy: false,
  locale: storageLocal.getItem('-locale')?.locale ?? 'zh-CN',
  fallbackLocale: 'en',
  messages: localesConfigs,
})

export function useI18n(app: App) {
  app.use(i18n)
}
