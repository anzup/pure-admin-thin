<template>
  <VxeTable
    :data="tableData"
    :columns="tableColumns"
    :loading="tableLoading"
    :buttons="operateButtons"
    :span-method="mergeRowsMethod"
    @action="handleOprationEvent"
    @handlePageChange="changePageEvent"
  >
    <template #form>
      <div class="listTable-header">{{ course.name }}</div>
    </template>
    <template #pager />
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import {
    getQualificationList,
    deleteQualificationConList,
  } from '/@/api/ftm/teacher/qualification'
  import to from 'await-to-js'
  export default {
    components: { VxeTable },
    data() {
      return {
        tableData: [{}],
        tableColumns: [
          { title: this.$t('table.modelNumber'), minWidth: 150, field: 'airplaneType' }, // 机型
          {
            title: this.$t('table.teacherType'),
            minWidth: 150,
            field: 'builtinRole',
            formatter: this.formatRole,
          }, // 教员类型
          { title: this.$t('table.content'), minWidth: 200, field: 'name' }, // 内容
          { title: this.$t('table.managementBasis'), minWidth: 150, field: 'managementBasis' }, //管理依据
          { title: this.$t('table.remarks'), minWidth: 200, field: 'remark' }, //备注
          {
            title: this.$t('table.permanentlyEffective'),
            minWidth: 150,
            field: 'lifeLong',
            formatter: this.formatLifeLong,
          }, // 终身有效
          {
            title: this.$t('table.advanceRemindDay'),
            minWidth: 160,
            field: 'warningDays',
            formatter: this.formatWarningDays,
          }, // 提前提醒日（日）
          { title: this.$t('table.tableEdit'), width: 120, slots: { default: 'operate' } },
        ],
        tableLoading: false,
        tableHeight: 0,
      }
    },
    props: {
      course: {},
      roles: Array,
    },
    computed: {
      windowHeight() {
        return window.innerHeight
      },
    },
    watch: {
      windowHeight: {
        immediate: true,
        handler(h) {
          h > 0 && this.setTableHeight()
        },
      },
    },
    created() {
      this.getData()
    },
    updated() {
      this.setTableHeight()
    },
    methods: {
      async getData() {
        const params = {
          courseId: this.course.id,
          page: 1,
          size: 1000,
        }
        this.tableLoading = true
        const [err, res] = await to(getQualificationList(params))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.map((item) => ({
            ...item,
            teacherType: `${item.airplaneType}-${item.builtinRole}`,
          }))
        }
      },
      operateButtons(item) {
        return [{ name: this.$t('button.delete'), type: 1, status: 'danger' }]
      },
      handleOprationEvent({ row, type }) {
        switch (type) {
          case 1:
            this.deleteMethod(row)
            break
        }
      },
      changePageEvent({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getData()
      },
      setTableHeight() {
        this.$nextTick(() => {
          let parentDOM = this.$parent
          if (parentDOM && parentDOM.$el && parentDOM.$el.offsetHeight) {
            this.tableHeight = parentDOM.$el.offsetHeight
          }
        })
      },
      // 删除
      deleteMethod(row) {
        this.$confirm(this.$t('tip.areYouSureYouWantToDelete'), this.$t('button.delete'), {
          type: 'error',
        }).then(async () => {
          const params = {
            id: row.id,
            airplaneType: row.airplaneType,
            builtinRole: row.builtinRole,
            courseId: row.courseId,
          }
          const [err, res] = await to(deleteQualificationConList(params))
          if (!err && res.status == 200) {
            this.$message.success(this.$t('tip.delsuccessTip'))
            this.getData()
          }
        })
      },
      mergeRowsMethod({ row, _rowIndex, column, visibleData }) {
        const fields = ['airplaneType', 'teacherType']
        let columnName
        if (column.property == 'builtinRole') {
          columnName = 'teacherType'
        } else {
          columnName = column.property
        }
        const cellValue = row[columnName]
        if (cellValue && fields.includes(columnName)) {
          let prevRow = visibleData[_rowIndex - 1]
          let nextRow = visibleData[_rowIndex + 1]
          if (prevRow && prevRow[columnName] === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[columnName] === cellValue) {
              nextRow = visibleData[++countRowspan + _rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      },
      // 格式化角色
      formatRole({ cellValue }) {
        return (this.roles.find((item) => item.id == cellValue) || {}).name
      },
      // 格式化期限
      formatWarningDays({ row, cellValue }) {
        return row.lifeLong ? '' : cellValue
      },
      formatLifeLong({ cellValue }) {
        return typeof cellValue == 'boolean'
          ? cellValue === true
            ? this.$t('common.yes')
            : this.$t('common.no')
          : ''
      },
    },
  }
</script>

<style lang="scss" scoped>
  .listTable-header {
    padding-bottom: 15px;
    height: 32px;
    line-height: 32px;
    font-size: 18px;
    text-align: center;
    box-sizing: content-box;
  }
</style>
