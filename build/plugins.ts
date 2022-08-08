import { resolve } from 'path'
import Unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import { visualizer } from 'rollup-plugin-visualizer'

import removeConsole from 'vite-plugin-remove-console'
import themePreprocessorPlugin from '@pureadmin/theme'
import { genScssMultipleScopeVars } from '/@/layout/theme'

export function getPluginsList(command, VITE_LEGACY) {
  const lifecycle = process.env.npm_lifecycle_event
  return [
    vue({
      reactivityTransform: true,
    }),
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
    // 自定义主题
    themePreprocessorPlugin({
      scss: {
        // 是否启用任意主题色模式，这里不启用
        arbitraryMode: false,
        multipleScopeVars: genScssMultipleScopeVars(),
        // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
        extract: false,
        // 会选取defaultScopeName对应的主题css文件在html添加link
        themeLinkTagId: 'head',
        // "head"||"head-prepend" || "body" ||"body-prepend"
        themeLinkTagInjectTo: 'head',
        // 是否对抽取的css文件内对应scopeName的权重类名移除
        removeCssScopeName: false,
        // 独立主题css文件的输出路径，默认取 viteConfig.build.assetsDir 相对于 (viteConfig.build.outDir)
        // outputDir: './logistics/assets/',
      },
    }), // svg组件化支持
    svgLoader({
      svgo: true,
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                inlineStyles: {
                  onlyMatchedOnce: false,
                },
              },
            },
          },
        ],
      },
    }),
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
