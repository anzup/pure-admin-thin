<template>
  <div class="container">
    <div class="print-wrapper" ref="printOrder">
      <table class="print-wrap-table">
        <thead>
          <tr>
            <th>
              <div class="print-wrap-header">
                <h1>{{ data.title }}</h1>
                <div class="fix-button no-print" v-if="orderType == 1">
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
                    <span class="details-label">{{ $t('table.studentName') }}：</span
                    >{{ data.name }}
                  </td>
                  <!-- 学员姓名 -->
                  <td>
                    <span class="details-label">{{ $t('table.gender') }}：</span>{{ data.gender }}
                  </td>
                  <!-- 性别 -->
                  <td>
                    <span class="details-label">{{ $t('table.airlines') }}：</span
                    >{{ data.customer }}
                  </td>
                  <!-- 航空公司 -->
                </tr>
                <tr class="average">
                  <!-- <td><span class="details-label">{{ $t('table.trainingYear') }}：</span>{{ data.year }}</td> -->
                  <!-- 训练年度 -->
                  <td>
                    <span class="details-label">{{ $t('table.classNumber') }}：</span
                    >{{ data.courseNumber }}
                  </td>
                  <!-- 班级课号 -->
                  <td>
                    <span class="details-label">{{ $t('table.courseCode') }}：</span
                    >{{ data.courseCode }}
                  </td>
                  <!-- 课程代号 -->
                  <td>
                    <span class="details-label">{{ $t('table.examDate') }}：</span
                    >{{ data.trainingDate }}
                  </td>
                  <!-- 训练时间 -->
                </tr>
                <tr class="average">
                  <td>
                    <span class="details-label">{{ $t('table.RecommendExamTeacher') }}：</span
                    >{{ data.recommendTeacher }}
                  </td>
                  <!-- 推荐考试人 -->
                  <td>
                    <span class="details-label">{{ $t('table.theoryTeacher') }}：</span
                    >{{ data.theoryTeachers }}
                  </td>
                  <!-- 理论教员 -->
                  <td>
                    <span class="details-label">{{ $t('table.flightInstructor') }}：</span
                    >{{ data.flightTeachers }}
                  </td>
                  <!-- 飞行教员 -->
                </tr>
              </table>
              <table class="details-table">
                <tr class="details-title">
                  <td colspan="4">{{ $t('table.assessmentScore') }}</td>
                  <!-- 考核得分 -->
                </tr>
                <tr>
                  <td class="center c1 point-bg">{{ $t('common.serialNumber') }}</td>
                  <!-- 序号 -->
                  <td class="center c2">{{ $t('common.assessmentCriteria') }}</td>
                  <!-- 考核标准 -->
                  <td class="center" style="width: 160px">
                    {{ $t('table.evaluationCoreCompetence') }}
                  </td>
                  <!-- 核心能力评估 -->
                  <td class="center">{{ $t('table.behavioralIndicatorsNoPass') }}</td>
                  <!-- 行为指标不满足项 -->
                </tr>
                <tr v-for="(item, index) in data.scores" :key="item.name">
                  <td class="center point-bg">{{ index + 1 }}</td>
                  <td class="center">{{ item.name }}</td>
                  <td class="center">
                    <el-rate
                      v-model="item.score"
                      :disabled="orderType < 2"
                      :colors="['#FF9900', '#FF9900', '#FF9900']"
                      disabled-void-color="#99A9BF"
                    />
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
                  <td colspan="4">{{ $t('table.assessmentResults') }}</td>
                  <!-- 考核结果 -->
                </tr>
                <tr>
                  <td class="center c1 point-bg">{{ $t('table.assessmentResults') }}</td>
                  <!-- 考核结果 -->
                  <td colspan="3">
                    <template v-if="orderType > 1">
                      <el-radio-group v-model="data.resultType" style="margin-left: 20px">
                        <el-radio label="1">{{ $t('button.pass') }}</el-radio>
                        <el-radio label="2">{{ $t('status.filled') }}</el-radio>
                      </el-radio-group>
                    </template>
                    <template v-else>{{
                      data.result == 'PASS' ? $t('button.pass') : $t('status.filled')
                    }}</template>
                  </td>
                </tr>
                <tr v-if="data.resultType == '2'">
                  <td class="center c1 point-bg">{{ $t('table.disposalOpinions') }}</td>
                  <!-- 处置结果 -->
                  <td colspan="3">
                    <template v-if="orderType > 1">
                      <el-radio-group v-model="data.result" style="margin-left: 20px">
                        <el-radio v-for="item in resultArr" :key="item.id" :label="item.id">{{
                          item.name
                        }}</el-radio>
                      </el-radio-group>
                    </template>
                    <template v-else>
                      {{ formatResultName }}
                    </template>
                  </td>
                </tr>
                <tr class="h1">
                  <td class="center point-bg">{{ $t('table.assessmentEvaluation') }}</td>
                  <!-- 考核评价 -->
                  <td colspan="3">
                    <template v-if="orderType > 1">
                      <el-input
                        class="cell-input"
                        type="textarea"
                        :autosize="{ minRows: 3 }"
                        :placeholder="$t('holder.pleaseEnter') + $t('table.evaluate')"
                        v-model="data.evaluation"
                        style="width: 100%; height: 100%"
                      />
                    </template>
                    <template v-else>{{ data.evaluation }}</template>
                  </td>
                </tr>
                <!-- 备注 -->
                <tr class="h1" v-if="data.remark">
                  <td class="center c1 point-bg">{{ $t('table.remarks') }}</td>
                  <td colspan="3">{{ data.remark }}</td>
                </tr>
                <tr class="details-title">
                  <td colspan="4">{{ $t('table.sign') }}</td>
                  <!-- 签名 -->
                </tr>
                <tr class="h1">
                  <td colspan="4" style="padding: 0">
                    <table
                      class="print-wrap-content details-table"
                      style="width: 100%; height: 100%"
                    >
                      <tr>
                        <td class="center point-bg">{{ $t('table.inspector') }}</td>
                        <!-- 检察员 -->
                        <td class="center" width="350px">
                          <div class="sign-img-con">
                            <template v-if="orderType > 1">
                              <img
                                class="sign-img"
                                :src="teacherSignURL"
                                alt=""
                                v-if="data.teacherUUID"
                              />
                              <a
                                href="javascript:;"
                                class="sign-link no-print"
                                @click="signDialogVisible = true"
                                v-else-if="data.status == 'FILLED'"
                                >{{ $t('table.clickSign') }}</a
                              >
                              <span class="sign-error no-print" v-else>{{
                                $t('tip.pleaseSaveBeforeSigning')
                              }}</span>
                            </template>
                            <template v-else>
                              <img
                                :src="teacherSignURL"
                                alt=""
                                class="sign-img"
                                v-if="data.teacherUUID"
                              />
                            </template>
                          </div>
                        </td>
                        <td class="center c1 point-bg">{{ $t('table.student') }}</td>
                        <!-- 学员 -->
                        <td class="center" width="350px">
                          <img
                            :src="studentSignURL"
                            alt=""
                            class="sign-img"
                            v-if="data.studentUUID"
                          />
                        </td>
                        <template v-if="data.auditorUUID">
                          <td class="center c1 point-bg">{{ $t('table.signer') }}</td>
                          <!-- 签办人 -->
                          <td class="center" width="350px">
                            <img
                              :src="auditorSignURL"
                              alt=""
                              class="sign-img"
                              v-if="data.auditorUUID"
                            />
                          </td>
                        </template>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr v-if="data.resultType == '2'">
                  <td class="center c1 point-bg">{{ $t('table.remarks') }}</td>
                  <!-- 备注 -->
                  <td colspan="3">
                    <template>
                      {{ data.auditRemark }}
                    </template>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 签名码 -->
    <el-dialog
      width="400px"
      top="30vh"
      :title="$t('table.sign')"
      v-model="signDialogVisible"
      :close-on-click-modal="false"
      center
    >
      <el-form :inline="true" ref="pinForm" label-width="100px" :rules="pinRules" :model="form">
        <el-form-item :label="$t('table.pinCode')" prop="pinCode">
          <el-input
            type="password"
            v-model="form.pinCode"
            :placeholder="$t('holder.pleaseEnterSignPinCode')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogCancel" type="primary" plain size="medium">{{
          $t('button.cancel')
        }}</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="handDialogConfirm"
          :loading="loadingDialog"
          >{{ $t('button.confirm') }}</el-button
        >
      </template>
    </el-dialog>

    <fix-footer v-if="orderType > 1" @confirm="Save" :loading="loading" />
  </div>
