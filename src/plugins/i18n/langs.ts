// element-plus国际化
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import twLocale from 'element-plus/lib/locale/lang/zh-tw'
import enLocale from 'element-plus/lib/locale/lang/en'
// vxe-table组件国际化
import zhVxeTable from 'vxe-table/lib/locale/lang/zh-CN'
import enVxeTable from 'vxe-table/lib/locale/lang/en-US'
import twVxeTable from 'vxe-table/lib/locale/lang/zh-TW'
import { genMessage } from '/@/plugins/i18n/utils'
import { siphonI18n } from './index'

// 项目内自定义国际化
const zhModules = import.meta.globEager('./zh-CN/**/*.ts')
const twModules = import.meta.globEager('./zh-TW/**/*.ts')
const enModules = import.meta.globEager('./en-US/**/*.ts')

const CN = {},
  TW = {},
  EN = {}
const AssignConfig = (configs, locale) => {
  for (let key of Object.keys(locale)) {
    configs.hasOwnProperty(key)
      ? (configs[key] = { ...configs[key], ...locale[key] })
      : (configs[key] = locale[key])
  }
}

AssignConfig(CN, genMessage(import.meta.globEager('../../../locales/zh-CN/*.y(a)?ml')))
AssignConfig(CN, siphonI18n(zhModules, 'zh-CN'))
AssignConfig(CN, zhLocale)
AssignConfig(CN, zhVxeTable)

AssignConfig(TW, genMessage(import.meta.globEager('../../../locales/zh-TW/*.y(a)?ml')))
AssignConfig(TW, siphonI18n(twModules, 'zh-TW'))
AssignConfig(TW, twVxeTable)
AssignConfig(TW, twLocale)

AssignConfig(EN, genMessage(import.meta.globEager('../../../locales/en/*.y(a)?ml')))
AssignConfig(EN, siphonI18n(enModules, 'en-US'))
AssignConfig(EN, enLocale)
AssignConfig(EN, enVxeTable)

console.log(CN);

export const localesConfigs = {
  'zh-CN': CN,
  'zh-TW': TW,
  en: EN,
  buttons: {
    confirm: '',
  },
}
