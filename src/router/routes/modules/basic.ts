import { AppRouteRecordRaw } from './../../types'
import { getParentLayout, LAYOUT } from '/@/router/constant'

/**
 * 人员管理
 */
const Personnel: AppRouteRecordRaw = {
  path: 'personnel',
  name: 'BasicPersonnel',
  redirect: '',
  component: getParentLayout('BasicPersonnel'),
  meta: {
    title: '人员管理',
    i18n: false,
  },
  children: [
    // 职员管理
    {
      path: 'employee',
      name: 'BasicPersonnelEmployee',
      redirect: 'index',
      component: getParentLayout('BasicPersonnelEmployee'),
      meta: {
        title: '职员管理',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'BasicPersonnelEmployeeIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '职员管理',
            i18n: false,
          },
        },
      ],
    },
    // 参训人员管理
    {
      path: 'participants',
      name: 'BasicPersonnelParticipants',
      redirect: 'index',
      component: getParentLayout('BasicPersonnelParticipants'),
      meta: {
        title: 'message.managementTrainees',
      },
      children: [
        {
          path: 'index',
          name: 'BasicPersonnelParticipantsIndex',
          component: () => import('/@/views/project_opm/basic/participants/index.vue'),
          meta: {
            title: 'message.managementTrainees',
          },
        },
        {
          path: ':id(\\d+)',
          name: 'BasicPersonnelParticipantsDetail',
          component: () => import('/@/views/project_opm/basic/participants/detail.vue'),
          meta: {
            title: 'message.hsDetail',
            hideMenu: true,
            currentActiveMenu: '/basic/personnel/participants/index',
          },
        },
      ],
    },
    // 权限管理
    {
      path: 'permissions',
      name: 'BasicPersonnelPermissions',
      redirect: 'index',
      component: getParentLayout('BasicPersonnelPermissions'),
      meta: {
        title: '权限管理',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'BasicPersonnelPermissionsIndex',
          component: () => import('/@/views/project_opm/basic/permissions/index.vue'),
          meta: {
            title: '权限管理',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 基础信息
 */
const Infomation: AppRouteRecordRaw = {
  path: 'infomation',
  name: 'BasicInfomation',
  redirect: '',
  component: getParentLayout('BasicInfomation'),
  meta: {
    title: '基础信息',
    i18n: false,
  },
  children: [
    // 消息发送
    {
      path: 'message',
      name: 'BasicInfomationMessage',
      redirect: 'index',
      component: getParentLayout('BasicInfomationMessage'),
      meta: {
        title: '消息发送',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'BasicInfomationMessageIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '消息发送',
            i18n: false,
          },
        },
      ],
    },
    // 问卷调查
    {
      path: 'questionnaire',
      name: 'BasicInfomationQuestionnaire',
      redirect: 'index',
      component: getParentLayout('BasicInfomationQuestionnaire'),
      meta: {
        title: '问卷调查',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'BasicInfomationQuestionnaireIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '问卷调查',
            i18n: false,
          },
        },
      ],
    },
  ],
}

const Route: AppRouteRecordRaw = {
  path: '/basic',
  name: 'Basic',
  component: LAYOUT,
  redirect: '',
  meta: {
    icon: '',
    title: '基础管理',
    i18n: false,
    orderNo: 6,
  },
  children: [Personnel, Infomation],
}

export default Route
