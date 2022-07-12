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
      name: 'StandardQualificationTeachingIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '教学资质',
        i18n: false,
      },
    },
    // 资质审核
    {
      path: 'audit',
      name: 'StandardQualificationAuditIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '资质审核',
        i18n: false,
      },
    },
    // 资质配置
    {
      path: 'config',
      name: 'StandardQualificationConfigIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '资质配置',
        i18n: false,
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
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '培训项目',
        i18n: false,
      },
    },
    // 培训大纲
    {
      path: 'outline',
      name: 'StandardCourseOutlineIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '培训大纲',
        i18n: false,
      },
    },
    // 培训配置
    {
      path: 'config',
      name: 'StandardCourseConfigIndex',
      component: () => import('/@/views/dashboard/index.vue'),
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
