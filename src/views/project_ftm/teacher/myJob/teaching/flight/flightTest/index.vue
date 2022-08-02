<template>
  <VxeTable
    v-bind="gridOptions"
    @action="btnClick"
    @checkbox="selectChangeEvent"
    @handle-page-change="handleCurrentChange"
  >
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
        <el-form-item :label="t('table.classNumber')">
          <!-- 班级课号 -->
          <el-select
            :loading="classLoading"
            v-model="gridOptions.form.classNumber"
            :placeholder="t('holder.pleaseSelectStudentYearOrClass')"
            @change="getCouseNumber"
            clearable
            filterable
          >
            <el-option
              v-for="(item, index) in gridOptions.form.classList"
              :key="index"
              :label="item.courseNumber"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('table.filghtTeam')">
          <!-- 飞行小组 -->
          <el-select
            v-model="gridOptions.form.teamName"
            :placeholder="t('tip.pleaseSelectCourseNumber')"
          >
            <el-option
              v-for="(item, index) in gridOptions.form.teamList"
              :key="index"
              :label="item.name"
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
          <el-button type="primary" @click="search">{{ t('button.query') }}</el-button
          ><!-- 查询 -->
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="printEvent({ ids: records.split(',') })"
            :disabled="!records || !records.length"
            >{{ t('button.batchPrinting') }}</el-button
          ><!-- 查询 -->
          <!-- <el-button type="primary" @click="toPage('TeachingFlightTestDetails',{ ids: records, status: 'FILLED' })" :disabled="!records || !records.length">{{t('button.batchPrinting')}}</el-button>查询 -->
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>
  <qr-dialog v-if="qrDialogVisible" v-model="qrDialogVisible" :rowData="rowData" />
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import qrDialog from './components/qrCodeDialog.vue'
  import Api from '/@/api/ftm/teacher/trainEva'
  import { groupAll, noFinishedClazzs } from '/@/api/ftm/teacher/studentTraining'
  import { flightExamGetPdf } from '/@/api/ftm/teacher/studentTraining'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import { computed, onActivated, onMounted, reactive, ref } from 'vue'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { setPage } from '/@/utils/utils'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  const userStore = useFtmUserStore()
  const userInfo = computed(() => userStore.$state)
  const router = useRouter()
  const route = useRouter()
  const { t } = useI18n()

  const menuName = ref('FLIGHT_TEST')
  const gridOptions = reactive({
    data: [],
    loading: false,
    columns: [
      { type: 'checkbox', width: '40' },
      { type: 'seq', title: t('common.serialNumber'), width: 60 },
      { field: 'studentTrainingRecord.student.name', title: t('table.name'), minWidth: 120 },
      {
        field: 'studentTrainingRecord.student.gender',
        title: t('table.gender'),
        width: 80,
        formatter: ({ cellValue }) => {
          return cellValue == 'M' ? t('common.male') : t('common.female')
        },
      },
      {
        field: 'studentTrainingRecord.student.idNumber',
        title: t('table.idNumber'),
        minWidth: 180,
      },
      { field: 'studentTrainingRecord.customer.name', title: t('table.airlines'), minWidth: 100 },
      {
        field: 'studentTrainingRecord.clazz.courseNumber',
        title: t('table.classNumber'),
        minWidth: 140,
      },
      { field: 'studentTrainingRecord.grouping.name', title: t('table.filghtTeam'), minWidth: 120 },
      {
        field: 'studentTrainingRecord.grouping.teachers',
        title: t('table.filghtTeacher'),
        minWidth: 120,
        formatter: ({ cellValue }) => {
          return cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : ''
        },
      },
      {
        field: 'status',
        title: t('table.writeStatus'),
        width: 90,
        formatter: ({ cellValue }) => {
          switch (cellValue) {
            case 'FILLED':
              return t('status.fillOver')
            case 'NOT_FILLED':
              return t('status.noFill')
            default:
              return ''
          }
        },
      },
      {
        field: 'studentSignature',
        title: t('table.studentSignStatus'),
        width: 120,
        formatter: ({ cellValue }) => {
          if (cellValue) {
            return t('status.signed')
          } else {
            return t('status.notSign')
          }
        },
      },
      {
        field: 'type',
        title: t('table.examType'),
        width: 90,
        formatter: ({ cellValue }) => {
          switch (cellValue) {
            case 'NORMAL':
              return t('status.normalTest')
            case 'SUPPLEMENTARY':
              return t('status.makeUpTest')
            default:
              return ''
          }
        },
      },
      {
        field: 'result',
        title: t('table.examResults'),
        width: 90,
        formatter: ({ cellValue }) => {
          switch (cellValue) {
            case 'PASS':
              return t('status.qualified')
            case 'ABORT':
              return t('status.unqualified')
            case 'ADD_ONE':
              return t('status.unqualified')
            case 'ADD_TWO':
              return t('status.unqualified')
            default:
              return ''
          }
        },
      },
      { title: t('table.tableEdit'), width: 120, slots: { default: 'operate' } },
    ],
    form: {
      page: 1,
      size: 10,
      total: 0,
      classNumber: undefined,
      teamName: undefined,
      searchKey: '',
      classList: [],
      teamList: [],
      courseId: null,
      courseList: [],
      year: null,
    },
    toolbarConfig: {
      enabled: false,
      slots: {
        buttons: 'left_tools',
      },
    },
    buttons: ({ row }) => [
      // {
      //   name: t('button.qrCode'),
      //   visible: userStore.ContainsPermissions(menuName.value + ':QR_CODE'),
      //   event: () => {
      //     qrView(row)
      //   },
      // },
      {
        name: t('button.details'),
        visible:
          userStore.ContainsPermissions(menuName.value + ':DETAIL') &&
          row.status == 'FILLED' &&
          row.teacherSignature,
        event: () => {
          toPage('TeachingFlightTestDetails', { id: row.id, status: row.status })
        },
      },
      {
        name: t('button.modify'),
        visible:
          userStore.ContainsPermissions(menuName.value + ':DETAIL') && row.status == 'FILLED',
        event: () => {
          toPage('TeachingFlightTestDetails', { id: row.id, status: 'modify' })
        },
      },
      {
        name: t('button.fillIn'),
        visible:
          userStore.ContainsPermissions(menuName.value + ':FILL_OUT') &&
          !(row.status == 'FILLED' && row.teacherSignature) &&
          row.status != 'FILLED',
        event: () => {
          toPage('TeachingFlightTestDetails', { id: row.id, status: row.status })
        },
      },
    ],
  })
  const qrDialogVisible = ref(false)
  const rowData = ref()
  const records = ref('')
  const btnLoading = ref(false)
  const classLoading = ref(false)

  // 交互事件
  // 选择行
  const selectChangeEvent = ({ records }) => {
    records.value = records.map((item) => item.id).join(',')
  }
  const qrView = (row) => {
    qrDialogVisible.value = true
    rowData.value = row
  }
  const handleCurrentChange = (val) => {
    if (val.type == 'size') {
      gridOptions.form.page = setPage(gridOptions.form.total, gridOptions.form)
    }
    getTableData()
  }
  const refreshCourseNameEvent = () => {
    gridOptions.form.classNumber = ''
    getClassMethod()
  }
  const toPage = (name, query) => {
    router.push({
      name,
      query,
    })
  }
  const search = () => {
    gridOptions.form.page = 1
    getTableData()
  }
  const btnClick = ({ type: btnType, row }) => {}

  // 请求事件
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
      gridOptions.form.classList = res.data.content
    }
  }
  // 获取课程列表
  const getCourseMethod = async () => {
    const [err, res] = await to(getCoursesAll())
    if (!err && res.status == 200) {
      gridOptions.form.courseList = res.data
    }
  }
  // 获取列表
  const getTableData = async () => {
    gridOptions.loading = true
    let param = {
      page: gridOptions.form?.page,
      size: gridOptions.form?.size,
      searchKey: gridOptions.form?.searchKey,
      clazzId: gridOptions.form?.classNumber,
      groupingId: gridOptions.form?.teamName,
      year: gridOptions.form?.year,
      // clazzStatusIN: 'NOT_STARTED,TRAINING'
      studentStatusIN: 'NOT_GRADUATED,NOT_STARTED',
    }
    const [err, res] = await to(Api.flyExam(param))
    gridOptions.loading = false
    if (!err && res.status === 200) {
      gridOptions.data = res.data.content
      gridOptions.form.total = res.data.totalElements
    }
  }
  // 打印
  const printEvent = async (row) => {
    btnLoading.value = true
    flightExamGetPdf({ ids: row.ids, templateHtml: null })
      .then((res) => {
        btnLoading.value = false
      })
      .catch((err) => {
        btnLoading.value = false
      })
  }
  // 获取飞行小组
  const getCouseNumber = async (value) => {
    if (value) {
      await groupAll({ clazzId: gridOptions.form.classNumber }).then((res) => {
        gridOptions.form.teamName = undefined
        gridOptions.form.teamList = res.data
      })
    } else {
      gridOptions.form.teamList = []
      gridOptions.form.teamName = undefined
    }
  }

  onMounted(() => {
    getTableData()
    // getCourseMethod()
  })

  onActivated(() => {
    // if (route.query.id) {
    //   gridOptions.form.classNumber = Number(route.query.id)
    // }
    // getTableData()
  })
</script>
