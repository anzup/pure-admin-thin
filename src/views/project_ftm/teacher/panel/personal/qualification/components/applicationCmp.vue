<template>
  <VxeTable
    :data="tableData"
    :columns="tableColumns"
    :loading="tableLoading"
    :buttons="operateButtons"
    v-model:form="tablePage"
    @action="handleOprationEvent"
    @handlePageChange="changePageEvent"
  />

  <!-- 预览资质文件弹框 -->
  <viewDialog v-model:show="viewDialogVisible" v-bind="viewDialogProps" />
  <!-- 驳回理由弹框 -->
  <remarkDialog v-model:show="remarkDialogVisible" v-bind="remarkDialogProps" />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getQualificationRequest } from '/@/api/ftm/teacher/qualification'
  import viewDialog from './pdfViewDialog.vue'
  import remarkDialog from './remarkDialog.vue'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        tableData: [],
        tableColumns: [
          { title: this.$t('table.qualificationName'), minWidth: 150, field: 'type.name' }, // 资质名称
          {
            title: this.$t('table.belongOfProject'),
            minWidth: 150,
            formatter: this.formatProject,
            field: 'type',
          }, // 所属项目
          {
            title: this.$t('table.modelNumber'),
            minWidth: 150,
            field: 'type',
            formatter: this.formatAirplane,
          }, // 机型
          {
            title: this.$t('table.applicationTime'),
            minWidth: 120,
            formatter: 'formatDate',
            field: 'createdDate',
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
            formatter: 'formatDate',
            field: 'requestDate',
          }, // 审核时间
          { title: this.$t('table.tableEdit'), slots: { default: 'operate' }, width: 200 },
        ],
        tableLoading: false,
        form: {
          page: 1,
          size: 10,
        },
        total: 0,
        viewDialogVisible: false,
        viewDialogProps: {},
        remarkDialogVisible: false,
        remarkDialogProps: {},
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      tablePage() {
        return {
          page: this.form.page,
          size: this.form.size,
          total: this.total,
        }
      },
    },
    components: { VxeTable, viewDialog, remarkDialog },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        this.tableLoading = true
        const params = {
          ...this.form,
          userIds: this.userInfo.userId,
        }
        const [err, res] = await to(getQualificationRequest(params))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.total = res.data.totalElements
        }
      },
      changePageEvent({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getData()
      },
      operateButtons({ row }) {
        return [
          { name: this.$t('button.view'), type: 1 },
          row.status === 'REJECTED' && { name: this.$t('button.reason'), type: 2 },
        ]
      },
      handleOprationEvent({ type, row }) {
        switch (type) {
          case 1:
            this.viewDialogProps = {
              title: row.type.name,
              uuid: row.attachments[0],
              fileType: row.fileVOS[0].fileType,
            }
            this.viewDialogVisible = true
            break
          case 2:
            this.remarkDialogProps = { remark: row.remark }
            this.remarkDialogVisible = true
            break
        }
      },
      // 格式化所属项目
      formatProject({ cellValue }) {
        return cellValue.allCourse
          ? this.$t('common.all')
          : cellValue.configs.map((v) => `${v.courseCode}-${v.airplaneType}`).join(', ')
      },
      // 格式化机型
      formatAirplane({ cellValue }) {
        return cellValue.allCourse
          ? this.$t('common.all')
          : cellValue.configs.map((v) => v.airplaneType).join(', ')
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
    },
  }
</script>
