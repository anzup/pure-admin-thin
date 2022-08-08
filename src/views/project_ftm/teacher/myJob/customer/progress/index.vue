<template>
  <VxeTable ref="xTable" v-bind="gridOption" @handlePageChange="pagingEvent">
    <template #form>
      <el-form ref="form" :model="gridOption.form" inline>
        <!--培训项目-->
        <el-form-item :label="t('state.trainingProgram')" prop="courseId">
          <el-select clearable v-model="gridOption.form.courseId">
            <el-option
              v-for="option in filterForm.course"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
        <!--所属客户-->
        <el-form-item :label="t('table.customerBelongs')" prop="customerId">
          <el-select clearable v-model="gridOption.form.customerId">
            <el-option
              v-for="option in filterForm.customer"
              :key="option.id"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
        <!--培训状态-->
        <el-form-item :label="t('table.trainingStatusName')" prop="statusIN">
          <el-select clearable v-model="gridOption.form.statusIN">
            <el-option
              v-for="option in filterForm.status"
              :label="option.name"
              :value="option.id"
            />
          </el-select>
        </el-form-item>
        <!--开训时间-->
        <el-form-item :label="t('table.trainingTime')" prop="dateRange">
          <el-date-picker
            type="daterange"
            value-format="YYYY-MM-DD"
            v-model="gridOption.form.dateRange"
            :start-placeholder="t('table.startTime')"
            :end-placeholder="t('table.endTime')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchEvent">{{ t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #theory="{ row }">
      <el-progress
        :percentage="computePercent(row['theoryPeriods'], row['theoryPeriodTotal'])"
        :show-text="false"
      />
      <div
        class="text-center"
        :class="{
          'text-blue-400': row['theoryPeriods'] > 0,
          'text-gray-400': !row['theoryPeriods'],
        }"
      >
        {{ row['theoryPeriods'] || 0 }}/{{ row['theoryPeriodTotal'] || 0 }}
      </div>
    </template>
    <template #simulator="{ row, column }">
      <div class="table-cell-list" v-for="item in row[column.property] || []">
        <span class="!py-1">{{ item.name }}</span>
        <el-progress
          :percentage="computePercent(item.simulatorProgress, item.simulatorProgressTotal)"
          :show-text="false"
        />
        <span
          :class="{
            'text-blue-400': item?.simulatorProgress > 0,
            'text-gray-400': item?.simulatorProgress,
          }"
          >{{ item?.simulatorProgress || 0 }}/{{ item?.simulatorProgressTotal || 0 }}</span
        >
      </div>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { onMounted, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import to from 'await-to-js'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import { getCoursesAll, getCustomersAll } from '/@/api/ftm/teacher/trainingPlan'
  import { CourseStatusEnum } from '/@/enums/statusEnum'

  const { t } = useI18n()
  const router = useRouter()
  const routerGo = useGo(router)

  const gridOption = reactive<VxeTableAllProps>({
    data: [],
    loading: false,
    columns: [
      {
        type: 'seq',
        title: t('text.seq'),
        width: 60,
      },
      {
        title: t('table.schoolYear'),
        minWidth: 90,
        field: 'year',
      },
      {
        title: t('table.trainingProject'),
        minWidth: 120,
        field: 'course.name',
      },
      {
        title: t('table.classNumber'),
        minWidth: 120,
        field: 'courseNumber',
      },
      {
        title: t('table.customerBelongs'),
        minWidth: 150,
        field: 'customers',
        formatter: ({ cellValue }) =>
          cellValue instanceof Array ? cellValue.map((item) => item.name).join(',') : cellValue,
      },
      {
        title: t('text.studentNumber'),
        minWidth: 90,
        field: 'studentCount',
      },
      {
        title: t('table.trainingTime'),
        minWidth: 120,
        formatter: 'formatDate',
        field: 'startTime',
      },
      {
        title: t('text.endTrainingTime'),
        minWidth: 120,
        formatter: 'formatDate',
        field: 'endTime',
      },
      {
        title: t('text.theoryProgress'),
        minWidth: 200,
        slots: { default: 'theory' },
      },
      {
        title: t('text.simulatorProgress'),
        minWidth: 250,
        field: 'groupingVOS',
        className: 'table-cell',
        slots: { default: 'simulator' },
      },
      {
        title: t('table.trainingStatusName'),
        minWidth: 120,
        field: 'status',
        formatter: ({ cellValue }) => filterForm.status.find((item) => item.id === cellValue)?.name,
      },
      {
        title: t('text.operation'),
        minWidth: 160,
        slots: { default: 'operate' },
      },
    ],
    buttons: ({ row }): ButtonArr => [
      {
        name: t('text.teachingProgress'),
        event: () => {
          routerGo('progress/course?id=' + row.id)
        },
      },
      {
        name: t('text.taskProgress'),
        event: () => {},
      },
    ],
    form: {
      page: 1,
      size: 10,
      total: 0,
      courseId: '',
      customerId: '',
      statusIN: '',
      dateRange: ['', ''],
    },
  })
  const filterForm = reactive({
    course: [],
    customer: [],
    status: [
      { id: CourseStatusEnum.NOT_STARTED, name: t('status.notStarted') },
      { id: CourseStatusEnum.TRAINING, name: t('status.training') },
      { id: CourseStatusEnum.FINISHED, name: t('status.endTraining') },
    ],
  })
  const computePercent = (num: number, total: number) => {
    try {
      return num / total
    } catch (e) {
      return 0
    }
  }

  function searchEvent() {
    gridOption.form.page = 1
    gridOption.form.total = 0
    getData()
  }

  function pagingEvent({ page, size }) {
    gridOption.form.page = page
    gridOption.form.size = size
    getData()
  }

  // 课程列表
  async function getCourse() {
    const [err, res] = await to(getCoursesAll({}))
    if (!err && res.status === 200) {
      filterForm.course = res.data
    }
  }
  // 客户列表
  async function getCustomer() {
    const [err, res] = await to(getCustomersAll({}))
    if (!err && res.status === 200) {
      filterForm.customer = res.data
    }
  }

  function getFilterForm() {
    getCourse()
    getCustomer()
  }

  async function getData() {
    gridOption.loading = true
    const params = {
      ...gridOption.form,
      dateRange:
        gridOption.form.dateRange instanceof Array
          ? gridOption.form.dateRange.filter((value) => !!value).join(',')
          : gridOption.form.dateRange,
    }
    const [err, res] = await to(getClazzs(params))
    gridOption.loading = false
    if (!err && res.status === 200) {
      gridOption.data = res.data.content
      gridOption.form.total = res.data.totalElements
    }
  }

  getFilterForm()

  onMounted(() => {
    getData()
  })
</script>

<style lang="scss" scoped>
  :deep(.table-cell) {
    padding: 0 !important;
    .vxe-cell {
      padding: 0;
    }
    .table-cell-list {
      display: flex;
      align-items: center;
      min-height: 36px;
      border-bottom: 1px solid #e8eaec;
      .el-progress {
        flex: 1;
      }
      > span {
        display: inline-block;
        &:nth-of-type(1) {
          width: 6em;
          padding: 0 4px;
          line-height: 1;
        }
        &:nth-last-of-type(1) {
          width: 5em;
        }
      }
      &:nth-last-of-type(1) {
        border-bottom: 0;
      }
    }
  }
</style>
