import { AppRouteRecordRaw, SubsystemName } from './../../types'
import { getParentLayout, LAYOUT } from '/@/router/constant'

/**
 * 计划管理
 */
const Manage: AppRouteRecordRaw = {
  path: 'manage',
  name: 'ProjectManage',
  redirect: '/project/manage/history',
  component: getParentLayout('ProjectManage'),
  meta: {
    title: '计划管理',
    i18n: false,
  },
  children: [
    // 班级管理
    {
      path: 'class',
      name: 'ProjectManageClassIndex',
      component: () => import('/@/views/project_opm/project/manage/class/index.vue'),
      meta: {
        title: '班级管理',
        i18n: false,
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'class/add/:type/:batch?',
      name: 'ProjectManageClassAdd',
      component: () => import('/@/views/project_opm/project/manage/class/add.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsadd',
        currentActiveMenu: '/project/manage/class',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'class/manage/:id(\\d+)',
      component: () => import('/@/views/project_opm/project/manage/class/manage.vue'),
      name: 'ProjectManageClassManage',
      meta: {
        hideMenu: true,
        title: 'message.administration',
        currentActiveMenu: '/project/manage/class',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'class/:id(\\d+)/:type',
      component: () => import('/@/views/project_opm/project/manage/class/add.vue'),
      name: 'ProjectManageClassEdit',
      meta: {
        title: 'message.modify',
        hideMenu: true,
        currentActiveMenu: '/project/manage/class',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'class/detail/:id(\\d+)',
      component: () => import('/@/views/project_opm/project/manage/class/detail.vue'),
      name: 'ProjectManageClassDetail',
      meta: {
        title: 'message.hsDetail',
        hideMenu: true,
        currentActiveMenu: '/project/manage/class',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      // 训练进度
      path: 'class/progress',
      name: 'ProjectManageClassProgress',
      component: () => import('/@/views/project_ftm/teacher/project/manage/class/progress.vue'),
      meta: {
        hideMenu: true,
        title: 'table.practiceProgress',
        currentActiveMenu: '/project/manage/class',
        system: SubsystemName.flight_training_management,
      },
    },
    // 排课模板
    {
      path: 'template',
      name: 'ProjectManageTemplateIndex',
      component: () => import('/@/views/project_opm/project/manage/template/index.vue'),
      meta: {
        title: 'message.scheduling_template',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'template/setting/:id(\\d+)',
      name: 'ProjectManageTemplateSetting',
      component: () => import('/@/views/project_opm/project/manage/template/setting.vue'),
      meta: {
        hideMenu: true,
        title: 'text.set_up',
        currentActiveMenu: '/project/manage/template',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 补训管理
    {
      path: 'supplementaryTrain',
      name: 'ProjectManageSupplementaryTrainIndex',
      component: () => import('/@/views/project_opm/project/manage/supplementaryTrain/index.vue'),
      meta: {
        title: 'message.make_up_training_management',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'supplementaryTrain/:id(\\d+)',
      name: 'ProjectManageSupplementaryTrainDetail',
      component: () => import('/@/views/project_opm/project/manage/supplementaryTrain/detail.vue'),
      meta: {
        title: 'message.hsDetail',
        hideMenu: true,
        currentActiveMenu: '/project/manage/supplementaryTrain',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 补考管理
    {
      path: 'makeupExam',
      name: 'ProjectManageMakeupExamIndex',
      component: () => import('/@/views/project_opm/project/manage/makeupExam/index.vue'),
      meta: {
        title: '补考管理',
        i18n: false,
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'makeupExam/:id(\\d+)/:status',
      name: 'ProjectManageMakeupExamDetail',
      component: () => import('/@/views/project_opm/project/manage/makeupExam/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/manage/makeupExam',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 完训确认
    {
      path: 'finish',
      name: 'ProjectManageComplateTrainIndex',
      component: () => import('/@/views/project_ftm/teacher/project/manage/finish/index.vue'),
      meta: {
        title: 'router.examWorkingReport',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      // 详情
      path: 'finish/detail',
      name: 'ProjectManageComplateTrainDetail',
      component: () => import('/@/views/project_ftm/teacher/project/manage/finish/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'router.detail',
        system: SubsystemName.operation_plan_management,
        currentActiveMenu: '/project/manage/finish',
      },
    },
    // 培训课表
    {
      path: 'schedule',
      name: 'ProjectManageScheduleIndex',
      component: () => import('/@/views/project_opm/project/manage/schedule/index.vue'),
      meta: {
        title: '培训课表',
        i18n: false,
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'schedule/detail',
      name: 'ProjectManageScheduleDetail',
      component: () => import('/@/views/project_opm/project/manage/schedule/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/manage/schedule',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'schedule/class/detail/:type',
      name: 'ProjectManageScheduleClassDetail',
      component: () => import('/@/views/project_opm/project/manage/schedule/clazzDetail.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/manage/schedule',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 训练历史
    {
      path: 'history',
      name: 'ProjectManageHistoryIndex',
      component: () => import('/@/views/project_opm/project/manage/history/index.vue'),
      meta: {
        title: 'message.trainingHistory',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'history/:id(\\d+)',
      name: 'ProjectManageHistoryDetail',
      component: () => import('/@/views/project_opm/project/manage/history/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/manage/history',
        system: SubsystemName.operation_plan_management,
      },
    },
  ],
}
/**
 * 合同管理
 */
const Contract: AppRouteRecordRaw = {
  path: 'contract',
  name: 'ProjectContract',
  redirect: '',
  component: getParentLayout('ProjectContract'),
  meta: {
    title: 'message.contractManagement',
  },
  children: [
    // 合同列表
    {
      path: 'list',
      name: 'ProjectContractListIndex',
      component: () => import('/@/views/project_opm/project/contract/list/index.vue'),
      meta: {
        title: '合同列表',
        i18n: false,
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'list/add',
      name: 'ProjectContractListAdd',
      component: () => import('/@/views/project_opm/project/contract/list/add.vue'),
      meta: {
        hideMenu: true,
        title: 'message.addContract',
        currentActiveMenu: '/project/contract/list',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'list/:id(\\d+)/:type?',
      name: 'ProjectContractListModify',
      component: () => import('/@/views/project_opm/project/contract/list/add.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/contract/list',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 账单管理
    {
      path: 'bill',
      name: 'ProjectContractBillIndex',
      component: () => import('/@/views/project_opm/project/contract/bill/index.vue'),
      meta: {
        title: 'message.billManagement',
        i18n: false,
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'bill/:id(\\d+)',
      name: 'ProjectContractBillDetail',
      component: () => import('/@/views/project_opm/project/contract/bill/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/contract/bill',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'bill/print',
      name: 'ProjectContractBillPrint',
      component: () => import('/@/views/project_opm/project/contract/bill/print.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/contract/bill',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 历史账单
    {
      path: 'historyBill',
      name: 'ProjectContractHistoryBillIndex',
      component: () => import('/@/views/project_opm/project/contract/historyBill/index.vue'),
      meta: {
        title: 'message.HistoricalBills',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'historyBill/billList/:id(\\d+)',
      name: 'ProjectContractHistoryBillList',
      component: () => import('/@/views/project_opm/project/contract/historyBill/billList.vue'),
      meta: {
        hideMenu: true,
        title: 'message.billsList',
        currentActiveMenu: '/project/contract/historyBill',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'historyBill/detail/:id(\\d+)',
      name: 'ProjectContractHistoryBillDetail',
      component: () => import('/@/views/project_opm/project/contract/historyBill/billList.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/contract/historyBill',
        system: SubsystemName.operation_plan_management,
      },
    },
  ],
}
/**
 * 客户管理
 */
const Customer: AppRouteRecordRaw = {
  path: 'customer',
  name: 'ProjectCustomer',
  redirect: '',
  component: getParentLayout('ProjectCustomer'),
  meta: {
    title: '客户管理',
    i18n: false,
  },
  children: [
    // 客户列表
    {
      path: 'list',
      name: 'ProjectCustomerListIndex',
      component: () => import('/@/views/project_opm/project/customer/list/index.vue'),
      meta: {
        title: '客户列表',
        i18n: false,
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'list/:id(\\d+)',
      name: 'ProjectCustomerListDetail',
      component: () => import('/@/views/project_opm/project/customer/list/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/customer/list',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 客户联络员
    {
      path: 'linkman',
      name: 'ProjectCustomerLinkmanIndex',
      component: () => import('/@/views/project_opm/project/customer/linkman/index.vue'),
      meta: {
        title: '客户联络员',
        system: SubsystemName.operation_plan_management,
      },
    },
  ],
}
/**
 * 设施管理
 */
const Facilities: AppRouteRecordRaw = {
  path: 'facilities',
  name: 'ProjectFacilities',
  redirect: '',
  component: getParentLayout('ProjectCustomer'),
  meta: {
    title: '设施管理',
    i18n: false,
  },
  children: [
    // 模拟机管理
    {
      path: 'simulator',
      name: 'ProjectFacilitiesSimulatorIndex',
      component: () => import('/@/views/project_opm/project/facilities/simulator/index.vue'),
      meta: {
        title: '模拟机管理',
        system: SubsystemName.operation_plan_management,
      },
    },
    {
      path: 'simulator/:id(\\d+)',
      name: 'ProjectFacilitiesSimulatorDetail',
      component: () => import('/@/views/project_opm/project/facilities/simulator/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'message.hsDetail',
        currentActiveMenu: '/project/facilities/simulator',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 其他设备
    {
      path: 'other',
      name: 'ProjectFacilitiesOtherIndex',
      component: () => import('/@/views/project_opm/project/facilities/other/index.vue'),
      meta: {
        title: '其他设备',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 培训资源
    {
      path: 'resources',
      name: 'ProjectFacilitiesResourcesIndex',
      component: () => import('/@/views/project_opm/project/facilities/resources/index.vue'),
      meta: {
        title: '培训资源',
        system: SubsystemName.operation_plan_management,
      },
    },
  ],
}

const Route: AppRouteRecordRaw = {
  path: '/project',
  name: 'Project',
  component: LAYOUT,
  redirect: '/project/manage/history',
  meta: {
    icon: '',
    title: '培训计划',
    i18n: false,
    orderNo: 3,
  },
  children: [Manage, Contract, Customer, Facilities],
}

export default Route
