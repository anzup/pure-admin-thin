import {
  ElLoading,
  ElMessage,
  ElNotification,
  NotificationProps,
  ProgressProps,
} from 'element-plus'
import { AppContext, createVNode } from 'vue'
import Progress from './index.vue'
import { AxiosRequestConfig } from 'axios'

interface Props {
  fileUuid?: string
  publicDownload?: boolean
  requestConfig?: Omit<AxiosRequestConfig, 'onDownloadProgress'>
  loading?: boolean
  progress?: ProgressProps
  notification?: Omit<NotificationProps, 'message'>
}

export default (props: Props, context?: AppContext) => {
  if (!props.requestConfig && !props.fileUuid)
    return ElMessage.error('either fileUuid or Url must be filled in')
  let elLoading = undefined
  if (props.loading) {
    elLoading = ElLoading.service({
      lock: true,
      text: 'loading',
      background: 'rgba(255, 255, 255, 0.7)',
    })
  }
  const { notification, ...progressProps } = props
  const vm = createVNode(Progress, {
    ...progressProps,
    onClose: () => {
      el.close()
    },
  })
  const el = ElNotification(
    {
      duration: 0,
      message: vm,
      ...notification,
      onClose: () => {
        elLoading?.close()
        vm.component!.exposed?.close()
      },
    },
    // @ts-ignore
    context,
  )
  const close = () => {
    elLoading.close()
    el.close()
  }
  return { close }
}
