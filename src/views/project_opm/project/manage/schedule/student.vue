<template>
  <VxeTable
    v-bind="gridOptions"
    isTabs
    v-model:form="(form as any)"
    @handle-page-change="handlePageChange"
  >
    <template #form>
      <el-form :model="form" ref="headerFormRef" inline class="header-form">
        <el-form-item :label="$t('text.month')" prop="airplaneTypes">
          <el-date-picker
            v-model="form.month"
            type="month"
            :placeholder="$t('text.select_month')"
            value-format="YYYY-MM"
            :clearable="false"
          />
        </el-form-item>

        <el-form-item prop="searchKey">
          <el-input v-model="form.searchKey" :placeholder="$t('text.please_enter')" />
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
    </template>
    <template #operate="{ row }">
      <vxe-button
        type="text"
        status="primary"
        :content="$t('message.hsDetail')"
        @click="goDetail(row.listMap)"
      />
    </template>
  </VxeTable>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, ref, reactive, onMounted } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'

  import { getScheduleBuildStudent, IClazzSchedules } from '/@/api/opm/timetable'
  import dayjs from 'dayjs'

  import { useRouter } from 'vue-router'
  import { setPage } from '/@/utils/utils'
  import { useI18n } from 'vue-i18n'
  import { useGo } from '/@/hooks/usePage'
  import to from 'await-to-js'

  export default defineComponent({
    components: {
      VxeTable,
      FormBtn,
    },
    props: {
      courseType: String,
    },
    setup(props) {
      const { t } = useI18n()
      const router = useRouter()
      const routerGo = useGo(router)
      const gridOptions = reactive<VxeGridProps>({
        height: 'auto',
        columns: [
          // { type: "checkbox", width: 50 },
          { type: 'seq', width: 60, title: t('text.seq') },
          {
            field: 'studentVO.courseNumber',
            title: t('text.class_number'),
            // sortable: true,
            minWidth: 100,
          },
          {
            field: 'studentVO.name',
            title: t('text.student_name'),
            // sortable: true,
            minWidth: 100,
          },
          {
            field: 'studentVO.gender',
            title: t('text.gender'),
            // sortable: true,
            minWidth: 100,
            formatter: 'formatGender',
          },
          {
            field: 'studentVO.idNumber',
            title: t('text.id'),
            // sortable: true,
            minWidth: 100,
          },
          {
            field: 'studentVO.customerName',
            title: t('text.customer'),
            // sortable: true,
            minWidth: 100,
          },
          {
            field: 'studentVO.groupName',
            title: t('text.groups'),
            // sortable: true,
            minWidth: 100,
            visible: props.courseType == 'WET_LEASE',
          },

          {
            field: 'createdDate',
            title: t('text.release_time'),
            // sortable: true,
            minWidth: 100,
            formatter: 'formatDateTime',
          },
          {
            title: t('text.operation'),
            width: 200,
            slots: { default: 'operate' },
            field: 'operationTypes',
            // fixed:'right'
          },
        ],
        data: [],
        loading: false,
      })
      const form = reactive<IClazzSchedules>({
        month: dayjs().format('YYYY-MM'),
        searchKey: undefined,
        courseType: props.courseType,
        page: 1,
        size: 10,
        total: 0,
      })
      const headerFormRef = ref()

      const getList = async () => {
        gridOptions.loading = true

        const [err, res] = await to(getScheduleBuildStudent(form))
        gridOptions.loading = false
        if (!err && res.status === 200) {
          const { data } = res
          gridOptions.data = data.content
          form.total = data.totalElements
        }
      }

      const submit = (val: string) => {
        if (val == 'reset') {
          headerFormRef.value.resetFields()
        }
        form.page = 1
        getList()
      }

      const goDetail = (listMap: any[]) => {
        sessionStorage.setItem('timetableData', JSON.stringify(listMap))
        routerGo(`/timetable/studentSchedule/detail?date=${form.month}`)
      }
      onMounted(() => {
        getList()
      })
      const handlePageChange = (val) => {
        if (val.type == 'size') {
          form.page = setPage(form.total, form)
        }
        getList()
      }
      return {
        submit,

        gridOptions,
        form,
        headerFormRef,
        goDetail,
        handlePageChange,
      }
    },
  })
</script>

<style scoped></style>
