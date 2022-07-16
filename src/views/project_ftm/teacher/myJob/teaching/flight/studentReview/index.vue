<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :form="pagination"
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
            value-format="yyyy"
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
        <el-form-item :label="$t('button.status')">
          <!-- 状态 -->
          <el-select
            v-model="form.status"
            :placeholder="$t('common.all')"
            style="width: 150px"
            clearable
            @change="changeFormData(...arguments, 'status')"
          >
            <el-option
              v-for="item in form.statusArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- 查询关键字 -->
          <el-input
            :placeholder="$t('holder.pleaseEnterStudentName')"
            suffix-icon="el-icon-search"
            v-model.trim="form.searchKey"
            class="searchInput"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="printEvent({ ids: records.split(',') })"
            :disabled="!records || !records.length"
            >{{ $t('button.batchPrinting') }}</el-button
          ><!-- 查询 -->
        </el-form-item>
      </el-form>
    </template>

    <template #edit="{ row }">
      <div class="button-line">
        <span
          class="buttonEdit"
          @click="toPage(row, 'StudentReviewEdit')"
          v-if="row.status == 'FILLED' && !row.signature"
          v-permission="menuName + ':UPDATE'"
          >{{ $t('button.modify') }}</span
        >
        <span
          class="buttonEdit"
          @click="toPage(row, 'StudentReviewEdit', 'detail')"
          v-else-if="row.status == 'FILLED'"
          >{{ $t('button.details') }}</span
        >
        <span
          class="buttonEdit"
          @click="toPage(row, 'StudentReviewEdit', 'add')"
          v-else
          v-permission="menuName + ':APPRAISE'"
          >{{ $t('button.evaluate') }}</span
        >
      </div>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import Api from '/@/api/ftm/teacher/trainEva'
  import { airlinesMenu, noFinishedClazzs } from '/@/api/ftm/teacher/studentTraining'
  import { studentFinalGetPdf } from '/@/api/ftm/teacher/studentTraining'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { VxeTable },
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
          {
            field: 'status',
            title: this.$t('button.status'),
            width: 120,
            formatter: this.statusFormat,
          },
          { title: this.$t('table.tableEdit'), width: 120, slots: { default: 'operate' } },
        ],
        records: '',
        btnLoading: false,
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
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
      toPage(row, name, status) {
        this.$router.push({
          name,
          query: {
            ids: row.ids,
            id: row.id,
            status: row.status,
            type: status,
            recordId: row.studentTrainingRecord && row.studentTrainingRecord.id,
          },
        })
      },
      // 打印
      printEvent(row) {
        this.btnLoading = true
        studentFinalGetPdf({ ids: row.ids, templateHtml: null })
          .then((res) => {
            this.btnLoading = false
          })
          .catch((err) => {
            this.btnLoading = false
          })
      },
      async getData() {
        let param = {
          page: this.pagination.page,
          size: this.pagination.size,
          clazzId: this.form.classNumber,
          customerId: this.form.airline,
          searchKey: this.form.searchKey,
          status: this.form.status,
          year: this.form.year,
          // clazzStatusIN: 'NOT_STARTED,TRAINING'
          studentStatusIN: 'NOT_GRADUATED,NOT_STARTED',
        }
        this.loading = true
        let [err, res] = await to(Api.studentAll(param))
        this.loading = false
        if (!err && res.status === 200) {
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
      changeFormData(val, key) {
        if (val == '') {
          this.form[key] = undefined
        }
      },
      btnClick() {},
    },
  }
</script>
