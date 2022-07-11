import { AppRouteRecordRaw } from './../../types'
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
    title: '资质管理',
    i18n: false,
  },
  children: [
    // 教学资质
    {
      path: 'teaching',
      name: 'StandardQualificationTeaching',
      redirect: 'index',
      component: getParentLayout('StandardQualificationTeaching'),
      meta: {
        title: '教学资质',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'StandardQualificationTeachingIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '教学资质',
            i18n: false,
          },
        },
      ],
    },
    // 资质审核
    {
      path: 'audit',
      name: 'StandardQualificationAudit',
      redirect: 'index',
      component: getParentLayout('StandardQualificationAudit'),
      meta: {
        title: '资质审核',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'StandardQualificationAuditIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '资质审核',
            i18n: false,
          },
        },
      ],
    },
    // 资质配置
    {
      path: 'config',
      name: 'StandardQualificationConfig',
      redirect: 'index',
      component: getParentLayout('StandardQualificationConfig'),
      meta: {
        title: '资质配置',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'StandardQualificationConfigIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '资质配置',
            i18n: false,
          },
        },
      ],
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
      name: 'StandardCourseProject',
      redirect: 'index',
      component: getParentLayout('StandardCourseProject'),
      meta: {
        title: '培训项目',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'StandardCourseProjectIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '培训项目',
            i18n: false,
          },
        },
      ],
    },
    // 培训大纲
    {
      path: 'outline',
      name: 'StandardCourseOutline',
      redirect: 'index',
      component: getParentLayout('StandardCourseOutline'),
      meta: {
        title: '培训大纲',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'StandardCourseOutlineIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '培训大纲',
            i18n: false,
          },
        },
      ],
    },
    // 培训配置
    {
      path: 'config',
      name: 'StandardCourseConfig',
      redirect: 'index',
      component: getParentLayout('StandardCourseConfig'),
      meta: {
        title: '培训配置',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'StandardCourseConfigIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '培训配置',
            i18n: false,
          },
        },
      ],
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
