<template>
  <VxeTable
    :data="tableData"
    :columns="tableColumns"
    :loading="tableLoading"
    v-model:form="tablePage"
    :buttons="operateButtons"
    @action="handleOprationEvent"
    @handlePageChange="changePageEvent"
  >
    <template #form>
      <el-form inline>
        <!-- 教员类型 -->
        <el-form-item :label="$t('table.teacherType')">
          <el-select v-model="form.builtinRole" clearable>
            <el-option
              v-for="item in formFilter.teacherType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 审核状态 -->
        <el-form-item :label="$t('table.examineSelect')">
          <el-select v-model="form.status" clearable>
            <el-option
              v-for="item in formFilter.auditType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseEnterTeacherNameQuery')"
            v-model.trim="form.searchKey"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchEvent">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>

  <!-- 预览资质文件弹框 -->
  <viewDialog
    v-model:show="viewDialogVisible"
    v-bind="viewDialogProps"
    @preview="previewFileEvent"
  />
  <!-- 审核弹框 -->
  <auditDialog v-model:show="auditDialogVisible" v-bind="auditDialogProps" @complate="getData" />
  <!-- 驳回理由弹框 -->
  <remarkDialog v-model:show="remarkDialogVisible" v-bind="remarkDialogProps" />
  <!-- 预览文件弹框 -->
  <pdfViewDialog v-model:show="pdfViewDialogVisible" v-bind="pdfViewDialogProps" />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import viewDialog from './viewDialog.vue'
  import auditDialog from './auditDialog.vue'
  import remarkDialog from './remarkDialog.vue'
  import pdfViewDialog from './pdfViewDialog.vue'
  import { Search } from '@element-plus/icons-vue'
  import {
    getQualificationProvide,
    getQualificationRoles,
    postQualificationProvide,
  } from '/@/api/ftm/teacher/qualification'
  import { deleteEmptyParams } from '/@/utils/index'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        tableData: [],
        tableColumns: [
          { title: this.$t('table.name'), minWidth: 100, field: 'userName' }, // 姓名
          {
            title: this.$t('table.teacherType'),
            minWidth: 120,
            field: 'builtinRole',
            formatter: this.formatTeacher,
          }, // 教员类型
          { title: this.$t('table.courseName'), minWidth: 200, field: 'courseName' }, // 课程名称
          { title: this.$t('table.courseCode'), minWidth: 150, field: 'courseCode' }, // 课程代码
          { title: this.$t('table.modelNumber'), minWidth: 120, field: 'airplaneType' }, // 机型
          {
            title: this.$t('table.applicationTime'),
            minWidth: 120,
            field: 'createdDate',
            formatter: 'formatDate',
          }, // 申请时间
          {
            title: this.$t('table.examineSelect'),
            minWidth: 120,
            field: 'status',
            formatter: this.formatStatus,
          }, // 审核状态
          {
            title: this.$t('table.auditTime'),
            minWidth: 120,
            field: 'checkDate',
            formatter: 'formatDate',
          }, // 审核时间
          { title: this.$t('table.tableEdit'), slots: { default: 'operate' }, width: 200 },
        ],
        tableLoading: false,
        form: {
          page: 1,
          size: 10,
          searchKey: '',
          builtinRole: undefined,
          status: 'WAITING_APPROVAL',
        },
        tableTotal: 0,
        formFilter: {
          teacherType: [],
          auditType: [
            { id: 'WAITING_APPROVAL', name: this.$t('common.unreviewed') }, // 未审核
            { id: 'APPROVED', name: this.$t('common.approved') }, // 通过
            { id: 'REJECTED', name: this.$t('common.rejected') }, // 拒绝
          ],
        },
        viewDialogVisible: false,
        viewDialogProps: {},
        auditDialogVisible: false,
        auditDialogProps: {},
        remarkDialogVisible: false,
        remarkDialogProps: {},
        pdfViewDialogVisible: false,
        pdfViewDialogProps: {},
      }
    },
    computed: {
      tablePage() {
        return {
          page: this.form.page,
          size: this.form.size,
          total: this.tableTotal,
        }
      },
    },
    components: { VxeTable, viewDialog, auditDialog, remarkDialog, pdfViewDialog, Search },
    created() {
      this.getQualificationRoles()
      this.getData()
    },
    methods: {
      async getData() {
        this.tableLoading = true
        const params = { ...this.form }
        deleteEmptyParams(params)
        const [err, res] = await to(getQualificationProvide(params))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
        }
      },
      // 教员类型下拉
      async getQualificationRoles() {
        const [err, res] = await to(getQualificationRoles())
        if (!err && res.status == 200) {
          this.formFilter.teacherType = res.data
        }
      },
      operateButtons({ row }) {
        return [
          { name: this.$t('button.examine'), type: 1, disabled: row.status != 'WAITING_APPROVAL' },
          row.status == 'REJECTED' && { name: this.$t('button.reason'), type: 2 },
          { name: this.$t('button.view'), type: 3 },
        ]
      },
      handleOprationEvent({ type, row }) {
        switch (type) {
          case 1:
            this.auditDialogProps = {
              ...row,
              api: postQualificationProvide,
              apiType: 2,
            }
            this.auditDialogVisible = true
            break
          case 2:
            this.remarkDialogProps = { remark: row.remark }
            this.remarkDialogVisible = true
            break
          case 3:
            this.viewDialogProps = row
            this.viewDialogVisible = true
            break
        }
      },
      changePageEvent({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getData()
      },
      searchEvent() {
        this.form.page = 1
        this.getData()
      },
      previewFileEvent(item) {
        this.pdfViewDialogProps = {
          title: item.name,
          uuid: item.uuid,
          fileType: item.fileType,
        }
        this.pdfViewDialogVisible = true
      },
      // 格式化教员类型
      formatTeacher({ cellValue }) {
        return (
          (this.formFilter.teacherType.find((item) => cellValue == item.id) || {}).name || cellValue
        )
      },
      // 格式化状态
      formatStatus({ cellValue }) {
        return (
          (this.formFilter.auditType.find((item) => item.id == cellValue) || {}).name || cellValue
        )
      },
    },
  }
</script>
