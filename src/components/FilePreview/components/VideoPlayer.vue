<template>
  <div
    class="w-full h-full relative flex items-center justify-center bg-gray-500 bg-opacity-30"
    @keydown.esc="emit('close')"
  >
    <span class="el-image-viewer__btn el-image-viewer__close" @click="emit('close')">
      <el-icon> <Close /> </el-icon>
    </span>
    <div class="h-3/5 w-2/3 bg-amber-200">
      <div ref="videoRef"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Close } from '@element-plus/icons-vue'
  import { nextTick, onMounted, onUnmounted } from 'vue'
  import type XGPlayer from 'xgplayer'
  import Player from 'xgplayer/dist/simple_player'
  import volume from 'xgplayer/dist/controls/volume'
  import playbackRate from 'xgplayer/dist/controls/playbackRate'
  import { previewURL } from '/@/api/file'

  interface Props {
    uuid: string
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    (e: 'close'): void
  }>()
  let xg: InstanceType<typeof XGPlayer> = undefined
  let videoRef = $ref<HTMLElement>()
  const init = () => {
    if (!props.uuid) return
    if (!xg) {
      // 文件类型为视频,初始化视频播放器,下一次更新再加载,确保元素已经存在
      nextTick(() => {
        if (videoRef) {
          const playerOptions = {
            el: videoRef,
            url: previewURL(props.uuid),
            width: '100%',
            height: '100%',
            controlPlugins: [volume, playbackRate],
          }
          xg = new Player(playerOptions)
        }
      })
    } else {
      xg.src = `${import.meta.env.VITE_BASE_URL + import.meta.env.VITE_BASE_API_PUB}/open/${
        props.uuid
      }/inline`
    }
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
