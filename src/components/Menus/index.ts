import { defineComponent, h, renderSlot, PropType } from 'vue'
import type { ExtractPropTypes } from 'vue'
import { isPromise, NOOP } from '@vue/shared'
import { emitter } from '/@/utils/mitt'

import { useRoute, useRouter } from 'vue-router'
import './index.scss'

import { Nav } from './nav'

export const menusProps = {
  beforeLeave: {
    type: Function as PropType<
      (
        newTabName: string | number,
        oldTabName: string | number,
      ) => void | boolean | Promise<void | boolean>
    >,
    default: () => true,
  },
}
export type MenusProps = ExtractPropTypes<typeof menusProps>
export const menusEmits = {}
export type MenusEmits = typeof menusEmits

export const Menus = defineComponent({
  name: 'Menus',
  props: menusProps,
  emits: menusEmits,
  setup(props, { emit, slots, expose }) {
    // 当前路由信息
    const route = useRoute()
    const router = useRouter()

    // 找到当前路由的父路由
    const parentRoutePath = route.fullPath.substring(0, route.fullPath.lastIndexOf('/'))
    // 当前路由表
    // const routes = store.wholeMenus.filter(v => v.path == route.fullPath.substring(0, route.fullPath.indexOf('\/', 1)))
    const routes = route.matched[0]?.children
      .find((v) => v.path == parentRoutePath)
      ?.children.filter((ee) => !ee.meta.isDetail)

    if (!routes) return
    const menuSelect = (indexPath: string): void => {
      let parentPath = ''
      let parentPathIndex = indexPath.lastIndexOf('/')
      if (parentPathIndex > 0) {
        parentPath = indexPath.slice(0, parentPathIndex)
      }
      // 找到当前路由的信息
      // eslint-disable-next-line no-inner-declarations
      function findCurrentRoute(routes) {
        return routes.map((item) => {
          if (item.path === indexPath) {
            // 切换左侧菜单 通知标签页
            emitter.emit('changLayoutRoute', {
              indexPath,
              parentPath,
            })
            // dynamicRouteTag(indexPath, parentPath)
          } else {
            if (item.children) findCurrentRoute(item.children)
          }
        })
      }

      findCurrentRoute(routes)
    }
    const changeCurrentName = (value: string) => {
      menuSelect(value)
      router.push(value)
    }
    const setCurrentName = (value: string) => {
      // should do nothing.
      const currentPath = route.fullPath
      if (currentPath === value) return

      const canLeave = props.beforeLeave?.(value, currentPath)
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

    const handleTabClick = (tab: any, path: string, event: Event) => {
      setCurrentName(path)
    }
    return () => {
      const panels = h('div', { class: 'd-menus__content' }, [renderSlot(slots, 'default')])

      return h(
        'div',
        {
          class: 'd-menus',
        },
        [
          h(Nav, {
            activePath: route.fullPath,
            panels: routes,
            onTabClick: handleTabClick,
          }),
          panels,
        ],
      )
    }
  },
})
