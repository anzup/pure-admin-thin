import { AppRouteRecordRaw, SubsystemName } from './../../types'
import { getParentLayout, LAYOUT } from '/@/router/constant'
/**
 * 数据统计
 */
const Data: AppRouteRecordRaw = {
  path: 'data',
  name: 'StatisticalData',
  redirect: '',
  component: getParentLayout('StatisticalData'),
  meta: {
    title: '数据统计',
    i18n: false,
  },
  children: [
    // 教员课时统计
    {
      path: 'teaching',
      name: 'StatisticalDataTeachingIndex',
      component: () => import('/@/views/project_opm/statistics/data/teacher/index.vue'),
      meta: {
        title: 'message.teacher_class_hour_statistics',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 设施运行统计
    {
      path: 'facility',
      name: 'StatisticalDataFacilityIndex',
      component: () => import('/@/views/project_opm/statistics/data/facilities/index.vue'),
      meta: {
        title: 'message.facility_operation_statistics',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 销售数据统计
    {
      path: 'sales',
      name: 'StatisticalDataSalesIndex',
      component: () => import('/@/views/project_opm/statistics/data/sales/index.vue'),
      meta: {
        title: 'message.sales_data_statistics',
        system: SubsystemName.operation_plan_management,
      },
    },
    // 核心能力统计
    {
      path: 'competence',
      name: 'StatisticalDataCompetenceIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '核心能力统计',
      },
    },
    // 统计设置
    {
      path: 'config',
      name: 'StatisticalDataConfigIndex',
      component: () => import('/@/views/project_opm/statistics/data/config/index.vue'),
      meta: {
        title: 'text.statistical_settings',
        system: SubsystemName.operation_plan_management,
      },
    },
  ],
}

const Route: AppRouteRecordRaw = {
  path: '/statistical',
  name: 'Statistical',
  component: LAYOUT,
  redirect: '',
  meta: {
    icon: '',
    title: '数据统计',
    i18n: false,
    orderNo: 5,
  },
  children: [Data],
}

export default Route
