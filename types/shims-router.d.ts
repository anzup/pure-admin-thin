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
     * icon 图标 字符串或者函数类型,为函数时可以返回一个svg组件
     */
    icon?: any
    /**
     * orderNo 路由顺序
     */
    orderNo?: number
    /**
     * showLink 是否隐藏菜单 默认false
     */
    hideMenu?: boolean
    /**
     * currentActiveMenu 选中的菜单栏，用于页面隐藏时的显示
     */
    currentActiveMenu?: string
    /**忽略路由。用于生成对应的菜单而忽略路由。*/
    ignoreRoute?: boolean
    /** 动态路由的实际Path, 即去除路由的动态部分;*/
    realPath?: string
    /** auths 路由的权限 */
    auths?: string[]
    /**是否忽略权限*/
    ignoreAuth?: boolean
    // Never show in tab
    hideTab?: boolean
    // Is it fixed on tab
    affix?: boolean
    /*隐藏所有子菜单*/
    hideChildrenInMenu?: boolean
  }
}
