import { AppRouteRecordRaw } from './../../types'
import { getParentLayout, LAYOUT } from '/@/router/constant'

/**
 * 教学工作
 */
const Teaching: AppRouteRecordRaw = {
  path: 'teaching',
  name: 'MyJobTeaching',
  redirect: '',
  component: getParentLayout('MyJobTeaching'),
  meta: {
    title: '教学工作',
    i18n: false,
  },
  children: [
    // 我的学员
    {
      path: 'myStudents',
      name: 'MyJobTeachingMyStudents',
      redirect: 'index',
      component: getParentLayout('MyJobTeachingMyStudents'),
      meta: {
        title: '我的学员',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobTeachingMyStudentsIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '我的学员',
            i18n: false,
          },
        },
      ],
    },
    // 考勤管理
    {
      path: 'attendance',
      name: 'MyJobAttendance',
      redirect: 'index',
      component: getParentLayout('MyJobAttendance'),
      meta: {
        title: '考勤管理',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobAttendanceIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '考勤管理',
            i18n: false,
          },
        },
      ],
    },
    // 飞行评价
    {
      path: 'flight',
      name: 'MyJobTeachingFlight',
      redirect: 'index',
      component: getParentLayout('MyJobTeachingFlight'),
      meta: {
        title: '飞行评价',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobTeachingFlightIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '飞行评价',
            i18n: false,
          },
        },
      ],
    },
    // 地面理论
    {
      path: 'theory',
      name: 'MyJobTeachingTheory',
      redirect: 'index',
      component: getParentLayout('MyJobTeachingTheory'),
      meta: {
        title: '地面理论',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobTeachingTheoryIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '地面理论',
            i18n: false,
          },
        },
      ],
    },
    // 教学任务
    {
      path: 'task',
      name: 'MyJobTeachingTask',
      redirect: 'index',
      component: getParentLayout('MyJobTeachingTask'),
      meta: {
        title: '教学任务',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobTeachingTaskIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '教学任务',
            i18n: false,
          },
        },
      ],
    },
    // 在线教学
    {
      path: 'live',
      name: 'MyJobTeachingLive',
      redirect: 'index',
      component: getParentLayout('MyJobTeachingLive'),
      meta: {
        title: '在线教学',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobTeachingLiveIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '在线教学',
            i18n: false,
          },
        },
      ],
    },
    // 教学课表
    {
      path: 'schedule',
      name: 'MyJobTeachingSchedule',
      redirect: 'index',
      component: getParentLayout('MyJobTeachingSchedule'),
      meta: {
        title: '教学课表',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobTeachingScheduleIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '教学课表',
            i18n: false,
          },
        },
      ],
    },
    // 不及格记录
    {
      path: 'failRecord',
      name: 'MyJobTeachingFailRecord',
      redirect: 'index',
      component: getParentLayout('MyJobTeachingFailRecord'),
      meta: {
        title: '不及格记录',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobTeachingFailRecordIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '不及格记录',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 课件工作
 */
const Courseware: AppRouteRecordRaw = {
  path: 'courseware',
  name: 'MyJobCourseware',
  redirect: '',
  component: getParentLayout('MyJobCourseware'),
  meta: {
    title: '教学工作',
    i18n: false,
  },
  children: [
    // 课件指派
    {
      path: 'assigned',
      name: 'MyJobCoursewareAssigned',
      redirect: 'index',
      component: getParentLayout('MyJobCoursewareAssigned'),
      meta: {
        title: '课件指派',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobCoursewareAssignedIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '课件指派',
            i18n: false,
          },
        },
      ],
    },
    // 评审列表
    {
      path: 'review',
      name: 'MyJobCMyJobCoursewareReview',
      redirect: 'index',
      component: getParentLayout('MyJobCMyJobCoursewareReview'),
      meta: {
        title: '评审列表',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobCMyJobCoursewareReviewIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '评审列表',
            i18n: false,
          },
        },
      ],
    },
    // 指派记录
    {
      path: 'assignedRecord',
      name: 'MyJobCoursewareAssignedRecord',
      redirect: 'index',
      component: getParentLayout('MyJobCoursewareAssignedRecord'),
      meta: {
        title: '指派记录',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobCoursewareAssignedRecordIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '指派记录',
            i18n: false,
          },
        },
      ],
    },
    // 阅读记录
    {
      path: 'readRecord',
      name: 'MyJobCoursewareReadRecord',
      redirect: 'index',
      component: getParentLayout('MyJobCoursewareReadRecord'),
      meta: {
        title: '阅读记录',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobCoursewareReadRecordIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '阅读记录',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 考试工作
 */
const Exam: AppRouteRecordRaw = {
  path: 'exam',
  name: 'MyJobExam',
  redirect: '',
  component: getParentLayout('MyJobExam'),
  meta: {
    title: '考试工作',
    i18n: false,
  },
  children: [
    // 发布考试
    {
      path: 'release',
      name: 'MyJobExamRelease',
      redirect: 'index',
      component: getParentLayout('MyJobExamRelease'),
      meta: {
        title: '发布考试',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobExamReleaseIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '发布考试',
            i18n: false,
          },
        },
      ],
    },
    // 模拟考试
    {
      path: 'mock',
      name: 'MyJobExamMock',
      redirect: 'index',
      component: getParentLayout('MyJobExamMock'),
      meta: {
        title: '模拟考试',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobExamMockIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '模拟考试',
            i18n: false,
          },
        },
      ],
    },
    // 考试统计
    {
      path: 'statistical',
      name: 'MyJobExamStatistical',
      redirect: 'index',
      component: getParentLayout('MyJobExamStatistical'),
      meta: {
        title: '考试统计',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobExamStatisticalIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '考试统计',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 文件中心
 */
const FileCenter: AppRouteRecordRaw = {
  path: 'file',
  name: 'MyJobFile',
  redirect: '',
  component: getParentLayout('MyJobFile'),
  meta: {
    title: '文件中心',
    i18n: false,
  },
  children: [
    // 阅读文件
    {
      path: 'view',
      name: 'FileView',
      redirect: 'index',
      component: getParentLayout('MyJobFileView'),
      meta: {
        title: '阅读文件',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobFileViewIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '阅读文件',
            i18n: false,
          },
        },
      ],
    },
    // 下载文件
    {
      path: 'download',
      name: 'FileDownload',
      redirect: 'index',
      component: getParentLayout('MyJobFileDownload'),
      meta: {
        title: '下载文件',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobFileDownloadIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '下载文件',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 我的学习
 */
const Learning: AppRouteRecordRaw = {
  path: 'learning',
  name: 'MyJobLearning',
  redirect: '',
  component: getParentLayout('MyJobLearning'),
  meta: {
    title: '我的学习',
    i18n: false,
  },
  children: [
    // 培训课表
    {
      path: 'schedule',
      name: 'MyJobLearningSchedule',
      redirect: 'index',
      component: getParentLayout('MyJobLearningSchedule'),
      meta: {
        title: '培训课表',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobLearningScheduleIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '培训课表',
            i18n: false,
          },
        },
      ],
    },
    // 飞行签字
    {
      path: 'flightSign',
      name: 'MyJobLearningFlightSign',
      redirect: 'index',
      component: getParentLayout('MyJobLearningFlightSign'),
      meta: {
        title: '飞行签字',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobLearningFlightSignIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '飞行签字',
            i18n: false,
          },
        },
      ],
    },
    // 理论签字
    {
      path: 'theorySign',
      name: 'MyJobLearningTheorySign',
      redirect: 'index',
      component: getParentLayout('MyJobLearningTheorySign'),
      meta: {
        title: '理论签字',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobLearningTheorySignIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '理论签字',
            i18n: false,
          },
        },
      ],
    },
    // 在线学习
    {
      path: 'online',
      name: 'MyJobLearningOnline',
      redirect: 'index',
      component: getParentLayout('MyJobLearningOnline'),
      meta: {
        title: '在线学习',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobLearningOnlineIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '在线学习',
            i18n: false,
          },
        },
      ],
    },
    // 学习任务
    {
      path: 'task',
      name: 'MyJobLearningTask',
      redirect: 'index',
      component: getParentLayout('MyJobLearningTask'),
      meta: {
        title: '学习任务',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobLearningTaskIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '学习任务',
            i18n: false,
          },
        },
      ],
    },
    // 问卷填写
    {
      path: 'questionnaire',
      name: 'MyJobLearningQuestionnaire',
      redirect: 'index',
      component: getParentLayout('MyJobLearningQuestionnaire'),
      meta: {
        title: '问卷填写',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobLearningQuestionnaireIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '问卷填写',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 *  我的课件
 */
const MyCourseware: AppRouteRecordRaw = {
  path: 'myCourseware',
  name: 'MyJobMyCourseware',
  redirect: '',
  component: getParentLayout('MyJobMyCourseware'),
  meta: {
    title: '我的课件',
    i18n: false,
  },
  children: [
    // 课件列表
    {
      path: 'list',
      name: 'MyJobMyJobMyCoursewareList',
      redirect: 'index',
      component: getParentLayout('MyJobMyJobMyCoursewareList'),
      meta: {
        title: '课件列表',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobMyJobMyCoursewareListIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '课件列表',
            i18n: false,
          },
        },
      ],
    },
    // 阅读任务
    {
      path: 'task',
      name: 'MyJobMyJobMyCoursewareTask',
      redirect: 'index',
      component: getParentLayout('MyJobMyJobMyCoursewareTask'),
      meta: {
        title: '阅读任务',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobMyJobMyCoursewareTaskIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '阅读任务',
            i18n: false,
          },
        },
      ],
    },
    // 阅读记录
    {
      path: 'record',
      name: 'MyJobMyJobMyCoursewareRecord',
      redirect: 'index',
      component: getParentLayout('MyJobMyJobMyCoursewareRecord'),
      meta: {
        title: '阅读记录',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobMyJobMyCoursewareRecordIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '阅读记录',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 我的考试
 */
const MyExam: AppRouteRecordRaw = {
  path: 'myExam',
  name: 'MyJobMyExam',
  redirect: '',
  component: getParentLayout('MyJobMyExam'),
  meta: {
    title: '我的考试',
    i18n: false,
  },
  children: [
    // 教学考试
    {
      path: 'teaching',
      name: 'MyJobMyJobMyExamTeaching',
      redirect: 'index',
      component: getParentLayout('MyJobMyJobMyExamTeaching'),
      meta: {
        title: '教学考试',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobMyJobMyExamTeachingIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '教学考试',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 客户记录
 */
const Customer: AppRouteRecordRaw = {
  path: 'customer',
  name: 'MyJobCustomer',
  redirect: '',
  component: getParentLayout('MyJobCustomer'),
  meta: {
    title: '客户记录',
    i18n: false,
  },
  children: [
    // 参训人员
    {
      path: 'personnal',
      name: 'MyJobCustomerPersonnal',
      redirect: 'index',
      component: getParentLayout('MyJobCustomerPersonnal'),
      meta: {
        title: '参训人员',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobCustomerPersonnalIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '参训人员',
            i18n: false,
          },
        },
      ],
    },
    // 培训进度
    {
      path: 'progress',
      name: 'MyJobCustomerProgress',
      redirect: 'index',
      component: getParentLayout('MyJobCustomerProgress'),
      meta: {
        title: '培训进度',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobCustomerProgressIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '培训进度',
            i18n: false,
          },
        },
      ],
    },
    // 培训记录
    {
      path: 'record',
      name: 'MyJobCustomerRecord',
      redirect: 'index',
      component: getParentLayout('MyJobCustomerRecord'),
      meta: {
        title: '培训记录',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobCustomerRecordIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '培训记录',
            i18n: false,
          },
        },
      ],
    },
  ],
}
/**
 * 客户合同
 */
const Contract: AppRouteRecordRaw = {
  path: 'contract',
  name: 'MyJobContract',
  redirect: '',
  component: getParentLayout('MyJobContract'),
  meta: {
    title: '客户合同',
    i18n: false,
  },
  children: [
    // 培训合同
    {
      path: 'train',
      name: 'MyJobContractTrain',
      redirect: 'index',
      component: getParentLayout('MyJobContractTrain'),
      meta: {
        title: '培训合同',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'MyJobContractTrainIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '培训合同',
            i18n: false,
          },
        },
      ],
    },
  ],
}

const Route: AppRouteRecordRaw = {
  path: '/myJob',
  name: 'MyJob',
  component: LAYOUT,
  redirect: '',
  meta: {
    icon: '',
    title: '我的工作',
    i18n: false,
    orderNo: 1,
  },
  children: [
    Teaching,
    Courseware,
    Exam,
    FileCenter,
    Learning,
    MyCourseware,
    MyExam,
    Customer,
    Contract,
  ],
}

export default Route
