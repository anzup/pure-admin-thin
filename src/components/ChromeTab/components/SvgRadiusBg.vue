<template>
  <svg>
    <defs>
      <symbol id="geometry-left" viewBox="0 0 214 36">
        <path
          d="M243,32V0H37.06A20.49,20.49,0,0,0,25.48,3c-3.48,2.28-5.8,7.32-8,13.53C12.4,31.19,2,32,2,32Z"
        />
      </symbol>
      <symbol id="geometry-right" viewBox="0 0 214 36">
        <use xlink:href="#geometry-left" />
      </symbol>
      <symbol id="bg-left" viewBox="0 0 214 36">
        <path
          d="M44,32V0H35.06A20.49,20.49,0,0,0,23.48,3c-3.48,2.28-5.8,7.32-8,13.53C10.4,31.19,0,32,0,32Z"
        />
      </symbol>
      <symbol id="bg-right" viewBox="0 0 214 36">
        <use xlink:href="#bg-left" />
      </symbol>
      <clipPath>
        <rect height="100%" width="100%" x="0" />
      </clipPath>
    </defs>
    <svg height="100%" width="52%">
      <use
        :fill="bgFill"
        class="transition-all duration-300 ease-in-out"
        height="36"
        width="214"
        xlink:href="#bg-left"
      />
      <use
        :fill="fill"
        class="transition-all duration-300 ease-in-out"
        height="36"
        width="214"
        xlink:href="#geometry-left"
      />
    </svg>
    <g transform="scale(-1, 1)">
      <svg height="100%" width="52%" x="-100%" y="0">
        <use
          :fill="bgFill"
          class="transition-all duration-300 ease-in-out"
          height="36"
          width="214"
          xlink:href="#bg-right"
        />
        <use
          :fill="fill"
          class="transition-all duration-300 ease-in-out"
          height="36"
          width="214"
          xlink:href="#geometry-right"
        />
      </svg>
    </g>
  </svg>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { mixColor } from '/@/utils/color'

  interface Props {
    /** 激活状态 */
    isActive?: boolean
    /** 鼠标悬浮状态 */
    isHover?: boolean
    /** 主题颜色 */
    primaryColor?: string
    /** 暗黑模式 */
    darkMode?: boolean
  }

  /** 填充的背景颜色： [默认颜色, 暗黑主题颜色] */
  type FillColor = [string, string]

  const props = withDefaults(defineProps<Props>(), {
    isActive: false,
    isHover: false,
    primaryColor: '#409EFF',
    darkMode: false,
  })

  const defaultColor: FillColor = ['#d7e1f2', '#18181c']
  const hoverColor: FillColor = ['#dee1e6', '#3f3c37']
  const mixColors: FillColor = ['#ffffff', '#000000']
  const bgDefaultColor: FillColor = ['#f8f8fa', '#18181c']

  const fill = computed(() => {
    const index = Number(props.darkMode)
    let color = defaultColor[index]
    if (props.isHover) {
      color = hoverColor[index]
    }
    if (props.isActive) {
      const alpha = props.darkMode ? 0.1 : 0.15
      color = mixColor(mixColors[index], props.primaryColor, alpha)
    }
    return color
  })

  const bgFill = computed(() => {
    const index = Number(props.darkMode)
    let color = bgDefaultColor[index]
    if (props.isHover) {
      color = hoverColor[index]
    }
    if (props.isActive) {
      const alpha = props.darkMode ? 0.1 : 0.15
      color = mixColor(mixColors[index], props.primaryColor, alpha)
    }
    return color
  })
</script>
<style scoped></style>
