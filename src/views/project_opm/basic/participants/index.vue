<template>
  <div>
    <VxeTable
      v-bind="gridOptions"
      v-model:form="form"
      :loading="testLoading"
      @action="btnClick"
      @handlePageChange="handlePageChange"
    >
      <template #form>
        <el-form :model="form" ref="headerFormRef" inline class="header-form">
          <el-form-item :label="$t('text.connection')" prop="customerIds">
            <el-select
              multiple
              clearable
              v-model="form.customerIds"
              :placeholder="$t('text.please_select')"
            >
              <el-option
                v-for="type in clientsAllList"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="searchKey">
            <el-input
              v-model="form.searchKey"
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
        <el-button type="primary" @click="add">{{ $t('message.hsadd') }}</el-button>
        <el-button type="primary" @click="leadingIn = true">{{ $t('message.import') }}</el-button>
      </template>
    </VxeTable>
    <DiaLog v-model:isShow="isShow" :id="detailId" :type="type" @updateData="updateData" />
    <LeadingInDialog v-model="leadingIn" @updateData="updateData" />
  </div>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import DiaLog from './components/diaLog.vue'
  import LeadingInDialog from './components/leadingInDialog.vue'
  import useList from './components/useList'
  import { defineComponent, ref, reactive, onMounted, toRefs } from 'vue'
  import { deleteStudentsId, getStudentsList } from '/@/api/opm/roles'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useGo } from '/@/hooks/usePage'
  export default defineComponent({
    components: {
      VxeTable,
      DiaLog,
      FormBtn,
      LeadingInDialog,
    },
    setup() {
      const { t } = useI18n()
      const leadingIn = ref(false)
      const route = useRoute()
      const formatObj = {
        formatType({ cellValue }) {
          return useParticiPantsObj.studentClassList.find((v) => v.id == cellValue).name
        },
        formatCustomer({ cellValue }) {
          return useParticiPantsObj.clientsAllList.find((v) => v.id == cellValue)?.name
        },
      }
      const state = reactive({
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
              // sortable: true,
              field: 'gender',
              title: t('text.gender'),
              minWidth: 100,
              formatter: 'formatGender',
            },
            {
              // sortable: true,
              field: 'idNumber',
              title: t('text.identification_number'),
              minWidth: 100,
            },
            {
              // sortable: true,
              field: 'phone',
              title: t('text.contact_number'),
              minWidth: 100,
            },
            {
              // sortable: true,
              field: 'customer.name',
              title: t('text.connection'),
              minWidth: 100,
              // formatter:formatObj.formatCustomer
            },

            {
              // sortable: true,
              field: 'typeName',
              title: t('text.personnel_type'),
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
        } as VxeGridProps,
        form: {
          page: 1,
          size: 10,
          total: 0,
          customerIds: [],
          searchKey: undefined,
        },
        isShow: false,
        detailId: undefined,
        type: '',
        headerFormRef: null,
        testLoading: false,
      })
      const { state: useParticiPantsObj, getCustomersAllList } = useList()
      // console.log(useParticiPantsObj);
      if (route.query.id) {
        state.form.customerIds = [+route.query.id]
      }

      onMounted(async () => {
        await getCustomersAllList()
        getList()
      })
      const router = useRouter()
      const routerGo = useGo(router)
      const btnClick = ({ type: btnType, row }) => {
        switch (btnType) {
          case 'edit':
            state.isShow = true
            state.type = btnType
            state.detailId = row.id
            break
          case 'detail':
            routerGo(`${row.id}`)
            break
          case 'delete':
            deleData(row.id)
            break
          default:
            break
        }
      }
      const getList = () => {
        state.testLoading = true
        let form = JSON.parse(JSON.stringify(state.form))
        form.customerIds = form.customerIds.join()

        getStudentsList(form)
          .then((res) => {
            const {
              data: { content, totalElements },
            } = res
            state.gridOptions.data = content
            state.form.total = totalElements
            state.testLoading = false
          })
          .catch(() => {
            state.testLoading = false
          })
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
            deleteStudentsId(id).then(() => {
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

      return {
        btnClick,
        submit,
        add,
        updateData,
        ...toRefs(state),
        ...toRefs(useParticiPantsObj),
        leadingIn,
        handlePageChange,
        formatObj,
      }
    },
  })
</script>

<style scoped></style>
