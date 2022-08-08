<template>
  <el-dialog
    v-model="visible"
    width="700px"
    center
    :title="t('button.details')"
    :close-on-click-modal="false"
  >
    <table class="info-table-box">
      <tr>
        <td>授课类型</td>
        <td>
          {{ computeCourse(props.detail?.type) }}
        </td>
        <td>内容</td>
        <td>
          {{ computeType(props.detail?.syllabusItemCourseType) }}
        </td>
      </tr>
      <tr>
        <td>班级</td>
        <td>
          {{ props.detail?.syllabusItemName }}
        </td>
        <td>学员人数</td>
        <td>
          {{ props.detail?.students?.length }}
        </td>
      </tr>
      <tr>
        <td>课程内容</td>
        <td>
          {{ props.detail?.syllabusName }}
        </td>
        <td>课时</td>
        <td>
          {{ props.detail?.period }}
        </td>
      </tr>
      <tr>
        <td>授课日期</td>
        <td>
          {{ formatDate(props.detail?.startDate) }}
        </td>
        <td>授课时段</td>
        <td>{{ formatTime(props.detail?.startDate) }}-{{ formatTime(props.detail?.endDate) }}</td>
      </tr>
      <tr>
        <td>授课教员</td>
        <td>{{ computeListName(props.detail?.teachers) }}</td>
        <td>授课地点</td>
        <td>
          {{ props.detail?.facilityPlace }}
        </td>
      </tr>
    </table>
    <template #footer>
      <el-button type="primary" @click="addTaskEvent">发布任务</el-button>
      <el-button type="primary" @click="assignCoursewareEvent">推送课件</el-button>
      <el-button type="primary" @click="attendanceEvent">考勤</el-button>
      <el-button
        type="primary"
        v-if="props.detail?.syllabusItemCourseType === SyllabusCourseTypeEnum.EXAM_TYPE"
        :loading="loading.exam"
        @click="examDetailsEvent"
        >查看试卷</el-button
      >
      <el-button type="primary" v-else @click="flightDetailsEvent">电子讲评单</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { computed, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    ExamType,
    ExamTypeEnum,
    SyllabusCourseType,
    SyllabusCourseTypeEnum,
  } from '/@/enums/exam.enum'
  import dayjs from 'dayjs'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { getExams } from '/@/api/ftm/teacher/examCenter'
  import to from 'await-to-js'
  import { ElMessage, ElMessageBox } from 'element-plus'
  const { t } = useI18n()
  const router = useRouter()
  const routerGo = useGo(router)

  interface Props {
    modelValue: boolean
    detail: any
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    detail: {},
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
  }>()

  const visible = computed({
    get: () => props.modelValue,
    set: (value: boolean) => {
      emit('update:modelValue', value)
    },
  })

  const filterForm = reactive({
    course: [
      { id: ExamTypeEnum.FLIGHT_PRACTICE, name: '模拟机训练' },
      { id: ExamTypeEnum.GROUND_THEORY, name: '理论训练' },
    ],
    type: [
      { id: SyllabusCourseTypeEnum.COURSE_TYPE, name: '课程' },
      { id: SyllabusCourseTypeEnum.EXAM_TYPE, name: '考试' },
    ],
  })
  const computeCourse = (type: ExamType) => filterForm.course.find((v) => v.id === type)?.name
  const computeType = (type: SyllabusCourseType) => filterForm.type.find((v) => v.id === type)?.name
  const computeListName = (list: any[]) => list.map((v) => v.name).join(',')
  const formatDate = (value: string) => (value ? dayjs(value).format('YYYY-MM-DD') : value)
  const formatTime = (value: string) => (value ? dayjs(value).format('HH:mm') : value)

  const loading = reactive({
    exam: false,
  })

  function addTaskEvent() {
    routerGo('/myJob/teaching/task/teachingTaskAdd')
  }
  function assignCoursewareEvent() {
    routerGo('/myJob/courseware/assigned')
  }
  function attendanceEvent() {
    routerGo(`/myJob/teaching/attendance?courseNumber=${props.detail?.courseNumber}`)
  }
  async function examDetailsEvent() {
    const params = {
      page: 1,
      size: 10,
      sort: 'startDate',
      year: dayjs(props.detail?.startDate).year(),
      courseNumber: props.detail?.courseNumber,
    }
    loading.exam = true
    const [err, res] = await to(getExams(params))
    loading.exam = false
    if (!err && res.status === 200 && res.data.content.length > props.detail?.seq) {
      const examId = res.data.content[props.detail.seq - 1]?.id
      routerGo(`/myJob/exam/release/examDetails/${examId}?examType=FORMAL`)
    } else {
      ElMessage.error('未找到对应考试')
    }
  }
  function flightDetailsEvent() {
    routerGo(
      `/myJob/teaching/flight?courseNumber=${props.detail?.courseNumber}&year=${dayjs(
        props.detail?.startDate,
      ).year()}`,
    )
  }
</script>

<style lang="scss" scoped>
  @import '/@/style/table.scss';
</style>
