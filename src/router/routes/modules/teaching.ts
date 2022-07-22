import { AppRouteRecordRaw, SubsystemName } from './../../types'
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
    title: 'router.educationalAdministration',
    system: SubsystemName.operation_plan_management,
  },
  children: [
    // 签名管理
    {
      path: 'signature',
      name: 'TeachingEducationSignatureIndex',
      component: () =>
        import('/@/views/project_ftm/teacher/teaching/education/signature/index.vue'),
      meta: {
        title: 'router.signManage',
        system: SubsystemName.operation_plan_management,
      },
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
      component: () => import('/@/views/project_ftm/teacher/teaching/education/record/index.vue'),
      meta: {
        title: 'router.trainingRecords',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      // 学员课程学习记录
      path: 'record/student/:studentId',
      name: 'TeachingEducationRecordStudentDetail',
      component: () =>
        import('/@/views/project_ftm/teacher/teaching/education/record/studentRecords/details.vue'),
      meta: {
        hideMenu: true,
        title: 'router.courseStudentRecords',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 学员详情tab页
      path: 'record/student/:studentId/tabs/:recordId',
      name: 'TeachingEducationRecordStudentDetails',
      component: () =>
        import('/@/views/project_ftm/teacher/teaching/education/record/studentRecords/tabs.vue'),
      meta: {
        hideMenu: true,
        title: 'router.detail',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 不及格考试记录
      path: 'record/student/:studentId/tabs/:recordId/examRecordsDetails',
      name: 'TeachingEducationRecordExamDetails',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/teaching/education/record/studentRecords/failRecords/details.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'router.examRecords',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 考试记录（试卷）
      path: 'record/student/:studentId/tabs/:recordId/examRecordsPaper',
      name: 'TeachingEducationRecordExamRecordPaper',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/examPaperView.vue'),
      meta: {
        hideMenu: true,
        title: 'router.examRecordsPaper',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 考试记录（成绩单）
      path: 'record/student/:studentId/tabs/:recordId/examRecordsReport',
      name: 'TeachingEducationRecordExamRecordsReport',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/schoolReport.vue'),
      meta: {
        hideMenu: true,
        title: 'router.examRecordsReport',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // CBTA详情
      path: 'record/student/:studentId/tabs/:recordId/CBTAdetails',
      name: 'TeachingEducationRecordCBTA',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/teaching/education/record/studentRecords/CBTARecords/details.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'router.CBTAdetails',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 培训档案（预览）
      path: 'record/student/:studentId/tabs/:recordId/triningRecords',
      name: 'TeachingEducationRecordTrainingReview',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/teaching/education/record/studentRecords/trainingArchives/preview.vue'
        ),
      meta: {
        hideMenu: true,
        title: '预览',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 教员详情tab页
      path: 'record/teacher/tabs',
      name: 'TeachingEducationRecordTeacherDetails',
      component: () =>
        import('/@/views/project_ftm/teacher/teaching/education/record/teacherRecords/tabs.vue'),
      meta: {
        hideMenu: true,
        title: 'router.detail',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 考试记录（试卷）
      path: 'record/teacher/examRecordsPaper',
      name: 'TeachingEducationRecordTeacherExamRecordPaper',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/examPaperView.vue'),
      meta: {
        hideMenu: true,
        title: 'router.examRecordsPaper',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 考试记录（成绩单）
      path: 'record/teacher/examRecordsReport',
      name: 'TeachingEducationRecordTeacherExamRecordsReport',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/schoolReport.vue'),
      meta: {
        hideMenu: true,
        title: 'router.examRecordsReport',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 讲评单详情
      path: 'record/reports/details',
      name: 'TeachingEducationRecordReportsDetails',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/teaching/education/record/reportsPrint/detailsList.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'router.detail',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    {
      // 讲评训练单
      path: 'record/reports/detail',
      name: 'TeachingEducationRecordReportsDetail',
      component: () =>
        import('/@/views/project_ftm/teacher/teaching/education/record/reportsPrint/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'router.detail',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/teaching/education/record',
      },
    },
    // 训练配置
    {
      path: 'config',
      name: 'TeachingEducationConfigIndex',
      component: () => import('/@/views/project_ftm/teacher/teaching/education/config/index.vue'),
      meta: {
        title: '训练配置',
        system: SubsystemName.operation_plan_management,
      },
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
      name: 'TeachingCoursewareConfigIndex',
      component: () => import('/@/views/project_ftm/teacher/teaching/courseware/config/index.vue'),
      meta: {
        title: '课件配置',
        i18n: false,
        system: SubsystemName.operation_plan_management,
      },
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
    title: 'router.examManage',
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
