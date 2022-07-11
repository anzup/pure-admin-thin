<template>
  <VxeTable
    v-bind="state.gridOptions"
    v-model:form="state.form"
    @action="btnClick"
    @handle-page-change="handlePageChange"
  >
    <template #form>
      <el-form :model="state.form" ref="headerFormRef" inline class="header-form">
        <el-form-item prop="searchKey">
          <el-input
            v-model="state.form.searchKey"
            :placeholder="$t('text.please_enter_keyword_search')"
          />
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
    </template>
    <!--自定义插槽 toolbar buttons 插槽-->
    <template #toolbar_tools>
      <el-button v-show="getType" type="success" @click="state.isShow = true">{{
        $t('message.import')
      }}</el-button>
      <!-- <el-button v-show="getType"  type="primary" @click="exportIsShow=true">
                    导出
            </el-button>-->
      <el-button v-show="getType" type="primary" @click="batchAdd">{{
        $t('message.batch_add')
      }}</el-button>
      <el-button type="primary" @click="add">{{ $t('message.hsadd') }}</el-button>
    </template>
  </VxeTable>
  <LeadingInDialog v-model="state.isShow" @updateData="updateData" />
  <ExportDialog v-model="state.exportIsShow" />
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, onMounted, toRefs, computed } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { deleteClazzsId, getClazzsList } from '/@/api/opm/train'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import LeadingInDialog from './components/leadingInDialog.vue'
  import ExportDialog from './components/exportDialog.vue'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'
  // 获取客户下拉列表

  const props = defineProps({
    type: String,
    customerId: [Number],
  })

  const { t } = useI18n()
  const formatTeachers = ({ cellValue }) => {
    return cellValue?.map((v) => v.name)
  }
  const getType = computed(() => props.type == 'DRY_LEASE')
  const formatStatus = ({ cellValue }) => {
    switch (cellValue) {
      case 'FINISHED':
        return t('text.completed')
      case 'NOT_STARTED':
        return t('text.not_started')
      case 'TRAINING':
        return t('text.in_training')

      default:
        break
    }
  }
  const router = useRouter()
  const state = reactive({
    gridOptions: {
      height: 'auto',
      columns: [
        // { type: "checkbox", width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'year',
          title: t('text.school_year'),
          // sortable: true,
          minWidth: 100,
        },
        {
          // sortable: true,
          field: 'courseNumber',
          title: t('text.class_number'),
          minWidth: 100,
        },
        {
          // sortable: true,
          field: 'shortName',
          title: t('text.class_name'),
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
          field: 'theoryTeachers',
          title: t('text.theory_teacher'),
          minWidth: 100,
          formatter: formatTeachers,
        },
        {
          // sortable: true,
          field: 'startTime',
          title: t('text.start_training_time'),
          minWidth: 100,
          formatter: 'formatDate',
        },
        {
          // sortable: true,
          field: 'endTime',
          title: t('text.estimated_training_completion_time'),
          minWidth: 100,
          formatter: 'formatDate',
        },
        {
          // sortable: true,
          field: 'studentCount',
          title: t('text.number_of_students'),
          minWidth: 100,
        },
        {
          // sortable: true,
          field: 'status',
          title: t('text.training_status'),
          minWidth: 100,
          formatter: formatStatus,
        },
        {
          title: t('text.operation'),
          width: 180,
          slots: { default: 'operate' },
          field: 'operationTypes',
          // fixed:'right'
        },
      ],

      data: [],
      buttons: getButtons,
      toolbarConfig: {
        // custom: true,
        size: 'medium',
        perfect: true,
        slots: {
          tools: 'toolbar_tools',
        },
      },
      loading: false,
    } as VxeGridProps,
    form: {
      page: 1,
      size: 10,
      total: 0,
      prohibited: undefined,
      searchKey: undefined,
      type: props.type,
      // 如果是查询客户大纲 此字段必填，暂定位0
      customerId: props.customerId,
      // sort:'status,startTime',
      // order:'desc'
    },

    headerFormRef: null,
    isShow: false,
    exportIsShow: false,
  })
  // onActivated(() => {

  //     getList();
  // })

  onMounted(() => {
    getList()
  })
  function getButtons(): ButtonArr {
    return [
      {
        name: t('message.hsDetail'),
        type: 'detail',
        visible: props.type !== 'INTERNAL_TRAINING',
      },
      {
        name: t('message.administration'),
        type: 'manage',
        visible: props.type !== 'INTERNAL_TRAINING',
      },

      {
        name: t('message.modify'),
        type: 'edit',
      },

      {
        name: t('message.hsdelete'),
        type: 'delete',
        status: 'danger',
      },
    ]
  }
  const btnClick = ({ type: btnType, row }) => {
    switch (btnType) {
      case 'edit':
        router.push(`/project/manage/class/${row.id}/${props.type}`)
        break

      case 'manage':
        router.push({
          path: '/project/manage/class/manage/' + row.id,
        })
        // state.syllabusId=row.id
        break
      case 'detail':
        router.push({
          path: '/project/manage/class/detail/' + row.id,
        })
        // state.syllabusId=row.id
        break

      case 'delete':
        deleData(row.id)
        break
      default:
        break
    }
  }
  const getList = async () => {
    state.gridOptions.loading = true
    const [err, res] = await to(getClazzsList(state.form))
    state.gridOptions.loading = false
    if (!err && res.status == 200) {
      const {
        data: { content, totalElements },
      } = res
      state.gridOptions.data = content
      state.form.total = totalElements
    }
  }
  const add = () => {
    router.push({
      path: '/project/manage/class/add/' + props.type,
    })
  }
  const batchAdd = () => {
    router.push({
      path: '/project/manage/class/add/' + props.type + '/true',
    })
  }
  const updateData = () => {
    getList()
  }
  const deleData = (id: number) => {
    ElMessageBox.confirm(t('tip.are_you_sure_you_want_to_delete_the_changed_class'), {
      type: 'error',
    })
      .then(() => {
        deleteClazzsId(id).then(() => {
          state.form.page = judgePage(state.form.total, state.form)
          ElMessage.success(t('message.delete_succeeded'))
          getList()
        })
      })
      .catch((_) => {})
  }

  const submit = (val: string) => {
    if (val == 'reset') {
      state.headerFormRef.resetFields()
    }
    state.form.page = 1
    getList()
  }
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      state.form.page = setPage(state.form.total, state.form)
    }
    getList()
  }
</script>

<style scoped></style>
