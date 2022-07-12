<template>
  <div :class="['sidebar-container', showLogo ? 'has-logo' : '']">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="currentActiveMenu"
        class="outer-most"
        mode="vertical"
        router
        unique-opened
        @select="(indexPath) => menuSelect(indexPath, routers)"
      >
        <sidebar-item
          v-for="routes in menuData"
          :key="routes.path"
          :base-path="routes.path"
          :item="routes"
          class="outer-most"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
<script lang="ts" setup>
  import Logo from './logo.vue'
  import { emitter } from '/@/utils/mitt'
  import { useNav } from '../../hooks/nav'
  import SidebarItem from './sidebarItem.vue'
  import { storageLocal } from '/@/utils/storage'
  import { useRoute, useRouter } from 'vue-router'
  import { computed, onBeforeMount, ref, unref, watch } from 'vue'
  import { findRouteByPath } from '/@/router/utils'
  import { usePermissionStoreHook } from '/@/store/modules/permission'
  import { getMenus, getShallowMenus } from '/@/router/menus'
  import { Menu } from '/@/router/types'
  import { useMenuSetting } from '/@/hooks/settings/useMenuSetting'
  import { getAllParentPath } from '/@/router/helper/menuHelper'

  const route = useRoute()
  const routers = useRouter().options.routes
  const showLogo = ref(storageLocal.getItem('-configure')?.showLogo ?? true)

  const { pureApp, isCollapse, menuSelect } = useNav()
  const { getIsMobile, getIsVertical, getIsMix } = useMenuSetting()

  let subMenuData = ref([])

  const menuData = computed(() => {
    return getIsMix.value ? subMenuData.value : usePermissionStoreHook().wholeMenus
  })

  const menusRef = ref<Menu[]>([])

  // get menus
  async function genMenus() {
    // normal mode
    if (unref(getIsVertical) || unref(getIsMobile)) {
      menusRef.value = await getMenus()
      return
    }

    // split-top
    if (unref(pureApp.layout === 'mix')) {
      menusRef.value = await getShallowMenus()
      return
    }
  }

  genMenus()
  const { currentRoute } = useRouter()
  async function getSubMenuData(path) {
    const { meta } = unref(currentRoute)
    const currentActiveMenu = meta.currentActiveMenu as string
    // path的上级路由组成的数组
    // console.log(currentActiveMenu, path)
    const parentPathArr = getAllParentPath(
      usePermissionStoreHook().wholeMenus,
      currentActiveMenu || path,
    )
    // 当前路由的父级路由信息
    const parentRoute = //await getCurrentParentPath(path)
      findRouteByPath(parentPathArr[0] || path, usePermissionStoreHook().wholeMenus)
    if (!parentRoute?.children) return
    subMenuData.value = parentRoute?.children
  }

  getSubMenuData(route.path)
  const currentActiveMenu = computed((): string => {
    const { meta, path } = route
    if (meta.currentActiveMenu) {
      // @ts-ignore
      return meta.currentActiveMenu
    }
    return path
  })

  useMenuSetting()

  onBeforeMount(() => {
    emitter.on('logoChange', (key) => {
      showLogo.value = key
    })
  })

  watch(
    () => route.path,
    () => {
      getSubMenuData(route.path)
      menuSelect(route.path, routers)
    },
  )
</script>
