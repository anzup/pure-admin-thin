import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'
import { App } from 'vue'
import { PDFDocument } from 'pdf-lib'

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  }
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature: string[] = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  window.open(url, target, feature.join(','))
}

/**
 * 格式化时间 传入单位：秒
 */
export function formatTime(time) {
  const second = time
  const days = Math.floor(second / 86400)
  const hours = Math.floor((second % 86400) / 3600)
  const minutes = Math.ceil(((second % 86400) % 3600) / 60)
  if (days > 0)
    return (
      days +
      this.$t('common.day') +
      hours +
      this.$t('common.hour') +
      minutes +
      this.$t('common.minutes')
    )
  else if (hours > 0) return hours + this.$t('common.hour') + minutes + this.$t('common.minutes')
  else if (minutes > 0) return minutes + this.$t('common.minutes')
}

/**
 * 参数判空
 */
export const deleteEmptyParams = function (obj) {
  Object.keys(obj).forEach((item) => {
    // 考虑值为false 0 特殊情况
    if (String(obj[item]) == '' || String(obj[item]) == 'undefined' || String(obj[item]) == 'null')
      delete obj[item]
  })
  return obj
}

/**
 * 防抖，delay时间内只能触发一次
 * @param {number} delay 单位毫秒
 */
export const debounce = function (fn, delay) {
  let timer = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timer) //清除定时器
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

/**
 * file转base64
 */
export const blobToDataURL = (blob, cb) => {
  const reader = new FileReader()
  reader.onload = function (evt) {
    const base64 = evt.target.result
    cb(base64)
  }
  reader.readAsDataURL(blob)
}

/**
 * base64转为blob
 */

export function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * 将base64转换为文件
 *
 */
export function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  if (!filename) {
    //若无文件名则取当前时间戳
    filename = Date.parse(new Date()) + '.jpg'
  }
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * arraybuffer转json
 */
export function arraybufferToJSON(arraybuffer, cb) {
  const content = arraybuffer //arraybuffer类型数据
  const resBlob = new Blob([content])
  const reader = new FileReader()
  reader.readAsText(resBlob, 'utf-8')
  reader.onload = () => {
    const res = JSON.parse(reader.result)
    cb && cb(res)
  }
}

/**
 * 格式化筛选数组
 * @param arr // 进行筛选过滤的数组
 * @param name// 过滤的属性，若未传返回所有内容
 * @param rule// 分隔符 默认','
 */
export function arrayFilterFormat(arr, name, rule = ',') {
  if (!arr && !(arr instanceof Array)) return ''
  return (name && arr.map((v) => v[name]).join(rule)) || arr.join(rule)
}

/**
 * 格式化ISO标准时间
 */
export function toISODateTime(dateTime) {
  const _date = new Date(dateTime)
  if (dateTime instanceof Date) {
    return dateTime.toISOString()
  } else if (Number.isNaN(_date.getTime())) {
    return ''
  } else {
    return _date.toISOString()
  }
}

/**
 * scorm 时间转化 PT12H10M00.00S
 */
export const convertTotalSeconds = function (str) {
  let H = 0,
    M = 0,
    S = 0
  let total = 0
  let mStr = ''
  const tmsp = str.split(/[\:T-]/)
  const tmsp1 = tmsp[1].split('H')

  if (tmsp1.length == 1) {
    mStr = tmsp1[0]
    H = 0
  } else {
    H = tmsp1[0]
    mStr = tmsp1[1]
  }
  const tmsp2 = mStr.split('M')
  if (tmsp2.length > 1) {
    M = tmsp2[0]
    S = tmsp2[1]
  } else {
    S = tmsp2[0]
    M = 0
  }
  total = +H * 3600 + +M * 60 + Number(S.substring(0, S.length - 1))
  return Number(total)
}

// 获取dom内联样式
export function getStyle(obj, attr) {
  try {
    if (obj.currentStyle) {
      return obj.currentStyle[attr]
    } else {
      return document.defaultView.getComputedStyle(obj, null)[attr]
    }
  } catch (e) {
    return 0
  }
}

// 拼接pdf
export async function mergePDF(pdfsToMerges, type) {
  const mergedPdf = await PDFDocument.create()
  const actions = pdfsToMerges.map(async (pdfBuffer) => {
    await (function () {
      return new Promise(function (reslove, reject) {
        blobToDataURL(new Blob([pdfBuffer], { type: 'application/pdf' }), async (url) => {
          const pdf = await PDFDocument.load(url)
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
          copiedPages.forEach((page) => {
            mergedPdf.addPage(page)
          })
          reslove()
        })
      })
    })()
  })
  await Promise.all(actions)
  const mergedPdfFile = await mergedPdf.save()
  const mergePdfBaseuri = await mergedPdf.saveAsBase64({ dataUri: true })
  return type == 'base64string' ? mergePdfBaseuri : mergedPdfFile
}

/**
 * 文件print 打印
 * @param {arraybuffer}}
 * @returns {print}
 */
export function doPrint(val) {
  const ordonnance = document.getElementById(val)?.contentWindow
  setTimeout(() => {
    ordonnance.print()
  }, 100)
}
/**
 * 文件print 转化
 * @param {arraybuffer}
 */
export function downLoadBlob(fileData) {
  if (!fileData) {
    return
  }

  const blob = new Blob([fileData], { type: 'application/pdf' })
  const date = new Date().getTime()
  const ifr = document.createElement('iframe')
  ifr.style.frameborder = 'no'
  ifr.style.display = 'none'
  ifr.style.pageBreakBefore = 'always'
  ifr.setAttribute('id', 'printPdf' + date)
  ifr.setAttribute('name', 'printPdf' + date)
  ifr.src = window.URL.createObjectURL(blob)
  document.body.appendChild(ifr)
  doPrint('printPdf' + date)
  window.URL.revokeObjectURL(ifr.src)
  // ifr.parentNode.removeChild(ifr)
}

/**
 * 文件下载读取文件流
 */
export function toExport(fileData) {
  if (!fileData.data) {
    return
  }
  // 处理返回的文件流
  const date =
    new Date().getFullYear() +
    '' +
    (new Date().getMonth() + 1) +
    '' +
    new Date().getDate() +
    '' +
    new Date().getHours() +
    '' +
    new Date().getMinutes() +
    '' +
    new Date().getSeconds() +
    '' +
    new Date().getMilliseconds()
  const contentDisposition = fileData.headers['content-disposition']
  let fileName = ''
  if (contentDisposition) {
    fileName = decodeURIComponent(contentDisposition).split('=')
  }
  if (window.navigator?.msSaveOrOpenBlob) {
    const blob = new Blob([fileData.data])
    window.navigator?.msSaveOrOpenBlob(
      blob,
      contentDisposition ? fileName[fileName.length - 1] : `${date}.xlsx`,
    )
  } else {
    const blob = new Blob([fileData.data])
    const downloadElement = document.createElement('a')
    const href = window.URL.createObjectURL(blob)
    downloadElement.href = href
    downloadElement.download = contentDisposition ? fileName[fileName.length - 1] : `${date}.xlsx`
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(href)
  }
}
