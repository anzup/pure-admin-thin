<template>
  <el-dialog
    :title="$t('table.multipleChoiceQuestionBank')"
    top="10vh"
    v-model="visible"
    :before-close="handleClose"
    center
    width="700px"
  >
    <VxeTable
      ref="xTable"
      :data="tableData"
      :columns="tableCoulmns"
      :loading="tableLoading"
      v-model:form="pagination"
      :height="dialogHeight"
      @handlePageChange="handlePageChange"
    />
    <template #footer>
      <el-button @click="handleClose" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getExamTemplate } from '/@/api/ftm/teacher/examCenter'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        tableData: [],
        tableCoulmns: [
          { type: 'radio', width: 40 },
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
        ],
        tableLoading: false,
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
        checkedRow: {},
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      dialogHeight() {
        return window.innerHeight * 0.7
      },
      xTable() {
        return this.$refs.xTable.$refs.xTable
      },
    },
    components: { VxeTable },
    created() {
      this.getData()
    },
    methods: {
      handleClose() {
        this.$emit('update:visible', false)
      },
      handlePageChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      async getData() {
        this.tableLoading = true
        let [err, res] = await to(getExamTemplate(this.pagination))
        this.tableLoading = false
        if (!err) {
          this.tableData = res.data.content
          this.pagination.total = res.data.totalElements
        }
      },
      handleSave() {
        const checkedRow = this.xTable.getRadioRecord()
        const checkedRowId = checkedRow?.id
        if (!checkedRowId) {
          this.$message.closeAll()
          this.$message.error(this.$t('status.noSelect'))
          return false
        }
        this.$emit('checkbox', checkedRow)
        this.handleClose()
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
          default:
            return ''
        }
      },
    },
  }
</script>
