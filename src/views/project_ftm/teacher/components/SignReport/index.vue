<template>
  <table class="wrap-table nopostcss-table page-break-wrap" style="margin-bottom: 20px">
    <thead>
      <tr>
        <th colspan="6" style="position: relative">
          <h1>
            {{ form.title }}-CBTA
            <div class="fix-button no-print" v-if="props.type == 'info'">
              <el-button type="primary" @click="printEvent">{{ t('button.print') }}</el-button
              ><!-- 打印 -->
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
                <span class="details-label">{{ t('table.studentName') }}：</span>{{ form.student }}
              </td>
              <!-- 带飞教员 -->
              <td class="width33p">
                <span class="details-label">{{ t('table.filghtTeacher') }}：</span
                >{{ form.teacher }}
              </td>
              <!-- 班级课号 -->
              <td>
                <span class="details-label">{{ t('table.courseCode') }}：</span
                >{{ form.courseNumber }}
              </td>
            </tr>
            <tr class="average">
              <!-- 训练机型 -->
              <td>
                <span class="details-label">{{ t('table.trainingModel') }}：</span
                >{{ form.airplaneModel }}
              </td>
              <!-- 课程大纲 -->
              <td>
                <span class="details-label">{{ t('router.syllabus') }}：</span>{{ form.version }}
              </td>
              <!-- 飞行日期 -->
              <td>
                <span class="details-label">{{ t('table.trainDate') }}：</span>
                <template v-if="dateEdit">
                  <el-date-picker
                    class="inline-date-picker"
                    v-model="form.flyTime"
                    value-format="YYYY-MM-DD"
                    type="date"
                    :placeholder="t('holder.pleaseSelectDate')"
                    :editable="false"
                    size="mini"
                    :clearable="false"
                  />
                  <el-icon
                    v-if="props.type == 'edit' && dateEdit"
                    class="icon-edit no-print"
                    @click="dateEdit = false"
                  >
                    <Check />
                  </el-icon>
                </template>
                <template v-else>
                  {{ XEUtils.toDateString(form.flyTime, 'yyyy-MM-dd') }}
                </template>
                <el-icon
                  v-if="props.type == 'edit' && !dateEdit"
                  class="icon-edit no-print"
                  @click="dateEdit = true"
                >
                  <Edit />
                </el-icon>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="wrap-point" :style="{ width: labelWidth }">{{ t('table.sourse') }}</td>
        <!-- 课程 -->
        <td class="wrap-point" style="width: 275px">{{ t('table.evaluationProject') }}</td>
        <!-- 评估项目 -->
        <td class="wrap-point" colspan="2">{{ t('table.evaluationCoreCompetence') }}</td>
        <!-- 核心能力评估 -->
        <td class="wrap-point" style="width: 275px">{{ t('table.behavioralIndicatorsNoPass') }}</td>
        <!-- 行为指标不满足项 -->
      </tr>
      <tr class="c">
        <td :rowspan="form.score.length || 1" :style="{ width: labelWidth }">
          <span class="course-name">{{ props.data.course }}</span>
        </td>
        <td>{{ form.score[0] ? form.score[0].name : '' }}</td>
        <td colspan="2">
          <el-rate
            v-if="form.score[0]"
            v-model="form.score[0].score"
            :colors="['#FF9900', '#FF9900', '#FF9900']"
            :disabled="props.type == 'info'"
            disabled-void-color="#99A9BF"
          />
        </td>
        <td class="center">
          <span class="behavior-line" v-if="props.type != 'edit' && form.score[0]">{{
            getBehavior(form.score[0].behavior)
          }}</span>
          <div class="behavior-line" v-if="props.type == 'edit'">
            <a
              v-if="form.score[0] && form.score[0].score <= 3 && props.type == 'edit'"
              href="javascript:void(0);"
              class="sign-link"
              @click="handleSelect(form.score[0])"
              >{{ getBehavior(form.score[0].behavior) || t('table.clickSelect') }}</a
            >
            <span v-if="form.score[0] && form.score[0].score > 3">{{
              (form.score[0].behavior = '')
            }}</span>
          </div>
        </td>
      </tr>
      <tr
        class="c"
        v-for="(item, index) in form.score instanceof Array ? form.score.slice(1) : []"
        :key="index"
      >
        <td>{{ item.name }}</td>
        <td colspan="2">
          <el-rate
            :disabled="props.type == 'info'"
            v-model="form.score[index + 1].score"
            :colors="['#FF9900', '#FF9900', '#FF9900']"
            disabled-void-color="#99A9BF"
          />
        </td>
        <td class="center">
          <span class="behavior-line" v-if="props.type != 'edit'">{{
            getBehavior(item.behavior)
          }}</span>
          <div class="behavior-line" v-else>
            <a
              v-if="item.score <= 3 && props.type == 'edit'"
              href="javascript:void(0);"
              class="sign-link"
              @click="handleSelect(item)"
              >{{ getBehavior(item.behavior) || t('table.clickSelect') }}</a
            >
            <span v-if="item.score > 3">{{ (item.behavior = '') }}</span>
          </div>
        </td>
      </tr>

      <tr class="r2">
        <td class="c">{{ t('table.trainingResults') }}</td>
        <td colspan="5">
          <template v-if="props.type == 'info'">
            <p class="wrap-con">
              {{ form.trainingResultName ? form.trainingResultName : resultOld(form.result) }}
            </p>
          </template>
          <template v-else>
            <el-radio-group v-model="form.trainingResultId" style="padding-left: 20px">
              <el-radio v-for="item in resultArr" :key="item.id" :label="item.id">{{
                item.name
              }}</el-radio>
            </el-radio-group>
          </template>
        </td>
      </tr>
      <tr class="r3">
        <td class="c">{{ t('table.comment') }}</td>
        <td colspan="5" style="padding: 0" v-if="!form.hide_estimate">
          <table class="cell-table">
            <tr>
              <td class="cell-td">PF</td>
              <td>
                <template v-if="props.type == 'info'">
                  <p class="wrap-con">{{ form.estimate }}</p>
                </template>
                <template v-else>
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    v-model="form.estimate"
                    :placeholder="t('holder.pleaseEnterComment')"
                    class="wrap-textarea"
                  />
                </template>
              </td>
            </tr>
            <tr>
              <td class="cell-td">PM</td>
              <td>
                <template v-if="props.type == 'info'">
                  <p class="wrap-con">{{ form.evaluation }}</p>
                </template>
                <template v-else>
                  <el-input
                    type="textarea"
                    v-model="form.evaluation"
                    :autosize="{ minRows: 2 }"
                    :placeholder="t('holder.pleaseEnterComment')"
                    class="wrap-textarea"
                  />
                </template>
              </td>
            </tr>
          </table>
        </td>
        <td colspan="5" v-else>
          <template v-if="props.type == 'info'">
            <p class="wrap-con">{{ form.evaluation }}</p>
          </template>
          <template v-else>
            <el-input
              type="textarea"
              v-model="form.evaluation"
              autosize
              :placeholder="t('holder.pleaseEnterComment')"
              class="wrap-textarea"
            />
          </template>
        </td>
      </tr>
      <tr>
        <td colspan="8" style="padding: 0">
          <table class="print-wrap-content details-table" style="width: 100%; height: 100%">
            <tr>
              <td class="c" :style="{ width: labelWidth }">{{ t('table.teacherSigning') }}</td>
              <td class="c" style="width: 350px">
                <div class="sign-img-box" v-if="form.teacherUUID">
                  <img :src="teacherSignURL" alt="" class="sign-img" />
                </div>
                <span
                  class="sign-link"
                  @click="Sign"
                  v-else-if="props.type == 'edit' && form.status == 'FILLED'"
                  >{{ t('table.clickSign') }}</span
                >
                <span class="sign-error" v-else-if="props.type == 'edit'">{{
                  t('tip.pleaseSaveBeforeSigning')
                }}</span>
              </td>
              <td class="c" style="width: 250px">{{ t('table.studentSign') }}</td>
              <td class="c" style="width: 350px">
                <div class="sign-img-box">
                  <img :src="studentSignURL" alt="" class="sign-img" v-if="form.studentUUID" />
                </div>
              </td>
              <template v-if="form.auditorUUID">
                <td class="c" style="width: 250px">{{ t('table.signerSign') }}</td>
                <td class="c" style="width: 350px">
                  <div class="sign-img-box">
                    <img :src="auditorSignURL" alt="" class="sign-img" v-if="form.auditorUUID" />
                  </div>
                </td>
              </template>
            </tr>
          </table>
        </td>
      </tr>
      <!-- <tr v-if="form.status != 'PASS'">
        <td>{{ t('table.remarks') }}</td>
        <td colspan="5">
            <template>
                {{ form.remark }}
            </template>
        </td>
    </tr> -->
    </tbody>
    <!-- 行为指标 -->
    <el-dialog
      v-if="behaviorDialogVisible"
      width="720px"
      :title="t('table.selectBehavioralIndicators')"
      v-model="behaviorDialogVisible"
      :close-on-click-modal="false"
      center
      class="behavior-indicators-dialog"
    >
      <div class="behavior-checkbox">
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.code" v-for="item in behaviorOptionList || []" :key="item.id">{{
            item.code + ' ' + item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <el-button @click="behaviorDialogCancel" size="medium" type="primary" plain>{{
          t('button.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="behaviorDialogConfirm"
          size="medium"
          :loading="loadingDialog"
          >{{ t('button.confirm') }}</el-button
        >
      </template>
    </el-dialog>
  </table>
</template>

<script lang="ts" setup>
  import { Check, Edit } from '@element-plus/icons-vue'
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  import { trainingResults } from '/@/api/ftm/teacher/teachingCenter'
  import Api from '/@/api/ftm/teacher/trainEva'
  import { getEvaluations } from '/@/api/ftm/teacher/teachingPlan'
  import { flightTrainingGetPdf, flightExamGetPdf } from '/@/api/ftm/teacher/studentTraining'
  import XEUtils from 'xe-utils'
  import moment from 'moment'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import to from 'await-to-js'
  import { Data } from './typs'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  interface Props {
    type: string
    data: Data
    id: string | number
    printId: string | number
  }
  const props = withDefaults(defineProps<Props>(), {
    type: 'info',
    data: () => ({
      exam: false,
      status: '',
      title: '',
      student: '',
      teacher: '',
      airplaneModel: '',
      flyTime: '',
      course: '',
      result: '',
      trainingResultId: '',
      trainingResultName: '',
      evaluation: '',
      estimate: '',
      score: [],
      teacherUUID: '',
      studentUUID: '',
      auditorUUID: '',
      courseNumber: null,
      version: '',
    }),
    id: '',
    printId: '',
  })
  const emit = defineEmits<{
    (e: 'signEvent'): void
  }>()

  const userStore = useFtmUserStore()
  const userInfo = computed(() => userStore.$state)
  const { t } = useI18n()
  const route = useRoute()

  const tableWidth = 940
  const Interface = reactive<Data>({
    exam: false,
    status: '',
    title: '',
    student: '',
    teacher: '',
    airplaneModel: '',
    flyTime: '',
    course: '',
    result: '',
    trainingResultId: '',
    trainingResultName: '',
    evaluation: '',
    estimate: '',
    score: [],
    teacherUUID: '',
    studentUUID: '',
    auditorUUID: '',
    courseNumber: null,
    version: '',
  })
  const form = reactive<Data>(XEUtils.clone(Interface, true))
  const labelWidth = ref(Number((152 / tableWidth).toFixed(4)) * 100 + '%')
  const studentSignURL = ref() // 学生签名图片地址
  const teacherSignURL = ref() // 教员签名图片地址
  const auditorSignURL = ref()
  const dateEdit = ref(false)
  const behaviorDialogVisible = ref(false)
  const behaviorOptionList = ref([])
  const checkList = ref([])
  const loadingDialog = ref(false)
  const resultArr = ref([])
  const row = ref()

  // 交互事件
  const Sign = () => {
    emit('signEvent')
  }
  const handleSelect = (row) => {
    row.value = row
    behaviorDialogVisible.value = true
    getEvaluationsEvent(row.evaluationId)
    nextTick(() => {
      try {
        checkList.value = row.behavior ? JSON.parse(row.behavior).map((item) => item.code) : []
      } catch (error) {
        checkList.value = []
      }
    })
  }
  // 取消按钮（行为指标）
  const behaviorDialogCancel = () => {
    behaviorDialogVisible.value = false
  }
  // 确定按钮（行为指标）
  const behaviorDialogConfirm = () => {
    let arr =
      behaviorOptionList.value.filter((item) => {
        return checkList.value.includes(item.code)
      }) || []
    row.value.behavior = arr && (arr.length ? JSON.stringify(arr) : '')
    behaviorDialogVisible.value = false
  }
  const getBehavior = (val) => {
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
  // 打印
  const printEvent = () => {
    let { CBTAtype } = route.query
    let pdfApi = null
    if (CBTAtype == 'EVALUATION') {
      pdfApi = flightTrainingGetPdf
    } else if (CBTAtype) {
      pdfApi = flightExamGetPdf
    } else {
      pdfApi = flightTrainingGetPdf
    }
    pdfApi({ ids: [props.printId || route.query.id], templateHtml: null })
  }

  // 请求事件
  const trainingResultsEvent = async () => {
    const [err, res] = await to(trainingResults())
    resultArr.value = res.data?.content.filter((item) => {
      if (form.exam) {
        return item.applyTypes.includes('RECOMMEND_EXAM')
      } else {
        return item.applyTypes.includes('TRAINING')
      }
    })
  }
  const getDetails = async () => {
    const id = props.id
    let [err, res] = await to(Api.getFlyTrainDetails({ id }))
    if (err) return false
    let data = res.data
    let stringArr = function (arr, key) {
      if (arr instanceof Array) {
        return key ? arr.map((v) => v[key]).join(',') : arr.join(',')
      } else {
        return ''
      }
    }
    let STR = data.studentTrainingRecord || {}
    let grouping = STR.grouping || {}
    let course = STR.course || {}
    form.exam = data.exam
    form.status = data.status
    form.title = STR.clazz.course.name // 飞行项目
    form.student = STR.student.name // 学员姓名
    form.teacher = stringArr(grouping.teachers, 'name') // 教员
    form.airplaneModel = STR.clazz.airplaneType // 飞机型号
    form.flyTime =
      data.status == 'FILLED'
        ? moment(data.endTime).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD') // 飞行时间
    form.course = data.name // 课程
    form.result = data.result // 结果
    form.trainingResultId = data.trainingResult && data.trainingResult.id
    form.evaluation = data.evaluation // 评语
    form.estimate = data.estimate
    form.score = data.scores // 项目
    form.teacherUUID = data.teacherSignature // 教员签名
    form.studentUUID = data.studentSignature // 学员签名
    form.auditorUUID = data.auditorSignature
    form.courseNumber = STR.clazz.courseNumber
    form.version = data.syllabusItem.syllabus.version
    form.trainingResultName = data.trainingResult && data.trainingResult.name
    studentSignURL.value = previewURL(form.studentUUID)
    teacherSignURL.value = previewURL(form.teacherUUID)
    auditorSignURL.value = previewURL(form.auditorUUID)
  }
  const getEvaluationsEvent = async (id) => {
    let params = {
      page: 1,
      size: 2000,
      level: 1,
      superiorId: id,
    }
    behaviorOptionList.value = []
    let [err, res] = await to(getEvaluations(params))
    if (!err && res.status === 200) {
      let data = res.data.content
      // this.behaviorOptionList = data
      data.forEach((item) => {
        behaviorOptionList.value.push({
          code: item.code,
          id: item.id,
          name: item.name,
        })
      })
    }
  }

  // 计算事件
  // 详情下格式化训练结果
  const resultOld = (str) => {
    switch (str) {
      case 'PASS':
        return form.exam ? t('status.recommendTest') : t('table.continueTraining')
      case 'ABORT':
        return t('status.adviceAbort')
      case 'ADD_ONE':
        return t('status.adviceAddOne')
      case 'ADD_TWO':
        return t('status.adviceAddTwo')
      default:
        return ''
    }
  }

  watch(
    () => props.data,
    (ob: Data) => {
      for (let [key, value] of Object.entries(ob)) {
        form[key] = value
      }
      studentSignURL.value = previewURL(ob.studentUUID)
      teacherSignURL.value = previewURL(ob.teacherUUID)
      auditorSignURL.value = previewURL(ob.auditorUUID)
      trainingResultsEvent()
    },
    { deep: true, immediate: true },
  )

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
