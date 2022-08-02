<template>
  <VxeTable v-if="examInfo" :columns="tableColumn" :data="tableData">
    <template #form>
      <div class="warp-content-table">
        <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td>{{ $t('table.templateName') }}</td>
            <td>{{ examInfo.name }}</td>
            <td>{{ $t('table.examPaperToTalScore') }}</td>
            <td>{{ examInfo.totalScore }}</td>
            <td>{{ $t('table.passScore') }}</td>
            <td>{{ examInfo.passScore }}</td>
          </tr>
          <tr>
            <td>{{ $t('table.multipleChoiceQuestionBank') }}</td>
            <td colspan="5">{{ examInfo.questionBanks.map((item) => item.name).join(',') }}</td>
          </tr>
        </table>
      </div>
    </template>
    <template #pager />
  </VxeTable>
  <div class="container" v-loading="true" v-else />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import to from 'await-to-js'
  import { getpExamTemplate } from '/@/api/ftm/teacher/examCenter'
  export default {
    components: { VxeTable },
    data() {
      return {
        examInfo: null,
        questionBanks: [],
        tableColumn: [
          { title: this.$t('table.questionBankType'), field: 'type', formatter: this.formatType },
          { title: this.$t('table.totalScore'), field: 'totalScore' },
          { title: this.$t('table.singleQuestionScore'), field: 'score' },
        ],
        tableData: [
          { type: 'SINGLE_CHOICE', totalScore: '', score: '' },
          { type: 'MULTIPLE_CHOICES', totalScore: '', score: '' },
          { type: 'JUDEGE', totalScore: '', score: '' },
          { type: 'QA', totalScore: '', score: '' },
          { type: 'FILL_BLANK', totalScore: '', score: '' },
          { type: 'INDEFINITE_CHOICES', totalScore: '', score: '' },
        ],
      }
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        let { id } = this.$route.params
        let [err, res] = await to(getpExamTemplate({ id }))
        if (!err) {
          this.examInfo = res.data
          // 组装表头
          res.data.questionBanks.forEach((k, ki) => {
            this.tableColumn.push({
              title: k.name,
              field: `count${ki}`,
              id: k.id,
            })

            // 组装选项
            this.tableData.forEach((v, vi) => {
              k.questionTypeCounts.forEach((j) => {
                if (v.type == j.type) {
                  v[`count${ki}`] = j.count
                }
              })
            })
          })

          res.data.questionTypeConfigs.forEach((v) => {
            this.tableData.forEach((k) => {
              if (k.type == v.type) {
                k.totalScore = v.totalScore
                k.score = v.questionScore
              }
            })
          })
        }
      },
      // 格式化题型
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
    },
  }
</script>

<style scoped>
  @import '/@/style/table.scss';
  .warp-content-table {
    padding-bottom: 20px;
  }
</style>
