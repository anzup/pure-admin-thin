import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * @param authority 权限
     */
    authority?: string[]
    /**
     * @param title 页面名称
     */
    title: string
    /**
     * @param showParent 是否显示父级菜单
     */
    showParent?: boolean
    /**
     * @param keepAlive 是否缓存
     */
    keepAlive?: boolean
    /**
     * @param refreshRedirect 刷新后重定向页面
     */
    refreshRedirect?: string
    /**
     * @param dynamicLevel 动态路由层级
     */
    dynamicLevel?: string
    /**
     * @param icon 图标
     */
    icon?: string
    /**
     * @param rank 路由顺序
     */
    rank?: number
    /**
     * @param showLink 是否在菜单中显示（可不写，默认true）
     */
    showLink?: boolean
    /**
     * @param activeMenu 选中的菜单栏，用于页面隐藏时的显示
     */
    activeMenu?: string
  }
}
