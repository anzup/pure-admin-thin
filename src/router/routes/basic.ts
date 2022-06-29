import type { AppRouteRecordRaw } from '../types'
import { LAYOUT } from '/@/router/constant'

export const ERROR_ROUTE: AppRouteRecordRaw = {
  path: '/error',
  component: LAYOUT,
  name: 'Error',
  redirect: '/error/403',
  meta: {
    icon: 'information-line',
    title: 'menus.hserror',
    rank: 9,
  },
  children: [
    {
      path: '/error/403',
      name: '403',
      component: () => import('/@/views/error/403.vue'),
      meta: {
        title: 'menus.hsfourZeroOne',
      },
    },
    {
      path: '/error/404',
      name: '404',
      component: () => import('/@/views/error/404.vue'),
      meta: {
        title: 'menus.fourZeroFour',
      },
    },
    {
      path: '/error/500',
      name: '500',
      component: () => import('/@/views/error/500.vue'),
      meta: {
        title: 'menus.hsFive',
      },
    },
  ],
}

export const ROOT_ROUTE: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: '/welcome',
  meta: {
    title: 'root',
  },
}

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect',
  component: LAYOUT,
  name: 'Redirect',
  meta: {
    icon: 'home-filled',
    title: 'menus.homePage',
    showLink: false,
    rank: 104,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: 'redirect',
      component: () => import('/@/layout/redirect.vue'),
      meta: {
        title: 'redirect',
        hideBreadcrumb: true,
      },
    },
  ],
}

export const LOGIN_ROUTE: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/login/index.vue'),
  meta: {
    title: 'menus.login',
    showLink: false,
    rank: 101,
  },
}
export const HOME_ROUTE: AppRouteRecordRaw = {
  path: '/welcome',
  name: 'welcome',
  component: LAYOUT,
  redirect: '/welcome/index',
  meta: {
    title: 'menus.homePage',
  },
  children: [
    {
      path: '/index',
      name: 'welcomeIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: 'menus.homePage',
        showLink: false,
        rank: 101,
      },
    },
  ],
}

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE = {
  path: '/:pathMatch(.*)',
  redirect: '/error/404',
}
