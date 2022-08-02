<template>
  <table class="print-wrap-table page-break-wrap" style="margin-bottom: 20px">
    <thead>
      <tr>
        <th>
          <div class="print-wrap-header">
            <h1>{{ data.title }}</h1>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="print-wrap-content">
          <table class="details-table">
            <tr class="average">
              <td>
                <span class="details-label">{{ $t('table.studentName') }}：</span>{{ data.name }}
              </td>
              <!-- 学员姓名 -->
              <td>
                <span class="details-label">{{ $t('table.gender') }}：</span>{{ data.gender }}
              </td>
              <!-- 性别 -->
              <td>
                <span class="details-label">{{ $t('table.airlines') }}：</span>{{ data.customer }}
              </td>
              <!-- 航空公司 -->
            </tr>
            <tr class="average">
              <!-- <td><span class="details-label">{{ $t('table.trainingYear') }}：</span>{{ data.year }}</td> -->
              <!-- 训练年度 -->
              <td>
                <span class="details-label">{{ $t('table.classNumber') }}：</span
                >{{ data.courseNumber }}
              </td>
              <!-- 班级课号 -->
              <td>
                <span class="details-label">{{ $t('table.courseCode') }}：</span
                >{{ data.courseCode }}
              </td>
              <!-- 课程代号 -->
              <td>
                <span class="details-label">{{ $t('table.examDate') }}：</span
                >{{ data.trainingDate }}
              </td>
              <!-- 训练时间 -->
            </tr>
            <tr class="average">
              <td>
                <span class="details-label">{{ $t('table.RecommendExamTeacher') }}：</span
                >{{ data.recommendTeacher }}
              </td>
              <!-- 推荐考试人 -->
              <td>
                <span class="details-label">{{ $t('table.theoryTeacher') }}：</span
                >{{ data.theoryTeachers }}
              </td>
              <!-- 理论教员 -->
              <td>
                <span class="details-label">{{ $t('table.flightInstructor') }}：</span
                >{{ data.flightTeachers }}
              </td>
              <!-- 飞行教员 -->
            </tr>
          </table>

          <table class="details-table">
            <tr class="details-title">
              <td colspan="4">{{ $t('table.assessmentScore') }}</td>
              <!-- 考核得分 -->
            </tr>
            <tr>
              <td class="center c1 point-bg">
                {{ $t('common.serialNumber') }}
              </td>
              <!-- 序号 -->
              <td class="center c2">{{ $t('common.assessmentCriteria') }}</td>
              <!-- 考核标准 -->
              <td class="center">{{ $t('table.evaluationCoreCompetence') }}</td>
              <!-- 核心能力评估 -->
              <td class="center">
                {{ $t('table.behavioralIndicatorsNoPass') }}
              </td>
              <!-- 行为指标不满足项 -->
            </tr>
            <tr v-for="(item, index) in data.scores" :key="item.name">
              <td class="center point-bg">{{ index + 1 }}</td>
              <td class="center">{{ item.name }}</td>
              <td class="center">
                <el-rate
                  v-model="item.score"
                  :disabled="orderType < 2"
                  :colors="['#FF9900', '#FF9900', '#FF9900']"
                  disabled-void-color="#99A9BF"
                />
              </td>
              <td class="center">
                <!-- <span v-if="item.score <= 3" class="">{{ $t('table.clickSelect') }}</span> -->
                <span class="behavior-line" v-if="item.score <= 3 && orderType == 1">{{
                  getBehavior(item.behavior)
                }}</span>
                <div class="behavior-line" v-else>
                  <a
                    v-if="item.score <= 3 && orderType > 1"
                    href="javascript:void(0);"
                    class="sign-link"
                    @click="handleSelect(item)"
                    >{{ getBehavior(item.behavior) || $t('table.clickSelect') }}</a
                  >
                  <span v-if="item.score > 3">{{ (item.behavior = '') }}</span>
                </div>
              </td>
            </tr>
          </table>

          <table class="details-table">
            <tr class="details-title">
              <td colspan="4">{{ $t('table.assessmentResults') }}</td>
              <!-- 考核结果 -->
            </tr>
            <tr>
              <td class="center c1 point-bg">{{ $t('table.examResults') }}</td>
              <!-- 考核结果 -->
              <td colspan="3">
                <template>{{ resultFormat(data.result) }}</template>
              </td>
            </tr>
            <tr v-if="data.resultType == '2'">
              <td class="center c1 point-bg">
                {{ $t('table.disposalOpinions') }}
              </td>
              <!-- 处置结果 -->
              <td colspan="3">
                <template>
                  {{
                    resultArr.find((v) => v.id == this.data.result)
                      ? resultArr.find((v) => v.id == this.data.result)['name']
                      : ''
                  }}
                </template>
              </td>
            </tr>
            <tr class="h1">
              <td class="center point-bg">
                {{ $t('table.assessmentEvaluation') }}
              </td>
              <!-- 考核评价 -->
              <td colspan="3">
                <template>{{ data.evaluation }}</template>
              </td>
            </tr>
            <tr class="details-title">
              <td colspan="4">{{ $t('table.sign') }}</td>
              <!-- 签名 -->
            </tr>
            <tr class="h1">
              <td class="center point-bg">{{ $t('table.inspector') }}</td>
              <!-- 检察员 -->
              <td class="center" width="350px">
                <div class="sign-img-con">
                  <template>
                    <img :src="teacherSignURL" alt="" class="sign-img" v-if="data.teacherUUID" />
                  </template>
                </div>
              </td>
              <td class="center c1 point-bg">{{ $t('table.student') }}</td>
              <!-- 学员 -->
              <td class="center" width="350px">
                <img :src="studentSignURL" alt="" class="sign-img" v-if="data.studentUUID" />
              </td>
            </tr>
            <!-- 备注 -->
            <!-- <tr v-if="data.resultType == '2'">
                              <td class="center c1">{{ $t('table.remarks') }}</td>
                              <td colspan="3">
                                  <template>
                                      {{ data.auditRemark }}
                                  </template>
                              </td>
                          </tr> -->
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  import Api from '/@/api/ftm/teacher/trainEva'
  import XEUtils from 'xe-utils'
  export default {
    data() {
      return {
        resultArr: [
          // { id: 'PASS', name: this.$t('button.pass') },
          { id: 'ADD_ONE', name: this.$t('status.addOneForExam') },
          { id: 'ADD_TWO', name: this.$t('status.addTwoForExam') },
          { id: 'ABORT', name: this.$t('status.abortTrain') },
        ],
        data: {},
      }
    },
    computed: {
      orderType() {
        return (this.$route.query.status == 'FILLED' && 1) || (this.data.status ? 1 : 2)
      },
      teacherSignURL() {
        let uuid = this.data.teacherUUID
        return uuid ? Api.getSignURL(uuid) : ''
      },
      studentSignURL() {
        let uuid = this.data.studentUUID
        return uuid ? Api.getSignURL(uuid) : ''
      },
    },
    props: ['id'],
    mounted() {
      this.init()
    },
    methods: {
      // 格式化结果
      resultFormat(cellValue) {
        switch (cellValue) {
          case 'PASS':
            return this.$t('button.pass')
          case 'ABORT':
            return this.$t('status.abort')
          case 'ADD_ONE':
            return this.$t('status.addOne')
          case 'ADD_TWO':
            return this.$t('status.addTwo')
          default:
            return ''
        }
      },
      getBehavior(val) {
        if (val) {
          try {
            return JSON.parse(val)
              .map((item) => item.code)
              .join(' , ')
          } catch (error) {
            return ''
          }
        } else {
          return ''
        }
      },
      async init() {
        let { data } = await Api.getFlyExamDetails({ id: this.id })
        let STR = data.studentTrainingRecord
        let student = STR.student
        let clazz = STR.clazz || {}
        let course = clazz.course || {}
        let grouping = STR.grouping || {}
        this.data = {
          title: course.name,
          name: student.name,
          gender: (student.gender == 'M' && this.$t('common.male')) || this.$t('common.female'),
          customer: STR.customer.name,
          year: clazz.year,
          courseNumber: clazz.courseNumber,
          courseCode: course.code,
          trainingDate: `${XEUtils.toDateString(
            data.startTime,
            'yyyy/MM/dd',
          )}—${XEUtils.toDateString(data.endTime, 'yyyy/MM/dd')}`,
          theoryTeachers:
            (clazz.theoryTeachers instanceof Array &&
              clazz.theoryTeachers.map((v) => v.name).join(',')) ||
            '',
          flightTeachers:
            (grouping.teachers instanceof Array &&
              grouping.teachers.map((v) => v.name).join(',')) ||
            '',
          scores: data.scores,
          result: data.result,
          resultType:
            data.result == 'PASS'
              ? '1'
              : this.resultArr.some((v) => v.id == data.result)
              ? '2'
              : '',
          evaluation: data.evaluation,
          status: data.status,
          teacherUUID: data.teacherSignature,
          studentUUID: data.studentSignature,
          auditorUUID: data.auditorSignature,
          recommendTeacher: data.inspector || '',
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  @media print {
    .page-break-wrap {
      page-break-after: always; // page-break inside
    }
  }
</style>
