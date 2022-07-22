<template>
  <div class="schoolReport-main container" ref="print">
    <div
      class="schoolReport-wrap"
      v-for="(questionsInfo, qIndex) in questions"
      :key="qIndex"
      :class="{
        mini: computCount(qIndex) > 200,
        small: computCount(qIndex) > 100 && computCount(qIndex) <= 200,
        medium: computCount(qIndex) > 50 && computCount(qIndex) <= 100,
        large: computCount(qIndex) <= 50,
      }"
    >
      <div class="schoolReport-logo">
        <img :src="imgSrc" v-if="imgSrc" />
      </div>
      <div class="headerTitle">
        <span>{{ $t('table.customCompany') }}{{ $t('common.ExamResult') }}</span>
      </div>
      <div class="schoolReportBox">
        <div class="personInfo warp-content-table">
          <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td>{{ $t('table.examName') }}:</td>
              <td>{{ questionsInfo.name }}</td>
              <td>{{ $t('table.name') }}:</td>
              <td>{{ questionsInfo.studentName }}</td>
              <td>{{ $t('table.examDate') }}:</td>
              <td>{{ questionsInfo.examTime }}</td>
            </tr>
            <tr>
              <td>{{ $t('table.examiners') }}:</td>
              <td>{{ questionsInfo.teachers }}</td>
              <td>{{ $t('table.examScores') }}:</td>
              <td>{{ questionsInfo.totalScore }}</td>
              <td>{{ $t('table.examResults') }}:</td>
              <td>{{ questionsInfo.passType }}</td>
            </tr>
          </table>
        </div>

        <div
          class="choiceQuestionBox"
          v-for="(item, index) in questionsInfo.answer || []"
          :key="index"
        >
          <div class="type">
            <span class="typeName">
              <el-divider direction="vertical" />
              <span>{{ formatType(item.type) }}</span>
            </span>
            <span class="remark" v-if="item.type == 'FILL_BLANK' || item.type == 'QA'">{{
              $t('common.NumberAndStudentAnswer')
            }}</span>
            <span class="remark" v-else>{{ $t('common.NumberAndAnswer') }}</span>
            <span>{{ $t('table.examineeScore') }}: {{ computScore(item) }}</span>
          </div>
          <ul
            class="choiceQuestionInfo unflex"
            v-if="item.type == 'FILL_BLANK' || item.type == 'QA'"
          >
            <li class="fillBlankAnswers" v-for="(kItem, kIndex) in item.questions" :key="kIndex">
              <!-- <span>{{kIndex}}</span> -->
              <span class="serialNumber">
                <span>{{ kIndex + 1 }}</span>
              </span>
              <div
                class="studentAnswer"
                v-if="kItem.studentAnswers.length"
                v-html="formatHTML(kItem.studentAnswers[0].name)"
              />
              <div class="studentAnswer" v-else />
            </li>
          </ul>
          <ul class="choiceQuestionInfo" v-else>
            <li v-for="(kItem, kIndex) in item.questions" :key="kIndex" class="choiceQuestionCon">
              <div class="choiceQuestion">
                <span class="serialNumber">
                  <span>{{ kIndex + 1 }}</span>
                </span>
                <div class="submitAnswers">
                  <p>
                    <span
                      v-for="(vItem, vIndex) in kItem.studentAnswers"
                      :key="vIndex"
                      :class="{
                        right: kItem.answers.some((v) => v.name == vItem.name),
                        wrong: !kItem.answers.some((v) => v.name == vItem.name),
                      }"
                      >{{ formatOption(vItem.name) }}</span
                    >
                  </p>
                </div>
                <div class="successAnswers">
                  <p>
                    <span v-for="(jItem, jIndex) in kItem.answers" :key="jIndex">{{
                      formatOption(jItem.name)
                    }}</span>
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="teacherSign warp-content-table">
          <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="width: 6em; vertical-align: top">{{ $t('table.teacherSign') }}:</td>
              <td style="width: unset"><img :src="previewURL(questionsInfo.signUuid)" alt="" /></td>
            </tr>
          </table>
        </div>
      </div>

      <el-divider class="no-print" v-if="questions.length > 1 && qIndex < questions.length - 1">{{
        $t('common.divider')
      }}</el-divider
      ><!-- 分割线 -->
    </div>
  </div>
