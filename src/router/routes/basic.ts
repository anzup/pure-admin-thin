import type { AppRouteRecordRaw } from '../types'
import { EXCEPTION_COMPONENT, LAYOUT, PAGE_NOT_FOUND_NAME } from '/@/router/constant'
import { PageEnum } from '/@/enums/pageEnum'

export const ERROR_ROUTE: AppRouteRecordRaw = {
  path: '/error',
  component: LAYOUT,
  name: 'Error',
  redirect: '/error/403',
  meta: {
    hideMenu: true,
    icon: 'information-line',
    title: 'menus.error',
    rank: 9,
    hideMenu: true,
  },
  children: [
    {
      path: '403',
      name: '403',
      component: () => import('/@/views/error/403.vue'),
      meta: {
        title: 'menus.fourZeroOne',
      },
    },
    {
      path: '404',
      name: '404',
      component: () => import('/@/views/error/404.vue'),
      meta: {
        title: 'menus.fourZeroFour',
      },
    },
    {
      path: '500',
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
  redirect: PageEnum.BASE_HOME,
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
  name: 'Welcome',
  component: LAYOUT,
  redirect: '/welcome/index',
  meta: {
    title: 'menus.homePage',
    icon: 'information-line',
  },
  children: [
    {
      path: 'index',
      name: 'WelcomeIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: 'menus.homePage',
        // hideMenu: true,
        rank: 101,
      },
    },
  ],
}

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: PAGE_NOT_FOUND_NAME,
  component: LAYOUT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: PAGE_NOT_FOUND_NAME,
      component: EXCEPTION_COMPONENT,
      meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
      },
    },
  ],
}
