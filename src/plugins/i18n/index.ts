// 多组件库的国际化和本地项目国际化兼容
import { App, WritableComputedRef } from 'vue'
import { storageLocal } from '/@/utils/storage'
import { createI18n } from 'vue-i18n'
import { set } from 'lodash-es'

import { localesConfigs } from '/@/plugins/i18n/langs'

/**
 * 国际化转换工具函数（自动读取根目录locales文件夹下文件进行国际化匹配）
 * @param message message
 * @returns 转化后的message
 */
export function transformI18n(message: any = '', translate = true) {
  if (!message) {
    return ''
  }

  if (!translate) {
    return message
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

/**
 * 从模块中抽取国际化
 * @param langs 存放国际化模块
 * @param prefix 语言 默认 zh-CN
 * @returns obj 格式：{模块名.**}
 */
export function siphonI18n(langs: Record<string, Record<string, any>>, prefix = 'zh-CN') {
  const langsObj: Recordable = {}
  Object.keys(langs).forEach((key: string) => {
    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '')
    fileName = fileName.substring(0, fileName.lastIndexOf('.'))
    const keyList = fileName.split('/')
    const moduleName = keyList.shift()
    const objKey = keyList.join('.')
    const langFileModule = langs[key].default

    if (moduleName) {
      if (objKey) {
        set(langsObj, moduleName, langsObj[moduleName] || {})
        set(langsObj[moduleName], objKey, langFileModule)
      } else {
        set(langsObj, moduleName, langFileModule || {})
      }
    }
  })
  return langsObj
}

// 此函数只是配合i18n Ally插件来进行国际化智能提示，并无实际意义（只对提示起作用），如果不需要国际化可删除
export const $t = (key: string) => key

export const i18n: ReturnType<typeof createI18n> = createI18n({
  legacy: false,
  locale: storageLocal.getItem('-locale')?.locale ?? 'zh-CN',
  fallbackLocale: 'en',
  messages: localesConfigs,
})

export function useI18n(app: App) {
  app.use(i18n)
}
