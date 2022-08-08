<template>
  <VxeTable
    ref="xTable"
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    :buttons="tableButtons"
    v-model:form="form"
    :toolbarConfig="tableTool"
    @checkbox="selectChangeEvent"
    @handlePageChange="handlePageChange"
  >
    <template #form>
      <el-form ref="form" :model="form" :inline="true" size="medium">
        <el-form-item :label="$t('table.examYear')">
          <!-- 考试年份 -->
          <el-date-picker
            v-model="form.year"
            type="year"
            :placeholder="$t('holder.pleaseSelectYear')"
            value-format="YYYY"
            style="width: 160px"
            @change="changeYear"
          />
        </el-form-item>
        <el-form-item :label="$t('table.classNumber')">
          <el-select clearable v-model="form.courseNumber">
            <el-option
              v-for="(item, index) in clazzs"
              :key="index"
              :label="item.courseNumber"
              :value="item.courseNumber"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.examCategory')">
          <!-- 考试类别 -->
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
            ref="searchInput"
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

    <template #dateTimeRange="{ row }">
      <span class="range">{{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}</span>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import { getExams, deleteExamsId, getExamTypesAll } from '/@/api/ftm/teacher/examCenter'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import { deleteEmptyParams } from '/@/utils/index'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        menuName: 'EXAM',
        allAlign: null,
        loading: false,
        records: [],
        clazzs: [],
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: 'status,id',
          order: 'asc,desc',
          year: undefined,
          examTypeId: undefined,
          searchKey: undefined,
          courseNumber: undefined,
          createdBy: undefined,
          type: 'FORMAL',
        },
        tableData: [],
        tableTool: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: '40' },
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', minWidth: 150, title: this.$t('table.examName') },
          { field: 'year', width: 90, title: this.$t('table.examYear') },
          { field: 'examType.name', minWidth: 150, title: this.$t('table.examCategory') },
          { field: 'courseNumber', minWidth: 180, title: this.$t('table.examCourseNum') },
          {
            field: 'startDate',
            width: 180,
            title: this.$t('table.examPeriod'),
            slots: { default: 'dateTimeRange' },
          },
          { field: 'duration', title: this.$t('table.examDurationMinutes'), width: 150 },
          { field: 'creator.name', width: '150', title: this.$t('table.sponsor') },
          { field: 'studentCount', width: 90, title: this.$t('table.referenceNum') },
          {
            field: 'sameQuestion',
            width: 140,
            title: this.$t('table.examContent'),
            formatter: this.formatIsSame,
          },
          { field: 'maxRetryCount', width: 110, title: this.$t('table.autoRetestTimes') },
          {
            field: 'status',
            width: 100,
            title: this.$t('table.examStatus'),
            formatter: this.formatStatus,
          },
          { title: this.$t('table.tableEdit'), slots: { default: 'operate' }, width: 320 },
        ],
        examTypesAll: [],
      }
    },
    components: {
      VxeTable,
      selectedView,
      Search,
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      path() {
        return this.$route.path.split('/').pop()
      },
    },
    created() {
      this.getExamTypesAll()
    },
    // TODO 原缓存页面执行activated
    mounted() {
      if (this.$route.query.year) {
        this.form.year = this.$route.query.year
        this.form.courseNumber = this.$route.query.courseNumber
      }
      sessionStorage.removeItem('examId')
      sessionStorage.removeItem('itemAttributesForm')
      sessionStorage.removeItem('makeUpInfo')
      this.form.createdBy = this.userInfo.userId
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
        this.$refs.xTable.clearSelectEvent()
        this.records = []
      },
      handlePageChange({ page, size }) {
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
        this.routerGo(`${this.path}/add?type=FORMAL`)
      },
      modify(id, status) {
        if (status == 'NOT_STARTED') {
          this.routerGo(`${this.path}/info?id=${id}&active=1`)
        } else {
          this.routerGo(`${this.path}/modify?id=${id}`)
        }
      },
      details(id) {
        this.routerGo(`${this.path}/details?id=${id}`)
      },
      examDetails(id) {
        this.routerGo(`${this.path}/examDetails/${id}?examType=FORMAL`)
      },
      getExams() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        getExams(this.form).then((res) => {
          if (res.status == 200) {
            this.tableData = res.data.content
            this.total = res.data.totalElements
            this.loading = false
            this.getClearAll()
          }
        })
      },
      deleteExamsIdEvent(id) {
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
      formatIsSame({ cellValue }) {
        return cellValue
          ? this.$t('table.sameExamQuestion')
          : this.$t('table.differentExamQuestion')
      },
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
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
      // 选择年份搜索对应的班级课号
      async changeYear(year) {
        if (!year) {
          this.clazzs = []
          this.form.courseNumber = undefined
        } else {
          let [err, res] = await this.$to(
            getClazzs({ page: 1, size: 1000, year: this.form.year, type: 'WET_LEASE' }),
          )
          if (!err) {
            this.clazzs = res.data.content
          }
        }
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.$refs.searchInput.blur()
        this.getExams()
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            visible: this.containsPermissions(this.menuName + ':DETAIL'),
            event: () => {
              this.details(row.id)
            },
          },
          {
            name: this.$t('button.modify'),
            disabled: row.status == 'FINISHED',
            visible: this.containsPermissions(this.menuName + ':UPDATE'),
            event: () => {
              this.modify(row.id, row.status)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: this.containsPermissions(this.menuName + ':DELETE'),
            event: () => {
              this.deleteExamsIdEvent(row.id)
            },
          },
          {
            name: this.$t('router.examManage'),
            visible: this.containsPermissions(this.menuName + ':DETAILS_EXAM'),
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
  .range {
    word-break: keep-all;
  }
</style>
