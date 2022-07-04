<template>
  <div class="detail-page-container">
    <el-descriptions :column="3" border class="margin-top" size="small">
      <el-descriptions-item :label="$t('state.fullName')" label-class-name="label"
        >{{ state.info.name }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('state.gender')" label-class-name="label"
        >{{ state.info.gender === 'M' ? $t('state.male') : $t('state.female') }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('state.idNumber')" label-class-name="label"
        >{{ state.info.idNumber }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('state.cellphoneNumber')" label-class-name="label"
        >{{ state.info.phone }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('state.logInName')" label-class-name="label"
        >{{ state.info.username }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('state.email')" label-class-name="label"
        >{{ state.info.email }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('state.remark')" label-class-name="label"
        >{{ state.info.remark }}
      </el-descriptions-item>
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
      team: {},
      teacherType: {},
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
        hasTeacherRole.value = index != -1
        state.info = res.data
      })
    },
  })

  onMounted(() => {
    methods.getDetail()
  })
</script>

<style lang="scss" scoped>
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
