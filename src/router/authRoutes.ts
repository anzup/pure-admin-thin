const modules = import.meta.globEager('./modules/dynamic/**/*.ts')

// 静态路由名称
const staticRouterName = ['home', 'error', 'login', 'redirect', 'external']

// 原始动态路由（未做任何处理）
const arr = []
// 现在动态路由可以不用导入，直接声明就可以
console.log(modules)
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  arr.push(...modList)
})
export const authRoutes = arr.filter((v) => !staticRouterName.includes(v.name))
