<template>
  <div class="detail-main-container">
    <el-card :header="$t('text.essential_information')">
      <div class="info-table">
        <table>
          <tr>
            <th>{{ $t('text.school_year') }}</th>
            <td>{{ infoForm.year }}</td>
            <th>{{ $t('text.class_number') }}</th>
            <td>{{ infoForm.courseNumber }}</td>
          </tr>
          <tr>
            <th>{{ $t('text.class_name') }}</th>
            <td>{{ infoForm.shortName }}</td>
            <th>{{ $t('text.training_program') }}</th>
            <td>{{ infoForm.course?.code }}</td>
          </tr>
          <tr>
            <th>{{ $t('text.start_training_time') }}</th>
            <td>{{ formatDate(infoForm.startTime) }}</td>
            <th>{{ $t('text.training_completion_time') }}</th>
            <td>{{ formatDate(infoForm.endTime) }}</td>
          </tr>
          <tr>
            <th>{{ $t('text.related_contract') }}</th>
            <td>
              {{
                formatContracts({
                  cellValue: infoForm.contracts,
                })
              }}
            </td>
            <th>{{ $t('text.number_of_students') }}</th>
            <td>{{ infoForm.studentCount }}</td>
          </tr>
          <tr>
            <th>{{ $t('text.training_mode') }}</th>
            <td>{{ formatType(infoForm.type) }}</td>
            <th>{{ $t('text.training_class') }}</th>
            <td>{{ infoForm.period }}</td>
          </tr>
        </table>
      </div>
    </el-card>
    <el-divider />
    <el-card :header="$t('text.student_information')">
      <Vxetable v-bind="gridOptions">
        <template #pager />
      </Vxetable>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import { reactive, toRefs, onMounted } from 'vue'
  import Vxetable from '/@/components/Table/index.vue'
  import { getClazzsDetail, getClazzScheduleHis } from '/@/api/opm/train'
  import { useRoute } from 'vue-router'
  import useData from './common/useData'
  import { useI18n } from 'vue-i18n'
  import useTrain from '/@/commonTs/train'
  import dayjs from 'dayjs'

  const { t } = useI18n()
  const { getTypeList, formatContracts } = useData()

  const route = useRoute()
  const formatTeacher = ({ cellValue }) => {
    return cellValue?.map((v) => v.name)
  }
  const state = reactive({
    infoForm: {
      year: undefined,
      courseNumber: undefined,
      shortName: undefined,
      course: undefined,
      startTime: undefined,
      endTime: undefined,
      contracts: undefined,
      studentCount: undefined,
      type: undefined,
      period: undefined,
    },
    gridOptions: {
      columns: [
        // { type: "checkbox", width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'name',
          title: t('text.full_name'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'gender',
          title: t('text.gender'),
          // sortable: true,
          minWidth: 100,
          formatter: 'formatGender',
        },
        {
          field: 'idNumber',
          title: t('text.identification_number'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'phone',
          title: t('text.contact_number'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'customer.name',
          title: t('text.connection'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'grouping.name',
          title: t('text.groups'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: '',
          title: t('text.theory_teacher'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'grouping.teachers',
          title: t('text.flight_instructor'),
          // sortable: true,
          minWidth: 100,
          formatter: formatTeacher,
        },
        {
          field: '',
          title: t('text.extra_field'),
          // sortable: true,
          minWidth: 100,
        },
      ],
      maxHeight: 500,
      data: [],
    } as VxeGridProps,
  })
  const { infoForm, gridOptions } = toRefs(state)
  const getList = () => {
    getClazzScheduleHis(
      route.params.id as string,
      // contracts:contracts
    ).then((res) => {
      const { data } = res
      state.gridOptions.data = data
    })
  }
  const { leaseList } = useTrain()
  const formatType = (value: string) => leaseList.value.find((v) => v.id == value)?.name
  const formatDate = (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss')

  onMounted(async () => {
    await getTypeList()
    const { data: infoData } = await getClazzsDetail(route.params.id as string)

    state.infoForm = infoData
    getList()
  })
</script>

<style scoped></style>
