<template>
  <el-scrollbar>
    <div class="print-wrapper" ref="printOrder">
      <table class="print-wrap-table">
        <thead>
          <tr>
            <th>
              <div class="print-wrap-header">
                <h1>{{ data.title }}</h1>
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
                    <span class="details-label">{{ $t('table.trainDate') }}：</span
                    >{{ data.trainingDate }}
                  </td>
                  <!-- 训练时间 -->
                </tr>
                <tr class="average">
                  <td>
                    <span class="details-label">{{ $t('table.inspector') }}：</span
                    >{{ data.recommendTeacher }}
                  </td>
                  <!-- 检查员 -->
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
                  <td class="center">{{ $t('table.evaluationCoreCompetence') }}</td>
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
                    <template>{{
                      data.result == 'PASS' ? $t('button.pass') : $t('status.filled')
                    }}</template>
                  </td>
                </tr>
                <tr v-if="data.resultType == 2">
                  <td class="center c1 point-bg">{{ $t('table.disposalOpinions') }}</td>
                  <!-- 处置结果 -->
                  <td colspan="3">
                    <template>
                      {{ formatResultName }}
                    </template>
                  </td>
                </tr>
                <!-- 备注 -->
                <tr class="h1" v-if="data.remark">
                  <td class="center c1 point-bg">{{ $t('table.remarks') }}</td>
                  <td colspan="3">{{ data.remark }}</td>
                </tr>
                <tr class="h1">
                  <td class="center point-bg">{{ $t('table.assessmentEvaluation') }}</td>
                  <!-- 考核评价 -->
                  <td colspan="3">
                    <template>{{ data.evaluation }}</template>
                  </td>
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
                        <td class="center c1 point-bg">{{ $t('table.inspector') }}</td>
                        <!-- 检察员 -->
                        <td class="center" width="350px">
                          <div class="sign-img-con">
                            <template>
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
                          <span class="sign-link" v-else @click="signDialogVisible = true">{{
                            $t('table.confirmSign')
                          }}</span>
                        </td>
                        <template v-if="data.auditorUUID">
                          <td class="center c1 point-bg">{{ $t('table.signerSign') }}</td>
                          <!-- 签办人 -->
                          <td class="center" width="350px">
                            <div class="sign-img-con">
                              <img :src="auditorSignURL" alt="" class="sign-img" />
                            </div>
                          </td>
                        </template>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
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

    <div class="print-box-hide">
      <div class="print-box print-page" id="PrintWrapper" />
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
  </el-scrollbar>
</template>

