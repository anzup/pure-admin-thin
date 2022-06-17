<template>
  <div
    class="w-full h-full relative flex items-center justify-center bg-gray-500 bg-opacity-30"
    @keydown.esc="emit('close')"
  >
    <span class="el-image-viewer__btn el-image-viewer__close" @click="emit('close')">
      <el-icon> <Close /> </el-icon>
    </span>
    <iframe :src="embedUrl" class="w-full h-full" />
  </div>
</template>

<script lang="ts" setup>
  import { Close } from '@element-plus/icons-vue'
  import { onMounted, onUnmounted } from 'vue'
  import { encode } from 'js-base64'
  import { previewURL } from '/@/api/file'

  interface Props {
    uuid: string
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    (e: 'close'): void
  }>()

  const close = (event: KeyboardEvent) => {
    if (event.code === 'Escape') emit('close')
  }

  const embedUrl = $computed(() => {
    return 'pdf/web/viewer.html?file=' + previewURL(props.uuid)
  })

  onMounted(() => {
    window.addEventListener('keyup', close)
  })
  onUnmounted(() => {
    window.document.removeEventListener('keyup', close)
  })
</script>

<style scoped></style>
