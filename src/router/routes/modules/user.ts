import { RouteRecordRaw } from 'vue-router'
import { LAYOUT } from '/@/router/constant'

const userRouter: RouteRecordRaw = {
  path: '/user',
  name: 'User',
  component: LAYOUT,
  redirect: '/user/staffManagement',
  meta: {
    icon: 'information-line',
    title: 'menus.personnelManagement',
    orderNo: 1,
  },
  children: [
    {
      path: 'staffManagement',

      name: 'StaffManagementIndex',
      component: () => import('/@/views/user/staff/index.vue'),
      meta: {
        title: 'menus.staffManagement',
        breadcrumb: false,
        keepAlive: true,
      },
    },
    {
      path: 'detail',
      name: 'StaffManagementDetail',
      component: () => import('/@/views/user/staff/detail.vue'),
      meta: {
        hideMenu: true,
        title: 'buttons.detail',
        currentActiveMenu: '/user/staffManagement',
      },
    },
    {
      path: 'roles',

      name: 'RolesIndex',
      component: () => import('/@/views/user/roles/index.vue'),
      meta: {
        title: 'menus.positionManagement',
      },
    },
    {
      path: 'competence',
      name: 'rolesCompetence',
      component: () => import('/@/views/user/roles/competence.vue'),
      meta: {
        hideMenu: true,
        title: 'buttons.competence',
        currentActiveMenu: '/user/roles/index',
      },
    },

    {
      path: 'departments',

      name: 'DepartmentsIndex',
      component: () => import('/@/views/user/departments/index.vue'),
      meta: {
        title: 'menus.departmentManagement',
      },
    },
  ],
}

export default userRouter
