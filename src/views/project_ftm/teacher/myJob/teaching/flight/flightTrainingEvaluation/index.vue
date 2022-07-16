<template>
  <VxeTable v-bind="gridOptions" @action="btnClick" @handle-page-change="handleCurrentChange">
    <template #form>
      <el-form inline size="medium">
        <!-- 班级名称 -->
        <el-form-item :label="t('table.className')">
          <el-select clearable v-model="gridOptions.form.courseId" @change="refreshCourseNameEvent">
            <el-option
              v-for="item in gridOptions.form.courseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 学年 -->
        <el-form-item :label="t('table.schoolYear')">
          <el-date-picker
            type="year"
            value-format="yyyy"
            v-model="gridOptions.form.year"
            @change="refreshCourseNameEvent"
          />
        </el-form-item>
        <!-- 班级课号 -->
        <el-form-item :label="t('table.classNumber')">
          <el-select
            v-model="gridOptions.form.classNumber"
            :loading="classLoading"
            :placeholder="t('holder.pleaseSelectStudentYearOrClass')"
            clearable
          >
            <el-option
              v-for="item in gridOptions.form.classNumberList"
              :key="item.id"
              :label="item.courseNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            :placeholder="t('holder.pleaseEnterStudentName')"
            suffix-icon="el-icon-search"
            v-model.trim="gridOptions.form.searchKey"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTable">{{ t('button.query') }}</el-button
          ><!-- 查询 -->
        </el-form-item>
      </el-form>
    </template>
    <template #edit="{ row }">
      <span
        class="buttonEdit"
        @click="toPage(row, 'TeachingEvaluationTable')"
        v-permission="menuName + ':APPRAISE'"
        >{{ t('table.evaluate') }}</span
      >
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { getStudents, noFinishedClazzs } from '/@/api/ftm/teacher/studentTraining'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useRoute, useRouter } from 'vue-router'
  import to from 'await-to-js'
  import { useI18n } from 'vue-i18n'
  import { setPage } from '/@/utils/utils'

  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()
  const userStore = useFtmUserStore()
  const userInfo = computed(() => userStore.$state)

  const menuName = ref('FLIGHT_TRAINING_EVALUATION')
  const classLoading = ref(false)
  const gridOptions = reactive({
    data: [],
    loading: false,
    columns: [
      { type: 'checkbox', width: 40 },
      { type: 'seq', title: t('common.serialNumber'), width: 60 },
      { field: 'student.name', title: t('table.name'), minWidth: 120 },
      {
        field: 'student.gender',
        title: t('table.gender'),
        width: 80,
        formatter: ({ cellValue }) => {
          return cellValue == 'M' ? t('common.male') : t('common.female')
        },
      },
      { field: 'customer.name', title: t('table.airlines'), minWidth: 160 },
      { field: 'clazz.courseNumber', title: t('table.classNumber'), minWidth: 160 },
      { field: 'grouping.name', title: t('table.team'), minWidth: 200 },
      {
        field: 'grouping.teachers',
        title: t('table.filghtTeacher'),
        minWidth: 160,
        formatter: ({ cellValue }) => {
          return cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : ''
        },
      },
      { title: t('table.tableEdit'), width: 120, slots: { default: 'operate' } },
    ],
    form: {
      page: 1,
      size: 10,
      total: 0,
      classNumber: undefined,
      classNumberList: [],
      searchKey: undefined,
      year: null,
      courseId: null,
      courseList: [],
    },
    toolbarConfig: {
      enabled: false,
      slots: {
        buttons: 'left_tools',
      },
    },
  })

  // 交互/操作事件
  const refreshCourseNameEvent = () => {
    gridOptions.form.classNumber = ''
    getClassMethod()
  }
  const toPage = (row, pageName) => {
    router.push({
      name: pageName,
      query: {
        id: row.id,
      },
    })
  }
  const searchTable = () => {
    gridOptions.form.page = 1
    getTableData()
  }
  const handleCurrentChange = (val) => {
    if (val.type == 'size') {
      gridOptions.form.page = setPage(gridOptions.form.total, gridOptions.form)
    }
    getTableData()
  }
  const btnClick = ({ type, row }) => {}

  //  基础列表数据获取
  const getTableData = async () => {
    gridOptions.loading = true
    let param = {
      page: gridOptions.form.page,
      size: gridOptions.form.size,
      clazzId: gridOptions.form.classNumber,
      statusIN: 'NOT_GRADUATED,NOT_STARTED',
      teacherUserId: userInfo.value.userId,
      year: gridOptions.form.year,
      searchKey: gridOptions.form.searchKey,
    }
    let [err, res] = await to(getStudents(param))
    gridOptions.loading = false
    if (!err && res.status === 200) {
      gridOptions.data = res.data.content
      gridOptions.form.total = res.data.totalElements
    }
  }
  // 获取课程列表
  const getCourseMethod = async () => {
    const [err, res] = await to(getCoursesAll())
    if (!err && res.status == 200) {
      gridOptions.form.courseList = res.data
    }
  }
  // 获取课号列表
  const getClassMethod = async () => {
    const params = {
      courseId: gridOptions.form.courseId,
      year: gridOptions.form.year,
      teacherUserId: userInfo.value.userId,
    }
    classLoading.value = true
    const [err, res] = await to(noFinishedClazzs(params))
    classLoading.value = false
    if (!err && res.status == 200) {
      gridOptions.form.classNumberList = res.data.content
    }
  }

  onMounted(() => {
    if (route.query.id) {
      gridOptions.form.classNumber = Number(route.query.id)
    }
    getTableData()
    getCourseMethod()
  })
</script>
