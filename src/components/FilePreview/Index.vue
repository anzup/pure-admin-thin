<template>
  <teleport :disabled="teleport" to="body">
    <div
      v-if="isShow"
      :style="{ zIndex: ZIndex }"
      class="absolute w-full h-full flex items-center justify-center select-none"
    >
      <component :is="showComponent" />
    </div>
  </teleport>
</template>

<script lang="ts" setup>
  import { defineComponent, h, watch } from 'vue'
  import { ElImageViewer, ElMessage, useZIndex } from 'element-plus'
  import { previewURL } from '/@/api/file'
  import 'element-plus/theme-chalk/el-image-viewer.css'
  import { useVModel } from '@vueuse/core'
  import Player from './components/VideoPlayer.vue'
  import Audio from './components/AudioPlayer.vue'
  import Office from './components/OfficePreview.vue'
  import Pdf from './components/PdfPreview.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  interface Props {
    teleport?: boolean
    modelValue: boolean
    fileUuid: string
    suffix: string
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
  }>()
  //获取zIndex
  const ZIndex = useZIndex().currentZIndex.value

  //是否显示预览组件
  let isShow = $(useVModel(props, 'modelValue', emit))

  const showComponent = $computed(() => {
    switch (props.suffix) {
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
      case '.bmp':
        return ImagePreview
      case '.avi':
      case '.mp4':
      case '.rmvb':
      case '.flv':
      case '.mov':
      case '.m2v':
      case '.mkv':
      case '.wmv':
        return VideoPlayer
      case '.mp3':
      case '.wav':
      case '.wma':
        return AudioPlayer
      case '.xls':
      case '.xlsx':
      case '.doc':
      case '.docx':
      case '.text':
      case '.ppt':
        return OfficePlayer
      case '.pdf':
        return PdfPlayer

      default:
        return
    }
  })

  const onClose = () => {
    isShow = false
  }
  const VideoPlayer = defineComponent({
    render() {
      return h(Player, {
        uuid: props.fileUuid,
        onClose,
      })
    },
  })
  const AudioPlayer = defineComponent({
    render() {
      return h(Audio, {
        uuid: props.fileUuid,
        onClose,
      })
    },
  })
  const OfficePlayer = defineComponent({
    render() {
      return h(Office, {
        uuid: props.fileUuid,
        onClose,
      })
    },
  })
  const PdfPlayer = defineComponent({
    render() {
      return h(Pdf, {
        uuid: props.fileUuid,
        onClose,
      })
    },
  })

  //  图片预览组件
  const ImagePreview = defineComponent({
    render() {
      return h(ElImageViewer, {
        urlList: [previewURL('16f8cd347f834c809f282b893017882e')],
        onClose,
      })
    },
  })
  watch($$(isShow), (val) => {
    if (val) {
      if (!showComponent) {
        ElMessage.error(t('message.fileDoesNotSupportPreview'))
        isShow = false
      }
    }
  })
</script>

<style scoped></style>
