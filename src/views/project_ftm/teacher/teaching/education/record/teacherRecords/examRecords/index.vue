<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    v-model:form="pagination"
    :columns="tableColumns"
    :toolbar-config="tableTools"
    :buttons="tableButtons"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form inline size="medium">
        <el-form-item :label="$t('table.examYear')">
          <!-- 学年 -->
          <el-date-picker
            v-model="form.schoolYear"
            type="year"
            :placeholder="$t('common.all')"
            value-format="yyyy"
            :editable="false"
            :picker-options="pickerOptions"
            @change="getExamList"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #right_tools>
      <el-button size="mini" type="primary" :loading="loadingExport" @click="Export">{{
        $t('button.leadingOut')
      }}</el-button>
    </template>
    <template #scores="{ row }">
      <span> {{ sum(row.objectiveQuestionScore, row.subjectiveQuestionScore) }}</span>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getExamRecords } from '/@/api/ftm/teacher/exam'
  import Api from '/@/api/ftm/teacher/trainEva'
  import moment from 'moment'
  import XEUtils from 'xe-utils'
  export default {
    components: { VxeTable },
    data() {
      return {
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            buttons: 'left_tools',
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'exam.name', title: this.$t('table.examName'), minWidth: 100 },
          { field: 'exam.year', title: this.$t('table.examYear'), width: 90 },
          {
            field: 'exam.type',
            title: this.$t('table.examClassification'),
            formatter: this.formatType,
            width: 90,
          },
          {
            field: 'exam.startDate',
            title: this.$t('table.examStartTime'),
            minWidth: 120,
            formatter: this.formatDate,
          },
          {
            field: 'exam.duration',
            title: this.$t('table.examDurationMinutes'),
            width: 140,
          },
          {
            field: 'questionCount',
            title: this.$t('table.questionsNum'),
            width: 80,
          },
          {
            field: 'exam.totalScore',
            title: this.$t('table.totalScore'),
            width: 80,
          },
          {
            field: 'exam.passScore',
            title: this.$t('table.passLine'),
            width: 80,
          },
          {
            field: 'objectiveQuestionScore',
            title: this.$t('table.score'),
            slots: { default: 'scores' },
            width: 80,
          },
          {
            field: 'passType',
            title: this.$t('table.examResults'),
            formatter: this.formatPassType,
            width: 90,
          },
          {
            field: 'status',
            title: this.$t('table.examStatus'),
            formatter: this.formatStatus,
            width: 90,
          },
          {
            title: this.$t('table.tableEdit'),
            width: 140,
            slots: { default: 'operate' },
          },
        ],
        pagination: {
          // 表格分页信息
          page: 1,
          size: 10,
          total: 0,
        },
        loading: false,
        loadingExport: false,
        form: {
          examType: 'THEORY',
          examTypeArr: [
            { id: 'PRACTICE', name: this.$t('status.practiceExam') },
            { id: 'THEORY', name: this.$t('status.theoryExam') },
          ],
          examStatus: undefined,
          examStatusArr: [
            { id: 'FINISHED', name: this.$t('status.examFinished') },
            { id: 'IN_PROGRESS', name: this.$t('status.inProgress') },
          ],
        },
        pickerOptions: {
          disabledDate: this.disabledDate,
        },
      }
    },
    props: {
      details: {},
    },
    computed: {
      id() {
        return this.$route.query.id
      },
    },
    mounted() {
      this.getExamList()
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getExamList()
      },
      disabledDate(val) {
        return moment(val).valueOf() > moment().add(1, 'year').valueOf()
      },
      getExamList() {
        let param = {
          page: this.pagination.page,
          size: this.pagination.size,
          studentId: this.details.id || '',
          studentUserId: this.details.userId || '',
          year: this.form.schoolYear,
        }
        this.loading = true
        getExamRecords(param)
          .then((res) => {
            this.tableData = res.data.content
            this.pagination.total = res.data.totalPages
            this.loading = false
          })
          .catch((e) => {
            this.loading = false
          })
      },
      // 导出列表
      async Export() {
        this.loadingExport = true
        await Api.examExport({
          studentId: this.details.id,
        }).catch(() => {
          this.loadingExport = false
        })
        this.loadingExport = false
      },
      toPage(row, name) {
        this.$router.push({
          name,
          query: {
            records_id: row.id,
          },
        })
      },
      // 跳转到试卷页
      toExam(row) {
        let params = this.$route.params
        this.$router.push({
          path: `${params.recordId}/examRecordsPaper`,
          query: {
            id: row.id,
            records_id: this.id,
            examName: row.name,
            duration: row.duration,
          },
        })
      },
      // 跳转到成绩单
      toExamReport(row) {
        let params = this.$route.params
        this.$router.push({
          path: `${params.recordId}/examRecordsReport`,
          query: {
            records_id: this.id,
            id: row.id,
          },
        })
      },
      sum(objectiveQuestionScore, subjectiveQuestionScore) {
        let sum = (Number(subjectiveQuestionScore) + Number(objectiveQuestionScore)).toFixed(2)
        return Number(sum)
      },
      formatType({ cellValue }) {
        return cellValue == 'FORMAL' ? this.$t('table.formalExam') : this.$t('table.examMock')
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatPassType({ cellValue }) {
        if (cellValue == 'FAILED') {
          return this.$t('status.filled')
        } else if (cellValue == 'PASS') {
          return this.$t('status.pass')
        }
      },
      formatStatus({ cellValue }) {
        if (cellValue == 'FINISHED') {
          return this.$t('status.finished')
        } else if (cellValue == 'NOT_STARTED') {
          return this.$t('status.notStarted')
        } else if (cellValue == 'MISSED') {
          return this.$t('status.missed')
        } else {
          return this.$t('status.inProgress')
        }
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.examPaper'),
            event: () => {
              this.toExam(row)
            },
          },
          {
            name: this.$t('button.reportCard'),
            event: () => {
              this.toExamReport(row)
            },
          },
        ]
      },
    },
  }
</script>
