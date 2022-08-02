<template>
  <VxeTable
    ref="xTable"
    :cell-class-name="cellClassName"
    :loading="loading"
    :data="data"
    :height="null"
    v-model:form="form"
    :columns="tableColumns"
    @handlePageChange="handlePageChange"
  >
    <template #form>
      <div class="nav-header">
        <el-form :inline="true">
          <el-form-item :label="$t('common.read')">{{
            formatCount(Details.readCount)
          }}</el-form-item>
          <el-form-item :label="$t('common.unread')">{{
            formatCount(Details.unreadCount)
          }}</el-form-item>
        </el-form>
        <div class="no-print" style="display: flex">
          <el-button type="primary" @click="handlePrint">{{ $t('button.print') }}</el-button>
          <el-button type="primary" @click="handleExport">{{ $t('button.leadingOut') }}</el-button>
          <el-select v-model="readType" @change="filterTable" style="margin-left: 10px">
            <el-option :value="undefined" :label="$t('common.all')" />
            <el-option :value="true" :label="$t('common.read')" />
            <el-option :value="false" :label="$t('common.unread')" />
          </el-select>
        </div>
      </div>
    </template>

    <template #readed="{ row }">
      <span v-if="row.hasRead">{{ $t('common.read') }}</span>
      <span v-else class="danger">{{ $t('common.unread') }}</span>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  export default {
    components: { VxeTable },
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      data: {
        type: Array,
        default: () => [],
      },
      Details: {
        type: Object,
        default: () => ({}),
      },
      origin: {
        type: Array,
        default: () => [],
      },
      pagination: {
        type: Object,
        default: () => ({}),
      },
      printFunc: {
        type: Function,
      },
      printDOM: {
        type: Function,
        default: () => ({ dom: '', style: '' }),
      },
    },
    computed: {
      form: {
        get() {
          return this.pagination
        },
        set(ob) {
          this.$emit('update:pagination', ob)
        },
      },
    },
    data() {
      return {
        readType: undefined,
        originData: [],
        tableColumns: [
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'name', title: this.$t('table.name'), minWidth: 160 },
          {
            field: 'accountType',
            title: this.$t('table.identityType'),
            formatter: this.identityFormat,
            minWidth: 300,
          },
          {
            field: 'hasRead',
            title: this.$t('table.readingStatus'),
            minWidth: 300,
            slots: { default: 'readed' },
          },
          {
            field: 'readTime',
            title: this.$t('table.readingTime'),
            minWidth: 200,
            formatter: this.dateFormat,
          },
        ],
        printStyle: `
            .no-print{
                display: none
            }
            .nav-header{
                display: flex;
                justify-content: space-between;
            }
            .el-form-item{
                display: inline-block;
                margin: 10px;
                margin-left: 0;
                vertical-align: top;
            }
            .el-form-item__label{
                display: inline-block;
                vertical-align: middle;
                font-size: 14px;
                color: #606266;
                line-height: 40px;
                padding: 0 12px 0 0;
            }
            .el-form-item__content{
                display: inline-block;
                line-height: 40px;
                font-size: 14px;
            }
            `,
      }
    },
    methods: {
      // 格式化时间格式
      dateFormat({ cellValue }) {
        return cellValue ? XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss') : ''
      },
      // 格式化身份类型
      identityFormat({ cellValue }) {
        switch (cellValue) {
          case 'ADMIN':
            return this.$t('table.subsystemAdmin')
          case 'EMPLOYEE':
            return this.$t('table.teacher')
          case 'STUDENT':
            return this.$t('table.student')
          case 'UNKNOWN':
            return this.$t('table.unknown')
          default:
            return ''
        }
      },
      // 单元格样式
      cellClassName({ row, columnIndex }) {
        if (!row.hasRead && (columnIndex == 1 || columnIndex == 3)) {
          return 'unread'
        }
      },
      // 筛选表格
      filterTable() {
        this.$emit('change', this.readType)
      },
      handlePageChange({ page, size }) {
        let P = { ...this.pagination }
        P.page = page
        P.size = size
        this.$emit('handlePagination', P)
      },
      async handlePrint() {
        if (this.printFunc && typeof this.printFunc == 'function') {
          let [err, res] = await to(this.printFunc())
          let DOMInfo = this.printDOM()
          if (!err && res.data.content && res.data.content instanceof Array) {
            let headDOM = this.$refs.xTable.$el.querySelector('.nav-header').innerHTML
            let Data = res.data.content.map((item) => ({
              ...item,
              name: `<span style='color: #D9001B'>${item.name}</span>`,
              hasRead: !item.hasRead
                ? `<span style='color: #D9001B'>${this.$t('common.unread')}</span>`
                : this.$t('common.read'),
            }))
            this.$refs.xTable.$refs.xTable.print({
              data: Data,
              style: this.printStyle + DOMInfo.style,
              beforePrintMethod: ({ content }) => {
                // console.log(DOMInfo.dom + headDOM + content)
                return DOMInfo.dom + headDOM + content
              },
            })
          }
        }
      },
      async handleExport() {
        this.$emit('export')
      },
      formatCount(num) {
        let n = parseInt(num)
        return Number.isNaN(n) ? 0 : n
      },
    },
  }
</script>

<style scoped lang="scss">
  .nav-header {
    display: flex;
    justify-content: space-between;
  }
  .mytable-style :deep(.unread) {
    color: #d9001b;
  }
</style>
