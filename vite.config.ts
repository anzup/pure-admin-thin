import dayjs from 'dayjs'
import { resolve } from 'path'
import pkg from './package.json'
import { warpperEnv } from './build'
import { getPluginsList } from './build/plugins'
import { ConfigEnv, loadEnv, UserConfigExport } from 'vite'

// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd()

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}

// 设置别名
const alias: Record<string, string> = {
  '/@': pathResolve('src'),
  '@build': pathResolve('build'),
}

// @ts-ignore
const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
}

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const { VITE_PORT, VITE_LEGACY, VITE_PUBLIC_PATH } = warpperEnv(loadEnv(mode, root))
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "/@/style/variable.scss" as *;`,
        },
      },
    },
    // 服务端渲染
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      host: '0.0.0.0',
    },
    plugins: getPluginsList(command, VITE_LEGACY),
    optimizeDeps: {
      include: [
        'pinia',
        'vue-i18n',
        'lodash-es',
        '@vueuse/core',
        'element-plus/es',
        'element-plus/es/components/scrollbar/style/index',
        'element-plus/es/components/dropdown/style/index',
        'element-plus/es/components/dropdown-menu/style/index',
        'element-plus/es/components/dropdown-item/style/index',
        'element-plus/es/components/menu/style/index',
        'element-plus/es/components/radio-group/style/index',
        'element-plus/es/components/divider/style/index',
        'element-plus/es/components/form/style/index',
        'element-plus/es/components/button/style/index',
        'element-plus/es/components/checkbox/style/index',
        'element-plus/es/components/form-item/style/index',
        'element-plus/es/components/radio/style/index',
        'element-plus/es/components/icon/style/index',
        'element-plus/es/components/tooltip/style/index',
        'element-plus/es/components/switch/style/index',
        'element-plus/es/components/badge/style/index',
        'element-plus/es/components/config-provider/style/index',
        'xe-utils',
        'vxe-table',
      ],
      exclude: ['@pureadmin/theme/dist/browser-utils'],
    },
    build: {
      sourcemap: false,
      brotliSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
  }
}
