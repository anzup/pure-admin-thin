<template>
  <div
    ref="bar$"
    :class="['el-tabs__active-bar', `is-${rootTabs.props.tabPosition}`]"
    :style="barStyle"
  />
</template>
<script lang="ts">
  import { defineComponent, inject, ref } from 'vue'

  const COMPONENT_NAME = 'ElTabBar'
  export default defineComponent({
    name: COMPONENT_NAME,
    props: {
      tabs: {
        type: Array as PropType<any[]>,
        default: () => [],
      },
    },

    setup() {
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
