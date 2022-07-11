<template>
  <VxeTable
    v-bind="gridOptions"
    v-model:form="gridOptions.form"
    @handle-page-change="handlePageChange"
  >
    <template #form>
      <el-form :model="gridOptions.form" ref="headerFormRef" inline class="header-form">
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
  import {
    getFlightExamRecords,
    FlightExamRecords,
    postFlightExamRecordsAudit,
  } from '/@/api/opm/train'
  import { setPage } from '/@/utils/utils'
  import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
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
      sort: 'id',
      order: 'asc',
      searchKey: '',
      clazzId: undefined,
      groupingId: undefined,
      clazzStatusIN: 'NOT_STARTED,TRAINING',
    } as FlightExamRecords,
    data: [],
    columns: [
      // { type: "checkbox", width: 50 },
      { type: 'seq', width: 60, title: t('text.seq') },

      {
        // sortable: true,
        field: 'studentTrainingRecord.student.name',
        title: t('text.student_name'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'studentTrainingRecord.student.gender',
        title: t('text.gender'),
        minWidth: 100,
        formatter: 'formatGender',
      },
      {
        // sortable: true,
        field: 'studentTrainingRecord.customer.name',
        title: t('text.airline_company'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'studentTrainingRecord.clazz.courseNumber',
        title: t('text.class_number'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'studentTrainingRecord.grouping.name',
        title: t('text.flight_team'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'studentTrainingRecord.grouping.teachers',
        title: t('text.fly_instructors_with_you'),
        minWidth: 100,
        formatter({ cellValue }) {
          return cellValue instanceof Array ? cellValue.map((v) => v.name).join(',') : ''
        },
      },
      {
        title: t('text.exam_results'),
        minWidth: 100,
        formatter({ row }) {
          switch (row.result) {
            case 'PASS':
              return t('text.qualified')
            case 'ABORT':
            case 'ADD_ONE':
            case 'ADD_TWO':
              return t('text.non_conforming')
            default:
              return ''
          }
        },
      },
      {
        title: t('text.disposition_opinions'),
        minWidth: 100,
        formatter({ row }) {
          if (row.trainingResult?.name) {
            return row.trainingResult.name
          } else {
            switch (row.result) {
              case 'ABORT':
                return t('text.discontinue')
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
          name: t('text.completion_of_training'),
          event: () => {
            ElMessageBox.prompt(t('tip.confirm_whether_the_training_is_complete'), t('text.tip'), {
              type: 'warning',
              inputPlaceholder: t('text.please_enter', { text: t('rules.6_digits') }),
              inputType: 'password',
              inputPattern: /^\d{6}$/,
              inputErrorMessage: t('text.please_enter', { text: t('rules.6_digits') }),
            })
              .then((res) => {
                if (res.action == 'confirm') {
                  postFlightExamRecordsAudit({
                    pinCode: res.value,
                    auditRemark: undefined,
                    auditType: 'NORMAL_GRADUATE',
                    id: row.id,
                  }).then((res) => {
                    ElMessage.success(t('message.operation_succeeded'))
                    getList()
                  })
                }
              })
              .catch(() => {})
          },
          visible: row.result == 'PASS',
        },
        {
          name: t('text.sign_up'),
          event: () => {
            rowId.value = row.id
            isShow.value = true
          },
          visible: row.result != 'PASS',
        },
        {
          name: t('message.hsDetail'),
          event: () => {
            routerGo(`/train/retakExam/${row.id}/FILLED`)
          },
        },
      ]
    },
  })

  const getList = async () => {
    gridOptions.loading = true
    const [err, res] = await to(getFlightExamRecords(gridOptions.form as FlightExamRecords))
    gridOptions.loading = false
    if (err && res.status === 200) {
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
