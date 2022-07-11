<template>
  <VxeTable
    v-bind="gridOptions"
    v-model:form="gridOptions.form"
    @handle-page-change="handlePageChange"
  >
    <template #form>
      <el-form :model="gridOptions.form" ref="headerFormRef" inline class="header-form">
        <el-form-item prop="status">
          <el-select v-model="gridOptions.form.status" @change="getList">
            <el-option
              v-for="(item, index) in examine"
              :key="index"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchKey">
          <el-input
            v-model="gridOptions.form.searchKey"
            :placeholder="$t('text.please_enter_keyword_search')"
          />
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
      <Dialog v-model="isShow" :id="rowId" @updateData="getList" />
    </template>
  </VxeTable>
</template>
<script setup lang="ts">
  import VxeTable from '/@/components/Table/index.vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import Dialog from './components/dialog.vue'
  import { reactive, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { getAdditionalTraining, AdditionalTrainingResponse } from '/@/api/opm/train'
  import { ElMessageBox } from 'element-plus'
  import { arrayFilterFormat, setPage } from '/@/utils/utils'
  import type { ElForm } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import to from 'await-to-js'

  type ElFormInstance = InstanceType<typeof ElForm>
  const { t } = useI18n()

  const isShow = ref(false),
    rowId = ref<number>(undefined)
  const router = useRouter()
  const routerGo = useGo(router)
  const gridOptions = reactive<VxeTableAllProps>({
    form: {
      page: 1,
      size: 10,
      total: 0,
      status: '',
      sort: 'status,createdDate',
      order: 'asc,desc',
      searchKey: '',
    },
    data: [] as AdditionalTrainingResponse[],
    columns: [
      { type: 'checkbox', width: 50 },
      { type: 'seq', width: 60, title: t('text.seq') },

      {
        // sortable: true,
        field: 'student.name',
        title: t('text.student_name'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'type',
        title: t('text.type'),
        minWidth: 100,
        formatter({ cellValue }) {
          switch (cellValue) {
            case 'EXAM':
              return t('text.examination')
            case 'TRAINING':
              return t('text.teaching')
            default:
              return
          }
        },
      },
      {
        // sortable: true,
        field: 'flightEvaluation.studentTrainingRecord.clazz.course.code',
        title: t('text.course_project_code'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'flightEvaluation.studentTrainingRecord.clazz.airplaneTypes',
        title: t('text.training_model'),
        minWidth: 100,
        formatter({ cellValue }) {
          return arrayFilterFormat(cellValue)
        },
      },
      {
        // sortable: true,
        field: 'flightEvaluation.studentTrainingRecord.clazz.courseNumber',
        title: t('text.class_number'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'name',
        title: t('text.flight_training_missions'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'flightEvaluation.studentTrainingRecord.grouping.teachers',
        title: t('text.fly_instructors_with_you'),
        minWidth: 100,
        formatter({ cellValue }) {
          return cellValue?.map((v) => v.name).join('  ')
        },
      },
      {
        // sortable: true,
        field: 'flightEvaluation.startTime',
        title: t('text.training_time'),
        width: 150,
        formatter: 'formatDateTime',
      },
      {
        // sortable: true,
        field: 'flightEvaluation.result',
        title: t('text.disposal_recommendations'),
        minWidth: 100,
        formatter({ cellValue, row }) {
          if (row.flightEvaluation?.trainingResult?.name) {
            return row.flightEvaluation.trainingResult.name
          } else {
            switch (cellValue) {
              // case 'PASS': return t('text.pass')
              case 'ABORT':
                return t('text.pass')
              case 'ADD_ONE':
                return t('text.one_more_training_session')
              case 'ADD_TWO':
                return t('text.two_additional_training_sessions')
              default:
                return ''
            }
          }
        },
      },
      {
        // sortable: true,
        field: 'status',
        title: t('text.audit_status'),
        minWidth: 100,
        formatter({ cellValue }) {
          switch (cellValue) {
            case 'APPROVED':
              return t('text.passed')
            case 'REJECTED':
              return t('text.rejected')
            case 'WAITING_APPROVE':
              return t('text.not_audited')
            default:
              return ''
          }
        },
      },
      {
        // sortable: true,
        field: 'auditor.name',
        title: t('text.undertaker'),
        minWidth: 100,
      },

      {
        title: t('text.operation'),
        width: 180,
        slots: { default: 'operate' },
        field: 'operationTypes',
        // fixed:'right'
      },
    ],
    height: 'auto',
    loading: false,
    buttons: ({ row }) => {
      return [
        {
          name: t('message.hsDetail'),
          event: () => {
            routerGo(`${row.id}`)
          },
        },
        {
          name: t('text.audit'),
          event: () => {
            rowId.value = row.id
            isShow.value = true
          },
          disabled: row.status !== 'WAITING_APPROVE' || row.type !== 'TRAINING',
        },
        {
          name: t('text.reason'),
          event: () => {
            ElMessageBox.alert(row.remark, t('text.reason'), {
              showConfirmButton: false,
              closeOnClickModal: true,
              closeOnPressEscape: true,
              // center:true
            })
              .then(() => {})
              .catch(() => {})
          },
          disabled: !row.remark,
        },
      ]
    },
  })
  const examine = [
    { label: t('text.all'), id: '' },
    { label: t('text.passed'), id: 'APPROVED' },
    { label: t('text.rejected'), id: 'REJECTED' },
    { label: t('text.not_audited'), id: 'WAITING_APPROVE' },
  ]

  const getList = async () => {
    gridOptions.loading = true

    const [err, res] = await to(getAdditionalTraining(gridOptions.form))
    gridOptions.loading = false
    if (!err && res.status === 200) {
      gridOptions.data = res.data.content
      gridOptions.form.total = res.data.totalElements
    }
  }
  const headerFormRef = ref<ElFormInstance>()
  const submit = (val: string) => {
    if (val == 'reset') {
      headerFormRef.value.resetFields()
    }
    gridOptions.form.page = 1
    getList()
  }
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      gridOptions.form.page = setPage(gridOptions.form.total, gridOptions.form)
    }
    getList()
  }
  onMounted(() => {
    getList()
  })
</script>
<style lang="scss" scoped></style>
