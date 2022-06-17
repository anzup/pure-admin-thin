// noinspection AllyPlainJsInspection

import { AxiosResponse } from 'axios'

export const judgePage = (total, pageObj, num = 1) => {
  const totalPge = Math.ceil((total - num) / pageObj.size)
  const currentPage = pageObj.page > totalPge ? totalPge : pageObj.page
  return currentPage < 1 ? 1 : currentPage
}
export const setPage = (total, pageObj) => {
  const totalPge = Math.ceil(total / pageObj.size)
  const currentPage = pageObj.page > totalPge ? totalPge : pageObj.page
  return currentPage < 1 ? 1 : currentPage
}

export function convertResBlob(response: AxiosResponse) {
  // 提取文件名
  const fileName = response.headers['content-disposition'].match(/filename\*=(.*)/)[1]
  // 将二进制流转为blob
  const blob = new Blob([response.data], {
    type: 'application/octet-stream',
  })
  if (typeof (window.navigator as any).msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    ;(window.navigator as any).msSaveBlob(blob, decodeURI(fileName))
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(fileName))
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}

/**
 * 返回字符串的字节半角长度
 */
export function getBytesLength(str) {
  if (typeof str !== 'string') {
    return 0
  }
  let realLength = 0
  let charCode = -1
  for (let i = 0; i < str.length; i++) {
    charCode = str.charCodeAt(i)
    if (charCode > 0 && charCode <= 128) {
      realLength += 1
    } else {
      realLength += 2
    }
  }
  return realLength
}

/**
 * 按字节数剪切
 */
export function sliceBytesLength(string, endIndex) {
  let end = 0
  let realLength = 0
  let charCode = -1
  for (let i = 0; i < string.length; i++) {
    if (realLength < endIndex) {
      end++
      charCode = string.charCodeAt(i)
      if (charCode > 0 && charCode <= 128) {
        realLength += 1
      } else {
        realLength += 2
      }
    }
  }
  const result = string.slice(0, end)
  return result
}

/**
 *
 * 把数组按照个数缩短并合并到一个对象里面组成新的数组
 *
 */
export function mergeArray(arr: any[], num: number) {
  return arr.reduce((prev, item, index) => {
    const obj = {}
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        obj[key + (index % num)] = item[key]
      }
    }
    index % num == 0 ? prev.push(obj) : Object.assign(prev[prev.length - 1], obj)

    return prev
  }, [])
}

// 获取token
export function getQueryVariable(variable: string) {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return undefined
}

// 排序处理
export function sortChange(
  value: {
    order: string
    property: string
  },
  defaultValue = { sort: ['id'], order: ['desc'] },
) {
  if (value) {
    defaultValue.sort.push(value.property)
    defaultValue.order.push(value.order)
  }
  return {
    sort: defaultValue.sort.join(),
    order: defaultValue.order.join(),
  }
}

//parameter:el具体元素、name样式属性名("width"、"background")
//return：el元素的样式属性name的值
export function getStyle(el, name) {
  if (el.style[name]) {
    return el.style[name]
  } else if (el.currentStyle) {
    return el.currentStyle[name]
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    name = name.replace(/[A-Z]/g, '-$1').toLowerCase()
    const attrObj = document.defaultView.getComputedStyle(el, null)
    if (attrObj) return attrObj.getPropertyValue(name)
  } else return null
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
    filename = Date.parse(new Date().toDateString()) + '.jpg'
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
 * file转base64
 */
export const blobToDataURL = (blob, cb) => {
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function (evt) {
    const base64 = evt.target.result
    cb(base64)
  }
}

/**
 * base64转为blob
 */

export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  console.log('转换完成')
  return new Blob([u8arr], { type: mime })
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
    const res = JSON.parse(reader.result as string)
    cb && cb(res)
  }
}

function downloadFile(url, name = "What's the fuvk") {
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('download', name)
  a.setAttribute('target', '_blank')
  const clickEvent = document.createEvent('MouseEvents')
  clickEvent.initEvent('click', true, true)
  a.dispatchEvent(clickEvent)
}

export function downloadFileByBase64(base64, name) {
  const myBlob = dataURLtoBlob(base64)
  const myUrl = URL.createObjectURL(myBlob)
  downloadFile(myUrl, name)
}

/**
 * 格式化筛选数组
 * @param arr 进行筛选过滤的数组
 * @param name 过滤的属性，若未传返回所有内容
 * @param rule 分隔符 默认','
 */
export function arrayFilterFormat(arr, name?: string, rule = ',') {
  if (!arr && !(arr instanceof Array)) return ''
  return (name && arr.map((v) => v[name]).join(rule)) || arr.join(rule)
}

/**
 * @function 数字转换为字符串
 * @param num number
 */
export const transformNumToDateStr = (num: number = 0): string => {
  if (typeof num === 'number') {
    if (num <= 0) {
      return '00:00:00'
    } else {
      let ss = num % 60
      let mm = ((num - ss) / 60) % 60
      let hh = parseInt(num / 3600) //小时
      return (
        (hh < 10 ? '0' + hh : hh) +
        ':' +
        (mm < 10 ? '0' + mm : mm) +
        ':' +
        (ss < 10 ? '0' + ss : ss)
      )
    }
  } else {
    return '00:00:00'
  }
}
