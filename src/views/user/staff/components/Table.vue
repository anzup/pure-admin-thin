<template>
  <div style="height: 100%">
    <VxeTable
      v-model:form="form"
      v-bind="gridOptions"
      @action="btnClick"
      @checkbox="checkbox"
      @handlePageChange="handlePageChange"
    >
      <template #form>
        <el-form ref="headerFormRef" :model="form" class="header-form" inline>
          <el-form-item :label="$t('state.gender')" prop="gender">
            <el-select
              v-model="form.gender"
              :placeholder="$t('tip.pleaseChoose')"
              class="width90"
              clearable
            >
              <el-option
                v-for="(item, index) in genderList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('state.accountStatus')" prop="prohibited">
            <el-select
              v-model="form.prohibited"
              :placeholder="$t('tip.pleaseChoose')"
              class="width90"
              clearable
            >
              <el-option
                v-for="(item, index) in accountStatus"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('state.department')" prop="prohibited">
            <el-select
              v-model="form.prohibited"
              :placeholder="$t('tip.pleaseChoose')"
              class="width90"
              clearable
            >
              <el-option
                v-for="item in departmentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="searchKey">
            <el-input
              v-model="form.searchKey"
              :placeholder="$t('tip.keywordToSearch')"
              class="width180"
              clearable
              prefix-icon="Search"
            />
          </el-form-item>
          <el-form-item>
            <FormBtn @submit="submit" />
          </el-form-item>
        </el-form>
      </template>
      <!--自定义插槽 toolbar buttons 插槽-->
      <template #toolbar_tools>
        <el-button type="primary" @click="add">{{ $t('buttons.hsAdd') }}</el-button>
        <el-button :disabled="!selectedList.length" type="primary" @click="batchForbidden"
          >{{ $t('buttons.bulkDisable') }}
        </el-button>
        <el-button :disabled="!selectedList.length" type="danger" @click="batchDelete"
          >{{ $t('buttons.batchDeletion') }}
        </el-button>
      </template>
    </VxeTable>
    <Dialog v-model="isShow" :role-info="roleInfo" @updateData="getList" />
  </div>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import Dialog from './Dialog.vue'

  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useData from '/@/hooks/useUser'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import common from '/@/hooks/useCommon'

  import { batchDeleteUsersId, deleteUsersId, getUsersList } from '/@/api/user'
  import useDepartment from '/@/hooks/useDepartment'

  export default defineComponent({
    components: {
      VxeTable,
      FormBtn,
      Dialog,
    },
    props: {
      roleInfo: Object,
    },
    setup(props) {
      const { t } = useI18n()
      const router = useRouter()
      const { accountStatus, genderList } = common()
      const selectedList = ref([])
      const checkbox = ({ ids }) => {
        selectedList.value = ids
      }
      const hasTeacherRole = computed(() => {
        return props.roleInfo?.builtinRole == 'TEACHER'
      })
      const getColumns = computed(() => {
        return [
          { type: 'checkbox', width: 50 },
          { type: 'seq', width: 50, title: t('state.seq') },
          {
            field: 'name',
            title: t('state.fullName'),
            minWidth: 100,
          },
          {
            field: 'gender',
            title: t('state.gender'),
            width: 70,
            formatter: 'formatGender',
          },
          {
            field: 'idNumber',
            title: t('state.idNumber'),
            minWidth: 100,
          },
          {
            field: 'department.name',
            title: t('state.department'),
            // formatter: ({ cellValue }) =>
            //   departmentList.value.find((v) => v.id === cellValue)?.name ?? '',
          },
          {
            field: 'phone',
            title: t('state.cellphoneNumber'),
            minWidth: 100,
          },
          {
            field: 'username',
            title: t('state.logInName'),
            minWidth: 100,
          },
          {
            field: 'prohibited',
            title: t('state.accountStatus'),
            width: 80,
            formatter: 'formatStatus',
          },
          {
            field: 'remark',
            title: t('state.remark'),
            minWidth: 100,
          },

          {
            title: t('state.operation'),
            width: 230,
            slots: { default: 'operate' },
            field: 'operationTypes',
            // fixed:'right'
          },
        ]
      })
      const state = reactive({
        gridOptions: {
          height: 'auto',
          columns: getColumns.value,
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
          gender: undefined,
          searchKey: undefined,
          teamId: undefined,
          teacherTypeId: undefined,
        },
        isShow: false,
        detailId: undefined,
        type: '',
        headerFormRef: null,
      })

      const { postUsersStatus, resetPassword } = useData()
      const { getDepartmentList, departmentList } = useDepartment()
      onMounted(async () => {
        await getDepartmentList()
        getList()
      })

      function getButtons({ row }) {
        return [
          {
            name: t('buttons.resetPassword'),
            type: 'reset',
          },
          {
            name: t('buttons.disable'),
            type: 'disable',
            visible: !row.prohibited,
          },
          {
            name: t('buttons.enable'),
            type: 'enable',
            visible: row.prohibited,
          },
          // {
          //   name: t('buttons.detail'),
          //   type: 'detail',
          // },
          {
            name: t('buttons.edit'),
            type: 'edit',
          },

          {
            name: t('buttons.hsDelete'),
            type: 'delete',
            status: 'danger',
          },
        ]
      }

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
        state.gridOptions.loading = false
        getUsersList({
          ...state.form,
          roleId: props.roleInfo?.roleId || '',
        }).then((res) => {
          const {
            data: { content, totalElements },
          } = res
          state.gridOptions.data = content
          state.form.total = totalElements
          state.gridOptions.loading = false
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
        handlePageChange,
        batchForbidden,
        batchDelete,
        checkbox,
        getList,
        accountStatus,
        selectedList,
        getColumns,
        genderList,
        hasTeacherRole,
        departmentList,
      }
    },
  })
</script>

<style scoped></style>
