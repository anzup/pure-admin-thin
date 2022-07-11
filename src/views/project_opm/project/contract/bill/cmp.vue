<template>
  <VxeTable
    v-bind="state.gridOptions"
    v-model:form="state.form"
    @checkbox="checkbox"
    @sort-change="sortChangeEvent"
    @handle-page-change="handlePageChange"
  >
    <template #form>
      <el-form :model="state.form" ref="headerFormRef" inline class="header-form">
        <el-form-item :label="$t('text.airline_company')" prop="customerId">
          <el-select
            v-model="state.form.customerId"
            :placeholder="$t('text.please_select')"
            filterable
          >
            <el-option
              v-for="item in customerAllList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('text.training_type')" prop="courseType">
          <el-select
            v-model="state.form.courseType"
            clearable
            :placeholder="$t('text.please_select')"
          >
            <el-option
              v-for="item in leaseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('text.training_model')" prop="airplaneType">
          <el-select
            v-model="state.form.airplaneType"
            clearable
            :placeholder="$t('text.please_select')"
          >
            <el-option
              v-for="item in airplaneTypesAllList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('text.training_period')" prop="dateRange">
          <el-date-picker
            v-model="state.form.dateRange"
            type="daterange"
            :range-separator="$t('text.to')"
            :start-placeholder="$t('text.start_date')"
            :end-placeholder="$t('text.end_date')"
            :disabledDate="disabledDate"
          />
        </el-form-item>
        <el-form-item prop="searchKey">
          <el-input
            v-model="state.form.searchKey"
            :placeholder="$t('text.please_enter_the_class_number_to_search')"
          />
        </el-form-item>
        <el-form-item>
          <FormBtn @submit="submit" />
        </el-form-item>
      </el-form>
    </template>

    <template #toolbar_tools>
      <template v-if="type == 'toBeSettled'">
        <el-button
          type="primary"
          @click="showDialog('settlement')"
          :disabled="selectArr.length == 0"
          >{{ $t('text.settlement') }}</el-button
        >
        <el-button type="primary" @click="showDialog('give')" :disabled="selectArr.length == 0">{{
          $t('text.give')
        }}</el-button>
        <el-button type="primary" @click="billItemsIgnore" :disabled="selectArr.length == 0">{{
          $t('text.no_settlement')
        }}</el-button>
      </template>
      <template v-else>
        <el-button
          type="primary"
          @click="billItemsIgnoreDelete"
          :disabled="selectArr.length == 0"
          >{{ $t('text.join_settlement') }}</el-button
        >
      </template>
    </template>
  </VxeTable>
  <DiaLog
    ref="dialogRef"
    v-model:isShow="state.isShow"
    :selectArr="selectArr"
    :type="settlementType"
    @updateData="updateData"
    :customerId="state.form.customerId"
  />
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { reactive, onMounted, ref } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import {
    getBillItemsList,
    putBillItemsIgnore,
    putBillItemsIgnoreDelete,
  } from '/@/api/opm/contract'

  import DiaLog from './components/diaLog.vue'
  import { setPage } from '/@/utils/utils'
  import useCustomers from '/@/commonTs/customer'
  import useTrain from '/@/commonTs/train'
  import useAirplaneTypes from '/@/commonTs/airplaneTypes'

  import { useRoute } from 'vue-router'
  import { sortChange } from '/@/utils/utils'
  import dayjs from 'dayjs'
  import { ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'

  const props = defineProps({
    type: String,
  })

  const route = useRoute(),
    { t } = useI18n()

  const state = reactive({
    gridOptions: {
      height: 'auto',
      columns: [
        { type: 'checkbox', width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'studentNames',
          title: t('text.student_name'),
          minWidth: 100,
        },
        {
          field: 'customerName',
          title: t('text.airline_company'),
          minWidth: 100,
        },
        {
          field: 'courseNumber',
          title: t('text.training_course_no'),
          minWidth: 100,
        },
        {
          field: 'courseName',
          title: t('text.training_program'),
          minWidth: 100,
        },
        {
          field: 'contractNo',
          title: t('text.training_contract'),
          minWidth: 100,
        },
        {
          field: 'courseType',
          title: t('text.training_type'),
          minWidth: 100,
          formatter: ({ cellValue }) => leaseList.value.find((v) => v.id == cellValue)?.name,
        },
        {
          field: 'airplaneType',
          title: t('text.training_model'),
          minWidth: 100,
        },
        {
          field: 'startDate',
          title: t('text.training_start_time'),
          minWidth: 100,
          formatter: 'formatDateTime',
          sortable: true,
        },
        {
          field: 'endDate',
          title: t('text.training_end_time'),
          minWidth: 100,
          formatter: 'formatDateTime',
          sortable: true,
        },
      ],

      data: [],

      toolbarConfig: {
        // custom: true,
        size: 'medium',
        perfect: true,
        slots: {
          tools: 'toolbar_tools',
        },
      },
      sortConfig: {
        // multiple:true,
        trigger: 'cell',
      },
      loading: false,
    } as VxeGridProps,
    form: {
      page: 1,
      size: 10,
      total: 0,
      customerId: undefined,
      airplaneType: undefined,
      courseNumber: undefined,
      courseType: undefined,
      dateRange: undefined,
      searchKey: undefined,
      ignored: props.type !== 'toBeSettled',
    },
    isShow: false,
    headerFormRef: null,
  })

  const { getCustomersAllList, customerAllList } = useCustomers()
  const { leaseList } = useTrain()
  const { getAirplaneTypesAllList, airplaneTypesAllList } = useAirplaneTypes()
  onMounted(async () => {
    await getCustomersAllList()
    if (route.query.id) {
      state.form.customerId = +route.query.id
    } else {
      state.form.customerId = customerAllList.value[0].id
    }
    getAirplaneTypesAllList()
    getList()
  })

  const getList = async () => {
    state.gridOptions.loading = true
    const form = JSON.parse(JSON.stringify(state.form))
    form.dateRange = form.dateRange?.join()

    const [err, res] = await to(getBillItemsList(state.form))
    state.gridOptions.loading = false
    if (!err && res.status == 200) {
      const {
        data: { content, totalElements },
      } = res
      state.gridOptions.data = content
      state.form.total = totalElements
    }
  }
  const settlementType = ref<string>(undefined)
  const dialogRef = ref()
  const showDialog = (type: string) => {
    // state.isShow = true;
    dialogRef.value.open()
    settlementType.value = type
  }
  const updateData = () => {
    selectArr.value = []
    getList()
  }

  const submit = (val: string) => {
    if (val == 'reset') {
      state.headerFormRef.resetFields()
    }
    state.form.page = 1
    getList()
  }

  // 表格复选操作
  const selectArr = ref<number[]>([])

  const checkbox = ({ ids }: { ids: number[] }) => {
    selectArr.value = ids
  }

  const sortChangeEvent = ({ sortList }) => {
    state.form = {
      ...state.form,
      ...sortChange(sortList[0]),
    }
    getList()
  }

  const disabledDate = (date) => {
    return dayjs(date).isAfter(dayjs())
  }

  const billItemsIgnore = () => {
    ElMessageBox.confirm(
      t('tip.this_operation_will_add_the_selected_data_to_the_non_settlement_list'),
      t('text.tip'),
    ).then(() => {
      putBillItemsIgnore({ ids: selectArr.value }).then((res) => {
        getList()
      })
    })
  }
  const billItemsIgnoreDelete = () => {
    ElMessageBox.confirm(
      t('tip.this_operation_will_add_the_selected_data_to_the_list_to_be_settled'),
      t('text.tip'),
    ).then(() => {
      putBillItemsIgnoreDelete({ ids: selectArr.value }).then((res) => {
        getList()
      })
    })
  }

  const handlePageChange = (val) => {
    if (val.type == 'size') {
      state.form.page = setPage(state.form.total, state.form)
    }
    getList()
  }
</script>

<style scoped></style>
