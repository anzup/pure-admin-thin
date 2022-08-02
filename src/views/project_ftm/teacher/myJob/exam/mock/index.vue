<template>
  <VxeTable
    ref="xTable"
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    :buttons="tableButtons"
    v-model:form="form"
    :toolbarConfig="tableTools"
    @checkbox="selectChangeEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form ref="form" :model="form" :inline="true" size="medium">
        <el-form-item :label="$t('table.examYear')">
          <el-date-picker
            v-model="form.year"
            type="year"
            :placeholder="$t('holder.pleaseSelectYear')"
            value-format="YYYY"
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.examCategory')">
          <el-select v-model="form.examTypeId" :placeholder="$t('holder.pleaseSelect')" clearable>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in examTypesAll"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseEnterTheNameOfTheTest')"
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
      <el-button
        v-if="containsPermissions(menuName + ':ADD')"
        size="mini"
        @click="add"
        type="primary"
        >{{ $t('button.add') }}</el-button
      >
    </template>

    <template #startDate="{ row }">
      <span class="date-range"
        >{{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}</span
      >
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import { getExams, deleteExamsId, getExamTypesAll } from '/@/api/ftm/teacher/examCenter'
  import { deleteEmptyParams } from '/@/utils/index'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        menuName: 'SIM_EXAM',
        loading: false,
        records: [],
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: 'status,id',
          order: 'asc,desc',
          year: undefined,
          examTypeId: undefined,
          searchKey: undefined,
          type: 'SIMULATED',
        },
        examTypesAll: [],
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: '40' },
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', minWidth: '150', title: this.$t('table.examName') },
          { field: 'year', width: 90, title: this.$t('table.examYear') },
          { field: 'examType.name', width: 90, title: this.$t('table.examCategory') },
          { field: 'courseNumber', minWidth: '150', title: this.$t('table.examCourseNum') },
          {
            field: 'startDate',
            title: this.$t('table.examPeriod'),
            width: 200,
            slots: { default: 'startDate' },
          },
          { field: 'duration', title: this.$t('table.examDurationMinutes'), width: 140 },
          { field: 'creator.name', title: this.$t('table.sponsor'), minWidth: '150' },
          { field: 'studentCount', title: this.$t('table.referenceNum'), width: 90 },
          {
            field: 'status',
            title: this.$t('table.examStatus'),
            formatter: this.formatStatus,
            width: 90,
          },
          { title: this.$t('table.tableEdit'), width: 320, slots: { default: 'operate' } },
        ],
      }
    },
    components: { selectedView, VxeTable, Search },
    computed: {
      xTable() {
        return this.$refs.xTable.$refs.xTable
      },
    },
    created() {
      sessionStorage.removeItem('examId')
      sessionStorage.removeItem('itemAttributesForm')
      this.getExamTypesAll()
    },
    // TODO 原缓存页面执行 activated
    mounted() {
      this.getExams()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      selectChangeEvent({ records }) {
        this.records = XEUtils.map(records, (item) => item.id)
      },
      getClearAll() {
        this.xTable?.clearSelectEvent()
        this.records = []
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getExams()
      },
      getExamTypesAll() {
        getExamTypesAll().then((res) => {
          if (res.status == 200) {
            this.examTypesAll = res.data
          }
        })
      },
      add() {
        this.routerGo(`mock/add?type=SIMULATED`)
      },
      modify(id, status) {
        let active = 1
        if (status == 'FINISHED') {
          return false
        } else if (status == 'EXAMING') {
          active = 3
        }
        this.routerGo(`mock/info?id=${id || ''}&active=${active}`)
      },
      details(id) {
        this.routerGo(`mock/details?id=${id || ''}`)
      },
      examDetails(id) {
        this.routerGo(`mock/examDetails/${id}?examType=SIMULATED`)
      },
      getExams() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        getExams(this.form)
          .then((res) => {
            if (res.status == 200) {
              this.tableData = res.data.content
              this.form.total = res.data.totalElements
              this.loading = false
              this.getClearAll()
            }
          })
          .catch((e) => {
            this.loading = false
          })
      },
      deleteExamsId(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteExamsId({ id: id }).then((res) => {
            if (res.status == 200) {
              if (parseInt(this.total / this.form.size) < this.form.page && this.form.page !== 1) {
                this.form.page = parseInt(this.total / this.form.size)
              }
              this.getExams()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd HH:mm:ss')
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
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.getExams()
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            visible: userStore.ContainsPermissions(this.menuName + ':DETAIL'),
            event: () => {
              this.details(row.id)
            },
          },
          {
            name: this.$t('button.modify'),
            visible: userStore.ContainsPermissions(this.menuName + ':UPDATE'),
            disabled: row.status == 'FINISHED',
            event: () => {
              this.modify(row.id, row.status)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: userStore.ContainsPermissions(this.menuName + ':DELETE'),
            event: () => {
              this.deleteExamsId(row.id)
            },
          },
          {
            name: this.$t('router.examManage'),
            visible: userStore.ContainsPermissions(this.menuName + ':DETAILS_EXAM'),
            event: () => {
              this.examDetails(row.id)
            },
          },
        ]
      },
    },
  }
</script>

<style scoped lang="scss">
  .date-range {
    word-break: keep-all;
  }
</style>
