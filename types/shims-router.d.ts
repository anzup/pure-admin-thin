export {}
declare module 'vue-router' {
  interface RouteMeta {
    /**
     * title 页面名称
     */
    title: string
    /**
     * keepAlive 是否缓存
     */
    keepAlive?: boolean
    /**
     * refreshRedirect 刷新后重定向页面
     */
    refreshRedirect?: string
    /**
     * icon 图标
     */
    icon?: string
    /**
     * orderNo 路由顺序
     */
    orderNo?: number
    /**
     * showLink 是否隐藏菜单 默认false
     */
    hideMenu?: boolean
    /**
     * currentRoutePath 选中的菜单栏，用于页面隐藏时的显示
     */
    currentRoutePath?: string
  }
}