</template>

<script>
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import XEUtils from 'xe-utils'
  import Api from '/@/api/ftm/teacher/trainEva'
  import { flightExamGetPdf } from '/@/api/ftm/teacher/studentTraining'
  export default {
    components: { FixFooter },
    data() {
      const OrderData = {
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
      }
      return {
        data: OrderData,
        resultArr: [
          // { id: 'PASS', name: this.$t('button.pass') },
          { id: 'ADD_ONE', name: this.$t('status.addOneForExam') },
          { id: 'ADD_TWO', name: this.$t('status.addTwoForExam') },
          { id: 'ABORT', name: this.$t('status.abortTrain') },
        ],
        signDialogVisible: false,
        loading: false,
        loadingDialog: false,
        form: {
          pinCode: '',
        },
        pinRules: {
          pinCode: [
            { required: true, message: this.$t('holder.pleaseEnterSignPinCode'), trigger: 'click' },
          ],
        },
      }
    },
    props: {
      details: {
        type: Object,
        default: () => ({}),
      },
    },
    computed: {
      id() {
        return this.details.id || this.$route.query.id
      },
      // 表单类型 1：只读  2：编辑
      orderType() {
        return (this.$route.query.status == 'FILLED' && 1) || (this.details.status ? 1 : 2)
      },
      teacherSignURL() {
        let uuid = this.data.teacherUUID
        return uuid ? Api.getSignURL(uuid) : ''
      },
      studentSignURL() {
        let uuid = this.data.studentUUID
        return uuid ? Api.getSignURL(uuid) : ''
      },
      auditorSignURL() {
        let uuid = this.data.auditorUUID
        return uuid ? Api.getSignURL(uuid) : ''
      },
      formatResultName() {
        return this.data.result == 'PASS'
          ? ''
          : this.data.trainingResultName
          ? this.data.trainingResultName
          : this.resultArr.some((v) => v.id == this.data.result) &&
            this.resultArr.find((v) => v.id == this.data.result)['name']
      },
    },
    watch: {
      signDialogVisible(bool) {
        if (!bool) {
          this.form.pinCode = ''
        }
      },
    },
    mounted() {
      this.init()
    },
    methods: {
      async init() {
        let { data } = await Api.getFlyExamDetails({ id: this.id })
        let STR = data.studentTrainingRecord
        let student = STR.student
        let clazz = STR.clazz || {}
        let course = clazz.course || {}
        let grouping = student.grouping || {}
        this.data = {
          title: course.name,
          name: student.name,
          gender: (student.gender == 'M' && this.$t('common.male')) || this.$t('common.female'),
          customer: STR.customer.name,
          year: clazz.year,
          courseNumber: clazz.courseNumber,
          courseCode: course.code,
          trainingDate: `${XEUtils.toDateString(
            data.startTime,
            'yyyy/MM/dd',
          )}—${XEUtils.toDateString(data.endTime, 'yyyy/MM/dd')}`,
          theoryTeachers:
            (clazz.theoryTeachers instanceof Array &&
              clazz.theoryTeachers.map((v) => v.name).join(',')) ||
            '',
          flightTeachers:
            (grouping.teachers instanceof Array &&
              grouping.teachers.map((v) => v.name).join(',')) ||
            '',
          scores: data.scores,
          result: data.result,
          resultType:
            data.result == 'PASS'
              ? '1'
              : this.resultArr.some((v) => v.id == data.result)
              ? '2'
              : '',
          evaluation: data.evaluation,
          status: data.status,
          teacherUUID: data.teacherSignature,
          studentUUID: data.studentSignature,
          auditorUUID: data.auditorSignature,
          recommendTeacher: data.recommendTeacher || '',
          trainingResultName: data.trainingResult && data.trainingResult.name,
          remark: '',
        }
      },
      // 提交保存
      Save() {
        let param = {
          id: this.id,
          result: this.data.resultType == '1' ? 'PASS' : this.data.result,
          evaluation: this.data.evaluation,
          scores: this.data.scores,
        }
        this.loading = true
        if (param.scores.some((v) => v.score == 0) || !param.result || !param.evaluation) {
          this.loading = false
          return this.$message.error(this.$t('tip.formNotAllFill'))
        }

        Api.setFlyExamDetails(param)
          .then((res) => {
            this.loading = false
            if (!this.data.teacherUUID) {
              this.signDialogVisible = true
            }
            this.$message({
              type: 'success',
              duration: 1500,
              message: this.$t('tip.saveSuccessTip'),
            })
          })
          .catch((e) => {
            this.loading = false
          })
      },
      // 取消按钮（签名码）
      handleDialogCancel() {
        this.signDialogVisible = false
      },
      // 确定按钮（签名码）
      handDialogConfirm() {
        this.$refs.pinForm.validate((bool) => {
          if (bool) {
            this.loadingDialog = true
            this.setCode().catch(() => {
              this.loadingDialog = false
            })
          }
        })
      },
      // 提交pin码
      async setCode() {
        await Api.setFlyExamSign({ id: this.id, pinCode: this.form.pinCode })
        this.loadingDialog = false
        this.signDialogVisible = false
        this.init()
      },
      // 打印
      printEvent() {
        flightExamGetPdf({ ids: [this.$route.query.id], templateHtml: null })
        // this.$print(this.$refs.printOrder,{ currDom: true })
      },
      // 导出
      Download() {
        // this.$getPdf(this.$refs.printOrder, this.data.title)
        flightExamGetPdf({ ids: [this.$route.query.id], templateHtml: null, download: true })
      },
      getBehavior(val) {
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
      },
    },
  }
</script>

<style lang="scss" scope>
  @import '/@/style/print-table.scss';
</style>
