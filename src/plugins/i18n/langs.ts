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

export const localesConfigs = {
  'zh-CN': {
    ...genMessage(import.meta.globEager('../../../locales/zh-CN/*.y(a)?ml')),
    ...siphonI18n(zhModules, 'zh-CN'),
    ...zhLocale,
    ...zhVxeTable,
  },
  'zh-TW': {
    ...genMessage(import.meta.globEager('../../../locales/zh-TW/*.y(a)?ml')),
    ...siphonI18n(twModules, 'zh-TW'),
    ...twVxeTable,
    ...twLocale,
  },
  en: {
    ...genMessage(import.meta.globEager('../../../locales/en/*.y(a)?ml')),
    ...siphonI18n(enModules, 'en-US'),
    ...enLocale,
    ...enVxeTable,
  },
  buttons: {
    confirm: '',
  },
}
