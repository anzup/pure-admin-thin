import { AppRouteRecordRaw, SubsystemName } from './../../types'
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
    system: SubsystemName.flight_training_management,
  },
  children: [
    // 我的学员
    {
      path: 'myStudents',
      name: 'MyJobTeachingMyStudentsIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/myStudents/index.vue'),
      meta: {
        title: 'router.MyStudent',
        system: SubsystemName.flight_training_management,
      },
    },
    {
      // TODO:课程学习记录
      path: 'myStudents/tabs/:recordId',
      name: 'MyJobTeachingMyStudentsRecord',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: 'router.courseStudentRecords',
        hideMenu: true,
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/myStudents',
      },
    },
    {
      // TODO: 课程学习记录/CBTA详情
      path: 'myStudents/tabs/:recordId/CBTAdetails',
      name: 'MyJobTeachingMyStudentsRecordCBTA',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: 'router.CBTAdetails',
        hideMenu: true,
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/myStudents',
      },
    },
    {
      // TODO:课程学习记录/考试记录
      path: 'myStudents/tabs/:recordId/examRecordsDetails',
      name: 'MyJobTeachingMyStudentsRecordExam',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: 'router.examRecords',
        hideMenu: true,
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/myStudents',
      },
    },
    {
      // TODO:课程学习记录/考试记录（试卷）
      path: 'myStudents/tabs/:recordId/examRecordsPaper',
      name: 'MyJobTeachingMyStudentsRecordExamPaper',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: 'router.examRecordsPaper',
        hideMenu: true,
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/myStudents',
      },
    },
    {
      // TODO:课程学习记录/考试记录（成绩单）
      path: 'myStudents/tabs/:recordId/examRecordsReport',
      name: 'MyJobTeachingMyStudentsRecordExamReport',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: 'router.examRecordsReport',
        hideMenu: true,
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/myStudents',
      },
    },
    {
      // TODO:课程学习记录/培训档案（预览）
      path: 'myStudents/tabs/:recordId/trainingRecords',
      name: 'MyJobTeachingMyStudentsRecordTraningRecords',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: 'router.trainingArchives',
        hideMenu: true,
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/myStudents',
      },
    },
    // 考勤管理
    {
      path: 'attendance',
      name: 'MyJobAttendanceIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/attendance/index.vue'),
      meta: {
        title: 'router.attendanceManagement',
      },
    },
    {
      path: 'attendance/detail',
      name: 'MyJobAttendanceDetail',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/attendance/detail.vue'),
      meta: {
        title: 'router.detail',
        hideMenu: true,
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/attendance',
      },
    },
    // 飞行评价
    {
      path: 'flight',
      name: 'MyJobTeachingFlightIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/flight/index.vue'),
      meta: {
        title: 'router.flightCBTA',
        system: SubsystemName.flight_training_management,
      },
    },
    {
      // 评价列表
      path: 'flight/evaluateTable',
      name: 'MyJobTeachingFlightEvaluateTable',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/myJob/teaching/flight/flightTrainingEvaluation/evaluate.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'router.flightEvaluationTable',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/flight',
      },
    },
    {
      // 评价/修改
      path: 'flight/evaluateEdit',
      name: 'MyJobTeachingFlightEvaluateEdit',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/myJob/teaching/flight/flightTrainingEvaluation/edit.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'router.flightEvaluationDetails',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/flight',
      },
    },
    {
      // 详情
      path: 'flight/evaluateInfo',
      name: 'MyJobTeachingFlightEvaluateInfo',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/myJob/teaching/flight/flightTrainingEvaluation/edit.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'router.flightEvaluationDetails',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/flight',
      },
    },
    {
      // 阅读任务
      path: 'flight/coursewareReadingTask',
      name: 'MyJobTeachingFlightReadingTask',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/myJob/teaching/flight/flightTrainingEvaluation/ReadingTask.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'router.readingTask',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/flight',
      },
    },
    {
      // 飞行考试详情
      path: 'flight/testDetails',
      name: 'MyJobTeachingFlightTestDetails',
      component: () =>
        import('/@/views/project_ftm/teacher/myJob/teaching/flight/flightTest/details.vue'),
      meta: {
        hideMenu: true,
        title: 'router.flightTestDetails',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/flight',
      },
    },
    {
      // 岗位胜任力详情
      path: 'flight/studentReviewEdit',
      name: 'MyJobTeachingFlightStudentReviewEdit',
      component: () =>
        import('/@/views/project_ftm/teacher/myJob/teaching/flight/studentReview/add.vue'),
      meta: {
        hideMenu: true,
        title: 'router.EditStudentReview',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/flight',
      },
    },
    {
      // 学员离队训练评定表详情
      path: 'flight/leaveTrainEvaluation',
      name: 'MyJobTeachingFlightLeaveTrainEvaluation',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/myJob/teaching/flight/leaveTrainEvaluation/detail.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'router.leaveTrainEvaluation',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/flight',
      },
    },
    // 地面理论
    {
      path: 'theory',
      name: 'MyJobTeachingTheoryIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/theory/index.vue'),
      meta: {
        title: 'router.theorySchedule',
        system: SubsystemName.flight_training_management,
      },
    },
    {
      // 签名表
      path: 'theory/list/:clazzId',
      name: 'MyJobTeachingTheoryList',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/theory/sign.vue'),
      meta: {
        hideMenu: true,
        title: 'table.sign',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/theory',
      },
    },
    // 教学任务
    {
      path: 'task',
      name: 'MyJobTeachingTaskIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/task/index.vue'),
      meta: {
        title: 'router.TeachingTask',
        system: SubsystemName.flight_training_management,
      },
    },
    {
      path: 'task/teachingTaskDetail',
      name: 'MyJobTeachingTaskDetail',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/task/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'router.detail',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/task',
      },
    },
    {
      path: 'task/teachingTaskAdd',
      name: 'MyJobTeachingTaskAdd',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/task/add.vue'),
      meta: {
        hideMenu: true,
        title: 'button.add',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/task',
      },
    },
    // 在线教学
    {
      path: 'live',
      name: 'MyJobTeachingLiveIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/live/index.vue'),
      meta: {
        title: 'router.OnlineTeaching',
        system: SubsystemName.flight_training_management,
      },
    },
    {
      path: 'live/add',
      name: 'MyJobTeachingLiveCreate',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/live/add.vue'),
      meta: {
        hideMenu: true,
        title: 'router.createLive',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/live',
      },
    },
    {
      path: 'live/edit',
      name: 'MyJobTeachingLiveEdit',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/live/add.vue'),
      meta: {
        hideMenu: true,
        title: 'button.modify',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/live',
      },
    },
    {
      path: 'live/:id',
      name: 'MyJobTeachingLiveDetail',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/live/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'router.Living',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/live',
      },
    },
    // 教学课表
    {
      path: 'schedule',
      name: 'MyJobTeachingScheduleIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/schedule/index.vue'),
      meta: {
        title: '教学课表',
        i18n: false,
        system: SubsystemName.flight_training_management,
      },
    },
    // 不及格记录
    {
      path: 'failRecord',
      name: 'MyJobTeachingFailRecordIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/teaching/failRecord/index.vue'),
      meta: {
        title: 'router.additionalRecords',
        system: SubsystemName.flight_training_management,
      },
    },
    {
      path: 'failRecord/detail',
      name: 'MyJobTeachingFailRecordDetail',
      // TODO:学员培训记录/不及格记录/详情
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        hideMenu: true,
        title: 'router.examRecords',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/failRecord',
      },
    },
    {
      path: 'failRecord/record',
      name: 'MyJobTeachingFailRecordRecord',
      component: () =>
        import(
          '/@/views/project_ftm/teacher/myJob/teaching/flight/flightTrainingEvaluation/edit.vue'
        ),
      meta: {
        hideMenu: true,
        title: 'router.examRecords',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/teaching/failRecord',
      },
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
    title: '课件工作',
    i18n: false,
    system: SubsystemName.flight_training_management,
  },
  children: [
    // 课件指派
    {
      path: 'assigned',
      name: 'MyJobCoursewareAssignedIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/assigned/index.vue'),
      meta: {
        title: '课件指派',
        i18n: false,
        system: SubsystemName.flight_training_management,
      },
    },
    {
      // 添加上传
      path: 'assigned/add',
      name: 'MyJobCoursewareAssignedUpload',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/assigned/upload.vue'),
      meta: {
        hideMenu: true,
        title: 'button.addTo',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/courseware/assigned',
      },
    },
    {
      // 修改
      path: 'assigned/info',
      name: 'MyJobCoursewareAssignedEdit',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/assigned/upload.vue'),
      meta: {
        hideMenu: true,
        title: 'button.modify',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/courseware/assigned',
      },
    },
    {
      // 详情
      path: 'assigned/details',
      name: 'MyJobCoursewareAssignedDetail',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/assigned/details.vue'),
      meta: {
        hideMenu: true,
        title: 'button.comment',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/courseware/assigned',
      },
    },
    {
      // 指派学员
      path: 'assigned/student',
      name: 'MyJobCoursewareAssignedStudent',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/assigned/student.vue'),
      meta: {
        hideMenu: true,
        title: 'router.coursewareAssignment',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/courseware/assigned',
      },
    },
    {
      // 指派教员
      path: 'assigned/teacher',
      name: 'MyJobCoursewareAssignedTeacher',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/assigned/teacher.vue'),
      meta: {
        hideMenu: true,
        title: 'router.coursewareAssignment',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/courseware/assigned',
      },
    },
    // 评审列表
    {
      path: 'review',
      name: 'MyJobCMyJobCoursewareReviewIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/review/index.vue'),
      meta: {
        title: '评审列表',
        i18n: false,
        system: SubsystemName.flight_training_management,
      },
    },
    {
      // TODO 替换原path coursewareReviewdetails
      // 课件详情
      path: 'review/coursewareDetail',
      name: 'MyJobCMyJobCoursewareReviewCoursewareDetail',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/assigned/details.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/courseware/review',
      },
    },
    {
      // 详情
      // TODO: 替换原path reviewDetails
      path: 'review/detail',
      name: 'MyJobCMyJobCoursewareReviewDetail',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/review/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/courseware/review',
      },
    },
    // 指派记录
    {
      path: 'record',
      name: 'MyJobCoursewareAssignedRecordIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/record/tab.vue'),
      meta: {
        title: 'router.coursewareRecord',
        system: SubsystemName.flight_training_management,
      },
    },
    // 阅读记录
    {
      path: 'readRecord',
      name: 'MyJobCoursewareReadRecordIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/courseware/readRecord/index.vue'),
      meta: {
        title: 'router.readingTask',
        system: SubsystemName.flight_training_management,
      },
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
    system: SubsystemName.flight_training_management,
  },
  children: [
    // 发布考试
    {
      path: 'release',
      name: 'MyJobExamReleaseIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/index.vue'),
      meta: {
        title: '发布考试',
        i18n: false,
        system: SubsystemName.flight_training_management,
      },
    },
    {
      // 新增
      path: 'release/add',
      name: 'MyJobExamReleaseAdd',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/add.vue'),
      meta: {
        hideMenu: true,
        title: 'button.addTo',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/release',
      },
    },
    {
      // 详情
      path: 'release/info',
      name: 'MyJobExamReleaseInfo',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/add.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/release',
      },
    },
    {
      // 试卷详情
      path: 'release/details',
      name: 'MyJobExamReleaseDetails',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/details.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/release',
      },
    },
    {
      // 试卷修改
      path: 'release/modify',
      name: 'MyJobExamReleaseModify',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/modify.vue'),
      meta: {
        hideMenu: true,
        title: 'button.edit',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/release',
      },
    },
    {
      // 考试列表
      path: 'release/examDetails/:examId',
      name: 'MyJobExamReleaseExamDetails',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/examDetails.vue'),
      meta: {
        origin: 'FORMAL',
        hideMenu: true,
        title: 'button.details',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/release',
      },
    },
    {
      // 成绩单
      path: 'release/examDetails/:examId/schoolReport',
      name: 'MyJobExamReleaseSchoolReport',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/schoolReport.vue'),
      meta: {
        hideMenu: true,
        title: 'button.reportCard',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/release',
      },
    },
    {
      // 阅卷
      path: 'release/examDetails/:examId/markingPaperView',
      name: 'MyJobExamReleaseMarkingPaperView',
      component: () =>
        import('/@/views/project_ftm/teacher/myJob/exam/release/markingPaperView.vue'),
      meta: {
        hideMenu: true,
        title: 'button.markingPapers',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/release',
      },
    },
    {
      // 试卷
      path: 'release/examDetails/:examId/examPaperView',
      name: 'MyJobExamReleaseExamPaperView',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/examPaperView.vue'),
      meta: {
        hideMenu: true,
        title: 'button.examPaper',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/release',
      },
    },
    // 模拟考试
    {
      path: 'mock',
      name: 'MyJobExamMockIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/mock/index.vue'),
      meta: {
        title: 'router.examMock',
        system: SubsystemName.flight_training_management,
      },
    },
    {
      // 新增
      path: 'mock/add',
      name: 'MyJobExamMockAdd',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/add.vue'),
      meta: {
        hideMenu: true,
        title: 'button.addTo',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/mock',
      },
    },
    {
      // 修改
      path: 'mock/info',
      name: 'MyJobExamMockInfo',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/add.vue'),
      meta: {
        hideMenu: true,
        title: 'button.addTo',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/mock',
      },
    },
    {
      // 详情
      path: 'mock/details',
      name: 'MyJobExamMockDetails',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/details.vue'),
      meta: {
        hideMenu: true,
        title: 'button.details',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/mock',
      },
    },
    {
      // 考试详情
      path: 'mock/examDetails/:examId',
      name: 'MyJobExamMockExamDetails',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/examDetails.vue'),
      meta: {
        origin: 'SIMULATED',
        hideMenu: true,
        title: 'button.details',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/mock',
      },
    },
    {
      // 试卷
      path: 'mock/examDetails/:examId/examPaperView',
      name: 'MyJobExamMockExamPaperView',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/examPaperView.vue'),
      meta: {
        hideMenu: true,
        title: 'button.examPaper',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/mock',
      },
    },
    {
      // 阅卷
      path: 'mock/examDetails/:examId/markingPaperView',
      name: 'MyJobExamMockMarkingPaperView',
      component: () =>
        import('/@/views/project_ftm/teacher/myJob/exam/release/markingPaperView.vue'),
      meta: {
        hideMenu: true,
        title: 'button.markingPapers',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/mock',
      },
    },
    {
      // 成绩单
      path: 'mock/examDetails/:examId/schoolReport',
      name: 'MyJobExamMockSchoolReport',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/release/schoolReport.vue'),
      meta: {
        hideMenu: true,
        title: 'button.reportCard',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/mock',
      },
    },
    // 考试统计
    {
      path: 'statistical',
      name: 'MyJobExamStatisticalIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/statistical/index.vue'),
      meta: {
        title: 'router.eaxmStatistics',
        system: SubsystemName.flight_training_management,
      },
    },
    {
      // 考试详情
      path: 'statistical/details',
      name: 'MyJobExamStatisticalDetails',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/statistical/details.vue'),
      meta: {
        hideMenu: true,
        title: 'router.detail',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/statistical',
      },
    },
    {
      // 试题详情
      path: 'statistical/testDetails',
      name: 'MyJobExamStatisticalTestDetails',
      component: () => import('/@/views/project_ftm/teacher/myJob/exam/statistical/tab.vue'),
      meta: {
        hideMenu: true,
        title: 'router.questionDetails',
        system: SubsystemName.flight_training_management,
        currentActiveMenu: '/myJob/exam/statistical',
      },
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
    title: 'router.fileCenter',
    system: SubsystemName.flight_training_management,
  },
  children: [
    // 阅读文件
    {
      path: 'view',
      name: 'MyJobFileViewIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/fileCenter/view/index.vue'),
      meta: {
        title: 'router.readTheDocument',
        system: SubsystemName.flight_training_management,
      },
    },
    // 下载文件
    {
      path: 'download',
      name: 'MyJobFileDownloadIndex',
      component: () => import('/@/views/project_ftm/teacher/myJob/fileCenter/download/index.vue'),
      meta: {
        title: 'router.downloadFiles',
        system: SubsystemName.flight_training_management,
      },
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
      name: 'MyJobLearningScheduleIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '培训课表',
        i18n: false,
      },
    },
    // 飞行签字
    {
      path: 'flightSign',
      name: 'MyJobLearningFlightSignIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '飞行签字',
        i18n: false,
      },
    },
    // 理论签字
    {
      path: 'theorySign',
      name: 'MyJobLearningTheorySignIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '理论签字',
        i18n: false,
      },
    },
    // 在线学习
    {
      path: 'online',
      name: 'MyJobLearningOnlineIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '在线学习',
        i18n: false,
      },
    },
    // 学习任务
    {
      path: 'task',
      name: 'MyJobLearningTaskIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '学习任务',
        i18n: false,
      },
    },
    // 问卷填写
    {
      path: 'questionnaire',
      name: 'MyJobLearningQuestionnaireIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '问卷填写',
        i18n: false,
      },
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
      name: 'MyJobMyJobMyCoursewareListIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '课件列表',
        i18n: false,
      },
    },
    // 阅读任务
    {
      path: 'task',
      name: 'MyJobMyJobMyCoursewareTaskIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '阅读任务',
        i18n: false,
      },
    },
    // 阅读记录
    {
      path: 'record',
      name: 'MyJobMyJobMyCoursewareRecordIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '阅读记录',
        i18n: false,
      },
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
      name: 'MyJobMyJobMyExamTeachingIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '教学考试',
        i18n: false,
      },
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
      name: 'MyJobCustomerPersonnalIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '参训人员',
        i18n: false,
      },
    },
    // 培训进度
    {
      path: 'progress',
      name: 'MyJobCustomerProgressIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '培训进度',
        i18n: false,
      },
    },
    // 培训记录
    {
      path: 'record',
      name: 'MyJobCustomerRecordIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '培训记录',
        i18n: false,
      },
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
      name: 'MyJobContractTrainIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '培训合同',
        i18n: false,
      },
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
