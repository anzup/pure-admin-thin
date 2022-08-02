<template>
  <VxeTable
    :data="tableData"
    :columns="tableColumns"
    :loading="tableLoading"
    :buttons="tableButtons"
    :toolbar-config="tableToolbar"
    v-model:form="form"
    @action="handleOprationEvent"
    @handlePageChange="changePageEvent"
  >
    <template #right_tools>
      <el-button
        v-if="permissionName ? containsPermissions(permissionName + ':ADD') : true"
        type="primary"
        @click="addItemEvent"
        >{{ $t('button.add') }}</el-button
      >
    </template>
  </VxeTable>
  <!-- 新增/修改弹框 -->
  <QualificationAddDialog
    :isModify="addDialogModify"
    :isUpdate="addDialogUpdate"
    v-model:show="addDialogVisible"
    :modifyData="addDialogModifyData"
    @success="addSuccessEvent"
  />
  <!-- 预览资质证书 -->
  <QualificationViewDialog :title="viewTitle" :list="viewList" v-model:show="viewDialogVisible" />
  <!-- 预览资质证书历史列表 -->
  <QualificationsViewDialog
    :title="viewsTitle"
    :list="viewsList"
    v-model:show="viewsDialogVisible"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import QualificationAddDialog from './qualificationAddDialog.vue'
  import QualificationViewDialog from './qualificationViewDialog.vue'
  import QualificationsViewDialog from './qualificationsViewDialog.vue'
  import {
    getCenterQualifications,
    getCenterQualificationsDetail,
    deleteCenterQualification,
  } from '/@/api/ftm/teacher/education'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        form: {
          currentVersion: true,
          page: 1,
          size: 10,
          total: 0,
        },
        tableLoading: false,
        tableData: [],
        tableColumns: [
          { field: 'name', title: this.$t('table.qualificationContent'), minWidth: 200 }, // 资质内容
          { field: 'version', title: this.$t('table.versionNumber'), minWidth: 100 }, // 版本号
          {
            field: 'checkDate',
            title: this.$t('table.approvalDate'),
            minWidth: 120,
            formatter: 'formatDate',
          }, //  批准日期
          { field: 'checkName', title: this.$t('table.approvalPerson'), minWidth: 120 }, // 批准人
          { title: this.$t('table.tableEdit'), slots: { default: 'operate' }, width: 350 },
        ],
        tableToolbar: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        addDialogVisible: false,
        addDialogModify: false,
        addDialogUpdate: false,
        addDialogModifyData: {},
        viewDialogVisible: false,
        viewList: [], // 证书列表
        viewTitle: '',
        viewsDialogVisible: false,
        viewsList: [], // 证书历史列表
        viewsTitle: '',
        permissionName: 'CENTER_QUALIFICATION_MANAGEMENT',
      }
    },
    components: {
      QualificationAddDialog,
      QualificationViewDialog,
      QualificationsViewDialog,
      VxeTable,
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        this.tableLoading = true
        let [err, res] = await to(getCenterQualifications(this.form))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      changePageEvent({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getData()
      },
      handleOprationEvent(row, type) {
        switch (type) {
          case 1:
            if (!row.attachments || row.attachments.length == 0) return
            this.viewList = row.fileVOS
            this.viewTitle = row.name
            this.viewDialogVisible = true
            break
          case 2:
            getCenterQualifications({
              page: 1,
              size: 1000,
              originId: row.originId,
            }).then((res) => {
              if (res.status == 200) {
                this.viewsDialogVisible = true
                this.viewsTitle = `${row.name}(${this.$t('button.versionHistory')})`
                this.viewsList = res.data.content
              }
            })
            break
          case 3:
            getCenterQualificationsDetail({ id: row.id }).then((res) => {
              if (res.status == 200) {
                this.addDialogModifyData = {
                  ...res.data,
                  attachments: res.data.attInfos,
                }
                this.addDialogModify = true
                this.addDialogUpdate = false
                this.addDialogVisible = true
              }
            })
            break
          case 4:
            this.addDialogModifyData = {
              name: row.name,
              originId: row.originId,
            }
            this.addDialogUpdate = true
            this.addDialogModify = false
            this.addDialogVisible = true
            break
          case 5:
            this.deleteItemEvent(row)
            break
        }
      },
      addItemEvent() {
        this.addDialogModify = false
        this.addDialogUpdate = false
        this.addDialogVisible = true
      },
      addSuccessEvent() {
        this.addDialogVisible = false
        this.getData()
      },
      deleteItemEvent(row) {
        this.$confirm(this.$t('tip.areYouSureYouWantToDelete'), this.$t('button.delete'), {
          type: 'error',
        }).then(async () => {
          let [err, res] = await to(deleteCenterQualification({ id: row.id }))
          if (!err && res.status == 200) {
            this.$message.success(this.$t('tip.delsuccessTip'))
            if (
              this.form.page > 1 &&
              this.form.total == (this.form.page - 1) * this.form.size + 1
            ) {
              this.form.page--
            }
            this.getData()
          }
        })
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            disabled: row.attachments.length == 0,
            event: () => {
              this.handleOprationEvent(row, 1)
            },
          },
          {
            name: this.$t('button.upData'),
            visible: this.permissionName
              ? this.containsPermissions(this.permissionName + ':ADD')
              : true,
            event: () => {
              this.handleOprationEvent(row, 4)
            },
          },
          {
            name: this.$t('button.versionHistory'),
            event: () => {
              this.handleOprationEvent(row, 2)
            },
          },
          {
            name: this.$t('button.modify'),
            visible: this.permissionName
              ? this.containsPermissions(this.permissionName + ':EDIT')
              : true,
            event: () => {
              this.handleOprationEvent(row, 3)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: this.permissionName
              ? this.containsPermissions(this.permissionName + ':DELETE')
              : true,
            event: () => {
              this.handleOprationEvent(row, 5)
            },
          },
        ]
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-form-item:nth-last-child(1) {
    margin-right: 0;
  }
  .align-right {
    text-align: right;
  }
</style>
