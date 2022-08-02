<template>
  <VxeTable
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    v-model:form="form"
    :toolbar-config="tableTools"
    @handlePageChange="handleCurrentChange"
  >
    <template #name="{ row }">
      <span v-html="row.name" class="question-title" />
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  import { getExamRecordQuestionsStats } from '/@/api/ftm/teacher/examCenter'
  import { deleteEmptyParams } from '/@/utils/index'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { VxeTable },
    data() {
      return {
        loading: false,
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: 'startDate',
          order: 'desc',
          year: undefined,
          examTypeId: undefined,
          createdBy: undefined,
        },
        confidentialList: [
          { id: 'PUBLIC', name: this.$t('status.publicQuestionBank') },
          { id: 'CONFIDENTIAL', name: this.$t('status.confidentialQuestionBank') },
        ],
        tableTools: {
          enabled: false,
          perfect: true,
          slots: {},
        },
        tableData: [],
        tableColumns: [],
        tableColumns1: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          {
            field: 'name',
            title: this.$t('table.question'),
            minWidth: 120,
            slots: { default: 'name' },
          },
          {
            field: 'difficulty',
            title: this.$t('table.quesDifficulty'),
            formatter: this.formatDifficulty,
            width: 140,
          },
          { field: 'creator.name', title: this.$t('table.creator'), width: 160 },
          { field: 'type', title: this.$t('table.type'), formatter: this.formatType, width: 140 },
          { field: 'questionScore', title: this.$t('table.score'), width: 140 },
          { field: 'correctCountScore', title: this.$t('table.averageScore'), width: 140 },
          {
            field: 'correctRate',
            title: this.$t('table.scorRate'),
            formatter: this.formatPassRate,
            width: 140,
          },
        ],
        tableColumns2: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          {
            field: 'name',
            title: this.$t('table.question'),
            minWidth: 120,
            slots: { default: 'name' },
            align: 'left',
          },
          {
            field: 'difficulty',
            title: this.$t('table.quesDifficulty'),
            formatter: this.formatDifficulty,
            width: 140,
          },
          { field: 'creator.name', title: this.$t('table.creator'), width: 160 },
          { field: 'type', title: this.$t('table.type'), formatter: this.formatType, width: 140 },
          { field: 'studentCount', title: this.$t('table.answerQuestionsNum'), width: 140 },
          { field: 'correctCountScore', title: this.$t('table.rightPeopleNum'), width: 140 },
          {
            field: 'correctRate',
            title: this.$t('table.rightRate'),
            formatter: this.formatPassRate,
            width: 140,
          },
        ],
      }
    },
    props: ['id'],
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    mounted() {
      this.form.createdBy = this.userInfo.userId
      this.getExams()
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getExams()
      },
      getExams() {
        this.tableColumns = []
        this.tableColumns = this.id == '1' ? this.tableColumns1 : this.tableColumns2
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        this.form.examId = this.$route.query.examId
        this.form.obSubType = this.id == '1' ? 'SUBJECTIVE' : 'OBJECTIVE' // OBJECTIVE, SUBJECTIVE
        this.form.startDate = new Date(this.$route.query.startDate)
        this.form.endDate = new Date(this.$route.query.endDate)
        getExamRecordQuestionsStats(this.form).then((res) => {
          if (res.status == 200) {
            this.tableData = res.data.content
            this.form.total = res.data.totalElements
            this.loading = false
          }
        })
      },
      formatPassRate({ cellValue }) {
        return cellValue ? (Number(cellValue) * 100).toFixed(2) + '%' : 0
      },
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd HH:mm:ss')
      },
      formatDifficulty({ cellValue }) {
        // EASIEST, EASY, HARD, HARDEST, NORMAL
        switch (cellValue) {
          case 'EASIEST':
            return this.$t('status.veryEasy')
            break
          case 'EASY':
            return this.$t('status.simple')
            break
          case 'HARD':
            return this.$t('status.hard')
            break
          case 'HARDEST':
            return this.$t('status.hardest')
            break
          case 'NORMAL':
            return this.$t('status.normal')
            break
          default:
            return this.$t('status.normal')
            break
        }
      },
      formatType({ cellValue }) {
        if (cellValue == 'SINGLE_CHOICE') {
          return this.$t('status.singleChoiceQuestions')
        } else if (cellValue == 'MULTIPLE_CHOICES') {
          return this.$t('status.multipleChoiceQuestions')
        } else if (cellValue == 'JUDEGE') {
          return this.$t('status.judgmentQuestions')
        } else if (cellValue == 'QA') {
          return this.$t('status.questionAndAnswer')
        } else if (cellValue == 'FILL_BLANK') {
          return this.$t('status.completion')
        } else if (cellValue == 'INDEFINITE_CHOICES') {
          return this.$t('status.uncertainOptions')
        }
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      formatStatus({ cellValue }) {
        if (cellValue == 'EXAMING') {
          return this.$t('status.inProgress')
        } else if (cellValue == 'FINISHED') {
          return this.$t('status.finished')
        } else {
          return this.$t('status.notStarted')
        }
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.getExams()
      },
    },
  }
</script>
<style lang="scss">
  .question-title {
    word-break: break-word;
    img {
      max-height: 60px;
    }
  }
</style>
