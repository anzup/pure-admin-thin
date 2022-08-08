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
      name: 'BasicPersonnelEmployeeIndex',
      component: () => import('/@/views/project_ftm/teacher/basic/personnel/employee/index.vue'),
      meta: {
        title: '职员管理',
      },
    },
    {
      // 新增职员
      path: 'employee/add',
      name: 'BasicPersonnelEmployeeAdd',
      component: () => import('/@/views/project_ftm/teacher/basic/personnel/employee/add.vue'),
      meta: {
        hideMenu: true,
        title: 'button.addTo',

        currentActiveMenu: '/basic/personnel/employee',
      },
    },
    {
      // 详情
      path: 'employee/details',
      name: 'BasicPersonnelEmployeeDetail',
      component: () => import('/@/views/project_ftm/teacher/basic/personnel/employee/details.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',

        currentActiveMenu: '/basic/personnel/employee',
      },
    },
    {
      // 编辑权限
      path: 'employee/editAuth',
      name: 'BasicPersonnelEmployeeEditAuth',
      component: () => import('/@/views/project_ftm/teacher/basic/personnel/employee/editAuth.vue'),
      meta: {
        hideMenu: true,
        title: 'button.editAuth',

        currentActiveMenu: '/basic/personnel/employee',
      },
    },
    // 参训人员管理
    {
      path: 'participants',
      name: 'BasicPersonnelParticipantsIndex',
      component: () => import('/@/views/project_opm/basic/participants/index.vue'),
      meta: {
        title: 'message.managementTrainees',
      },
    },
    {
      path: 'participants/:id(\\d+)',
      name: 'BasicPersonnelParticipantsDetail',
      component: () => import('/@/views/project_opm/basic/participants/detail.vue'),
      meta: {
        title: 'message.hsDetail',
        hideMenu: true,
        currentActiveMenu: '/basic/personnel/participants',
      },
    },
    // 权限管理
    {
      path: 'permissions',
      name: 'BasicPersonnelPermissionsIndex',
      component: () => import('/@/views/project_opm/basic/permissions/index.vue'),
      meta: {
        title: '权限管理',
      },
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
      name: 'BasicInfomationMessageIndex',
      component: () => import('/@/views/project_ftm/teacher/basic/infomation/message/index.vue'),
      meta: {
        title: '消息发送',
        i18n: false,
      },
    },
    {
      // 信息公告添加
      path: 'message/notice/add',
      name: 'BasicInfomationMessageNoticeAdd',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/message/notice/add.vue'),
      meta: {
        hideMenu: true,
        title: 'button.addTo',

        currentActiveMenu: '/basic/infomation/message',
      },
    },
    {
      // 信息公告详情
      path: 'message/notice/detail',
      name: 'BasicInfomationMessageNoticeDetail',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/message/notice/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',

        currentActiveMenu: '/basic/infomation/message',
      },
    },
    {
      // 文件通知添加
      path: 'message/fileNotice/add',
      name: 'BasicInfomationMessageFileNoticeAdd',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/message/notice/add.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',

        currentActiveMenu: '/basic/infomation/message',
      },
    },
    {
      // 文件通知详情
      path: 'message/fileNotice/detail',
      name: 'BasicInfomationMessageFileNoticeDetails',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/message/notice/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'button.addTo',

        currentActiveMenu: '/basic/infomation/message',
      },
    },
    {
      // 文件通知文件详情
      path: 'message/fileNotice/detail/:detail',
      name: 'BasicInfomationMessageFileNoticeDetail',
      component: () => import('/@/views/project_ftm/teacher/panel/personal/message/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'router.newsDetails',

        currentActiveMenu: '/basic/infomation/message',
      },
    },
    // 问卷调查
    {
      path: 'questionnaire',
      name: 'BasicInfomationQuestionnaireIndex',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/questionnaire/index.vue'),
      meta: {
        title: '问卷调查',
        i18n: false,
      },
    },
    {
      // 添加
      path: 'questionnaire/addQuestionnaire',
      name: 'BasicInfomationQuestionnaireAdd',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/questionnaire/addQuestionnaire.vue'),
      meta: {
        hideMenu: true,
        title: 'router.addQuestionnaire',
        i18n: false,
      },
    },
    {
      // 修改
      path: 'questionnaire/infoQuestionnaire',
      name: 'BasicInfomationQuestionnaireInfo',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/questionnaire/addQuestionnaire.vue'),
      meta: {
        hideMenu: true,
        title: 'router.infoQuestionnaire',
        i18n: false,
      },
    },
    {
      // 问卷详情
      path: 'questionnaire/questionnaireDetails',
      name: 'BasicInfomationQuestionnaireQDetails',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/basic/infomation/questionnaire/questionnaireDetails.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'button.details',
        i18n: false,
      },
    },
    {
      // 模板添加
      path: 'questionnaire/addTemplate',
      name: 'BasicInfomationQuestionnaireTemplareAdd',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/questionnaire/addTemplate.vue'),
      meta: {
        hideMenu: true,
        title: 'router.addTemplate',
        i18n: false,
      },
    },
    {
      // 模板修改
      path: 'questionnaire/infoTemplate',
      name: 'BasicInfomationQuestionnaireTemplareInfo',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/questionnaire/addTemplate.vue'),
      meta: {
        hideMenu: true,
        title: 'router.infoTemplate',
        i18n: false,
      },
    },
    {
      // 模板详情
      path: 'questionnaire/details',
      name: 'BasicInfomationQuestionnaireDetails',
      component: () =>
        import('/@/views/project_ftm/teacher/basic/infomation/questionnaire/templateDetails.vue'),
      meta: {
        hideMenu: true,
        title: 'router.templateDetails',
        i18n: false,
      },
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
