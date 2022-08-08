<template>
  <div>
    <el-scrollbar>
      <Report :data="Order" ref="report" @signEvent="showDialog" />
    </el-scrollbar>
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
        <el-form-item :label="$t('table.pinCode')" prop="pincode">
          <el-input
            type="password"
            v-model.trim="form.pincode"
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
  </div>
</template>

<script>
  import Report from '/@/views/project_ftm/student/components/SignReport/index.vue'
  import { flyTrainEvaDetails, flyTrainSign } from '/@/api/ftm/student/teachingCenter'
  import {
    getStudentTrainingFiles,
    putStudentTrainingFiles,
    flightTrainingGetPdf,
  } from '/@/api/ftm/student/studentTraining'
  import { postUpload } from '/@/api/ftm/student/file'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        signDialogVisible: false,
        loadingDialog: false,
        loadingSubmit: false,
        form: {
          pincode: '',
        },
        pinRules: {
          pincode: [
            { required: true, message: this.$t('holder.pleaseEnterSignPinCode'), trigger: 'click' },
          ],
        },
        Order: {}, // 详情
        printOrder: {},
        clazzId: null,
      }
    },
    components: { Report },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      id() {
        return this.$route.query.id
      },
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        const id = this.$route.query.id
        let [err, res] = await to(flyTrainEvaDetails({ id }))
        if (!err) {
          let data = res.data || {}
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
          this.clazzId = STR.clazz ? STR.clazz.id : null
          this.Order = {
            id: data.id,
            title: STR.clazz.course.name, // 飞行项目
            student: STR.student.name, // 学员姓名
            teacher: data.teacherName || '', // 带飞教员
            airplaneModel: STR.clazz.airplaneType, // 飞机型号
            flyTime: XEUtils.toDateString(data.startTime, 'yyyy-MM-dd'), // 飞行时间
            course: data.name, // 课程
            result: data.result, // 结果
            evaluation: data.evaluation, // 评语
            estimate: data.estimate,
            score: data.scores, // 项目
            exam: data.exam,
            remark: data.remark,
            teacherUUID: data.teacherSignature, // 教员签名
            studentUUID: data.studentSignature, // 学员签名
            auditorUUID: data.auditorSignature,
            courseNumber: STR.clazz.courseNumber,
            version: data.syllabusItem.syllabus.version,
            trainingResultName: data.trainingResult && data.trainingResult.name,
          }
        }
      },
      // 点击取消（签名码）
      handleDialogCancel() {
        this.signDialogVisible = false
      },
      // 点击提交（签名码）
      handDialogConfirm() {
        this.$refs.pinForm.validate((bool) => {
          if (bool) {
            this.loadingDialog = true
            this.setSign()
          }
        })
      },
      showDialog() {
        this.form.pincode = ''
        this.signDialogVisible = true
      },
      // 提交签名pin码
      async setSign() {
        let [err] = await to(flyTrainSign({ id: this.id, pinCode: this.form.pincode }))
        this.loadingDialog = false
        if (!err) {
          this.signDialogVisible = false
          await this.init()
          this.$message.success(this.$t('tip.saveSuccessTip'))
          // this.createPDF()
        }
      },
      // 生成pdf
      createPDF() {
        this.$message({
          message: this.$t('tip.pleaseWaitOfGeneratingPDF'),
          type: 'info',
          iconClass: 'el-icon-loading',
          duration: 60000,
        })
        this.printOrder = XEUtils.clone(this.Order, true)
        let editForm = this.$refs.report.form
        let id = this.id
        this.printOrder.evaluation = editForm.evaluation
        this.printOrder.result = editForm.result
        this.printOrder.score = editForm.score
        this.printOrder.flyTime = editForm.flyTime
        this.printOrder.estimate = editForm.estimate
        let _this = this
        this.$nextTick(() => {
          flightTrainingGetPdf({ ids: [this.Order.id], templateHtml: null }).then((res) => {
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
          })
          return
          // this.$getPdf(this.$refs.print, 'pdf', 'datauristring', (URL) => {
          //   let form = new FormData()
          //   form.append('file', dataURLtoFile(URL, 'generated.pdf'))
          //   form.append('unzip', false)
          //   postUpload(form)
          //     .then((res) => {
          //       this.setPDF(res.data.uuid, id)
          //     })
          //     .catch((e) => {
          //       this.$message.closeAll()
          //       this.$message.error(this.$t('status.uploadFail'))
          //     })
          // })
        })
      },
      // 关联pdf
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
          getStudentTrainingFiles({
            page: 1,
            size: 100,
            studentId: this.userInfo.id,
            clazzId: this.clazzId,
          }),
        )
        if (!err1) {
          let list = res1.data.content
          let item = list.find((v) => v.type == 'FLIGHT_EVALUATION') || {}
          let [err] = await to(putStudentTrainingFiles({ id: item.id, ...params }))
          if (!err) {
            this.$message.closeAll()
            this.$message.success(this.$t('tip.saveSuccessTip'))
          }
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '/@/style/print-pdf.scss';
  .print-area {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }
  .print-page {
    width: 792px;
    padding: 20px;
    background: #fff;
  }
</style>
