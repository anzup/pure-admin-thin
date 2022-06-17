/// <reference types="vue/macros-global" />
// path 类型声明的是对本地文件的依赖，包含路径信息。
// types 类型声明的是对 node_modules/@types 文件夹下的类型的依赖，不包含路径信息。
// 只能放在文件顶部

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.scss' {
  const scss: Record<string, string>
  export default scss
}

declare module 'vuedraggable/src/vuedraggable'
