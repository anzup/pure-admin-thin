<template>
  <VxeTable
    v-if="isShow"
    v-bind="(state as any)"
    @action="btnClick"
    v-model:form="form"
    @handlePageChange="handlePageChange"
  />
  <Sort v-model="showSort" :rowId="rowId" />
</template>

<script lang="ts" setup>
  import { reactive, onMounted, ref } from 'vue'
  import VxeTable from '/@/components/Table/index.vue'
  import Sort from './sort.vue'

  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { getTemplatesSyllabus, TemplatesSyllabus } from '/@/api/opm/standard'
  import { setPage } from '/@/utils/utils'
  import { ElMessage } from 'element-plus'
  import to from 'await-to-js'

  const { t } = useI18n()
  interface Props {
    courseType: 'WET_LEASE' | 'DRY_LEASE'
  }
  const props = withDefaults(defineProps<Props>(), {
    courseType: 'WET_LEASE',
  })
  const showSort = ref(false),
    rowId = ref()
  const state = reactive<VxeTableAllProps>({
    columns: [
      // { type: "checkbox", width: 50 },
      { type: 'seq', width: 60, title: t('text.seq') },
      {
        field: 'shortName',
        title: t('message.trainingCourses'),
        // sortable: true,
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'course.code',
        title: t('text.course_project_code'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'version',
        title: t('text.version_number'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'airplaneType',
        title: t('text.model'),
        minWidth: 100,
      },

      {
        // sortable: true,
        field: 'theoryPeriods1',
        title: t('text.theoretical_class'),
        minWidth: 100,
        // formatter:"formatDateTime"
      },
      {
        // sortable: true,
        field: 'practicePeriods',
        title: t('text.flight_class'),
        minWidth: 100,
      },
      {
        // sortable: true,
        field: 'templateCount',
        title: t('text.number_of_templates'),
        minWidth: 100,
      },

      {
        title: t('text.operation'),
        width: 120,
        slots: { default: 'operate' },
        field: 'operationTypes',
        // fixed:'right'
      },
    ],
    data: [],
    height: 'auto',
    buttons: ({ row }) => [
      {
        name: t('text.set_up'),
      },
      {
        name: t('text.sort'),
        event: ({ row }) => {
          console.log(row)

          if (!row.templateCount) return ElMessage.error(t('tip.templates_unde'))
          rowId.value = row.id
          showSort.value = true
        },
      },
    ],
    autoResize: true,
    loading: false,
  })

  const form = reactive<TemplatesSyllabus>({
    page: 1,
    size: 10,
    courseType: props.courseType,
    total: 0,
  })

  const handlePageChange = (val) => {
    if (val.type == 'size') {
      form.page = setPage(form.total, form)
    }
    getTemplates()
  }
  const isShow = ref(false)
  const getTemplates = async () => {
    state.loading = true
    const [err, res] = await to(getTemplatesSyllabus(form))
    state.loading = false
    if (!err && res.status === 200) {
      state.data = res.data?.content
      form.total = res.data?.totalElements
    }
  }

  const router = useRouter()
  const btnClick = ({ row }) => {
    router.push({
      path: '/standard/template/setting/' + row.id,
    })
  }
  onMounted(() => {
    isShow.value = true
    getTemplates()
  })
</script>
<style lang="scss" scoped></style>
