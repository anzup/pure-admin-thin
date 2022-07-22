<template>
  <div v-if="type == 'EVALUATION'">
    <sign-report :data="order" />
  </div>
  <test-detail :details="order" v-else />
</template>

<script>
  import Api from '/@/api/ftm/teacher/trainEva'
  import { getFilghtExamDetails } from '/@/api/ftm/teacher/studentTraining'
  import SignReport from '/@/views/project_ftm/teacher/components/SignReport/index.vue'
  import TestDetail from '/@/views/project_ftm/teacher/myJob/teaching/flight/flightTest/details.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  export default {
    components: { SignReport, TestDetail },
    data() {
      return {
        order: {},
      }
    },
    computed: {
      type() {
        return this.$route.query.CBTAtype
      },
    },
    created() {
      let { id, CBTAtype } = this.$route.query
      if (CBTAtype == 'EVALUATION') {
        this.getFlyTrainDetails(id)
      } else {
        this.order = {
          id,
          status: 1,
        }
        // this.getFilghtExamDetails(id)
      }
    },
    methods: {
      async getFlyTrainDetails(id) {
        let [err, res] = await to(Api.getFlyTrainDetails({ id }))
        if (err) return
        let data = res.data
        let stringArr = function (arr, key) {
          if (arr instanceof Array) {
            return key ? arr.map((v) => v[key]).join(',') : arr.join(',')
          } else {
            return ''
          }
        }
        let STR = data.studentTrainingRecord || {}
        let grouping = STR.grouping || {}
        let course = STR.course || {}
        this.order = {
          remark: data.remark,
          exam: data.exam,
          title: STR.clazz.course.name,
          student: STR.student.name,
          teacher: data.teacherName || '',
          airplaneModel: STR.clazz.airplaneType,
          flyTime: XEUtils.toDateString(data.endTime, 'yyyy-MM-dd') || '',
          flyDateTime: [data.startTime, data.endTime],
          course: data.name,
          result: data.result,
          evaluation: data.evaluation,
          estimate: data.estimate,
          score: data.scores,
          teacherUUID: data.teacherSignature,
          studentUUID: data.studentSignature,
          auditorUUID: data.auditorSignature,
          courseNumber: STR.clazz.courseNumber,
          version: data.syllabusItem.syllabus.version,
          trainingResultId: data.trainingResult && data.trainingResult.id,
          trainingResultName: data.trainingResult && data.trainingResult.name,
        }
      },
      async getFilghtExamDetails(id) {
        let [err, res] = await to(getFilghtExamDetails({ id }))
        if (err) return
        let data = res.data
        let stringArr = function (arr, key) {
          if (arr instanceof Array) {
            return key ? arr.map((v) => v[key]).join(',') : arr.join(',')
          } else {
            return ''
          }
        }
        let STR = data.studentTrainingRecord || {}
        let grouping = STR.grouping || {}
        let course = STR.course || {}
        this.order = {
          exam: data.exam,
          title: STR.clazz.course.name,
          student: STR.student.name,
          teacher: stringArr(grouping.teachers, 'name'),
          airplaneModel: STR.clazz.airplaneType,
          flyTime: XEUtils.toDateString(data.endTime, 'yyyy-MM-dd') || '',
          flyDateTime: [data.startTime, data.endTime],
          course: data.name,
          result: data.result,
          evaluation: data.evaluation,
          score: data.scores,
          teacherUUID: data.teacherSignature,
          studentUUID: data.studentSignature,
          auditorUUID: data.auditorSignature,
          hide_estimate: true,
          remark: data.remark,
          trainingResultName: data.trainingResult && data.trainingResult.name,
        }
      },
    },
  }
</script>
