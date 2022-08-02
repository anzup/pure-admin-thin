<template>
  <VxeTable
    ref="xTable"
    :data="tableData"
    :columns="tableColumns"
    :loading="tableLoading"
    v-model:form="tablePagination"
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
              v-for="item in formFilter.role"
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

  <viewDialog v-model:show="viewDialogVisible" v-bind="viewDialogProps" />
  <!-- 审核弹框 -->
  <auditDialog
    v-model:show="auditDialogVisible"
    v-bind="auditDialogProps"
    @complate="getData"
    @preview="previewEvent"
  />
  <!-- 驳回理由弹框 -->
  <remarkDialog v-model:show="remarkDialogVisible" v-bind="remarkDialogProps" />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import {
    getQualificationRoles,
    getQualificationRequest,
    postQualificationsApprove,
  } from '/@/api/ftm/teacher/qualification'
  import auditDialog from './auditDialog.vue'
  import remarkDialog from './remarkDialog.vue'
  import viewDialog from './pdfViewDialog.vue'
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
            formatter: this.formatType,
          }, // 教员类型
          {
            title: this.$t('table.qualificationCertificateName'),
            minWidth: 200,
            field: 'type.name',
          }, // 资质证书名称
          {
            title: this.$t('table.belongOfProject'),
            minWidth: 150,
            field: 'type.configs',
            formatter: this.formatConfigs,
          }, // 所属项目
          {
            title: this.$t('table.applicationTime'),
            minWidth: 120,
            field: 'requestDate',
            formatter: 'formatDate',
          }, // 申请时间
          {
            title: this.$t('table.examineSelect'),
            minWidth: 120,
            field: 'status',
            formatter: this.formatAudit,
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
          total: 0,
          searchKey: '',
          builtinRole: undefined,
          status: 'WAITING_APPROVAL',
        },
        formFilter: {
          role: [],
          auditType: [
            { id: 'WAITING_APPROVAL', name: this.$t('common.unreviewed') }, // 未审核
            { id: 'APPROVED', name: this.$t('common.approved') }, // 通过
            { id: 'REJECTED', name: this.$t('common.rejected') }, // 拒绝
          ],
        },
        auditDialogVisible: false,
        auditDialogProps: {},
        viewDialogVisible: false,
        viewDialogProps: {},
        remarkDialogVisible: false,
        remarkDialogProps: {},
      }
    },
    computed: {
      tablePagination() {
        return {
          page: this.form.page,
          size: this.form.size,
          total: this.total,
        }
      },
    },
    components: {
      VxeTable,
      viewDialog,
      auditDialog,
      remarkDialog,
      Search,
    },
    created() {
      this.getRoles()
      this.getData()
    },
    methods: {
      async getData() {
        this.tableLoading = true
        const params = { ...this.form }
        deleteEmptyParams(params)
        const [err, res] = await to(getQualificationRequest(params))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      // 获取职位下拉列表
      async getRoles() {
        const [err, res] = await to(getQualificationRoles())
        if (!err && res.status == 200) {
          this.formFilter.role = res.data
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
              id: row.id,
              api: postQualificationsApprove,
              apiType: 1,
              details: row,
              hasDetails: true,
            }
            this.auditDialogVisible = true
            break
          case 2:
            this.remarkDialogProps = { remark: row.remark }
            this.remarkDialogVisible = true
            break
          case 3:
            this.viewDialogProps = {
              title: row.type.name,
              uuid: row.attachments[0],
              fileType: row.fileVOS[0].fileType,
            }
            this.viewDialogVisible = true
            break
        }
      },
      searchEvent() {
        this.form.page = 1
        this.getData()
      },
      changePageEvent({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getData()
      },
      previewEvent({ uuid, title, fileType }) {
        this.viewDialogProps = { title, uuid, fileType }
        this.viewDialogVisible = true
      },
      // 格式化所属项目
      formatConfigs({ cellValue }) {
        return cellValue instanceof Array
          ? cellValue.map((v) => `${v.courseCode}-${v.airplaneType}`).join(', ')
          : ''
      },
      // 格式化审核状态
      formatAudit({ cellValue }) {
        switch (cellValue) {
          case 'WAITING_APPROVAL':
            return this.$t('common.unreviewed')
          case 'APPROVED':
            return this.$t('common.approved')
          case 'REJECTED':
            return this.$t('common.rejected')
          default:
            cellValue
        }
      },
      // 格式化教员类型
      formatType({ cellValue }) {
        return (this.formFilter.role.find((item) => item.id == cellValue) || {}).name || ''
      },
    },
  }
</script>
