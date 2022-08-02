<template>
  <div class="examPaperView">
    <el-row>
      <el-col :span="8">
        <div class="examPaperViewLeft">
          <div class="title">
            <div class="name">
              <span>{{ $t('table.examinee') }}：</span>{{ name }}
            </div>
            <div class="date">
              <span>{{ $t('table.examDurationMinutes') }}：</span>{{ duration }}
            </div>
          </div>
          <div class="subjectBox" v-for="(item, index) in questions" :key="index">
            <div class="examName">
              <el-divider direction="vertical" />
              <span>{{ formatType(item.type) }}</span>
            </div>
            <ul class="serialNumberBox">
              <li
                class="serialNumber"
                v-for="(kItem, kIndex) in item.questions"
                :key="kIndex"
                @click="clickView(item.type, kIndex)"
              >
                <el-badge :is-dot="kItem.marked">
                  <el-button
                    class="share-button share"
                    :type="kItem.answers !== '' && kItem.answers !== null ? 'primary' : 'info'"
                    :class="{
                      'is-red': kItem.questionScore != kItem.score,
                    }"
                    >{{ kIndex + 1 }}</el-button
                  >
                </el-badge>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="examPaperViewRight">
          <el-scrollbar style="width: 100%; height: 100%">
            <div v-if="questions.length !== 0">
              <div class="title">{{ examName }}</div>
              <div class="num">
                <span>
                  <el-divider direction="vertical" />{{ formatNum(questionInfo.index + 1) }}</span
                >
                <span
                  >{{ $t('table.score') }}： {{ questionInfo.questionScore
                  }}{{ $t('supplement.score') }}</span
                >
                <span>
                  <el-icon
                    class="starIcon"
                    :style="{ color: questionInfo.marked ? '#D44949' : '#215EBE' }"
                    ><StarFilled
                  /></el-icon>
                </span>
              </div>
              <div
                :class="[
                  questionInfo.name.search('<img') !== -1 ? 'ql-editor-custom' : '',
                  'subjectCon',
                ]"
              >
                <span class="stem">{{ $t('table.stem') }}</span>
                <span class="subject w-e-text" v-html="questionInfo.name" />
              </div>
              <!-- 选项 -->
              <div
                v-if="
                  questionInfo.type == 'MULTIPLE_CHOICES' ||
                  questionInfo.type == 'SINGLE_CHOICE' ||
                  questionInfo.type == 'JUDEGE'
                "
                :class="[
                  questionInfo.name.search('<img') !== -1 ? 'ql-editor-custom' : '',
                  'subjectCon',
                ]"
              >
                <span class="stem">{{ $t('table.options') }}</span>
              </div>
              <div
                :class="[item.name.search('<img') !== -1 ? 'ql-editor-custom' : '', 'options']"
                v-for="(item, index) in questionInfo.options"
                :key="item.index"
              >
                <strong>{{ formatOption(index) }}. </strong>
                <div class="t w-e-text" v-html="item.name" />
              </div>
              <!-- 考生答案 -->
              <div
                :class="[
                  questionInfo.answers.length !== 0 &&
                  questionInfo.answers[0].name.search('<img') !== -1
                    ? 'ql-editor-custom'
                    : '',
                  'answer',
                ]"
                style="color: #215ebe"
              >
                <span class="stem" style="display: inline-block; margin-right: 10px">{{
                  $t('table.examineeKey')
                }}</span>
                <span
                  v-if="
                    (questionInfo.type == 'FILL_BLANK' || questionInfo.type == 'QA') &&
                    questionInfo.studentAnswers &&
                    questionInfo.studentAnswers.length
                  "
                  class="success"
                  v-html="questionInfo.studentAnswers[0].name"
                />
                <span
                  class="success"
                  v-for="(kItem, kIndex) in questionInfo.studentAnswers"
                  :key="kIndex"
                  v-else
                  >{{ formatOption(kItem.name) }}</span
                >
              </div>
              <!-- 正确答案 -->
              <div
                :class="[
                  questionInfo.answers.length !== 0 &&
                  questionInfo.answers[0].name.search('<img') !== -1
                    ? 'ql-editor-custom'
                    : '',
                  'answer',
                ]"
                style="color: #215ebe"
              >
                <span class="stem" style="display: inline-block; margin-right: 10px">{{
                  $t('table.rightKey')
                }}</span>
                <span
                  v-if="questionInfo.type == 'FILL_BLANK' || questionInfo.type == 'QA'"
                  class="success w-e-text"
                  v-html="questionInfo.answers[0].name"
                />
                <span
                  class="success"
                  v-for="(kItem, kIndex) in questionInfo.answers"
                  :key="kIndex"
                  v-else
                  >{{ formatOption(kItem.name) }}</span
                >
              </div>
              <!-- 考生得分 -->
              <div
                v-if="
                  !(
                    questionInfo.type == 'MULTIPLE_CHOICES' ||
                    questionInfo.type == 'SINGLE_CHOICE' ||
                    questionInfo.type == 'JUDEGE' ||
                    questionInfo.type == 'INDEFINITE_CHOICES'
                  )
                "
                :class="[
                  questionInfo.answers.length !== 0 &&
                  questionInfo.answers[0].name.search('<img') !== -1
                    ? 'ql-editor-custom'
                    : '',
                  'answer',
                ]"
                style="color: #215ebe"
              >
                <span class="stem" style="display: inline-block; margin-right: 10px">{{
                  $t('table.examineeScore')
                }}</span>
                <span class="success">{{ questionInfo.score }}{{ $t('supplement.score') }}</span>
                <span class="success"
                  >{{ $t('supplement.maxScore') }}：{{ questionInfo.questionScore
                  }}{{ $t('supplement.score') }}</span
                >
              </div>
            </div>
          </el-scrollbar>
          <div class="footer">
            <el-button
              type="primary"
              plain
              v-if="questions.length !== 0 && questions[0].questions[0].id !== questionInfo.id"
              @click="lastQuestion(questionInfo.type, questionInfo.index)"
              >{{ $t('table.previousQuestion') }}</el-button
            >
            <el-button
              type="primary"
              plain
              v-if="
                questions.length !== 0 &&
                questions[questions.length - 1].questions[
                  questions[questions.length - 1].questions.length - 1
                ].id !== questionInfo.id
              "
              @click="nextQuestion(questionInfo.type, questionInfo.index)"
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
  import { getExamRecordsIdQuestions } from '/@/api/ftm/teacher/examCenter'
  import { StarFilled } from '@element-plus/icons-vue'
  export default {
    name: 'examPaperView',
    components: { StarFilled },
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
          iIndex: 0,
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
    computed: {},
    methods: {
      getExamRecordsIdQuestions() {
        const data = {
          id: this.id,
          showAnswer: true,
        }
        getExamRecordsIdQuestions(data).then((res) => {
          if (res.status == 200) {
            this.questions = res.data
            this.$nextTick(() => {
              // 默认第一选项选中
              this.questions.forEach((v, i) => {
                v.questions.forEach((k, ki) => {
                  if (i == 0 && ki == 0) {
                    k.active = true
                    this.clickView(v.type, 0)
                  }
                })
              })
            })
          }
        })
      },
      clickView(type, index) {
        this.questions.forEach((v, vi) => {
          v.questions.forEach((k, ki) => {
            k.active = false
            if (v.type == type && ki == index) {
              k.active = true
              this.questionInfo = k
              this.questionInfo.index = ki
              this.questionInfo.iIndex = vi
              console.log(this.questionInfo.answers)
            }
          })
        })
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
          const length = this.questions[nowQuestion.index - 1].questions.length
          this.questionInfo = this.questions[nowQuestion.index - 1].questions[length - 1]
          this.questionInfo.index = length - 1
        } else {
          this.questionInfo = data[nowQuestion.iIndex - 1]
          this.questionInfo.index = nowQuestion.iIndex - 1
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
        } else {
          if (nowQuestion.index <= this.questions.length) {
            this.questionInfo = this.questions[nowQuestion.index + 1].questions[0]
            this.questionInfo.index = 0
          }
        }
      },
      goBack() {
        this.$router.go(-1)
      },
      formatType(cellValue) {
        if (cellValue == 'SINGLE_CHOICE') {
          // 单选题
          return this.$t('status.singleChoiceQuestions')
        } else if (cellValue == 'MULTIPLE_CHOICES') {
          // 多选题
          return this.$t('status.multipleChoiceQuestions')
        } else if (cellValue == 'JUDEGE') {
          // 判断题
          return this.$t('status.judgmentQuestions')
        } else if (cellValue == 'QA') {
          // 问答题
          return this.$t('status.questionAndAnswer')
        } else if (cellValue == 'FILL_BLANK') {
          // 填空题
          return this.$t('status.completion')
        } else if (cellValue == 'INDEFINITE_CHOICES') {
          // 不确定选项
          return this.$t('status.uncertainOptions')
        }
      },
      // 数字转换为ABCD
      formatOption(str) {
        let num = Number(str)
        if (str == null || typeof str == 'undefined' || str === '') {
          return ''
        } else if (Number.isNaN(num)) {
          return str
        } else {
          return String.fromCharCode(65 + num)
        }
      },
      formatNum(num) {
        return this.$t('supplement.QuestionNumber').replace(/\{num\}/g, num)
      },
    },
  }
