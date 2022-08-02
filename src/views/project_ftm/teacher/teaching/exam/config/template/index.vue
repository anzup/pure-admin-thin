<template>
  <VxeTable
    :data="tableData"
    :columns="tableCoulmns"
    :loading="tableLoading"
    :toolbarConfig="tableToolbar"
    :buttons="tableButtons"
    v-model:form="pagination"
    @handlePageChange="handlePageChange"
  >
    <template #right_tools>
      <el-button type="primary" size="mini" @click="toAdd">{{ $t('button.add') }}</el-button>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import to from 'await-to-js'
  import { getExamTemplate, delExamTemplate } from '/@/api/ftm/teacher/examCenter'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  export default {
    components: { VxeTable },
    data() {
      return {
        tableData: [],
        tableCoulmns: [
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'name', title: this.$t('table.templateName'), minWidth: 100 },
          {
            field: 'questionSelectType',
            title: this.$t('table.testPaperGenerationMethod'),
            minWidth: 100,
            formatter: this.formatSelectType,
          },
          {
            field: 'questionBanks',
            title: this.$t('table.useBank'),
            minWidth: 120,
            formatter: ({ cellValue }) =>
              cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : cellValue,
          },
          { field: 'totalScore', title: this.$t('table.totalScores'), width: 120 },
          { field: 'passScore', title: this.$t('table.passScores'), width: 120 },
          {
            field: 'questionTypeConfigs',
            title: this.$t('table.totalQuestions'),
            width: 150,
            formatter: ({ cellValue }) =>
              cellValue instanceof Array
                ? cellValue.reduce((pre, next) => pre + next.questionCount, 0)
                : '',
          },
          {
            field: 'questionTypeConfigs',
            title: this.$t('table.objectiveItems'),
            width: 150,
            formatter: this.impersonFormat,
          },
          {
            field: 'questionTypeConfigs',
            title: this.$t('table.subjectiveItems'),
            width: 150,
            formatter: this.subjectiveFormat,
          },
          { title: this.$t('table.tableEdit'), minWidth: 180, slots: { default: 'operate' } },
        ],
        tableToolbar: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableLoading: false,
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
      }
    },
    // TODO 原缓存页面执行activated
    mounted() {
      this.getData()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      async getData() {
        let params = {
          ...this.pagination,
        }
        this.tableLoading = true
        let [err, res] = await to(getExamTemplate(params))
        this.tableLoading = false
        if (!err) {
          this.tableData = res.data.content
          this.pagination.total = res.data.totalElements
        }
      },
      handlePageChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      // 删除行
      handleDeleteRow(item) {
        this.$confirm(this.$t('tip.areYouSureYouWantToDelete'), this.$t('tip.tip'), {
          type: 'error',
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
        }).then(async () => {
          this.tableLoading = true
          let [err, res] = await to(delExamTemplate({ id: item.id }))
          if (!err) {
            if (
              this.pagination.page > 1 &&
              this.pagination.total - 1 < (this.pagination.page - 1) * this.pagination.size + 1
            ) {
              this.pagination.page--
            }
            this.$message.success(this.$t('tip.delsuccessTip'))
            this.getData()
          } else {
            this.tableLoading = false
          }
        })
      },
      handleEditRow(row) {
        this.routerGo(`config/template/edit/${row.id}`)
      },
      handleDetailRow(row) {
        this.routerGo(`config/template/detail/${row.id}`)
      },
      toAdd() {
        this.routerGo(`config/template/add`)
      },
      // 格式化客观题数
      impersonFormat({ cellValue }) {
        return cellValue instanceof Array
          ? cellValue.reduce(
              (pre, next) =>
                pre + (next.type == 'QA' || next.type == 'FILL_BLANK' ? 0 : next.questionCount),
              0,
            )
          : ''
      },
      // 格式化主观题数
      subjectiveFormat({ cellValue }) {
        return cellValue instanceof Array
          ? cellValue.reduce(
              (pre, next) =>
                pre + (next.type == 'QA' || next.type == 'FILL_BLANK' ? next.questionCount : 0),
              0,
            )
          : ''
      },
      // 格式化组卷方式
      formatSelectType({ cellValue }) {
        switch (cellValue) {
          case 'QUESTION_BANK_COUNT':
            return this.$t('table.questionBank')
          case 'DIFFICULTY_PERCENT':
            return this.$t('table.difficulty')
          case 'IMPORTANCE_PERCENT':
            return this.$t('table.importance')
          case 'CHAPTER_PERCENT':
            return this.$t('table.chapter')
          default:
            return ''
        }
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            event: () => {
              this.handleDetailRow(row)
            },
          },
          {
            name: this.$t('button.edit'),
            event: () => {
              this.handleEditRow(row)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            event: () => {
              this.handleDeleteRow(row)
            },
          },
        ]
      },
    },
  }
</script>
