<template>
  <div class="container" ref="printDom">
    <div
      class="fix-button no-print"
      data-print="no"
      style="text-align: right; margin-bottom: 10px; margin-right: 30px"
      v-if="ids"
    >
      <el-button type="primary" @click="printEvent">{{ $t('button.batchPrinting') }}</el-button
      ><!-- 打印 -->
    </div>
    <template v-if="!ids">
      <order-table
        v-if="!ids"
        ref="orderTable"
        :orderData="data"
        :orderType="type"
        @sign="signDialogVisible = true"
      />
    </template>
    <template v-else-if="ids instanceof Array && ids.length > 0">
      <order-table v-for="id in ids" :key="id" ref="orderTable" :orderType="type" :id="id" />
    </template>

    <div class="print-box-hide">
      <div class="print-box" id="PrintBox">
        <order-table orderType="1" :orderData="printData" />
      </div>
    </div>

    <!-- 签名码 -->
    <el-dialog
      width="400px"
      top="30vh"
      :modal="false"
      :title="$t('table.sign')"
      v-model="signDialogVisible"
      :close-on-click-modal="false"
      center
    >
      <el-form :inline="true" ref="pinForm" label-width="100px" :model="form">
        <el-form-item
          :label="$t('table.pinCode')"
          prop="pinCode"
          :rules="[
            { required: true, message: this.$t('holder.pleaseEnterSignPinCode'), trigger: 'click' },
          ]"
        >
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

    <fix-footer @confirm="Save" :loading="loading" v-if="type != '1'" />
  </div>
</template>

<script>
  import Api from '/@/api/ftm/teacher/trainEva'
  import {
    getStudentTrainingFiles,
    putStudentTrainingFiles,
    studentFinalGetPdf,
  } from '/@/api/ftm/teacher/studentTraining'
  import { postUpload } from '/@/api/ftm/teacher/file'
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import orderTable from '/@/views/project_ftm/teacher/teaching/education/record/studentRecords/components/order.vue'
  import to from 'await-to-js'
  import XEUtils from 'xe-utils'
  import { ElMessage } from 'element-plus'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        data: {},
        printData: {},
        form: {
          pinCode: '',
        },
        loading: false,
        loadingDialog: false,
        signDialogVisible: false,
        trainingForm: {
          clazzId: undefined,
          studentId: undefined,
        },
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      id() {
        return this.$route.query.id
      },
      recordId() {
        return this.$route.query.recordId
      },
      ids() {
        return this.$route.query.ids && this.$route.query.ids.split(',')
      },
      type() {
        return this.$route.query.type == 'detail' ? 1 : 2
      },
    },
    components: {
      orderTable,
      FixFooter,
    },
    mounted() {
      this.getDetails()
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
        this.trainingForm.clazzId = clazz.id
        this.trainingForm.studentId = student.id
        this.data = {
          id: data.id,
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
      // 打印
      printEvent() {
        this.$print(this.$refs.printDom, { currDom: true })
      },
      // 提交保存
      Save() {
        let { scores, trainingStyleScore, remark, evaluation } = this.$refs.orderTable.data
        if (scores.some((v) => v.score < 1) || trainingStyleScore == 0 || !remark || !evaluation) {
          return ElMessage.error(this.$t('holder.pleaseFillForm'))
        } else {
          this.submit()
        }
      },
      async submit() {
        let data = this.$refs.orderTable.data
        let param = {
          id: this.id,
          evaluation: data.evaluation,
          estimate: '',
          remark: data.remark,
          scores: data.scores,
          trainingStyleScore: data.trainingStyleScore,
          psychologyCompetencyScore: data.psychologyCompetencyScore,
        }
        this.loading = true
        let [err, res] = await to(Api.setStudentDetails(param))
        this.loading = false
        if (!err) {
          if (!this.data.signature) {
            this.signDialogVisible = true
          }
          ElMessage({
            type: 'success',
            duration: 1500,
            message: this.$t('tip.saveSuccessTip'),
          })
          this.getDetails()
          // this.$router.back()
        }
      },
      handleDialogCancel() {
        this.signDialogVisible = false
      },
      async handDialogConfirm() {
        this.loadingDialog = true
        let [err, res] = await to(
          Api.studentRecordsSign({ id: this.id, pinCode: this.form.pinCode }),
        )
        this.loadingDialog = false
        if (!err) {
          this.signDialogVisible = false
          await this.getDetails()
          this.createPDF()
        }
      },
      // 生成pdf
      async createPDF() {
        this.printData = this.data
        ElMessage({
          message: this.$t('tip.pleaseWaitOfGeneratingPDF'),
          type: 'info',
          iconClass: 'el-icon-loading',
          duration: 60000,
        })
        let id = this.id
        let _this = this
        this.$nextTick(() => {
          studentFinalGetPdf({ ids: [this.data.id], templateHtml: null, upload: true }).then(
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
                  ElMessage.closeAll()
                  ElMessage.error(this.$t('status.uploadFail'))
                })
            },
          )
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
        try {
          let [record_err, record_res] = await to(
            getStudentTrainingFiles({
              studentTrainingRecordId: this.recordId,
              type: 'FINAL_EVALUATION',
            }),
          )
          if (record_err || record_res.status != 200) return
          let archives_id = record_res.data.content[0].id
          let [archives_err] = await to(putStudentTrainingFiles({ id: archives_id, ...params }))
          if (!archives_err) {
            ElMessage.closeAll()
            ElMessage.success(this.$t('tip.saveSuccessTip'))
          }
        } catch (e) {
          console.log('上传档案失败')
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/style/print-pdf.scss';
  .print-box-hide {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    .print-box {
      width: 792px;
      :deep(.container) {
        margin: 0 !important;
        height: unset !important;
        font-size: 12px;
      }
      :deep(table) {
        .no-print {
          display: none;
        }
        .sign-link {
          display: none;
        }
        .sign-img {
          max-height: 60px !important;
        }
        .print-wrap-header h1 {
          margin: 6px !important;
          font-size: 16px !important;
        }
        .print-wrap-content {
          padding: 7px 0 !important;
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
    }
  }
</style>
