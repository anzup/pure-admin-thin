<template>
  <VxeTable
    :data="tableData"
    :loading="tableLoading"
    :columns="tableColumns"
    :buttons="tableButtons"
    v-model:form="pagination"
    @handlePageChange="tablePagination"
  >
    <template #form>
      <el-form inline size="medium">
        <!-- 考试年份 -->
        <el-form-item :label="$t('table.examYear')">
          <el-date-picker
            type="year"
            v-model="form.year"
            value-format="YYYY"
            style="width: 120px"
            @change="changeYear"
          />
        </el-form-item>
        <!-- 班级课号 -->
        <el-form-item :label="$t('table.classNumber')">
          <el-select v-model="form.courseNumber" clearable>
            <el-option
              v-for="(item, index) in clazzs"
              :key="index"
              :label="item.courseNumber"
              :value="item.courseNumber"
            />
          </el-select>
        </el-form-item>
        <!-- 考试类别 -->
        <el-form-item :label="$t('table.examCategory')">
          <el-select v-model="form.examTypeId" clearable>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in examTypesAll"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <!-- 搜索关键字 -->
        <el-form-item>
          <el-input
            ref="searchInput"
            :placeholder="$t('holder.pleaseEnterTheNameOfTheTest')"
            v-model="form.searchKey"
            style="width: 280px; margin-right: 10px"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #dateTimeRange="{ row }">
      <span class="range">{{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}</span>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import { getExams, getExamTypesAll } from '/@/api/ftm/teacher/examCenter'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  export default {
    components: { VxeTable, Search },
    data() {
      return {
        form: {
          sort: 'status,startDate',
          order: 'asc,desc',
          year: undefined,
          examTypeId: undefined,
          searchKey: undefined,
          courseNumber: undefined,
          type: 'FORMAL',
        },
        clazzs: [],
        examTypesAll: [],
        tableData: [],
        tableLoading: false,
        tableColumns: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', minWidth: 150, title: this.$t('table.examName') },
          { field: 'year', width: 90, title: this.$t('table.examYear') },
          { field: 'examType.name', minWidth: '150', title: this.$t('table.examCategory') },
          { field: 'courseNumber', minWidth: '150', title: this.$t('table.examCourseNum') },
          {
            field: 'startDate',
            width: 160,
            title: this.$t('table.examPeriod'),
            slots: { default: 'dateTimeRange' },
          },
          { field: 'duration', title: this.$t('table.examDurationMinutes'), width: 130 },
          { field: 'creator.name', width: '150', title: this.$t('table.sponsor') },
          { field: 'studentCount', width: '80', title: this.$t('table.referenceNum') },
          {
            field: 'status',
            width: 120,
            title: this.$t('table.examStatus'),
            formatter: this.formatStatus,
          },
          { title: this.$t('table.tableEdit'), slots: { default: 'operate' }, width: 200 },
        ],
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
      }
    },
    created() {
      this.getData()
      this.getExamTypesAll()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      // 分页事件
      tablePagination({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      // 获取考试列表
      async getData() {
        let params = {
          ...this.form,
          year: this.form.year || undefined,
          examTypeId: this.form.examTypeId || undefined,
          courseNumber: this.form.courseNumber || undefined,
          page: this.pagination.page,
          size: this.pagination.size,
        }
        this.tableLoading = true
        let [err, res] = await to(getExams(params))
        this.tableLoading = false
        if (!err) {
          this.tableData = res.data.content
          this.pagination.total = res.data.totalElements
        }
      },
      // 获取考试类别
      getExamTypesAll() {
        getExamTypesAll().then((res) => {
          if (res.status == 200) {
            this.examTypesAll = res.data
          }
        })
      },
      // 选择年份搜索对应的班级课号
      async changeYear(year) {
        if (!year) {
          this.clazzs = []
          this.form.courseNumber = undefined
        } else {
          let [err, res] = await to(
            getClazzs({ page: 1, size: 1000, year: this.form.year, type: 'WET_LEASE' }),
          )
          if (!err) {
            this.clazzs = res.data.content
          }
        }
      },
      // 格式化时间格式
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      // 格式化考试状态
      formatStatus({ cellValue }) {
        if (cellValue == 'EXAMING') {
          return this.$t('status.inProgress')
        } else if (cellValue == 'FINISHED') {
          return this.$t('status.finished')
        } else {
          return this.$t('status.notStarted')
        }
      },
      // 查询
      handleSearch() {
        this.pagination.page = 1
        this.getData()
      },
      // 查看详情
      details(id) {
        this.routerGo(`record/details?id=${id}`)
      },
      // 考试详情
      examDetails(id) {
        this.routerGo(`record/examDetails/${id}?examType=FORMAL&origin=OTHER`)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            event: () => {
              this.details(row.id)
            },
          },
          {
            name: this.$t('button.examDetails'),
            event: () => {
              this.examDetails(row.id)
            },
          },
        ]
      },
    },
  }
</script>
