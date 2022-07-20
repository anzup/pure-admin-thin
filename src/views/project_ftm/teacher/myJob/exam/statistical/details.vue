<template>
  <VxeTable
    ref="xTable"
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    v-model:form="form"
    :toolbarConfig="tableTools"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form ref="form" :model="form" inline size="medium">
        <el-form-item :label="$t('table.examYear')">
          <el-date-picker
            v-model="form.year"
            type="year"
            value-format="yyyy"
            :placeholder="$t('holder.pleaseSelect') + $t('table.examYear')"
          />
        </el-form-item>
        <el-form-item :label="$t('table.courseNumber')">
          <el-select
            v-model="form.courseNumber"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 160px"
            clearable
            filterable
          >
            <el-option
              :label="item.name"
              :value="item.name"
              v-for="item in classList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.examPeriod')">
          <el-date-picker
            v-model="form.dateTime"
            type="daterange"
            :range-separator="$t('common.to')"
            :start-placeholder="$t('table.startDate')"
            :end-placeholder="$t('table.endDate')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #startDate="{ row }">
      <span class="date-range"
        >{{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}</span
      >
    </template>

    <template #edit="{ row }">
      <div class="button-line">
        <span class="buttonEdit" @click="detail(row)">{{ $t('router.questionDetails') }}</span>
      </div>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import { getExamTypesAll, getExamsExam } from '/@/api/ftm/teacher/examCenter'
  import { deleteEmptyParams } from '/@/utils/index'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        allAlign: null,
        loading: false,
        records: [],
        form: {
          page: 1,
          size: 10,
          sort: 'startDate',
          order: 'desc',
          year: undefined,
          examTypeId: undefined,
          createdBy: undefined,
          dateTime: [new Date(this.$route.query.startDate), new Date(this.$route.query.endDate)],
        },
        propertyList: [],
        total: 1,
        confidentialList: [
          { id: 'PUBLIC', name: this.$t('status.publicQuestionBank') },
          { id: 'CONFIDENTIAL', name: this.$t('status.confidentialQuestionBank') },
        ],
        tableTools: {
          enabled: false,
          perfect: true,
          slots: {},
        },
        tableData: [],
        tableColumns: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.examName'), minWidth: 90 },
          { field: 'examType.name', title: this.$t('table.examCategory'), width: 90 },
          { field: 'courseNumber', title: this.$t('table.courseNumber'), minWidth: 90 },
          {
            field: 'startDate',
            title: this.$t('table.examPeriod'),
            width: 200,
            slots: { default: 'startDate' },
          },
          { field: 'creator.name', title: this.$t('table.creator'), minWidth: 120 },
          {
            field: 'questionBanks',
            title: this.$t('table.useBank'),
            formatter: this.formatQuestionBanks,
            minWidth: 120,
          },
          { field: 'objQuestionCount', title: this.$t('table.objectiveItems'), width: 90 },
          {
            field: 'objQuestionAvgCorrectRate',
            title: this.$t('table.averagePassRate'),
            formatter: this.formatPassRate,
            width: 90,
          },
          { field: 'subQuestionCount', title: this.$t('table.subjectiveItems'), width: 90 },
          {
            field: 'subQuestionAvgScoreRate',
            title: this.$t('table.subjectiveAverageRate'),
            formatter: this.formatPassRate,
            width: 90,
          },

          // { field: "studentCount", title: this.$t('table.candidatesNum'), width: 90 },
          { field: 'testedStudentCount', title: this.$t('table.examActualNum'), width: 90 },

          { field: 'passStudentCount', title: this.$t('table.passPeopleNum'), width: 90 },
          {
            field: 'passRate',
            title: this.$t('table.passRate'),
            formatter: this.formatPassRate,
            width: 90,
          },
          // { field: "status", title: this.$t('table.examStatus'), formatter: this.formatStatus, width: 90 },
          { title: this.$t('table.tableEdit'), width: 90, slots: { default: 'operate' } },
        ],
        classList: [],
      }
    },
    components: { selectedView, VxeTable },
    computed: {
      userInfo() {
        return userStore.$state
      },
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
    },
    created() {
      // this.getExamTypeAll()
    },
    mounted() {
      // this.getClazzsAll()
      // this.form.createdBy = this.userInfo.userId
      // this.getExams()
    },
    methods: {
      getClazzsAll() {
        getClazzs({ size: 100, statusIN: 'NOT_STARTED,TRAINING', type: 'WET_LEASE' }).then(
          (res) => {
            if (res.status == 200) {
              this.classList = res.data.content.map((v) => ({ id: v.id, name: v.courseNumber }))
            }
          },
        )
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getExams()
      },
      // 考试类型下拉菜单
      async getExamTypeAll() {
        let [err, res] = await to(getExamTypesAll())
        if (!err) {
          this.propertyList = res.data
        }
      },
      getExams() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        this.form.examTypeId = this.$route.query.id
        this.form.startDate = this.form.dateTime ? this.form.dateTime[0] : ''
        this.form.endDate = this.form.dateTime ? this.form.dateTime[1] : ''
        getExamsExam(this.form).then((res) => {
          if (res.status == 200) {
            this.tableData = res.data.content
            this.total = res.data.totalElements
            this.loading = false
          }
        })
      },
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd HH:mm:ss')
      },
      formatPassRate({ cellValue }) {
        return cellValue ? (Number(cellValue) * 100).toFixed(2) + '%' : 0
      },
      formatQuestionBanks({ cellValue }) {
        return cellValue ? cellValue.map((item) => item.name) : ''
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      formatStatus({ cellValue }) {
        if (cellValue == 'EXAMING') {
          return this.$t('status.inProgress')
        } else if (cellValue == 'FINISHED') {
          return this.$t('status.finished')
        } else {
          return this.$t('status.notStarted')
        }
      },
      search() {
        this.form.page = 1
        this.total = 0
        this.getExams()
      },
      detail(row) {
        this.$router.push({
          path: '/examCenter/eaxmStatistics/testDetails',
          query: {
            examId: row.id,
            startDate: this.$route.query.startDate,
            endDate: this.$route.query.endDate,
          },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .date-range {
    word-break: keep-all;
  }
</style>
