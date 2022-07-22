<template>
  <div
    :class="{ 'z-10': isActive }"
    class="relative items-center h-8 px-11 cursor-pointer -ml-9 text-center"
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
      :style="{ color: getColor, display: 'block', minWidth: '60px' }"
      class="relative whitespace-nowrap z-2 leading-8 transition-all duration-300 ease-in-out"
    >
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
  import useBoolean from '/@/hooks/useBoolean'

  import { SvgRadiusBg } from './components'
  import { computed } from 'vue'

  interface Props {
    /** 激活状态 */
    isActive?: boolean
    /** 主题颜色 */
    primaryColor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    isActive: false,
    primaryColor: '#fff',
    closable: true,
    darkMode: false,
    isLast: false,
  })

  const { bool: isHover, setTrue, setFalse } = useBoolean()
  const getColor = computed(() => {
    if (props.isActive) {
      return '#FFFFFF'
    } else if (isHover.value) {
      return 'var(--el-color-primary-light-9)'
    } else {
      return 'var(--el-color-primary)'
    }
  })
</script>
<style scoped></style>
