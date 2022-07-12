<template>
  <div>
    <VxeTable
      v-bind="state.gridOptions"
      v-model:form="state.form"
      @action="btnClick"
      @handlePageChange="handlePageChange"
    >
      <template #form>
        <el-form
          :model="state.form"
          :ref="(el) => (state.headerFormRef = el)"
          inline
          class="header-form"
        >
          <el-form-item :label="$t('text.customer_type')" prop="customerTypeId">
            <el-select
              clearable
              v-model="state.form.customerTypeId"
              :placeholder="$t('text.please_select')"
            >
              <el-option
                v-for="item in state.typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
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
      <!--自定义插槽 toolbar buttons 插槽-->
      <template #toolbar_tools>
        <el-button type="primary" @click="add">{{ $t('message.hsadd') }}</el-button>
      </template>
    </VxeTable>
    <DiaLog
      v-model:isShow="state.isShow"
      :id="state.detailId"
      :type="state.type"
      @updateData="updateData"
    />
  </div>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, onMounted, toRefs } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { deleteCustomersId, getCustomersList, getCustomersTypesAll } from '/@/api/opm/customer'
  import DiaLog from './components/diaLog.vue'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'

  const { t } = useI18n()
  const router = useRouter()

  const state = reactive({
    typeList: [],
    gridOptions: {
      columns: [
        // { type: "checkbox", width: 50 },
        { type: 'seq', width: 60, title: t('text.seq') },
        {
          field: 'name',
          title: t('text.customer_name'),
          // sortable: true,
          minWidth: 100,
        },
        {
          // sortable: true,
          field: 'shortName',
          title: t('text.customer_abbreviation'),
          // width:300
          minWidth: 100,
        },
        {
          // sortable: true,
          field: 'code',
          title: t('text.customer_code'),
          minWidth: 100,
        },
        {
          // sortable: true,
          field: 'customerType.name',
          title: t('text.customer_type'),
          minWidth: 100,
        },

        {
          field: 'contactPersonName',
          title: t('text.customer_contact_'),
          minWidth: 100,
        },
        {
          field: 'contactPersonPhone',
          title: t('text.contact_mobile_phone'),
          minWidth: 100,
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
      buttons: [
        {
          name: t('message.hsDetail'),
          type: 'detail',
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
      ],
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
      customerTypeId: undefined,
      searchKey: undefined,
    },
    isShow: false,
    detailId: undefined,
    type: '',
    headerFormRef: null,
  })
  onMounted(() => {
    getList()
    getTypeList()
  })

  const btnClick = ({ type: btnType, row }) => {
    switch (btnType) {
      case 'edit':
        state.isShow = true
        state.type = btnType
        state.detailId = row.id
        break
      case 'detail':
        router.push(row.id + '')
        break
      default:
        deleData(row.id)
        break
    }
  }
  const getList = async () => {
    state.gridOptions.loading = true

    const [err, res] = await to(getCustomersList(state.form))
    state.gridOptions.loading = false
    if (!err && res.status === 200) {
      const {
        data: { content, totalElements },
      } = res
      state.gridOptions.data = content
      state.form.total = totalElements
    }
  }
  const add = () => {
    state.isShow = true
    state.type = 'add'
    state.detailId = undefined
  }
  const updateData = () => {
    getList()
  }
  const deleData = (id: number) => {
    ElMessageBox.confirm(t('tip.this_operation_will_delete_the_selected_data'), {
      type: 'warning',
    })
      .then(() => {
        deleteCustomersId(id).then(() => {
          state.form.page = judgePage(state.form.total, state.form)
          ElMessage.success(t('text.delete_succeeded'))
          getList()
        })
      })
      .catch((_) => {})
  }
  const getTypeList = () => {
    getCustomersTypesAll().then((res) => {
      state.typeList = res.data
    })
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
