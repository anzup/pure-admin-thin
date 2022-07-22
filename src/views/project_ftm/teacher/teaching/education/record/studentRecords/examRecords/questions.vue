<template>
  <div class="questions-item" ref="print">
    <ul class="personInfo">
      <li class="schoolReportInfo">
        <span class="name">{{ $t('table.examCategory') }}：</span
        ><span class="content">{{ questionsInfo.name }}</span>
      </li>
      <li class="schoolReportInfo">
        <span class="name">{{ $t('table.nameOfCandidates') }}：</span
        ><span class="content">{{ questionsInfo.studentName }}</span>
      </li>
      <li class="schoolReportInfo">
        <span class="name">{{ $t('table.examDurationMinutes') }}：</span
        ><span class="content">{{ questionsInfo.limitDuration }}</span>
      </li>
      <li class="schoolReportInfo">
        <span class="name">{{ $t('table.examinationTime') }}：</span
        ><span class="content">{{ questionsInfo.examTime }}</span>
      </li>
      <li class="schoolReportInfo">
        <span class="name">{{ $t('table.setQuestionsTeachers') }}：</span
        ><span class="content">{{ questionsInfo.teachers }}</span>
      </li>
      <li class="schoolReportInfo">
        <span class="name">{{ $t('table.examScores') }}：</span
        ><span class="content">{{ questionsInfo.totalScore }}</span>
      </li>
      <li class="schoolReportInfo">
        <span class="name">{{ $t('table.examResults') }}：</span
        ><span class="content">{{ questionsInfo.passType }}</span>
      </li>
      <li class="schoolReportInfo">
        <span class="name">{{ $t('table.limitDuration') }}：</span
        ><span class="content">{{ questionsInfo.duration }}</span>
      </li>
    </ul>
    <div class="subjectBox" v-for="(item, index) in tableData" :key="index">
      <div class="subjectTitle">
        <div style="display: flex; width: 100%">
          <span class="serialNumber">{{ index + 1 }}</span>
          <span class="subjectType">{{ formatData(item.type, typeList) }}</span>
          <span class="degree"
            >{{ $t('table.difficultyOfQuestionType') }}：{{
              formatData(item.difficulty, difficultyList)
            }}</span
          >
          <span class="degree"
            >{{ $t('table.importance') }}：{{ formatData(item.importance, importanceList) }}</span
          >
        </div>
      </div>
      <div class="subjectCon">
        <div class="subject">
          <span v-html="item.name" />
        </div>
        <div class="options">
          <div class="option" v-for="(iItem, iIndex) in item.options" :key="iIndex">
            {{ formatOption(iIndex) }}.<span v-html="iItem.name" />
          </div>
          <div class="successOption">
            {{ $t('common.Submitted') }}:
            <span
              v-if="item.type == 'FILL_BLANK' || item.type == 'QA'"
              class="success"
              v-html="(item.studentAnswers[0] || {}).name"
            />
            <span
              class="success"
              v-for="(kItem, kIndex) in item.studentAnswers"
              :key="kIndex"
              v-else
              >{{ formatOption(kItem.name) }}</span
            >
          </div>
          <div class="successOption">
            {{ $t('common.CorrectAnswer') }}:
            <span
              v-if="item.type == 'FILL_BLANK' || item.type == 'QA'"
              class="success"
              v-html="item.answers[0].name"
            />
            <span class="success" v-for="(kItem, kIndex) in item.answers" :key="kIndex" v-else>{{
              formatOption(kItem.name)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getExamRecordsId, getExamRecordsIdQuestions } from '/@/api/ftm/teacher/examCenter'
  import html2pdf from 'html2pdf.js'
  import XEUtils from 'xe-utils'
  import { getStyle } from '/@/utils/index'
  import to from 'await-to-js'
  export default {
    props: {
      questionBankId: [Number, String],
      name: String,
    },
    data() {
      return {
        activeName: '',
        questionsInfo: {},
        typeList: [
          { id: 'FILL_BLANK', name: this.$t('status.completion') },
          { id: 'INDEFINITE_CHOICES', name: this.$t('status.uncertainOptions') },
          { id: 'JUDEGE', name: this.$t('status.judgmentQuestions') },
          { id: 'MULTIPLE_CHOICES', name: this.$t('status.multipleChoiceQuestions') },
          { id: 'SINGLE_CHOICE', name: this.$t('status.singleChoiceQuestions') },
          { id: 'QA', name: this.$t('status.questionAndAnswer') },
        ],
        importanceList: [
          { id: 'LESS_IMPORTANT', name: this.$t('status.lessImportant') },
          { id: 'UNIMPORTANT', name: this.$t('status.unimportant') },
          { id: 'NORMAL', name: this.$t('status.normal') },
          { id: 'IMPORTANT', name: this.$t('status.important') },
          { id: 'MOST_IMPORTANT', name: this.$t('status.mostImportant') },
        ],
        difficultyList: [
          { id: 'EASIEST', name: this.$t('status.lessImportant') },
          { id: 'EASY', name: this.$t('status.unimportant') },
          { id: 'NORMAL', name: this.$t('status.normal') },
          { id: 'HARD', name: this.$t('status.hard') },
          { id: 'HARDEST', name: this.$t('status.hardest') },
        ],
        tableData: [],
      }
    },
    mounted() {
      this.getExamsIdQuestions()
    },
    methods: {
      // 数字转换为ABCD
      formatOption(num) {
        return String.fromCharCode(65 + Number(num))
      },
      formatData(val, arr) {
        if (!val) {
          return false
        }
        return arr.filter((v) => v.id == val)[0].name
      },
      formatPassType(cellValue) {
        if (cellValue == 'PASS') {
          return this.$t('status.qualified')
        } else if (cellValue == 'FAILED') {
          return this.$t('status.unqualified')
        }
      },
      sendToMinute(val) {
        var minutes = Math.floor(val / 60000)
        var seconds = ((val % 60000) / 1000).toFixed(0)
        if (seconds <= 0) {
          return minutes + this.$t('common.minutes')
        } else {
          return (
            minutes +
            this.$t('common.minutes') +
            (seconds < 10 ? '0' : '') +
            seconds +
            this.$t('common.second')
          )
        }
      },
      async getExamsIdQuestions() {
        let [err, res] = await to(getExamRecordsId({ id: this.questionBankId }))
        if (!err) {
          let questionsInfo = {}
          questionsInfo.name = res.data.exam.name
          questionsInfo.duration = (res.data.exam.duration || 0) + this.$t('common.minutes')
          let startDate = XEUtils.toDateString(res.data.exam.startDate, 'yyyy-MM-dd HH:mm:ss')
          let endDate = XEUtils.toDateString(res.data.exam.endDate, 'yyyy-MM-dd HH:mm:ss')
          questionsInfo.time = `${startDate} ~ ${endDate}`
          questionsInfo.studentName = res.data.student.name
          let limitDuration =
            XEUtils.timestamp(res.data.endDate) - XEUtils.timestamp(res.data.startDate)
          questionsInfo.limitDuration = this.sendToMinute(limitDuration)
          questionsInfo.examTime = XEUtils.toDateString(res.data.startDate, 'yyyy-MM-dd HH:mm:ss')
          questionsInfo.totalScore = res.data.totalScore
          questionsInfo.passType = this.formatPassType(res.data.passType)
          questionsInfo.signUuid = res.data.teacherSignature
          if (res.data.exam && res.data.exam.creator) {
            questionsInfo.teachers = res.data.exam.creator.name
          }
          this.questionsInfo = questionsInfo
        }
        getExamRecordsIdQuestions({ id: this.questionBankId, showAnswer: true }).then((res) => {
          if (res.status == 200) {
            this.tableData = res.data.reduce((pre, cur) => {
              return pre.concat(cur.questions)
            }, [])
            this.$nextTick(async () => {
              let opt = {
                margin: 0.4,
                filename: 'myfile.pdf',
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' },
                pagebreak: {},
              }
              let W = this.$refs.print.offsetWidth
              let H = (W / 594) * 841
              let count_H = 0,
                page_dom = document.createElement('div')
              page_dom.style.overflow = 'hidden'
              let allPages = [...this.$refs.print.childNodes]
              let domPages = []

              allPages.forEach((page, index) => {
                if (
                  page.offsetHeight ||
                  getStyle(page, 'marginTop') ||
                  getStyle(page, 'marginBottom')
                ) {
                  let page_H =
                    page.offsetHeight +
                    parseInt(getStyle(page, 'marginTop')) +
                    parseInt(getStyle(page, 'marginBottom'))
                  if (count_H + page_H >= H) {
                    count_H = page_H
                    domPages.push(page_dom.outerHTML)
                    page_dom = document.createElement('div')
                    page_dom.style.overflow = 'hidden'
                    page_dom.append(page.cloneNode(true))
                    if (index == allPages.length - 1) {
                      domPages.push(page_dom.outerHTML)
                    }
                  } else {
                    count_H += page_H
                    page_dom.append(page.cloneNode(true))
                    if (index == allPages.length - 1) {
                      domPages.push(page_dom.outerHTML)
                    }
                  }
                }
              })

              // console.log(domPages)
              var worker = html2pdf().set(opt)
              domPages.forEach((page, index) => {
                worker = worker
                  .from(page)
                  .toContainer()
                  .toCanvas()
                  .toPdf()
                  .get('pdf')
                  .then((pdf) => {
                    if (index < domPages.length - 1) {
                      // dont add last blank page
                      pdf.addPage()
                    }
                  })
              })
              worker.get('pdf').then((pdfObj) => {
                const pdf = pdfObj.output('arraybuffer')
                this.$emit('finishPaper', pdf)
              })

              // this.$htmlToPdf().set(opt).from(this.$refs.print).to('pdf').get('pdf').then(async (pdfObj) => {

              // })
            })
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .personInfo {
    display: flex;
    flex-wrap: wrap;
    padding: 0 32px;
    span {
      font-size: 12px;
    }
  }
  .schoolReportInfo {
    display: inline-block;
    width: 25%;
    font-size: 14px;
    margin-top: 12px;
    line-height: 1.5;
    .name {
      font-weight: bold;
    }
    .content {
      color: #000;
    }
  }
  .subjectBox {
    margin-bottom: 15px;
    :deep(img) {
      max-width: 500px;
    }
    .subjectTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      background: #fafafa;
      padding: 0 32px;
      .serialNumber {
        width: 30px;
        height: 24px;
        background: #215ebe;
        color: #fff;
        text-align: center;
        font-size: 16px;
        line-height: 24px;
      }
      .subjectType {
        color: #215ebe;
        border: 1px solid #215ebe;
        height: 24px;
        padding: 0 6px;
        text-align: center;
        font-size: 14px;
      }
      .iconBox {
        float: right;
        .editIcon {
          color: #215ebe;
          font-size: 24px;
          margin-right: 10px;
          cursor: pointer;
        }
        .deleteIcon {
          color: #d44949;
          font-size: 24px;
          cursor: pointer;
        }
      }
      .degree {
        font-size: 14px;
        font-weight: bold;
        margin-left: 20px;
        line-height: 24px;
      }
    }
    .subjectCon {
      width: 100%;
      font-weight: bold; // 为什么不用flex 浮动 考虑移动端换行 第二行处于中间位置
      font-size: 0; // 为了消除span的边距
      line-height: 24px;
      padding-left: 60px;
      .subject {
        font-size: 14px;
        // margin: 20px 0;
        display: flex;
        align-items: center;
      }
      .enclosure {
        color: #215ebe;
        font-size: 14px;
        margin-left: 20px;
      }
    }
  }

  .options {
    .option {
      font-size: 14px;
      // line-height: 32px;
      display: flex;
      align-items: center;
    }
    .successOption {
      font-size: 14px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      .success {
        font-size: 20px;
        color: #215ebe;
        padding-left: 20px;
      }
    }
    .optionSelect {
      background: #e6f7ff;
    }
  }

  .titleBox {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    div {
      width: 25%;
    }
    .title {
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .spacing {
    font-style: normal;
    display: inline-block;
    margin-right: 8px;
    margin-left: 8px;
  }
  .warningBox {
    margin-left: auto;
    display: block;
    flex: 1;
    text-align: right;
    .warningIcon {
      font-size: 24px;
      cursor: pointer;
    }
    .warningIcon:hover {
      color: #215ebe;
    }
  }
</style>
