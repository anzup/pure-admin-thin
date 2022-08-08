<template>
  <div ref="main">
    <VxeTable
      :loading="tableLoading"
      :data="tableData"
      :columns="tableColumns"
      :toolbarConfig="tableTools"
      :buttons="tableButtons"
      v-model:form="pagination"
      @action="btnClick"
      @checkbox="checkboxAll"
      @handle-page-change="handlePageChange"
    >
      <template #form>
        <el-form :inline="true" size="medium">
          <el-form-item :label="$t('table.classNumber')">
            <!-- 班级课号 -->
            <el-select v-model="form.className" :placeholder="$t('common.all')" clearable>
              <el-option
                v-for="(item, index) in form.classNameArr"
                :key="index"
                :label="item.courseNumber"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.examineSelect')">
            <!-- 审核状态 -->
            <el-select v-model="form.auditStatus" :placeholder="$t('common.all')" clearable>
              <el-option
                v-for="(item, index) in examineList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              class="searchInput"
              :placeholder="$t('holder.pleaseEnterStudentName')"
              v-model.trim="form.searchKey"
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
        <el-button
          type="primary"
          size="mini"
          :disabled="records.length == 0"
          @click="handleExport"
          >{{ $t('button.bulkDownload') }}</el-button
        >
      </template>
      <!-- <template #pager></template> -->
    </VxeTable>

    <div class="print-wrapper" v-if="records.length > 0">
      <div class="print-hide-box" v-if="exportItem != null" ref="print">
        <ExamRecord :details="exportItem" v-if="exportItem.exam" @finishDraw="handleDraw" />
        <TrainRecord :details="exportItem" v-if="!exportItem.exam" @finishDraw="handleDraw" />
      </div>
    </div>
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import ExamRecord from '/@/views/project_ftm/teacher/teaching/education/record/studentRecords/failRecords/details.vue'
  import TrainRecord from '/@/views/project_ftm/teacher/myJob/teaching/flight/flightTrainingEvaluation/edit.vue'
  import { getExam } from '/@/api/ftm/teacher/studentTraining'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import XEUtils from 'xe-utils'
  import moment from 'moment'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        form: {
          searchKey: '',
          schoolYear: undefined,
          className: undefined,
          classNameArr: [],
          graduation: 'NOT_GRADUATED',
          auditStatus: undefined,
        },
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
        records: [],
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableLoading: false,
        tableColumns: [
          { type: 'checkbox', width: 40 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'courseNumber', title: this.$t('table.sourse'), minWidth: 120 },
          { field: 'studentName', title: this.$t('table.student'), minWidth: 120 },
          {
            field: 'studentGender',
            title: this.$t('table.gender'),
            minWidth: 90,
            formatter: this.genderFormatter,
          },
          { field: 'grouping.name', title: this.$t('table.team'), minWidth: 120 },
          { field: 'name', title: this.$t('table.flightTrainingMission'), minWidth: 180 },
          {
            field: 'createdDate',
            title: this.$t('table.trainingDate'),
            minWidth: 180,
            formatter: this.dateTimeFormatter,
          },
          { field: 'airplaneTypes', title: this.$t('table.trainingModel'), minWidth: 150 },
          {
            field: 'processResult',
            title: this.$t('table.disposalOpinions'),
            minWidth: 120,
            formatter: this.resultFormat,
          },
          {
            field: 'auditStatus',
            title: this.$t('table.examineSelect'),
            formatter: this.auditFormat,
            minWidth: 120,
          },
          { field: 'auditor.name', title: this.$t('table.auditor'), minWidth: 90 },
          { title: this.$t('table.tableEdit'), width: 140, slots: { default: 'operate' } },
        ],
        examineList: [
          { name: this.$t('status.reviewing'), id: 'WAITING_APPROVE' },
          { name: this.$t('status.pass'), id: 'APPROVED' },
          { name: this.$t('status.filled'), id: 'REJECTED' },
        ],
        exportItem: null, // 当前导出项
        exportCount: 0, // 已导出数目
        loadingExport: null,
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
    },
    components: {
      VxeTable,
      ExamRecord,
      TrainRecord,
      Search,
    },
    created() {
      this.form.schoolYear = moment().format('YYYY')
      this.getClazzs()
    },
    // TODO: 原activated缓存页面初始化
    activated() {
      this.getData()
    },
    mounted() {
      this.getData()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      // 格式化结果
      resultFormat({ cellValue, row }) {
        if (row.trainingResult && row.trainingResult.name) {
          return row.trainingResult.name
        } else {
          switch (cellValue) {
            case 'ABORT':
              return this.$t('button.pass')
            case 'ADD_ONE':
              return this.$t('status.adviceAddOne')
            case 'ADD_TWO':
              return this.$t('status.adviceAddTwo')
            default:
              return ''
          }
        }
      },
      // 格式化审核
      auditFormat({ cellValue }) {
        switch (cellValue) {
          case 'APPROVED':
            return this.$t('common.disposal')
          case 'REJECTED':
            return this.$t('common.isRejected')
          case 'WAITING_APPROVE':
            return this.$t('common.unreviewed')
          default:
            return ''
        }
      },
      getClazzs() {
        getClazzs({
          page: 1,
          size: 1000,
          // year: this.form.schoolYear,
          type: 'WET_LEASE',
          statusIN: 'TRAINING',
          teacherUserId: this.userInfo.userId,
        }).then((res) => {
          this.form.classNameArr = res.data.content
        })
      },
      // 获取学员列表
      getData() {
        const param = {
          clazzId: this.form.className,
          searchKey: this.form.searchKey ? this.form.searchKey : undefined,
          auditStatus: this.form.auditStatus,
          // studentStatus: 'NOT_GRADUATED',
          flightTeacherUserId: this.userInfo.userId,
          // flightTeacherUserId: this.userInfo.userId
          type: 'PRACTICE',
          result: 'FAILED',
          ...this.pagination,
        }
        this.tableLoading = true
        getExam(param)
          .then((res) => {
            let data = res.data
            this.tableData = data.content
            this.tableLoading = false
            this.pagination.total = res.data.totalElements
          })
          .catch((e) => {
            this.tableLoading = false
          })
      },
      // 格式化日期
      dateTimeFormatter({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      // 格式化性别
      genderFormatter({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      checkboxAll({ records }) {
        this.records = records
      },
      search() {
        this.getData()
      },
      // 点击下载
      async handleExport() {
        let checked = this.tableData.find((v) => v.id == this.records[0].id) || {}
        this.exportCount = 0
        this.exportItem = {
          id: checked.id,
          type: 'info',
          name: checked.courseNumber + ' ' + checked.studentName,
          exam: checked.exam,
        }
        this.loadingExport = this.$loading({
          target: this.$refs.main,
          text: this.$t('tip.pleaseWaitOfGeneratingPDF'),
        })
      },
      // 组件已渲染完成
      handleDraw() {
        let opt = {
          margin: 0.1,
          filename: this.exportItem.studentName + '.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
          pagebreak: { mode: 'avoid-all', before: '#page2el' },
        }
        this.$htmlToPdf()
          .set(opt)
          .from(this.$refs.print)
          .to('pdf')
          .get('pdf')
          .then((pdfObj) => {
            const pdf = pdfObj.output('arraybuffer')
            let a = document.createElement('a')
            a.href = window.URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
            a.download = `${this.exportItem.name}.pdf`
            a.click()
            this.exportItem = null
            this.$nextTick(() => {
              if (this.exportCount < this.records.length - 1) {
                this.exportCount++
                let checked =
                  this.tableData.find((v) => v.id == this.records[this.exportCount].id) || {}
                this.exportItem = {
                  id: checked.id,
                  type: 'info',
                  name: checked.courseNumber + ' ' + checked.studentName,
                  exam: checked.exam,
                }
              } else {
                this.loadingExport.close()
                this.exportCount = 0
                this.exportItem = null
              }
            })
          })
      },
      handlePageChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      btnClick() {},
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            event: () => {
              row.exam
                ? this.routerGo(`failRecord/examRecordsDetails?records_id=${row.id}`)
                : this.routerGo(`failRecord/examFilghtRecords?id=${row.id}`)
            },
          },
        ]
      },
    },
  }
</script>
<style lang="scss" scoped>
  .print-wrapper {
    position: relative;
    width: 0;
    height: 0;
    overflow: hidden;
    .print-hide-box {
      position: absolute;
      width: 1000px;
      :deep(.container) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: unset;
      }
    }
  }
</style>
