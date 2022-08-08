import { AppRouteRecordRaw, SubsystemName } from './../../types'
import { getParentLayout, LAYOUT } from '/@/router/constant'

/**
 * 资质管理
 */
const Qualification: AppRouteRecordRaw = {
  path: 'qualification',
  name: 'StandardQualification',
  redirect: '',
  component: getParentLayout('StandardQualification'),
  meta: {
    title: 'router.qualificationManagement',
  },
  children: [
    // 教学资质
    {
      path: 'teaching',
      name: 'StandardQualificationTeachingIndex',
      component: () =>
        import('/@/views/project_ftm/teacher/standard/qualification/teaching/index.vue'),
      meta: {
        title: '教学资质',
        i18n: false,
      },
    },
    {
      // 详情
      path: 'teaching/detail/:id',
      name: 'StandardQualificationTeachingDetail',
      component: () =>
        import('/@/views/project_ftm/teacher/standard/qualification/teaching/teacherDetail.vue'),
      meta: {
        hideMenu: true,
        title: 'router.detail',

        currentActiveMenu: '/standard/qualification/teaching',
      },
    },
    // 资质审核
    {
      path: 'audit',
      name: 'StandardQualificationAuditIndex',
      component: () =>
        import('/@/views/project_ftm/teacher/standard/qualification/audit/index.vue'),
      meta: {
        title: 'router.qualificationAudit',
      },
    },
    // 资质配置
    {
      path: 'config',
      name: 'StandardQualificationConfigIndex',
      component: () =>
        import('/@/views/project_ftm/teacher/standard/qualification/config/index.vue'),
      meta: {
        title: 'table.qualificationConfigs',
      },
    },
  ],
}
/**
 * 课程管理
 */
const Course: AppRouteRecordRaw = {
  path: 'course',
  name: 'StandardCourse',
  redirect: '',
  component: getParentLayout('StandardCourse'),
  meta: {
    title: '课程管理',
    i18n: false,
  },
  children: [
    // 培训项目
    {
      path: 'project',
      name: 'StandardCourseProjectIndex',
      component: () => import('/@/views/project_ftm/teacher/standard/course/project/index.vue'),
      meta: {
        title: '培训项目',
        i18n: false,
      },
    },
    // 培训大纲
    // TODO 如何合并？使用opm还是ftm的大纲页面？
    {
      path: 'outline',
      name: 'StandardCourseOutlineIndex',
      component: () => import('/@/views/project_ftm/teacher/standard/course/outline/tab.vue'),
      meta: {
        title: '培训大纲',
        i18n: false,
      },
    },
    {
      // 湿租详情
      path: 'outline/administer',
      name: 'StandardCourseOutlineAdminister',
      component: () =>
        import('/@/views/project_ftm/teacher/standard/course/outline/administer.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',

        currentActiveMenu: '/standard/course/outline',
      },
    },
    // 培训配置
    {
      path: 'config',
      name: 'StandardCourseConfigIndex',
      component: () => import('/@/views/project_ftm/teacher/standard/course/config/index.vue'),
      meta: {
        title: '培训配置',
        i18n: false,
      },
    },
  ],
}

const Route: AppRouteRecordRaw = {
  path: '/standard',
  name: 'Standard',
  component: LAYOUT,
  redirect: '',
  meta: {
    icon: '',
    title: '培训标准',
    i18n: false,
    orderNo: 2,
  },
  children: [Qualification, Course],
}

export default Route
