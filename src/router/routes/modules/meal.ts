import { RouteRecordRaw } from 'vue-router'
import { getParentLayout, LAYOUT } from '/@/router/constant'

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
      redirect: 'meal/diningStaff/index',
      name: 'DiningStaff',
      component: getParentLayout('DiningStaff'),
      meta: {
        title: 'menus.diningStaff',
      },
      children: [
        {
          path: 'index',
          name: 'DiningStaffIndex',
          component: () => import('/@/views/meal/diningStaff/index.vue'),
          meta: {
            title: 'menus.diningStaff',
          },
        },
      ],
    },
    {
      path: 'setting',
      name: 'Settings',
      redirect: '/meal/settings/index',
      component: getParentLayout('Settings'),
      meta: {
        title: 'menus.mealSettings',
      },
      children: [
        {
          path: 'index',
          name: 'SettingsIndex',
          component: () => import('/@/views/meal/settings/index.vue'),
          meta: {
            title: 'menus.mealSettings',
          },
        },
      ],
    },
  ],
}
export default mealRouter
