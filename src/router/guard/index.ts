import type { Router } from 'vue-router'

import NProgress from '/@/utils/progress'

import { createPermissionGuard } from './permissionGuard'
// import { createStateGuard } from './stateGuard'

// import projectSetting from '/@/settings/projectSetting'
import { createParamMenuGuard } from './paramMenuGuard'

// Don't change the order of creation
export function setupRouterGuard(router: Router) {
  // createPageGuard(router)
  createProgressGuard(router)
  createPermissionGuard(router)
  createParamMenuGuard(router) // must after createPermissionGuard (menu has been built.)
  // createStateGuard(router)
}

/**
 * Hooks for handling page state
 */
// function createPageGuard(router: Router) {
//   const loadedPageMap = new Map<string, boolean>()
//
//   router.beforeEach(async (to) => {
//     // The page has already been loaded, it will be faster to open it again, you don’t need to do loading and other processing
//     to.meta.loaded = !!loadedPageMap.get(to.path)
//     // Notify routing changes
//     setRouteChange(to)
//
//     return true
//   })
//
//   router.afterEach((to) => {
//     loadedPageMap.set(to.path, true)
//   })
// }

export function createProgressGuard(router: Router) {
  router.beforeEach(async (to) => {
    if (to.meta.loaded) {
      return true
    }
    NProgress.start()
    return true
  })

  router.afterEach(async () => {
    NProgress.done()
    return true
  })
}
