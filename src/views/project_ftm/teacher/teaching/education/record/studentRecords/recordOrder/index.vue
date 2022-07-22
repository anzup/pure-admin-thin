<template>
  <el-scrollbar>
    <slot />
    <order-table ref="orderTable" :orderData="data" />
  </el-scrollbar>
</template>

<script>
  import Api from '/@/api/ftm/teacher/trainEva'
  import OrderTable from '../components/order.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        data: {},
      }
    },
    props: {
      details: Object,
      clazz: Object,
    },
    components: { OrderTable },
    mounted() {
      this.getOrderData()
    },
    methods: {
      async getOrderData() {
        // 通过clazzid 和studentid查找对应学员总评记录
        let listAll = await Api.studentAll({ studentId: this.details.id, clazzId: this.clazz.id })
        try {
          /**
           * 根据列表返回的总评id 请求得到总评详情
           */
          let RecordID = listAll.data.content[0].id
          let [err, res] = await to(Api.studentDetails({ id: RecordID }))
          if (err) return
          let data = res.data
          let STR = data.studentTrainingRecord
          let clazz = STR.clazz || {}
          let course = clazz.course || {}
          let grouping = STR.grouping || {}
          let student = STR.student || {}
          this.data = {
            id: RecordID,
            title: course.name,
            name: student.name,
            gender: student.gender,
            customer: STR.customer.name,
            year: clazz.year,
            courseNumber: clazz.courseNumber,
            courseCode: course.code,
            trainingTime: `${XEUtils.toDateString(
              data.startTime,
              'yyyy/MM/dd',
            )}-${XEUtils.toDateString(data.endTime, 'yyyy/MM/dd')}`,
            theoryTeachers:
              (clazz.theoryTeachers instanceof Array &&
                clazz.theoryTeachers.map((v) => v.name).join(',')) ||
              '',
            filghtTeachers:
              (grouping.teachers instanceof Array &&
                grouping.teachers.map((v) => v.name).join(',')) ||
              '',
            scores: data.scores,
            trainingStyleScore: data.trainingStyleScore,
            psychologyCompetencyScore: data.psychologyCompetencyScore,
            overallQualityScore: data.overallQualityScore,
            evaluation: data.evaluation,
            estimate: data.estimate,
            remark: data.remark,
            signature: data.signature,
          }
          this.$emit('getData', this.data)
        } catch (e) {
          console.log(e)
        }
      },
    },
  }
</script>
