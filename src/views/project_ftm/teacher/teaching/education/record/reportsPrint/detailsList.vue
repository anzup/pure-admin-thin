<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :toolbarConfig="tableTools"
    :buttons="tableButtons"
    @checkbox="selectChangeEvent"
  >
    <template #form>
      <el-form inline size="medium" style="text-align: right; margin-bottom: 10px">
        <!-- <el-form-item>
              <el-select v-model="recordType" :placeholder="$t('holder.pleaseSelect')" style="width: 200px" clearable @change="recordTypeChange">
                  <el-option :label="item.name" :value="item.id" v-for="item in typeList" :key="item.id"></el-option>
              </el-select>
          </el-form-item> -->
        <el-form-item>
          <el-button
            size="medium"
            type="primary"
            :loading="btnLoading"
            @click="printEvent"
            :disabled="!records || !records.length"
            >{{ $t('button.batchPrinting') }}</el-button
          >
        </el-form-item>
      </el-form>
    </template>
    <template #right_tools>
      <!-- 屏蔽导出 -->
      <!-- <el-button size="mini" type="primary" :loading="loadingExport" @click="Export">{{ $t("button.leadingOut") }}</el-button> -->
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import Api from '/@/api/ftm/teacher/trainEva'
  import XEUtils from 'xe-utils'
  import { genPdfByRecords } from '/@/api/ftm/teacher/studentTraining'
  export default {
    components: { VxeTable },
    data() {
      return {
        tableData: [],
        tableTools: {
          enabled: false,
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: '40' },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'name', title: this.$t('table.flightTrainingMission'), minWidth: 140 },
          { field: 'type', title: this.$t('table.type'), formatter: this.formatType, minWidth: 80 },
          // { field: "code", title: this.$t('table.courseType'), minWidth: 150 },
          {
            field: 'airplaneTypes',
            title: this.$t('table.trainingModel'),
            minWidth: 160,
            formatter: this.arrFormat,
          },
          // { field: "teachers", title: this.$t('table.filghtTeacher'), width: 140, formatter: this.teachersFormat },
          {
            field: 'startTime',
            title: this.$t('table.trainDate'),
            minWidth: 160,
            formatter: this.dateFormat,
          },
          {
            field: 'processResult',
            title: this.$t('table.trainingResults'),
            width: 160,
            formatter: this.resultFormat,
          },
          { title: this.$t('table.tableEdit'), width: 120, slots: { default: 'operate' } },
        ],
        loading: false,
        loadingExport: false,
        recordType: undefined,
        pagination: {
          // 表格分页信息
          page: 1,
          size: 10,
          total: 0,
        },
        typeList: [
          {
            id: 'EVALUATION',
            name: this.$t('status.train'),
          },
          {
            id: 'PRACTICE',
            name: this.$t('table.practiceExam'),
          },
          {
            id: 'SUPPLEMENTARY',
            name: this.$t('status.makeUpTest'),
          },
        ],
        records: [],
        btnLoading: false,
      }
    },
    props: {
      details: {},
      clazz: {},
    },
    mounted() {
      this.getData()
    },
    methods: {
      // 选择行
      selectChangeEvent({ records }) {
        this.records = records
      },
      recordTypeChange() {
        this.pagination.page = 1
        this.getData()
      },
      formatType({ cellValue }) {
        return this.typeList.find((v) => v.id == cellValue).name
      },
      seqMethod(row) {
        return (this.pagination.page - 1) * this.pagination.size + row.seq
      },
      toPage(row) {
        let params = this.$route.params
        this.$router.push({
          name: 'reportsDetails',
          params: {
            ...params,
          },
          query: {
            id: row.id,
            CBTAtype: row.type,
          },
        })
      },
      async getData() {
        let param = {
          page: this.pagination.page,
          size: this.pagination.size,
          clazzId: this.$route.query.clazzId,
          studentId: this.$route.query.studentId,
          // recordType: this.recordType?this.recordType:undefined,
        }
        this.loading = true
        let { data } = await Api.evaluationRecords(param).catch(() => {
          this.loading = false
        })
        this.loading = false
        this.tableData = data
        this.pagination.total = data.totalElements
      },
      // 导出列表
      async Export() {
        this.loadingExport = true
        await Api.cbtaExport({
          studentId: this.details.id,
          clazzId: this.details.clazz.id,
        }).catch(() => {
          this.loadingExport = false
        })
        this.loadingExport = false
      },
      printEvent() {
        this.btnLoading = true
        genPdfByRecords({ records: this.records })
          .then((res) => {
            this.btnLoading = false
          })
          .catch((err) => {
            this.btnLoading = false
          })
      },
      // 格式化结果
      resultFormat({ cellValue }) {
        switch (cellValue) {
          case 'ABORT':
            return this.$t('status.abort')
          case 'ADD_ONE':
            return this.$t('status.addOne')
          case 'ADD_TWO':
            return this.$t('status.addTwo')
          case 'PASS':
            return this.$t('button.pass')
          default:
            return ''
        }
      },
      // 格式化时间
      dateFormat({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
      },
      // 格式化教员
      teachersFormat({ cellValue }) {
        return (cellValue instanceof Array && cellValue.map((v) => v.name).join(',')) || ''
      },
      // 格式化机型
      arrFormat({ cellValue }) {
        return (cellValue instanceof Array && cellValue.join(',')) || ''
      },
      tableButtons({ row }) {
        return [
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
