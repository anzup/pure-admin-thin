import type { AppRouteModule } from '/@/router/types'

import {
  ERROR_ROUTE,
  REDIRECT_ROUTE,
  ROOT_ROUTE,
  LOGIN_ROUTE,
  HOME_ROUTE,
} from '/@/router/routes/basic'

const modules = import.meta.glob('./modules/**/*.ts', { eager: true })
const routeModuleList: AppRouteModule[] = []

Object.keys(modules).forEach((key) => {
  const mod = (modules[key] as any).default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

export const asyncRoutes = [...routeModuleList, ERROR_ROUTE]

export { LOGIN_ROUTE, ROOT_ROUTE, HOME_ROUTE }

// Basic routing without permission
export const basicRoutes = [ROOT_ROUTE, LOGIN_ROUTE, ERROR_ROUTE, REDIRECT_ROUTE]
