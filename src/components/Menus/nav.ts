import { computed, defineComponent, h } from 'vue'
import { NOOP } from '@vue/shared'
import { RouteRecordRaw } from 'vue-router'
import ChromeTab from '/@/components/ChromeTab/index.vue'
import { transformI18n } from '/@/plugins/i18n'

export const Nav = defineComponent({
  name: 'Nav',
  props: {
    panels: {
      type: Array as PropType<RouteRecordRaw[]>,
      default: () => [],
    },
    activePath: String,
    onTabClick: {
      type: Function as PropType<(router: any, path: string | number, ev: Event) => void>,
      default: NOOP,
    },
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
  setup(props, { slots, expose }) {
    return () => {
      const Tabs = props.panels.map((item) => {
        return h(
          ChromeTab,
          {
            class: 'd-nav-item',
            id: item.name,
            key: `tab-${String(item.name)}`,
            isActive: props.activePath == item.path,
            onClick: (event: MouseEvent) => {
              props.onTabClick(item, item.path, event)
            },
          },
          () => [transformI18n(item.meta.title, item.meta.i18n as boolean)],
        )
      })

      return h(
        'div',
        {
          class: ['d-rotuer-nav px-4 overflow-hidden'],
        },
        [
          h(
            'div',
            {
              class: ['flex'],
            },
            [Tabs],
          ),
        ],
      )
    }
  },
})
