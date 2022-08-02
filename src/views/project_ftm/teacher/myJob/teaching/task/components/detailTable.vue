<template>
  <div>
    <VxeTable
      :loading="loading"
      :data="data"
      :columns="tableColumns"
      v-model:form="form"
      :height="null"
      @handle-page-change="handlePageChange"
    >
      <template #form>
        <div class="nav-header">
          <el-form :inline="true">
            <el-form-item :label="$t('common.read')">{{
              filterCount(Details.readCount)
            }}</el-form-item>
            <el-form-item :label="$t('common.unread')">{{
              filterCount(Details.unreadCount)
            }}</el-form-item>
          </el-form>
          <div>
            <el-select v-model="readType" @change="filterTable">
              <el-option value="" :label="$t('common.all')" />
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
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  export default {
    props: ['loading', 'data', 'Details', 'origin', 'pagination'],
    components: { VxeTable },
    data() {
      return {
        readType: '',
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
      }
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
      filterTable(val) {
        if (val === '') {
          // 全部
          this.$emit('update:data', [].concat(this.origin))
        } else {
          this.$emit(
            'update:data',
            this.origin.filter((v) => v.hasRead === val),
          )
        }
      },
      handlePageChange({ page, size }) {
        let P = { ...this.pagination }
        P.page = page
        P.size = size
        this.readType = ''
        this.$emit('handlePagination', P)
      },
      filterCount(num) {
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
