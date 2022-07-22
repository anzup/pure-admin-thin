<template>
  <VxeTable :loading="loading" :data="tableData" :columns="tableColumns" :buttons="tableButtons">
    <template #pager />
    <!-- 考试类型 -->
    <!-- <template #form>
          <el-form inline size="medium">
              <el-form-item :label="$t('table.examType')">
                  <el-select v-model="examType" :placeholder="$t('common.all')" @change="getData">
                      <el-option :label="$t('common.all')" :value="undefined"></el-option>
                      <el-option v-for="(item, index) in examTypeArr" :key="index" :label="item.name" :value="item.id"/>
                  </el-select>
              </el-form-item>
          </el-form>
      </template> -->
    <template #right_tools>
      <!-- 屏蔽导出 -->
      <!-- <el-button size="mini" type="primary" :loading="loadingExport" @click="Export">{{ $t("button.leadingOut") }}</el-button> -->
    </template>
    <template #type="{ row }">{{
      row.exam ? $t('table.practiceExam') : $t('status.train')
    }}</template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getExam } from '/@/api/ftm/teacher/studentTraining'
  import Api from '/@/api/ftm/teacher/trainEva'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  export default {
    components: { VxeTable },
    data() {
      return {
        tableData: [],
        tableColumns: [
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          {
            field: 'type',
            title: this.$t('table.type'),
            minWidth: 120,
            slots: { default: 'type' },
          },
          { field: 'code', title: this.$t('table.courseType'), minWidth: 100 },
          {
            field: 'airplaneTypes',
            title: this.$t('table.trainingModel'),
            minWidth: 80,
            formatter: this.arrFormat,
          },
          { field: 'name', title: this.$t('table.taskName'), minWidth: 150 },
          {
            field: 'teachers',
            title: this.$t('table.teacher'),
            minWidth: 110,
            formatter: this.teachersFormat,
          },
          {
            field: 'startTime',
            title: this.$t('table.date'),
            width: 120,
            formatter: this.dateFormat,
          },
          // { field: "processResult", title: this.$t('table.disposalResults'), width: 140, formatter: this.resultFormat },
          // { field: "auditStatus", title: this.$t('table.examineSelect'), width: 100, formatter: this.auditFormat },
          { title: this.$t('table.tableEdit'), minWidth: 130, slots: { default: 'edit' } },
        ],
        loading: false,
        loadingExport: false,
        examType: 'PRACTICE',
        examTypeArr: [
          { id: 'PRACTICE', name: this.$t('status.practiceExam') },
          { id: 'THEORY', name: this.$t('status.theoryExam') },
        ],
      }
    },
    props: {
      details: Object,
      clazz: Object,
    },
    created() {
      this.getData()
    },
    methods: {
      toPage(row) {
        let params = this.$route.params
        this.$router.push({
          path: `${params.recordId}/examRecordsDetails`,
          query: {
            records_id: row.id,
            type: row.exam ? 'EXAM' : 'EVALUATION',
          },
        })
      },
      // 跳转到试卷页
      toExam(row) {
        let params = this.$route.params
        this.$router.push({
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
        this.$router.push({
          path: `${params.recordId}/examRecordsReport`,
          query: {
            records_id: this.id,
            id: row.id,
          },
        })
      },
      async getData() {
        let param = {
          studentId: this.details.id,
          clazzId: this.clazz.id,
          result: 'FAILED',
          auditStatus: 'APPROVED',
          type: this.examType,
          page: 1,
          size: 100,
        }
        this.loading = true
        let [err, res] = await to(getExam(param))
        this.loading = false
        if (!err) {
          this.tableData = res.data.content
        }
      },
      // 导出列表
      async Export() {
        this.loadingExport = true
        await Api.failExamExport({
          studentId: this.details.id,
          clazzId: this.details.clazz.id,
        }).catch(() => {
          this.loadingExport = false
        })
        this.loadingExport = false
      },
      // 格式化数据
      arrFormat({ cellValue }) {
        return (cellValue instanceof Array && cellValue.join(',')) || ''
      },
      // 格式化教员
      teachersFormat({ cellValue }) {
        return (cellValue instanceof Array && cellValue.map((v) => v.name).join(',')) || ''
      },
      // 格式化结果
      resultFormat({ cellValue }) {
        switch (cellValue) {
          case 'PASS':
            return this.$t('button.pass')
          case 'ABORT':
            return this.$t('status.abort')
          case 'ADD_ONE':
            return this.$t('status.addOne')
          case 'ADD_TWO':
            return this.$t('status.addTwo')
          default:
            return ''
        }
      },
      // 格式化类型
      typeFormat({ cellValue }) {
        switch (cellValue) {
          case 'PRACTICE':
            return this.$t('status.practiceExam')
          case 'THEORY':
            return this.$t('status.theoryExam')
          default:
            return ''
        }
      },
      // 格式化审核
      auditFormat({ cellValue }) {
        switch (cellValue) {
          case 'APPROVED':
            return this.$t('common.approved')
          case 'REJECTED':
            return this.$t('common.rejected')
          case 'WAITING_APPROVE':
            return this.$t('common.unreviewed')
          default:
            return ''
        }
      },
      // 跳转到考试详情
      toExamDetails(row) {
        let id = this.$route.query.id
        this.$router.push({
          path: 'TrainingRecordsExamDetails',
          query: {
            records_id: id,
          },
        })
      },
      // 格式化日期
      dateFormat({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
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
