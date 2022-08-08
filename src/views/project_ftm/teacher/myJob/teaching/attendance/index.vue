<template>
  <div>
    <VxeTable
      v-bind="gridOptions"
      :empty-text="hasSearch ? undefined : t('tip.pleaseSelectClazzQuery')"
      @action="btnClick"
      @handle-page-change="handleCurrentChange"
    >
      <template #left_tools>
        <el-form inline>
          <!-- 考勤月份 -->
          <!-- <el-form-item :label="$t('holder.SelectMonth')">
              <el-date-picker
                  v-model="params.month"
                  type="month"
                  :placeholder="$t('holder.pleaseSelectDate')"
                  value-format="yyyy-MM"
                  @change="changeStatus"
              ></el-date-picker>
          </el-form-item> -->
          <!-- 班级课号 -->
          <el-form-item :label="$t('table.classNumber')">
            <el-select v-model="gridOptions.form.clazzId" @change="changeClazz" filterable>
              <el-option
                v-for="(item, index) in filters.clazzList"
                :key="index"
                :label="item.courseNumber"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- 考勤状态 -->
          <el-form-item :label="$t('table.attendanceStatus')">
            <el-select v-model="gridOptions.form.status" clearable @change="changeStatus">
              <el-option
                v-for="(item, index) in filters.attendanceStatus"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </VxeTable>
  </div>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import moment from 'moment'
  import { getAttendances } from '/@/api/ftm/teacher/teachingCenter'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'
  import { useRoute, useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  const { t } = useI18n()
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  const userInfo = computed(() => userStore.userInfo)
  const router = useRouter()
  const route = useRoute()
  const routerGo = useGo(router)

  const hasSearch = ref(false)
  const gridOptions = reactive({
    data: [],
    loading: false,
    columns: [
      { type: 'seq', width: '60', title: t('common.serialNumber') },
      { title: t('table.classNumber'), field: 'clazz', minWidth: 120 }, // 班级
      { title: t('table.courseTaskName'), field: 'syllabusItemName', minWidth: 120 }, // 课程任务名称
      {
        title: t('table.schoolTime'),
        field: 'startDate',
        formatter: 'formatDateTime',
        minWidth: 120,
      }, // 上课时间
      // { title: this.$t('table.courseType'), field: 'status', minWidth: 120, }, // 课程类型
      { title: t('table.classHours'), field: 'period', minWidth: 120 }, // 学时
      {
        title: t('table.tutor'),
        field: 'teachers',
        minWidth: 120,
        formatter: ({ cellValue }) => {
          return cellValue instanceof Array
            ? cellValue.map((item) => item.name).join(', ')
            : cellValue
        },
      }, // 授课教师
      {
        title: t('table.attendanceStatus'),
        field: 'status',
        minWidth: 120,
        formatter: ({ cellValue }) => {
          return filters.attendanceStatus.findIndex((item) => item.id == cellValue) > -1
            ? filters.attendanceStatus.find((item) => item.id == cellValue).name
            : cellValue
        },
      }, // 考勤状态
      {
        title: t('table.attendanceTime'),
        field: 'attendanceDate',
        minWidth: 150,
        formatter: 'formatDateTime',
      }, // 考勤时间
      { title: t('table.tableEdit'), minWidth: 320, slots: { default: 'operate' } },
    ],
    toolbarConfig: {
      slots: {
        buttons: 'left_tools',
      },
    },
    form: {
      clazzId: undefined,
      month: moment().format('YYYY-MM'),
      status: undefined,
    },
    buttons: ({ row }) => [
      {
        name: row.status == 'FINISHED' ? t('button.modify') : t('table.attendance'),
        event: () => {
          handleDetail(row)
        },
      },
    ],
  })
  const filters = reactive({
    clazzList: [],
    attendanceStatus: [
      { id: 'FINISHED', name: t('status.Attendance') },
      { id: 'UNFINISHED', name: t('status.noAttendance') },
    ],
  })

  const handleDetail = (item) => {
    routerGo(`attendance/detail?id=${item.id}&clazzName=${item.clazz}`)
  }

  // 获取列表
  const getData = async () => {
    gridOptions.loading = true
    let [err, res] = await to(getAttendances(gridOptions.form))
    gridOptions.loading = false
    if (!err && res.status == 200) {
      gridOptions.data = res.data
    }
  }
  // 获取班级
  const getClazz = async () => {
    let params = {
      page: 1,
      size: 1000,
      statusIN: 'TRAINING',
      type: 'WET_LEASE',
      teacherUserId: userInfo.value?.teacherAdmin ? undefined : userInfo.value.userId,
    }
    let [err, res] = await to(getClazzs(params))
    if (!err && res.status == 200) {
      filters.clazzList = res.data.content
    }
  }
  // 更换班级
  const changeClazz = () => {
    hasSearch.value = true
    getData()
  }
  // 更换考勤状态
  const changeStatus = () => {
    if (gridOptions.form.clazzId) {
      getData()
    }
  }
  const btnClick = ({ type: btnType, row }) => {}
  const handleCurrentChange = (val) => {
    if (val.type == 'size') {
      // gridOptions.form?.page = setPage(gridOptions.form?.total, gridOptions.form)
    }
    getData()
  }

  onMounted(async () => {
    await getClazz()
    if (route.query?.courseNumber) {
      gridOptions.form.clazzId = filters.clazzList.find(
        (item) => item.courseNumber == route.query.courseNumber,
      ).id
      getData()
    }
  })
</script>
<script lang="ts">
  export default {
    name: 'MyJobAttendanceIndex',
  }
</script>
