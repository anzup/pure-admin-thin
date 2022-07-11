import { AppRouteRecordRaw } from './../../types'
import { getParentLayout, LAYOUT } from '/@/router/constant'

/**
 * 教务管理
 */
const Education: AppRouteRecordRaw = {
  path: 'education',
  name: 'TeachingEducation',
  redirect: '',
  component: getParentLayout('TeachingEducation'),
  meta: {
    title: '教务管理',
    i18n: false,
  },
  children: [
    // 签名管理
    {
      path: 'signature',
      name: 'TeachingEducationSignature',
      redirect: 'index',
      component: getParentLayout('TeachingEducationSignature'),
      meta: {
        title: '签名管理',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingEducationSignatureIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '签名管理',
            i18n: false,
          },
        },
      ],
    },
    // 教学进度
    {
      path: 'progress',
      name: 'TeachingEducationProgress',
      redirect: 'index',
      component: getParentLayout('TeachingEducationProgress'),
      meta: {
        title: '教学进度',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingEducationProgressIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '教学进度',
            i18n: false,
          },
        },
      ],
    },
    // 培训记录
    {
      path: 'record',
      name: 'TeachingEducationRecord',
      redirect: 'index',
      component: getParentLayout('TeachingEducationRecord'),
      meta: {
        title: '培训记录',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingEducationRecordIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '培训记录',
            i18n: false,
          },
        },
      ],
    },
    // 训练配置
    {
      path: 'config',
      name: 'TeachingEducationConfig',
      redirect: 'index',
      component: getParentLayout('TeachingEducationConfig'),
      meta: {
        title: '训练配置',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingEducationConfigIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '训练配置',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 课件管理
 */
const Courseware: AppRouteRecordRaw = {
  path: 'courseware',
  name: 'TeachingCourseware',
  redirect: '',
  component: getParentLayout('TeachingCourseware'),
  meta: {
    title: '课件管理',
    i18n: false,
  },
  children: [
    // 课件列表
    {
      path: 'list',
      name: 'TeachingCoursewareList',
      redirect: 'index',
      component: getParentLayout('TeachingCoursewareList'),
      meta: {
        title: '课件列表',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingCoursewareListIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '课件列表',
            i18n: false,
          },
        },
      ],
    },
    // 课件评审
    {
      path: 'review',
      name: 'TeachingCoursewareReview',
      redirect: 'index',
      component: getParentLayout('TeachingCoursewareReview'),
      meta: {
        title: '课件评审',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingCoursewareReviewIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '课件评审',
            i18n: false,
          },
        },
      ],
    },
    // 记录查询
    {
      path: 'record',
      name: 'TeachingCoursewareRecord',
      redirect: 'index',
      component: getParentLayout('TeachingCoursewareRecord'),
      meta: {
        title: '记录查询',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingCoursewareRecordIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '记录查询',
            i18n: false,
          },
        },
      ],
    },
    // 课件配置
    {
      path: 'config',
      name: 'TeachingCoursewareConfig',
      redirect: 'index',
      component: getParentLayout('TeachingCoursewareConfig'),
      meta: {
        title: '课件配置',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingCoursewareConfigIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '课件配置',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 考试管理
 */
const Exam: AppRouteRecordRaw = {
  path: 'exam',
  name: 'TeachingExam',
  redirect: '',
  component: getParentLayout('TeachingExam'),
  meta: {
    title: '考试管理',
    i18n: false,
  },
  children: [
    // 题库管理
    {
      path: 'questionBank',
      name: 'TeachingExamQuestionBank',
      redirect: 'index',
      component: getParentLayout('TeachingExamQuestionBank'),
      meta: {
        title: '题库管理',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingExamQuestionBankIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '题库管理',
            i18n: false,
          },
        },
      ],
    },
    // 发起考试
    {
      path: 'initiate',
      name: 'TeachingExamInitiate',
      redirect: 'index',
      component: getParentLayout('TeachingExamInitiate'),
      meta: {
        title: '发起考试',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingExamInitiateIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '发起考试',
            i18n: false,
          },
        },
      ],
    },
    // 考试查询
    {
      path: 'record',
      name: 'TeachingExamRecord',
      redirect: 'index',
      component: getParentLayout('TeachingExamRecord'),
      meta: {
        title: '考试查询',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingExamRecordIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '考试查询',
            i18n: false,
          },
        },
      ],
    },
    // 考试统计
    {
      path: 'statistical',
      name: 'TeachingExamStatistical',
      redirect: 'index',
      component: getParentLayout('TeachingExamStatistical'),
      meta: {
        title: '考试统计',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingExamStatisticalIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '考试统计',
            i18n: false,
          },
        },
      ],
    },
    // 考试配置
    {
      path: 'config',
      name: 'TeachingExamConfig',
      redirect: 'index',
      component: getParentLayout('TeachingExamConfig'),
      meta: {
        title: '考试配置',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'TeachingExamConfigIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '考试配置',
            i18n: false,
          },
        },
      ],
    },
  ],
}

const Route: AppRouteRecordRaw = {
  path: '/teaching',
  name: 'Teaching',
  component: LAYOUT,
  redirect: '',
  meta: {
    icon: '',
    title: '培训教学',
    i18n: false,
    orderNo: 4,
  },
  children: [Education, Courseware, Exam],
}

export default Route
