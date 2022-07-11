<template>
  <VxeTable
    v-bind="state.gridOptions"
    v-model:form="state.form"
    @handle-page-change="handlePageChange"
  >
    <template #form>
      <el-form :model="state.form" ref="headerFormRef" inline class="header-form">
        <el-form-item :label="$t('text.related_contract')" prop="customerTypeId">
          <el-select
            filterable
            clearable
            v-model="state.form.customerTypeId"
            :placeholder="$t('text.please_select')"
            collapse-tags
          >
            <!-- multiple -->
            <el-option
              v-for="item in contractList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('text.training_type')" prop="type">
          <el-select clearable v-model="state.form.type" :placeholder="$t('text.please_select')">
            <el-option :label="$t('text.wet_lease')" value="WET_LEASE" />
            <el-option :label="$t('text.dry_lease')" value="DRY_LEASE" />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchKey">
          <el-input v-model="state.form.searchKey" :placeholder="$t('text.please_enter')" />
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
    </template>

    <template #operate="{ row }">
      <vxe-button type="text" status="primary" @click="goDetail(row)">{{
        $t('message.hsDetail')
      }}</vxe-button>
    </template>
  </VxeTable>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, onMounted, toRefs } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { getClazzsList } from '/@/api/opm/train'
  import { setPage } from '/@/utils/utils'
  import { useRouter } from 'vue-router'
  import useData from './common/useData'
  import { useI18n } from 'vue-i18n'
  import { useGo } from '/@/hooks/usePage'
  import to from 'await-to-js'

  const { t } = useI18n()
  const { contractList, getTypeList, formatContracts, formatType } = useData()

  const router = useRouter()
  const routerGo = useGo(router)
  const state = reactive({
    // contractList: [],
    gridOptions: {
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
          field: 'course.name',
          title: t('text.class_name'),
          minWidth: 100,
        },
        {
          // sortable: true,
          field: 'contracts',
          title: t('text.related_contract'),
          minWidth: 100,
          formatter: formatContracts,
        },
        {
          // 格式化函数在useData
          // sortable: true,
          field: 'type',
          title: t('text.training_type'),
          minWidth: 100,
          formatter: formatType,
        },
        // {
        //     // sortable: true,
        //     field: "",
        //     title: t('text.class_hour'),
        //     minWidth: 100,
        // },
        // {
        //     // sortable: true,
        //     field: "",
        //     title: t('text.customer'),
        //     minWidth: 100,
        // },
        {
          // sortable: true,
          field: 'startTime',
          title: t('text.start_training_time'),
          minWidth: 100,
          formatter: 'formatDate',
        },
        {
          // sortable: true,
          field: 'groupSize',
          title: t('text.group_number'),
          minWidth: 100,
        },
        {
          // sortable: true,
          field: 'studentCount',
          title: t('text.number_of_students'),
          minWidth: 100,
        },
        {
          // sortable: true,
          field: 'endTime',
          title: t('text.training_completion_time'),
          minWidth: 100,
          formatter: 'formatDate',
        },

        {
          title: t('text.operation'),
          width: 100,
          slots: { default: 'operate' },
          field: 'operationTypes',
          // fixed:'right'
        },
      ],

      data: [],
      loading: false,
    } as VxeGridProps,
    form: {
      page: 1,
      size: 10,
      total: 0,
      customerTypeId: undefined,
      searchKey: undefined,
      type: undefined,
      status: 'FINISHED',
    },

    headerFormRef: null,
  })
  onMounted(async () => {
    await getTypeList()
    getList()
  })

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

  const updateData = () => {
    getList()
  }

  const submit = (val: string) => {
    if (val == 'reset') {
      state.headerFormRef.resetFields()
    }
    state.form.page = 1
    getList()
  }
  const goDetail = (val) => {
    routerGo(`${val.id}`)
  }
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      state.form.page = setPage(state.form.total, state.form)
    }
    getList()
  }
</script>

<style scoped></style>
