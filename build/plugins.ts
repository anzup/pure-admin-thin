import { resolve } from 'path'
import Unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import { viteBuildInfo } from './info'
import svgLoader from 'vite-svg-loader'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
// import ElementPlus from "unplugin-element-plus/vite";
import { visualizer } from 'rollup-plugin-visualizer'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { createStyleImportPlugin } from 'vite-plugin-style-import'

import removeConsole from 'vite-plugin-remove-console'
import themePreprocessorPlugin from '@pureadmin/theme'
import { genScssMultipleScopeVars } from '/@/layout/theme'

export function getPluginsList(command, VITE_LEGACY) {
  const lifecycle = process.env.npm_lifecycle_event
  return [
    vue({
      reactivityTransform: true,
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'types/components.d.ts',
    }),
    createStyleImportPlugin({
      libs: [
        // 如果没有你需要的resolve，可以在lib内直接写，也可以给我们提供PR
        {
          libraryName: 'vxe-table',
          esModule: true,
          // resolveComponent: (name) => `vxe-table/es/${name}`,
          resolveStyle: (name) => `vxe-table/es/${name}/style.css`,
        },
      ],
    }),
    // createStyleImportPlugin({
    // resolves: [VxeTableResolve()],
    // libs: [
    //   {
    //     libraryName: 'vxe-table',
    //     esModule: true,
    //     // resolveComponent: (name) => `vxe-table/es/${name}`,
    //     resolveStyle: (name) => `vxe-table/es/${name}/style.css`,
    //   },
    // ],
    // }),
    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve('locales/**')],
    }),
    // jsx、tsx语法支持
    vueJsx(),
    Unocss(),
    // 线上环境删除console
    removeConsole(),
    viteBuildInfo(),
    // 自定义主题
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: genScssMultipleScopeVars(),
        // // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
        // extract: true,
        // // 会选取defaultScopeName对应的主题css文件在html添加link
        // themeLinkTagId: 'head',
        // // "head"||"head-prepend" || "body" ||"body-prepend"
        // themeLinkTagInjectTo: 'head',
        // // 是否对抽取的css文件内对应scopeName的权重类名移除
        // removeCssScopeName: false,
      },
    }), // svg组件化支持
    svgLoader(),
    // ElementPlus({}),
    // 是否为打包后的文件提供传统浏览器兼容性支持
    VITE_LEGACY
      ? legacy({
          targets: ['ie >= 11'],
          additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        })
      : null,
    // 打包分析
    lifecycle === 'report'
      ? visualizer({ open: true, brotliSize: true, filename: 'report.html' })
      : null,
  ]
}
