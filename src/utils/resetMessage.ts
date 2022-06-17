import { ElMessage, Message } from 'element-plus'

let messageInstance = null
const resetMessage = (options) => {
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = ElMessage(options)
}
;['error', 'success', 'info', 'warning'].forEach((type) => {
  resetMessage[type] = (options) => {
    if (typeof options === 'string') {
      options = {
        message: options,
      }
    }
    options.type = type
    return resetMessage(options)
  }
})
// console.log(resetMessage);

export const message: Message = resetMessage as any
