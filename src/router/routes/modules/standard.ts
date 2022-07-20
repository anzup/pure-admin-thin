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
    system: SubsystemName.flight_training_management,
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
        system: SubsystemName.flight_training_management,
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
        system: SubsystemName.flight_training_management,
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
        system: SubsystemName.flight_training_management,
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
        system: SubsystemName.flight_training_management,
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
    system: SubsystemName.flight_training_management,
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
        system: SubsystemName.flight_training_management,
      },
    },
    // 培训大纲
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
        system: SubsystemName.flight_training_management,
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
        system: SubsystemName.flight_training_management,
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
