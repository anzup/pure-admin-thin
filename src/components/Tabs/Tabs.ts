import {
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  nextTick,
  onMounted,
  onUpdated,
  provide,
  ref,
  renderSlot,
  watch,
  PropType,
} from 'vue'
import { isPromise, NOOP } from '@vue/shared'
import './index.scss'

import TabNav from './TabNav'

import type { Component, ComponentInternalInstance, VNode, ExtractPropTypes, Ref } from 'vue'

export const tabsProps = {
  activeName: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  beforeLeave: {
    type: Function as PropType<
      (
        newTabName: string | number,
        oldTabName: string | number,
      ) => void | boolean | Promise<void | boolean>
    >,
    default: () => true,
  },
  stretch: Boolean,
}
export type TabsProps = ExtractPropTypes<typeof tabsProps>

export const tabsEmits = {
  'update:modelValue': (tabName: string | number) =>
    typeof tabName === 'string' || typeof tabName === 'number',
  ['input']: (tabName: string | number) =>
    typeof tabName === 'string' || typeof tabName === 'number',
  'tab-click': (pane: any, ev: Event) => ev instanceof Event,
}
export type TabsEmits = typeof tabsEmits

const getPaneInstanceFromSlot = (
  vnode: VNode,
  paneInstanceList: ComponentInternalInstance[] = [],
) => {
  const children = (vnode.children || []) as ArrayLike<VNode>
  Array.from(children).forEach((node) => {
    let type = node.type
    type = (type as Component).name || type
    if (type === 'ElTabPane' && node.component) {
      paneInstanceList.push(node.component)
    } else if (type === Fragment || type === 'template') {
      getPaneInstanceFromSlot(node, paneInstanceList)
    }
  })
  return paneInstanceList
}

export const Tabs = defineComponent({
  name: 'ElTabs',

  props: tabsProps,
  emits: tabsEmits,

  setup(props, { emit, slots, expose }) {
    const instance = getCurrentInstance()!
    const nav$ = ref<InstanceType<typeof TabNav>>()

    const panes: Ref<any[]> = ref([])
    const currentName = ref(props.modelValue || props.activeName || '0')

    const paneStatesMap: Record<number, any> = {}

    const updatePaneInstances = (isForceUpdate = false) => {
      if (slots.default) {
        const children = instance.subTree.children as ArrayLike<VNode>
        const content = Array.from(children).find(({ props }) => props?.class === 'd-tabs__content')
        if (!content) return

        const paneInstanceList: any[] = getPaneInstanceFromSlot(content).map(
          (paneComponent) => paneStatesMap[paneComponent.uid],
        )

        const panesChanged = !(
          paneInstanceList.length === panes.value.length &&
          paneInstanceList.every((pane, index) => pane.uid === panes.value[index].uid)
        )

        if (isForceUpdate || panesChanged) {
          panes.value = paneInstanceList
        }
      } else if (panes.value.length !== 0) {
        panes.value = []
      }
    }

    const changeCurrentName = (value: string | number) => {
      currentName.value = value
      emit('input', value)
      emit('update:modelValue', value)
    }

    const setCurrentName = (value: string | number) => {
      // should do nothing.
      if (currentName.value === value) return

      const canLeave = props.beforeLeave?.(value, currentName.value)
      if (isPromise(canLeave)) {
        canLeave.then(
          () => {
            changeCurrentName(value)
          },
          // ignore promise rejection in `before-leave` hook
          NOOP,
        )
      } else if (canLeave !== false) {
        changeCurrentName(value)
      }
    }

    const handleTabClick = (tab: any, tabName: string | number, event: Event) => {
      if (tab.props.disabled) return
      setCurrentName(tabName)
      emit('tab-click', tab, event)
    }

    onUpdated(() => updatePaneInstances())
    onMounted(() => updatePaneInstances())

    watch(
      () => props.activeName,
      (modelValue) => setCurrentName(modelValue),
    )

    watch(
      () => props.modelValue,
      (modelValue) => setCurrentName(modelValue),
    )

    watch(currentName, async () => {
      updatePaneInstances(true)
      await nextTick()
      await nav$.value?.$nextTick()

      // nav$.value?.scrollToActiveTab()
    })

    provide('tabsRootContextKey', {
      props,
      currentName,
      updatePaneState: (pane) => (paneStatesMap[pane.uid] = pane),
    })

    expose({
      currentName,
    })

    return () => {
      const header = h(
        'div',
        { class: ['d-tabs__header ', 'overflow-hidden'], style: 'padding:0 18px' },
        [
          h(TabNav, {
            currentName: currentName.value,
            panes: panes.value,
            ref: nav$,
            onTabClick: handleTabClick,
          }),
        ],
      )

      const panels = h('div', { class: 'd-tabs__content' }, [renderSlot(slots, 'default')])

      return h(
        'div',
        {
          class: {
            'd-tabs': true,
          },
        },
        [header, panels],
      )
    }
  },
})
