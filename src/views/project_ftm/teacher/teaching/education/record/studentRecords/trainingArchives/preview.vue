<template>
  <div ref="main">
    <div class="flex-box">
      <!-- 飞行训练 -->
      <ul class="trining-list" v-if="$route.query.name == 'FLIGHT_EVALUATION'">
        <li
          v-for="(item, index) in triningList"
          :key="index"
          class="custom-item"
          :class="{
            active: index == activeIndex,
            error: !item.studentSignature || !item.teacherSignature,
            warning:
              item.studentSignature &&
              item.teacherSignature &&
              !Boolean(createdTrinings.find((v) => v.sourceId == item.id)),
          }"
          @click="changeTrining(item, index)"
        >
          <p class="line-txt">{{ item.name }}</p>
          <span class="status error" v-if="!item.studentSignature || !item.teacherSignature">{{
            $t('status.unsigned')
          }}</span>
          <span
            class="status warning"
            v-else-if="
              item.studentSignature &&
              item.teacherSignature &&
              !Boolean(createdTrinings.find((v) => v.sourceId == item.id))
            "
            >{{ $t('status.notGenerate') }}</span
          >
          <span class="status" v-else>{{ $t('status.generated') }}</span>
        </li>
      </ul>
      <!-- 飞行考试 -->
      <ul class="trining-list" v-if="$route.query.name == 'FLIGHT_EXAM_RECORD'">
        <li
          v-for="(item, index) in triningList"
          :key="index"
          class="custom-item"
          :class="{
            active: index == activeIndex,
            error: !item.studentSignature || !item.teacherSignature,
            warning:
              item.studentSignature &&
              item.teacherSignature &&
              !Boolean(createdTrinings.find((v) => v.sourceId == item.id)),
          }"
          @click="changeFlyExam(index)"
        >
          <p class="line-txt">{{ item.name }}</p>
          <span class="status error" v-if="!item.studentSignature || !item.teacherSignature">{{
            $t('status.unsigned')
          }}</span>
          <span
            class="status warning"
            v-else-if="
              item.studentSignature &&
              item.teacherSignature &&
              !Boolean(createdTrinings.find((v) => v.sourceId == item.id))
            "
            >{{ $t('status.notGenerate') }}</span
          >
          <span class="status" v-else>{{ $t('status.generated') }}</span>
        </li>
      </ul>
      <!-- 理论考试成绩单 -->
      <ul class="trining-list" v-if="$route.query.name == 'THEORY_EXAM_RECORD'">
        <li
          v-for="(item, index) in triningList"
          :key="index"
          class="custom-item"
          :class="{
            active: index == activeIndex,
            error: !item.isSignature,
            warning:
              item.isSignature && !Boolean(createdTrinings.find((v) => v.sourceId == item.id)),
          }"
          @click="changeTheory(index)"
        >
          <p class="line-txt">{{ item.exam.name }}</p>
          <span class="status error" v-if="!item.isSignature">{{ $t('status.unsigned') }}</span>
          <span
            class="status warning"
            v-else-if="
              item.isSignature && !Boolean(createdTrinings.find((v) => v.sourceId == item.id))
            "
            >{{ $t('status.notGenerate') }}</span
          >
          <span class="status" v-else>{{ $t('status.generated') }}</span>
        </li>
      </ul>
      <div class="flex-con" v-loading="loading" ref="print">
        <el-scrollbar style="width: 100%; height: 100%">
          <div class="scroll-con">
            <p
              class="print-inline"
              :class="{ mt40: $route.query.name == 'THEORY_PROGRESS_SHEET' }"
              data-print="no"
            >
              <!-- v-if="
                      $route.query.name == 'FLIGHT_EVALUATION' && componentProps
                      && componentProps.studentUUID && componentProps.teacherUUID
                      && !Boolean(createdTrinings.find(v => v.sourceId == componentProps.id))
                  " -->
              <el-button
                size="mini"
                class="print-button"
                v-if="ReGenerateVisible()"
                @click="regenerate"
                >{{ $t('button.reGenerate') }}</el-button
              >
            </p>
            <section ref="Section" id="Section">
              <component
                ref="Component"
                v-if="componentName"
                :is="componentName"
                :data="componentProps"
                :details="componentProps"
                :clazz="componentPropsClazz"
                :pid="componentProps"
                :studentUserid="studentUserid"
                @getData="getFinalEvaluation"
              />
            </section>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
  import signReport from '/@/views/project_ftm/teacher/components/SignReport/index.vue'
  import theory from './components/theory.vue'
  import recordOrder from '../recordOrder/index.vue'
  import flyExamDetails from '/@/views/project_ftm/teacher/myJob/teaching/flight/flightTest/details.vue'
  import theoryExam from '/@/views/project_ftm/teacher/myJob/exam/release/schoolReport.vue'

  import Api from '/@/api/ftm/teacher/trainEva'
  import { getClazzsId } from '/@/api/ftm/teacher/teachingPlan'
  import { getStudentSchedules } from '/@/api/ftm/teacher/teachingCenter'
  import {
    getStudentTrainingRecord,
    getStudentTrainingFiles,
    putStudentTrainingFiles,
    flightTrainingGetPdf,
    studentFinalGetPdf,
    flightExamGetPdf,
  } from '/@/api/ftm/teacher/studentTraining'
  import { postUpload } from '/@/api/ftm/teacher/file'
  import { dataURLtoFile } from '/@/utils/index'
  import moment from 'moment'
  import to from 'await-to-js'
  import { htmlToPdf } from '/@/utils/htmlToPdf'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        clazzId: null,
        studentId: null,
        studentUserid: null,
        recordId: null,
        typeName: '',
        activeIndex: null,
        triningList: [],
        createdTrinings: [], // 已生成的文件列表
        componentName: '',
        componentProps: undefined,
        componentPropsClazz: {},
        recordItem: {}, // 当前档案项目
        finalEvaluationInfo: {}, // 存放评估表信息
        loading: false,
        printOpt: {
          margin: 0.4,
          filename: 'myfile.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: {
            scale: 1,
            useCORS: true,
            ignoreElements: (element) => {
              if (element.dataset.print == 'no') {
                return true
              }
              return false
            },
          },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
          pagebreak: { mode: 'avoid-all', before: '#page2el' },
        },
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
    },
    components: {
      signReport,
      theory,
      recordOrder,
      flyExamDetails,
      theoryExam,
    },
    created() {
      let { name } = this.$route.query
      this.clazzId = this.$route.query.clazzId
      this.studentId = this.$route.query.studentId
      this.recordId = this.$route.query.recordId
      this.studentUserid = this.$route.query.studentUserid
      this.typeName = name
      switch (name) {
        case 'FLIGHT_EVALUATION':
          this.createFlyEvaluation()
          break
        case 'THEORY_PROGRESS_SHEET':
          this.createProgress()
          break
        case 'FINAL_EVALUATION':
          this.createFinalEvaluation()
          break
        case 'FLIGHT_EXAM_RECORD':
          this.createFlyExam()
          break
        case 'THEORY_EXAM_RECORD':
          this.createTheoryExam()
          break
      }
    },
    methods: {
      // 生成电子讲评单
      async createFlyEvaluation() {
        this.loading = true
        let params = {
          studentTrainingRecordId: this.recordId,
          type: this.$route.query.name,
        }
        let [listErr, listRes] = await to(getStudentTrainingFiles(params))
        if (listErr) return false
        let record =
          listRes.data.content instanceof Array && listRes.data.content.length > 0
            ? listRes.data.content[0]
            : {}
        this.recordItem = record
        this.createdTrinings = record.generateFiles || []
        let [recordErr, recordRes] = await to(getStudentTrainingRecord({ id: record.id }))
        this.loading = true
        if (!recordErr) {
          this.triningList = recordRes.data || []
          this.triningList.length &&
            this.getFlyEvaluationRecord(
              this.componentProps ? this.componentProps : this.triningList[0],
            )
          this.activeIndex = this.componentProps
            ? this.triningList.findIndex((v) => v.id == this.componentProps.id)
            : 0
        }
      },
      // 电子讲评单详情
      async getFlyEvaluationRecord(item) {
        this.componentName = 'signReport'
        this.loading = true
        let [err, res] = await to(Api.getFlyTrainDetails({ id: item.id }))
        this.loading = false
        if (!err) {
          let data = res.data
          let STR = data.studentTrainingRecord || {}
          let grouping = STR.grouping || {}
          let course = STR.course || {}
          const stringArr = (arr, key) =>
            arr instanceof Array ? (key ? arr.map((v) => v[key]).join(',') : arr.join(',')) : ''
          this.componentProps = {
            id: item.id,
            remark: data.remark,
            exam: data.exam,
            status: data.status,
            title: STR.clazz.course.name, // 飞行项目
            student: STR.student.name, // 学员姓名
            teacher: data.teacherName || '', // 教员
            airplaneModel: STR.clazz.airplaneType, // 飞机型号
            flyTime:
              data.status == 'FILLED'
                ? moment(data.endTime).format('YYYY-MM-DD')
                : moment().format('YYYY-MM-DD'), // 飞行时间
            course: data.name, // 课程
            result: data.result, // 结果
            evaluation: data.evaluation, // 评语
            estimate: data.estimate,
            score: data.scores, // 项目
            teacherUUID: data.teacherSignature, // 教员签名
            studentUUID: data.studentSignature, // 学员签名
            auditorUUID: data.auditorSignature,
            courseNumber: STR.clazz.courseNumber,
            version: data.syllabusItem.syllabus.version,
            trainingResultId: data.trainingResult && data.trainingResult.id,
            trainingResultName: data.trainingResult && data.trainingResult.name,
          }
        }
      },
      changeTrining(item, index) {
        if (index == this.activeIndex) return
        this.activeIndex = index
        this.getFlyEvaluationRecord(item)
      },
      // 生成进度表
      async createProgress() {
        let trainParams = {
          studentTrainingRecordId: this.recordId,
          type: this.$route.query.name,
        }
        let [listErr, listRes] = await to(getStudentTrainingFiles(trainParams))
        if (!listErr) {
          let record =
            listRes.data.content instanceof Array && listRes.data.content.length > 0
              ? listRes.data.content[0]
              : {}
          this.recordItem = record
          this.createdTrinings = record.generateFiles || []
        }

        this.componentName = 'theory'
        let [errInfo, resInfo] = await to(getClazzsId({ id: this.clazzId }))
        if (!errInfo) {
          this.componentPropsClazz.courseNumber = resInfo.data.courseNumber
          this.componentPropsClazz.name = resInfo.data.course.name
          this.componentPropsClazz.airplaneTypes = resInfo.data.airplaneType
        }

        let params = {
          page: 1,
          size: 1000,
          clazzId: this.clazzId,
          studentId: this.studentId,
          order: 'asc',
        }
        let [err, res] = await to(getStudentSchedules(params))
        if (!err) {
          this.componentProps = res.data
        }
      },
      // 生成岗位胜任力评估表
      async createFinalEvaluation() {
        this.componentProps = { id: this.studentId }
        this.componentPropsClazz = { id: this.clazzId }
        this.componentName = 'recordOrder'

        let params = {
          studentTrainingRecordId: this.recordId,
          type: this.$route.query.name,
        }
        let [listErr, listRes] = await to(getStudentTrainingFiles(params))
        if (listErr) return false
        let record =
          listRes.data.content instanceof Array && listRes.data.content.length > 0
            ? listRes.data.content[0]
            : {}
        this.recordItem = record
        this.createdTrinings = record.generateFiles || []
      },
      getFinalEvaluation(data) {
        this.finalEvaluationInfo = data
      },
      // 生成飞行考试单
      async createFlyExam() {
        this.loading = true
        let params = {
          studentTrainingRecordId: this.recordId,
          type: this.$route.query.name,
        }
        let [listErr, listRes] = await to(getStudentTrainingFiles(params))
        this.loading = false
        if (listErr) return false
        let record =
          listRes.data.content instanceof Array && listRes.data.content.length > 0
            ? listRes.data.content[0]
            : {}
        this.recordItem = record
        this.createdTrinings = record.generateFiles || []

        let [recordErr, recordRes] = await to(getStudentTrainingRecord({ id: record.id }))
        if (!recordErr) {
          this.triningList = recordRes.data || []
          this.changeFlyExam(
            this.componentProps
              ? this.triningList.findIndex((v) => v.id == this.componentProps.id)
              : 0,
          )
        }
      },
      changeFlyExam(index) {
        if (index == this.activeIndex) return
        this.componentName = null
        this.$nextTick(() => {
          let item = this.triningList[index]
          this.activeIndex = index
          this.componentProps = {
            id: item.id,
            status: 'FILLED',
          }
          this.componentName = 'flyExamDetails'
        })
      },
      // 生成理论考试成绩单
      async createTheoryExam() {
        this.loading = true
        let params = {
          studentTrainingRecordId: this.recordId,
          type: this.$route.query.name,
        }
        let [listErr, listRes] = await to(getStudentTrainingFiles(params))
        this.loading = false
        if (listErr) return false
        let record =
          listRes.data.content instanceof Array && listRes.data.content.length > 0
            ? listRes.data.content[0]
            : {}
        this.recordItem = record
        this.createdTrinings = record.generateFiles || []

        let [recordErr, recordRes] = await to(getStudentTrainingRecord({ id: record.id }))
        if (!recordErr) {
          this.triningList = recordRes.data || []
          this.changeTheory(
            this.componentProps
              ? this.triningList.findIndex((v) => v.id == this.componentProps)
              : 0,
          )
        }
      },
      changeTheory(index) {
        if (index == this.activeIndex) return
        this.componentName = undefined
        this.$nextTick(() => {
          this.componentName = 'theoryExam'
          this.componentProps = this.triningList[index].id
          this.activeIndex = index
        })
      },
      // 提交pdf文件关联
      async connectFilePDF(id, params, cb) {
        let [err] = await to(putStudentTrainingFiles({ id, ...params }))
        if (!err) {
          cb && cb()
        }
      },
      // 重新生成
      async reExport(dom, callback) {
        let exportId =
          typeof this.componentProps == 'object' ? this.componentProps.id : this.componentProps
        let recordId = this.recordItem.id
        let loading = this.$loading({
          target: this.$refs.main,
          text: this.$t('tip.pleaseWaitOfGeneratingPDF'),
        })
        if (this.typeName == 'FINAL_EVALUATION') {
          exportId = this.finalEvaluationInfo.id
        } else if (this.typeName == 'THEORY_PROGRESS_SHEET') {
          exportId = this.studentId
        }
        if (
          ['FLIGHT_EVALUATION', 'FLIGHT_EXAM_RECORD', 'FINAL_EVALUATION'].includes(this.typeName)
        ) {
          let _this = this
          let pdfApi = flightTrainingGetPdf
          switch (this.typeName) {
            case 'FLIGHT_EVALUATION':
              pdfApi = flightTrainingGetPdf
              break
            case 'FLIGHT_EXAM_RECORD':
              pdfApi = flightExamGetPdf
              break
            case 'FINAL_EVALUATION':
              pdfApi = studentFinalGetPdf
              break
          }
          pdfApi({ ids: [exportId], templateHtml: null, upload: true }).then((res) => {
            let form = new FormData()
            var blob = new Blob([res.data])
            form.append(
              'file',
              new window.File([blob], `${new Date().getTime()}.pdf`, { type: 'application/pdf' }),
            )
            postUpload(form).then((rr) => {
              let params = {
                generateFiles: [
                  {
                    fileUuid: rr.data.uuid,
                    sourceId: exportId,
                  },
                ],
              }
              this.connectFilePDF(recordId, params, () => {
                loading.close()
                callback && callback()
              })
            })
          })
          return
        }
        htmlToPdf(
          dom,
          '',
          'datauristring',
          async (url) => {
            let form = new FormData()
            form.append('file', dataURLtoFile(url, '123.pdf'))
            let [err, res] = await to(postUpload(form))
            if (!err) {
              let params = {
                generateFiles: [
                  {
                    fileUuid: res.data.uuid,
                    sourceId: exportId,
                  },
                ],
              }
              this.connectFilePDF(recordId, params, () => {
                loading.close()
                callback && callback()
              })
            }
          },
          {
            padding: 20,
          },
        )
      },
      regenerate() {
        switch (this.typeName) {
          case 'FLIGHT_EVALUATION':
            this.reExport(this.$refs.print.querySelector('.wrap-table'), this.createFlyEvaluation)
            break
          case 'FLIGHT_EXAM_RECORD':
            this.reExport(this.$refs.print.querySelector('.print-wrap-table'), this.createFlyExam)
            break
          case 'THEORY_EXAM_RECORD':
            this.reExport(this.$refs.Section, this.createTheoryExam)
            break
          case 'FINAL_EVALUATION':
            this.reExport(
              this.$refs.print.querySelector('.print-wrap-table'),
              this.createFinalEvaluation,
            )
            break
          case 'THEORY_PROGRESS_SHEET':
            this.reExport(this.$refs.print.querySelector('.table-main'), this.createProgress)
            break
        }
      },
      // 判断是否显示重新生成按钮
      ReGenerateVisible() {
        let item = {}
        let that = this
        switch (this.typeName) {
          case 'FLIGHT_EVALUATION': {
            try {
              item = that.triningList.find((v) => v.id == that.componentProps.id)
              return item.studentSignature && item.teacherSignature
              // && !Boolean(that.createdTrinings.find(v => v.sourceId == item.id))
            } catch (e) {
              return false
            }
          }
          case 'FLIGHT_EXAM_RECORD': {
            try {
              item = that.triningList.find((v) => v.id == that.componentProps.id)
              return item.studentSignature && item.teacherSignature
              // && !Boolean(that.createdTrinings.find(v => v.sourceId == item.id))
            } catch (e) {
              return false
            }
          }
          case 'THEORY_EXAM_RECORD': {
            try {
              item = that.triningList.find((v) => v.id == that.componentProps)
              return item.isSignature
              // && !Boolean(that.createdTrinings.find(v => v.sourceId == item.id))
            } catch (e) {
              return false
            }
          }
          case 'FINAL_EVALUATION': {
            try {
              return Boolean(that.finalEvaluationInfo.signature)
              // && !Boolean(that.createdTrinings.find(v => v.sourceId == that.finalEvaluationInfo.id))
            } catch (e) {
              return false
            }
          }
          case 'THEORY_PROGRESS_SHEET': {
            try {
              return true
              return (
                !this.createdTrinings.find((v) => v.sourceId == this.studentId) &&
                this.componentProps.some(
                  (v) =>
                    v.signStudents instanceof Array &&
                    v.signStudents.length &&
                    v.signStudents.some((n) => n.userId == that.studentUserid),
                )
              )
            } catch (e) {
              return false
            }
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/views/project_ftm/teacher/styles/print-report-pdf.scss';
  .mt40 {
    top: 40px !important;
  }
  .print-inline {
    position: relative;
    min-width: 1130px;
    width: 100%;
    height: 0;
    margin: 0 auto;
    z-index: 1;
    transform: translateX(-20px);
  }
  .print-button {
    position: absolute;
    top: 12px;
    right: 10px;
  }
  .flex-box {
    display: flex;
    height: 100%;
    .trining-list {
      max-width: 200px;
      width: 20vw;
      margin: 0;
      padding: 0;
    }
    .trining-list li {
      max-width: 200px;
      width: 20vw;
      height: 46px;
      margin-bottom: -1px;
      font-size: 13px;
      text-align: center;
      line-height: 46px;
      list-style: none;
      border: 1px solid #ccc;
      box-sizing: border-box;
      cursor: default;
      &.active {
        color: #fff;
        background: #215ebe;
        .status {
          color: #fff;
          background: rgba($color: #fff, $alpha: 0.2);
        }
      }
    }
    .custom-item {
      position: relative;
      text-align: left !important;
      text-indent: 2em;
      color: #66a52f;
      overflow: hidden;
      &.warning {
        color: #feb434;
      }
      &.error {
        color: #d2534a;
      }
      .line-txt {
        width: 100%;
        margin: 0;
        padding-right: 70px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .status {
        position: absolute;
        width: 4.5em;
        height: 2em;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        border-radius: 6px;
        color: #66a52f;
        white-space: nowrap;
        margin-left: 10px;
        line-height: 2em;
        text-align: center;
        text-indent: 0;
        background: rgba($color: #66a52f, $alpha: 0.2);
        &.warning {
          color: #feb434;
          background: rgba($color: #feb434, $alpha: 0.2);
        }
        &.error {
          color: #d2534a;
          background: rgba($color: #d2534a, $alpha: 0.2);
        }
      }
    }
    :deep(.flex-con) {
      position: relative;
      flex: 1;
      margin: 0 10px;
      overflow: hidden;
      @include printPdf;

      .el-scrollbar__wrap {
        margin-bottom: 0 !important;
        margin-right: 0 !important;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
    .scroll-con {
      width: 1300px;
      margin: auto;
    }
    :deep(.no-print),
    :deep(.sign-link) {
      display: none;
    }
    :deep(.wrap-table) {
      max-width: unset;
      width: 100%;
    }
    :deep(.container) {
      width: auto;
      min-width: 1130px;
      height: auto;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }
    :deep(.print-wrapper) {
      max-width: unset;
      padding: 0;
    }
    :deep(.componentsContent) {
      width: 100%;
      height: unset;
      padding: 0;
      margin: 0;
    }
  }
</style>
