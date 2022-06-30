<template>
  <div class="detail-page-container">
    <!-- <vxe-grid :cell-class-name="cellClassName" v-bind="gridOptions">
    </vxe-grid>-->
    <el-descriptions class="margin-top" :column="3" border size="small">
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.full_name')"
        >{{ info.name }}</el-descriptions-item
      >
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.gender')"
        >{{ info.gender == 'M' ? $t('state.male') : $t('state.female') }}</el-descriptions-item
      >
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.identification_number')"
        >{{ info.idNumber }}</el-descriptions-item
      >
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.phone_number')"
        >{{ info.phone }}</el-descriptions-item
      >
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.connection')"
        >{{ info.customer?.name }}</el-descriptions-item
      >
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.student_classification')"
        >{{ info.studentType?.name }}</el-descriptions-item
      >
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.nationality')"
        >{{ info.nationality?.name }}</el-descriptions-item
      >
      <el-descriptions-item min-width="150px" label-class-name="label" :label="$t('state.post')">{{
        info.position?.name
      }}</el-descriptions-item>
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.companyPositon')"
        >{{ info.title }}</el-descriptions-item
      >
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.airplanePosition')"
        >{{ info.planeJob?.name }}</el-descriptions-item
      >
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.loginName')"
        >{{ info.username }}</el-descriptions-item
      >
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.landline_number')"
        >{{ info.landline }}</el-descriptions-item
      >
      <el-descriptions-item min-width="150px" label-class-name="label" :label="$t('state.email')">{{
        info.email
      }}</el-descriptions-item>
      <el-descriptions-item
        min-width="150px"
        label-class-name="label"
        :label="$t('state.remarks')"
        >{{ info.remark }}</el-descriptions-item
      >
    </el-descriptions>
    <!-- <el-divider></el-divider> -->
    <el-card class="box-card" shadow="never">
      <template #header>
        <span>{{ $t('state.historyInfo') }}</span>
      </template>
      <History />
    </el-card>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, toRefs } from 'vue'
  import { useRoute } from 'vue-router'
  import { getTrainingStudentsById } from '/@/api/trainingPlanDeclarations'
  import History from './components/History.vue'
  import { getUsersDetail } from '/@/api/user'

  export default defineComponent({
    name: 'FacultyDetail',
    components: {
      History,
    },
    setup() {
      const state = reactive({
        id: useRoute().query.id,
        info: {
          name: undefined,
          gender: undefined,
          idNumber: undefined,
          phone: undefined,
          customer: undefined,
          studentType: undefined,
          nationality: undefined,
          username: undefined,
          landline: undefined,
          email: undefined,
          remark: undefined,
          title: undefined,
          planeJob: undefined,
          position: undefined,
        },
      })

      const methods = reactive({
        getDetail: () => {
          let api = undefined
          api = useRoute().query.isGroup ? getTrainingStudentsById : getUsersDetail
          api(state.id).then((res) => {
            state.info = res.data
          })
        },
      })

      onMounted(() => {
        methods.getDetail()
      })
      return {
        ...toRefs(state),
      }
    },
  })
</script>

<style scoped lang="scss">
  :deep(.el-descriptions) {
    .el-descriptions__content {
      color: #333;
    }
    .label {
      background-color: #f8f8f9;
      width: 16%;
      text-align: center;
      color: #333;
    }
  }
  :deep(.el-card) {
    border: none;
  }
  :deep(.el-card__header) {
    font-size: 14px;
    text-align: center;
    background: #f8f8f9;
    border-top: 1px solid var(--el-card-border-color);
    border-left: 1px solid var(--el-card-border-color);
    border-right: 1px solid var(--el-card-border-color);
    border-bottom: none;
  }
  .box-card {
    margin-top: 32px;
  }
</style>
