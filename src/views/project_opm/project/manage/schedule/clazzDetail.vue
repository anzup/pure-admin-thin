<template>
  <div class="detail-main-container">
    <vxe-grid ref="gridRef" id="grid" :data="getStudentList" :columns="studentTableColums" border>
      <template #form>
        <div class="form_con">
          <div style="width: 200px">
            <el-select v-model="currentGroup" v-show="detailType !== 'GROUND_THEORY'">
              <el-option
                v-for="item in groupList"
                :key="item.id"
                :label="item?.name"
                :value="item.name"
              />
            </el-select>
          </div>
          <span>
            {{ courseNumber }}{{ $t('text.class') }}
            <span v-show="detailType !== 'GROUND_THEORY'"
              >{{ groupName }}{{ $t('text.group') }}</span
            >
            {{ $t('text.student_list') }}
          </span>
          <div style="width: 200px; text-align: right">
            <el-button type="primary" @click="gethtml">{{ $t('text.print') }}</el-button>
          </div>
        </div>
      </template>
    </vxe-grid>
    <el-divider />
    <vxe-grid
      ref="buttomGridRef"
      id="grid"
      :data="getTimetableList"
      :columns="timetableColums"
      border
    >
      <template #form>
        <div class="form_con">
          <span>
            {{ courseNumber }}{{ $t('text.class') }}
            <span v-show="detailType !== 'GROUND_THEORY'"
              >{{ groupName }}{{ $t('text.group') }}</span
            >
            {{ $t('text.timetable') }}
          </span>
        </div>
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, reactive, toRefs, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { mergeArray } from '/@/utils/utils'

  import dayjs from 'dayjs'
  import useResources from './common/useResources'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    setup() {
      const { t } = useI18n()
      const dayName = [
        t('text.sunday'),
        t('text.monday'),
        t('text.tuesday'),
        t('text.wednesday'),
        t('text.thursday'),
        t('text.friday'),
        t('text.saturday'),
      ]
      const route = useRoute()
      const { deduplication } = useResources()
      const state = reactive({
        clazzVO: {},
        listMap: {},
        studentList: [],
        timetableList: [],
        studentTableColums: [
          { field: 'name0', title: t('text.full_name') },
          {
            field: 'groupName0',
            title: t('text.group_seq'),
            formatter: ({ cellValue }) => cellValue || '',
          },
          { field: 'phone0', title: t('text.cell_phone_number') },
          { field: 'customer0', title: t('text.airline_company') },
          { field: 'name1', title: t('text.full_name') },
          {
            field: 'groupName1',
            title: t('text.group_seq'),
            formatter: ({ cellValue }) => cellValue || '',
          },
          { field: 'phone1', title: t('text.cell_phone_number') },
          { field: 'customer1', title: t('text.airline_company') },
        ],
        timetableColums: [
          {
            field: 'startDate',
            title: t('text.date'),
            formatter: 'formatDate',
          },
          {
            field: 'lastModifiedDate',
            title: t('text.week'),
            formatter: ({ row }) => dayName[dayjs(row.startDate).day()],
          },
          {
            field: 'endDate',
            title: t('text.time'),
            formatter: ({ row }) =>
              dayjs(row.startDate).format('HH:mm') + '-' + dayjs(row.endDate).format('HH:mm'),
          },
          { field: 'period', title: t('text.class_hour') },
          { field: 'syllabusItemName', title: t('text.course_content') },
          {
            field: 'facilityPlace',
            title: t('text.practice_facilities'),
            // formatter: ({ row }) =>
            //     formatResources(row.facilityResourceId, row.facilityId)
          },
          { field: 'groupName', title: t('text.group_seq') },
          {
            field: 'teachers',
            title: t('text.faculty_name'),
            formatter: ({ cellValue }) => cellValue.map((v) => v.name) || '',
          },
        ],

        // 分组列表
        groupList: [],
        // 当前分组
        currentGroup: '',
        // 班级信息
        courseNumber: undefined,
      })

      const gridRef = ref()
      const buttomGridRef = ref()
      const gethtml = () => {
        let topContent = ''
        const tophtml = `
                <div class="form_con">
                <span>
                        ${state.courseNumber}${t('text.class')}
                        ${
                          detailType.value !== 'GROUND_THEORY'
                            ? `<span >${groupName.value}${t('text.group')}</span>`
                            : ''
                        }
                        ${t('text.student_list')}
                    </span>
                </div>
            `
        const bottomhtml = `
                <div class="form_con">
                <span>
                        ${state.courseNumber}${t('text.group')}
                        ${
                          detailType.value !== 'GROUND_THEORY'
                            ? `<span >${groupName.value}${t('text.group')}</span>`
                            : ''
                        }
                        ${t('text.timetable')}
                    </span>
                </div>
            `
        gridRef.value.print({
          beforePrintMethod: ({ content }) => {
            topContent = content
            return false
          },
        })
        buttomGridRef.value.print({
          style: `.divider{
                            margin-bottom: 50px;
                    }
                    .form_con {
                        padding: 10px 0 ;
                        display: flex;
                        justify-content: space-between;
                        background-color: #215ebe;
                        line-height: 36px;
                        text-align: center;
                        color: #333;
                        }
                    .form_con>span{
                            flex: 1;
                        }
                    `,
          beforePrintMethod: ({ content }) => {
            return tophtml + topContent + '<div class="divider"></div>' + bottomhtml + content
          },
        })
      }

      const detailType = computed<string>(() => route.params.type as string)

      const groupName = computed<string>(
        () => state.groupList.find((v) => v?.name == state.currentGroup)?.name,
      )

      // 计算得到学员的列表
      const getStudentList = computed<any[]>(() =>
        detailType.value == 'GROUND_THEORY'
          ? mergeArray(state.studentList, 2)
          : mergeArray(
              state.studentList.filter((v) =>
                state.currentGroup == t('text.ungrouped')
                  ? !v.groupName
                  : v.groupName == state.currentGroup,
              ),
              2,
            ),
      )
      // 计算得到班级课表
      const getTimetableList = computed<any[]>(() =>
        detailType.value == 'GROUND_THEORY'
          ? state.timetableList
          : state.timetableList.filter((v) =>
              state.currentGroup == t('text.ungrouped')
                ? !v.groupName
                : v.groupName == state.currentGroup,
            ),
      )

      onMounted(async () => {
        let clazzTimetableData =
          sessionStorage.getItem('clazzTimetableData') &&
          JSON.parse(sessionStorage.getItem('clazzTimetableData'))
        if (clazzTimetableData) {
          // 判断是否是理论课程的详情
          state.courseNumber = clazzTimetableData.courseNumber

          // const { data } = await getEmployeesList({
          //     page: 1,
          //     size: 100,
          //     ids:
          //         detailType.value == "GROUND_THEORY"
          //             ? clazzTimetableData.listMap.GROUND_THEORY?.filter(
          //                   v => v.teacherId
          //               )
          //                   .map(v => v.teacherId)
          //                   .join()
          //             : clazzTimetableData.listMap.FLIGHT_PRACTICE?.filter(
          //                   v => v.teacherId
          //               )
          //                   .map(v => v.teacherId)
          //                   .join()
          // });
          // state.teacherList = data.content;

          if (detailType.value == 'GROUND_THEORY') {
            state.timetableList = clazzTimetableData.listMap.GROUND_THEORY
            state.studentList = clazzTimetableData.studentTheory as any[]
          } else {
            state.timetableList = clazzTimetableData.listMap.FLIGHT_PRACTICE
            state.studentList = clazzTimetableData.studentFlight as any[]
            // 获取学员的分组
            state.groupList = deduplication(clazzTimetableData.studentFlight || [])
            // 默认选中的分组
            state.currentGroup = state.groupList[0]?.name
          }
        }
      })
      return {
        ...toRefs(state),
        gridRef,
        gethtml,
        detailType,
        groupName,
        getStudentList,
        getTimetableList,
        buttomGridRef,
      }
    },
  })
</script>

<style lang="scss" scoped>
  :deep(.vxe-grid--form-wrapper) {
    padding: 0 0;
  }
  .form_con {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    background-color: $systemDefaultColor;
    line-height: 36px;
    text-align: center;
    color: #fff;
    & > span {
      flex: 1;
    }
  }
</style>
