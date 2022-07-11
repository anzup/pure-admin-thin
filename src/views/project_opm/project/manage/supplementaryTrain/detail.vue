<template>
  <div class="detail_container">
    <MakeUpTraining type="info" :data="Order" :printId="printId" />
  </div>
</template>

<script setup lang="ts">
  import to from 'await-to-js'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getAdditionalTrainingDetail } from '/@/api/opm/train'
  import MakeUpTraining from '/@/components/makeUpTraining/index.vue'
  import XEUtils from 'xe-utils'
  const route = useRoute()

  const Order = ref<any>({})

  const printId = ref()

  onMounted(async () => {
    const [err, res] = await to(getAdditionalTrainingDetail(+route.params.id))
    if (!err) {
      const { data } = res
      let stringArr = function (arr, key) {
        if (arr instanceof Array) {
          return key ? arr.map((v) => v[key]).join(',') : arr.join(',')
        } else {
          return ''
        }
      }
      let flightEva = data.flightEvaluation || {}
      let STR = flightEva.studentTrainingRecord || {}
      let grouping = STR.grouping || {}
      Order.value = {
        exam: data.exam,
        title: STR.clazz.course.name,
        student: STR.student.name,
        teacher: stringArr(grouping.teachers, 'name'),
        airplaneModel: STR.clazz.airplaneType,
        flyTime: XEUtils.toDateString(flightEva.endTime, 'yyyy-MM-dd') || '',
        course: flightEva.name,
        result: flightEva.result,
        evaluation: flightEva.evaluation,
        estimate: flightEva.estimate,
        score: flightEva.scores,
        teacherUUID: flightEva.teacherSignature,
        studentUUID: flightEva.studentSignature,
        auditorUUID: flightEva.auditorSignature,
        courseNumber: STR.clazz.courseNumber,
        version: flightEva.syllabusItem.syllabus.version,
        trainingResultName: data.trainingResult?.name,
      }
      printId.value = data.flightEvaluation.id
    }
  })
</script>

<style scoped>
  .detail_container {
    padding: 20px;
  }
</style>
