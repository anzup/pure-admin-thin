const extentFns = ['add', 'sub', 'mul', 'div']
import { add, get } from 'xe-utils'

//运算函数
function ufunc(type, arg) {
  const decimalDigits = [] //要计算的小数位数数组
  //获取小数点的位数
  for (const index in arg) {
    let digit = 0
    try {
      digit = arg[index].toString().split('.')[1].length
    } catch (e) {
      digit = 0
    }
    decimalDigits.push(digit)
  }
  //找到最大的位数
  decimalDigits.sort((a, b) => a - b)
  const maxDigit = decimalDigits[decimalDigits.length - 1]
  const m = Math.pow(10, maxDigit) //小数转换成整数需要扩大的倍数
  let result = 0
  switch (type) {
    case 'add':
      for (const index in arg) {
        result += arg[index] * m
      }
      return result / m
      break
    case 'sub':
      for (const index in arg) {
        if (+index == 0) {
          result = arg[index] * m - result
        } else {
          result -= arg[index] * m
        }
      }
      return result / m
      break
    case 'mul':
      result = 1
      for (const index in arg) {
        if (+index == 0) {
          result = arg[index] * m * result
        } else {
          result *= arg[index] * m
        }
      }
      return result / m
      break
    case 'div':
      result = 1
      for (const index in arg) {
        if (+index == 0) {
          result = (arg[index] * m) / result
        } else {
          result /= arg[index] * m
        }
      }
      return result / m
      break
    default:
      break
  }
}
Math.ufunc = ufunc

//挂载到Math上
// Math.add1 = add1;
function expandMath() {
  for (let i = 0; i < extentFns.length; i++) {
    Math[extentFns[i]] = function () {
      return this.ufunc(extentFns[i], arguments)
    }
  }
}

const sumNum = (list: any[], field: string) => {
  let count = 0
  list.forEach((item) => {
    count = add(count, get(item, field, 0))
  })
  return count
}

export { expandMath, sumNum }
