import { set } from 'lodash-es'

type LocaleType = string

export const loadLocalePool: LocaleType[] = []

export function setHtmlPageLang(locale: LocaleType) {
  document.querySelector('html')?.setAttribute('lang', locale)
}

export function setLoadLocalePool(cb: (loadLocalePool: LocaleType[]) => void) {
  cb(loadLocalePool)
}

export function genMessage(langs: Record<string, Record<string, any>>) {
  const obj: Recordable = {}
  Object.keys(langs).forEach((key) => {
    const langFileModule = langs[key].default
    const fileName = key.match(/([A-Za-z\d-_]+)\./i)[1]
    const keyList = fileName.split('/')
    const moduleName = keyList.shift()
    const objKey = keyList.join('.')

    if (moduleName) {
      if (objKey) {
        set(obj, moduleName, obj[moduleName] || {})
        set(obj[moduleName], objKey, langFileModule)
      } else {
        set(obj, moduleName, langFileModule || {})
      }
    }
  })
  console.log(obj)
  return obj
}
