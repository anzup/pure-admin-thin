<template>
  <div class="examPaperView">
    <el-row>
      <el-col :span="10">
        <div class="examPaperViewLeft" :style="{ height: scrollerHeight }">
          <div class="title">
            <div class="name">{{ $t('table.examinee') }}：{{ name }}</div>
            <div class="date">
              {{ $t('table.objectiveQuestionScores') }}:{{ examScoreCount(1) }}
            </div>
            <div class="date">
              {{ $t('table.subjectiveQuestionScores') }}:{{ examScoreCount(2) }}
            </div>
            <div class="date">{{ $t('table.examPaperToTalScore') }}：{{ examScoreCount() }}</div>
          </div>
          <div class="subjectBox" v-for="(item, index) in questions" :key="index">
            <div v-if="item.type == 'FILL_BLANK' || item.type == 'QA'">
              <div class="examName">{{ formatType(item.type) }}</div>
              <ul class="serialNumberBox">
                <li
                  class="serialNumber"
                  v-for="(kItem, kIndex) in item.questions"
                  :key="kIndex"
                  @click="clickView(item.type, kIndex)"
                >
                  <div
                    class="serialNumberInfo"
                    :style="{ background: kItem.active ? '#EEEEEE' : '#fff' }"
                  >
                    <el-button
                      class="share-button share"
                      :class="{
                        filled:
                          kItem.score && kItem.questionScore >= kItem.score && kItem.score >= 0,
                        actived: kItem.active,
                      }"
                      >{{ kIndex + 1 }}</el-button
                    >
                    <div class="questionScore">
                      {{ kItem.questionScore }}{{ $t('supplement.score') }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="examPaperViewRight" :style="{ height: scrollerHeight }">
          <div class="title">
            <span>{{ examName }}</span>
            <el-button
              class="floatBtn"
              type="primary"
              @click="putExamRecordQuestionsId(questionInfo.type, questionInfo.index, 'FINISHED')"
              >{{ $t('button.submit') }}</el-button
            >
          </div>
          <div class="num">{{ formatScore(questionInfo.index + 1) }}</div>
          <div
            :class="[
              questionInfo.name.search('<img') !== -1 ? 'ql-editor-custom' : '',
              'subjectCon',
            ]"
          >
            <span class="stem">{{ $t('table.stem') }}</span>
            <span class="subject w-e-text" v-html="questionInfo.name" />
          </div>
          <div
            :class="[item.name.search('<img') !== -1 ? 'ql-editor-custom' : '', 'options']"
            v-for="(item, index) in questionInfo.options"
            :key="item.index"
          >
            {{ formatOption(index) }}.
            <span class="w-e-text" v-html="item.name" />
          </div>
          <div
            :class="[
              questionInfo.studentAnswers.length !== 0 &&
              questionInfo.studentAnswers[0].name.search('<img') !== -1
                ? 'ql-editor-custom'
                : '',
              'answer',
            ]"
          >
            <span class="answer-label">{{ $t('table.candidatesAnswers') }}:</span>
            <span
              v-if="questionInfo.type == 'FILL_BLANK' || questionInfo.type == 'QA'"
              class="success"
            >
              <span
                class="w-e-text"
                v-if="questionInfo.studentAnswers.length !== 0"
                v-html="questionInfo.studentAnswers[0].name"
              />
            </span>
            <span
              class="success"
              v-for="(kItem, kIndex) in questionInfo.studentAnswers"
              :key="kIndex"
              v-else
              >{{ formatOption(kItem.name) }}</span
            >
          </div>
          <div
            :class="[
              questionInfo.answers.length !== 0 &&
              questionInfo.answers[0].name.search('<img') !== -1
                ? 'ql-editor-custom'
                : '',
              'answer',
            ]"
          >
            <span class="answer-label">{{ $t('table.rightKey') }}:</span>
            <span
              v-if="questionInfo.type == 'FILL_BLANK' || questionInfo.type == 'QA'"
              class="success"
            >
              <span
                class="w-e-text"
                v-if="questionInfo.answers.length !== 0"
                v-html="questionInfo.answers[0].name"
              />
            </span>
            <span
              class="success"
              v-for="(kItem, kIndex) in questionInfo.answers"
              :key="kIndex"
              v-else
              >{{ formatOption(kItem.name) }}</span
            >
          </div>

          <div class="scoreBox">
            <div class="scoreInfo">
              <el-input
                :value="questionInfo.score"
                :placeholder="$t('holder.pleaseEnter')"
                style="width: 200px"
                @input="inputQuestion(questionInfo, $event)"
              />
              <span
                >{{ $t('supplement.maxScore') }}{{ questionInfo.questionScore
                }}{{ $t('supplement.score') }}</span
              >
            </div>
            <!-- <div class="scoreCon"
              v-if="questionInfo.type == 'FILL_BLANK' || questionInfo.type == 'QA'">
                <div v-for="item in questionInfo.questionScore"
                  :key="item.index" class="scoreBtn">
                  <el-button
                  class="share-button  share"
                  type="primary"
                  @click="questionScoreClick(item)"
                  >{{item}}</el-button>
                </div>
              </div> -->
          </div>
          <div class="footer">
            <el-button
              type="primary"
              v-if="questions.length !== 0 && questions[0].questions[0].id !== questionInfo.id"
              @click="lastQuestion(questionInfo.type, questionInfo.index)"
              >{{ $t('table.previousQuestion') }}</el-button
            >
            <el-button
              type="primary"
              v-if="
                questions.length !== 0 &&
                questions[questions.length - 1].questions[
                  questions[questions.length - 1].questions.length - 1
                ].id !== questionInfo.id
              "
              @click="putExamRecordQuestionsId(questionInfo.type, questionInfo.index)"
              >{{ $t('table.nextQuestion') }}</el-button
            >
            <el-button type="primary" @click="goBack">{{ $t('button.goBack') }}</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getExamRecordsIdQuestions,
    putExamRecordQuestionsId,
  } from '/@/api/ftm/teacher/examCenter'
  export default {
    name: 'markingPaperView',
    data() {
      return {
        id: undefined,
        name: '',
        examName: '',
        duration: '',
        questions: [],
        questionInfo: {
          name: '',
          index: 0,
          options: [],
          answers: [],
          studentAnswers: [],
        },
      }
    },
    created() {
      this.id = this.$route.query.id
      this.name = this.$route.query.name
      this.examName = this.$route.query.examName
      this.duration = this.$route.query.duration
      this.getExamRecordsIdQuestions()
    },
    computed: {
      // 滚动区高度
      scrollerHeight: function () {
        return window.innerHeight - 190 + 'px'
      },
    },
    methods: {
      getExamRecordsIdQuestions() {
        getExamRecordsIdQuestions({
          id: this.id,
          showAnswer: true,
        }).then((res) => {
          if (res.status == 200) {
            this.questions = res.data
            this.$nextTick(() => {
              // 默认第一选项选中 只能是填空或问答题
              for (let i = 0; i < this.questions.length; i++) {
                let v = this.questions[i]
                if (v.type == 'FILL_BLANK' || v.type == 'QA') {
                  v.questions[0].active = true
                  this.clickView(v.type, 0)
                  break
                }
              }
            })
          }
        })
      },
      clickView(type, index) {
        // 先提交答案
        let P = new Promise((resolve) => {
          if (Number(this.questionInfo.score) > this.questionInfo.questionScore) {
            this.$message.warning(this.$t('holder.theScoreCannotBeGreaterThanTheTotalScore'))
            return false
          }
          if (this.questionInfo.type == 'FILL_BLANK' || this.questionInfo.type == 'QA') {
            const data = {
              id: this.questionInfo.id,
              score: this.questionInfo.score,
            }
            putExamRecordQuestionsId(data).then((res) => {
              if (res.status == 200) {
                resolve()
              }
            })
          } else {
            resolve()
          }
        })

        P.then(() => {
          this.questions.forEach((v, vi) => {
            v.questions.forEach((k, ki) => {
              k.active = false
              if (v.type == type && ki == index) {
                k.active = true
                this.questionInfo = k
                this.questionInfo.index = ki
                return false
              }
            })
          })
        })
      },
      questionScoreClick(val) {
        this.questionInfo.score = val
      },
      lastQuestion(type, index) {
        var nowQuestion = {
          id: undefined,
          type: '',
          index: undefined,
          iIndex: undefined,
        }
        this.questions.forEach((v, vi) => {
          v.questions.forEach((k, ki) => {
            if (v.type == type && ki == index) {
              nowQuestion.id = k.id
              nowQuestion.type = type
              nowQuestion.index = vi
              nowQuestion.iIndex = ki
            }
          })
        })
        const data = this.questions.filter((v) => v.type == nowQuestion.type)[0].questions
        if (nowQuestion.iIndex == 0) {
          // 往上个类型找
          const length = this.questions[nowQuestion.index].questions.length
          this.questionInfo = this.questions[nowQuestion.index].questions[length - 1]
          this.questionInfo.index = length - 1

          this.questions[nowQuestion.index].questions[nowQuestion.iIndex].active = false
          this.questions[nowQuestion.index].questions[length - 1].active = true
        } else {
          this.questionInfo = data[nowQuestion.iIndex - 1]
          this.questionInfo.index = nowQuestion.iIndex - 1
          this.questions[nowQuestion.index].questions[nowQuestion.iIndex].active = false
          this.questions[nowQuestion.index].questions[nowQuestion.iIndex - 1].active = true
        }
      },
      nextQuestion(type, index) {
        var nowQuestion = {
          id: undefined,
          type: '',
          index: undefined,
          iIndex: undefined,
        }
        this.questions.forEach((v, vi) => {
          v.questions.forEach((k, ki) => {
            if (v.type == type && ki == index) {
              nowQuestion.id = k.id
              nowQuestion.type = type
              nowQuestion.index = vi
              nowQuestion.iIndex = ki
            }
          })
        })
        const data = this.questions.filter((v) => v.type == nowQuestion.type)[0].questions
        if (nowQuestion.iIndex + 1 < data.length) {
          this.questionInfo = data[nowQuestion.iIndex + 1]
          this.questionInfo.index = nowQuestion.iIndex + 1

          this.questions[nowQuestion.index].questions[nowQuestion.iIndex].active = false
          this.questions[nowQuestion.index].questions[nowQuestion.iIndex + 1].active = true
        } else if (nowQuestion.index <= this.questions.length) {
          this.questionInfo = this.questions[nowQuestion.index + 1].questions[0]
          this.questionInfo.index = 0

          this.questions[nowQuestion.index].questions[nowQuestion.iIndex].active = false
          this.questions[nowQuestion.index].questions[0].active = true
        }
      },
      putExamRecordQuestionsId(type, index, status) {
        if (Number(this.questionInfo.score) > this.questionInfo.questionScore) {
          this.$message.warning(this.$t('holder.theScoreCannotBeGreaterThanTheTotalScore'))
          return false
        }
        const data = {
          id: this.questionInfo.id,
          score: this.questionInfo.score,
        }
        putExamRecordQuestionsId(data).then((res) => {
          if (res.status == 200) {
            if (status == 'FINISHED') {
              this.goBack()
            } else {
              this.nextQuestion(type, index)
            }
          }
        })
      },
      goBack() {
        this.$router.go(-1)
      },
      inputQuestion(questionInfo, val) {
        let rgt = val.toString().match(/^(([0-9])|([1-9]([0-9]+)))(\.[0-9]{0,2})?$/)
        questionInfo.score = rgt instanceof Array ? rgt[0] : val == '' ? '' : questionInfo.score
      },
      formatType(cellValue) {
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
      // 数字转换为ABCD
      formatOption(num) {
        return String.fromCharCode(65 + Number(num))
      },
      formatScore(num) {
        let str = this.$t('supplement.QuestionNumber')
        return str.replace(/\{num\}/g, num)
      },
      // 计算总分 type=1 客观题 type=2 主观题 !type 总分
      examScoreCount(type) {
        try {
          return type == 1
            ? this.questions.reduce((count, next) => {
                if (next.type != 'FILL_BLANK' && next.type != 'QA') {
                  return (
                    count +
                      next.questions.reduce(
                        (_count, _next) => _count + (Number(_next.score) || 0),
                        0,
                      ) || 0
                  )
                } else {
                  return count
                }
              }, 0)
            : type == 2
            ? this.questions.reduce((count, next) => {
                if (next.type == 'FILL_BLANK' || next.type == 'QA') {
                  return (
                    count +
                      next.questions.reduce(
                        (_count, _next) => _count + (Number(_next.score) || 0),
                        0,
                      ) || 0
                  )
                } else {
                  return count
                }
              }, 0)
            : this.questions.reduce((count, next) => {
                return (
                  count +
                    next.questions.reduce(
                      (_count, _next) => _count + (Number(_next.score) || 0),
                      0,
                    ) || 0
                )
              }, 0)
        } catch (e) {
          return 0
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .examPaperView {
    .examPaperViewLeft {
      //margin: 24px;
      // min-height: calc(100vh - 170px);
      overflow: auto;
      background: #fff;
      scrollbar-width: none;
      .title {
        padding: 13px 24px;
        min-height: 26px;
        border-radius: 2px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        background: #fff;
        line-height: 26px;
        .name {
          font-size: 16px;
          font-weight: bold;
        }
        .date {
          font-size: 14px;
          opacity: 0.85;
        }
      }
      .subjectBox {
        .examName {
          height: 54px;
          line-height: 54px;
          background: #fafafa;
          font-size: 14px;
          padding: 0 24px;
        }
        .serialNumberBox {
          background: #fff;
          padding-left: 24px;
          padding-top: 16px;
          margin-bottom: 16px;
          .serialNumber {
            margin-right: 12px;
            margin-bottom: 12px;
            border-bottom: 1px solid #e8e8e8;
            cursor: pointer;
            padding-bottom: 8px;
            .serialNumberInfo {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1px solid #e8e8e8;
              // padding-bottom: 8px;
            }
            .questionScore {
              font-size: 16px;
              color: #000;
            }
          }
        }
      }
    }
    .examPaperViewRight {
      //margin: 24px 24px 24px 0;
      margin-left: 24px;
      overflow: auto;
      background: #fff;
      position: relative;
      scrollbar-width: none;
      .title {
        height: 54px;
        line-height: 54px;
        background: #fff;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        .floatBtn {
          float: right;
          margin-top: 9px;
          margin-right: 10px;
        }
      }
      .num {
        height: 54px;
        line-height: 54px;
        background: #fafafa;
        font-size: 14px;
        padding-left: 24px;
      }
      .subjectCon {
        margin: 10px 0 10px 24px;
        // padding:0 24px;
        background: #fff;
        // line-height: 20px;
        // display: flex;
        // align-items: center;
        .stem {
          padding: 0 10px;
          height: 24px;
          border: 1px solid #215ebe;
          line-height: 24px;
          text-align: center;
          font-size: 14px;
          color: #215ebe;
          display: inline-block;
          margin-right: 15px;
        }
        .subject {
          font-size: 16px;
          font-weight: bold;
          img {
            vertical-align: text-top;
          }
        }
        :deep(img) {
          max-width: 500px;
          object-fit: cover;
          vertical-align: text-top;
        }
      }
      .options {
        // font-size: 14px;
        // background: #fff;
        // padding: 0 24px;
        // height: 30px;
        // line-height: 30px;
        // display: flex;
        // align-items: center;
        margin-left: 20px;
        :deep(img) {
          max-width: 500px;
          object-fit: cover;
        }
      }
      .answer {
        margin-bottom: 10px;
        font-size: 14px;
        background: #fff;
        padding: 0 24px;
        // height: 30px;
        display: flex;
        align-items: flex-start;
        .success {
          flex: 1;
        }
        .answer-label {
          display: inline-block;
          margin-right: 10px;
          white-space: nowrap;
        }
        :deep(p) {
          margin: 0;
        }
        :deep(img) {
          max-width: 500px;
          object-fit: cover;
        }
      }
      .scoreBox {
        font-size: 14px;
        padding: 0 24px;
        .scoreInfo {
          margin-bottom: 20px;
          span {
            color: #215ebe;
            display: inline-block;
            margin-left: 20px;
          }
        }
        .scoreBtn {
          margin-right: 12px;
          margin-bottom: 12px;
        }
        .scoreCon {
          display: flex;
          flex-wrap: wrap;
          height: 100px;
          overflow: auto;
        }
      }
      .footer {
        // position: absolute;
        // right: 20px;
        // bottom: 20px;
        text-align: right;
        margin-right: 20px;
        margin-bottom: 20px;
      }
    }
  }
  .examPaperViewLeft::-webkit-scrollbar {
    display: none;
  }
  .examPaperViewRight::-webkit-scrollbar {
    display: none;
  }
  .scoreCon::-webkit-scrollbar {
    display: none;
  }
  .ql-editor-custom {
    // height: 150px !important;
    // overflow-y: auto;
    // display: inline-block;
    // scrollbar-width:none;
    // margin-bottom: 10px;
  }
  .ql-editor-custom::-webkit-scrollbar {
    // display: none;
  }
</style>
<style lang="scss" scoped>
  .share {
    width: 46px !important;
    height: 38px !important;
    text-align: center !important;
    padding: 0 !important;
    color: #ee6c6c;
    border-color: #ee6c6c;
    &:hover {
      background: #fbeaea;
    }
    &.filled {
      color: #ee6c6c;
      border-color: #fbeaea;
      background: #fbeaea;
    }
    &.actived {
      color: #fff;
      border-color: #ee6c6c;
      background: #ee6c6c;
    }
  }
</style>
