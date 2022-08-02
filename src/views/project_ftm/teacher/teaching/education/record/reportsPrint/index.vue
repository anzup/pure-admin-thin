<template>
  <VxeTable
    :data="tableData"
    :columns="tableColumns"
    :loading="loading"
    :toolbarConfig="tableTools"
    v-model:form="pagination"
    :buttons="tableButtons"
    @checkbox="selectChangeEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form inline size="medium">
        <el-form-item :label="$t('table.schoolYear')">
          <!-- 学年 -->
          <el-date-picker
            style="width: 150px"
            type="year"
            value-format="YYYY"
            :placeholder="$t('holder.pleaseSelect')"
            :editable="false"
            @change="dateChange"
            v-model="form.schoolYear"
          />
        </el-form-item>
        <el-form-item :label="$t('table.classNumber')">
          <el-select v-model="form.classNumber" :placeholder="$t('holder.pleaseSelect')" filterable>
            <el-option
              v-for="item in form.classNumberList"
              :key="item.id"
              :label="item.courseNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseEnterStudentName')"
            v-model.trim="form.searchKey"
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
          <el-button type="primary" @click="searchTable">{{ $t('button.query') }}</el-button
          ><!-- 查询 -->
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="printEvent({ ids: records })"
            :disabled="!records || !records.length"
            >{{ $t('button.batchPrinting') }}</el-button
          ><!-- 查询 -->
        </el-form-item>
      </el-form>
    </template>
    <template #pager />
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import { noFinishedClazzs, genPdfByClazzIdAndStudentId } from '/@/api/ftm/teacher/studentTraining'
  import { getStudents } from '/@/api/ftm/teacher/education'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { VxeTable, Search },
    name: 'reportsPrint',
    data() {
      return {
        menuName: 'FLIGHT_TRAINING_EVALUATION',
        form: {
          schoolYear: new Date().getFullYear() + '',
          classNumber: undefined,
          classNumberList: [],
          searchKey: undefined,
        },
        loading: false,
        tableData: [], // 学员列表
        pagination: {
          // 表格分页信息
          page: 1,
          size: 10,
          total: 0,
        },
        tableTools: {
          enabled: false,
          slots: {
            buttons: 'left_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: 40 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'clazz.year', title: this.$t('table.year'), width: 80 },
          { field: 'clazz.courseNumber', title: this.$t('table.classNumber'), minWidth: 140 },
          { field: 'name', title: this.$t('table.name'), minWidth: 120 },
          // { field: "student.gender", title: this.$t('table.gender'), width: 80, formatter: this.genderFormat },
          { field: 'customer.name', title: this.$t('table.airlines'), minWidth: 160 },
          {
            field: 'status',
            title: this.$t('table.trainingStatusName'),
            width: 160,
            formatter: this.statusFormatter,
          },
          // { field: "flightExamTotalCount", title: this.$t('table.trainingFinishNumToTotalNum'), minWidth: 160, formatter: this.arrFormat },
          { title: this.$t('table.tableEdit'), width: 120, slots: { default: 'operate' } },
        ],
        records: [],
        btnLoading: false,
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    created() {
      if (this.$route.query.id) {
        this.form.classNumber = Number(this.$route.query.id)
      }
      this.dateChange()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      dateChange() {
        this.form.classNumber = undefined
        this.getClazzs()
      },
      getClazzs() {
        noFinishedClazzs({ year: this.form.schoolYear }).then((res) => {
          this.form.classNumberList = res.data.content
        })
      },
      // 格式化结业状态
      statusFormatter({ cellValue }) {
        switch (cellValue) {
          case 'GRADUATED':
            return this.$t('status.finishedStatus')
          case 'NOT_GRADUATED':
            return this.$t('status.unfinishedStatus')
          case 'NOT_STARTED':
            return this.$t('status.notStarted')
          default:
            return this.$t('status.training')
        }
      },
      // 选择行
      selectChangeEvent({ records }) {
        this.records = records.map((item) => item.id)
      },
      // 打印
      printEvent(row) {
        let param = {
          clazzId: this.form.classNumber,
          studentIds: row.ids,
          templateHtml: null,
        }
        this.btnLoading = true
        genPdfByClazzIdAndStudentId(param)
          .then((res) => {
            this.btnLoading = false
          })
          .catch((err) => {
            this.btnLoading = false
          })
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getTableData()
      },
      toPage(row) {
        let url = `record/reports/details?studentId=${row.id || ''}&clazzId=${row.clazz.id || ''}`
        this.routerGo(url)
      },
      // 格式化性别
      genderFormat({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      // 格式化数组
      arrFormat(cellValue) {
        let row = cellValue.row
        return (
          row.flightExamFinishedCount +
          row.flightTrainingFinishedCount +
          '/' +
          (row.flightExamTotalCount + row.flightTrainingTotalCount)
        )
      },
      //  基础列表数据获取
      async getTableData() {
        this.tableData = []
        this.loading = true
        let param = {
          id: this.form.classNumber,
          searchKey: this.form.searchKey,
        }
        let rs = await getStudents(param)
        this.tableData = rs.data
        this.loading = false
      },
      searchTable() {
        if (!this.form.schoolYear) {
          this.$message.warning(this.$t('holder.pleaseSelect') + this.$t('table.schoolYear'))
          return
        }
        if (!this.form.classNumber) {
          this.$message.warning(this.$t('holder.pleaseSelect') + this.$t('table.classNumber'))
          return
        }
        this.pagination.page = 1
        this.pagination.total = 0
        this.getTableData()
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
