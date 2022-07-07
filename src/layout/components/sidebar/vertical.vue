<script lang="ts" setup>
  import Logo from './logo.vue'
  import { emitter } from '/@/utils/mitt'
  import { useNav } from '../../hooks/nav'
  import SidebarItem from './sidebarItem.vue'
  import { storageLocal } from '/@/utils/storage'
  import { useRoute, useRouter } from 'vue-router'
  import { computed, onBeforeMount, ref, unref, watch } from 'vue'
  import { findRouteByPath, getParentPaths } from '/@/router/utils'
  import { usePermissionStoreHook } from '/@/store/modules/permission'
  import { getMenus, getShallowMenus } from '/@/router/menus'
  import { Menu } from '/@/router/types'
  import { useAppStoreHook } from '/@/store/modules/app'
  // import { BasicMenu } from '../Menu/index'

  const route = useRoute()
  const routers = useRouter().options.routes
  const showLogo = ref(storageLocal.getItem('-configure')?.showLogo ?? true)

  const { pureApp, isCollapse, menuSelect } = useNav()

  let subMenuData = ref([])

  const menuData = computed(() => {
    return pureApp.layout === 'mix' ? subMenuData.value : usePermissionStoreHook().wholeMenus
  })

  const menusRef = ref<Menu[]>([])
  const normalType = computed<boolean>(() => pureApp.layout === 'vertical')
  const getIsMobile = computed<boolean>(() => useAppStoreHook().device === 'mobile')

  // get menus
  async function genMenus() {
    // normal mode
    if (unref(normalType) || unref(getIsMobile)) {
      menusRef.value = await getMenus()
      return
    }

    // split-top
    if (unref(pureApp.layout === 'mix')) {
      menusRef.value = await getShallowMenus()
      console.log(menusRef.value)
      return
    }
  }

  function getSubMenuData(path) {
    // path的上级路由组成的数组
    const parentPathArr = getParentPaths(path, usePermissionStoreHook().wholeMenus)
    // 当前路由的父级路由信息
    const parenetRoute = findRouteByPath(
      parentPathArr[0] || path,
      usePermissionStoreHook().wholeMenus,
    )
    if (!parenetRoute?.children) return
    subMenuData.value = parenetRoute?.children
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
      genMenus()
    },
  )
</script>

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

      <!--<BasicMenu :items="menuData" :collapse="isCollapse" class="outer-most" />-->
    </el-scrollbar>
  </div>
</template>
