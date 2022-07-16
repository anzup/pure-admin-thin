<template>
  <div class="container">
    <div class="print-wrapper" ref="printOrder">
      <!-- <div style="text-align: right; margin-bottom: 10px;" v-if="type == 'info'">
                <el-button type="primary" class="no-print" @click="printEvent">{{ids?t('button.batchPrinting'):t('button.print')}}</el-button>
            </div> -->
      <Report v-if="!ids" :type="type" :data="Order" ref="reportRef" @signEvent="showDialog" />
      <Report
        v-else-if="ids && Array.isArray(ids)"
        v-for="id in ids"
        :key="id"
        :type="type"
        :id="id"
        ref="reportRef"
      />

      <fix-footer v-if="type == 'edit'" :loading="loadingSubmit" @confirm="handleConfirm">
        <el-button slot="left" @click="handleCancel" type="primary" plain>{{
          t('button.cancel')
        }}</el-button>
      </fix-footer>
    </div>

    <!-- 签名码 -->
    <el-dialog
      width="400px"
      top="30vh"
      :title="t('table.sign')"
      v-model="signDialogVisible"
      :modal="false"
      :close-on-click-modal="false"
      center
    >
      <el-form :inline="true" ref="pinFormRef" label-width="100px" :rules="pinRules" :model="form">
        <el-form-item :label="t('table.pinCode')" prop="pincode">
          <el-input
            type="password"
            v-model="form.pincode"
            :placeholder="t('holder.pleaseEnterSignPinCode')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleDialogCancel" type="primary" plain size="medium">{{
          t('button.cancel')
        }}</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="handDialogConfirm"
          :loading="loadingDialog"
          >{{ t('button.confirm') }}</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import Report from '/@/views/project_ftm/teacher/components/SignReport/index.vue'
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import Api from '/@/api/ftm/teacher/trainEva'
  import { flightTrainingGetPdf } from '/@/api/ftm/teacher/studentTraining'
  import XEUtils from 'xe-utils'
  import moment from 'moment'
  import { computed, nextTick, onMounted, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Data } from '/@/views/project_ftm/teacher/components/SignReport/typs'
  import { useRoute, useRouter } from 'vue-router'
  import to from 'await-to-js'
  import { ElMessage } from 'element-plus'

  interface Details extends Data {
    id?: string | number
    type?: string
  }
  interface Props {
    details: Details
    type: string
  }
  const props = withDefaults(defineProps<Props>(), {
    details: () => ({
      exam: false,
      status: '',
      title: '',
      student: '',
      teacher: '',
      airplaneModel: '',
      flyTime: '',
      course: '',
      result: '',
      trainingResultId: '',
      trainingResultName: '',
      evaluation: '',
      estimate: '',
      score: [],
      teacherUUID: '',
      studentUUID: '',
      auditorUUID: '',
      courseNumber: null,
      version: '',
    }),
    type: 'edit',
  })
  const emit = defineEmits<{
    (e: 'finishDraw'): void
  }>()

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const InfoRouteNames = ['MyJobTeachingFlightEvaluateInfo', 'MyJobTeachingFailRecordRecord']

  const id = computed(() => props.details?.id || route.query.id)
  const ids = computed(
    () => route.query.ids && typeof route.query.ids === 'string' && route.query?.ids?.split(','),
  )
  // TODO: route.meta.type 属性挂载到引用标签上
  const type = computed(() =>
    InfoRouteNames.includes(route.name)
      ? 'info'
      : props.details.type || (props.type == 'info' ? 'info' : 'edit'),
  )
  const signDialogVisible = ref(false)
  const loadingDialog = ref(false)
  const loadingSubmit = ref(false)
  const form = reactive({
    pincode: '',
  })

  console.log(route)
  const pinRules = reactive({
    pincode: [{ required: true, message: t('holder.pleaseEnterSignPinCode'), trigger: 'click' }],
  })
  const Order = reactive<Data>({
    exam: false,
    status: '',
    title: '',
    student: '',
    teacher: '',
    airplaneModel: '',
    flyTime: '',
    course: '',
    result: '',
    trainingResultId: '',
    trainingResultName: '',
    evaluation: '',
    estimate: '',
    score: [],
    teacherUUID: '',
    studentUUID: '',
    auditorUUID: '',
    courseNumber: null,
    version: '',
  })
  const reportRef = ref()
  const pinFormRef = ref()

  // 交互事件
  const printEvent = () => {
    flightTrainingGetPdf({ ids: [route.query.id], templateHtml: null })
  }
  // 点击取消 （表单）
  const handleCancel = () => {
    router.back()
  }
  // 点击取消（签名码）
  const handleDialogCancel = () => {
    signDialogVisible.value = false
  }
  // 点击提交（签名码）
  const handDialogConfirm = () => {
    pinFormRef.value.validate((bool) => {
      if (bool) {
        loadingDialog.value = true
        setSign()
      }
    })
  }
  const showDialog = () => {
    form.pincode = ''
    signDialogVisible.value = true
  }

  // 请求事件
  const init = async () => {
    const _id = id.value
    let [err, res] = await to(Api.getFlyTrainDetails({ id: _id }))
    if (err) return false
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

    Order.exam = data.exam
    Order.status = data.status
    Order.title = STR.clazz.course.name // 飞行项目
    Order.student = STR.student.name // 学员姓名
    Order.teacher = data.teacherName || '' // 飞行教员
    Order.airplaneModel = STR.clazz.airplaneType // 飞机型号
    Order.flyTime =
      data.status == 'FILLED'
        ? moment(data.endTime).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD') // 飞行时间
    Order.course = data.name // 课程
    Order.result = data.result // 结果
    Order.trainingResultId = data.trainingResult && data.trainingResult.id
    Order.trainingResultName = data.trainingResult && data.trainingResult.name
    Order.evaluation = data.evaluation // 评语
    Order.estimate = data.estimate
    Order.score = data.scores // 项目
    Order.teacherUUID = data.teacherSignature // 教员签名
    Order.studentUUID = data.studentSignature // 学员签名
    Order.auditorUUID = data.auditorSignature
    Order.courseNumber = STR.clazz.courseNumber
    Order.version = data.syllabusItem.syllabus.version

    nextTick(() => {
      emit('finishDraw')
    })
  }
  // 提交评价
  const handleConfirm = async () => {
    reportRef.value.dateEdit = false
    let {
      evaluation = '',
      estimate = '',
      trainingResultId = '',
      score,
      flyTime,
    } = reportRef.value.form
    let param = {
      id: id.value,
      evaluation,
      estimate,
      trainingResultId,
      scores: score,
      startTime: flyTime ? new Date(flyTime) : new Date(),
      endTime: flyTime ? new Date(flyTime) : new Date(),
    }
    if (!evaluation || !estimate || !trainingResultId || score.some((v) => v.score < 1)) {
      return ElMessage.error(t('tip.formNotAllFill'))
    }
    loadingSubmit.value = true
    let [err, res] = await to(Api.setFlyTrainDetails(param))
    loadingSubmit.value = false
    init()

    if (!Order.teacherUUID) {
      signDialogVisible.value = true
    }

    ElMessage({
      type: 'success',
      duration: 1500,
      message: t('tip.saveSuccessTip'),
    })
  }
  // 提交签名pin码
  const setSign = async () => {
    let [err, res] = await to(Api.setFlyTrainSign({ id: this.id, pinCode: this.form.pincode }))
    loadingDialog.value = false
    signDialogVisible.value = false
    if (!err && res.status === 200) {
      init()
    }
  }

  onMounted(() => {
    if (id.value) {
      init()
    }
  })
</script>
