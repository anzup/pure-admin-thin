<template>
  <div
    ref="bar$"
    :class="['el-tabs__active-bar', `is-${rootTabs.props.tabPosition}`]"
    :style="barStyle"
  ></div>
</template>
<script lang="ts">
  import { defineComponent, inject, getCurrentInstance, watch, nextTick, ref } from 'vue'
  import { capitalize } from '@vue/shared'
  import { useResizeObserver } from '@vueuse/core'

  import type { CSSProperties } from 'vue'

  const COMPONENT_NAME = 'ElTabBar'
  export default defineComponent({
    name: COMPONENT_NAME,
    props: {
      tabs: {
        type: Array as PropType<any[]>,
        default: () => [],
      },
    },

    setup(props) {
      const instance = getCurrentInstance()!
      const rootTabs = inject<any>('tabsRootContextKey')
      if (!rootTabs) return

      const bar$ = ref<HTMLDivElement>()
      const barStyle = ref()

      return {
        bar$,
        rootTabs,
        barStyle,
      }
    },
  })
</script>
