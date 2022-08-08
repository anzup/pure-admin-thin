<template>
  <VxeTable
    :data="tableData"
    :loading="tableLoading"
    :columns="tableColumns"
    :buttons="tableButtons"
    :toolbar-config="tableToolbar"
    v-model:form="form"
    :span-method="mergeRowsMethod"
    @handlePageChange="changePageEvent"
  >
    <template #left_tools>
      <el-form inline size="medium">
        <!-- 课程类型 -->
        <el-form-item :label="$t('table.courseType')">
          <el-select clearable v-model="form.courseClassifyId" @change="getData">
            <el-option
              v-for="item in formFilter.course"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #right_tools>
      <el-button
        v-if="containsPermissions(menuName + ':ADD')"
        type="primary"
        size="medium"
        @click="addItemEvent"
        >{{ $t('button.add') }}</el-button
      >
    </template>
  </VxeTable>

  <!-- 新增/修改/更新弹框 -->
  <QuaCourseAddDialog
    v-model:show="addDialogVisible"
    :isModify="addDialogModify"
    :isUpdate="addDialogUpdate"
    v-bind="addDialogProps"
    @complate="getData"
  />
  <!-- 管理弹窗 -->
  <QuaCourseManageDialog
    v-model:show="manageDialogVisible"
    :isModify="manageDialogModify"
    :itemProps="manageDialogProps"
    @complate="getData"
  />
  <!-- 浏览详情文件弹框 -->
  <QualificationViewDialog
    v-model:show="detailDialogVisible"
    :title="detailDialogTitle"
    :list="detailDialogList"
  />
  <!-- 预览历史版本列表 -->
  <QualificationsViewDialog
    v-model:show="historyDialogVisible"
    :title="historyDialogTitle"
    :list="historyDialogList"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import QuaCourseAddDialog from './quaCourseAddDialog.vue'
  import QuaCourseManageDialog from './quaCourseManageDialog.vue'
  import QualificationViewDialog from './qualificationViewDialog.vue'
  import QualificationsViewDialog from './qualificationsViewDialog.vue'
  import { getCourseClassifies } from '/@/api/ftm/teacher/configSettings'
  import {
    getCourseQualifications,
    deleteCourseQualification,
  } from '/@/api/ftm/teacher/qualification'
  import to from 'await-to-js'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        tableLoading: false,
        tableToolbar: {
          perfect: true,
          slots: {
            buttons: 'left_tools',
            tools: 'right_tools',
          },
        },
        tableData: [],
        tableColumns: [
          { title: this.$t('table.sourse'), field: 'courseName', minWidth: 120 }, // 课程
          { title: this.$t('table.modelNumber'), field: 'airplaneType', minWidth: 120 }, // 机型
          { title: this.$t('table.content'), field: 'content', minWidth: 150 }, // 内容
          { title: this.$t('table.versionNumber'), field: 'version', minWidth: 120 }, // 版本号
          {
            title: this.$t('table.approvalDate'),
            field: 'checkDate',
            minWidth: 150,
            formatter: 'formatDate',
          }, // 批准日期
          { title: this.$t('table.approvalPerson'), field: 'checkName', minWidth: 120 }, // 批准人
          { title: this.$t('table.tableEdit'), slots: { default: 'operate' }, minWidth: 250 }, // 操作
        ],
        menuName: 'COURSE_QUALIFICATION_MANAGEMENT',
        form: {
          page: 1,
          size: 10,
          total: 0,
          courseClassifyId: '',
          currentVersion: true,
          sort: 'courseId,airplaneType,id',
        },
        formFilter: {
          course: [],
        },
        addDialogVisible: false,
        manageDialogVisible: false,
        manageDialogModify: false,
        manageDialogProps: {},
        addDialogModify: false,
        addDialogUpdate: false,
        addDialogProps: {},
        historyDialogVisible: false,
        historyDialogList: [],
        historyDialogTitle: '',
        detailDialogVisible: false,
        detailDialogTitle: '',
        detailDialogList: [],
      }
    },
    components: {
      VxeTable,
      QuaCourseAddDialog,
      QuaCourseManageDialog,
      QualificationViewDialog,
      QualificationsViewDialog,
    },
    created() {
      this.getCourseType()
      this.getData()
    },
    methods: {
      async getData() {
        this.tableLoading = true
        const [err, res] = await to(getCourseQualifications(this.form))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content.map((item) => ({
            ...item,
            courseName: item.course ? item.course.name : '',
            airplaneName: `${item.course ? item.course.name : ''}-${item.airplaneType}`,
          }))
          this.form.total = res.data.totalElements
        }
      },
      // 获取课程类型列表
      async getCourseType() {
        const params = {
          page: 1,
          size: 100,
        }
        const [err, res] = await to(getCourseClassifies(params))
        if (!err && res.status == 200) {
          this.formFilter.course = res.data.content
        }
      },
      changePageEvent({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getData()
      },
      addItemEvent() {
        this.addDialogModify = false
        this.addDialogUpdate = false
        this.addDialogVisible = true
      },
      async handleModifyEvent(row, type) {
        switch (type) {
          case 1: // 详情
            {
              const validity = this.validateDetail(row)
              if (!validity) return
              if (row.classifyType == 'FILE') {
                this.detailDialogTitle = row.content
                this.detailDialogList = row.fileVOS
                this.detailDialogVisible = true
              } else {
                this.manageDialogProps = row
                this.manageDialogModify = false
                this.manageDialogVisible = true
              }
            }
            break
          case 2: // 管理
            this.manageDialogModify = true
            this.manageDialogProps = row
            this.manageDialogVisible = true
            break
          case 3: // 修改
            this.addDialogProps = {
              id: row.id,
            }
            this.addDialogModify = true
            this.addDialogUpdate = false
            this.addDialogVisible = true
            break
          case 4: // 删除
            this.$confirm(this.$t('tip.areYouSureYouWantToDelete'), this.$t('button.delete'), {
              type: 'error',
            }).then(async () => {
              const [err, res] = await to(deleteCourseQualification({ id: row.id }))
              if (!err && res.status == 200) {
                this.$message.success(this.$t('tip.delsuccessTip'))
                if (
                  this.form.page > 1 &&
                  this.form.total == (this.form.page - 1) * this.form.size + 1
                ) {
                  this.form.page -= 1
                }
                this.getData()
              }
            })
            break
          case 5: // 历史版本
            {
              const params = {
                page: 1,
                size: 1000,
                originId: row.originId,
              }
              const [err, res] = await to(getCourseQualifications(params))
              this.historyDialogTitle = `${row.content}(${this.$t('button.versionHistory')})`
              if (!err && res.status == 200) {
                this.historyDialogList = res.data.content
                this.historyDialogVisible = true
              }
            }
            break
          case 6: // 更新
            this.addDialogProps = { ...row }
            this.addDialogModify = true
            this.addDialogUpdate = true
            this.addDialogVisible = true
            break
        }
      },
      mergeRowsMethod({ row, _rowIndex, column, visibleData }) {
        const fields = ['courseName', 'airplaneName']
        const property = column.property == 'airplaneType' ? 'airplaneName' : column.property
        const cellValue = row[property]
        if (cellValue && fields.includes(property)) {
          let prevRow = visibleData[_rowIndex - 1]
          let nextRow = visibleData[_rowIndex + 1]
          if (prevRow && prevRow[property] === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[property] === cellValue) {
              nextRow = visibleData[++countRowspan + _rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      },
      // 验证是否能查看详情（类型文件且无上传文件）
      validateDetail(row) {
        if (row.classifyType == 'FILE' && row.attachments.length < 1) {
          return false
        } else if (row.classifyType == 'QUESTIONS' && !row.questionBankId) {
          return false
        } else {
          return true
        }
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            disabled: !this.validateDetail(row),
            event: () => {
              this.handleModifyEvent(row, 1)
            },
          },
          ...(row.classifyType == 'FILE'
            ? [
                {
                  name: this.$t('button.versionHistory'),
                  event: () => {
                    this.handleModifyEvent(row, 5)
                  },
                },
                {
                  name: this.$t('button.upData'),
                  event: () => {
                    this.handleModifyEvent(row, 6)
                  },
                },
              ]
            : [
                {
                  name: this.$t('button.management'),
                  event: () => {
                    this.handleModifyEvent(row, 2)
                  },
                },
              ]),
          {
            name: this.$t('button.modify'),
            visible: userStore.ContainsPermissions(this.menuName + ':EDIT'),
            event: () => {
              this.handleModifyEvent(row, 3)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: userStore.ContainsPermissions(this.menuName + ':DELETE'),
            event: () => {
              this.handleModifyEvent(row, 4)
            },
          },
        ]
      },
    },
  }
</script>

<style lang="scss" scoped>
  :deep(.vxe-toolbar:not(.is--perfect) .vxe-tools--wrapper) {
    padding-right: 0;
  }
</style>
