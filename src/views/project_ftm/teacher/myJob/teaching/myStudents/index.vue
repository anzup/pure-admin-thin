<template>
  <div>
    <VxeTable v-bind="gridOptions" @action="btnClick" @handle-page-change="handleCurrentChange">
      <template #form>
        <el-form inline size="medium">
          <el-form-item :label="t('table.airlines')">
            <!-- 航空公司 -->
            <el-select v-model="gridOptions.form.airlines" :placeholder="t('common.all')" clearable>
              <el-option
                v-for="(item, index) in gridOptions.form.airlinesArr"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('table.schoolYear')">
            <!-- 学年 -->
            <el-date-picker
              v-model="gridOptions.form.schoolYear"
              type="year"
              :placeholder="t('common.all')"
              value-format="YYYY"
              :editable="false"
              :disabled-date="pickerOptions.disabledDate"
              @change="dateChange"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item :label="t('table.classNumber')">
            <!-- 班级课号 -->
            <el-select
              v-model="gridOptions.form.className"
              :placeholder="t('common.all')"
              clearable
            >
              <el-option
                v-for="(item, index) in gridOptions.form.classNameArr"
                :key="index"
                :label="item.courseNumber"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- 结业状态 -->
          <!-- <el-form-item :label="t('table.graduationStatus')">
              <el-select v-model="gridOptions.form.graduation" :placeholder="t('common.all')" style="width: 120px" >
                  <el-option v-for="(item, index) in gridOptions.form.graduationArr" :key="index" :label="item.label" :value="item.value" />
              </el-select>
          </el-form-item> -->
          <el-form-item>
            <!-- 搜索框 -->
            <el-input
              size="medium"
              :placeholder="t('holder.pleaseEnterStudentName')"
              v-model.trim="gridOptions.form.searchKey"
              style="width: 280px; margin-right: 10px"
            >
              <template #suffix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-button size="medium" type="primary" @click="search">{{
              t('button.query')
            }}</el-button>
          </el-form-item>
        </el-form>
      </template>
    </VxeTable>
  </div>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import { getStudents, airlinesMenu } from '/@/api/ftm/teacher/studentTraining'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import XEUtils from 'xe-utils'
  import moment from 'moment'
  import { useI18n } from 'vue-i18n'
  import { computed, onActivated, onMounted, reactive, ref } from 'vue'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import to from 'await-to-js'
  import { useRoute, useRouter } from 'vue-router'
  import { setPage } from '/@/utils/utils'
  import { useGo } from '/@/hooks/usePage'
  const { t } = useI18n()
  const userStore = useFtmUserStore()
  const router = useRouter()
  const route = useRoute()
  const routerGo = useGo(router)

  const menuName = ref('MY_STUDENTS')
  const form = reactive({
    page: 1,
    size: 10,
    total: 0,
    searchKey: '',
    airlines: undefined,
    airlinesArr: [],
    schoolYear: undefined,
    // schoolYears: [
    //     { label: "2021", value: "2021" },
    //     { label: "2020", value: "2020" },
    //     { label: "2019", value: "2019" },
    // ],
    className: undefined,
    classNameArr: [],
    graduation: 'NOT_GRADUATED,NOT_STARTED',
  })
  const gridOptions = reactive({
    columns: [
      { type: 'checkbox', width: 40 },
      { type: 'seq', title: t('common.serialNumber'), width: 60 },
      { field: 'student.name', title: t('table.name'), minWidth: 120 },
      {
        field: 'student.gender',
        title: t('table.gender'),
        minWidth: 90,
        formatter: ({ cellValue }) => {
          return cellValue == 'M' ? t('common.male') : t('common.female')
        },
      },
      { field: 'student.phone', title: t('table.cellPhoneNumber'), minWidth: 120 },
      { field: 'student.idNumber', title: t('table.idNumber'), minWidth: 150 },
      { field: 'student.customer.name', title: t('table.airlines'), minWidth: 100 },
      { field: 'clazz.year', title: t('table.schoolYear'), minWidth: 70 },
      { field: 'clazz.courseNumber', title: t('table.classNumber'), minWidth: 120 },
      { field: 'clazz.course.code', title: t('table.courseCode'), minWidth: 120 },
      {
        field: 'clazz.startTime',
        title: t('table.trainingDate'),
        minWidth: 180,
        formatter: ({ cellValue }) => {
          return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
        },
      },
      {
        field: 'status',
        title: t('table.graduationStatus'),
        minWidth: 150,
        formatter: ({ cellValue }) => {
          switch (cellValue) {
            case 'GRADUATED':
              return t('status.finishedStatus')
            case 'NOT_GRADUATED':
              return t('status.unfinishedStatus')
            default:
              return ''
          }
        },
      },
      { title: t('table.tableEdit'), width: 140, slots: { default: 'operate' } },
    ],
    data: [],
    toolbarConfig: null,
    loading: false,
    form: form,
    buttons: ({ row }) => [
      {
        name: t('button.details'),
        visible: userStore.totalAuthorities.includes(menuName.value + ':DETAIL'),
        event: () => {
          toDetailPage(row)
        },
      },
    ],
  })
  const pickerOptions = reactive({
    disabledDate: (val) => {
      return moment(val).valueOf() > moment().add(1, 'year').valueOf()
    },
  })

  const userInfo = computed(() => userStore.$state)

  const getAirlinesMenus = async () => {
    const [err, res] = await to(airlinesMenu({}))
    if (!err && res.status === 200) {
      gridOptions.form.airlinesArr = res.data
    }
  }
  const getClazzList = async () => {
    const params = {
      page: 1,
      size: 1000,
      year: gridOptions.form.schoolYear,
      statusIN: 'TRAINING',
      type: 'WET_LEASE',
      teacherUserId: userInfo.value?.userId,
    }
    const [err, res] = await to(getClazzs(params))
    if (!err && res.status === 200) {
      gridOptions.form.classNameArr = res.data.content
    }
  }
  // 获取学员列表
  const getData = async () => {
    const param = {
      page: gridOptions.form.page,
      size: gridOptions.form.size,
      clazzId: gridOptions.form.className,
      searchKey: gridOptions.form.searchKey ? gridOptions.form.searchKey : undefined,
      customerId: gridOptions.form.airlines,
      statusIN: gridOptions.form.graduation,
      year: gridOptions.form.schoolYear,
      teacherUserId: userInfo.value?.userId,
      // flightTeacherUserId: this.userInfo.userId
    }
    gridOptions.loading = true
    const [err, res] = await to(getStudents(param))
    gridOptions.loading = false
    if (!err && res.status === 200) {
      gridOptions.data = res.data.content
      gridOptions.form.total = res.data.totalElements
    }
  }

  const dateChange = () => {
    gridOptions.form.className = undefined
    getClazzList()
  }
  const handleCurrentChange = (val) => {
    if (val.type == 'size') {
      gridOptions.form.page = setPage(gridOptions.form.total, form)
    }
    getData()
  }
  const toDetailPage = (row) => {
    routerGo({
      path: 'myStudents/tabs/' + row.id,
    })
  }
  const search = () => {
    gridOptions.form.page = 1
    getData()
  }
  const btnClick = ({ type, row }) => {
    switch (type) {
    }
  }

  onMounted(() => {
    getAirlinesMenus()
    gridOptions.form.schoolYear = moment().format('YYYY')
    if (route.query.year) {
      gridOptions.form.className = route.query.courseNumber
      gridOptions.form.schoolYear = route.query.year
    }
    getClazzList()
    getData()
  })
</script>
<script lang="ts">
  export default {
    name: 'MyJobTeachingMyStudentsIndex',
  }
</script>
