<template>
  <div class="examPaperView">
    <div class="examPaperTitle">
      <span>{{ examName }}</span>
      <el-button
        class="floatBtn"
        type="primary"
        size="mini"
        :loading="loadingFinish"
        @click="putStudentAnswers(questionInfo.type, questionInfo.index, 'FINISHED')"
        >{{ $t('button.SubmitExam') }}</el-button
      >
    </div>
    <el-row>
      <el-col :span="8">
        <div class="examPaperViewLeft" :style="{ height }">
          <div class="title">
            <div class="name">
              <span>{{ $t('table.timeLeftToAnswerQuestions') }}：</span
              >{{ secondToDate(totalTime) }}
            </div>
          </div>
          <div class="subjectViewCon">
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
                      :class="{
                        filled: kItem.actived,
                        actived: questionInfo.type == item.type && questionInfo.id == kItem.id,
                      }"
                      >{{ kIndex + 1 }}</el-button
                    >
                  </el-badge>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="examPaperViewRight" :style="{ height }">
          <div class="scrollbar" v-if="questions.length !== 0">
            <div class="num">
              <span>
                <el-divider direction="vertical" />{{ formatNum(questionInfo.index + 1) }}</span
              >
              <span>{{ $t('table.score') }}： {{ questionInfo.questionScore }}</span>
              <span>
                <el-icon
                  class="starIcon"
                  @click="signClick(questionInfo)"
                  :style="{ color: questionInfo.marked ? '#D44949' : '#215EBE' }"
                  :title="$t('button.markPrompt')"
                  ><StarFilled
                /></el-icon>
              </span>
            </div>
            <div class="subjectCon">
              <span class="stem">{{ $t('table.stem') }}</span>
              <span class="subject view w-e-text" v-html="questionInfo.name" />
            </div>
            <div class="subjectCon">
              <span class="stem" v-if="questionInfo.options && questionInfo.options.length">{{
                $t('table.options')
              }}</span>
              <span
                class="stem"
                v-else-if="questionInfo.type == 'FILL_BLANK' || questionInfo.type == 'QA'"
                >{{ $t('table.answer') }}</span
              >
            </div>
            <ul class="options select">
              <template v-for="(item, index) in questionInfo.options">
                <li
                  v-if="questionInfo.type == 'SINGLE_CHOICE' || questionInfo.type == 'JUDEGE'"
                  :key="index"
                >
                  <el-radio
                    v-model="questionInfo.answers"
                    :label="item.number"
                    :key="index"
                    @change="radioChange"
                    >{{ formatOption(index) }}.
                    <div class="inline view w-e-text" v-html="item.name"
                  /></el-radio>
                </li>
                <li
                  v-if="
                    questionInfo.type == 'MULTIPLE_CHOICES' ||
                    questionInfo.type == 'INDEFINITE_CHOICES'
                  "
                  :key="index"
                >
                  <el-checkbox v-model="questionInfo.answers" :label="item.number"
                    >{{ formatOption(index) }}.
                    <div class="inline view w-e-text" v-html="item.name"
                  /></el-checkbox>
                </li>
              </template>
            </ul>
            <div class="options">
              <div
                v-if="questionInfo.type == 'FILL_BLANK' || questionInfo.type == 'QA'"
                style="width: 100%"
              >
                <editor
                  ref="Editor"
                  class="editor-area"
                  :content="questionInfo.answers"
                  @input="
                    (html) => {
                      questionInfo.answers = html
                    }
                  "
                  :autosize="{ minRows: 1 }"
                />
              </div>
            </div>
            <div class="footer" v-if="questions.length !== 0">
              <span
                class="tip"
                v-show="
                  !(
                    questions.length !== 0 &&
                    questions[questions.length - 1].questions[
                      questions[questions.length - 1].questions.length - 1
                    ].id !== questionInfo.id
                  )
                "
              >
                {{ $t('tip.lastQuestionTip') }}
              </span>
              <el-button
                type="primary"
                v-if="questions.length !== 0 && questions[0].questions[0].id !== questionInfo.id"
                @click="handleStep(questionInfo.type, questionInfo.index, 'PREV')"
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
                @click="handleStep(questionInfo.type, questionInfo.index, 'NEXT')"
                >{{ $t('table.nextQuestion') }}</el-button
              >
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 预览图片 -->
    <el-image-viewer
      v-if="showViewer"
      :on-close="
        () => {
          showViewer = false
        }
      "
      :url-list="[previewUrl]"
    />
    <vxe-modal
      :title="$t('button.preview')"
      :lock-view="false"
      :lock-scroll="false"
      :mask="false"
      :transfer="true"
      :zIndex="1002"
      :esc-closable="true"
      :resize="true"
      v-model="showMover"
    >
      <img class="previe-img" :src="[previewUrl]" alt="" />
    </vxe-modal>

    <!-- 离开页面提示框 -->
    <el-dialog
      width="400px"
      top="30vh"
      center=""
      v-model="leaveVisible"
      :title="$t('tip.tip')"
      class="notice-dialog"
      @closed="
        () => {
          leaveSecond = 0
        }
      "
    >
      <p>{{ $t('tip.examLeaveTip').replace(/{s}/, 10 - this.leaveSecond) }}</p>
      <template #footer>
        <el-button class="btn" type="primary" @click="leaveVisible = false">{{
          $t('button.confirm')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import XEUtils from 'xe-utils'
  import {
    getExamRecordsIdQuestions,
    getExamRecordsId,
    putExamRecordsId,
    putExamRecordQuestionsId,
  } from '/@/api/ftm/teacher/exam'
  import editor from '/@/components/Editor/index.vue'
  import { StarFilled } from '@element-plus/icons-vue'
  import moment from 'moment'
  import axios from 'axios'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useI18n } from 'vue-i18n'
  const userStore = useFtmUserStore()
  const ShieldFuc = function (e) {
    // 屏蔽事件
    e.preventDefault && e.preventDefault()
    return false
  }
  const ShieldConfig = setInterval(() => {
    // 防止打开控制台
    debugger
  }, 200)
  const ShieldF12 = function (e) {
    // 屏蔽f12
    if (e.keyCode == 123) {
      e.preventDefault()
      return false
    }
  }
  export default {
    name: 'examPaperView',
    data() {
      return {
        id: undefined,
        name: '',
        examName: '',
        duration: 0,
        questions: [],
        totalTime: 0,
        timer: null,
        questionInfo: {
          name: '',
          id: 0,
          index: 0,
          options: [],
          answers: [],
          studentAnswers: [],
          iIndex: 0,
        },
        showMover: false,
        showViewer: false,
        previewUrl: '',
        leaveTimer: null,
        leaveCount: 0,
        leaveVisible: false,
        leaveSecondTimer: null,
        leaveSecond: 0,
        svgStr: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
        <text x="0" y="200" text-anchor="middle" fill="#ccc" fill-opacity="0.3" transform="rotate(-45, 30 0)" style="font-size: 30px;">{content}</text>
      </svg>`,
        loadingFinish: false,
      }
    },
    created() {
      this.id = this.$route.query.id
      this.duration = Number(this.$route.query.duration)
      this.examName = this.$route.query.examName
      this.getExamRecordsId()
      this.getExamRecordsIdQuestions()
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      height() {
        return '100%'
      },
    },
    components: {
      editor,
      StarFilled,
    },
    setup() {
      const { locale } = useI18n()
      return {
        locale,
      }
    },
    methods: {
      getExamRecordsIdQuestions() {
        getExamRecordsIdQuestions({
          id: this.id,
          showAnswer: false,
        }).then((res) => {
          if (res.status == 200) {
            this.questions = res.data
            this.$nextTick(() => {
              // 默认第一选项选中
              if (res.data.length !== 0) {
                this.questions.forEach((v, i) => {
                  v.questions.forEach((k, ki) => {
                    if (v.type == 'MULTIPLE_CHOICES' || v.type == 'INDEFINITE_CHOICES') {
                      k.answers = []
                      if (k.studentAnswers.length !== 0) {
                        k.studentAnswers.forEach((j) => {
                          k.answers.push(j.name)
                        })
                        k.actived = true
                      }
                    } else {
                      if (k.studentAnswers.length == 0) {
                        k.answers = ''
                      } else {
                        k.actived = true
                        k.studentAnswers.forEach((j) => {
                          if (v.type == 'FILL_BLANK' || v.type == 'QA') {
                            k.answers = j.name
                          } else {
                            k.answers = j.name
                          }
                        })
                      }
                    }
                    // 开发模式下替换问题图片路径
                    if (import.meta.env.MODE === 'development') {
                      const url = import.meta.env.VITE_BASE_API_FTM + ''
                      const replaceURL = function (str) {
                        return str.replace(/\<img src=('|").+?('|")\>/gi, (s) => {
                          return s.replace(/\//, url.substr(0, url.length - 7))
                        })
                      }
                      k.name = replaceURL(k.name)
                      k.options.forEach((option) => {
                        option.name = replaceURL(option.name)
                      })
                    }

                    if (i == 0 && ki == 0) {
                      this.clickView(v.type, 0)
                    }
                  })
                })
                this.bindImagesPreview()
              }
            })
          }
        })
      },
      async clickView(type, index) {
        if (this.questionInfo.id) {
          // 先提交答案
          if (
            this.questionInfo.type == 'MULTIPLE_CHOICES' ||
            this.questionInfo.type == 'INDEFINITE_CHOICES'
          ) {
            if (this.questionInfo.answers.length !== 0) {
              await this.putStudentAnswers(this.questionInfo.type)
            }
          } else {
            if (this.questionInfo.answers !== null && this.questionInfo.answers !== '') {
              await this.putStudentAnswers(this.questionInfo.type)
            }
          }
          this.questions.forEach((v, vi) => {
            v.questions.forEach((k, ki) => {
              if (v.type == type && ki == index) {
                this.questionInfo = k
                this.questionInfo.index = ki
                this.questionInfo.iIndex = vi
                return false
              }
            })
          })
          this.bindImagesPreview()
        } else {
          // 如果是第一次点击题目
          this.questions.forEach((v, vi) => {
            v.questions.forEach((k, ki) => {
              if (v.type == type && ki == index) {
                this.questionInfo = k
                this.questionInfo.index = ki
                this.questionInfo.iIndex = vi
                return false
              }
            })
          })
        }

        this.$nextTick(() => {
          if (this.questionInfo.type == 'QA' || this.questionInfo.type == 'FILL_BLANK') {
            console.log(this.questionInfo)
            this.$refs.Editor.setHtml(
              this.questionInfo.studentAnswers instanceof Array &&
                this.questionInfo.studentAnswers.length > 0 &&
                this.questionInfo.studentAnswers[0].name
                ? this.questionInfo.studentAnswers[0].name
                : '',
            )
          }
        })
      },
      async handleStep(type, index, status) {
        await this.putStudentAnswers(type, index, status)
        this.$nextTick(() => {
          if (this.questionInfo.type == 'QA' || this.questionInfo.type == 'FILL_BLANK') {
            this.$refs.Editor.setHtml(
              this.questionInfo.studentAnswers instanceof Array &&
                this.questionInfo.studentAnswers.length > 0 &&
                this.questionInfo.studentAnswers[0].name
                ? this.questionInfo.studentAnswers[0].name
                : '',
            )
          }
        })
      },
      signClick(info) {
        // 标记
        const data = {
          id: this.questionInfo.id,
          marked: !this.questionInfo.marked,
        }
        putExamRecordQuestionsId(data).then((res) => {
          if (res.status == 200) {
            info.marked = data.marked
          }
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
        this.bindImagesPreview()
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
        this.bindImagesPreview()
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
        return num == null || typeof num == 'undefined' || num === ''
          ? ''
          : String.fromCharCode(65 + Number(num))
      },
      putExamRecordsId() {
        putExamRecordsId({ id: this.id, status: 'EXAMING' })
          .then((res) => {
            if (res.status == 200) {
              this.beginCountDown()
            } else {
              this.$message.error(res.data.msg)
              this.$router.back()
            }
          })
          .catch((err) => {
            this.$message.error(err)
            this.$router.back()
          })
      },
      getExamRecordsId() {
        getExamRecordsId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            const URL = `${import.meta.env.VITE_BASE_API_FTM}/public/currentTime`
            axios
              .get(URL, {
                headers: {
                  Authorization: 'Basic aHVheXVleGluZzpodWF5dWV4aW5n',
                  'Accept-Language': this.locale,
                },
              })
              .then((res1) => {
                if (res1.status == 200) {
                  if (res.data.status == 'NOT_STARTED') {
                    // 1.获取考试时间开始倒计时 2.告诉服务器开始考试
                    this.totalTime = this.toMilliseconds(this.duration)
                    this.putExamRecordsId()
                  } else {
                    let startDate = XEUtils.timestamp(res.data.startDate)
                    let newTime = XEUtils.timestamp(res1.data)
                    // 考试时间 - （当前时间 - 开始时间）
                    this.totalTime = this.toMilliseconds(this.duration) - (newTime - startDate)
                    this.beginCountDown()
                  }
                }
              })
          }
        })
      },
      radioChange(val) {
        this.questionInfo.answers = val
        // this.questions[this.questionInfo.iIndex].questions[this.questionInfo.index].answers = val
      },
      async putStudentAnswers(type, index, status) {
        // 提交答案
        const data = {
          id: this.questionInfo.id,
          studentAnswers: [],
        }
        // 多选题 不定向选择
        if (
          this.questionInfo.type == 'MULTIPLE_CHOICES' ||
          this.questionInfo.type == 'INDEFINITE_CHOICES'
        ) {
          this.questionInfo.answers.forEach((v) => {
            data.studentAnswers.push({
              name: v + '',
            })
          })
        } else {
          data.studentAnswers.push({
            name: this.questionInfo.answers + '',
          })
        }
        // var [err, res] = await to(putExamRecordQuestionsId(data))
        // if(err) return
        // if (res.status == 200) {
        // 按循序排序提交答案
        data.studentAnswers.sort(
          (prev, next) => String(prev.name).charCodeAt() - String(next.name).charCodeAt(),
        )
        //提交
        let setExam = async () => {
          let result = await to(putExamRecordQuestionsId(data))
          let [err, res] = result
          this.questions.forEach((question) => {
            if (question.type == type) {
              let targetIndex = question.questions.findIndex((item) => item.id == data.id)
              if (targetIndex > -1) {
                question.questions.find((item) => item.id == data.id).studentAnswers =
                  data.studentAnswers
              }
              if (!err && res.status == 200 && targetIndex > -1) {
                // 提交答题成功，标记试题
                if (data.studentAnswers.length > 0) {
                  question.questions.find((item) => item.id == data.id).actived = true
                } else {
                  question.questions.find((item) => item.id == data.id).actived = false
                }
              }
            }
          })
          return result
        }
        if (status == 'FINISHED') {
          var [err, res] = await to(getExamRecordsIdQuestions({ id: this.id, showAnswer: false }))
          if (err) return
          let data = res.data
          let studentAnswer = []
          data.forEach((classify) => {
            studentAnswer = studentAnswer.concat(classify.questions)
          })
          let overExam = () => {
            this.loadingFinish = true
            putExamRecordsId({
              id: this.id,
              status: 'FINISHED',
            })
              .then((res) => {
                this.loadingFinish = false
                if (res.status == 200) {
                  this.$router.replace('/myJob/myExam/teaching')
                } else {
                  this.$message.error(res.data.msg)
                }
              })
              .catch(() => {
                this.loadingFinish = false
              })
          }
          if (
            studentAnswer.some((item) => item.studentAnswers.length < 1) &&
            this.questionInfo.answers.length == 0
          ) {
            // 提前交卷
            this.$confirm(this.$t('tip.handInTheTestPaperEarly'), this.$t('tip.tip'), {
              type: 'warning',
            })
              .then(async () => {
                let [err] = await setExam()
                if (!err) overExam()
              })
              .catch()
          } else {
            // 提示交卷
            this.$confirm(this.$t('tip.handInTheTestPaperTip'), this.$t('tip.tip'), {
              type: 'warning',
            }).then(async () => {
              let [err] = await setExam()
              if (!err) overExam()
            })
          }
        } else if (status == 'PREV') {
          // 上一题
          if (
            (this.questionInfo.answers instanceof Array && this.questionInfo.answers.length > 0) ||
            (this.questionInfo.answers instanceof Array == false &&
              !!this.questionInfo.answers === true)
          ) {
            await setExam()
          }
          this.lastQuestion(type, index)
        } else {
          // 下一题
          if (
            (this.questionInfo.answers instanceof Array && this.questionInfo.answers.length > 0) ||
            (this.questionInfo.answers instanceof Array == false &&
              !!this.questionInfo.answers === true)
          ) {
            await setExam()
          }
          if (index !== undefined) {
            this.nextQuestion(type, index)
          }
        }
        // }
      },
      beginCountDown() {
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.timer = setInterval(() => {
          this.totalTime -= 1000
          if (this.totalTime <= 0) {
            this.totalTime = 0
            clearInterval(this.timer)
            this.timer = null

            // 考试结束 showClose
            this.$alert(this.$t('tip.examFinishTip'), this.$t('tip.tip'), {
              confirmButtonText: this.$t('button.confirm'),
              showClose: false,
              callback: (action) => {
                this.$router.replace('/myJob/myExam/teaching')
              },
            })
            return
          } else if (this.totalTime == 1000) {
            // 考试结束前1s提交
            this.questionInfo.id && this.clickView()
          }
        }, 1000)
      },
      toMilliseconds(time) {
        if (time > 0) {
          return time * 60 * 1000
        }
      },
      secondToDate(data) {
        var time = Number(data) / 1000
        var h = Math.floor(time / 3600)
        var m = Math.floor((time % 3600) / 60)
        var s = parseInt(time % 3600) % 60
        var hh = h < 10 ? '0' + h : h
        var mm = m < 10 ? '0' + m : m
        var ss = s < 10 ? '0' + s : s
        return hh + ':' + mm + ':' + ss
      },
      formatAnswer(data) {
        if (data == null) {
          return false
        } else if (data && data.length == 0) {
          return false
        } else if (data == '') {
          return false
        } else {
          return true
        }
      },
      // 格式化计数
      formatNum(num) {
        let str = this.$t('supplement.QuestionNumber')
        return str.replace(/(\{num\})/g, num)
      },
      // 绑定图片放大事件
      bindImagesPreview() {
        this.$nextTick(() => {
          let type = this.questionInfo.type
          document.querySelectorAll('.view img').forEach((imgDOM) => {
            imgDOM.addEventListener('click', (event) => {
              event.preventDefault()
              this.previewUrl = imgDOM.src
              if (type == 'QA' || type == 'FILL_BLANK') {
                this.showMover = true
              } else {
                this.showViewer = true
              }
            })
          })
        })
      },
      ShieldLeave() {
        // 页面离开
        this.leaveVisible = true
        this.leaveSecond = 0
        this.leaveSecondTimer = setInterval(() => {
          this.leaveSecond++
          if (this.leaveSecond >= 10) {
            clearInterval(this.leaveSecondTimer)
          }
        }, 1000)

        this.leaveTimer = setTimeout(() => {
          this.leaveCount++
          function setExam() {
            this.$router.replace('/myJob/myExam/teaching')
            this.$message.warning(this.$t('tip.tipSubExamViolation'))
          }
          if (this.leaveCount > 2) {
            putExamRecordsId({ id: this.id, status: 'FINISHED' })
              .then(() => {
                setExam.call(this)
              })
              .catch(() => {
                setExam.call(this)
              })
          } else {
            this.$msgbox({
              type: 'error',
              title: this.$t('tip.tip'),
              message: this.$t('tip.tipExamViolation').replace(/\{count\}/g, this.leaveCount),
              callback: () => {
                this.leaveVisible = false
              },
            }).then()
          }
        }, 1000 * 10)
      },
      removeShieldLeave() {
        clearTimeout(this.leaveTimer)
        this.leaveTimer = null
        clearInterval(this.leaveSecondTimer)
      },
    },
    beforeCreate() {
      debugger
      let body = document.body || document.documentElement
      body.addEventListener('contextmenu', ShieldFuc)
      body.addEventListener('dragstart', ShieldFuc)
      body.addEventListener('copy', ShieldFuc)
      body.addEventListener('cut', ShieldFuc)
      body.addEventListener('keydown', ShieldF12)
    },
    mounted() {
      // 添加水印
      let watermarkName = `${this.userInfo.name} ${moment().format('YYYY-MM-DD')}`
      let watermark = `url("data:image/svg+xml;base64,${window.btoa(
        unescape(encodeURIComponent(this.svgStr.replace(/\{content\}/g, watermarkName))),
      )}")`
      document.querySelector('.examPaperViewLeft').style.backgroundImage = watermark
      document.querySelector('.examPaperViewRight').style.backgroundImage = watermark
      // window.addEventListener('blur', this.ShieldLeave)
      // window.addEventListener('focus', this.removeShieldLeave)
    },
    beforeUnmount() {
      clearInterval(ShieldConfig)
      this.leaveCount = 0
      let body = document.body || document.documentElement
      body.removeEventListener('contextmenu', ShieldFuc)
      body.removeEventListener('dragstart', ShieldFuc)
      body.removeEventListener('copy', ShieldFuc)
      body.removeEventListener('cut', ShieldFuc)
      body.removeEventListener('keydown', ShieldF12)
      window.removeEventListener('blur', this.ShieldLeave)
      window.removeEventListener('focus', this.removeShieldLeave)
    },
    unmounted() {
      clearInterval(this.timer)
      this.timer = null
      this.totalTime = 0
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
    background: #fff;
    .examPaperTitle {
      position: relative;
      height: 28px;
      padding-bottom: 16px;
      box-sizing: content-box;
      font-size: 20px;
      line-height: 28px;
      text-align: center;
      font-weight: bold;
      color: #333;
      background: #fff;
      .floatBtn {
        position: absolute;
        right: 0;
        width: 74px;
      }
    }
    .examPaperViewLeft {
      overflow: auto;
      position: relative;
      border: 1px solid #e6e6e6;
      background-color: #fff;
      background-repeat: repeat;
      .title {
        position: sticky;
        top: 0;
        padding: 12px 16px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: $elButtonBg;
        background: $textBg;
        z-index: 10;
        .name {
          font-size: 16px;
          font-weight: bold;
          &::before {
            content: '';
            display: inline-block;
            width: 2px;
            height: 12px;
            margin-right: 12px;
            background: $elButtonBg;
          }
          span {
            font-weight: bold;
          }
        }
        .date {
          font-size: 16px;
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
          padding-left: 16px;
          padding-top: 16px;
          padding-bottom: 16px;
          display: flex;
          flex-wrap: wrap;
          .serialNumber {
            // width: 30px;
            // height: 30px;
            // border-radius: 4px;
            // line-height: 30px;
            // text-align: center;
            // color: #fff;
            // font-size: 14px;
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
      margin-left: 16px;
      overflow: auto;
      background: #fff;
      position: relative;
      border: 1px solid #e6e6e6;
      :deep(img) {
        max-width: 300px;
        max-height: 300px;
        cursor: pointer;
        vertical-align: text-top;
      }

      .num {
        position: sticky;
        top: 0;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 44px;
        background: $textBg;
        color: $elButtonBg;
        padding: 0 16px;
        font-weight: 700;
        z-index: 12;
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
        .stem {
          display: inline-block;
          padding: 0 16px;
          height: 26px;
          border: 1px solid #215ebe;
          line-height: 26px;
          font-size: 12px;
          color: #215ebe;
          margin-right: 15px;
          border-radius: 4px;
          border: 1px solid #215ebe;
          background: #fff;
        }
        .subject {
          font-size: 16px;
          font-weight: bold;
          user-select: none;
          img {
            vertical-align: text-top;
          }
        }
      }
      .subjectInfo {
        margin-left: 54px;
      }
      .options {
        // font-size: 14px;
        // background: #fff;
        // padding: 0 24px;
        margin: 0 20px 20px 82px;
        div {
          display: flex;
          align-items: baseline;
        }
        .editor-area,
        .editor-area div {
          display: block;
        }
        :deep(.el-checkbox__label) {
          display: flex;
          white-space: normal;
          vertical-align: top;
          p {
            margin: 0;
            display: inline;
          }
        }
        &.select {
          padding-left: 0;
          word-break: break-all;
          line-height: 20px;
          user-select: none;
          :deep(.el-radio) {
            display: flex;
            align-items: center;
            width: 100%;
            white-space: unset;
          }
          :deep(.el-radio__label) {
            display: flex;
            align-items: center;
            flex: 1;
          }
          :deep(.el-checkbox__input),
          :deep(.el-radio__input) {
            float: left;
            margin-top: 2px;
          }

          li {
            margin-bottom: 10px;
          }
        }
        :deep(.ql-editor-class) {
          width: 100%;
          background: #fff;
        }

        .inline {
          display: block;
          flex: 1;
          overflow: hidden;
        }
        :deep(.view img) {
          max-width: 200px;
          max-height: 100px;
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
          min-width: 54px;
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
      }
      .scrollbar {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: auto;
      }
      .footer {
        display: flex;
        margin-top: 50px;
        padding: 0 20px 0 10px;
        height: 50px;
        align-items: center;
        justify-content: flex-end;
        .tip {
          margin-right: 20px;
        }
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
    > .el-row {
      height: calc(100% - 44px);
      > .el-col {
        height: 100%;
      }
    }
  }
  .examPaperViewLeft::-webkit-scrollbar {
    display: none;
  }
  .subjectViewCon::-webkit-scrollbar {
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
  .previe-img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
  .share {
    width: 36px !important;
    height: 36px !important;
    text-align: center !important;
    padding: 0 !important;
    color: #215ebe;
    border-color: #215ebe;
    &.filled {
      color: #215ebe;
      border-color: #dee7f5;
      background: #dee7f5;
    }
    &.actived {
      color: #fff;
      border-color: #215ebe;
      background: #215ebe;
    }
  }
  .examPaperViewRight .el-radio {
    margin-right: 2px !important;
  }
</style>
