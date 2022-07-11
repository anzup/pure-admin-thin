<template>
  <div class="container">
    <div class="print-wrapper" ref="printOrder">
      <table class="print-wrap-table">
        <thead>
          <tr>
            <th>
              <div class="print-wrap-header">
                <h1>{{ state.data.title }}</h1>
                <div class="fix-button no-print" v-if="orderType == 1">
                  <el-button type="primary" @click="Download">{{ $t('text.download') }}</el-button>
                  <!-- 下载 -->
                  <el-button type="primary" @click="printEvent">{{ $t('text.print') }}</el-button>
                  <!-- 打印 -->
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="print-wrap-content">
              <table class="details-table">
                <tr class="average">
                  <td>
                    <span class="details-label">{{ $t('text.student_name') }}：</span>
                    {{ state.data.name }}
                  </td>
                  <!-- 学员姓名 -->
                  <td>
                    <span class="details-label">{{ $t('text.gender') }}：</span>
                    {{ state.data.gender }}
                  </td>
                  <!-- 性别 -->
                  <td>
                    <span class="details-label">{{ $t('text.airline_company') }}：</span>
                    {{ state.data.customer }}
                  </td>
                  <!-- 航空公司 -->
                </tr>
                <tr class="average">
                  <td>
                    <span class="details-label">{{ $t('text.class_number') }}：</span>
                    {{ state.data.courseNumber }}
                  </td>
                  <!-- 班级课号 -->
                  <td>
                    <span class="details-label">{{ $t('text.course_project_code') }}：</span>
                    {{ state.data.courseCode }}
                  </td>
                  <!-- 课程代号 -->
                  <td>
                    <span class="details-label">{{ $t('text.training_time') }}：</span>
                    {{ state.data.trainingDate }}
                  </td>
                  <!-- 训练时间 -->
                </tr>
                <tr class="average">
                  <td>
                    <span class="details-label">{{ $t('text.recommend_the_examiner') }}：</span>
                    {{ state.data.recommendTeacher }}
                  </td>
                  <!-- 推荐考试人 -->
                  <td>
                    <span class="details-label">{{ $t('text.theory_teacher') }}：</span>
                    {{ state.data.theoryTeachers }}
                  </td>
                  <!-- 理论教员 -->
                  <td>
                    <span class="details-label">{{ $t('text.flight_instructor') }}：</span>
                    {{ state.data.flightTeachers }}
                  </td>
                  <!-- 飞行教员 -->
                </tr>
              </table>
              <table class="details-table">
                <tr class="details-title">
                  <td colspan="4">{{ $t('text.assessment_score') }}</td>
                  <!-- 考核得分 -->
                </tr>
                <tr>
                  <td class="center c1 point-bg">{{ $t('text.seq') }}</td>
                  <!-- 序号 -->
                  <td class="center c2">{{ $t('text.assessment_criteria') }}</td>
                  <!-- 考核标准 -->
                  <td class="center" style="width: 160px">
                    {{ $t('text.core_competency_assessment') }}
                  </td>
                  <!-- 核心能力评估 -->
                  <td class="center">
                    {{ $t('text.the_behavior_metric_does_not_satisfy_the_item') }}
                  </td>
                  <!-- 行为指标不满足项 -->
                </tr>
                <tr v-for="(item, index) in state.data.scores" :key="item.name">
                  <td class="center point-bg">{{ index + 1 }}</td>
                  <td class="center">{{ item.name }}</td>
                  <td class="center">
                    <el-rate
                      :length="5"
                      v-model="item.score"
                      :disabled="orderType < 2"
                      :colors="['#FF9900', '#FF9900', '#FF9900']"
                      disabled-void-color="#99A9BF"
                    />
                    <!-- disabled-void-icon-class="vm-rate-icon-custome" -->
                  </td>
                  <td class="center">
                    <div class="behavior-line">
                      <span v-if="item.score <= 3">{{ getBehavior(item.behavior) }}</span>
                      <span v-if="item.score > 3">{{ (item.behavior = '') }}</span>
                    </div>
                  </td>
                </tr>
              </table>
              <table class="details-table">
                <tr class="details-title">
                  <td colspan="4">{{ $t('text.assessment_results') }}</td>
                  <!-- 考核结果 -->
                </tr>
                <tr>
                  <td class="center c1 point-bg">{{ $t('text.assessment_results') }}</td>
                  <!-- 考核结果 -->
                  <td colspan="3">
                    <template v-if="orderType > 1">
                      <el-radio-group v-model="state.data.resultType" style="margin-left: 20px">
                        <el-radio label="1">{{ $t('text.pass') }}</el-radio>
                        <el-radio label="2">{{ $t('text.filled') }}</el-radio>
                      </el-radio-group>
                    </template>
                    <template v-else>{{
                      state.data.result == 'PASS' ? $t('text.pass') : $t('text.filled')
                    }}</template>
                  </td>
                </tr>
                <tr v-if="state.data.resultType == '2'">
                  <td class="center c1 point-bg">{{ $t('text.disposal_results') }}</td>
                  <!-- 处置结果 -->
                  <td colspan="3">
                    <template v-if="orderType > 1">
                      <el-radio-group v-model="state.data.result" style="margin-left: 20px">
                        <el-radio v-for="item in state.resultArr" :key="item.id" :label="item.id">{{
                          item.name
                        }}</el-radio>
                      </el-radio-group>
                    </template>
                    <template v-else>{{ formatResultName }}</template>
                  </td>
                </tr>
                <tr class="h1">
                  <td class="center point-bg">{{ $t('text.assessment_and_evaluation') }}</td>
                  <!-- 考核评价 -->
                  <td colspan="3">
                    <template v-if="orderType > 1">
                      <el-input
                        class="cell-input"
                        type="textarea"
                        :autosize="{ minRows: 3 }"
                        :placeholder="$t('text.please_enter')"
                        v-model="state.data.evaluation"
                        style="width: 100%; height: 100%"
                      />
                    </template>
                    <template v-else>{{ state.data.evaluation }}</template>
                  </td>
                </tr>
                <!-- 备注 -->
                <tr class="h1" v-if="state.data.remark">
                  <td class="center c1 point-bg">{{ $t('text.remarks') }}</td>
                  <td colspan="3">{{ state.data.remark }}</td>
                </tr>
                <tr class="details-title">
                  <td colspan="4">{{ $t('text.signature') }}</td>
                  <!-- 签名 -->
                </tr>
                <tr class="h1">
                  <td colspan="4" style="padding: 0">
                    <table
                      class="print-wrap-content details-table"
                      style="width: 100%; height: 100%"
                    >
                      <tr>
                        <td class="center point-bg">{{ $t('text.inspectors') }}</td>
                        <!-- 检察员 -->
                        <td class="center" width="350px">
                          <div class="sign-img-con">
                            <template v-if="orderType > 1">
                              <img
                                class="sign-img"
                                :src="teacherSignURL"
                                v-if="state.data.teacherUUID"
                              />
                              <a
                                href="javascript:;"
                                class="sign-link no-print"
                                @click="state.signDialogVisible = true"
                                v-else-if="state.data.status == 'FILLED'"
                                >{{ $t('text.click_sign') }}</a
                              >
                              <span class="sign-error no-print" v-else>{{
                                $t('text.pleaseSaveBeforeSigning')
                              }}</span>
                            </template>
                            <template v-else>
                              <img
                                :src="teacherSignURL"
                                class="sign-img"
                                v-if="state.data.teacherUUID"
                              />
                            </template>
                          </div>
                        </td>
                        <td class="center c1 point-bg">{{ $t('text.student') }}</td>
                        <!-- 学员 -->
                        <td class="center" width="350px">
                          <img
                            :src="studentSignURL"
                            class="sign-img"
                            v-if="state.data.studentUUID"
                          />
                        </td>
                        <template v-if="state.data.auditorUUID">
                          <td class="center c1 point-bg">{{ $t('text.signatories') }}</td>
                          <!-- 签办人 -->
                          <td class="center" width="350px">
                            <img
                              :src="auditorSignURL"
                              class="sign-img"
                              v-if="state.data.auditorUUID"
                            />
                          </td>
                        </template>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr v-if="state.data.resultType == '2'">
                  <td class="center c1 point-bg">{{ $t('text.remarks') }}</td>
                  <!-- 备注 -->
                  <td colspan="3">
                    <template>{{ state.data.auditRemark }}</template>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import XEUtils from 'xe-utils'
  import { previewURL } from '/@/api/opm/file'
  import { getFlightExamRecordsDetail, postFlightExamRecordsGenPdf } from '/@/api/opm/train'
  import { computed, onMounted, reactive, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'
  import { toPdf } from '/@/utils/print'
  import { convertResBlob } from '/@/utils/utils'
  const { t } = useI18n()

  const state = reactive({
    data: {
      title: '', // 训练名
      name: '', // 学员姓名
      gender: '', // 学员性别
      customer: '', // 航空公司
      year: '', // 训练年度
      courseNumber: '', // 班级课号
      courseCode: '', // 课程代号
      trainingDate: '', // 训练时间
      theoryTeachers: '', // 理论教员
      flightTeachers: '', // 飞行教员
      recommendTeacher: '', // 推荐考试人
      scores: [], // 考核得分
      result: '', // 考核结果
      resultType: '', // 考核类型 #1 通过 #2 未通过
      status: '', // 填写状态
      evaluation: '', // 考核评价 PM
      teacherUUID: '', // 教员签名id
      studentUUID: '', // 学员签名id
      auditorUUID: '',
      trainingResultName: '',
      remark: '',
      auditRemark: undefined,
    },
    resultArr: [
      // { id: 'PASS', name: this.$t('button.pass') },
      { id: 'ABORT', name: t('text.discontinue') },
      { id: 'ADD_ONE', name: t('text.one_more_training_session') },
      { id: 'ADD_TWO', name: t('text.two_additional_training_sessions') },
    ],
    signDialogVisible: false,
    loading: false,
    loadingDialog: false,
    form: {
      pinCode: '',
    },
    pinRules: {
      pinCode: [{ required: true, message: t('text.please_enter'), trigger: 'click' }],
    },
  })

  const props = defineProps({
    details: {
      type: Object,
      default: () => ({}),
    },
  })
  const route = useRoute()
  const id = computed(() => {
    return props.details.id || route.params.id
  })
  // 表单类型 1：只读  2：编辑
  const orderType = computed(() => {
    return (route.params.status == 'FILLED' && 1) || (props.details.status ? 1 : 2)
  })
  const teacherSignURL = computed(() => {
    let uuid = state.data.teacherUUID
    return uuid ? previewURL(uuid) : ''
  })
  const studentSignURL = computed(() => {
    let uuid = state.data.studentUUID
    return uuid ? previewURL(uuid) : ''
  })
  const auditorSignURL = computed(() => {
    let uuid = state.data.auditorUUID
    return uuid ? previewURL(uuid) : ''
  })
  const formatResultName = computed(() => {
    return state.data.result == 'PASS'
      ? ''
      : state.data.trainingResultName
      ? state.data.trainingResultName
      : state.resultArr.some((v) => v.id == state.data.result) &&
        state.resultArr.find((v) => v.id == state.data.result)['name']
  })
  watch(
    () => state.signDialogVisible,
    (val) => {
      if (!val) {
        state.form.pinCode = ''
      }
    },
  )

  async function init() {
    let [err, res] = await to(getFlightExamRecordsDetail(id.value))
    if (!err) {
      const { data } = res
      let STR = data.studentTrainingRecord
      let student = STR.student
      let clazz = STR.clazz || {}
      let course = clazz.course || {}
      let grouping = student.grouping || {}
      state.data = {
        title: course.name,
        name: student.name,
        gender: (student.gender == 'M' && t('text.male')) || t('text.female'),
        customer: STR.customer.name,
        year: clazz.year,
        courseNumber: clazz.courseNumber,
        courseCode: course.code,
        trainingDate: `${XEUtils.toDateString(data.startTime, 'yyyy/MM/dd')}—${XEUtils.toDateString(
          data.endTime,
          'yyyy/MM/dd',
        )}`,
        theoryTeachers:
          (clazz.theoryTeachers instanceof Array &&
            clazz.theoryTeachers.map((v) => v.name).join(',')) ||
          '',
        flightTeachers:
          (grouping.teachers instanceof Array && grouping.teachers.map((v) => v.name).join(',')) ||
          '',
        scores: data.scores,
        result: data.result,
        resultType:
          data.result == 'PASS' ? '1' : state.resultArr.some((v) => v.id == data.result) ? '2' : '',
        evaluation: data.evaluation,
        status: data.status,
        teacherUUID: data.teacherSignature,
        studentUUID: data.studentSignature,
        auditorUUID: data.auditorSignature,
        recommendTeacher: data.recommendTeacher || '',
        trainingResultName: data.trainingResult?.name,
        remark: '',
        auditRemark: data.auditRemark,
      }
    }
  }

  // 打印
  function printEvent() {
    postFlightExamRecordsGenPdf({ ids: [+route.params.id], templateHtml: null }).then((res) => {
      toPdf(res)
    })
  }
  // 导出
  function Download() {
    postFlightExamRecordsGenPdf({ ids: [+route.params.id], templateHtml: null }).then((res) => {
      convertResBlob(res)
    })
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
  onMounted(() => {
    init()
  })
</script>

<style lang="scss" scope>
  @import '/@/style/print-table.scss';
</style>
