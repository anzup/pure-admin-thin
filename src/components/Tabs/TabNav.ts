import { h, defineComponent, ref, inject, computed, watch } from 'vue'
import { NOOP } from '@vue/shared'
import { useDocumentVisibility, useWindowFocus } from '@vueuse/core'
import ChromeTab from '/@/components/ChromeTab/index.vue'
import type { ExtractPropTypes, CSSProperties } from 'vue'

export interface Scrollable {
  next?: boolean
  prev?: number
}

export const tabNavProps = {
  panes: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  currentName: {
    type: [String, Number],
    default: '',
  },
  editable: Boolean,
  onTabClick: {
    type: Function as PropType<(tab: any, tabName: string | number, ev: Event) => void>,
    default: NOOP,
  },

  type: {
    type: String,
    values: ['card', 'border-card', ''],
    default: '',
  },
  stretch: Boolean,
}

export type TabNavProps = ExtractPropTypes<typeof tabNavProps>

const COMPONENT_NAME = 'ElTabNav'
export default defineComponent({
  name: COMPONENT_NAME,
  props: tabNavProps,

  setup(props, { expose }) {
    const visibility = useDocumentVisibility()
    const focused = useWindowFocus()

    const rootTabs = inject<any>('tabsRootContextKey')
    if (!rootTabs) return
    const navOffset = ref(0)
    const isFocus = ref(false)
    const focusable = ref(true)

    const nav$ = ref<HTMLDivElement>()

    const sizeName = computed(() =>
      ['top', 'bottom'].includes(rootTabs.props.tabPosition) ? 'width' : 'height',
    )
    const navStyle = computed<CSSProperties>(() => {
      const dir = sizeName.value === 'width' ? 'X' : 'Y'
      return {
        transform: `translate${dir}(-${navOffset.value}px)`,
      }
    })

    const setFocus = () => {
      if (focusable.value) isFocus.value = true
    }
    const removeFocus = () => (isFocus.value = false)

    watch(visibility, (visibility) => {
      if (visibility === 'hidden') {
        focusable.value = false
      } else if (visibility === 'visible') {
        setTimeout(() => (focusable.value = true), 50)
      }
    })
    watch(focused, (focused) => {
      if (focused) {
        setTimeout(() => (focusable.value = true), 50)
      } else {
        focusable.value = false
      }
    })

    expose({
      removeFocus,
    })

    return () => {
      const tabs = props.panes.map((pane, index) => {
        const tabName = pane.props.name || pane.index || `${index}`
        pane.index = `${index}`

        const tabLabelContent = pane.instance.slots.label?.() || pane.props.label
        const tabindex = pane.active ? 0 : -1

        return h(
          ChromeTab,
          {
            class: ['tabs_item'],
            id: `tab-${tabName}`,
            key: `tab-${tabName}`,
            'aria-controls': `pane-${tabName}`,
            role: 'tab',
            'aria-selected': pane.active,
            ref: `tab-${tabName}`,
            isActive: pane.active,
            tabindex,
            onFocus: () => setFocus(),
            onBlur: () => removeFocus(),
            onClick: (ev: MouseEvent) => {
              removeFocus()
              props.onTabClick(pane, tabName, ev)
            },
          },
          () => [tabLabelContent],
        )
      })

      return h(
        'div',

        [
          h(
            'div',
            {
              class: ['flex'],
              ref: nav$,
              style: navStyle.value,
              role: 'tablist',
            },
            [tabs],
          ),
        ],
      )
    }
  },
})
