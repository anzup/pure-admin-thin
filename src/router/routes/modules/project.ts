import { AppRouteRecordRaw } from './../../types'
import { getParentLayout, LAYOUT } from '/@/router/constant'

/**
 * 计划管理
 */
const Manage: AppRouteRecordRaw = {
  path: 'manage',
  name: 'ProjectManage',
  redirect: '',
  component: getParentLayout('ProjectManage'),
  meta: {
    title: '计划管理',
    i18n: false,
  },
  children: [
    // 班级管理
    {
      path: 'class',
      name: 'ProjectManageClass',
      redirect: 'index',
      component: getParentLayout('ProjectManageClass'),
      meta: {
        title: '班级管理',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectManageClassIndex',
          component: () => import('/@/views/project_opm/project/manage/class/index.vue'),
          meta: {
            title: '班级管理',
            i18n: false,
          },
        },
        {
          path: 'add/:type/:batch?',
          name: 'ProjectManageClassAdd',
          component: () => import('/@/views/project_opm/project/manage/class/add.vue'),
          meta: {
            hideMenu: true,
            title: 'message.hsadd',
            currentActiveMenu: '/project/manage/class/index',
          },
        },
        {
          path: 'manage/:id(\\d+)',
          component: () => import('/@/views/project_opm/project/manage/class/manage.vue'),
          name: 'ProjectManageClassManage',
          meta: {
            hideMenu: true,
            title: 'message.administration',
            currentActiveMenu: '/project/manage/class/index',
          },
        },
        {
          path: ':id(\\d+)/:type',
          component: () => import('/@/views/project_opm/project/manage/class/add.vue'),
          name: 'ProjectManageClassEdit',
          meta: {
            title: 'message.modify',
            hideMenu: true,
            currentActiveMenu: '/project/manage/class/index',
          },
        },
        {
          path: 'detail/:id(\\d+)',
          component: () => import('/@/views/project_opm/project/manage/class/detail.vue'),
          name: 'ProjectManageClassDetail',
          meta: {
            title: 'message.hsDetail',
            hideMenu: true,
            currentActiveMenu: '/project/manage/class/index',
          },
        },
      ],
    },
    // 排课模板
    {
      path: 'template',
      name: 'ProjectManageTemplate',
      redirect: 'index',
      component: getParentLayout('ProjectManageTemplate'),
      meta: {
        title: 'message.scheduling_template',
      },
      children: [
        {
          path: 'index',
          name: 'ProjectManageTemplateIndex',
          component: () => import('/@/views/project_opm/project/manage/template/index.vue'),
          meta: {
            title: 'message.scheduling_template',
          },
        },
        {
          path: 'setting/:id(\\d+)',
          name: 'ProjectManageTemplateSetting',
          component: () => import('/@/views/project_opm/project/manage/template/setting.vue'),
          meta: {
            hideMenu: true,
            title: 'text.set_up',
            currentActiveMenu: '/project/manage/template/index',
          },
        },
      ],
    },
    // 补训管理
    {
      path: 'supplementaryTrain',
      name: 'ProjectManageSupplementaryTrain',
      redirect: 'index',
      component: getParentLayout('ProjectManageSupplementaryTrain'),
      meta: {
        title: 'message.make_up_training_management',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectManageSupplementaryTrainIndex',
          component: () =>
            import('/@/views/project_opm/project/manage/supplementaryTrain/index.vue'),
          meta: {
            title: 'message.make_up_training_management',
          },
        },
        {
          path: ':id(\\d+)',
          name: 'ProjectManageSupplementaryTrainDetail',
          component: () =>
            import('/@/views/project_opm/project/manage/supplementaryTrain/detail.vue'),
          meta: {
            title: 'message.hsDetail',
            hideMenu: true,
            currentActiveMenu: '/project/manage/supplementaryTrain/index',
          },
        },
      ],
    },
    // 补考管理
    {
      path: 'makeupExam',
      name: 'ProjectManageMakeupExam',
      redirect: 'index',
      component: getParentLayout('ProjectManageMakeupExam'),
      meta: {
        title: '补考管理',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectManageMakeupExamIndex',
          component: () => import('/@/views/project_opm/project/manage/makeupExam/index.vue'),
          meta: {
            title: '补考管理',
            i18n: false,
          },
        },
        {
          path: ':id(\\d+)/:status',
          name: 'ProjectManageMakeupExamDetail',
          component: () => import('/@/views/project_opm/project/manage/makeupExam/detail.vue'),
          meta: {
            hideMenu: true,
            title: 'message.hsDetail',
            currentActiveMenu: '/project/manage/makeupExam/index',
          },
        },
      ],
    },
    // 完训确认
    {
      path: 'complateTrain',
      name: 'ProjectManageComplateTrain',
      redirect: 'index',
      component: getParentLayout('ProjectManageComplateTrain'),
      meta: {
        title: '完训确认',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectManageComplateTrainIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '完训确认',
            i18n: false,
          },
        },
      ],
    },
    // 培训课表
    {
      path: 'schedule',
      name: 'ProjectManageSchedule',
      redirect: 'index',
      component: getParentLayout('ProjectManageSchedule'),
      meta: {
        title: '培训课表',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectManageScheduleIndex',
          component: () => import('/@/views/project_opm/project/manage/schedule/index.vue'),
          meta: {
            title: '培训课表',
            i18n: false,
          },
        },
        // 课表详情
        {
          path: 'detail',
          name: 'ProjectManageScheduleDetail',
          component: () => import('/@/views/project_opm/project/manage/schedule/detail.vue'),
          meta: {
            hideMenu: true,
            title: 'message.hsDetail',
            currentActiveMenu: '/project/manage/schedule/index',
          },
        },
        // 班级课表详情
        {
          path: 'class/detail/:type',
          name: 'ProjectManageScheduleClassDetail',
          component: () => import('/@/views/project_opm/project/manage/schedule/clazzDetail.vue'),
          meta: {
            hideMenu: true,
            title: 'message.hsDetail',
            currentActiveMenu: '/project/manage/schedule/index',
          },
        },
      ],
    },
    // 训练历史
    {
      path: 'history',
      name: 'ProjectManageHistory',
      redirect: 'index',
      component: getParentLayout('ProjectManageHistory'),
      meta: {
        title: 'message.trainingHistory',
      },
      children: [
        {
          path: 'index',
          name: 'ProjectManageHistoryIndex',
          component: () => import('/@/views/project_opm/project/manage/history/index.vue'),
          meta: {
            title: 'message.trainingHistory',
          },
        },
        {
          path: ':id(\\d+)',
          name: 'ProjectManageHistoryDetail',
          component: () => import('/@/views/project_opm/project/manage/history/detail.vue'),
          meta: {
            hideMenu: true,
            title: 'message.hsDetail',
            currentActiveMenu: '/project/manage/history/index',
          },
        },
      ],
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
      name: 'ProjectContractList',
      redirect: 'index',
      component: getParentLayout('ProjectContractList'),
      meta: {
        title: '合同列表',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectContractListIndex',
          component: () => import('/@/views/project_opm/project/contract/list/index.vue'),
          meta: {
            title: '合同列表',
            i18n: false,
          },
        },
        {
          path: 'add',
          name: 'ProjectContractListAdd',
          component: () => import('/@/views/project_opm/project/contract/list/add.vue'),
          meta: {
            hideMenu: true,
            title: 'message.addContract',
            currentActiveMenu: '/project/contract/list/index',
          },
        },
        {
          path: ':id(\\d+)/:type?',
          name: 'ProjectContractListModify',
          component: () => import('/@/views/project_opm/project/contract/list/add.vue'),
          meta: {
            hideMenu: true,
            title: 'message.hsDetail',
            currentActiveMenu: '/project/contract/list/index',
          },
        },
      ],
    },
    // 账单管理
    {
      path: 'bill',
      name: 'ProjectContractBill',
      redirect: 'index',
      component: getParentLayout('ProjectContractBill'),
      meta: {
        title: 'message.billManagement',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectContractBillIndex',
          component: () => import('/@/views/project_opm/project/contract/bill/index.vue'),
          meta: {
            title: 'message.billManagement',
            i18n: false,
          },
        },
        {
          path: ':id(\\d+)',
          name: 'ProjectContractBillDetail',
          component: () => import('/@/views/project_opm/project/contract/bill/detail.vue'),
          meta: {
            hideMenu: true,
            title: 'message.hsDetail',
            currentActiveMenu: '/project/contract/bill/index',
          },
        },
        {
          path: 'print',
          name: 'ProjectContractBillPrint',
          component: () => import('/@/views/project_opm/project/contract/bill/print.vue'),
          meta: {
            hideMenu: true,
            title: 'message.hsDetail',
            currentActiveMenu: '/project/contract/bill/index',
          },
        },
      ],
    },
    // 历史账单
    {
      path: 'historyBill',
      name: 'ProjectContractHistoryBill',
      redirect: 'index',
      component: getParentLayout('ProjectContractHistoryBill'),
      meta: {
        title: 'message.HistoricalBills',
      },
      children: [
        {
          path: 'index',
          name: 'ProjectContractHistoryBillIndex',
          component: () => import('/@/views/project_opm/project/contract/historyBill/index.vue'),
          meta: {
            title: 'message.HistoricalBills',
          },
        },
        {
          path: 'billList/:id(\\d+)',
          name: 'ProjectContractHistoryBillList',
          component: () => import('/@/views/project_opm/project/contract/historyBill/billList.vue'),
          meta: {
            hideMenu: true,
            title: 'message.billsList',
            currentActiveMenu: '/project/contract/historyBill/index',
          },
        },
        {
          path: 'detail/:id(\\d+)',
          name: 'ProjectContractHistoryBillDetail',
          component: () => import('/@/views/project_opm/project/contract/historyBill/billList.vue'),
          meta: {
            hideMenu: true,
            title: 'message.hsDetail',
            currentActiveMenu: '/project/contract/historyBill/index',
          },
        },
      ],
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
      name: 'ProjectCustomerList',
      redirect: 'index',
      component: getParentLayout('ProjectCustomerList'),
      meta: {
        title: '客户列表',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectCustomerListIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '客户列表',
            i18n: false,
          },
        },
      ],
    },
    // 客户联络员
    {
      path: 'linkman',
      name: 'ProjectCustomerLinkman',
      redirect: 'index',
      component: getParentLayout('ProjectCustomerLinkman'),
      meta: {
        title: '客户联络员',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectCustomerLinkmanIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '客户联络员',
            i18n: false,
          },
        },
      ],
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
      name: 'ProjectFacilitiesSimulator',
      redirect: 'index',
      component: getParentLayout('ProjectFacilitiesSimulator'),
      meta: {
        title: '模拟机管理',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectFacilitiesSimulatorIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '模拟机管理',
            i18n: false,
          },
        },
      ],
    },
    // 其他设备
    {
      path: 'other',
      name: 'ProjectFacilitiesOther',
      redirect: 'index',
      component: getParentLayout('ProjectFacilitiesOther'),
      meta: {
        title: '其他设备',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectFacilitiesOtherIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '其他设备',
            i18n: false,
          },
        },
      ],
    },
    // 培训资源
    {
      path: 'resources',
      name: 'ProjectFacilitiesResources',
      redirect: 'index',
      component: getParentLayout('ProjectFacilitiesResources'),
      meta: {
        title: '培训资源',
        i18n: false,
      },
      children: [
        {
          path: 'index',
          name: 'ProjectFacilitiesResourcesIndex',
          component: () => import('/@/views/dashboard/index.vue'),
          meta: {
            title: '培训资源',
            i18n: false,
          },
        },
      ],
    },
  ],
}

const Route: AppRouteRecordRaw = {
  path: '/project',
  name: 'Project',
  component: LAYOUT,
  redirect: '',
  meta: {
    icon: '',
    title: '培训计划',
    i18n: false,
    orderNo: 3,
  },
  children: [Manage, Contract, Customer, Facilities],
}

export default Route
