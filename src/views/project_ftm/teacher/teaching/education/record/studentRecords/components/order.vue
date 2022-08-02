<template>
  <div class="print-wrapper page-break-wrap" ref="printOrder" style="margin-bottom: 20px">
    <table class="print-wrap-table" ref="printTable">
      <thead>
        <tr>
          <th>
            <div class="print-wrap-header">
              <h1>{{ data.title }}</h1>
              <div class="fix-button no-print" data-print="no" v-if="!id">
                <el-button type="primary" @click="Download">{{ $t('button.download') }}</el-button
                ><!-- 下载 -->
                <el-button type="primary" @click="printEvent">{{ $t('button.print') }}</el-button
                ><!-- 打印 -->
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
                  <span class="details-label">{{ $t('table.studentName') }}:</span>{{ data.name }}
                </td>
                <!-- 姓名 -->
                <td>
                  <span class="details-label">{{ $t('table.gender') }}:</span
                  >{{ genderFormat(data.gender) }}
                </td>
                <!-- 性别 -->
                <td colspan="2">
                  <span class="details-label">{{ $t('table.airlines') }}:</span>{{ data.customer }}
                </td>
                <!-- 航空公司 -->
              </tr>
              <tr class="average">
                <td>
                  <span class="details-label">{{ $t('table.trainingYear') }}:</span>{{ data.year }}
                </td>
                <!-- 训练年度 -->
                <td>
                  <span class="details-label">{{ $t('table.classNumber') }}:</span
                  >{{ data.courseNumber }}
                </td>
                <!-- 班级课号 -->
                <td colspan="2">
                  <span class="details-label">{{ $t('table.courseCode') }}:</span
                  >{{ data.courseCode }}
                </td>
                <!-- 课程代号 -->
              </tr>
              <tr class="average">
                <td>
                  <span class="details-label">{{ $t('table.trainDate') }}:</span
                  >{{ data.trainingTime }}
                </td>
                <!-- 训练时间 -->
                <td>
                  <span class="details-label">{{ $t('table.theoryTeacher') }}:</span
                  >{{ data.theoryTeachers }}
                </td>
                <!-- 理论教员 -->
                <td colspan="2">
                  <span class="details-label">{{ $t('table.flightInstructor') }}:</span
                  >{{ data.filghtTeachers }}
                </td>
                <!-- 飞行教员 -->
              </tr>
            </table>
            <table class="details-table">
              <tr class="details-title">
                <td colspan="4">{{ $t('table.assessmentItems') }}</td>
                <!-- 评估项目 -->
              </tr>
              <tr>
                <td class="subtit center c2 point-bg" :rowspan="data.scores.length + 1">
                  {{ $t('table.coreCompetence') }}
                </td>
                <!-- 核心胜任力 -->
                <td class="center c1">{{ $t('common.serialNumber') }}</td>
                <!-- 序号 -->
                <td class="center c3">{{ $t('common.assessmentCriteria') }}</td>
                <!-- 考核标准 -->
                <td class="center c3">{{ $t('table.evaluationCoreCompetence') }}</td>
                <!-- 核心能力评估 -->
              </tr>
              <tr v-for="(item, index) in data.scores" :key="index">
                <td class="center">{{ index + 1 }}</td>
                <td class="center">{{ item.name }}</td>
                <td class="center" colspan="2">
                  <el-rate
                    v-model="item.score"
                    :disabled="true"
                    :allow-half="true"
                    :show-text="true"
                  />
                </td>
              </tr>
              <tr>
                <td class="subtit center c2 point-bg">{{ $t('table.trainingStyleCompetence') }}</td>
                <!-- 作风胜任力 -->
                <td class="center" colspan="3">
                  <el-rate
                    v-model="data.trainingStyleScore"
                    :disabled="orderType < 2"
                    :show-text="orderType < 2"
                  />
                </td>
              </tr>
              <tr>
                <td class="subtit center c2 point-bg">{{ $t('table.psychologyCompetence') }}</td>
                <!-- 心理胜任力 -->
                <td class="center" colspan="3">
                  <el-rate
                    :length="5"
                    v-model="data.psychologyCompetencyScore"
                    :disabled="orderType < 2"
                    :show-text="orderType < 2"
                  />
                </td>
              </tr>
              <!-- 整体素质 -->
              <!-- <tr>
                <td class="subtit center c2">{{ $t('table.overallQuality') }}</td>
                <td class="center" colspan="3">
                    <el-rate v-model="data.overallQualityScore" :disabled="orderType < 2"></el-rate>
                </td>
            </tr> -->
            </table>
            <table class="details-table">
              <tr class="details-title">
                <td colspan="2">{{ $t('table.trainingEvaluation') }}</td>
                <!-- 训练评价 -->
              </tr>
              <tr class="h1" v-if="has_estimate">
                <td colspan="2" style="padding: 0">
                  <table class="cell-table">
                    <tr>
                      <td class="cell-td">PF</td>
                      <td>
                        <template v-if="orderType > 1">
                          <el-input
                            class="cell-input"
                            type="textarea"
                            v-model="data.estimate"
                            :autosize="{ minRows: 3 }"
                            style="width: 100%; height: 100%"
                            :placeholder="$t('holder.pleaseEnter') + $t('table.trainingEvaluation')"
                          />
                        </template>
                        <template v-else>{{ data.estimate }}</template>
                      </td>
                    </tr>
                    <tr>
                      <td class="cell-td">PM</td>
                      <td>
                        <template v-if="orderType > 1">
                          <el-input
                            class="cell-input"
                            type="textarea"
                            v-model="data.evaluation"
                            :autosize="{ minRows: 3 }"
                            style="width: 100%; height: 100%"
                            :placeholder="$t('holder.pleaseEnter') + $t('table.trainingEvaluation')"
                          />
                        </template>
                        <template v-else>{{ data.evaluation }}</template>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr class="h1" v-else>
                <td colspan="2" class="pt">
                  <template v-if="orderType > 1">
                    <el-input
                      class="cell-input"
                      type="textarea"
                      v-model="data.evaluation"
                      :autosize="{ minRows: 3 }"
                      style="width: 100%; height: 100%"
                      :placeholder="$t('holder.pleaseEnter') + $t('table.trainingEvaluation')"
                    />
                  </template>
                  <template v-else>{{ data.evaluation }}</template>
                </td>
              </tr>
              <tr class="details-title">
                <td>{{ $t('table.otherRemark') }}</td>
                <!-- 其他备注 -->
                <td>{{ $t('table.trainingLeader') }}</td>
                <!-- 负责人 -->
              </tr>
              <tr class="h1">
                <td width="80%">
                  <template v-if="orderType > 1">
                    <el-input
                      type="textarea"
                      autosize
                      v-model="data.remark"
                      style="width: 100%; height: 100%"
                      :placeholder="$t('holder.pleaseEnter') + $t('table.otherRemark')"
                    />
                  </template>
                  <template v-else>
                    {{ data.remark }}
                  </template>
                </td>
                <td width="40%" class="center">
                  <div class="sign-img-con">
                    <img class="sign-img" :src="SignImgURL" alt="" v-if="data.signature" />
                    <a
                      href="javascript:;"
                      class="sign-link no-print"
                      @click="signEvent"
                      v-else-if="orderType > 1 && data.status == 'FILLED'"
                      >{{ $t('table.clickSign') }}</a
                    >
                    <span class="sign-error no-print" v-else-if="orderType > 1">{{
                      $t('tip.pleaseSaveBeforeSigning')
                    }}</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import XEUtils from 'xe-utils'
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  import Api from '/@/api/ftm/teacher/trainEva'
  import { studentFinalGetPdf } from '/@/api/ftm/teacher/studentTraining'
  const Interface = {
    status: '', // 填写状态
    title: '', // 训练表名称
    name: '', // 学员姓名
    gender: '', // 性别
    customer: '', // 航空公司
    year: '', // 训练年度
    courseNumber: '', // 班级课号
    courseCode: '', // 课程代号
    trainingTime: '', // 训练时间
    theoryTeachers: '', // 理论教员
    filghtTeachers: '', // 飞行教员
    scores: [], // 项目
    trainingStyleScore: 0, // 训练作风
    psychologyCompetencyScore: 0, // 心理胜任力
    overallQualityScore: 0, // 整体素质
    evaluation: '', // 训练评价
    estimate: '', // 评价 PF
    remark: '', // 其他备注
    signature: '', // 签名
  }
  export default {
    data() {
      return {
        data: XEUtils.clone(Interface, true),
      }
    },
    props: {
      // 表单类型 1：只读 2：编辑
      orderType: {
        type: [String, Number],
        default: 1,
      },
      orderData: {},
      has_estimate: Boolean,
      id: '',
    },
    watch: {
      orderData: {
        deep: true,
        handler(obj) {
          let _data = XEUtils.clone(Interface, true)
          let data = XEUtils.assign(_data, obj)
          this.data = JSON.parse(JSON.stringify(data))
        },
      },
    },
    computed: {
      SignImgURL() {
        return previewURL(this.data.signature)
      },
    },
    mounted() {
      if (this.id) {
        this.getDetails()
      }
    },
    methods: {
      async getDetails() {
        const defaultRemark = this.$t('holder.studentReviewDefaultRemark')
        let { data } = await Api.studentDetails({ id: this.id })
        let { type } = this.$route.query
        let STR = data.studentTrainingRecord
        let clazz = STR.clazz || {}
        let course = clazz.course || {}
        let grouping = STR.grouping || {}
        let student = STR.student || {}
        this.data = {
          status: data.status,
          title: course.name,
          name: student.name,
          gender: student.gender,
          customer: STR.customer.name,
          year: clazz.year,
          courseNumber: clazz.courseNumber,
          courseCode: course.code,
          trainingTime: `${XEUtils.toDateString(
            data.startTime,
            'yyyy/MM/dd',
          )}—${XEUtils.toDateString(data.endTime, 'yyyy/MM/dd')}`,
          theoryTeachers:
            (clazz.theoryTeachers instanceof Array &&
              clazz.theoryTeachers.map((v) => v.name).join(',')) ||
            '',
          filghtTeachers:
            (grouping.teachers instanceof Array &&
              grouping.teachers.map((v) => v.name).join(',')) ||
            '',
          scores: data.scores,
          trainingStyleScore: data.trainingStyleScore,
          psychologyCompetencyScore: data.psychologyCompetencyScore,
          evaluation: data.evaluation,
          remark: type == 'add' ? defaultRemark : data.remark,
          signature: data.signature,
        }
      },
      // 格式化性别
      genderFormat(val) {
        return (
          (val == 'M' && this.$t('common.male')) || (val == 'F' && this.$t('common.female')) || ''
        )
      },
      // 打印
      printEvent() {
        studentFinalGetPdf({ ids: [this.data.id], templateHtml: null })
        // this.$print(this.$refs.printTable,{ currDom: true })
      },
      // 导出
      Download() {
        // this.$getPdf(this.$refs.printOrder, this.data.title)
        studentFinalGetPdf({ ids: [this.data.id], templateHtml: null, download: true })
      },
      // 点击签名
      signEvent() {
        this.$emit('sign')
      },
    },
  }
</script>

<style lang="scss">
  @import '/@/style/print-table.scss';
  @media print {
    .page-break-wrap {
      page-break-after: always; // page-break inside
    }
  }
</style>
