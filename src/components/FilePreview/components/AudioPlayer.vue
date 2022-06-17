<template>
  <div
    class="w-full h-full relative flex items-center justify-center bg-gray-500 bg-opacity-30"
    @keydown.esc="emit('close')"
  >
    <span class="el-image-viewer__btn el-image-viewer__close" @click="emit('close')">
      <el-icon> <Close /> </el-icon>
    </span>
    <div class="h-3/5 w-2/3 flex flex-col justify-between items-center">
      <div></div>
      <div id="vs"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Close } from '@element-plus/icons-vue'
  import { nextTick, onMounted, onUnmounted } from 'vue'
  import 'xgplayer'
  import Music from 'xgplayer-music'
  import { previewURL } from '/@/api/file'

  interface Props {
    uuid: string
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    (e: 'close'): void
  }>()
  let xg = undefined
  const init = () => {
    if (!props.uuid) return

    // 文件类型为视频,初始化视频播放器,下一次更新再加载,确保元素已经存在
    nextTick(() => {
      xg = new Music({
        id: 'vs',
        url: [
          {
            src: previewURL(props.uuid),
            name: 'song01',
          },
        ],
        volume: 0.8,
        width: 900,
        height: 50,
        preloadNext: true,
        switchKeepProgress: false,
        abCycle: {
          start: 3,
          end: 9,
          loop: true,
        },
      })
    })
  }
  const close = (event: KeyboardEvent) => {
    if (event.code === 'Escape') emit('close')
  }
  onMounted(() => {
    init()
    window.addEventListener('keyup', close)
  })
  onUnmounted(() => {
    window.document.removeEventListener('keyup', close)
  })
</script>

<style scoped></style>
