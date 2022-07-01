import 'xe-utils'
import './index.scss'
import XEUtils from 'xe-utils'
import { App, unref } from 'vue'
import { i18n } from '/@/plugins/i18n'
import 'font-awesome/css/font-awesome.min.css'
import tableFormat from './tableFormat'
// import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
// import VXETablePluginElement from 'vxe-table-plugin-element'
// import 'vxe-table-plugin-element/dist/style.css'
import renderer from './renderer'

import {
  // 核心
  VXETable,
  // 表格功能
  Header,
  Footer,
  Icon,
  Filter,
  Edit,
  Menu,
  Export,
  Keyboard,
  Validator,
  // 可选组件
  Column,
  Colgroup,
  Grid,
  Tooltip,
  Toolbar,
  Pager,
  Form,
  FormItem,
  FormGather,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Switch,
  Input,
  Select,
  Optgroup,
  Option,
  Textarea,
  Button,
  Modal,
  List,
  Pulldown,
  // 表格
  Table,
} from 'vxe-table'

// 全局设置表格格式化
VXETable.formats.mixin(tableFormat)
// 表格导出插件
// VXETable.use(VXETablePluginExportXLSX).use(VXETablePluginElement)

// 全局注册渲染器
renderer(VXETable.renderer)

// 全局默认参数
// @ts-ignore
VXETable.setup({
  size: 'mini',
  version: 0,
  zIndex: 100,
  table: {
    // 自动监听父元素的变化去重新计算表格
    autoResize: true,
    // 鼠标移到行是否要高亮显示
    highlightHoverRow: true,
    highlightCurrentRow: true,
    checkboxConfig: {
      // highlight: true,
      range: true,
      trigger: 'cell', // default（默认）, cell（点击单元格触发）, row（点击行触发）
      checkField: 'checked',
    },
    border: true,
    align: 'center',
  },
  input: {
    clearable: true,
  },
  // @ts-ignore
  i18n: (key, args) => i18n.global.t(key, args),
  // translate(key) {
  //   const NAMESPACED = ['el.', 'buttons.']
  //   if (key && NAMESPACED.findIndex((v) => key.includes(v)) !== -1) {
  //     return i18n.global.t.call(i18n.global.locale, key)
  //   }
  //   return key
  // },
})

export function useTable(app: App) {
  app
    .use(Header)
    .use(Footer)
    .use(Icon)
    .use(Filter)
    .use(Edit)
    .use(Menu)
    .use(Export)
    .use(Keyboard)
    .use(Validator)
    // 可选组件
    .use(Column)
    .use(Colgroup)
    .use(Grid)
    .use(Tooltip)
    .use(Toolbar)
    .use(Pager)
    .use(Form)
    .use(FormItem)
    .use(FormGather)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Radio)
    .use(RadioGroup)
    .use(RadioButton)
    .use(Switch)
    .use(Input)
    .use(Select)
    .use(Optgroup)
    .use(Option)
    .use(Textarea)
    .use(Button)
    .use(Modal)
    .use(List)
    .use(Pulldown)
    // 安装表格
    .use(Table)
}
