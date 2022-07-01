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
      path: 'roles',
      redirect: '/user/roles/index',
      name: 'Roles',
      component: getParentLayout('Roles'),
      meta: {
        title: 'menus.positionManagement',
        hideChildrenInMenu: true,
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
            title: 'state.jurisdiction',
            activeMenu: '/user/roles/index',
          },
        },
      ],
    },
  ],
}

export default userRouter