</template>

<script>
  import { getExamRecordsId, getExamRecordsIdQuestions } from '/@/api/ftm/teacher/examCenter'
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useFtmSettingsStore } from '/@/store/modules/ftmSetting'
  import { htmlToPdf } from '/@/utils/htmlToPdf'
  const settingsStore = useFtmSettingsStore()
  export default {
    name: 'SchoolReport',
    data() {
      return {
        tableData: [],
        questions: [],
        questionsInfo: {
          name: '',
          duration: '',
          time: '',
          studentName: '',
          limitDuration: '',
          examTime: '',
          totalScore: '',
          passType: '',
          teachers: '',
        },
        loading: false,
        id: undefined,
        ids: [],
      }
    },
    props: ['pid'],
    computed: {
      others() {
        return settingsStore.others
      },
      imgSrc() {
        try {
          let json = JSON.parse(this.others) || {}
          if (json.examfileUUID) {
            return json.hasOwnProperty('examfileUUID') ? previewURL(json.examfileUUID) : ''
          } else {
            throw ''
          }
        } catch (e) {
          return ''
        }
      },
    },
    created() {
      this.getExamRecordsId(this.pid)
      this.loading = true
    },
    methods: {
      previewURL,
      printEvent() {
        // this.$print(this.$refs.print)
        new this.Print({
          ids: '#PrintDOM',
          beforeOpenCallback() {},
          openCallback() {},
          closeCallback() {},
        })
      },
      async getExamRecordsId(id) {
        let [err1, res] = await to(getExamRecordsId({ id }))
        if (err1) return
        let questionsInfo = {}
        if (res.status == 200) {
          questionsInfo.id = id
          questionsInfo.name = res.data.exam.name
          questionsInfo.duration = this.sendToMinute(res.data.exam.duration * 60 * 1000)
          let startDate = XEUtils.toDateString(res.data.exam.startDate, 'yyyy-MM-dd HH:mm:ss')
          let endDate = XEUtils.toDateString(res.data.exam.endDate, 'yyyy-MM-dd HH:mm:ss')
          questionsInfo.time = `${startDate} ~ ${endDate}`
          questionsInfo.studentName = res.data.student.name
          let limitDuration =
            XEUtils.timestamp(res.data.endDate) - XEUtils.timestamp(res.data.startDate)
          questionsInfo.limitDuration = this.sendToMinute(limitDuration)
          questionsInfo.examTime = XEUtils.toDateString(res.data.startDate, 'yyyy-MM-dd')
          questionsInfo.totalScore = res.data.totalScore
          questionsInfo.passType = this.formatPassType(res.data.passType)
          questionsInfo.signUuid = res.data.teacherSignature
          if (res.data.exam && res.data.exam.creator) {
            questionsInfo.teachers = res.data.exam.creator.name
          }
          this.questions.push(questionsInfo)
        }
        let data = {
          id,
          showAnswer: true,
        }
        let [err2, res2] = await to(getExamRecordsIdQuestions(data))
        if (err2) return
        if (res2.status == 200) {
          let item = this.questions.find((v) => v.id == id)
          item.answer = res2.data
        }
        this.loading = false
        this.$nextTick(async () => {
          await htmlToPdf(this.$refs.print, '', 'arraybuffer', async (pdf) => {
            this.$emit('finish', pdf)
          })
          // this.$htmlToPdf().set(opt).from(this.$refs.print).to('pdf').get('pdf').then(async (pdfObj) => {
          //     const pdf = pdfObj.output("arraybuffer");
          //     this.$emit('finish', pdf)
          // })
        })
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
      formatPassType(cellValue) {
        if (cellValue == 'PASS') {
          return this.$t('status.qualified')
        } else if (cellValue == 'FAILED') {
          return this.$t('status.unqualified')
        }
      },
      sendToMinute(val) {
        if (Number.isNaN(val)) {
          return ''
        } else {
          var minutes = Math.ceil(val / 60000)
          return minutes + this.$t('common.minutes')
        }
      },
      getExamRecordsPagination(step) {
        if (this.loading) return
        let index = this.ids.indexOf(this.id)
        let targetIndex = index + step
        // console.log(this.ids,this.id)
        if (targetIndex < 0 || targetIndex >= this.ids.length) return
        this.id = this.ids[targetIndex]
        this.getExamRecordsId()
      },
      // 计算填空、问答题打印时相当的排版数目
      computCount(index) {
        if (this.questions[index].answer && this.questions[index].answer instanceof Array) {
          // 确定项数量
          const DETERMINE = this.questions[index].answer.reduce((count, next) => {
            if (next.type != 'FILL_BLANK' && next.type != 'QA') {
              return (count += (next.questions || []).length)
            } else {
              return count
            }
          }, 0)
          // 不确定数量
          const QUESTION_TYPE_COUNT = this.questions[index].answer.length // 已答题类数
          const HEAD_HEIGHT = 50 // 成绩单头部像素（固定）
          const CON_HEIGHT = 48 // 内容像素（固定）
          const SIGN_HEIGHT = 100 // 签字图片像素（固定）
          const TITLE_HEIGHT = 33 // 题目标题高度（固定）
          const PAGE_HEIGHT =
            parseInt(791 * (297 / 210)) -
            HEAD_HEIGHT -
            CON_HEIGHT -
            SIGN_HEIGHT -
            QUESTION_TYPE_COUNT * TITLE_HEIGHT
          const INLINE_STR = 58 // 一行显示的字数
          const INLINE_HEIGHT = 15 // 行高（固定）
          const INDETERIN_LINE = this.questions[index].answer.reduce((count, next) => {
            // 实际行数
            if (next.type == 'FILL_BLANK' || next.type == 'QA') {
              return (count += next.questions.reduce(
                (p, n) =>
                  (p +=
                    n.studentAnswers instanceof Array && n.studentAnswers.length > 0
                      ? Math.ceil(
                          (n.studentAnswers[0].name.replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '')
                            .length -
                            (n.studentAnswers[0].name.match(/\d/g) || []).length) /
                            INLINE_STR,
                        )
                      : 1),
                0,
              ))
            } else {
              return count
            }
          }, 0)
          // console.log(INDETERIN_LINE,'行数')
          let steps = [
              // 自适应阶段
              { sum: 50, num: 4, size: 'large', chooseHeight: 34, inlineMargin: 14, boxMargin: 7 },
              {
                sum: 100,
                num: 5,
                size: 'medium',
                chooseHeight: 33,
                inlineMargin: 15,
                boxMargin: 5,
              },
              { sum: 200, num: 8, size: 'small', chooseHeight: 25, inlineMargin: 13, boxMargin: 5 },
              { sum: 400, num: 10, size: 'mini', chooseHeight: 16, inlineMargin: 8, boxMargin: 2 },
            ],
            step_index = 0
          while (step_index < steps.length) {
            let i = step_index
            let INDETERIN_LINE_COUNT = this.questions[index].answer.reduce((count, next) => {
              // 问答题题数
              if (next.type == 'FILL_BLANK' || next.type == 'QA') {
                return (count += next.questions instanceof Array ? next.questions.length : 0)
              } else {
                return count
              }
            }, 0)
            let INDETERIN_ALL_LINE_HEIGHT =
              INLINE_HEIGHT * INDETERIN_LINE +
              INDETERIN_LINE_COUNT * steps[i].inlineMargin -
              steps[i].boxMargin // 问答题行高
            let DETERMINE_LINE_HEIGHT = Math.ceil(DETERMINE / steps[i].num) * steps[i].chooseHeight // 选择题行高
            // console.log(steps[i].sum + '题')
            // console.log(DETERMINE_LINE_HEIGHT, INDETERIN_ALL_LINE_HEIGHT, PAGE_HEIGHT)
            if (DETERMINE_LINE_HEIGHT + INDETERIN_ALL_LINE_HEIGHT < PAGE_HEIGHT) {
              return steps[i].sum
            }
            step_index++
          }
          return steps.pop().sum
        } else {
          return 0
        }
      },
      // 计算得分
      computScore(item) {
        const QUSETION = item.questions
        if (QUSETION instanceof Array && QUSETION.length > 0) {
          const SCORE = QUSETION.reduce((score, next) => (score += Number(next.score) || 0), 0)
          const QUESTION_SCORE = QUSETION.reduce(
            (score, next) => (score += Number(next.questionScore) || 0),
            0,
          )
          return `${SCORE}/${QUESTION_SCORE}`
        } else {
          return ''
        }
      },
      // 格式化标签
      formatHTML(innerHTML) {
        return (
          '<span class="p">' +
          innerHTML.replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '') +
          '</span>'
        )
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '/@/views/project_ftm/teacher/styles/print-report.scss';
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .schoolReport-wrap {
    position: relative;
    width: 100%;
    max-width: 1600px;
    min-width: 592px;
    padding-bottom: 40px;
    .schoolReport-logo {
      display: none;
    }
    .headerTitle {
      text-align: center;
      position: relative;
      height: 50px;
      line-height: 50px;
      // border-bottom: 1px solid #E8E8E8;
      span {
        font-size: 14px;
        font-weight: 700;
      }
      .headerBtn {
        position: absolute;
        right: 20px;
        top: -5px;
      }
    }
    .schoolReportBox {
      .personInfo {
        display: flex;
        flex-wrap: wrap;
      }
      .schoolReportInfo {
        display: inline-block;
        width: 25%;
        font-size: 14px;
        margin-top: 24px;
        line-height: 2;
        .name {
          font-weight: bold;
        }
        .content {
          color: #888;
        }
      }
    }
    .choiceQuestionBox {
      margin-top: 20px;
      .type {
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        background: $textBg;
        color: $elButtonBg;
        font-weight: 700;
        .typeName {
          display: inline-block;
          // margin-right: 24px;
          padding-left: 10px;
          .el-divider--vertical {
            width: 2px;
            height: 15px;
            vertical-align: unset;
            background: $elButtonBg;
          }
        }
        .remark {
          color: #8fafe2;
        }
      }
      .choiceQuestionInfo {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        &.unflex {
          display: block;
        }
        .choiceQuestionCon {
          width: 18%;
          margin-bottom: 20px;
          margin-left: 2%;
        }
        .choiceQuestion {
          display: flex;
          width: 100%;
          height: 36px;
          line-height: 36px;
          border: 1px solid #215ebe;
          border-radius: 4px;
          font-size: 14px;
          text-align: center;

          .serialNumber {
            display: inline-block;
            height: 35px;
            width: 36px;
            background: #215ebe;
            color: #fff;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
          }
          .submitAnswers {
            display: inline-block;
            flex: 1;
            p {
              margin: 0;
            }
            .right {
              color: #215ebe;
            }
            .wrong {
              color: red;
            }
          }
          .successAnswers {
            p {
              margin: 0;
            }
            display: inline-block;
            flex: 1;
            color: #333333;
            height: 100%;
            border-left: 1px solid #215ebe;
          }
        }
        .fillBlankAnswers {
          display: flex;
          width: 100%;
          // height: 36px;
          font-size: 14px;
          line-height: 36px;
          margin: 20px 0;
          border-radius: 4px;
          border: 1px solid #215ebe;
          .serialNumber {
            display: flex;
            width: 36px;
            // height: 100%;
            align-items: center;
            justify-content: center;
            background: #215ebe;
            color: #fff;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
          }
          .studentAnswer {
            flex: 1;
            padding: 9px 4px;
            overflow: hidden;
            word-break: break-all;
            :deep(p) {
              display: block;
              overflow: hidden;
              margin: 0;
              line-height: 18px;
              word-break: break-all;
            }
            :deep(img) {
              display: none;
            }
            :deep(h1, h2, h3, h4, h5) {
              display: inline;
            }
          }
        }
      }
    }
    .teacherSign {
      margin-top: 10px;
      display: flex;
      align-items: center;
      .info-table-box {
        td:nth-of-type(2n) {
          padding-top: 0;
          padding-bottom: 0;
        }
      }
      img {
        height: 100px;
        margin-right: 10px;
      }
    }
    .info-table-box {
      border: 0;
      td {
        background: none;
        border: 0;
        &:nth-of-type(2n + 1) {
          text-align: right;
        }
      }
    }
  }
  @include printReport;
  @media print {
    body {
      background: #fff !important;
    }
    .app-main,
    .container {
      // height: 100%;
      height: auto !important;
      padding: 0 !important;
      margin: 0 !important;
      background: #fff !important;
    }
  }
</style>
