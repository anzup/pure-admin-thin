// noinspection PlainJsUnregisteredKeyInspection

import { RouteRecordRaw } from 'vue-router'
import { LAYOUT } from '/@/router/constant'

const routerName = 'systemSettings'
const userRouter: RouteRecordRaw = {
  path: `/${routerName}`,
  name: `${routerName}`,
  component: LAYOUT,
  redirect: `/${routerName}/templateConfig`,
  meta: {
    icon: 'svg-personnel',
    title: 'menus.systemSettings',
    i18n: true,
    rank: 20,
    alwaysShow: true,
    orderNo: 3,
  },
  children: [
    {
      path: `basicSettings`,
      name: `${routerName}BasicSettings`,
      component: () => import('/@/views/systemSettings/basicSettings/index.vue'),
      meta: {
        title: 'menus.basicSettings',
        // keepAlive: true
      },
    },
  ],
}

export default userRouter