<script>
  import { getFlyExamDetails, setFlyExamSign, getSignURL } from '/@/api/ftm/student/teachingCenter'
  import {
    getStudentTrainingFiles,
    putStudentTrainingFiles,
    flightExamGetPdf,
  } from '/@/api/ftm/student/studentTraining'
  import { postUpload } from '/@/api/ftm/student/file'
  import { dataURLtoFile } from '/@/utils/index'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      const OrderData = {
        id: null,
        title: '', // 训练名
        name: '', // 学员姓名
        gender: '', // 学员性别
        customer: '', // 航空公司
        recommendTeacher: '',
        year: '', // 训练年度
        courseNumber: '', // 班级课号
        courseCode: '', // 课程代号
        trainingDate: '', // 训练时间
        theoryTeachers: '', // 理论教员
        flightTeachers: '', // 飞行教员
        scores: [], // 考核得分
        result: '', // 考核结果
        evaluation: '', // 考核评价
        estimate: '',
        teacherUUID: '', // 教员签名id
        studentUUID: '', // 学员签名id
        auditorUUID: '',
        trainingResultName: '',
        remark: '',
      }
      return {
        data: OrderData,
        resultArr: [
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
            { required: true, message: this.$t('holder.pleaseEnterPincode'), trigger: 'click' },
          ],
        },
        trainingForm: {
          clazzId: undefined,
          studentId: undefined,
        },
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      id() {
        return this.$route.query.id
      },
      // 表单类型 1：只读  2：编辑
      orderType() {
        return (this.$route.query.status == 'FILLED' && 1) || 2
      },
      teacherSignURL() {
        let uuid = this.data.teacherUUID
        return uuid ? getSignURL(uuid) : ''
      },
      studentSignURL() {
        let uuid = this.data.studentUUID
        return uuid ? getSignURL(uuid) : ''
      },
      auditorSignURL() {
        let uuid = this.data.auditorUUID
        return uuid ? getSignURL(uuid) : ''
      },
      formatResultName() {
        return this.data.trainingResultName
          ? this.data.trainingResultName
          : this.resultArr.some((v) => v.id == this.data.result)
          ? this.resultArr.find((v) => v.id == this.data.result)['name']
          : ''
      },
    },
    watch: {
      signDialogVisible(bool) {
        if (!bool) {
          this.form.pinCode = ''
        }
      },
      userInfo: {
        immediate: true,
        deep: true,
        handler(obj) {
          if (obj.id) {
            this.trainingForm.studentId = obj.id
          }
        },
      },
    },
    mounted() {
      this.init()
    },
    methods: {
      async init() {
        let { data } = await getFlyExamDetails({ id: this.id })
        let STR = data.studentTrainingRecord
        let student = STR.student
        let clazz = STR.clazz || {}
        let course = clazz.course || {}
        let grouping = STR.grouping || {}
        this.trainingForm.clazzId = clazz.id
        this.data = {
          id: data.id,
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
          evaluation: data.evaluation,
          estimate: data.estimate,
          recommendTeacher: data.inspector || '',
          teacherUUID: data.teacherSignature,
          studentUUID: data.studentSignature,
          auditorUUID: data.auditorSignature,
          auditRemark: data.auditRemark,
          resultType: this.setResultType(data.result),
          trainingResultName: data.trainingResult && data.trainingResult.name,
          remark: data.remark,
        }
      },
      // 返回上页
      Back() {
        this.$router.back()
      },
      // 提交保存
      Save() {
        let param = {
          id: this.id,
          result: this.data.result,
          evaluation: this.data.evaluation,
          estimate: this.data.estimate,
          scores: this.data.scores,
        }
        this.loading = true
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
        let [err] = await to(setFlyExamSign({ id: this.id, pinCode: this.form.pinCode }))
        this.loadingDialog = false
        if (!err) {
          this.signDialogVisible = false
          await this.init()
          // this.createPDF()
          this.$message.success(this.$t('tip.saveSuccessTip'))
        }
      },
      // 打印
      printEvent() {
        this.$print(this.$refs.printOrder, { currDom: true })
      },
      // 导出
      Download() {
        this.$htmlToPdf(this.$refs.printOrder, this.data.title)
      },
      // 拷贝生成pdf
      createPDF() {
        this.$message({
          message: this.$t('tip.pleaseWaitOfGeneratingPDF'),
          type: 'info',
          iconClass: 'el-icon-loading',
          duration: 60000,
        })
        let _this = this
        this.$nextTick(() => {
          let id = this.id
          flightExamGetPdf({ ids: [this.data.id], templateHtml: null, download: true }).then(
            (res) => {
              let form = new FormData()
              var blob = new Blob([res.data])
              form.append(
                'file',
                new window.File([blob], `${new Date().getTime()}.pdf`, { type: 'application/pdf' }),
              )
              postUpload(form)
                .then((rr) => {
                  _this.setPDF(rr.data.uuid, id)
                })
                .catch((e) => {
                  _this.$message.closeAll()
                  _this.$message.error(this.$t('status.uploadFail'))
                })
            },
          )
          return
          let origin_dom = document.querySelector('.print-wrap-table').cloneNode(true)
          document.getElementById('PrintWrapper').append(origin_dom)
          setTimeout(() => {
            let dom = document.getElementById('PrintWrapper')
            this.$getPdf(dom, '', 'datauristring', (url) => {
              let form = new FormData()
              form.append('file', dataURLtoFile(url, 'generated.pdf'))
              postUpload(form)
                .then((res) => {
                  _this.setPDF(res.data.uuid, id)
                })
                .catch((e) => {
                  this.$message.closeAll()
                  this.$message.error(this.$t('status.uploadFail'))
                })
            })
          }, 500)
        })
      },
      // pdf关联档案
      async setPDF(uuid, id) {
        let params = {
          generateFiles: [
            {
              fileUuid: uuid,
              sourceId: id,
            },
          ],
        }
        let [err1, res1] = await to(
          getStudentTrainingFiles({ page: 1, size: 100, ...this.trainingForm }),
        )
        if (!err1) {
          let list = res1.data.content
          let item = list.find((v) => v.type == 'FLIGHT_EXAM_RECORD') || {}
          let [err] = await to(putStudentTrainingFiles({ id: item.id, ...params }))
          if (!err) {
            this.$message.closeAll()
            this.$message.success(this.$t('tip.saveSuccessTip'))
          }
        }
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
      setResultType(value) {
        switch (value) {
          case 'PASS':
            return 1
          case 'ADD_ONE':
            return 2
          case 'ADD_TWO':
            return 2
          case 'ABORT':
            return 2
        }
      },
    },
  }
</script>

<style lang="scss" scope>
  @import '/@/style/print-table.scss';
  @import '/@/style/print-pdf.scss';
  .print-box-hide {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    .print-box {
      width: 792px;
      padding: 0 10px;
      margin: 0;
      box-sizing: border-box;
      background: #fff;
      font-size: 12px;
      .sign-link {
        display: none;
      }
      .sign-img {
        max-height: 60px !important;
      }
    }
    .print-wrap-header h1 {
      margin: 6px !important;
      font-size: 16px !important;
      text-align: center;
    }
    .details-table:nth-of-type(2) tr:not([class^='details-title']) td:first-child {
      width: 8%;
    }
    tr {
      height: 30px !important;
      &.details-title {
        height: 36px !important;
        td {
          font-size: 14px !important;
        }
      }
      &.h1 {
        height: 36px !important;
      }
    }
  }
</style>
