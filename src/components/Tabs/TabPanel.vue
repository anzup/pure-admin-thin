<template>
  <div
    v-if="shouldBeRender"
    v-show="active"
    :id="`pane-${paneName}`"
    :aria-hidden="!active"
    :aria-labelledby="`tab-${paneName}`"
    class="d-tab-pane"
    role="tabpanel"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
  import {
    defineComponent,
    ref,
    computed,
    inject,
    getCurrentInstance,
    watch,
    markRaw,
    reactive,
  } from 'vue'
  import { eagerComputed } from '@vueuse/core'

  const COMPONENT_NAME = 'ElTabPane'

  export default defineComponent({
    name: COMPONENT_NAME,
    props: {
      label: {
        type: String,
        default: '',
      },
      name: {
        type: [String, Number],
        default: '',
      },
      lazy: Boolean,
    },
    setup(props) {
      const instance = getCurrentInstance()!
      const tabsRoot = inject<any>('tabsRootContextKey')
      if (!tabsRoot) return
      const index = ref<string>()
      const loaded = ref(false)
      const active = eagerComputed(() => tabsRoot.currentName.value === (props.name || index.value))
      const paneName = computed(() => props.name || index.value)
      const shouldBeRender = eagerComputed(() => !props.lazy || loaded.value || active.value)

      watch(active, (val) => {
        if (val) loaded.value = true
      })

      tabsRoot.updatePaneState(
        reactive({
          uid: instance.uid,
          instance: markRaw(instance),
          props,
          paneName,
          active,
          index,
        }),
      )

      return {
        active,
        paneName,
        shouldBeRender,
      }
    },
  })
</script>
