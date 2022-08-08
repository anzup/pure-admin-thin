import { RouteComponent, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '/@/store/modules/user'
import { SubsystemName } from '/@/router/types'
const Layout = () => import('/@/layout/index.vue')
const IFrame = () => import('/@/layout/frameView.vue')
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob('/src/views/**/*.{vue,tsx}')

// 按照路由中meta下的rank等级升序来排序路由
function ascending(arr: any[]) {
  arr.forEach((v) => {
    if (v?.meta?.rank === null) v.meta.rank = undefined
    if (v?.meta?.rank === 0) {
      if (v.name !== 'home' && v.path !== '/') {
        console.warn('rank only the home page can be 0')
      }
    }
  })
  return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
    return a?.meta?.rank - b?.meta?.rank
  })
}

// 过滤meta中showLink为false的路由
function filterTree(data: RouteComponent[]) {
  const newTree = data.filter((v: { meta: { showLink: boolean } }) => v.meta?.showLink !== false)
  newTree.forEach((v: { children }) => v.children && (v.children = filterTree(v.children)))
  return newTree
}

// 通过path获取父级路径
function getParentPaths(path: string, routes: RouteRecordRaw[]) {
  // 深度遍历查找
  function dfs(routes: RouteRecordRaw[], path: string, parents: string[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i] // 找到path则返回父级path
      if (item.path === path) return parents // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue // 往下查找时将当前path入栈
      parents.push(item.path)
      if (dfs(item.children, path, parents).length) return parents // 深度遍历查找未找到时当前path 出栈
      parents.pop()
    } // 未找到时返回空数组
    return []
  }

  return dfs(routes, path, [])
}

// 查找对应path的路由信息
function findRouteByPath(path: string, routes: RouteRecordRaw[]) {
  let res = routes?.find((item: { path: string }) => item.path == path)
  if (res) {
    return res
  } else {
    for (let i = 0; i < routes?.length ?? 0; i++) {
      if (routes[i].children instanceof Array && routes[i].children.length > 0) {
        res = findRouteByPath(path, routes[i].children)

        if (res) {
          return res
        }
      }
    }
    return null
  }
}

// 过滤后端传来的动态路由 重新生成规范路由
function addAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
  if (!arrRoutes || !arrRoutes.length) return
  const modulesRoutesKeys = Object.keys(modulesRoutes)
  arrRoutes.forEach((v: RouteRecordRaw) => {
    if (v.redirect) {
      v.component = Layout
    } else if (v.meta?.frameSrc) {
      v.component = IFrame
    } else {
      // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会根path保持一致）
      const index = v?.component
        ? // @ts-expect-error
          modulesRoutesKeys.findIndex((ev) => ev.includes(v.component))
        : modulesRoutesKeys.findIndex((ev) => ev.includes(v.path))
      v.component = modulesRoutes[modulesRoutesKeys[index]]
    }
    if (v.children) {
      addAsyncRoutes(v.children)
    }
  })
  return arrRoutes
}

// 根据系统权限显示/隐藏
/**
 * @param system 系统名
 * @param roleName 配置权限名(将用户权限信息拼装字符串)：'accountType:builtinRole:teacherAdmin<boolean>'
 */
function authVisible(system: string | string[], roleName: string | string[]) {
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  // 账号权限含有目标系统
  if (
    system &&
    (system instanceof Array
      ? userStore.subsystems.some((s) => system.includes(s))
      : userStore.subsystems.includes(system))
  ) {
    // ftm系统筛选角色权限
    if (userStore.subsystems.includes(SubsystemName.flight_training_management)) {
      const currentRoleName = `${userInfo.accountType}:${userInfo.builtinRole}:${userInfo.teacherAdmin}`
      return roleName instanceof Array
        ? roleName.some((name) => name === currentRoleName)
        : roleName === currentRoleName
    }
  }
}

export { ascending, filterTree, addAsyncRoutes, getParentPaths, findRouteByPath, authVisible }
