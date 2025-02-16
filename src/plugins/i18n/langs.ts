import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import enLocale from 'element-plus/lib/locale/lang/en'
import { genMessage } from '/@/plugins/i18n/utils'
// vxe-table组件国际化
import zhVxeTable from 'vxe-table/lib/locale/lang/zh-CN'
// import zhTWVxeTable from 'vxe-table/lib/locale/lang/zh-TW'
import enVxeTable from 'vxe-table/lib/locale/lang/en-US'

export const localesConfigs = {
  'zh-CN': {
    ...genMessage(import.meta.globEager('../../../locales/zh-CN/*.y(a)?ml')),
    ...zhLocale,
    ...zhVxeTable,
  },
  en: {
    ...genMessage(import.meta.globEager('../../../locales/*.y(a)?ml')),
    ...enLocale,
    ...enVxeTable,
  },
  buttons: {
    confirm: '',
  },
}
