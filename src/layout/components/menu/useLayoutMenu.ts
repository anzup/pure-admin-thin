import type { Menu } from '/@/router/types'
import { watch, unref, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useThrottleFn } from '@vueuse/core'
import { useMenuSetting } from '/@/hooks/settings/useMenuSetting'
import { getChildrenMenus, getCurrentParentPath, getMenus, getShallowMenus } from '/@/router/menus'
import { usePermissionStore } from '/@/store/modules/permission'

import { MenuModeEnum } from '/@/enums/menuEnum'

export function useSplitMenu() {
  // Menu array
  const menusRef = ref<Menu[]>([])
  const { currentRoute } = useRouter()

  const permissionStore = usePermissionStore()
  const { getIsMix, getMenuType, getIsMobile } = useMenuSetting()

  const throttleHandleSplitLeftMenu = useThrottleFn(handleSplitLeftMenu, 50)

  const splitNotLeft = computed(() => false)

  const getSplitLeft = computed(() => getIsMix.value)

  const getSpiltTop = computed(() => false)

  const normalType = computed(() => {
    return !getIsMix.value
  })

  watch(
    [() => unref(currentRoute).path, () => unref(getMenuType)],
    async ([path]: [string, MenuModeEnum]) => {
      if (unref(splitNotLeft) || unref(getIsMobile)) return

      const { meta } = unref(currentRoute)
      const currentActiveMenu = meta.currentActiveMenu as string
      let parentPath = await getCurrentParentPath(path)
      if (!parentPath) {
        parentPath = await getCurrentParentPath(currentActiveMenu)
      }
      parentPath && (await throttleHandleSplitLeftMenu(parentPath))
    },
    {
      immediate: true,
    },
  )

  // Menu changes
  watch(
    [() => permissionStore.getLastBuildMenuTime],
    () => {
      genMenus()
    },
    {
      immediate: true,
    },
  )

  // split Menu changes
  watch(getIsMix, (val) => {
    if (!val) return
    genMenus()
  })

  // Handle left menu split
  async function handleSplitLeftMenu(parentPath: string) {
    if (unref(getSplitLeft) || unref(getIsMobile)) return

    // spilt mode left
    const children = await getChildrenMenus(parentPath)

    if (!children || !children.length) {
      menusRef.value = []
      return
    }

    menusRef.value = children
  }

  // get menus
  async function genMenus() {
    // normal mode
    if (unref(normalType) || unref(getIsMobile)) {
      menusRef.value = await getMenus()
      return
    }

    // split-top
    if (unref(getSpiltTop)) {
      const shallowMenus = await getShallowMenus()

      menusRef.value = shallowMenus
      return
    }
  }

  return { menusRef }
}
