<template>
  <div>
    <VxeTable ref="xTable" v-bind="gridOptions">
      <template #form>
        <el-form inline label-suffix=":">
          <el-form-item :label="t('state.trainingProgram')">{{
            state.detail?.course?.name
          }}</el-form-item>
          <el-form-item :label="t('table.customerBelongs')">{{
            state.detail?.customers?.map((item) => item.name).join(',')
          }}</el-form-item>
          <el-form-item :label="t('table.classNumber')">{{
            state.detail?.courseNumber
          }}</el-form-item>
          <el-form-item :label="t('table.studentsNumber')"
            >{{ state.detail?.studentCount }}{{ t('table.people') }}</el-form-item
          >
        </el-form>
      </template>
      <template #tags="{ row }">
        <h2 class="text-left font-bold">{{ row.group }}</h2>
        <div class="student-tags">
          <el-tag
            class="student-tag cursor-pointer"
            v-for="(tag, tagIndex) in computeStudents(row['list'])"
            :key="tagIndex"
            :disable-transitions="true"
            @click="tagClickEvent(tag)"
            >{{ tag.name }}</el-tag
          >
        </div>
      </template>
      <template #cards="{ row, column }">
        <div class="custom-cards">
          <el-card
            class="custom-card"
            :class="{ disabled: computeDatePeriod(card.startDate) }"
            :body-style="{ padding: 0 }"
            v-for="(card, cardIndex) in row[column.property]"
            :key="cardIndex"
            @click="cardClickEvent(card)"
          >
            <div class="content">
              <span
                class="tip"
                :class="{
                  'color-g': card.syllabusItemCourseType === SyllabusCourseTypeEnum.COURSE_TYPE,
                  'color-y': card.syllabusItemCourseType === SyllabusCourseTypeEnum.EXAM_TYPE,
                }"
                >{{ computeSyllabusType(card.syllabusItemCourseType) }}</span
              >
              <span class="date">{{ computeDate(card.startDate) }}</span>
              <div class="name">{{ card.syllabusName }}</div>
            </div>
            <div class="foot">
              <span>{{ card.airplaneType }}</span>
              <span>{{ card.teachers?.map((v) => v.name).join(',') }}</span>
            </div>
          </el-card>
        </div>
      </template>
    </VxeTable>

    <DetailDialog v-model="dialog.visible" v-bind="dialog" />
  </div>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import DetailDialog from './components/detailDialog.vue'
  import { onMounted, reactive } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import to from 'await-to-js'
  import { getClazzsId } from '/@/api/ftm/teacher/teachingPlan'
  import { useI18n } from 'vue-i18n'
  import { getClazzProgress } from '/@/api/ftm/teacher/trainingPlan'
  import {
    ExamType,
    ExamTypeEnum,
    SyllabusCourseType,
    SyllabusCourseTypeEnum,
  } from '/@/enums/exam.enum'
  import dayjs from 'dayjs'

  const router = useRouter()
  const route = useRoute()
  const routerGo = useGo(router)
  const { t } = useI18n()

  const gridOptions = reactive<VxeTableAllProps>({
    loading: false,
    showHeader: false,
    highlightCurrentRow: false,
    highlightHoverRow: false,
    spanMethod: ({ row, _rowIndex, column, visibleData }) => {
      const fields = ['type']
      const cellValue = row[column.field]
      if (cellValue && fields.includes(column.field)) {
        const prevRow = visibleData[_rowIndex - 1]
        let nextRow = visibleData[_rowIndex + 1]
        if (prevRow && prevRow[column.field] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.field] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },
    data: [],
    columns: [
      {
        width: 150,
        field: 'type',
        formatter: ({ cellValue }) => computeTypeName(cellValue),
      },
      {
        width: 200,
        className: 'align-top',
        slots: { default: 'tags' },
      },
      {
        minWidth: 300,
        field: 'list',
        className: 'align-top',
        slots: { default: 'cards' },
      },
    ],
  })
  const state = reactive({
    detail: {},
    types: [
      { id: ExamTypeEnum.FLIGHT_PRACTICE, name: '模拟机训练' },
      { id: ExamTypeEnum.GROUND_THEORY, name: '理论训练' },
    ],
    syllabusType: [
      { id: SyllabusCourseTypeEnum.COURSE_TYPE, name: '课程' },
      { id: SyllabusCourseTypeEnum.EXAM_TYPE, name: '考试' },
    ],
  })
  const dialog = reactive({
    visible: false,
    detail: {},
  })
  const computeTypeName = (id: ExamType) => state.types.find((v) => v.id === id)?.name
  const computeStudents = (list: any) => {
    return list.reduce((arr, next) => {
      const _students = []
      next?.students.forEach((v) => {
        if (!arr.find((n) => n.id === v.id)) {
          _students.push(v)
        }
      })
      return arr.concat(_students)
    }, [])
  }
  const computeSyllabusType = (type: SyllabusCourseType) =>
    state.syllabusType.find((v) => v.id === type)?.name
  const computeDate = (value: string) => {
    if (value) {
      return dayjs(value).format('MM-DD')
    } else {
      return ''
    }
  }
  const computeDatePeriod = (value: string): boolean => {
    if (value) {
      return dayjs(value) > dayjs()
    } else {
      return true
    }
  }

  // 班级详情
  async function getDetail() {
    const params = {
      id: route.query?.id,
    }
    const [err, res] = await to(getClazzsId(params))
    if (!err && res.status === 200) {
      state.detail = res.data
    }
  }
  async function getData() {
    const params = {
      id: route.query?.id,
    }
    gridOptions.loading = true
    const [err, res] = await to(getClazzProgress(params))
    gridOptions.loading = false
    if (!err && res.status === 200) {
      const data = res.data[0] || {}
      const list = []
      if (
        data.listMap[ExamTypeEnum.GROUND_THEORY] &&
        data.listMap[ExamTypeEnum.GROUND_THEORY] instanceof Array
      ) {
        const sortList = data.listMap[ExamTypeEnum.GROUND_THEORY].reduce((arr, next) => {
          if (next.syllabusItemCourseType === SyllabusCourseTypeEnum.EXAM_TYPE) {
            const preItem = arr.find(
              (item) =>
                item.syllabusItemCourseType === SyllabusCourseTypeEnum.EXAM_TYPE &&
                item.courseNumber === next.courseNumber &&
                dayjs(item.startDate).year() === dayjs(next.startDate).year(),
            )
            next.seq = preItem && preItem.seq ? ++preItem.seq : 1
          }
          return arr.concat(next)
        }, [])
        list.push({
          type: ExamTypeEnum.GROUND_THEORY,
          group: null,
          list: sortList,
        })
      }
      if (
        data.listMap[ExamTypeEnum.FLIGHT_PRACTICE] &&
        data.listMap[ExamTypeEnum.FLIGHT_PRACTICE] instanceof Array
      ) {
        const flight = {}
        data.listMap[ExamTypeEnum.FLIGHT_PRACTICE].forEach((item) => {
          if (flight[item.groupName] && flight[item.groupName] instanceof Array) {
            flight[item.groupName].push(item)
          } else {
            flight[item.groupName] = [item]
          }
        })
        for (const [key, value] of Object.entries(flight)) {
          list.push({
            type: ExamTypeEnum.FLIGHT_PRACTICE,
            group: key,
            list: value,
          })
        }
      }
      gridOptions.data = list
    }
  }

  const tagClickEvent = (item) => {
    routerGo(
      `course/detail?studentId=${item.id}&customer=${state.detail?.customers
        ?.map((item) => item.name)
        .join(',')}&courseNumber=${state.detail?.courseNumber}&clazzId=${route.query?.id}`,
    )
  }
  const cardClickEvent = (item) => {
    dialog.detail = item
    dialog.visible = true
  }

  onMounted(() => {
    getDetail()
    getData()
  })
</script>

<style scoped lang="scss">
  @import './styles/card.scss';
  .student-tags,
  .custom-cards {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: flex-start;
  }
  .student-tag {
    margin: 4px;
  }
</style>
