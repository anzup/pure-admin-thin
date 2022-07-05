import { RouteRecordRaw } from 'vue-router'
import { getParentLayout, LAYOUT } from '/@/router/constant'

const userRouter: RouteRecordRaw = {
  path: '/user',
  name: 'User',
  component: LAYOUT,
  redirect: '/user/staffManagement',
  meta: {
    icon: 'svg-personnel',
    title: 'menus.personnelManagement',
    orderNo: 1,
  },
  children: [
    {
      path: 'staffManagement',
      redirect: '/user/staffManagement/index',
      name: 'StaffManagement',
      component: getParentLayout('StaffManagement'),
      meta: {
        title: 'menus.staffManagement',
      },
      children: [
        {
          path: 'index',
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
            activeMenu: '/user/staffManagement',
          },
        },
      ],
    },
    {
      path: 'roles',
      redirect: '/user/roles/index',
      name: 'Roles',
      component: getParentLayout('Roles'),
      meta: {
        title: 'menus.positionManagement',
      },
      children: [
        {
          path: 'index',
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
            activeMenu: '/user/roles/index',
          },
        },
      ],
    },
    {
      path: 'departments',
      redirect: '/user/departments/index',
      name: 'Departments',
      component: getParentLayout('Departments'),
      meta: {
        title: 'menus.departmentManagement',
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: 'index',
          name: 'DepartmentsIndex',
          component: () => import('/@/views/user/departments/index.vue'),
          meta: {
            title: 'menus.departmentManagement',
          },
        },
      ],
    },
  ],
}

export default userRouter
