<template>
  <div class="detail-page-container">
    <!-- <vxe-grid :cell-class-name="cellClassName" v-bind="gridOptions">
    </vxe-grid>-->
    <el-descriptions class="margin-top" :column="3" border size="small">
      <el-descriptions-item label-class-name="label" :label="$t('state.full_name')">{{
        state.info.name
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('state.gender')">{{
        state.info.gender == 'M' ? $t('state.male') : $t('state.female')
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('state.identification_number')">{{
        state.info.idNumber
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('state.phone_number')">{{
        state.info.phone
      }}</el-descriptions-item>
      <el-descriptions-item
        v-if="hasTeacherRole"
        label-class-name="label"
        :label="$t('state.teacherTeam')"
        >{{ state.info.team?.name }}</el-descriptions-item
      >
      <el-descriptions-item
        v-if="hasTeacherRole"
        label-class-name="label"
        :label="$t('state.type_of_teacher')"
        >{{ state.info.teacherType?.name }}</el-descriptions-item
      >
      <el-descriptions-item label-class-name="label" :label="$t('state.loginName')">{{
        state.info.username
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('state.landline_number')">{{
        state.info.landline
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('state.email')">{{
        state.info.email
      }}</el-descriptions-item>
      <el-descriptions-item label-class-name="label" :label="$t('state.remarks')">{{
        state.info.remark
      }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { getUsersDetail } from '/@/api/user'

  const state = reactive({
    id: useRoute().query.id,
    info: {
      name: undefined,
      gender: undefined,
      idNumber: undefined,
      phone: undefined,
      customer: undefined,
      typeName: undefined,
      team: Object,
      teacherType: Object,
      username: undefined,
      landline: undefined,
      email: undefined,
      remark: undefined,
    },
  })
  const hasTeacherRole = ref(false)
  const methods = reactive({
    getDetail: () => {
      getUsersDetail(state.id).then((res) => {
        let index = res.data.roles.findIndex((item) => {
          return item.builtinRole == 'TEACHER'
        })
        if (index != -1) {
          hasTeacherRole.value = true
        } else {
          hasTeacherRole.value = false
        }
        state.info = res.data
      })
    },
  })

  onMounted(() => {
    methods.getDetail()
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
  :deep(.el-card__header) {
    padding: 12px;
    font-size: 14px;
    text-align: center;
    background: #f8f8f9;
  }
  .box-card {
    margin-top: 32px;
  }
</style>
