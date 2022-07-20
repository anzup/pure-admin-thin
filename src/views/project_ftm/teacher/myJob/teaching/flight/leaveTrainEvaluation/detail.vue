<template>
  <div class="container">
    <!--<el-scrollbar class="fixed-scroll-x">-->
    <slot />
    <OrderTable ref="order" :type="type" :data="orderData" @sign="handleOrderSign" />
    <!--</el-scrollbar>-->

    <SignDialog :loadingDialog="loadingSign" v-model="showSign" @handleConfirm="submitSign" />

    <fix-footer v-if="type == OrderStatus.modify" :loading="loadingSubmit" @confirm="handleConfirm">
      <template #left>
        <el-button @click="handleCancel" type="primary" plain>{{ $t('button.cancel') }}</el-button>
      </template>
    </fix-footer>
  </div>
</template>

<script>
  import OrderTable from './components/leaveOrder.vue'
  import SignDialog from '/@/views/project_ftm/teacher/components/SignDialog/index.vue'
  import { OrderStatus, OrderType } from './components/leaveOrder.enum'
  import {
    getStudentOutTrainRecordsDetail,
    postStudentOutTrainRecordsSign,
    putStudentOutTrainRecords,
  } from '/@/api/ftm/teacher/teachingCenter'
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import { ElMessage } from 'element-plus'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        OrderStatus,
        loadingSign: false,
        loadingSubmit: false,
        showSign: false,
        signForm: {},
        orderData: {},
      }
    },
    computed: {
      type() {
        const router_type = this.$route.query.type
        if (OrderStatus.hasOwnProperty(router_type)) {
          return OrderStatus[router_type]
        } else {
          return OrderStatus.view
        }
      },
      id() {
        return this.$route.query.id
      },
    },
    components: { OrderTable, SignDialog, FixFooter },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {
        let [err, res] = await to(getStudentOutTrainRecordsDetail({ id: this.id }))
        if (!err && res.status == 200) {
          this.orderData = {
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
      // 保存修改
      async handleConfirm() {
        const params = {
          id: this.orderData.id,
          items: [],
        }
        const data = this.$refs.order.form
        for (let [key, val] of Object.entries(OrderType)) {
          params.items.push(data[val])
        }
        this.loadingSubmit = true
        let [err, res] = await to(putStudentOutTrainRecords(params))
        this.loadingSubmit = false
        if (!err && res.status == 200) {
          ElMessage.success(this.$t('tip.saveSuccessTip'))
        }
      },
      // 签名
      handleOrderSign(type) {
        this.showSign = true
        this.signForm.type = type
      },
      handleCancel() {
        this.$router.back()
      },
      // 提交签名
      async submitSign({ pinCode }) {
        const params_data = {
          id: this.orderData.id,
          items: [],
        }
        const data = this.$refs.order.form
        for (let [key, val] of Object.entries(OrderType)) {
          params_data.items.push(data[val])
        }

        this.loadingSign = true
        await to(putStudentOutTrainRecords(params_data))

        const params = {
          id: this.orderData.id,
          pinCode,
          ...this.signForm,
        }
        let [err, res] = await to(postStudentOutTrainRecordsSign(params))
        this.loadingSign = false
        if (err || res.status != 200) return

        ElMessage.success(this.$t('tip.subSuccessTip'))
        this.showSign = false
        this.getData()
      },
    },
  }
</script>
