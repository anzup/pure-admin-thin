export function removeEmptyProp<T = any>(data: T) {
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      for (const item of data) {
        removeEmptyProp(item)
      }
    } else {
      for (const key in data) {
        if (data[key] === null || data[key] === undefined || (data[key] as any) === '') {
          delete data[key]
        } else if (typeof data[key] === 'object') {
          if (Object.keys(data[key]).length === 0) {
            delete data[key]
          } else {
            removeEmptyProp(data[key])
          }
        }
      }
    }
  }
}
