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
        <el-form-item :label="$t('text.classType')" prop="courseType">
          <el-select v-model="form.courseType" clearable :placeholder="$t('text.please_select')">
            <el-option
              v-for="(item, index) in classTypeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
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
        :status="!!row.listMap.GROUND_THEORY ? 'primary' : ''"
        :content="$t('text.theoretical_details')"
        @click="goDetail(row, 'GROUND_THEORY')"
        :disabled="!row.listMap.GROUND_THEORY"
      />
      <vxe-button
        type="text"
        :status="!!row.listMap.FLIGHT_PRACTICE ? 'primary' : ''"
        :content="$t('text.flight_details')"
        @click="goDetail(row, 'FLIGHT_PRACTICE')"
        :disabled="!row.listMap.FLIGHT_PRACTICE"
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
  import { getScheduleBuildClazz, IScheduleBuild } from '/@/api/opm/timetable'
  import dayjs from 'dayjs'
  import useClass from '/@/commonTs/clazz'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useGo } from '/@/hooks/usePage'
  import to from 'await-to-js'
  export default defineComponent({
    components: {
      VxeTable,
      FormBtn,
    },
    setup() {
      const { t } = useI18n()
      const router = useRouter()
      const routerGo = useGo(router)
      const gridOptions = reactive<VxeGridProps>({
        columns: [
          // { type: "checkbox", width: 50 },
          { type: 'seq', width: 60, title: t('text.seq') },
          {
            field: 'courseNumber',
            title: t('text.class_number'),
            // sortable: true,
            minWidth: 100,
          },
          {
            field: 'shortName',
            title: t('text.class_name'),
            // sortable: true,
            minWidth: 100,
          },
          {
            field: 'courseCode',
            title: t('text.training_program'),
            // sortable: true,
            minWidth: 100,
          },
          {
            field: 'month',
            title: t('text.month'),
            // sortable: true,
            minWidth: 100,
            formatter: () => form.month,
          },
          {
            field: 'startTime',
            title: t('text.start_training_time'),
            // sortable: true,
            minWidth: 100,
            formatter: 'formatDateTime',
          },

          {
            field: 'endTime',
            title: t('text.estimated_training_completion_time'),
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
      const form = reactive<IScheduleBuild>({
        month: dayjs().format('YYYY-MM'),
        searchKey: undefined,
        courseType: undefined,
      })
      const headerFormRef = ref()
      const { classTypeList } = useClass()

      const getList = async () => {
        gridOptions.loading = true

        const [err, res] = await to(getScheduleBuildClazz(form))
        gridOptions.loading = false
        if (!err && res.status === 200) {
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

      const goDetail = (row: any, type: string) => {
        sessionStorage.setItem('clazzTimetableData', JSON.stringify(row))
        routerGo('class/detail/' + type)
      }
      onMounted(() => {
        getList()
      })
      return {
        submit,

        gridOptions,
        form,
        headerFormRef,
        goDetail,
        classTypeList,
      }
    },
  })
</script>

<style scoped></style>
