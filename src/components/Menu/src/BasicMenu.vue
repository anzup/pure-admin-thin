<template>
  <el-menu
    ref="menu"
    :default-active="menuState.selectedPath"
    :mode="mode"
    :router="router"
    :unique-opened="accordion"
    @select="handleMenuClick"
  >
    <template v-for="item in items" :key="item.path">
      <sidebar-item :base-path="item.path" :item="item" class="outer-most" />
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
  import { defineProps, reactive, ref, toRefs, unref } from 'vue'
  import { basicProps } from '/@/components/Menu/src/props'
  // import BasicSubMenuItem from './components/BasicSubMenuItem.vue'
  import { isFunction } from '/@/utils/is'
  import { MenuState } from '/@/components/Menu/src/types'
  import SidebarItem from '../../../layout/components/sidebar/sidebarItem.vue'
  import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router'
  import { useOpenKeys } from '/@/components/Menu/src/useOpenKeys'
  import { REDIRECT_NAME } from '/@/router/constant'
  import { listenerRouteChange } from '/@/utils/mitt/routeChange'
  import { getCurrentParentPath } from '/@/router/menus'
  import { useMenuSetting } from '/@/components/Menu/hooks/useMenuSetting'

  const props = defineProps(basicProps)
  const emit = defineEmits<{
    (e: 'menuClick', data: any): void
  }>()

  const isClickGo = ref(false)
  const currentActiveMenu = ref('')

  const menuState = reactive<MenuState>({
    defaultSelectedKeys: [],
    openKeys: [],
    selectedPath: undefined,
    collapsedOpenKeys: [],
  })

  const { items, mode, accordion, router } = toRefs(props)

  const { getIsMixSidebar } = useMenuSetting()

  const { currentRoute } = useRouter()
  const { setOpenKeys } = useOpenKeys(menuState, items, mode as any, accordion)

  // const getIsTopMenu = computed(() => {
  //   const { type, mode } = props;
  //
  //   return (
  //     (type === MenuTypeEnum.TOP_MENU && mode === MenuModeEnum.HORIZONTAL) ||
  //     (props.isHorizontal && unref(getSplit))
  //   );
  // })

  listenerRouteChange((route) => {
    if (route.name === REDIRECT_NAME) return
    handleMenuChange(route)
    currentActiveMenu.value = route.meta?.currentActiveMenu as string

    if (unref(currentActiveMenu)) {
      menuState.selectedPath = unref(currentActiveMenu)
      setOpenKeys(unref(currentActiveMenu))
    }
  })

  async function handleMenuChange(route?: RouteLocationNormalizedLoaded) {
    if (unref(isClickGo)) {
      isClickGo.value = false
      return
    }
    const path: string = ((route || unref(currentRoute)).meta?.currentActiveMenu ||
      (route || unref(currentRoute)).path) as string
    await setOpenKeys(path)
    if (unref(currentActiveMenu)) return
    if (props.isHorizontal && unref(getIsMixSidebar)) {
      menuState.selectedPath = await getCurrentParentPath(path)
    } else {
      // const parentPaths = await getAllParentPath(props.items, path)
      // menuState.selectedKeys = parentPaths
    }
  }

  async function handleMenuClick(index: string, indexPath: string[]) {
    const { beforeClickFn } = props
    if (beforeClickFn && isFunction(beforeClickFn)) {
      const flag = await beforeClickFn(index)
      if (!flag) return
    }
    emit('menuClick', index)

    isClickGo.value = true
    menuState.selectedPath = index
    menuState.defaultSelectedKeys = indexPath
  }
</script>

<style scoped></style>
