import { AppRouteRecordRaw } from './../../types'
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
      name: 'TeachingEducationTeachingIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '教员课时统计',
        i18n: false,
      },
    },
    // 设施运行统计
    {
      path: 'facility',
      name: 'TeachingEducationFacilityIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '设施运行统计',
        i18n: false,
      },
    },
    // 销售数据统计
    {
      path: 'sales',
      name: 'TeachingEducationSalesIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '销售数据统计',
        i18n: false,
      },
    },
    // 核心能力统计
    {
      path: 'competence',
      name: 'TeachingEducationCompetenceIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '核心能力统计',
        i18n: false,
      },
    },
    // 统计设置
    {
      path: 'config',
      name: 'TeachingEducationConfigIndex',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: {
        title: '统计设置',
        i18n: false,
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
