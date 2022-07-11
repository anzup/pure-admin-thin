<template>
  <VxeTable v-bind="gridOptions">
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
        <el-form-item :label="$t('text.teacher_classification')" prop="builtinRole">
          <el-select
            v-model="form.builtinResource"
            :placeholder="$t('text.please_select')"
            clearable
          >
            <el-option
              v-for="(item, index) in resourcesList as Array<resources.ResourcesItem>"
              :key="index"
              :label="item.name"
              :value="item.builtinResource"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('text.faculty_category')" prop="workType">
          <el-select v-model="form.workType" :placeholder="$t('text.please_select')" clearable>
            <el-option :label="$t('text.full_time_teacher')" value="FULL_TIME" />
            <el-option :label="$t('text.external_faculty')" value="PART_TIME" />
          </el-select>
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
    <template #pager />
  </VxeTable>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, ref, reactive, onMounted } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'

  import { getScheduleBuildEmployee, IClazzSchedules } from '/@/api/opm/timetable'
  import dayjs from 'dayjs'

  import useTeacher from '/@/utils/baseEnum'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import useResources from '/@/commonTs/resources'
  import to from 'await-to-js'
  import { useGo } from '/@/hooks/usePage'

  export default defineComponent({
    components: {
      VxeTable,
      FormBtn,
    },
    setup() {
      const { ETeacherType, EWorkType } = useTeacher()
      const router = useRouter()
      const routerGo = useGo(router)
      const { t } = useI18n()
      const gridOptions = reactive<VxeGridProps>({
        columns: [
          // { type: "checkbox", width: 50 },
          { type: 'seq', width: 60, title: t('text.seq') },
          {
            field: 'employeeVO.name',
            title: t('text.teacher_name'),
            // sortable: true,
            minWidth: 100,
          },
          {
            field: 'employeeVO.builtinRole',
            title: t('text.teacher_classification'),
            // sortable: true,
            minWidth: 100,
            formatter: ({ cellValue }) => ETeacherType[cellValue],
          },
          {
            field: 'employeeVO.workType',
            title: t('text.faculty_category'),
            // sortable: true,
            minWidth: 100,
            formatter: ({ cellValue }) => EWorkType[cellValue],
          },
          {
            field: 'month',
            title: t('text.month'),
            // sortable: true,
            minWidth: 100,
            formatter: () => form.month,
          },
          {
            field: 'period',
            title: t('text.total_class_hours'),
            // sortable: true,
            minWidth: 100,
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
        workType: undefined,
        builtinResource: undefined,
      })
      const headerFormRef = ref()

      const getList = async () => {
        gridOptions.loading = true
        const [err, res] = await to(getScheduleBuildEmployee(form))
        gridOptions.loading = false
        if (!err && res.status == 200) {
          const { data } = res
          gridOptions.data = data
        }
      }

      const submit = (val: string) => {
        if (val == 'reset') {
          headerFormRef.value.resetFields()
        }

        getList()
      }

      const goDetail = (listMap: any[]) => {
        sessionStorage.setItem('timetableData', JSON.stringify(listMap))
        routerGo(`detail?date=${form.month}`)
      }
      const { getResourcesoScheduleList, resourcesList } = useResources()

      onMounted(() => {
        getResourcesoScheduleList({ resourceType: 'TEACHER' })
        getList()
      })
      return {
        submit,

        gridOptions,
        form,
        headerFormRef,
        goDetail,
        resourcesList,
      }
    },
  })
</script>

<style scoped></style>
