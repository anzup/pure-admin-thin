<template>
  <div class="detail-main-container">
    <el-card :header="$t('text.essential_information')">
      <el-descriptions :column="2" border>
        <el-descriptions-item
          :label="$t('text.school_year')"
          label-class-name="my-label"
          width="150px"
          >{{ infoForm.year }}</el-descriptions-item
        >
        <el-descriptions-item
          :label="$t('text.class_number')"
          label-class-name="my-label"
          width="150px"
          >{{ infoForm.courseNumber }}</el-descriptions-item
        >
        <el-descriptions-item
          :label="$t('text.class_name')"
          label-class-name="my-label"
          width="150px"
          >{{ infoForm?.shortName }}</el-descriptions-item
        >
        <el-descriptions-item
          :label="$t('text.course_project_name')"
          label-class-name="my-label"
          width="150px"
          >{{ infoForm.course?.name }}</el-descriptions-item
        >
        <el-descriptions-item
          :label="$t('text.name_of_training_course')"
          label-class-name="my-label"
          width="150px"
          >{{ infoForm.syllabus?.name }}</el-descriptions-item
        >
        <el-descriptions-item
          :label="$t('text.related_contract')"
          label-class-name="my-label"
          width="150px"
        >
          <span v-for="(item, index) in contract" :key="index">{{ item.contractNo }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-divider />
    <el-card :header="$t('text.student_information')">
      <Vxetable v-bind="gridOptions">
        <template #pager />
      </Vxetable>
    </el-card>
  </div>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import { defineComponent, reactive, toRefs, onMounted, ref, computed } from 'vue'
  import Vxetable from '/@/components/Table/index.vue'
  import { getClazzsDetail, getClazzsStudents } from '/@/api/opm/train'
  import { getContractsList } from '/@/api/opm/contract'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    components: {
      Vxetable,
    },
    setup() {
      const { t } = useI18n()
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
          customers: [],
          syllabus: undefined,
          courseId: undefined,
          contracts: [],
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
              title: t('text.cell_phone_number'),
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
              visible: false,
            },
            {
              field: 'theoryTeachers',
              title: t('text.theory_teacher'),
              // sortable: true,
              minWidth: 100,
            },
            {
              field: 'flightTeachers',
              title: t('text.flight_instructor'),
              // sortable: true,
              minWidth: 100,
              formatter: formatTeacher,
            },
            {
              field: 'status',
              title: t('text.training_status'),
              // sortable: true,
              minWidth: 100,
              formatter: 'formatGraduateStatus',
            },
          ],
          maxHeight: 500,
          data: [],
        } as VxeGridProps,
        loading: false,
      })
      const getList = () => {
        getClazzsStudents(
          {
            id: route.params.id as string,
          },
          // contracts:contracts
        ).then((res) => {
          const { data } = res
          state.gridOptions.data = data
        })
      }
      onMounted(async () => {
        const { data: infoData } = await getClazzsDetail(route.params.id as string)

        state.infoForm = infoData

        state.gridOptions.columns[6].visible = infoData.type == 'WET_LEASE'
        state.gridOptions.columns = [...state.gridOptions.columns]
        getList()
        getContracts(infoData)
      })
      const contractsList = ref([])

      const getContracts = (data) => {
        getContractsList({
          page: 1,
          size: 1000,
          valid: true,
          courseId: data.type == 'WET_LEASE' ? data.course.id : undefined,
        }).then((res) => {
          contractsList.value = res.data.content
        })
      }
      const contract = computed(() =>
        contractsList.value.filter((v) => state.infoForm.contracts.includes(v.id)),
      )

      return {
        ...toRefs(state),
        contract,
      }
    },
  })
</script>

<style scoped lang="scss"></style>
