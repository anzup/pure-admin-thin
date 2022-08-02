<template>
  <VxeTable :row-class-name="rowClassName" v-bind="gridOptions" @checkbox="selectChangeEvent">
    <template #form>
      <div class="evaluate-nav-menu">
        <span class="evaluate-nav"
          ><!-- 姓名 --><span class="evaluate-label">{{ t('table.name') }}：</span
          >{{ details.studentDetails.name }}</span
        >
        <span class="evaluate-nav"
          ><!-- 性别 --><span class="evaluate-label">{{ t('table.gender') }}：</span
          >{{ genderFormat(details.studentDetails.gender) }}</span
        >
        <span class="evaluate-nav"
          ><!-- 班级课号 --><span class="evaluate-label">{{ t('table.classNumber') }}：</span
          >{{ details.clazzDetails.courseNumber }}</span
        >
        <span class="evaluate-nav"
          ><!-- 小组 --><span class="evaluate-label">{{ t('table.team') }}：</span
          >{{ details.studentDetails?.grouping?.name }}</span
        >
        <span class="evaluate-nav"
          ><!-- 带飞教员 --><span class="evaluate-label">{{ t('table.filghtTeacher') }}：</span
          >{{ filterArr(details.studentDetails?.grouping?.teachers) }}</span
        >
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="printEvent({ ids: _records.split(',') })"
          :disabled="!_records || !_records.length"
          >{{ t('button.batchPrinting') }}</el-button
        ><!-- 查询 -->

        <!-- <el-button type="primary" size="medium" class="absolute-right" @click="toPage({ ids: records, status: 'FILLED' }, 'TeachingEvaluationInfo')" :disabled="!records || !records.length">{{t('button.batchPrinting')}}</el-button>查询 -->
      </div>
    </template>
    <template #pager />

    <template #student="{ row }">
      <span v-if="row.studentSignature">{{ t('status.signed') }}</span>
      <span v-else>{{ t('status.notSign') }}</span>
    </template>
    <template #taskCount="{ row }">
      <span>{{ filterNum(row.coursewareFinishTask) }}/{{ filterNum(row.coursewareAllTask) }}</span>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import Api from '/@/api/ftm/teacher/trainEva'
  import { getStudentDetails } from '/@/api/ftm/teacher/studentTraining'
  import { flightTrainingGetPdf } from '/@/api/ftm/teacher/studentTraining'
  import { computed, onActivated, onMounted, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import to from 'await-to-js'
  import { useGo } from '/@/hooks/usePage'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const routerGo = useGo(router)
  const userStore = useFtmUserStore()

  const clazzID = ref(null)
  const studentID = ref(null)
  const _records = ref('')
  const btnLoading = ref(false)
  const details = reactive({
    studentDetails: {}, // 学员信息
    clazzDetails: {}, // 班级信息
  })
  const gridOptions = reactive({
    columns: [
      { type: 'checkbox', width: '40' },
      { type: 'seq', title: t('common.serialNumber'), width: 60 },
      { field: 'name', title: t('table.flightTrainingMission'), minWidth: 120 },
      {
        field: 'type',
        title: t('table.trainingType'),
        formatter: ({ cellValue }) => {
          switch (cellValue) {
            case 'ADDITIONAL':
              return t('status.additionalTraining')
            case 'NORMAL':
              return t('status.normalTraining')
            case 'SUPPLEMENTING':
              return t('status.supplementing')
            default:
              return ''
          }
        },
        width: 90,
      },
      {
        field: 'studentTrainingRecord.clazz.airplaneType',
        title: t('table.trainingModel'),
        minWidth: 120,
      },
      {
        field: 'result',
        title: t('table.trainingResults'),
        formatter: ({ cellValue, row }) => {
          if (row.trainingResult && row.trainingResult.name) {
            return row.trainingResult.name
          } else {
            switch (cellValue) {
              case 'ABORT':
                return t('status.adviceAbort')
              case 'ADD_ONE':
                return t('status.adviceAddOne')
              case 'ADD_TWO':
                return t('status.adviceAddTwo')
              case 'PASS':
                return t('button.pass')
              default:
                return ''
            }
          }
        },
        width: 120,
      },
      {
        field: 'status',
        title: t('table.evaluateState'),
        formatter: ({ cellValue }) => {
          switch (cellValue) {
            case 'FILLED':
              return t('status.evaluated')
            case 'NOT_FILLED':
              return t('status.notEvaluated')
            default:
              return ''
          }
        },
        width: 90,
      },
      { title: t('table.studentSignStatus'), width: 120, slots: { default: 'student' } },
      { field: 'startTime', title: t('table.trainDate'), formatter: 'formatDate', minWidth: 150 },
      {
        field: 'assignCoursewareTask',
        title: t('table.AssignCoursewareTask'),
        minWidth: 120,
        slots: { default: 'taskCount' },
      },
      { title: t('table.tableEdit'), width: 160, slots: { default: 'operate' } },
    ],
    loading: false,
    data: [],
    form: {
      // 表格分页信息
      page: 1,
      size: 1000,
      total: 0,
    },
    buttons: ({ row }) => [
      {
        name: t('button.modify'),
        visible: row.status == 'FILLED' && !row.studentSignature,
        event: () => {
          routerGo(`evaluateEdit?id=${row.id}&ids=${row.ids || ''}`)
        },
      },
      {
        name: t('button.details'),
        visible: row.status == 'FILLED' && row.studentSignature,
        event: () => {
          routerGo(`evaluateInfo?id=${row.id}&ids=${row.ids || ''}`)
        },
      },
      {
        name: t('button.evaluate'),
        visible: row.status != 'FILLED',
        event: () => {
          routerGo(`evaluateEdit?id=${row.id}&ids=${row.ids || ''}`)
        },
      },
      {
        name: t('router.readingTask'),
        event: () => {
          routerGo(
            `coursewareReadingTask?id=${row.id}&studentId=${row.studentTrainingRecord.student.userId}`,
          )
        },
      },
    ],
  })
  const userInfo = computed(() => userStore.$state)

  // 选择行
  const selectChangeEvent = ({ records }) => {
    _records.value = records.map((item) => item.id).join(',')
  }
  // 打印
  const printEvent = (row) => {
    btnLoading.value = true
    flightTrainingGetPdf({ ids: row.ids, templateHtml: null })
      .then((res) => {
        btnLoading.value = false
      })
      .catch((err) => {
        btnLoading.value = false
      })
  }
  const genderFormat = (str) => {
    switch (str) {
      case 'M':
        return t('common.male')
      case 'F':
        return t('common.female')
      default:
        return ''
    }
  }
  const rowClassName = ({ row }) => {
    try {
      return row.syllabusItem.teacher.builtinResource == 'THEORY_TEACHER' ? 'heightlight' : ''
    } catch (e) {
      return ''
    }
  }
  const filterArr = (list) => {
    return list instanceof Array ? list.map((v) => v.name).join(',') : ''
  }
  const filterNum = (value) => {
    return Number.isNaN(Number(value)) ? 0 : Number(value)
  }

  const init = async () => {
    let id = route.query.id
    let rs = await getStudentDetails({ id })
    details.studentDetails = rs.data.student
    details.studentDetails.grouping = rs.data.grouping
    details.clazzDetails = rs.data.clazz
    clazzID.value = rs.data.clazz.id
    studentID.value = rs.data.student.id
    gridOptions.loading = true
    getList()
  }
  const getList = async () => {
    let param = {
      page: gridOptions.form.page,
      size: gridOptions.form.size,
      studentId: studentID.value,
      clazzId: clazzID.value,
      builtinResource:
        userInfo.value?.builtinRole == 'THEORY_TEACHER' ? userInfo.value?.builtinRole : undefined,
    }
    gridOptions.loading = true
    let [err, rs] = await to(Api.flyTrainEva(param))
    gridOptions.loading = false
    if (!err) {
      gridOptions.data = rs.data.content
    }
  }

  onMounted(() => {
    init()
  })
</script>

<style lang="scss" scoped>
  :deep(.heightlight) {
    background: rgba($color: #e6a23c, $alpha: 0.3);
  }
  .evaluate-nav-menu {
    display: block;
    display: flex;
    margin-bottom: 8px;
    justify-content: space-between;
    align-items: center;
    .evaluate-nav {
      display: inline-block;
      font-size: 14px;
    }
    .evaluate-label {
      color: #aaa;
    }
  }
</style>
