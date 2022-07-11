<template>
  <VxeTable v-bind="gridOptions">
    <template #pager />
    <template #form>
      <el-form :model="gridOptions.form" ref="headerFormRef" inline class="header-form">
        <el-form-item>
          <el-select
            v-model="status"
            @change="filter"
            clearable
            :placeholder="$t('text.please_select')"
          >
            <el-option :value="true" :label="$t('text.submitted')" />
            <el-option :value="false" :label="$t('text.not_submitted')" />
          </el-select>
        </el-form-item>
      </el-form>
      <Dialog v-model="isShow" :id="rowId" />
    </template>
  </VxeTable>
</template>
<script setup lang="ts">
  import VxeTable from '/@/components/Table/index.vue'
  import Dialog from './components/detailDialog.vue'
  import { reactive, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { getExams, postExams } from '/@/api/opm/train'

  import { ElMessage } from 'element-plus'
  import to from 'await-to-js'

  const { t } = useI18n()

  const isShow = ref(false),
    rowId = ref<number>(undefined)
  const gridOptions = reactive<VxeTableAllProps>({
    data: [],
    columns: [
      { type: 'seq', width: 60, title: t('text.seq') },

      {
        // sortable: true,
        field: 'name',
        title: t('text.test_name'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'examType.name',
        title: t('text.examination_category'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'courseNumber',
        title: t('text.examination_class_number'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'startDate',
        title: t('text.examination_time'),
        minWidth: 100,
        formatter: 'formatDateTime',
      },
      {
        // sortable: true,
        field: 'notPassStudentCount',
        title: t('text.number_of_make_up_examination'),
        minWidth: 100,
        // formatter: ({ cellValue, row }) => cellValue - row.passStudentCount
      },
      {
        // sortable: true,
        field: 'submitted',
        title: t('text.submission_status'),
        minWidth: 100,
        formatter: ({ cellValue }) => (cellValue ? t('text.submitted') : t('text.not_submitted')),
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
          name: t('text.submit'),
          disabled: row.submitted,
          event: () => {
            postExams(row.id).then((res) => {
              ElMessage.success(t('message.operation_succeeded'))
              getList()
            })
          },
        },

        {
          name: t('message.hsDetail'),
          event: () => {
            rowId.value = row.id
            isShow.value = true
          },
        },
      ]
    },
  })
  const status = ref<boolean>()

  const filter = () => {
    gridOptions.data = list.value.filter((v) =>
      typeof status.value == 'boolean' ? v.submitted == status.value : true,
    )
  }

  const list = ref([])
  const getList = async () => {
    gridOptions.loading = true

    const [err, res] = await to(getExams(status.value))
    gridOptions.loading = false
    if (!err && res.status === 200) {
      list.value = res.data
      filter()
    }
  }
  const headerFormRef = ref<ElFormInstance>()

  const handlePageChange = (val) => {
    getList()
  }
  onMounted(() => {
    getList()
  })
</script>
<style lang="scss" scoped></style>
