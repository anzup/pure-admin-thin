// noinspection PlainJsUnregisteredKeyInspection

import { $t } from '/@/plugins/i18n'
import Layout from '/@/layout/index.vue'
import { RouteRecordRaw } from 'vue-router'
import { h, resolveComponent } from 'vue'

const routerName = 'contract'
const contractRouter: RouteRecordRaw = {
  path: `/${routerName}`,
  name: routerName,
  component: Layout,
  redirect: `/${routerName}/info/index`,
  meta: {
    icon: 'svg-personnel',
    title: $t('menus.contractManagement'),
    i18n: true,
    alwaysShow: true,
    rank: 2,
  },
  children: [
    {
      path: `/${routerName}/info`,
      name: `${routerName}Info`,
      redirect: `/${routerName}/info/index`,
      component: {
        render() {
          return h(resolveComponent('router-view'))
        },
      },
      meta: {
        title: $t('menus.contractInformationManagement'),
        i18n: true,
      },
      children: [
        {
          //contractInfoIndex
          path: `/${routerName}/info/index`,
          name: `${routerName}InfoIndex`,
          component: () => import('/@/views/contract/info/index.vue'),
          meta: {
            title: $t('menus.contractInformationManagement'),
            i18n: true,
            keepAlive: true,
            breadcrumb: false,
          },
        },
        {
          path: `/${routerName}/info/detail`,
          name: `${routerName}InfoDetail`,
          component: () => import('/@/views/contract/info/detail.vue'),
          meta: {
            title: $t('buttons.hsDetail'),
            i18n: true,
            hidden: true,
            activeMenu: `/${routerName}/info/index`,
          },
          props: (route) => ({
            id: +route.query?.id,
            contractType: route.query?.contractType,
          }),
        },
        {
          path: `/${routerName}/info/add`,
          name: `${routerName}InfoAdd`,
          component: () => import('/@/views/contract/info/edit.vue'),
          meta: {
            title: $t('buttons.hsadd'),
            i18n: true,
            hidden: true,
            activeMenu: `/${routerName}/info/index`,
          },
          props: (route) => ({
            id: +route.query?.id,
            contractType: route.query?.contractType,
          }),
        },
        {
          path: `/${routerName}/info/edit`,
          name: `${routerName}InfoEdit`,
          component: () => import('/@/views/contract/info/edit.vue'),
          meta: {
            title: $t('buttons.edit'),
            i18n: true,
            hidden: true,
            activeMenu: `/${routerName}/info/index`,
          },
          props: (route) => ({
            id: +route.query?.id,
            contractType: route.query?.contractType,
          }),
        },
      ],
    },
    {
      path: `/${routerName}/history`,
      name: `${routerName}History`,
      redirect: `/${routerName}/history/index`,
      component: {
        render() {
          return h(resolveComponent('router-view'))
        },
      },
      meta: {
        title: $t('menus.historicalContract'),
        i18n: true,
      },
      children: [
        {
          path: `/${routerName}/history/index`,
          name: `${routerName}HistoryIndex`,
          component: () => import('/@/views/contract/history/index.vue'),
          meta: {
            title: $t('menus.historicalContract'),
            i18n: true,
            keepAlive: true,
            breadcrumb: false,
          },
        },
        {
          path: `/${routerName}/history/detail`,
          name: `${routerName}HistoryDetail`,
          component: () => import('/@/views/contract/info/detail.vue'),
          meta: {
            title: $t('buttons.hsDetail'),
            i18n: true,
            hidden: true,
            activeMenu: `/${routerName}/history/index`,
          },
          props: (route) => ({
            id: +route.query?.id,
            contractType: route.query?.contractType,
          }),
        },
      ],
    },
    {
      path: `/${routerName}/bill`,
      name: `${routerName}bill`,
      redirect: `/${routerName}/bill/index`,
      component: {
        render() {
          return h(resolveComponent('router-view'))
        },
      },
      meta: {
        title: $t('menus.billManagement'),
        i18n: true,
      },
      children: [
        {
          path: `/${routerName}/bill/index`,
          name: `${routerName}BillIndex`,
          component: () => import('/@/views/contract/bill/index.vue'),
          meta: {
            title: $t('menus.billManagement'),
            i18n: true,
            keepAlive: true,
            breadcrumb: false,
          },
        },
        {
          path: `/${routerName}/bill/detail`,
          name: `${routerName}BillDetail`,
          component: () => import('/@/views/contract/bill/detail.vue'),
          meta: {
            title: $t('buttons.hsDetail'),
            i18n: true,
            hidden: true,
            activeMenu: `/${routerName}/bill/index`,
          },
        },
      ],
    },
  ],
}

export default contractRouter
