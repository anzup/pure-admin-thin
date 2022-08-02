<template>
  <teleport to="body" :disabled="teleport">
    <div
      v-if="isShow"
      :style="{ zIndex: ZIndex }"
      class="fixed top-0 w-screen h-screen flex items-center justify-center select-none bg-gray-800 bg-opacity-30"
      @click.self="close"
    >
      <div class="h-4/5 w-4/5 bg-white">
        <VueSignaturePad
          width="100%"
          height="100%"
          ref="signaturePad"
          :options="options"
          :customStyle="style"
        />
        <div class="text-center mt-4">
          <el-button @click="close">{{ $t('button.cancel') }}</el-button>
          <el-button @click="reset">{{ $t('button.reset') }}</el-button>
          <el-button type="primary" @click="confirm">{{ $t('button.save') }}</el-button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  import { useZIndex } from 'element-plus'
  import 'element-plus/theme-chalk/el-image-viewer.css'
  import { useVModel } from '@vueuse/core'

  interface Props {
    teleport?: boolean
    modelValue: boolean
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'confirm', data: string): void
  }>()
  //获取zIndex
  const ZIndex = useZIndex().currentZIndex.value

  //是否显示预览组件
  let isShow = $(useVModel(props, 'modelValue', emit))
  const close = () => {
    isShow = false
  }
  let signaturePad = $ref<any>()
  const options = {
    dotSize: 1.5, // 笔头圆点大小
    minWidth: 0.8, // 最窄笔锋
    maxWidth: 2.5, // 最宽笔锋
    penColor: '#333', // 线条颜色
    backgroundColor: '#fff', // 画布颜色
  }
  const style = {
    border: '#ccc 1px solid',
  }
  const reset = () => {
    signaturePad?.clearSignature()
  }
  const confirm = () => {
    const { data } = signaturePad?.saveSignature()
    emit('confirm', data)
    close()
  }

  // watch($$(isShow), (val) => {
  //   if (val) {
  //   }
  // })
</script>

<style scoped></style>