</script>

<style scoped lang="scss">
  $textBg: #dee7f5;
  $elButtonBg: #215ebe;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .examPaperView {
    padding: 16px;
    background: #fff;
    .el-row,
    .el-col {
      height: 100%;
    }
    .examPaperViewLeft {
      height: 100%;
      overflow: auto;
      background: #fff;
      position: relative;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      .title {
        position: sticky;
        top: 0;
        z-index: 2;
        padding: 16px;
        min-height: 54px;
        display: flex;
        justify-content: space-between;
        background: #fff;
        .name {
          // margin-bottom: 8px;
          font-size: 16px;
          // font-weight: bold;
          // word-break: keep-all;
          span {
            font-weight: 700;
            color: #333;
          }
        }
        .date {
          font-size: 16px;
          // opacity: 0.85;
          // word-break: keep-all;
          span {
            font-weight: 700;
            color: #333;
          }
        }
      }
      .subjectBox {
        .examName {
          height: 44px;
          line-height: 44px;
          background: $textBg;
          color: $elButtonBg;
          font-size: 14px;
          padding: 0 16px;
          font-weight: 700;
          .el-divider--vertical {
            margin-left: 0;
            width: 2px;
            height: 12px;
            vertical-align: unset;
            background: $elButtonBg;
          }
        }
        .serialNumberBox {
          background: #fff;
          padding-left: 16px;
          padding-top: 16px;
          padding-bottom: 16px;
          display: flex;
          flex-wrap: wrap;
          .serialNumber {
            width: 30px;
            height: 30px;
            border-radius: 4px;
            line-height: 30px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            margin-right: 24px;
            margin-bottom: 12px;
            cursor: pointer;
          }
        }
      }
      .is-red {
        background-color: #e27575;
        border-color: #e27575;
      }
    }
    .examPaperViewRight {
      height: 100%;
      margin-left: 16px;
      overflow: auto;
      background: #fff;
      position: relative;
      border: 1px solid #e6e6e6;
      border-radius: 4px;
      :deep(img) {
        max-width: 500px;
        vertical-align: text-top;
      }
      .title {
        height: 54px;
        line-height: 54px;
        background: #fff;
        font-size: 16px;
        text-align: center;
        font-weight: 700;
        color: #333;
      }
      .num {
        // height: 54px;
        // line-height: 54px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 44px;
        background: $textBg;
        color: $elButtonBg;
        padding: 0 16px;
        font-weight: 700;
        .el-divider--vertical {
          margin-left: 0;
          width: 2px;
          height: 12px;
          vertical-align: unset;
          background: $elButtonBg;
        }
        .starIcon {
          font-size: 28px;
          margin-right: 24px;
          cursor: pointer;
        }
      }
      .subjectCon {
        margin: 24px 16px;
        line-height: 30px;
        // padding:0 24px;
        background: #fff;
        // line-height: 20px;
        // display: flex;
        // align-items: center;
        .stem {
          display: inline-block;
          padding: 0 10px;
          // min-width: 54px;
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
      }
      .options {
        display: flex;
        align-items: center;
        margin: 0 20px 20px 82px;
        strong {
          display: inline;
        }
        .t {
          flex: 1;
        }
      }
      .answer {
        font-size: 14px;
        background: #fff;
        padding: 0 16px;
        // height: 30px;
        display: flex;
        // align-items: center;
        margin-top: 20px;
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
          white-space: nowrap;
        }
      }
      .footer {
        text-align: right;
        position: absolute;
        bottom: 20px;
        right: 16px;
      }
    }
    .bkg1 {
      background: #215ebe;
    }
    .bkg2 {
      background: #d44949;
    }
    .bkg3 {
      box-shadow: inset 2px 2px 4px #fff;
    }
  }
  .examPaperViewLeft::-webkit-scrollbar {
    display: none;
  }
  .examPaperViewRight::-webkit-scrollbar {
    display: none;
  }
  .success {
    font-size: 20px;
    color: #215ebe;
    padding-left: 20px;
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
<style>
  .share {
    width: 36px !important;
    height: 36px !important;
    text-align: center !important;
    padding: 0 !important;
  }
</style>
