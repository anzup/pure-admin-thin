<template>
  <div>
    <el-dialog
      :title="getTitle"
      v-model="dialogVisible"
      width="1000px"
      @close="close"
      @open="open"
      destroy-on-close
    >
      <vxe-grid
        v-bind="gridOptions"
        ref="tableRef"
        :seq-config="{
          startIndex: (form.page - 1) * form.size,
        }"
      >
        <template #toolbar_tools>
          <el-form :model="form" ref="formRef" inline class="header-form">
            <!-- <el-form-item :label="$t('text.connection')" prop="customerIds">
                            <el-select
                                v-model="form.customerIds"
                                :placeholder="$t('text.please_select')"
                                multiple
                                collapse-tags
                            >
                                <el-option
                                    v-for="item in customerAllList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-form-item>-->
            <el-form-item prop="searchKey">
              <el-input v-model="form.searchKey" :placeholder="$t('text.please_enter')" />
            </el-form-item>
            <el-form-item>
              <FormBtn @submit="submit" />
            </el-form-item>
          </el-form>
        </template>
        <template #pager>
          <vxe-pager
            background
            :layouts="[
              'Sizes',
              'PrevJump',
              'PrevPage',
              'JumpNumber',
              'NextPage',
              'NextJump',
              'FullJump',
              'Total',
            ]"
            v-model:current-page="form.page"
            v-model:page-size="form.size"
            :total="form.total"
            @page-change="handlePageChange"
          />
        </template>
      </vxe-grid>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('message.hscancel') }}
          </el-button>
          <el-button type="primary" @click="confirm">
            {{ $t('message.hsdefine') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, computed, toRefs, inject } from 'vue'
  import { setPage } from '/@/utils/utils'

  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { VxeGridProps } from 'vxe-table'
  import { getStudentsList, IStudentList } from '/@/api/opm/roles'
  import { postClazzsAddStudent } from '/@/api/opm/train'
  import { getEmployeesList } from '/@/api/opm/roles'
  interface IForm extends IStudentList {
    total: number
  }
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    isShow: Boolean,
    excludeIds: {
      type: Array,
      default: () => [],
    },
    type: Boolean,
  })
  const emit = defineEmits(['updateData', 'update:isShow'])

  const { t } = useI18n()
  const formRef = ref(null)
  const dialogVisible = computed({
    get: (): boolean => props.isShow,
    set: (val: boolean) => emit('update:isShow', val),
  })
  const getTitle = computed(() => {
    return t('text.select_students')
  })
  const clazzId = inject('clazzId')
  // const contracts = inject<{ value: number[] }>('contracts')
  const state = reactive({
    gridOptions: {
      columns: [
        { type: 'checkbox', width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'name',
          title: t('text.full_name'),
          // sortable: true,
          minWidth: 100,
        },
        {
          field: 'customer.name',
          title: t('text.airline_company'),
          // sortable: true,
          minWidth: 100,
          visible: props.type,
        },
        {
          field: 'gender',
          title: t('text.gender'),
          // sortable: true,
          minWidth: 100,
          formatter: 'formatGender',
        },
        {
          field: 'phone',
          title: t('text.contact_number'),
          // sortable: true,
          minWidth: 100,
        },

        {
          field: 'type',
          title: t('text.student_type'),
          // sortable: true,
          minWidth: 100,
          formatter: 'formatStudentType',
          visible: props.type,
        },
      ],

      data: [],

      toolbarConfig: {
        // custom: true,
        size: 'medium',
        perfect: true,
        slots: {
          buttons: 'toolbar_tools',
        },
      },
      height: 500,
      border: true,
      rowId: 'id',
      checkboxConfig: {
        // checkField:'id',
        trigger: 'row',
        reserve: true,
      },
      loading: false,
    } as VxeGridProps,
    form: {
      searchKey: '',
      page: 1,
      size: 10,
      customerIds: [],
      total: 0,
    } as IForm,
  })
  const { gridOptions, form } = toRefs(state)
  const submit = (val: string) => {
    if (val == 'reset') {
      formRef.value.resetFields()
    }
    state.form.page = 1
    getList()
  }
  const getList = () => {
    state.gridOptions.loading = true
    let form = JSON.parse(JSON.stringify(state.form))
    form.customerIds = form.customerIds.join()
    form.excludeIds = props.excludeIds.join()
    form.customerClazzId = clazzId
    if (!props.type) {
      form.prohibited = false
    }
    const api = props.type ? getStudentsList : getEmployeesList
    api(form).then((res) => {
      state.gridOptions.data = res.data.content
      state.form.total = res.data.totalElements
      state.gridOptions.loading = false
    })
  }
  const close = () => {
    formRef.value.resetFields()
    tableRef.value.clearCheckboxReserve()
    state.form.page = 1
    state.form.size = 10
    state.form.total = 0
  }
  const open = () => {
    getList()
  }
  const tableRef = ref()

  const confirm = () => {
    postClazzsAddStudent({
      id: clazzId,
      data: {
        ids: [
          ...tableRef.value.getCheckboxRecords(),
          ...tableRef.value.getCheckboxReserveRecords(),
        ].map((v) => v.id),
      },
    }).then(() => {
      close()
      dialogVisible.value = false
      emit('updateData')
    })
  }

  // const { getCustomersAllList, customerAllList } = useCustomers()
  // onMounted(() => {
  //     getCustomersAllList()
  // });
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      state.form.page = setPage(state.form.total, state.form)
    }
    getList()
  }
</script>

<style scoped lang="scss">
  :deep(.header-form) {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
</style>
