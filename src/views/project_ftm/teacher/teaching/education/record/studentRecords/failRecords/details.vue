<template>
  <sign-report :data="order" />
</template>

<script>
  import SignReport from '/@/views/project_ftm/teacher/components/SignReport/index.vue'
  import Api from '/@/api/ftm/teacher/trainEva'
  import XEUtils from 'xe-utils'
  import { getFilghtExamDetails } from '/@/api/ftm/teacher/studentTraining'
  import to from 'await-to-js'
  export default {
    components: { SignReport },
    data() {
      return {
        order: {},
      }
    },
    props: {
      details: {
        type: Object,
        default: () => ({}),
      },
    },
    computed: {
      id() {
        return this.details.id || this.$route.query.records_id
      },
      type() {
        return this.details.type || this.$route.query.type
      },
    },
    created() {
      if (this.type == 'EVALUATION') {
        this.getFlyTrainDetails(this.id)
      } else {
        this.getFilghtExamDetails(this.id)
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
        this.$nextTick(() => {
          this.$emit('finishDraw')
        })
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
          trainingResultName: data.trainingResult && data.trainingResult.name,
        }
        this.$nextTick(() => {
          this.$emit('finishDraw')
        })
      },
    },
  }
</script>
