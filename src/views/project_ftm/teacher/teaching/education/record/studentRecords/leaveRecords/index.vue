<template>
  <el-scrollbar>
    <slot />
    <OrderTable :type="OrderStatus.view" :data="OrderData" />
  </el-scrollbar>
</template>

<script>
  import OrderTable from '/@/views/project_ftm/teacher/myJob/teaching/flight/leaveTrainEvaluation/components/leaveOrder.vue'
  import {
    OrderStatus,
    OrderType,
  } from '/@/views/project_ftm/teacher/myJob/teaching/flight/leaveTrainEvaluation/components/leaveOrder.enum'
  import {
    getStudentOutTrainRecords,
    getStudentOutTrainRecordsDetail,
  } from '/@/api/ftm/teacher/teachingCenter'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        OrderStatus,
        OrderData: {},
      }
    },
    computed: {
      recordId() {
        return this.$route.params.recordId
      },
    },
    components: { OrderTable },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {
        let [list_err, list_res] = await to(
          getStudentOutTrainRecords({ studentTrainingRecordId: this.recordId }),
        )
        if (list_err || list_res.status != 200) return
        if (list_res.data.content instanceof Array == false || list_res.data.content.length < 1)
          return
        let [err, res] = await to(
          getStudentOutTrainRecordsDetail({ id: list_res.data.content[0].id }),
        )
        if (!err && res.status == 200) {
          this.OrderData = {
            id: res.data.id,
            student:
              (res.data.studentTrainingRecord && res.data.studentTrainingRecord.student) || {},
            [OrderType.course]:
              (res.data.items instanceof Array &&
                res.data.items.find((item) => item.type == OrderType.course)) ||
              {}, // 课程
            [OrderType.train]:
              (res.data.items instanceof Array &&
                res.data.items.find((item) => item.type == OrderType.train)) ||
              {}, // 训练
            [OrderType.thisTrain]:
              (res.data.items instanceof Array &&
                res.data.items.find((item) => item.type == OrderType.thisTrain)) ||
              {}, // 本场训练
          }
        }
      },
    },
  }
</script>
