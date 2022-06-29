<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group appear name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in routes" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index === routes.length - 1"
          class="no-redirect"
          >{{ t(item.name || item.meta?.title) }}</span
        >
        <a v-else @click="handleClick(item, $event)">
          {{ t(item.name || item.meta?.title) }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>
<script lang="ts" setup>
  import { RouteLocationMatched, useRouter } from 'vue-router'
  import { ref, watchEffect } from 'vue'
  import { useGo } from '/@/hooks/usePage'
  import { useI18n } from '/@/hooks/useI18n'
  import { REDIRECT_NAME } from '/@/router/constant'
  import { getMenus } from '/@/router/menus'
  import { getAllParentPath } from '/@/router/helper/menuHelper'
  import { Menu } from '/@/router/types'
  import { filter } from '/@/utils/helper/treeHelper'
  import { isString } from '/@/utils/is'

  const routes = ref<RouteLocationMatched[]>([])
  const { currentRoute } = useRouter()
  const go = useGo()
  const { t } = useI18n()

  watchEffect(async () => {
    if (currentRoute.value.name === REDIRECT_NAME) return
    const menus = await getMenus()

    const routeMatched = currentRoute.value.matched
    const cur = routeMatched?.[routeMatched.length - 1]
    let path = currentRoute.value.path

    if (cur && cur?.meta?.currentActiveMenu) {
      path = cur.meta.currentActiveMenu as string
    }

    const parent = getAllParentPath(menus, path)
    const filterMenus = menus.filter((item) => item.path === parent[0])
    const matched = getMatched(filterMenus, parent) as any

    if (!matched || matched.length === 0) return

    const breadcrumbList = filterItem(matched)

    if (currentRoute.value.meta?.currentActiveMenu) {
      breadcrumbList.push({
        ...currentRoute.value,
        name: currentRoute.value.meta?.title || currentRoute.value.name,
      } as unknown as RouteLocationMatched)
    }
    console.log(breadcrumbList)
    routes.value = breadcrumbList
  })

  function getMatched(menus: Menu[], parent: string[]) {
    const metched: Menu[] = []
    menus.forEach((item) => {
      if (parent.includes(item.path)) {
        metched.push({
          ...item,
          name: (item.meta?.title || item.name) as string,
        })
      }
      if (item.children?.length) {
        metched.push(...getMatched(item.children, parent))
      }
    })
    return metched
  }

  function filterItem(list: RouteLocationMatched[]) {
    return filter(list, (item) => {
      const { meta, name } = item
      if (!meta) {
        return !!name
      }
      const { title, hideBreadcrumb } = meta
      return !(!title || hideBreadcrumb)
    }).filter((item) => !item.meta?.hideBreadcrumb)
  }

  const getPath = (path: string, params: unknown) => {
    path = (path || '').replace(/^\//, '')
    Object.keys(params).forEach((key) => {
      path = path.replace(`:${key}`, params[key])
    })
    return path
  }

  function handleClick(route: RouteLocationMatched & any, e: Event) {
    e?.preventDefault()
    const { children, redirect, meta } = route
    const paths: string[] = []
    const currentRoutePath = getPath(route.path, (route.params = {}))
    console.log(currentRoutePath)
    for (let i = 0; i < routes.value.length; i++) {
      const { path: itemPath, params: itemParams = {} } = routes.value[i]
      const itemRealPath = getPath(itemPath, itemParams)
      paths.push(itemRealPath)
      if (itemRealPath == currentRoutePath) break
    }
    if (children?.length && !redirect) {
      e?.stopPropagation()
      return
    }
    if (meta?.carryParam) {
      return
    }

    if (redirect && isString(redirect)) {
      go(redirect)
    } else {
      let goPath: string
      if (paths.length === 1) {
        goPath = paths[0]
      } else {
        const ps = paths.slice(1)
        const lastPath = ps.pop() || ''
        goPath = `${lastPath}`
      }
      goPath = /^\//.test(goPath) ? goPath : `/${goPath}`
      go(goPath)
    }
  }
</script>

<style lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;

    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
