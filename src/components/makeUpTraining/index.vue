<template>
  <table class="wrap-table nopostcss-table page-break-wrap" style="margin-bottom: 20px">
    <thead>
      <tr>
        <th colspan="6" style="position: relative">
          <h1>
            {{ state.form.title }}-CBTA
            <div class="fix-button no-print" v-if="type == 'info'">
              <el-button type="primary" @click="printEvent">{{ $t('text.print') }}</el-button>
              <!-- 打印 -->
            </div>
          </h1>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="8" style="padding: 0">
          <table class="print-wrap-content details-table" style="width: 100%">
            <tr class="average">
              <!-- 学员姓名 -->
              <td class="width33p">
                <span class="details-label">{{ $t('text.student_name') }}：</span>
                {{ state.form.student }}
              </td>
              <!-- 带飞教员 -->
              <td class="width33p">
                <span class="details-label">{{ $t('text.fly_instructors_with_you') }}：</span>
                {{ state.form.teacher }}
              </td>
              <!-- 班级课号 -->
              <td>
                <span class="details-label">{{ $t('text.class_number') }}：</span>
                {{ state.form.courseNumber }}
              </td>
            </tr>
            <tr class="average">
              <!-- 训练机型 -->
              <td>
                <span class="details-label">{{ $t('text.training_model') }}：</span>
                {{ state.form.airplaneModel }}
              </td>
              <!-- 课程大纲 -->
              <td>
                <span class="details-label">{{ $t('message.trainingCourses') }}：</span>
                {{ state.form.version }}
              </td>
              <!-- 飞行日期 -->
              <td>
                <span class="details-label">{{ $t('text.date_of_flight') }}：</span>
                <template v-if="state.dateEdit">
                  <el-date-picker
                    class="inline-date-picker"
                    v-model="state.form.flyTime"
                    value-format="yyyy-MM-dd"
                    type="date"
                    :placeholder="$t('text.please_select')"
                    :editable="false"
                    size="mini"
                    :clearable="false"
                  />
                  <a
                    href="javascript:void(0)"
                    class="el-icon-check icon-edit no-print"
                    v-if="type == 'edit' && state.dateEdit"
                    @click="state.dateEdit = false"
                  />
                </template>
                <template v-else>{{
                  XEUtils.toDateString(state.form.flyTime, 'yyyy-MM-dd')
                }}</template>
                <a
                  href="javascript:void(0);"
                  class="el-icon-edit-outline icon-edit no-print"
                  v-if="type == 'edit' && !state.dateEdit"
                  @click="state.dateEdit = true"
                />
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="wrap-point" :width="state.labelWidth">{{ $t('text.curriculum') }}</td>
        <!-- 课程 -->
        <td class="wrap-point" width="275px">{{ $t('text.evaluate_the_project') }}</td>
        <!-- 评估项目 -->
        <td class="wrap-point" colspan="2">{{ $t('text.core_competency_assessment') }}</td>
        <!-- 核心能力评估 -->
        <td class="wrap-point" width="275px">
          {{ $t('text.the_behavior_metric_does_not_satisfy_the_item') }}
        </td>
        <!-- 行为指标不满足项 -->
      </tr>
      <tr class="c">
        <td :rowspan="state.form.score.length || 1" :width="state.labelWidth">
          <span class="course-name">{{ data.course }}</span>
        </td>
        <td>{{ state.form.score[0] ? state.form.score[0].name : '' }}</td>
        <td colspan="2">
          <el-rate
            :length="5"
            :disabled="type == 'info'"
            v-if="state.form.score[0]"
            v-model="state.form.score[0].score"
            :colors="['#FF9900', '#FF9900', '#FF9900']"
            disabled-void-color="#99A9BF"
          />
        </td>
        <td class="center">
          <span class="behavior-line" v-if="type != 'edit' && state.form.score[0]">{{
            getBehavior(state.form.score[0].behavior)
          }}</span>
          <div class="behavior-line" v-if="type == 'edit'">
            <a
              v-if="state.form.score[0] && state.form.score[0].score <= 3 && type == 'edit'"
              href="javascript:void(0);"
              class="sign-link"
              @click="handleSelect(state.form.score[0])"
              >{{ getBehavior(state.form.score[0].behavior) || $t('text.click_select') }}</a
            >
            <span v-if="state.form.score[0] && state.form.score[0].score > 3">{{
              (state.form.score[0].behavior = '')
            }}</span>
          </div>
        </td>
      </tr>
      <tr
        class="c"
        v-for="(item, index) in state.form.score instanceof Array ? state.form.score.slice(1) : []"
        :key="index"
      >
        <td>{{ item.name }}</td>
        <td colspan="2">
          <el-rate
            :length="5"
            :disabled="type == 'info'"
            v-model="state.form.score[index + 1].score"
            :colors="['#FF9900', '#FF9900', '#FF9900']"
            disabled-void-color="#99A9BF"
          />
        </td>
        <td class="center">
          <span class="behavior-line" v-if="type != 'edit'">{{ getBehavior(item.behavior) }}</span>
          <div class="behavior-line" v-else>
            <a
              v-if="item.score <= 3 && type == 'edit'"
              href="javascript:void(0);"
              class="sign-link"
              @click="handleSelect(item)"
              >{{ getBehavior(item.behavior) || $t('text.click_select') }}</a
            >
            <span v-if="item.score > 3">{{ (item.behavior = '') }}</span>
          </div>
        </td>
      </tr>

      <tr class="r2">
        <td class="c">{{ $t('text.training_results') }}</td>
        <td colspan="5">
          <template v-if="type == 'info'">
            <p class="wrap-con">
              {{
                state.form.trainingResultName
                  ? state.form.trainingResultName
                  : resultOld(state.form.result)
              }}
            </p>
          </template>
          <template v-else>
            <el-radio-group v-model="state.form.trainingResultId" style="padding-left: 20px">
              <el-radio v-for="item in state.resultArr" :key="item.id" :label="item.id">{{
                item.name
              }}</el-radio>
            </el-radio-group>
          </template>
        </td>
      </tr>
      <tr class="r3">
        <td class="c">{{ $t('text.comments') }}</td>
        <td colspan="5" style="padding: 0" v-if="!state.hide_estimate">
          <table class="cell-table">
            <tr>
              <td class="cell-td">PF</td>
              <td>
                <template v-if="type == 'info'">
                  <p class="wrap-con">{{ state.form.estimate }}</p>
                </template>
                <template v-else>
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    v-model="state.form.estimate"
                    :placeholder="$t('text.please_enter')"
                    class="wrap-textarea"
                  />
                </template>
              </td>
            </tr>
            <tr>
              <td class="cell-td">PM</td>
              <td>
                <template v-if="type == 'info'">
                  <p class="wrap-con">{{ state.form.evaluation }}</p>
                </template>
                <template v-else>
                  <el-input
                    type="textarea"
                    v-model="state.form.evaluation"
                    :autosize="{ minRows: 2 }"
                    :placeholder="$t('text.please_enter')"
                    class="wrap-textarea"
                  />
                </template>
              </td>
            </tr>
          </table>
        </td>
        <td colspan="5" v-else>
          <template v-if="type == 'info'">
            <p class="wrap-con">{{ state.form.evaluation }}</p>
          </template>
          <template v-else>
            <el-input
              type="textarea"
              v-model="state.form.evaluation"
              autosize
              :placeholder="$t('text.please_enter')"
              class="wrap-textarea"
            />
          </template>
        </td>
      </tr>
      <tr>
        <td class="c" :width="state.labelWidth">{{ $t('text.instructor_signature') }}</td>
        <td class="c" width="350px">
          <div class="sign-img-box" v-if="state.form.teacherUUID">
            <img :src="state.teacherSignURL" class="sign-img" />
          </div>
          <span
            class="sign-link"
            @click="Sign"
            v-else-if="type == 'edit' && state.form.status == 'FILLED'"
            >{{ $t('text.click_sign') }}</span
          >
          <span class="sign-error" v-else-if="type == 'edit'">{{
            $t('tip.please_save_before_signing')
          }}</span>
        </td>
        <td class="c" width="250px">{{ $t('text.student_signature') }}</td>
        <td class="c" width="350px" colspan="2">
          <div class="sign-img-box">
            <img :src="state.studentSignURL" class="sign-img" v-if="state.form.studentUUID" />
          </div>
        </td>
      </tr>
      <!-- <tr v-if="state.form.status != 'PASS'">
                <td>{{ $t('table.remarks') }}</td>
                <td colspan="5">
                    <template>
                        {{ state.form.remark }}
                    </template>
                </td>
            </tr>-->
    </tbody>
    <!-- 行为指标 -->
    <el-dialog
      width="720px"
      :title="$t('table.selectBehavioralIndicators')"
      v-model="state.behaviorDialogVisible"
      v-if="state.behaviorDialogVisible"
      :close-on-click-modal="false"
      center
      class="behavior-indicators-dialog"
    >
      <div class="behavior-checkbox">
        <el-checkbox-group v-model="state.checkList">
          <el-checkbox
            :label="item.code"
            v-for="item in state.behaviorOptionList || []"
            :key="item.id"
            >{{ item.code + ' ' + item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <tempalte #footer>
        <el-button @click="behaviorDialogCancel" size="medium" type="primary" plain>{{
          $t('message.hscancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="behaviorDialogConfirm"
          size="medium"
          :loading="state.loadingDialog"
          >{{ $t('message.hsdefine') }}</el-button
        >
      </tempalte>
    </el-dialog>
  </table>
</template>

<script setup lang="ts">
  import XEUtils from 'xe-utils'
  import { previewURL } from '/@/api/opm/file'
  import { reactive, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { toPdf } from '/@/utils/print'
  import { postFlightExamRecordsGenPdf } from '/@/api/opm/train'
  const { t } = useI18n()
  const Interface = {
    exam: false, // 是否推荐考试
    status: '', // 填写状态
    title: '', // 飞行项目
    student: '', // 学员姓名
    teacher: '', // 教员
    airplaneModel: '', // 飞机型号
    flyTime: '', // 飞行时间
    course: '', // 课程
    result: '', // 结果
    trainingResultId: '', // 结果
    trainingResultName: '',
    evaluation: '', // 评语 PD
    estimate: '', // PF
    score: [], // 项目
    teacherUUID: '', // 教员签名
    studentUUID: '', // 学员签名
    courseNumber: '',
    version: '',
  }

  const tableWidth = 940
  const _form = XEUtils.clone(Interface, true)
  const state = reactive({
    XEUtils,
    labelWidth: Number((152 / tableWidth).toFixed(4)) * 100 + '%',
    form: _form, // 本地数据
    studentSignURL: '', // 学生签名图片地址
    teacherSignURL: '', // 教员签名图片地址
    dateEdit: false,
    behaviorDialogVisible: false,
    behaviorOptionList: [],
    checkList: [],
    loadingDialog: false,
    resultArr: [],
    hide_estimate: false,
  })

  const props = defineProps({
    type: {
      type: String,
      default: 'info',
    },
    data: {
      type: Object,
      default: () => ({
        exam: false, // 是否推荐考试
        status: '', // 填写状态
        title: '', // 飞行项目
        student: '', // 学员姓名
        teacher: '', // 教员
        airplaneModel: '', // 飞机型号
        flyTime: '', // 飞行时间
        course: '', // 课程
        result: '', // 结果
        trainingResultId: '', // 结果
        trainingResultName: '',
        evaluation: '', // 评语 PD
        estimate: '', // PF
        score: [], // 项目
        teacherUUID: '', // 教员签名
        studentUUID: '', // 学员签名
        courseNumber: '',
        version: '',
      }), // 传递数据
    },
    id: String,
    printId: Number,
  })
  watch(
    () => props.data,
    (param) => {
      // console.log(param,'传递')
      let obj: any = XEUtils.clone(param, true)
      state.form = obj
      state.studentSignURL = previewURL(obj.studentUUID)
      state.teacherSignURL = previewURL(obj.teacherUUID)
      // trainingResults()
    },
  )

  async function getDetails() {
    // const id = this.id
    // let [err,res] = await this.$to(Api.getFlyTrainDetails({ id }))
    // if(err) return false
    // let data = res.data
    // let stringArr = function(arr,key){
    //     if(arr instanceof Array){
    //         return key? arr.map(v => v[key]).join(','): arr.join(',')
    //     }else{
    //         return ''
    //     }
    // }
    // let STR = data.studentTrainingRecord || {}
    // let grouping = STR.grouping || {}
    // let course = STR.course || {}
    // this.form = {
    //     exam: data.exam,
    //     status: data.status,
    //     title: STR.clazz.course.name, // 飞行项目
    //     student: STR.student.name,// 学员姓名
    //     teacher: stringArr(grouping.teachers,'name'),// 教员
    //     airplaneModel: STR.clazz.airplaneType, // 飞机型号
    //     flyTime: data.status == 'FILLED' ? dayjs(data.endTime).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'), // 飞行时间
    //     course: data.name, // 课程
    //     result: data.result, // 结果
    //     trainingResultId: data.trainingResult && data.trainingResult.id,
    //     trainingResultName: data.trainingResultName,
    //     evaluation: data.evaluation, // 评语
    //     estimate: data.estimate,
    //     score: data.scores, // 项目
    //     teacherUUID: data.teacherSignature, // 教员签名
    //     studentUUID: data.studentSignature, // 学员签名
    //     courseNumber: STR.clazz.courseNumber,
    //     version: data.syllabusItem.syllabus.version,
    //     trainingResultName: data.trainingResult?.name
    // }
    // this.studentSignURL = previewURL(this.form.studentUUID)
    // this.teacherSignURL = previewURL(this.form.teacherUUID)
  }
  function trainingResults() {
    // trainingResults({}).then(res => {
    //     this.resultArr = res.data.content.filter(item => {
    //         if(this.form.exam) {
    //             return item.applyTypes.includes('RECOMMEND_EXAM')
    //         } else {
    //             return item.applyTypes.includes('TRAINING')
    //         }
    //     })
    // })
  }
  function Sign() {
    this.$emit('signEvent')
  }
  function changeFlyDateTime(date) {
    // this.form.flyTime = XEUtils.toDateString(date,'yyyy-MM-dd') || ''
  }
  function result(str) {
    ;(this.resultArr.filter((item) => item.result == str)[0] &&
      this.resultArr.filter((item) => item.result == str)[0].name) ||
      ''
  }
  function resultOld(str) {
    switch (str) {
      case 'PASS':
        return this.form.exam ? t('text.recommended_exams') : t('text.keep_training')
      case 'ABORT':
        return t('text.suggestion') + t('text.discontinue')
      case 'ADD_ONE':
        return t('text.suggestion') + t('text.one_more_training_session')
      case 'ADD_TWO':
        return t('text.suggestion') + t('text.two_additional_training_sessions')
      default:
        return ''
    }
  }
  function getEvaluations(id) {
    let params = {
      page: 1,
      size: 2000,
      level: 1,
      superiorId: id,
    }
    this.behaviorOptionList = []
    // getEvaluations(params).then(res => {
    //     if (res.status == 200) {
    //         let data = res.data.content
    //         // this.behaviorOptionList = data
    //         data.forEach(item => {
    //             this.behaviorOptionList.push({
    //                 code: item.code,
    //                 id: item.id,
    //                 name: item.name
    //             })
    //         })
    //     }
    // })
    // .catch(() => {
    // })
  }
  function handleSelect(row) {
    this.row = row
    this.behaviorDialogVisible = true
    this.getEvaluations(row.evaluationId)
    this.$nextTick(() => {
      try {
        this.checkList = row.behavior ? JSON.parse(row.behavior).map((item) => item.code) : []
      } catch (error) {
        this.checkList = []
      }
    })
  }
  // 取消按钮（行为指标）
  function behaviorDialogCancel() {
    this.behaviorDialogVisible = false
  }
  // 确定按钮（行为指标）
  function behaviorDialogConfirm() {
    let arr =
      this.behaviorOptionList.filter((item) => {
        return this.checkList.includes(item.code)
      }) || []
    this.row.behavior = arr && (arr.length ? JSON.stringify(arr) : '')
    this.behaviorDialogVisible = false
  }
  function getBehavior(val) {
    if (val) {
      try {
        return JSON.parse(val)
          .map((item) => item.code)
          .join(' , ')
      } catch (error) {
        return ''
      }
    } else {
      return ''
    }
  }
  const route = useRoute()
  // 打印
  function printEvent() {
    postFlightExamRecordsGenPdf({ ids: [props.printId || +route.params.id] }).then((res) => {
      toPdf(res)
    })
    // let { CBTAtype } = route.params
    // let pdfApi = null
    // console.log(CBTAtype);

    //  if (CBTAtype &&CBTAtype!=='EVALUATION'){
    //     pdfApi = flightExamGetPdf
    // } else {
    //     pdfApi = flightTrainingGetPdf
    // }
    // pdfApi({ ids: [this.$route.query.id], templateHtml: null })
  }

  onMounted(() => {
    if (props.id) {
      getDetails()
    }
  })
</script>

<style lang="scss" scope>
  $ticketBorderColor: #666;
  $pointBackground: #fafafa;
  $tdHeight: 38px;
  .wrap-table {
    max-width: 1180px;
    margin: 0 auto;
    border-collapse: collapse;

    td,
    th {
      background-image: linear-gradient($ticketBorderColor, $ticketBorderColor),
        linear-gradient($ticketBorderColor, $ticketBorderColor);
      background-position: 0 0, 0 100%;
      background-size: 1px 100%, 100% 1px;
      background-repeat: no-repeat;
    }

    thead {
      text-align: center;
      // color: #fff;
      border: 0;
      background-color: #fafafa;
      h1 {
        margin: 0;
        height: 50px;
        font-size: 20px;
        line-height: 50px;
      }
      h2 {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
      }
      tr:first-child {
        background-image: linear-gradient($ticketBorderColor, $ticketBorderColor),
          linear-gradient($ticketBorderColor, $ticketBorderColor);
        background-position: 100% 0, 0 0;
        background-size: 1px 100%, 100% 1px;
        background-repeat: no-repeat;
      }
    }

    tbody {
      tr,
      td {
        padding: 0 5px;
        font-size: 13px;
        height: $tdHeight;
      }
      tr td:last-child {
        background-image: linear-gradient($ticketBorderColor, $ticketBorderColor),
          linear-gradient($ticketBorderColor, $ticketBorderColor),
          linear-gradient($ticketBorderColor, $ticketBorderColor);
        background-position: 0 0, 0 100%, 100% 0;
        background-size: 1px 100%, 100% 1px, 1px 100%;
        background-repeat: no-repeat;
      }
    }

    .left {
      display: inline-block;
      vertical-align: middle;
    }
    .right {
      display: inline-block;
      vertical-align: middle;
    }

    .inline {
      display: inline-block;
      margin: 0 10px;
    }

    .c {
      text-align: center;
    }

    .wrap-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
    }

    .wrap-head {
      padding-top: 12px;
      color: #666;
      font-size: 12px;
    }

    .wrap-point {
      font-weight: bold;
      text-align: center;
      background-color: #fafafa;
    }

    .wrap-con {
      padding-left: 2em;
      letter-spacing: 1px;
      line-height: 1.5;
    }

    .placeholder {
      color: #7f7f7f;
    }

    .r2 {
      height: 2 * $tdHeight;
    }
    .r3 {
      height: 3 * $tdHeight;
    }

    .wrap-textarea {
      width: 100%;
      min-height: 100%;
      textarea {
        margin: 5px 0;
        // min-height: 140px!important;
      }
    }

    .sign-link {
      color: #215ebe;
      cursor: pointer;
    }

    .sign-img-box {
      width: 100%;
      height: 100px;
      margin: 5px;
      overflow: hidden;
    }
    .sign-img {
      max-width: 100%;
      max-height: 100%;
    }

    .vm-rate__icon {
      margin-right: 12px;
      font-size: 15px !important;
    }
    .course-name {
      max-width: 12em;
      word-break: break-word;
      line-height: 1.5;
    }

    .icon-edit {
      margin-left: 8px;
      color: #215ebe;
      font-size: 18px;
    }

    .cell-table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
      .cell-td {
        width: 70px;
        // height: 120px;
        text-align: center;
      }
    }
    //@at-root
    .details-table {
      width: 100%;
      border-collapse: collapse;
      td,
      th {
        font-size: 12px;
        padding: 0 12px;
        box-sizing: border-box;
        word-break: break-all;
        line-height: 1.5;
      }
      .details-label {
        display: inline-block;
        text-align: right;
        white-space: nowrap;
      }
      tr {
        height: 40px;
      }
      .details-title {
        height: 46px;
        background: $pointBackground;
        td {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }
      }
      .h1 {
        height: 80px;
      }
      .h2 {
        height: 120px;
      }

      .center {
        text-align: center;
      }
      .average td {
        width: 33%;
      }
      .c1 {
        width: 12%;
      }
      .c2 {
        width: 20%;
      }

      .cell-input {
        margin: 10px 0;
      }
      .pt {
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .vm-rate-icon-custome:before {
        content: '\E904';
      }
    }
  }
  .behavior-indicators-dialog {
    .el-checkbox {
      width: 100%;
      margin: 6px 0;
    }
    .el-dialog__header {
      position: relative;
      padding: 15px 20px;
      text-align: center;
      background: #215ebe;
      .el-dialog__title {
        color: #fff;
        font-weight: bold;
      }
      .el-dialog__headerbtn {
        top: 50%;
        font-size: 28px;
        transform: translateY(-50%);
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    .el-checkbox__label {
      display: inline-grid;
      white-space: pre-line;
      word-wrap: break-word;
    }
  }
  .behavior-checkbox {
    padding: 10px 20px;
    border: 1px solid #e8e8e8;
    line-height: 2;
  }
  @media print {
    .page-break-wrap {
      page-break-after: always; // page-break inside
    }
  }
  .width33p {
    width: 33%;
  }
  .fix-button {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }
</style>
