<template>
  <div>
    <VxeTable
      v-model:form="form"
      :loading="testLoading"
      v-bind="gridOptions"
      @action="btnClick"
      @checkbox="checkbox"
      @handlePageChange="handlePageChange"
    >
      <template #form>
        <el-form ref="headerFormRef" :model="form" class="header-form" inline>
          <el-form-item :label="$t('state.connection')" prop="customerId">
            <el-select
              v-model="form.customerId"
              :placeholder="$t('tip.please_select')"
              class="width180"
              clearable
              filterable
            >
              <el-option
                v-for="item in customerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('state.student_type')" prop="studentTypeId">
            <el-select
              v-model="form.studentTypeId"
              :placeholder="$t('tip.please_select')"
              class="width90"
              clearable
            >
              <el-option
                v-for="item in studentTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('state.account_status')" prop="prohibited">
            <el-select
              v-model="form.prohibited"
              :placeholder="$t('tip.please_select')"
              class="width90"
              clearable
            >
              <el-option
                v-for="(item, index) in accountStatus"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="searchKey">
            <el-input
              v-model="form.searchKey"
              :placeholder="$t('tip.please_enter_keyword_search')"
              class="width180"
              clearable
              prefix-icon="Search"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <FormBtn @submit="submit" />
          </el-form-item>
        </el-form>
      </template>
      <!--自定义插槽 toolbar buttons 插槽-->
      <template #toolbar_tools>
        <el-button type="primary" @click="add">{{ $t('button.hsadd') }}</el-button>
        <el-button :disabled="!selectedList.length" type="primary" @click="batchForbidden"
          >{{ $t('button.batchForbidden') }}
        </el-button>
        <el-button :disabled="!selectedList.length" type="danger" @click="batchDelete"
          >{{ $t('state.batch_delete') }}
        </el-button>
      </template>
    </VxeTable>
    <Dialog :id="detailId" v-model:isShow="isShow" :type="type" @updateData="updateData" />
  </div>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import Dialog from './components/Dialog.vue'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import useList from '/@/hooks/customer'
  import { useI18n } from '/@/hooks/useI18n'
  import common from '/@/hooks/useCommon'
  import useData from '/@/hooks/useUser'
  import useStudentType from '/@/hooks/studentsType'
  import { batchDeleteUsersId, deleteUsersId, getUsersList } from '/@/api/user'

  export default defineComponent({
    components: {
      VxeTable,
      Dialog,
      FormBtn,
    },
    setup() {
      const { t } = useI18n()
      const { accountStatus } = common()
      const { getUsersType, studentTypeList } = useStudentType()
      const leadingIn = ref(false),
        route = useRoute()
      const formatObj = {
        formatType({ cellValue }) {
          return studentTypeList.value.find((v) => v.id == cellValue).name
        },
        formatCustomer({ cellValue }) {
          return customerList.value.find((v) => v.id == cellValue)?.name
        },
      }
      const { postUsersStatus, resetPassword } = useData()
      const state = reactive({
        gridOptions: {
          columns: [
            { type: 'checkbox', width: 50 },
            { type: 'seq', width: 50, title: t('state.seq') },
            {
              field: 'name',
              title: t('state.full_name'),
              // sortable: true,
              minWidth: 100,
            },
            {
              // sortable: true,
              field: 'gender',
              title: t('state.gender'),
              width: 60,
              formatter: 'formatGender',
            },
            {
              // sortable: true,
              field: 'idNumber',
              title: t('state.identification_number'),
              minWidth: 100,
            },
            {
              // sortable: true,
              field: 'phone',
              title: t('state.phone_number'),
              width: 100,
            },
            {
              // sortable: true,
              field: 'customer.name',
              title: t('state.connection'),
              minWidth: 100,
              // formatter:formatObj.formatCustomer
            },
            {
              // sortable: true,
              field: 'nationality.name',
              title: t('state.nationality'),
              width: 60,
              // formatter:formatObj.formatCustomer
            },
            {
              // sortable: true,
              field: 'studentType.name',
              title: t('state.student_type'),
              width: 70,
            },
            {
              // sortable: true,
              field: 'position.name',
              title: t('state.post'),
              minWidth: 80,
            },
            {
              // sortable: true,
              field: 'title',
              title: t('state.companyPositon'),
              minWidth: 100,
            },
            {
              // sortable: true,
              field: 'planeJob.name',
              title: t('state.airplanePosition'),
              minWidth: 80,
            },
            {
              // sortable: true,
              field: 'username',
              title: t('state.login_name'),
              minWidth: 100,
            },
            {
              // sortable: true,
              field: 'createdDate',
              title: t('state.create_time'),
              width: 140,
              formatter: 'formatDateTime',
            },
            {
              // sortable: true,
              field: 'prohibited',
              title: t('state.account_status'),
              width: 70,
              formatter: 'formatStatus',
            },
            {
              title: t('state.operation'),
              width: 230,
              slots: { default: 'operate' },
              field: 'operationTypes',
              // fixed: 'right',
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
        } as VxeGridProps,
        form: {
          builtinRoles: 'STUDENT', // 参训人员（学员）
          page: 1,
          size: 10,
          total: 0,
          customerId: undefined,
          searchKey: undefined,
          studentTypeId: undefined,
          prohibited: undefined,
        },
        isShow: false,
        detailId: undefined,
        type: '',
        headerFormRef: null,
        testLoading: false,
      })

      function getButtons({ row }) {
        return [
          {
            name: t('state.reset_password'),
            type: 'reset',
          },
          {
            name: t('state.disable'),
            type: 'disable',
            visible: !row.prohibited,
          },
          {
            name: t('state.enable'),
            type: 'enable',
            visible: row.prohibited,
          },
          {
            name: t('button.hsDetail'),
            type: 'detail',
          },
          {
            name: t('button.modify'),
            type: 'edit',
          },

          {
            name: t('button.hsdelete'),
            type: 'delete',
            status: 'danger',
          },
        ]
      }

      const { customerList, getCustomers } = useList()
      if (route.query.id) {
        state.form.customerId = Number(route.query.id)
      }

      onMounted(async () => {
        await getCustomers()
        getList()
        getUsersType()
      })
      const router = useRouter()
      const btnClick = ({ type: btnType, row }) => {
        switch (btnType) {
          case 'edit':
            state.isShow = true
            state.type = btnType
            state.detailId = row.id
            break
          case 'detail':
            router.push({
              path: 'detail',
              query: {
                id: row.id,
              },
            })
            break
          case 'reset':
            resetPassword({
              id: row.id,
              password: '111111',
            })
            break
          case 'disable':
            postUsersStatus(
              {
                ids: [row.id],
                prohibited: true,
              },
              getList,
            )
            break
          case 'enable':
            postUsersStatus(
              {
                ids: [row.id],
                prohibited: false,
              },
              getList,
            )
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

        getUsersList(form)
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
        ElMessageBox.confirm(t('tip.tipDeleteTrainningUser'), {
          type: 'warning',
        })
          .then(() => {
            deleteUsersId(id).then(() => {
              state.form.page = judgePage(state.form.total, state.form)
              ElMessage.success(t('message.delete_succeeded'))
              getList()
            })
          })
          .catch((_) => {})
      }
      const selectedList = ref([])
      const checkbox = ({ ids }) => {
        selectedList.value = ids
      }
      const batchDelete = () => {
        ElMessageBox.confirm(t('tip.tipDeleteTrainningUser'), {
          type: 'warning',
        })
          .then(() => {
            batchDeleteUsersId({
              ids: selectedList.value,
            }).then(() => {
              state.form.page = judgePage(state.form.total, state.form)
              ElMessage.success(t('message.delete_succeeded'))
              getList()
            })
          })
          .catch((_) => {})
      }
      const batchForbidden = () => {
        postUsersStatus(
          {
            ids: selectedList.value,
            prohibited: true,
          },
          getList,
        )
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
        customerList,
        studentTypeList,
        leadingIn,
        handlePageChange,
        formatObj,
        batchDelete,
        batchForbidden,
        accountStatus,
        checkbox,
        selectedList,
      }
    },
  })
</script>

<style scoped></style>
