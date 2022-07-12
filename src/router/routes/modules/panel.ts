import { AppRouteRecordRaw } from './../../types'
import { getParentLayout, LAYOUT } from '/@/router/constant'

/**
 * 个人中心
 */
const Personal: AppRouteRecordRaw = {
  path: 'personal',
  name: 'PanelPersonal',
  redirect: '',
  component: getParentLayout('PanelPersonal'),
  meta: {
    title: '个人中心',
    i18n: false,
  },
  children: [
    // 信息配置
    {
      path: 'config',
      name: 'PanelPersonalConfigIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '信息配置',
        i18n: false,
      },
    },
    // 个人消息
    {
      path: 'message',
      name: 'PanelPersonalMessageIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '个人消息',
        i18n: false,
      },
    },
    // 个人资质
    {
      path: 'qualification',
      name: 'PanelPersonalQualificationIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '个人资质',
        i18n: false,
      },
    },
    // 培训进度
    {
      path: 'progress',
      name: 'PanelPersonalProgressIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '培训进度',
        i18n: false,
      },
    },
  ],
}
/**
 * 系统设置
 */
const System: AppRouteRecordRaw = {
  path: 'system',
  name: 'PanelSystem',
  redirect: '',
  component: getParentLayout('PanelSystem'),
  meta: {
    title: '系统设置',
    i18n: false,
  },
  children: [
    // 导航栏设置
    {
      path: 'config',
      name: 'PanelSystemConfigIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '导航栏设置',
        i18n: false,
      },
    },
  ],
}

const Route: AppRouteRecordRaw = {
  path: '/panel',
  name: 'Panel',
  component: LAYOUT,
  redirect: '',
  meta: {
    icon: '',
    title: '面板菜单',
    i18n: false,
    orderNo: 7,
  },
  children: [Personal, System],
}

export default Route
