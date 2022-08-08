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
            value-format="YYYY"
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
            v-model.trim="gridOptions.form.searchKey"
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
          <el-button type="primary" @click="searchTable">{{ t('button.query') }}</el-button
          ><!-- 查询 -->
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import { getStudents, noFinishedClazzs } from '/@/api/ftm/teacher/studentTraining'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import to from 'await-to-js'
  import { useI18n } from 'vue-i18n'
  import { setPage } from '/@/utils/utils'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'

  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()
  const routerGo = useGo(router)
  const { t } = useI18n()

  const userInfo = computed(() => userStore.userInfo)

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
    buttons: ({ row }) => [
      {
        name: t('table.evaluate'),
        visible: userStore.ContainsPermissions(menuName.value + ':APPRAISE'),
        event: () => {
          toPage(row)
        },
      },
    ],
  })

  // 交互/操作事件
  const refreshCourseNameEvent = () => {
    gridOptions.form.classNumber = ''
    getClassMethod()
  }
  const toPage = (row) => {
    routerGo(`flight/evaluateTable?id=${row.id}`)
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

  onMounted(async () => {
    if (route.query.id) {
      gridOptions.form.classNumber = Number(route.query.id)
    }
    if (route.query?.year && route.query?.courseNumber) {
      gridOptions.form.year = route.query.year
      await getClassMethod()
      gridOptions.form.classNumber = gridOptions.form.classNumberList.find(
        (item) => item.courseNumber === route.query.courseNumber,
      )?.id
    }
    getTableData()
    getCourseMethod()
  })
</script>
