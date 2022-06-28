import type { Router } from 'vue-router'
import { configureDynamicParamsMenu } from '../helper/menuHelper'

import { usePermissionStoreHook } from '/@/store/modules/permission'

export function createParamMenuGuard(router: Router) {
  const permissionStore = usePermissionStoreHook()
  router.beforeEach((to, _, next) => {
    // filter no name route
    if (!to.name) {
      next()
      return
    }

    // menu has been built.
    if (!permissionStore.getIsDynamicAddedRoute) {
      next()
      return
    }

    permissionStore.getFrontMenuList.forEach((item) => configureDynamicParamsMenu(item, to.params))

    next()
  })
}
