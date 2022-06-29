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
        'element-plus/es/components/config-provider/style/index',
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
