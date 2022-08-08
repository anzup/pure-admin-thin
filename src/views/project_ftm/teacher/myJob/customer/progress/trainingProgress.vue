<template>
  <div class="progress-container">
    <div class="progress-title">{{ student.name }}</div>
    <div class="title-left">
      {{ customer.name }} / {{ clazz.courseNumber }} / {{ clazz.course && clazz.course.name }}
    </div>
    <div class="title-right">{{ $t('table.trainingDate') }} {{ formatDate(clazz.startTime) }}</div>
    <div class="warp-content-table">
      <table class="info-table-box">
        <tr v-for="(item, index) in itemLists" :key="index">
          <td>{{ item.name }}</td>
          <td>
            <div
              class="progress-box"
              v-for="ele in item.itemInfos"
              :key="ele.id"
              @click="goTo(index, ele)"
            >
              <div class="progress-box-top" :class="ele.finished ? 'is-finish' : ''">
                {{ ele.name }}
              </div>
              <div
                class="progress-box-text"
                :class="{
                  'is-red': ele.finished && !ele.targetFinished,
                  'is-blue': ele.targetFinished,
                }"
                v-if="ele.targetName"
              >
                <span>{{ ele.targetName }}</span>
                <i
                  :class="{
                    'el-icon-circle-check': ele.targetFinished,
                    'el-icon-circle-close': !ele.targetFinished,
                    'el-icon-remove-outline': !ele.finished,
                  }"
                />
              </div>
            </div>
          </td>
        </tr>
      </table>
      <div class="introduce">
        {{ $t('common.instructions') }}：
        <span class="is-blue"><i class="el-icon-circle-check" /> {{ $t('status.signed') }}</span>
        <span class="is-red"><i class="el-icon-circle-close" /> {{ $t('status.notSign') }}</span>
        <span class="is-normal"
          ><i class="el-icon-remove-outline" /> {{ $t('status.notStarted') }}</span
        >
      </div>
    </div>
  </div>
</template>
<script>
  import {} from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import { studentTrainingSchedule } from '/@/api/project_ftm/teacher/studentTraining'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        student: {},
        customer: {},
        itemLists: [],
        clazz: {},
        studentTrainingRecordId: '',
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
    },
    mounted() {
      this.studentTrainingSchedule()
    },
    methods: {
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd')
      },
      studentTrainingSchedule() {
        studentTrainingSchedule({
          clazzId: this.$route.query.id,
          studentId: this.$route.query.studentId,
        }).then((res) => {
          this.itemLists = res.data.itemLists
          this.student = res.data.student
          this.customer = res.data.customer
          this.clazz = res.data.clazz
          this.studentTrainingRecordId = res.data.studentTrainingRecordId
        })
      },
      goTo(index, ele) {
        if (
          this.userInfo.builtinRole == 'TRAINING_ADMIN' ||
          this.userInfo.builtinRole == 'PLANNER'
        ) {
          // 所有计划员、教务员跳转至学员培训记录
          this.$router.push({
            name: 'TrainingRecordsDetails',
            params: {
              studentId: this.$route.query.studentId,
              recordId: this.studentTrainingRecordId,
            },
          })
          return
        }
        if (index == 0 && ele.type == 'THEORY_TEACH_SCHEDULE') {
          // TODO 权限配置
          // if (!this.totalAuthorities.includes('THEORETICAL_SCHEDULE')) {
          //   return
          // }
          this.$router.push({
            path: '/teachingCenter/theorySchedule',
          })
        } else if (index == 0 && ele.type == 'THEORY_EXAM') {
          this.$router.push({
            name: 'ExamManageExamDetailsIndex',
            query: {
              examType: 'FORMAL',
            },
            params: {
              examId: ele.id,
            },
          })
        } else if (index == 1 && ele.type == 'FLIGHT_TRAINING') {
          // TODO 权限配置
          // if (!this.totalAuthorities.includes('CBTA_FILL')) {
          //   return
          // }
          this.$router.push({
            path: `/teachingCenter/flightEvaluation/evaluateEdit?id=${ele.id}`,
          })
        } else if (index == 1 && ele.type == 'FLIGHT_EXAM') {
          // TODO 权限配置
          // if (!this.totalAuthorities.includes('CBTA_FILL')) {
          //   return
          // }
          this.$router.push({
            path: `/teachingCenter/flightEvaluation/testDetails?id=${ele.id}&status=${
              ele.finished ? 'FILLED' : 'NOT_FILLED'
            }`,
          })
        } else if (index == 2) {
          this.$router.push({
            name: 'TrainingRecordsDetails',
            params: {
              studentId: this.$route.query.studentId,
              recordId: this.studentTrainingRecordId,
            },
            query: {
              tab_name: 'trainingArchives',
            },
          })
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .progress-container {
    color: #333;
  }
  .progress-title {
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    color: #333333;
  }
  .title-left,
  .title-right {
    font-size: 12px;
    color: #333333;
    line-height: 24px;
  }
  .title-right {
    text-align: right;
    margin-top: -16px;
    margin-bottom: 18px;
  }
  .info-table-box {
    td:nth-of-type(2n + 1) {
      width: 5%;
    }
    td:nth-of-type(2n) {
      width: 30%;
    }
  }
  .progress-box {
    width: 187px;
    // height: 78px;
    border: 1px solid #e6e6e6;
    display: inline-block;
    margin: 0 22px 15px 0;
    border-radius: 4px;
    cursor: pointer;
    &-top {
      height: 39px;
      border-radius: 4px;
      color: #999999;
      background: #e6e6e6;
      line-height: 39px;
      text-align: center;
    }
    .is-finish {
      color: #fff;
      background: #215ebe;
    }
    &-text {
      padding: 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span,
      i {
        color: #333;
      }
    }
  }
  .is-normal {
    font-size: 14px;
    span,
    i {
      color: #333;
    }
  }
  .is-red {
    font-size: 14px;
    span,
    i {
      color: #d65555;
    }
  }
  .is-blue {
    font-size: 14px;
    span,
    i {
      color: #215ebe;
    }
  }
  .introduce {
    margin-top: 20px;
    margin-left: 15%;
    span {
      margin-right: 30px;
    }
  }
</style>
