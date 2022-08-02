<template>
  <div v-loading="loading">
    <el-scrollbar>
      <div class="questionnaire-box">
        <div class="questionnaire-title">{{ Title }}</div>
        <section
          class="questionnaire-item"
          v-for="(question, iquestion) in Record"
          :key="question.id"
        >
          <div class="questionnaire-issue">
            <span class="question"
              >【{{ typeFormat(question.type) }}】{{
                $t('common.question') + (iquestion + 1)
              }}</span
            >{{ question.name }}
          </div>
          <div class="questionnaire-area">
            <ul class="questionnaire-select" v-if="question.type != 'FILL'">
              <li v-for="(answer, ianswer) in question.answerStats" :key="ianswer">
                <p class="answer">
                  <span class="seq">{{ formatSeq(ianswer) }}</span
                  >{{ answer.name }}
                </p>
                <div class="questionnaire-progress">
                  <el-progress
                    :percentage="Number(answer.percent).toFixed(4) * 100"
                    :stroke-width="18"
                    text-inside
                  />
                  <span class="progress-txt">{{ answer.count + $t('common.ticket') }}</span>
                </div>
              </li>
            </ul>
            <template v-else>
              <div
                class="questionnaire-fill"
                v-for="(answer, ianswer) in question.answers"
                :key="ianswer"
              >
                <span class="questionnaire-label">{{
                  $t('common.answer') + (ianswer + 1) + '.'
                }}</span
                >{{ answer }}
              </div>
            </template>
          </div>
        </section>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
  import { getQuestionnairesInfo } from '/@/api/ftm/teacher/education'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        loading: false,
        Title: '',
        Record: [],
      }
    },
    created() {
      this.getDetails()
    },
    computed: {
      id() {
        return this.$route.query.q_id
      },
    },
    methods: {
      async getDetails() {
        let id = this.id
        this.loading = true
        let [err, res] = await to(getQuestionnairesInfo({ id }))
        this.loading = false
        if (!err) {
          let data = res.data.classifications
          let Record = []
          for (let i = 0; i < data.length; i++) {
            data[i].questions instanceof Array &&
              data[i].questions.forEach((question) => {
                Record.push(question)
              })
          }
          this.Record = Record
          this.Title = res.data.name
        }
      },
      selectFormat(num) {
        return (num || 0) + this.$t('common.ticket')
      },
      typeFormat(type) {
        switch (type) {
          case 'SINGLE_SELECTION':
            return this.$t('table.multipleSelect')
          case 'MULTIPLE_SELECTION':
            return this.$t('table.multipleSelect')
          case 'FILL':
            return this.$t('table.fillInTheQuestion')
          default:
            return ''
        }
      },
      formatSeq(num) {
        return String.fromCharCode(num + 65) + '.'
      },
    },
  }
</script>

<style scoped lang="scss">
  .questionnaire {
    &-box {
      max-width: 1200px;
      margin: 10px auto;
      font-size: 16px;
    }
    &-title {
      margin: 10px 0;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      line-height: 24px;
    }
    &-item {
      // border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.06);
      margin-bottom: 20px;
    }
    &-issue {
      padding: 12px 15px;
      line-height: 20px;
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      background: #dee7f5;
      .question {
        margin-right: 20px;
        color: #215ebe;
      }
    }
    &-area {
      padding: 10px;
    }
    &-select {
      padding: 0 10px;
      margin: 0;
      li {
        display: flex;
        align-items: center;
        margin: 20px 0;
        font-size: 14px;
        color: #333;
        .seq {
          display: inline-block;
          width: 30px;
        }
        .answer {
          margin: 0;
          max-width: 60%;
          margin-right: 30px;
        }
      }
    }
    &-progress {
      width: 45%;
      margin-right: 0;
      margin-left: auto;
      :deep(.el-progress) {
        width: calc(100% - 70px);
        display: inline-block;
        vertical-align: middle;
      }
      .progress-txt {
        display: inline-block;
        width: 30px;
        padding: 0 20px;
        white-space: nowrap;
        vertical-align: middle;
      }
    }
    &-fill {
      margin: 6px 0;
      padding: 6px;
      background: #f2f2f2;
      color: #333;
    }
    &-label {
      display: inline-block;
      width: 70px;
      font-weight: 700;
    }
  }
</style>
