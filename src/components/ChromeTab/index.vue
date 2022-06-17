<template>
  <div
    :class="{ 'z-10': isActive }"
    class="relative items-center h-8 px-11 cursor-pointer -ml-9 text-center"
    style="min-width: 150px"
    @mouseenter="setTrue"
    @mouseleave="setFalse"
  >
    <!-- 'z-10': isHover  -->
    <div class="absolute left-0 top-0 h-full overflow-hidden">
      <svg-radius-bg
        :is-active="isActive"
        :is-hover="isHover"
        :primary-color="primaryColor"
        class="h-full w-full"
      />
    </div>
    <span
      :style="{ color: isActive || isHover ? '#215ebe' : '#333' }"
      class="relative whitespace-nowrap z-2 leading-8 transition-all duration-300 ease-in-out"
    >
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
  import useBoolean from '/@/hooks/useBoolean'

  import { SvgRadiusBg } from './components'

  interface Props {
    /** 激活状态 */
    isActive?: boolean
    /** 主题颜色 */
    primaryColor?: string
  }

  withDefaults(defineProps<Props>(), {
    isActive: false,
    primaryColor: '#fff',
    closable: true,
    darkMode: false,
    isLast: false,
  })

  const { bool: isHover, setTrue, setFalse } = useBoolean()
</script>
<style scoped></style>
