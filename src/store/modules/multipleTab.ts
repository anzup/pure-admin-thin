import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router'

import { toRaw, unref } from 'vue'
import { defineStore } from 'pinia'
import { store } from '/@/store'

import { useGo, useRedo } from '/@/hooks/usePage'

import { PageEnum } from '/@/enums/pageEnum'
import { REDIRECT_ROUTE } from '/@/router/routes/basic'
import { getRawRoute } from '/@/utils'

import { useUserStore } from '/@/store/modules/user'
import { storageLocal } from '/@/utils/storage'

export interface MultipleTabState {
  cacheTabList: Set<string>
  multiTags: RouteLocationNormalized[]
  lastDragEndIndex: number
  multiTagsCache: boolean
}

function handleGotoPage(router: Router) {
  const go = useGo(router)
  go(unref(router.currentRoute).path, true)
}

const getToTarget = (tabItem: RouteLocationNormalized) => {
  const { params, path, query } = tabItem
  return {
    params: params || {},
    path,
    query: query || {},
  }
}

const cacheTab = storageLocal.getItem('-configure').multiTagsCache

export const useMultipleTabStore = defineStore({
  id: 'app-multiple-tab',
  state: (): MultipleTabState => ({
    // Tabs that need to be cached
    cacheTabList: new Set(),
    // multiple tab list
    multiTags: cacheTab ? storageLocal.getItem('-tags') || [] : [],
    // Index of the last moved tab
    lastDragEndIndex: 0,
    multiTagsCache: cacheTab,
  }),
  getters: {
    getTabList(): RouteLocationNormalized[] {
      return this.multiTags
    },
    getCachedTabList(): string[] {
      return Array.from(this.cacheTabList)
    },
    getLastDragEndIndex(): number {
      return this.lastDragEndIndex
    },
    getMultiTagsCache() {
      return this.multiTagsCache
    },
  },
  actions: {
    /**
     * Update the cache according to the currently opened tabs
     */
    async updateCacheTab() {
      const cacheMap: Set<string> = new Set()

      for (const tab of this.multiTags) {
        const item = getRawRoute(tab)
        // Ignore the cache
        const needCache = !item.meta?.ignoreKeepAlive
        if (!needCache) {
          continue
        }
        const name = item.name as string
        cacheMap.add(name)
      }
      this.cacheTabList = cacheMap
    },

    /**
     * Refresh tabs
     */
    async refreshPage(router: Router) {
      const { currentRoute } = router
      const route = unref(currentRoute)
      const name = route.name

      const findTab = this.getCachedTabList.find((item) => item === name)
      if (findTab) {
        this.cacheTabList.delete(findTab)
      }
      const redo = useRedo(router)
      await redo()
    },
    clearCacheTabs(): void {
      this.cacheTabList = new Set()
    },
    resetState(): void {
      this.multiTags = []
      this.clearCacheTabs()
    },
    goToPage(router: Router) {
      const go = useGo(router)
      const len = this.multiTags.length
      const { path } = unref(router.currentRoute)

      let toPath: PageEnum | string = PageEnum.BASE_HOME

      if (len > 0) {
        const page = this.multiTags[len - 1]
        const p = page.fullPath || page.path
        if (p) {
          toPath = p
        }
      }
      // Jump to the current page and report an error
      path !== toPath && go(toPath as PageEnum, true)
    },

    async addTab(route: RouteLocationNormalized) {
      const { path, name, fullPath, params, query, meta } = getRawRoute(route)
      // 404  The page does not need to add a tab
      if (
        path === PageEnum.ERROR_PAGE ||
        path === PageEnum.BASE_LOGIN ||
        !name ||
        [REDIRECT_ROUTE.name, '404'].includes(name as string)
      ) {
        return
      }

      let updateIndex = -1
      // Existing pages, do not add tabs repeatedly
      const tabHasExits = this.multiTags.some((tab, index) => {
        updateIndex = index
        return (tab.fullPath || tab.path) === (fullPath || path)
      })

      // If the tab already exists, perform the update operation
      if (tabHasExits) {
        const curTab = toRaw(this.multiTags)[updateIndex]
        if (!curTab) {
          return
        }
        curTab.params = params || curTab.params
        curTab.query = query || curTab.query
        curTab.fullPath = fullPath || curTab.fullPath
        this.multiTags.splice(updateIndex, 1, curTab)
      } else {
        // Add tab
        // 获取动态路由打开数，超过 0 即代表需要控制打开数
        const dynamicLevel = meta?.dynamicLevel ?? -1
        if (dynamicLevel > 0) {
          // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了
          // 首先获取到真实的路由，使用配置方式减少计算开销.
          // const realName: string = path.match(/(\S*)\//)![1];
          const realPath = meta?.realPath ?? ''
          // 获取到已经打开的动态路由数, 判断是否大于某一个值
          if (
            this.multiTags.filter((e) => e.meta?.realPath ?? '' === realPath).length >= dynamicLevel
          ) {
            // 关闭第一个
            const index = this.multiTags.findIndex((item) => item.meta.realPath === realPath)
            index !== -1 && this.multiTags.splice(index, 1)
          }
        }
        this.multiTags.push(route)
      }
      this.updateCacheTab()
      cacheTab && storageLocal.setItem('-tags', this.multiTags)
    },

    async closeTab(tab: RouteLocationNormalized, router: Router) {
      const close = (route: RouteLocationNormalized) => {
        const { fullPath, meta: { affix } = {} } = route
        if (affix) {
          return
        }
        const index = this.multiTags.findIndex((item) => item.fullPath === fullPath)
        index !== -1 && this.multiTags.splice(index, 1)
      }

      const { currentRoute, replace } = router

      const { path } = unref(currentRoute)
      if (path !== tab.path) {
        // Closed is not the activation tab
        close(tab)
        return
      }

      // Closed is activated atb
      let toTarget: RouteLocationRaw = {}

      const index = this.multiTags.findIndex((item) => item.path === path)

      // If the current is the leftmost tab
      if (index === 0) {
        // There is only one tab, then jump to the homepage, otherwise jump to the right tab
        if (this.multiTags.length === 1) {
          const userStore = useUserStore()
          toTarget = userStore.userInfo.homePath || PageEnum.BASE_HOME
        } else {
          //  Jump to the right tab
          const page = this.multiTags[index + 1]
          toTarget = getToTarget(page)
        }
      } else {
        // Close the current tab
        const page = this.multiTags[index - 1]
        toTarget = getToTarget(page)
      }
      close(currentRoute.value)
      await replace(toTarget)
    },

    // Close according to key
    async closeTabByKey(key: string, router: Router) {
      const index = this.multiTags.findIndex((item) => (item.fullPath || item.path) === key)
      if (index !== -1) {
        await this.closeTab(this.multiTags[index], router)
        const { currentRoute, replace } = router
        // 检查当前路由是否存在于tabList中
        const isActivated = this.multiTags.findIndex((item) => {
          return item.fullPath === currentRoute.value.fullPath
        })
        // 如果当前路由不存在于TabList中，尝试切换到其它路由
        if (isActivated === -1) {
          let pageIndex
          if (index > 0) {
            pageIndex = index - 1
          } else if (index < this.multiTags.length - 1) {
            pageIndex = index + 1
          } else {
            pageIndex = -1
          }
          if (pageIndex >= 0) {
            const page = this.multiTags[index - 1]
            const toTarget = getToTarget(page)
            await replace(toTarget)
          }
        }
      }
    },

    // Sort the tabs
    async sortTabs(oldIndex: number, newIndex: number) {
      const currentTab = this.multiTags[oldIndex]
      this.multiTags.splice(oldIndex, 1)
      this.multiTags.splice(newIndex, 0, currentTab)
      this.lastDragEndIndex = this.lastDragEndIndex + 1
    },

    // Close the tab on the right and jump
    async closeLeftTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.multiTags.findIndex((item) => item.path === route.path)

      if (index > 0) {
        const leftTabs = this.multiTags.slice(0, index)
        const pathList: string[] = []
        for (const item of leftTabs) {
          const affix = item?.meta?.affix ?? false
          if (!affix) {
            pathList.push(item.fullPath)
          }
        }
        await this.bulkCloseTabs(pathList)
      }
      await this.updateCacheTab()
      handleGotoPage(router)
    },

    // Close the tab on the left and jump
    async closeRightTabs(route: RouteLocationNormalized, router: Router) {
      const index = this.multiTags.findIndex((item) => item.fullPath === route.fullPath)

      if (index >= 0 && index < this.multiTags.length - 1) {
        const rightTabs = this.multiTags.slice(index + 1, this.multiTags.length)

        const pathList: string[] = []
        for (const item of rightTabs) {
          const affix = item?.meta?.affix ?? false
          if (!affix) {
            pathList.push(item.fullPath)
          }
        }
        await this.bulkCloseTabs(pathList)
      }
      await this.updateCacheTab()
      handleGotoPage(router)
    },

    async closeAllTab(router: Router) {
      this.multiTags = this.multiTags.filter((item) => item?.meta?.affix ?? false)
      this.clearCacheTabs()
      this.goToPage(router)
    },

    /**
     * Close other tabs
     */
    async closeOtherTabs(route: RouteLocationNormalized, router: Router) {
      const closePathList = this.multiTags.map((item) => item.fullPath)

      const pathList: string[] = []

      for (const path of closePathList) {
        if (path !== route.fullPath) {
          const closeItem = this.multiTags.find((item) => item.path === path)
          if (!closeItem) {
            continue
          }
          const affix = closeItem?.meta?.affix ?? false
          if (!affix) {
            pathList.push(closeItem.fullPath)
          }
        }
      }
      await this.bulkCloseTabs(pathList)
      await this.updateCacheTab()
      handleGotoPage(router)
    },

    /**
     * Close tabs in bulk
     */
    async bulkCloseTabs(pathList: string[]) {
      this.multiTags = this.multiTags.filter((item) => !pathList.includes(item.fullPath))
    },

    /**
     * Set tab's title
     */
    async setTabTitle(title: string, route: RouteLocationNormalized) {
      const findTab = this.getTabList.find((item) => item === route)
      if (findTab) {
        findTab.meta.title = title
        await this.updateCacheTab()
      }
    },
    /**
     * replace tab's path
     * **/
    async updateTabPath(fullPath: string, route: RouteLocationNormalized) {
      const findTab = this.getTabList.find((item) => item === route)
      if (findTab) {
        findTab.fullPath = fullPath
        findTab.path = fullPath
        await this.updateCacheTab()
      }
    },
  },
})

// Need to be used outside the setup
export function useMultipleTabStoreHook() {
  return useMultipleTabStore(store)
}
