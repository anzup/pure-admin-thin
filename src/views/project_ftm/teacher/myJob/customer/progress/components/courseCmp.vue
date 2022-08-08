<template>
  <el-scrollbar>
    <div class="custom-cards">
      <el-card
        class="custom-card inline-block"
        v-for="(card, cardIndex) in computeListType(props.listMap)"
        :key="cardIndex"
        :body-style="{ padding: 0 }"
        :class="{ disabled: computeDatePeriod(card.startDate) }"
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

    <DetailDialog v-model="dialog.visible" v-bind="dialog" />
  </el-scrollbar>
</template>

<script lang="ts" setup>
  import DetailDialog from './detailDialog.vue'
  import { SyllabusCourseType, SyllabusCourseTypeEnum } from '/@/enums/exam.enum'
  import dayjs from 'dayjs'
  import { reactive } from 'vue'

  const props = defineProps({
    listMap: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
    },
  })
  const dialog = reactive({
    visible: false,
    detail: {},
  })
  const state = reactive({
    syllabusType: [
      { id: SyllabusCourseTypeEnum.COURSE_TYPE, name: '课程' },
      { id: SyllabusCourseTypeEnum.EXAM_TYPE, name: '考试' },
    ],
  })

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
  const computeSyllabusType = (type: SyllabusCourseType) =>
    state.syllabusType.find((v) => v.id === type)?.name
  const computeListType = (list: any[]) =>
    list
      .filter((item) => item?.type === props.type)
      .sort((prev, next) => dayjs(prev.startDate) - dayjs(next.startDate))

  const cardClickEvent = (item) => {
    dialog.detail = item
    dialog.visible = true
  }
</script>

<style lang="scss" scoped>
  @import '../styles/card.scss';
</style>
