import { RouteRecordName } from 'vue-router'
import { MenuModeEnum } from '/@/enums/menuEnum'

export type cacheType = {
  mode: string
  name?: RouteRecordName
}

export type positionType = {
  startIndex?: number
  length?: number
}

export type appType = {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
    // 判断是否手动点击Hamburger
    isClickHamburger: boolean
  }
  layout: MenuModeEnum
  device: string
}

export type multiType = {
  path: string
  parentPath: string
  name: string
  meta: any
  query?: object
}

export type setType = {
  title: string
  fixedHeader: boolean
  hiddenSideBar: boolean
}

export type userType = {
  token: string
  refresh_token: string
  totalAuthorities: string[]
  userInfo: CurrentUserInfo
  userId: number
  currentPage?: number
  lastUpdateTime: number
}
