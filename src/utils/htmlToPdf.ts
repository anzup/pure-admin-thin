// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

const addPagination = function (_canvas, option) {
  try {
    const { x, y, w, h, pt, pl } = option
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = (w / 592.28) * 841.89
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.moveTo(pl, pt)
    ctx.lineTo(pl, canvas.height - pt)
    ctx.lineTo(w - pl, canvas.height - pt)
    ctx.lineTo(w - pl, pt)
    ctx.lineTo(pl, pt)
    ctx.clip()
    ctx.closePath()
    const clipWidth = w - pl * 2
    const clipHeight = (clipWidth / _canvas.width) * _canvas.height
    ctx.drawImage(_canvas, pl, y, clipWidth, clipHeight)
    const image = canvas.toDataURL('image/jpeg')

    return Promise.resolve({
      img: image,
      width: canvas.width,
      height: canvas.height,
      clientWidth: _canvas.width,
      clientHeight: (_canvas.width / clipWidth) * (canvas.height - pt * 2),
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

export const htmlToPdf = async function (dom, title = 'noname', type, cb, option = {}) {
  const quality = option.quality || 10
  const scale = option.scale || 2
  const padding = option.padding || 0
  const paddingTopBottom =
    padding instanceof Array
      ? padding.length > 1
        ? padding[0]
        : padding.length == 1
        ? padding[0]
        : 0
      : padding
  const paddingLeftRight =
    padding instanceof Array
      ? padding.length > 1
        ? padding[1]
        : padding.length == 1
        ? padding[0]
        : 0
      : padding
  new html2Canvas(dom, {
    allowTaint: true,
    quality: quality,
    scale: scale,
    useCORS: true,
    height: dom.offsetHeight,
    backgroundColor: '#ffffff',
    ignoreElements: (element) => {
      if (element.dataset.print == 'no') {
        return true
      }
      return false
    },
  }).then(async (canvas) => {
    const contentWidth = canvas.width
    const contentHeight = canvas.height
    const step = contentWidth / 592.28
    const pageWidth = contentWidth + step * paddingLeftRight * 2
    const pageHeight = step * 841.89 + step * paddingTopBottom * 2
    let leftHeight = (pageWidth / contentWidth) * contentHeight
    let position = paddingTopBottom * step
    const imgWidth = 595.28
    let imgHeight = (592.28 / contentWidth) * contentHeight
    imgHeight = 841.89
    // let pageData = canvas.toDataURL('image/jpeg', 1.0)
    const PDF = new JsPDF('', 'pt', 'a4')
    if (leftHeight < pageHeight) {
      const opt = {
        pt: paddingTopBottom * step,
        pl: paddingLeftRight * step,
        x: 0,
        y: position,
        w: pageWidth,
        h: pageHeight,
      }
      const { img, width, height } = await addPagination(canvas, opt)
      imgHeight = (imgWidth / width) * height
      PDF.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        const opt = {
          pt: paddingTopBottom * step,
          pl: paddingLeftRight * step,
          x: 0,
          y: position,
          w: pageWidth,
          h: pageHeight,
        }
        const { img, width, height, clientHeight } = await addPagination(canvas, opt)
        imgHeight = (imgWidth / width) * height
        PDF.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight)
        leftHeight -= clientHeight
        position -= clientHeight
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    if (!type) {
      // 下载
      PDF.save(title + '.pdf')
    } else {
      // 返回
      const file = PDF.output(type, title + '.pdf')
      cb && cb(file)
    }
  })
}
