<template>
  <div>
    <VxeTable
      ref="xTable"
      :loading="loading"
      :data="tableData"
      :columns="tableColumns"
      :buttons="tableButtons"
      v-model:form="pagination"
      :toolbarConfig="tableTools"
      :checkbox-config="{ checkMethod: checkedDisabled }"
      @sort-change="sortChangeEvent"
      @checkbox="selectChangeEvent"
      @handlePageChange="handlePagination"
    >
      <template #form>
        <el-form ref="form" :model="form" :inline="true" size="medium">
          <el-form-item :label="$t('table.examIdentity')">
            <el-select
              v-model="form.studentType"
              :placeholder="$t('holder.pleaseSelect')"
              style="width: 160px"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in examIdentityList"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              :placeholder="$t('holder.pleaseEnterTheNameOfTheCandidate')"
              v-model="form.searchKey"
              style="width: 280px"
            >
              <template #suffix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #right_tools>
        <el-button size="mini" type="primary" @click="exportList">{{
          $t('button.leadingOut')
        }}</el-button>
        <el-button size="mini" type="primary" :disabled="records.length == 0" @click="allSign">{{
          $t('button.batchSignature')
        }}</el-button>
        <el-button size="mini" type="primary" :disabled="records.length == 0" @click="allPrint">{{
          $t('button.batchPrinting')
        }}</el-button>
      </template>
    </VxeTable>

    <div class="print-box-hide">
      <div class="print-box" id="PrintBox">
        <component v-if="printId" :is="'SchoolReport'" :pid="printId" @complateDrawing="genPdf" />
      </div>
    </div>

    <review-dialog ref="review" v-model="reviewDialogVisible" @confirm="setReview" />

    <sign-dialog
      v-model:loadingDialog="loadingDialog"
      v-model="signDialogVisible"
      @handleConfirm="submitSign"
    />

    <!-- 上传进度条 -->
    <el-dialog
      :title="$t('button.uploadProgressBar')"
      v-model="showProgressDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
      width="500px"
    >
      <div class="dialogBox">
        <div style="width: 30%">{{ $t('common.fileGenerateProgress') }}:</div>
        <div style="width: 70%">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="uploadProgress ? Number((uploadProgress * 100).toFixed(0)) : 0"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getExamRecords,
    putExamRecordsId,
    postExamRecordsSign,
    exportExamRecords,
  } from '/@/api/ftm/teacher/examCenter'
  import {
    getStudentTrainingFiles,
    putStudentTrainingFiles,
  } from '/@/api/ftm/teacher/studentTraining'
  import { postUpload } from '/@/api/ftm/teacher/file'
  import { dataURLtoFile } from '/@/utils/index'
  import reviewDialog from './components/reviewDialog.vue'
  import signDialog from '/@/views/project_ftm/teacher/components/SignDialog/index.vue'
  import SchoolReport from './schoolReport.vue'
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { htmlToPdf } from '/@/utils/htmlToPdf'
  import { deleteEmptyParams } from '/@/utils'
  const userStore = useFtmUserStore()
  export default {
    name: 'ExamDetails',
    data() {
      return {
        form: {
          sort: undefined,
          order: 'asc',
          studentType: undefined,
          searchKey: undefined,
          examId: undefined,
          examType: '',
        },
        tableData: [],
        tableAllData: [],
        examIdentityList: [
          { id: 'SYSTEM', name: this.$t('status.systemCandidates') },
          { id: 'TEMPORARY', name: this.$t('status.temporaryCandidates') },
        ],
        loading: false,
        loadingDialog: false,
        records: [],
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
        reviewDialogVisible: false,
        signDialogVisible: false,
        review: {},
        printId: null,
        uploadComplate: 0, // 上传完成数量
        uploadLength: 0, // 上传数量
        showProgressDialog: false,
        origin: '', // 来源 'other'：其他考试
        sortObj: {},
      }
    },
    components: {
      VxeTable,
      reviewDialog,
      signDialog,
      SchoolReport,
      Search,
    },
    created() {
      this.formInit()
      this.getAllExamRecords()
      this.getExamRecordsEvent()
    },
    // activated() {
    //   this.formInit()
    //   this.getExamRecords()
    // },
    computed: {
      userInfo() {
        return userStore.$state
      },
      id() {
        return this.$route.params.examId
      },
      uploadProgress() {
        try {
          const num = (this.uploadComplate / this.uploadLength).toFixed(2)
          return Number.isNaN(Number(num)) ? 0 : num
        } catch (e) {
          return 0
        }
      },
      xTable() {
        try {
          return this.$refs.xTable.$refs.xTable
        } catch (e) {
          return {}
        }
      },
      recordIds() {
        return this.records.map((v) => v.id)
      },
      tableColumns() {
        return [
          this.origin == 'OTHER' ? null : { type: 'checkbox', width: '40' },
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'student.name', title: this.$t('table.name'), minWidth: 120 },
          {
            field: 'student.gender',
            title: this.$t('table.gender'),
            formatter: this.formatGender,
            width: 90,
          },
          { field: 'student.phone', title: this.$t('table.cellPhoneNumber'), width: 120 },
          {
            field: 'student.type',
            title: this.$t('table.examIdentity'),
            formatter: this.formatType,
            width: 120,
          },
          {
            field: 'status',
            title: this.$t('table.submissionStatus'),
            formatter: this.formatStatus,
            width: 120,
          },
          {
            field: 'endDate',
            title: this.$t('table.handInTime'),
            formatter: this.formatDate,
            sortable: true,
            width: 150,
          },
          {
            field: 'totalScore',
            title: this.$t('table.totalAchievement'),
            width: 100,
            sortable: true,
          },
          {
            field: 'passType',
            title: this.$t('table.examResults'),
            formatter: this.formatPassType,
            width: 100,
          },
          {
            field: 'scoreStatus',
            title: this.$t('table.markingStatus'),
            formatter: this.formatScoreStatus,
            width: 90,
          },
          {
            field: 'auditStatus',
            title: this.$t('table.checkPaperReview'),
            formatter: this.formatReview,
            width: 120,
          },
          {
            field: 'isSignature',
            title: this.$t('table.isSignature'),
            formatter: this.formatBoolean,
            width: 120,
          },
          { title: this.$t('table.tableEdit'), width: 300, slots: { default: 'operate' } },
        ].filter((item) => Boolean(item))
      },
      tableTools() {
        let tools = {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        }
        return this.origin != 'FORMAL' ? null : tools
      },
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      formInit() {
        this.form.examType = (() => {
          const EXAM_TYPS = ['FORMAL', 'SIMULATED']
          const EXAM_TYPE = this.$route.query.examType || this.$route.meta.params?.origin
          return (EXAM_TYPS.includes(EXAM_TYPE) && EXAM_TYPE) || 'FORMAL'
        })()
        this.form.examId = this.$route.params.examId
        this.origin = this.$route.query.origin || this.$route.meta?.params?.origin
      },
      // 选择行
      selectChangeEvent({ records, checked }) {
        if (checked) {
          this.tableData.forEach((row) => {
            if (this.recordIds.includes(row.id) && !!records.find((v) => v.id == row.id) == false) {
              this.records.splice(
                this.recordIds.findIndex((id) => row.id == id),
                1,
              )
            } else if (
              !this.recordIds.includes(row.id) &&
              !!records.find((v) => v.id == row.id) == true
            ) {
              this.records.push(row)
            }
          })
        } else {
          const cancelList = this.tableData.filter(
            (row) => !!records.find((v) => v.id == row.id) == false,
          )
          this.records = this.records.filter(
            (row) => !!cancelList.find((v) => v.id == row.id) == false,
          )
        }
      },
      // 全选/全不选
      selectAllEvent({ records }) {
        this.records = records
      },
      // 分页
      handlePagination({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getExamRecordsEvent()
      },
      async getAllExamRecords() {
        this.loading = true
        let [err, res] = await to(
          getExamRecords({
            ...this.form,
            page: 1,
            size: 1000,
            maxScore: true,
          }),
        )
        this.loading = false
        if (!err && res.status == 200) {
          this.tableAllData = res.data.content
        }
      },
      async getExamRecordsEvent() {
        this.loading = true
        let [err, res] = await to(
          getExamRecords({
            ...this.form,
            page: this.pagination.page,
            size: this.pagination.size,
            order: this.sortObj.order,
            sort: this.sortObj.sort,
            maxScore: true,
          }),
        )
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.pagination.total = res.data.totalElements
          this.xTable.setCheckboxRow(
            this.tableData.filter((row) => !!this.recordIds.find((id) => id == row.id)),
            true,
          )
        }
      },
      markingPapers(id, name, examName, duration, status, scoreStatus) {
        if (status == 'FINISHED' && scoreStatus == 'NOT_SCORED') {
          const params = this.$route.params
          let url = ''
          if (this.origin == 'FORMAL') {
            url = `release/examDetails/${params?.examId}/markingPaperView`
          } else {
            url = `mock/examDetails/${params?.examId}/markingPaperView`
          }
          let query = {
            id: id,
            name: name,
            detail_id: this.id,
            examName: examName,
            duration: duration,
          }
          query = deleteEmptyParams(query)
          url += '?'
          for (let [key, value] of Object.entries(query)) {
            url += `${key}=${value}&`
          }
          url = url.substring(0, url.length - 1)
          this.routerGo(url)
        }
      },
      examPaper(id, name, examName, duration) {
        const params = this.$route.params
        let url = `${params.examId}/examPaperView`
        // 考卷id：detail_id
        let query = {
          id: id,
          name: name,
          examName: examName,
          duration: duration,
          detail_id: this.id,
        }
        query = deleteEmptyParams(query)
        url += '?'
        for (let [key, value] of Object.entries(query)) {
          url += `${key}=${value}&`
        }
        url = url.substring(0, url.length - 1)
        this.routerGo(url)
      },
      reportCard(id, status) {
        const params = this.$route.params
        if (status == 'NOT_SCORED') {
          return false
        }
        if (this.origin == 'OTHER') {
          this.routerGo(`/teaching/exam/record/examDetails/${params.examId}/schoolReport?id=${id}`)
        } else if (this.origin == 'FORMAL') {
          this.routerGo(`/myJob/exam/release/examDetails/${params.examId}/schoolReport?id=${id}`)
        } else {
          this.$routerGo(
            `/myJob/exam/release/examDetails/${params.examId}/schoolReport?id=${id}&detail_id=${this.id}`,
          )
        }
      },
      printTranscripts(id, status) {
        if (status !== 'NOT_SCORED') {
          return false
        }
      },
      // 审核考试
      reviewPaper(row) {
        this.review = row
        this.reviewDialogVisible = true
      },
      async setReview(form) {
        let seconds = form.time * 60 * 60
        let params = {
          id: this.review.id,
          auditStatus: form.type == '1' ? 'APPROVED' : 'REJECTED',
          auditValidSeconds: form.type == '1' ? seconds : undefined,
          auditRejectReason: form.type == '2' ? form.mark : undefined,
        }
        let [err] = await to(putExamRecordsId(params))
        if (!err) {
          this.reviewDialogVisible = false
          this.$message.success(this.$t('tip.setsuccessTip'))
          this.getExamRecordsEvent()
        }
      },
      formatType({ cellValue }) {
        return cellValue == 'SYSTEM'
          ? this.$t('status.systemCandidates')
          : this.$t('status.temporaryCandidates')
      },
      formatStatus({ cellValue }) {
        if (cellValue == 'EXAMING') {
          return this.$t('status.inTheExam')
        } else if (cellValue == 'FINISHED') {
          return this.$t('status.examFinished')
        } else if (cellValue == 'MISSED') {
          return this.$t('status.absentFromTheExam')
        } else {
          return this.$t('status.notStarted')
        }
      },
      formatPassType({ cellValue }) {
        if (cellValue == 'PASS') {
          return this.$t('status.pass')
        } else if (cellValue == 'FAILED') {
          return this.$t('status.failed')
        }
      },
      formatScoreStatus({ cellValue }) {
        return cellValue == 'NOT_SCORED' ? this.$t('status.noMarking') : this.$t('status.checked')
      },
      formatGender({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      formatReview({ cellValue }) {
        switch (cellValue) {
          case 'APPROVED':
            return this.$t('common.isReviewed')
          case 'NOT_REQUESTED':
            return this.$t('common.notApplied')
          case 'REJECTED':
            return this.$t('common.isRejected')
          case 'WAITING_APPROVAL':
            return this.$t('common.applying')
          default:
            return ''
        }
      },
      formatBoolean({ cellValue }) {
        return cellValue ? this.$t('common.yes') : this.$t('common.no')
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd HH:mm:ss')
      },
      allPrint() {
        // let prints = this.tableData.filter(v => v.scoreStatus != 'NOT_SCORED' && this.records.includes(v.id))
        const params = this.$route.params
        this.routerGo(
          `/myJob/exam/release/examDetails/${params.examId}/schoolReport?id=${
            this.recordIds.join(',') || ''
          }&detail_id=${this.id || ''}`,
        )
      },
      // 全部签名
      allSign() {
        this.signDialogVisible = true
      },
      exportList() {
        exportExamRecords({ examId: this.$route.params.examId })
      },
      // 提交签字pincode
      async submitSign(form) {
        this.loadingDialog = true
        let [err, res] = await to(
          postExamRecordsSign({ ids: this.recordIds.join(','), pinCode: form.pinCode }),
        )
        this.loadingDialog = false
        if (!err) {
          this.signDialogVisible = false
          this.$message.success(this.$t('tip.setsuccessTip'))
          // this.getExamRecords()
          this.userInfo.teacher && this.allCreatePDF()
        }
      },
      async genPdf() {
        //Gen pdf
        let examId = this.recordIds[this.uploadComplate]
        this.$nextTick(async () => {
          await htmlToPdf(document.getElementById('PrintBox'), '', 'datauristring', async (url) => {
            let form = new FormData()
            form.append('file', dataURLtoFile(url, 'generated.pdf'))
            let [upErr, upRes] = await to(postUpload(form))
            if (upErr) {
              this.uploadComplate++
              this.refreshPDF()
              return
            }
            let params = {
              generateFiles: [
                {
                  fileUuid: upRes.data.uuid,
                  sourceId: examId,
                },
              ],
            }
            let examItem = this.records.find((v) => v.id == examId)
            let [recordsErr, recordsRes] = await to(
              getStudentTrainingFiles({
                courseNumber: examItem.student.courseNumber,
                studentId: examItem.student.studentId,
                type: 'THEORY_EXAM_RECORD',
              }),
            )
            if (recordsErr) {
              this.uploadComplate++
              this.refreshPDF()
              return
            }
            let list = recordsRes.data.content
            let item = list.length > 0 ? list[0] : {}
            let [setErr] = await to(putStudentTrainingFiles({ id: item.id, ...params }))
            if (!setErr) {
              this.uploadComplate++
              this.refreshPDF()
              if (this.uploadComplate >= this.records.length) {
                this.showProgressDialog = false
                this.$message.success(this.$t('tip.uploadSuccessTip'))
              }
            } else {
              this.uploadComplate++
              this.refreshPDF()
              if (this.uploadComplate >= this.records.length) {
                this.showProgressDialog = false
              }
            }
          })
        })
      },
      // 全部生成pdf
      async allCreatePDF() {
        this.uploadComplate = 0
        this.uploadLength = this.records.length
        this.$nextTick(() => {
          this.showProgressDialog = true
          this.printId = this.recordIds[0]
        })
      },
      // 重新渲染成绩单生成pdf
      refreshPDF() {
        this.printId = null
        this.$nextTick(() => {
          this.printId = this.recordIds[this.uploadComplate]
        })
      },
      checkedDisabled({ row }) {
        return row.scoreStatus != 'NOT_SCORED'
      },
      search() {
        this.pagination.page = 1
        this.getExamRecordsEvent()
      },
      sortChangeEvent(e) {
        this.sortObj = {
          order: e.order || undefined,
          sort: !e.order ? undefined : e.property,
        }
        this.getExamRecordsEvent()
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.markingPapers'),
            visible: this.origin != 'OTHER',
            disabled: !(row.status == 'FINISHED' && row.scoreStatus == 'NOT_SCORED'),
            event: () => {
              this.markingPapers(
                row.id,
                row.student.name,
                row.exam.name,
                row.exam.duration,
                row.status,
                row.scoreStatus,
              )
            },
          },
          {
            name: this.$t('button.examPaper'),
            event: () => {
              this.examPaper(row.id, row.student.name, row.exam.name, row.exam.duration)
            },
          },
          {
            name: this.$t('button.reportCard'),
            disabled: row.scoreStatus == 'NOT_SCORED',
            event: () => {
              this.reportCard(row.id, row.scoreStatus)
            },
          },
          // {
          //   name: this.$t('button.printTranscripts'),
          //   disabled: row.scoreStatus == 'NOT_SCORED',
          //   event: () => {
          //     this.printTranscripts(row.id, row.scoreStatus)
          //   }
          // }
          {
            name: this.$t('table.checkPaperReview'),
            visible: this.origin != 'OTHER' && row.auditStatus == 'WAITING_APPROVAL',
            event: () => {
              this.reviewPaper(row)
            },
          },
        ]
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '/@/views/project_ftm/teacher/styles/print-report.scss';
  @import '/@/views/project_ftm/teacher/styles/print-report-pdf.scss';
  @import '/@/style/print-pdf.scss';
  img {
    max-width: 500px;
    vertical-align: text-top;
  }
  .print-box-hide {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    :deep(.print-box) {
      width: 792px;

      @include printReport;
      @include printPdf;
    }
  }
  .dialogBox {
    display: flex;
    margin-bottom: 10px;
  }
</style>
