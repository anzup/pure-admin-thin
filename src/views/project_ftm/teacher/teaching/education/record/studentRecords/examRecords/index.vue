<template>
  <div class="w-full h-full" ref="main">
    <VxeTable
      :data="tableData"
      :loading="loading"
      :columns="tableColumns"
      :toolbar-config="tableTools"
      :buttons="tableButtons"
      @checkbox="handleCheckbox"
    >
      <template #form>
        <el-form :inline="true" size="medium">
          <el-form-item :label="$t('table.submissionStatus')">
            <!-- 考试状态 -->
            <el-select
              v-model="form.examStatus"
              :placeholder="$t('common.all')"
              clearable
              @change="getExamList"
            >
              <el-option
                v-for="(item, index) in form.examStatusArr"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #right_tools>
        <el-button
          size="mini"
          type="primary"
          :loading="loadingExport"
          :disabled="tableCheckbox.length == 0"
          @click="ExportPaper"
          >{{ $t('button.examPaper') }} {{ $t('button.leadingOut') }}</el-button
        >
        <el-button
          size="mini"
          type="primary"
          :loading="loadingExport"
          :disabled="tableCheckbox.length == 0"
          @click="ExportReport"
          >{{ $t('button.reportCard') }} {{ $t('button.leadingOut') }}</el-button
        >
      </template>
      <template #pager />
    </VxeTable>
    <!-- 渲染打印的试卷 -->
    <aside class="print-wrapper-hide">
      <div class="print-wrapper" ref="print">
        <question-paper
          v-for="id in paperList"
          :key="id"
          :questionBankId="id"
          :name="details.name"
          @finishPaper="handleFinishPaper"
        />
      </div>
    </aside>

    <!-- 渲染打印的成绩单 -->
    <aside class="print-wrapper-hide">
      <div class="print-wrapper" ref="print">
        <school-report v-for="id in reportList" :key="id" :pid="id" @finish="handleFinishReport" />
      </div>
    </aside>
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getExam } from '/@/api/ftm/teacher/studentTraining'
  import XEutils from 'xe-utils'
  import { mergePDF } from '/@/utils/index'
  import questionPaper from './questions.vue'
  import schoolReport from './reports.vue'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  export default {
    data() {
      return {
        tableData: [],
        tableCheckbox: [],
        paperList: [],
        finishPaperCount: 0,
        paperBuffer: [],
        reportList: [],
        finishReport: 0,
        reportBuffer: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: 40 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'name', title: this.$t('table.examName'), minWidth: 160 },
          {
            field: 'type',
            title: this.$t('table.examType'),
            minWidth: 80,
            formatter: this.examTypeFormatter,
          },
          {
            field: 'startTime',
            title: this.$t('table.examStartTime'),
            minWidth: 150,
            formatter: this.dateFormatter,
          },
          {
            field: 'duration',
            title: this.$t('table.examDuration'),
            width: 120,
            formatter: this.durationFormat,
          },
          {
            field: 'teachers',
            title: this.$t('table.teacher'),
            minWidth: 110,
            formatter: this.arrFormat,
          },
          {
            field: 'status',
            title: this.$t('table.examStatus'),
            width: 160,
            formatter: this.examStatusFormatter,
          },
          {
            field: 'result',
            title: this.$t('table.examResults'),
            width: 110,
            formatter: this.examResultFormatter,
          },
          { title: this.$t('table.tableEdit'), width: 140, slots: { default: 'operate' } },
        ],
        loading: false,
        loadingExport: false,
        loadingPrint: false,
        form: {
          examType: 'THEORY',
          examTypeArr: [
            { id: 'PRACTICE', name: this.$t('status.practiceExam') },
            { id: 'THEORY', name: this.$t('status.theoryExam') },
          ],
          examStatus: undefined,
          examStatusArr: [
            { id: 'FINISHED', name: this.$t('status.examFinished') },
            { id: 'IN_PROGRESS', name: this.$t('status.inProgress') },
          ],
        },
      }
    },
    props: {
      details: {},
      clazz: {},
    },
    components: {
      VxeTable,
      questionPaper,
      schoolReport,
    },
    computed: {
      id() {
        return this.$route.query.id
      },
    },
    mounted() {
      this.getExamList()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return { routerGo }
    },
    methods: {
      getExamList() {
        let param = {
          studentId: this.details.id || '',
          clazzId: this.clazz.id || '',
          type: this.form.examType,
          status: this.form.examStatus,
          page: 1,
          size: 100,
        }
        this.loading = true
        getExam(param)
          .then((res) => {
            this.tableData = res.data.content
            this.loading = false
          })
          .catch((e) => {
            this.loading = false
          })
      },
      // 导出试卷
      async ExportPaper() {
        this.finishPaperCount = 0
        this.paperList = []
        this.paperBuffer = []
        this.loadingPrint = this.$loading({
          target: this.$refs.main,
          text: this.$t('tip.pleaseWaitOfGeneratingPDF'),
        })
        this.$nextTick(() => {
          this.paperList = this.tableCheckbox.length ? [this.tableCheckbox[0]] : []
        })
      },
      // 导出成绩单
      async ExportReport() {
        this.finishReport = 0
        this.reportList = []
        this.reportBuffer = []
        this.loadingPrint = this.$loading({
          target: this.$refs.main,
          text: this.$t('tip.pleaseWaitOfGeneratingPDF'),
        })
        this.$nextTick(() => {
          this.reportList = this.tableCheckbox.length ? [this.tableCheckbox[0]] : []
        })
      },
      handleCheckbox({ ids }) {
        this.tableCheckbox = ids
      },
      toPage(row) {
        let params = this.$route.params
        this.routerGo({
          path: `${params.recordId}/examRecordsDetails`,
          query: {
            records_id: row.id,
          },
        })
      },
      // 跳转到试卷页
      toExam(row) {
        let params = this.$route.params
        this.routerGo({
          path: `${params.recordId}/examRecordsPaper`,
          query: {
            id: row.id,
            records_id: this.id,
            examName: row.name,
            duration: row.duration,
          },
        })
      },
      // 跳转到成绩单
      toExamReport(row) {
        let params = this.$route.params
        this.routerGo({
          path: `${params.recordId}/examRecordsReport`,
          query: {
            records_id: this.id,
            id: row.id,
          },
        })
      },
      // 格式化考试类型
      examTypeFormatter({ cellValue }) {
        switch (cellValue) {
          case 'PRACTICE':
            return this.$t('status.practiceExam')
          case 'THEORY':
            return this.$t('status.theoryExam')
        }
      },
      // 格式化考试状态
      examStatusFormatter({ cellValue }) {
        switch (cellValue) {
          case 'FINISHED':
            return this.$t('status.examFinished')
          case 'IN_PROGRESS':
            return this.$t('status.inProgress')
        }
      },
      // 格式化考试结果
      examResultFormatter({ cellValue }) {
        switch (cellValue) {
          case 'PASS':
            return this.$t('button.pass')
          case 'FAILED':
            return this.$t('status.failed')
          default:
            return ''
        }
      },
      // 格式化日期
      dateFormatter({ cellValue }) {
        return XEutils.toDateString(cellValue, 'yyyy-MM-dd HH:mm')
      },
      // 格式化时间
      durationFormat({ row }) {
        return this.sendToMinute(XEutils.timestamp(row.endTime) - XEutils.timestamp(row.startTime))
      },
      sendToMinute(val) {
        if (Number.isNaN(val)) {
          return ''
        } else {
          var minutes = Math.ceil(val / 60000)
          return minutes + this.$t('common.minutes')
        }
      },
      // 格式化数组 #输出name属性
      arrFormat({ cellValue }) {
        return cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : ''
      },
      // 完成当前添加的试卷渲染
      async handleFinishPaper(buffer) {
        this.finishPaperCount++
        this.paperBuffer.push(buffer)
        if (this.finishPaperCount >= this.tableCheckbox.length) {
          // 可以开始打印
          let fileURL = await mergePDF(this.paperBuffer)
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(new Blob([fileURL], { type: 'application/pdf' }))
          link.download = `${this.$t('router.examRecords')}(${this.details.name}).pdf`
          link.click()
          this.loadingPrint.close()
        } else {
          this.paperList.push(this.tableCheckbox[this.finishPaperCount])
        }
      },
      // 批量导出成绩单
      async handleFinishReport(buffer) {
        this.finishReport++
        this.reportBuffer.push(buffer)
        if (this.finishReport >= this.tableCheckbox.length) {
          let fileURL = await mergePDF(this.reportBuffer)
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(new Blob([fileURL], { type: 'application/pdf' }))
          link.download = `${this.$t('button.reportCard')}(${this.details.name}).pdf`
          link.click()
          this.loadingPrint.close()
        } else {
          this.reportList.push(this.tableCheckbox[this.finishReport])
        }
      },
      tableButtons({ row }) {
        return row.type == 'THEORY'
          ? [
              {
                name: this.$t('button.examPaper'),
                event: () => {
                  this.toExam(row)
                },
              },
              {
                name: this.$t('button.reportCard'),
                event: () => {
                  this.toExamReport(row)
                },
              },
            ]
          : [
              {
                name: this.$t('button.details'),
                event: () => {
                  this.toPage(row)
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
  .componentsContent {
    overflow-y: auto;
  }
  .print-wrapper-hide {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    :deep(.print-wrapper) {
      position: absolute;
      width: 792px;
      @include printReport;
      @include printPdf;
    }
  }
</style>
