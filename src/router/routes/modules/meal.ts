import { RouteRecordRaw } from 'vue-router'
import { LAYOUT } from '/@/router/constant'

const mealRouter: RouteRecordRaw = {
  path: '/meal',
  name: 'Meal',
  component: LAYOUT,
  redirect: '/meal/diningStaff',
  meta: {
    icon: 'information-line',
    title: 'menus.mealManagement',
    orderNo: 2,
  },
  children: [
    {
      path: 'diningStaff',
      name: 'DiningStaff',
      component: () => import('/@/views/meal/diningStaff/index.vue'),
      meta: {
        title: 'menus.diningStaff',
      },
    },
    {
      path: 'diningStaff_detail/:id',
      name: 'DiningStaffDetail',
      component: () => import('/@/views/meal/diningStaff/detail.vue'),
      meta: {
        title: 'buttons.detail',
        hideMenu: true,
        currentActiveMenu: '/meal/diningStaff',
      },
    },
    {
      path: 'setting',
      name: 'Settings',
      component: () => import('/@/views/meal/settings/index.vue'),
      meta: {
        title: 'menus.mealSettings',
      },
    },
    {
      path: 'settlement',
      name: 'Settlement',
      component: () => import('/@/views/meal/settlement/index.vue'),
      meta: {
        title: 'menus.cashierManagement',
      },
    },
  ],
}
export default mealRouter
