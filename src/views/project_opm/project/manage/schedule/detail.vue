<template>
  <div class="detail-main-container">
    <el-calendar v-model="state.date">
      <template #dateCell="{ data }">
        <div class="template-container">
          <div :class="['icon-con', itemDate(data.day) ? 'no-empty' : '']">
            {{ data.day.split('-').slice(1)[1] }}
          </div>
          <template v-if="itemDate(data.day)">
            <div
              class="scheduler_item"
              v-for="(item, index) in itemDate(data.day)"
              :key="item.id"
              :style="{ background: colorList[index % 5] + '1A' }"
            >
              <div class="scheduler_header" :style="{ background: colorList[index % 5] }">
                {{ item.syllabusItemName }}
              </div>
              <div class="scheduler_conten" :style="{ color: colorList[index % 5] }">
                <div>
                  <div class="subitem">
                    <span class="subitem_icon">
                      <SvgIconVue name="timeTable-clock" />
                    </span>
                    <span>
                      {{ formatDate(item.startDate, item.endDate) }}
                    </span>
                  </div>
                  <div class="subitem">
                    <span class="subitem_icon">
                      <SvgIconVue name="timeTable-sharpicons_disc" />
                    </span>
                    <span>{{ item.courseNumber }}</span>
                  </div>
                  <div class="subitem">
                    <span class="subitem_icon">
                      <SvgIconVue name="timeTable-location" />
                    </span>
                    <span>
                      {{
                        // formatResources(
                        // item.facilityResourceId,
                        // item.facilityId
                        // )
                        item.facilityPlace
                      }}
                    </span>
                  </div>
                  <div style="width: 100%">
                    <div class="subitem" v-if="!!item.teachers">
                      <span class="subitem_icon">
                        <SvgIconVue name="timeTable-user" />
                      </span>
                      <span>
                        <span v-for="v in item.teachers" :key="v.id">
                          {{ v.name }}&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                      </span>
                    </div>
                    <div class="subitem" v-if="!!item.students" v-show="item.needGroup">
                      <span class="subitem_icon">
                        <SvgIconVue name="timeTable-user" />
                      </span>
                      <span>
                        <span v-for="v in item.students" :key="v.id">
                          {{ v.name }}&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, reactive } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import dayjs from 'dayjs'
  import SvgIconVue from '/@/components/SvgIcon/index.vue'

  const state = reactive({
    timetableData: {},
    date: '',
  })

  const router = useRouter(),
    route = useRoute()
  console.log(sessionStorage.getItem('timetableData'))
  console.log(route)

  // if (!sessionStorage.getItem('timetableData')) {
  //   router.replace({
  //     path: route.matched[1].redirect as string,
  //   })
  // }
  interface Item extends Scheduler.ISchedulerItem {
    students: DefaultAllListItem[]
    teachers: DefaultAllListItem[]
    facilityPlace: string
  }

  const itemDate = computed(
    () =>
      (date: string): Item[] =>
        state.timetableData[dayjs(date).valueOf()],
  )

  const formatDate = (startDate, endDate) =>
    dayjs(startDate).format('HH:mm') + '-' + dayjs(endDate).format('HH:mm')

  const colorList = ['#5CA5F2', '#4CAC6D', '#6C86DF', '#EFA31E', '#4ECBCE']

  onMounted(async () => {
    if (route.query.date) {
      state.date = dayjs(route.query.date as string).toDate()
    } else {
      state.date = new Date()
    }
    const timetableData = sessionStorage.getItem('timetableData')
      ? JSON.parse(sessionStorage.getItem('timetableData'))
      : {}
    state.timetableData = timetableData
  })
  onUnmounted(() => {
    sessionStorage.removeItem('timetableData')
  })
</script>

<style scoped lang="scss">
  .detail-main-container {
    height: 100%;
  }
  .is-selected {
    color: #1989fa;
  }
  :deep(.el-calendar-table) {
    &:not(.is-range) {
      //使不是本月的日期不可点击,不会跳转到其他月份
      td.next {
        pointer-events: none;
        filter: grayscale(100%);
      }
      td.prev {
        pointer-events: none;
        filter: grayscale(100%);
      }
      //td{
      //    pointer-events: none;
      //}
    }
    .el-calendar-day {
      height: unset;
      padding: 0;
      &:hover {
        background-color: transparent;
      }
    }
  }
  :deep(.el-calendar__header) {
    display: none;
  }
  :deep(.el-calendar__body) {
    padding: 0;
  }
  .template-container {
    position: relative;
    min-height: 80px;
    .icon-con {
      position: absolute;
      width: 21px;
      height: 22px;
      background: rgba(33, 94, 190, 0.1);
      background-size: contain;
      text-align: center;
      line-height: 22px;

      font-size: 12px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      border-top: 2px solid $systemDefaultColor;
      color: $systemDefaultColor;
      &.no-empty {
        border-top: unset;
        border-right: 1px dashed #ffffff;
      }
    }
    .scheduler_item {
      // height: 216px;
      // background: #5ca5f2;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .scheduler_header {
        line-height: 24px;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        text-align: center;
        color: #ffffff;
      }
      .scheduler_conten {
        flex: 1;
        padding: 7px;
        & > div {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 2px;
          display: flex;
          flex-wrap: wrap;
          .subitem {
            width: 100%;
            font-size: 12px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            text-align: left;
            // color: #ffffff;
            &:not(:last-child) {
              width: 50%;
            }
            .subitem_icon {
              display: inline-block;
              width: 20px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
              text-align: center;
              line-height: 20px;
            }
          }
        }
      }
    }
  }
</style>
>>
