<template>
  <div class="w-72">
    <el-progress :percentage="percentage" :stroke-width="22" :text-inside="true" status="success" />
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue'
  import axios from 'axios'
  import request from '/@/utils/request'
  import { convertResBlob } from '/@/utils/utils'

  const pubUrl = import.meta.env.VITE_BASE_API_PUB

  interface Props {
    type?: string
    fileUuid?: string | string[]
    publicDownload?: boolean
    requestConfig?: any
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'line',
  })

  const emit = defineEmits<{
    (e: 'close'): void
  }>()

  let cancelAxios
  const percentage = ref(0)

  const downloadFile = () => {
    let CancelToken = axios.CancelToken
    const queryConfig = Object.assign(
      {
        url:
          pubUrl +
          (props.publicDownload
            ? `/open/${props.fileUuid}/download`
            : `/files/${props.fileUuid}/download`),
        method: 'get',
        timeout: 180000,
        responseType: 'blob',
        cancelToken: new CancelToken(function (c) {
          cancelAxios = c
        }),
        onDownloadProgress: function (e: ProgressEvent) {
          if (e.lengthComputable) {
            const rate = Number(e.loaded / e.total)
            if (rate < 1) {
              percentage.value = parseInt(rate * 100)
            } else {
              percentage.value = 100
            }
          }
        },
      },
      props.requestConfig ?? {},
    )
    request(queryConfig).then((res) => {
      convertResBlob(res)
      close()
    })
  }

  const cancelDownload = () => {
    cancelAxios && cancelAxios()
  }

  const close = () => {
    cancelDownload()
    nextTick(() => {
      emit('close')
    })
  }

  onMounted(() => {
    downloadFile()
  })
  defineExpose({ close })
</script>

<style lang="scss" scoped>
  .down {
    &-enter {
      &-from {
        transform: translate3d(0, -75px, 0);
        opacity: 0;
      }

      &-active {
        transition: all 0.5s;
      }

      &-to {
        transform: none;
        opacity: 1;
      }
    }
  }
</style>
