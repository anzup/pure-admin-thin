<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :buttons="tableButtons"
    v-model:form="pagination"
    @action="btnClick"
    @checkbox="selectChangeEvent"
    @handle-page-change="handleCurrentChange"
  >
    <template #form>
      <el-form inline size="medium">
        <el-form-item :label="$t('table.airlines')">
          <!-- 航空公司 -->
          <el-select v-model="form.airline" :placeholder="$t('common.all')" clearable>
            <el-option
              v-for="item in form.airlines"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 班级名称 -->
        <el-form-item :label="$t('table.className')">
          <el-select clearable v-model="form.courseId" @change="refreshCourseNameEvent">
            <el-option
              v-for="item in form.courseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 学年 -->
        <el-form-item :label="$t('table.schoolYear')">
          <el-date-picker
            type="year"
            value-format="YYYY"
            v-model="form.year"
            @change="refreshCourseNameEvent"
          />
        </el-form-item>
        <el-form-item :label="$t('table.classNumber')">
          <!-- 班级课号 -->
          <el-select
            :loading="classLoading"
            v-model="form.classNumber"
            :placeholder="$t('holder.pleaseSelectStudentYearOrClass')"
            clearable
            filterable
          >
            <el-option
              v-for="item in form.classNumbers"
              :key="item.id"
              :label="item.courseNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 状态 -->
        <!-- <el-form-item :label="$t('button.status')">
                        <el-select v-model="form.status" :placeholder="$t('common.all')" style="width: 120px">
                            <el-option  v-for="item in form.statusArr" :key="item.id" :label="item.name" :value="item.id"/>
                        </el-select>
                    </el-form-item> -->
        <el-form-item>
          <!-- 查询关键字 -->
          <el-input
            :placeholder="$t('holder.pleaseEnterStudentName')"
            v-model.trim="form.searchKey"
            class="searchInput"
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
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import { airlinesMenu, noFinishedClazzs } from '/@/api/ftm/teacher/studentTraining'
  import { getStudentOutTrainRecords } from '/@/api/ftm/teacher/teachingCenter'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { deleteEmptyParams } from '/@/utils'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        menuName: 'STUDENT_REVIEW',
        loading: false,
        classLoading: false,
        form: {
          airline: undefined,
          airlines: [],
          classNumber: undefined,
          classNumbers: [],
          status: undefined,
          statusArr: [
            { id: undefined, name: this.$t('common.all') },
            { id: 'FILLED', name: this.$t('status.evaluated') },
            { id: 'NOT_FILLED', name: this.$t('status.notEvaluated') },
          ],
          searchKey: '',
          courseId: null,
          courseList: [],
          year: null,
        },
        pagination: {
          // 表格分页信息
          page: 1,
          size: 10,
          total: 0,
        },
        tableData: [],
        tableColumns: [
          { type: 'checkbox', width: '40' },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          {
            field: 'studentTrainingRecord.student.name',
            title: this.$t('table.name'),
            minWidth: 80,
          },
          {
            field: 'studentTrainingRecord.student.gender',
            title: this.$t('table.gender'),
            width: 70,
            formatter: this.genderFormat,
          },
          {
            field: 'studentTrainingRecord.student.idNumber',
            title: this.$t('table.idNumber'),
            minWidth: 170,
          },
          {
            field: 'studentTrainingRecord.customer.name',
            title: this.$t('table.airlines'),
            minWidth: 140,
          },
          {
            field: 'studentTrainingRecord.clazz.courseNumber',
            title: this.$t('table.classNumber'),
            minWidth: 120,
          },
          {
            field: 'studentTrainingRecord.clazz.theoryTeachers',
            title: this.$t('table.theoryTeacher'),
            minWidth: 120,
            formatter: this.teacherFormat,
          },
          {
            field: 'studentTrainingRecord.grouping.teachers',
            title: this.$t('table.flightInstructor'),
            minWidth: 120,
            formatter: this.teacherFormat,
          },
          // { field: "status", title: this.$t('button.status'), width: 120, formatter: this.statusFormat },
          { title: this.$t('table.tableEdit'), width: 120, slots: { default: 'operate' } },
        ],
        records: '',
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    components: { VxeTable, Search },
    created() {
      airlinesMenu().then((res) => {
        this.form.airlines = res.data
      })
      this.getData()
      this.getCourseMethod()
    },
    activated() {
      if (this.$route.query.id) {
        this.form.classNumber = Number(this.$route.query.id)
      }
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
      // 选择行
      selectChangeEvent({ records }) {
        this.records = records.map((item) => item.id).join(',')
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      async getData() {
        let param = {
          page: this.pagination.page,
          size: this.pagination.size,
          clazzId: this.form.classNumber,
          customerId: this.form.airline,
          searchKey: this.form.searchKey,
          // status: this.form.status,
          year: this.form.year,
          clazzStatusIN: 'NOT_STARTED,TRAINING',
          studentStatusIN: 'NOT_GRADUATED,NOT_STARTED',
        }
        this.loading = true
        let [err, res] = await to(getStudentOutTrainRecords(param))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.pagination.total = res.data.totalElements
        }
      },
      // 获取课号列表
      async getClassMethod() {
        const params = {
          courseId: this.form.courseId,
          year: this.form.year,
          teacherUserId: this.userInfo.userId,
        }
        this.classLoading = true
        const [err, res] = await to(noFinishedClazzs(params))
        this.classLoading = false
        if (!err && res.status == 200) {
          this.form.classNumbers = res.data.content
        }
      },
      // 获取课程列表
      async getCourseMethod() {
        const [err, res] = await to(getCoursesAll())
        if (!err && res.status == 200) {
          this.form.courseList = res.data
        }
      },
      refreshCourseNameEvent() {
        this.form.classNumber = ''
        this.getClassMethod()
      },
      // 格式化教师数组
      teacherFormat({ cellValue }) {
        return cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : ''
      },
      // 格式化状态
      statusFormat({ cellValue }) {
        switch (cellValue) {
          case 'FILLED':
            return this.$t('status.evaluated')
          case 'NOT_FILLED':
            return this.$t('status.notEvaluated')
          default:
            return ''
        }
      },
      // 格式化性别
      genderFormat({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      search() {
        this.pagination.page = 1
        this.getData()
      },
      btnClick() {},
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.evaluate'),
            event: () => {
              let query = {
                ids: row.ids,
                id: row.id,
                status: row.status,
                type: 'modify',
                recordId: row?.studentTrainingRecord?.id,
              }
              let url = 'flight/leaveTrainEvaluation?'
              query = deleteEmptyParams(query)
              for (let [key, value] of Object.entries(query)) {
                url += `${key}=${value}&`
              }
              url = url.substring(0, url.length - 1)
              this.routerGo(url)
            },
          },
        ]
      },
    },
  }
</script>
