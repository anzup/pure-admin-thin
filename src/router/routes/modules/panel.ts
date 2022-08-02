import { AppRouteRecordRaw, SubsystemName } from './../../types'
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
      component: () => import('/@/views/project_ftm/teacher/panel/personal/config/index.vue'),
      meta: {
        title: 'router.personCenterConfig',
        system: SubsystemName.flight_training_management,
      },
    },
    // 个人消息
    {
      path: 'message',
      name: 'PanelPersonalMessageIndex',
      component: () => import('/@/views/project_ftm/teacher/panel/personal/message/index.vue'),
      meta: {
        title: '个人消息',
        i18n: false,
      },
    },
    {
      // 详情
      path: 'message/detail/:detail',
      name: 'PanelPersonalMessageDetail',
      component: () => import('/@/views/project_ftm/teacher/panel/personal/message/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'router.newsDetails',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/panel/personal/message',
      },
    },
    // 个人资质
    {
      path: 'qualification',
      name: 'PanelPersonalQualificationIndex',
      component: () =>
        import('/@/views/project_ftm/teacher/panel/personal/qualification/index.vue'),
      meta: {
        title: 'router.personQualification',
        system: SubsystemName.flight_training_management,
        params: { allAuth: true },
      },
    },
    // 培训进度
    {
      path: 'progress',
      name: 'PanelPersonalProgressIndex',
      component: () => import('/@/views/project_ftm/teacher/panel/personal/progress/index.vue'),
      meta: {
        title: '培训进度',
        system: SubsystemName.flight_training_management,
      },
    },
    {
      // 大纲管理
      path: 'progress/administer',
      name: 'PanelPersonalProgressAdminister',
      component: () =>
        import('/@/views/project_ftm/teacher/standard/course/outline/administer.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/panel/personal/progress',
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
      component: () => import('/@/views/project_ftm/teacher/panel/system/config/index.vue'),
      meta: {
        title: '导航栏设置',
        system: SubsystemName.flight_training_management,
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
