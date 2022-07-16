import App from './App.vue'
import { setupRouter, router } from './router'
import { setupStore } from '/@/store'
import { getServerConfig } from './config'
import { createApp, Directive } from 'vue'
import { useI18n } from '/@/plugins/i18n'
import { MotionPlugin } from '@vueuse/motion'
import { injectResponsiveStorage } from '/@/utils/storage/responsive'
import Print from '/@/utils/print2'
import HtmlToPdf from 'html2pdf.js'
import VueVideoPlayer from 'vue-video-player'
import ElementPlus from 'element-plus'

import 'uno.css'
import 'animate.css'
// 引入重置样式
import './style/reset.scss'

// 导入公共样式
import './style/index.scss'
import 'element-plus/dist/index.css'
import '@pureadmin/components/dist/index.css'
import '@pureadmin/components/dist/theme.css'

import 'vue-datepicker-next/index.css'
import 'video.js/dist/video-js.css'
// 导入字体图标
import './assets/iconfont/iconfont.js'
import './assets/iconfont/iconfont.css'
import 'element-plus/dist/index.css'
// 自定义指令
import * as directives from '/@/directives'
// 全局注册`@iconify/vue`图标库
import { IconifyIconOffline, IconifyIconOnline, FontIcon } from './components/ReIcon'
import { useTable } from '/@/plugins/vxe-table'
import { setupRouterGuard } from '/@/router/guard'

const app = createApp(App)

Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key])
})

app.component('IconifyIconOffline', IconifyIconOffline)
app.component('IconifyIconOnline', IconifyIconOnline)
app.component('FontIcon', FontIcon)

getServerConfig(app).then(async (config) => {
  setupRouter(app)
  // await router.isReady()
  setupRouterGuard(router)
  injectResponsiveStorage(app, config)
  setupStore(app)
  app.use(MotionPlugin).use(useI18n).use(useTable).use(ElementPlus).use(VueVideoPlayer)
  app.config.globalProperties.$print = Print
  app.config.globalProperties.$htmlToPdf = HtmlToPdf
  app.mount('#app')
})
