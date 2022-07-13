import { i18n } from './../plugins/i18n/index'
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    keepAlive?: boolean
    refreshRedirect: string
    dynamicLevel?: string
  }
}

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>)

interface RouteMeta {
  /**@param authority 权限 */
  authority?: string[]
  /**@param title 页面名称 */
  title: string
  /**@param showParent 是否显示父级菜单 */
  showParent?: boolean
  /**@param keepAlive 是否缓存 */
  keepAlive?: boolean
  /**@param refreshRedirect 刷新后重定向页面 */
  refreshRedirect?: string
  /**@param dynamicLevel 动态路由层级 */
  dynamicLevel?: string
  /**@param icon 图标 */
  icon?: string
  /**@param orderNo 路由顺序 */
  orderNo?: number
  /**@param hideMenu 是否隐藏菜单 默认false */
  hideMenu?: boolean
  /**@param i18n 是否使用i18n转换 */
  i18n?: boolean
  /**@param 过渡样式类名 */
  transition?: {
    name?: string
    enterTransition?: string
    leaveTransition?: string
  }
  /**@param currentActiveMenu 选中的菜单栏，用于页面隐藏时的显示 */
  currentActiveMenu?: string
  /**@param 菜单栏额外icon */
  extraIcon?: {
    svg?: boolean
    name?: string
  }
  /**@param 过滤meta中showLink为false的路由 */
  showLink?: boolean
  affix?: boolean
  rank?: number
  ignoreAuth?: boolean
  hideChildrenInMenu?: boolean
  hideBreadcrumb?: boolean
  /**@param 路由显示所属的系统 */
  system?: string
}
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  name: string
  meta: RouteMeta
  component?: Component | string
  components?: Component
  children?: AppRouteRecordRaw[]
  props?: Recordable
  fullPath?: string
}

export interface Menu {
  name: string

  icon?: string

  path: string

  // path contains param, auto assignment.
  paramPath?: string

  disabled?: boolean

  children?: Menu[]

  orderNo?: number

  meta?: Partial<RouteMeta>

  hideMenu?: boolean
}

export interface MenuModule {
  orderNo?: number
  menu: Menu
}

// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw

export enum SubsystemName {
  /**@param 账号管理 */
  account_management = 'ACC',
  /**@param 运行计划管理 */
  operation_plan_management = 'OPM',
  /**@param 飞行教学培训管理 */
  flight_training_management = 'FTM',
  /**@param 设备维护管理 */
  device_maintenance_management = 'DMM',
  /**@param 乘务培训教学管理 */
  crew_training_management = 'CTM',
  /**@param 乘务标准管理 */
  crew_standard_management = 'CSM',
  /**@param 后勤管理 */
  logistics_management = 'LOG',
  /**@param 讲评系统 */
  debrief_system = 'DBS',
}
