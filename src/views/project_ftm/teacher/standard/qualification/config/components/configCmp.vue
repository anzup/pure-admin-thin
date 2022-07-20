<template>
  <VxeTable
    :data="tableData"
    :toolbar-config="tableTool"
    :columns="tableColumns"
    :loading="tableLoading"
    :buttons="operateButtons"
    @action="handleOprationEvent"
  >
    <template #right_tools>
      <el-button type="primary" size="medium" @click="addItemEvent">{{
        $t('button.add')
      }}</el-button>
    </template>
    <template #pager />
  </VxeTable>
  <addDialog
    v-model:show="addDialogVisible"
    :isModify="addDialogModify"
    v-bind="addDialogProps"
    @complate="getData"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import addDialog from './listAddDialog.vue'
  import {
    getQualificationConfigurations,
    deleteQualificationConfigurations,
  } from '/@/api/ftm/teacher/qualification'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        tableData: [],
        tableTool: {
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { title: this.$t('table.qualificationContent'), minWidth: 200, field: 'name' }, // 资质内容
          { title: this.$t('table.applyProject'), minWidth: 200, formatter: this.formatProject }, // 适用项目
          {
            title: this.$t('table.permanentlyEffective'),
            minWidth: 150,
            field: 'lifeLong',
            formatter: this.formatLife,
          }, // 终身有效
          {
            title: this.$t('table.advanceRemindDay'),
            minWidth: 150,
            field: 'warningDays',
            formatter: this.formatWarningDays,
          }, // 提前提醒日（日）
          { title: this.$t('table.managementBasis'), minWidth: 150, field: 'managementBasis' }, // 管理依据
          { title: this.$t('table.remarks'), minWidth: 200, field: 'remark' }, // 备注
          { title: this.$t('table.tableEdit'), width: 160, slots: { default: 'operate' } },
        ],
        tableLoading: false,
        addDialogVisible: false,
        addDialogModify: false,
        addDialogProps: {},
      }
    },
    components: { addDialog, VxeTable },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        this.tableLoading = true
        const [err, res] = await to(getQualificationConfigurations({ page: 1, size: 1000 }))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
        }
      },
      operateButtons(item) {
        return [
          { name: this.$t('button.modify'), type: 1 },
          { name: this.$t('button.delete'), type: 2, status: 'danger' },
        ]
      },
      handleOprationEvent({ row, type }) {
        switch (type) {
          case 1:
            this.addDialogProps = row
            this.addDialogModify = true
            this.addDialogVisible = true
            break
          case 2:
            this.deleteMethod(row)
            break
        }
      },
      addItemEvent() {
        this.addDialogModify = false
        this.addDialogVisible = true
      },
      // 删除
      deleteMethod(row) {
        this.$confirm(this.$t('tip.areYouSureYouWantToDelete'), this.$t('button.delete'), {
          type: 'error',
        }).then(async () => {
          const [err, res] = await to(deleteQualificationConfigurations({ id: row.id }))
          if (!err && res.status == 200) {
            this.$message.success(this.$t('tip.delsuccessTip'))
            this.getData()
          }
        })
      },
      // 格式化终身有效
      formatLife({ cellValue }) {
        return typeof cellValue == 'boolean'
          ? cellValue
            ? this.$t('common.yes')
            : this.$t('common.no')
          : cellValue
      },
      // 格式化提醒日
      formatWarningDays({ row, cellValue }) {
        return row.lifeLong ? '' : cellValue
      },
      // 格式化项目
      formatProject({ row }) {
        if (row.allCourse) {
          return this.$t('common.all')
        } else {
          return Array.from(
            new Set(row.configs.map((item) => `${item.courseCode}-${item.airplaneType}`)),
          ).join(', ')
        }
      },
    },
  }
</script>
