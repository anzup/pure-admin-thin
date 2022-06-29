import { defineStore } from 'pinia'
import { store } from '/@/store'
import { cacheType } from './types'
import { cloneDeep } from 'lodash-unified'
import { RouteConfigs } from '/@/layout/types'
import { ascending, filterTree } from '/@/router/utils'
import { AppRouteRecordRaw, Menu } from '/@/router/types'
import { useUserStore } from '/@/store/modules/user'
import { toRaw } from 'vue'

import { filter } from '/@/utils/helper/treeHelper'
import { asyncRoutes, HOME_ROUTE } from '/@/router/routes'
import { flatMultiLevelRoutes } from '/@/router/helper/routeHelper'
import { transformRouteToMenu } from '/@/router/helper/menuHelper'
import { PageEnum } from '/@/enums/pageEnum'

export const usePermissionStore = defineStore({
  id: 'pure-permission',
  state: () => ({
    // 静态路由生成的菜单
    constantMenus: [],
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 深拷贝一个菜单树，与导航菜单不突出
    menusTree: [],
    buttonAuth: [],
    // 缓存页面keepAlive
    cachePageList: [],
    isDynamicAddedRoute: false,
  }),
  getters: {
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute
    },
    getFrontMenuList(): Menu[] {
      return this.wholeMenus
    },
  },
  actions: {
    // 获取异步路由菜单
    asyncActionRoutes(routes) {
      if (this.wholeMenus.length > 0) return
      this.wholeMenus = filterTree(ascending(this.constantMenus.concat(routes)))
      this.menusTree = cloneDeep(filterTree(ascending(this.constantMenus.concat(routes))))
      const getButtonAuth = (arrRoutes: Array<RouteConfigs>) => {
        if (!arrRoutes || !arrRoutes.length) return
        arrRoutes.forEach((v: RouteConfigs) => {
          if (v.meta && v.meta.authority) {
            this.buttonAuth.push(...v.meta.authority)
          }
          if (v.children) {
            getButtonAuth(v.children)
          }
        })
      }

      getButtonAuth(this.wholeMenus)
    },
    async changeSetting(routes) {
      await this.asyncActionRoutes(routes)
    },
    cacheOperate({ mode, name }: cacheType) {
      switch (mode) {
        case 'add':
          this.cachePageList.push(name)
          this.cachePageList = [...new Set(this.cachePageList)]
          break
        case 'delete':
          // eslint-disable-next-line no-case-declarations
          const delIndex = this.cachePageList.findIndex((v) => v === name)
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1)
          break
      }
    },
    // 清空缓存页面
    clearAllCachePage() {
      this.cachePageList = []
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added
    },
    setMenuList(list: Menu[]) {
      this.wholeMenus = list
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const userStore = useUserStore()

      let routes: AppRouteRecordRaw[] = []
      const roleList = toRaw(userStore.userInfo.totalAuthorities) || []

      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        const { roles } = meta || {}
        if (!roles) return true
        // @ts-ignore
        return roleList.some((role) => roles.includes(role))
      }

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route
        const { ignoreRoute } = meta || {}
        return !ignoreRoute
      }

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return
        let homePath: string = (userStore.userInfo as any).homePath || PageEnum.BASE_HOME

        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/'
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route
            const currentPath = path.startsWith('/') ? path : parentPath + path
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true })
                throw new Error('end')
              }
            }
            children && children.length > 0 && patcher(children, currentPath)
          })
        }

        try {
          patcher(routes)
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return
      }

      routes = filter([HOME_ROUTE, ...asyncRoutes], routeFilter)
      routes = routes.filter(routeFilter)
      const menuList = transformRouteToMenu(routes, true)
      routes = filter(routes, routeRemoveIgnoreFilter)
      routes = routes.filter(routeRemoveIgnoreFilter)
      menuList.sort((a, b) => {
        // @ts-ignore
        return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0)
      })
      this.setMenuList(menuList)
      // Convert multi-level routing to level 2 routing
      routes = flatMultiLevelRoutes(routes)

      // routes.push(ERROR_LOG_ROUTE)
      patchHomeAffix(routes)
      console.log(routes)
      return routes
    },
  },
})

export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
