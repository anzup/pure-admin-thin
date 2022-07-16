<template>
  <div class="container">
    <div class="container_table">
      <VxeTable
        v-bind="gridOptions"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        @action="btnClick"
        @handle-page-change="handleCurrentChange"
      >
        <template #header>
          <h2 class="attendance-title">{{ title }}</h2>
        </template>
        <template #status="{ row }">
          <el-radio-group v-model="row.type">
            <el-radio v-for="(item, index) in filters.status" :key="index" :label="item.id">{{
                item.name
              }}</el-radio>
          </el-radio-group>
        </template>
        <template #pager></template>
      </VxeTable>
    </div>
    <div class="attendance-center" ref="bottom">
      <el-button type="primary" @click="showSignDialog = true">{{
          t('button.submit')
        }}</el-button>
    </div>
    <SignDialog :loadingDialog="signLoading" v-model="showSignDialog" @handleConfirm="submitSign" />
  </div>
</template>

<script lang="ts" setup>
  import VxeTable from '/@/components/Table/index.vue'
  import { getAttendancesId, postAttendancesId } from '/@/api/ftm/teacher/teachingCenter'
  import SignDialog from '/@/views/project_ftm/teacher/components/SignDialog/index.vue'
  import { useI18n } from 'vue-i18n'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import to from 'await-to-js'
  import { ElMessage } from 'element-plus'
  import { setPage } from '/@/utils/utils'

  const router = useRouter()
  const route = useRoute()
  const { t, getLocaleMessage } = useI18n()

  const id = computed(() => route.query.id)
  const title = computed(() => {
    const clazzName = route.query.clazzName || ''
    // if(getLanguage().includes('zh') === true){
    return clazzName + t('supplement.ATTENDANCE_SHEET')
    // }else {
    return `${clazzName} ${t('supplement.ATTENDANCE_SHEET')}`
    // }
  })

  const showSignDialog = ref(false)
  const signLoading = ref(false)
  const gridOptions = reactive({
    data: [],
    loading: false,
    columns: [
      { type: 'seq', width: '60', title: t('common.serialNumber') },
      { title: t('table.studentName'), field: 'studentName', minWidth: 120 }, // 学员姓名
      { title: t('table.attendance'), minWidth: 500, slots: { default: 'status' } }, // 考勤
      {
        title: t('table.remarks'),
        field: 'remark',
        minWidth: 200,
        editRender: { name: 'input', autoselect: true },
      }, // 备注
    ],
    toolbarConfig: {
      slots: {
        buttons: 'header',
      },
    },
    form: {},
  })
  const filters = reactive({
    status: [
      { name: t('common.normal'), id: 'NORMAL' },
      { name: t('common.late'), id: 'LATE' },
      { name: t('common.early'), id: 'EARLY' },
      { name: t('common.absence'), id: 'ABSENCE' },
      { name: t('common.leave'), id: 'LEAVE' },
      { name: t('common.noClasses'), id: 'NO_CLASSES' },
    ],
  })

  const getData = async () => {
    gridOptions.loading = true
    let [err, res] = await to(getAttendancesId({ id: id.value }))
    gridOptions.loading = false
    if (!err && res.status == 200) {
      gridOptions.data = res.data
    }
  }
  const submitSign = async ({ pinCode }) => {
    signLoading.value = true
    let params = {
      id: id.value,
      pinCode,
      studentSigns: gridOptions.data.map((item) => ({
        recordId: item.id,
        remark: item.remark,
        type: item.type || 'NONE',
      })),
    }
    let [err, res] = await to(postAttendancesId(params))
    signLoading.value = false
    if (!err && res.status == 200) {
      ElMessage.success(t('tip.editSuccessTip'))
      showSignDialog.value = false
    }
  }

  const btnClick = ({ type: btnType, row }) => {}
  const handleCurrentChange = (val) => {
    if (val.type == 'size') {
      // gridOptions.form?.page = setPage(gridOptions.form?.total, form)
    }
    getData()
  }
</script>
<script lang="ts">
  export default {
    name: 'MyJobAttendanceDetail',
  }
</script>

<style scoped lang="scss">
  .container{
    display: flex;
    flex-direction: column;
    .container_table{
      flex: 1;
    }
    .attendance-title {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
    }
    .attendance-center {
      padding-top: 20px;
      text-align: center;
      .el-button {
        min-width: 200px;
      }
    }
  }
</style>
