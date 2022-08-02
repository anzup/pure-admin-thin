<template>
  <VxeTable
    :loading="tableLoading"
    :data="tableData"
    :columns="tableColumns"
    :toolbarConfig="tableTools"
    :buttons="tableButtons"
    v-model:form="form"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form ref="form" :model="form" :inline="true" size="medium">
        <el-form-item :label="$t('table.examYear')">
          <!-- 考试年份 -->
          <el-date-picker
            type="year"
            :placeholder="$t('holder.pleaseSelect') + $t('table.examYear')"
            value-format="YYYY"
            v-model="form.year"
          />
        </el-form-item>
        <el-form-item :label="$t('table.examStatus')">
          <!-- 考试状态 -->
          <el-select
            v-model="form.status"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 150px"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in examStatusList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.examResults')">
          <!-- 考试结果 -->
          <el-select
            v-model="form.passType"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 150px"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in examResultsList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.examClassification')">
          <!-- 考试分类 -->
          <el-select
            v-model="form.examType"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 150px"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in examClassificationList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseInputExamName')"
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

    <template #scores="{ row }">
      <span> {{ sum(row.objectiveQuestionScore, row.subjectiveQuestionScore) }}</span>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { getExamRecords, putExamRecordsId } from '/@/api/ftm/teacher/exam'
  import { deleteEmptyParams } from '/@/utils/index'
  export default {
    data() {
      return {
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: 'status,startDate',
          order: 'asc,desc',
          searchKey: undefined,
          status: undefined,
          examType: undefined,
          passType: undefined,
          studentUserId: undefined,
          year: undefined,
          maxScore: true,
        },
        id: undefined,
        nowDate: new Date(),
        tableLoading: false,
        tableData: [],
        tableTools: {
          enabled: false,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'exam.name', title: this.$t('table.examName'), minWidth: 100 },
          { field: 'exam.year', title: this.$t('table.examYear'), width: 90 },
          {
            field: 'exam.type',
            title: this.$t('table.examClassification'),
            formatter: this.formatType,
            width: 120,
          },
          {
            field: 'exam.startDate',
            title: this.$t('table.examStartTime'),
            minWidth: 150,
            formatter: this.formatDate,
          },
          { field: 'exam.duration', title: this.$t('table.examDurationMinutes'), width: 140 },
          { field: 'questionCount', title: this.$t('table.questionsNum'), width: 80 },
          { field: 'exam.totalScore', title: this.$t('table.totalScore'), width: 80 },
          { field: 'exam.passScore', title: this.$t('table.passLine'), width: 80 },
          {
            field: 'objectiveQuestionScore',
            title: this.$t('table.score'),
            slots: { default: 'scores' },
            width: 80,
          },
          {
            field: 'passType',
            title: this.$t('table.examResults'),
            formatter: this.formatPassType,
            width: 90,
          },
          {
            field: 'status',
            title: this.$t('table.examStatus'),
            formatter: this.formatStatus,
            width: 120,
          },
          { title: this.$t('table.tableEdit'), width: 150, slots: { default: 'operate' } },
        ],
        examStatusList: [
          { id: 'NOT_STARTED', name: this.$t('status.notStarted') },
          { id: 'FINISHED', name: this.$t('status.finished') },
          { id: 'EXAMING', name: this.$t('status.inProgress') },
          { id: 'MISSED', name: this.$t('status.missed') },
        ],
        examResultsList: [
          { id: 'PASS', name: this.$t('status.pass') },
          { id: 'FAILED', name: this.$t('status.filled') },
        ],
        examClassificationList: [
          { id: 'FORMAL', name: this.$t('table.formalExam') },
          { id: 'SIMULATED', name: this.$t('table.examMock') },
        ],
      }
    },
    components: {
      VxeTable,
      Search,
    },
    computed: {},
    created() {
      setInterval(() => {
        this.nowDate = new Date()
      }, 1000)
    },
    // TODO 原缓存页面执行activated
    mounted() {
      this.getExamRecords()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getExamRecords()
      },
      async getExamRecords() {
        this.form = deleteEmptyParams(this.form)
        this.form.studentUserId = sessionStorage.getItem('userId')
        this.tableLoading = true
        let [err, res] = await to(getExamRecords(this.form))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      exam(id, duration, examName) {
        // 判断考试是否开始
        let item = this.tableData.find((v) => v.id == id)
        let { startDate = '', endDate = '' } = item.exam || {}
        if (!this.valideDate(startDate, endDate)) return
        this.routerGo(
          `teaching/rule?id=${id}&duration=${duration || ''}&examName=${examName || ''}`,
        )
      },
      resultsView(id, name, examName, duration) {
        this.routerGo(
          `teaching/view?id=${id}&name=${name || ''}&examName=${examName || ''}&duration=${
            duration || ''
          }`,
        )
      },
      applyForExam(id, auditStatus) {
        if (auditStatus == 'WAITING_APPROVAL') {
          return false
        }
        putExamRecordsId({
          id: id,
          auditStatus: 'WAITING_APPROVAL',
        }).then((res) => {
          if (res.status == 200) {
            this.getExamRecords()
            this.$message.success(this.$t('tip.subSuccessTip'))
          }
        })
      },
      sum(objectiveQuestionScore, subjectiveQuestionScore) {
        let sum = (Number(subjectiveQuestionScore) + Number(objectiveQuestionScore)).toFixed(2)
        return Number(sum)
      },
      formatType({ cellValue }) {
        return cellValue == 'FORMAL' ? this.$t('table.formalExam') : this.$t('table.examMock')
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatPassType({ cellValue }) {
        if (cellValue == 'FAILED') {
          return this.$t('status.filled')
        } else if (cellValue == 'PASS') {
          return this.$t('status.pass')
        }
      },
      formatStatus({ cellValue }) {
        if (cellValue == 'FINISHED') {
          return this.$t('status.finished')
        } else if (cellValue == 'NOT_STARTED') {
          return this.$t('status.notStarted')
        } else if (cellValue == 'MISSED') {
          return this.$t('status.missed')
        } else {
          return this.$t('status.inProgress')
        }
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      // 验证是否在考试时间范围
      valideDate(startDate, endDate) {
        if (this.nowDate < new Date(startDate) || this.nowDate > new Date(endDate)) {
          return false
        } else {
          return true
        }
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.getExamRecords()
      },
      tableButtons({ row }) {
        return [
          {
            visible: row.status !== 'FINISHED' && row.status !== 'MISSED',
            disabled: !(
              this.nowDate >= new Date(row.exam.startDate) &&
              this.nowDate <= new Date(row.exam.endDate)
            ),
            name: this.$t('button.enterTheExam'),
            event: () => {
              this.exam(row.id, row.exam.duration, row.exam.name)
            },
          },
          {
            visible: row.auditStatus == 'APPROVED' && new Date(row.auditValidTime) >= this.nowDate,
            name: this.$t('button.resultsView'),
            event: () => {
              this.resultsView(row.id, row.student.name, row.exam.name, row.exam.duration)
            },
          },
          {
            visible:
              row.status == 'FINISHED' &&
              row.scoreStatus == 'SCORED' &&
              (row.auditStatus == 'NOT_REQUESTED' ||
                row.auditStatus == 'REJECTED' ||
                (row.auditStatus == 'APPROVED' && new Date(row.auditValidTime) < this.nowDate)) &&
              row.exam.type == 'FORMAL',
            disabled: row.auditStatus == 'WAITING_APPROVAL',
            name: this.$t('button.applyForExam'),
            event: () => {
              this.applyForExam(row.id, row.auditStatus)
            },
          },
        ]
      },
    },
  }
</script>

<style scoped lang="scss">
  .spacing {
    font-style: normal;
    display: inline-block;
    margin-right: 8px;
    margin-left: 8px;
  }
</style>
