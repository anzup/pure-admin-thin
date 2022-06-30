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
              :placeholder="$t('tip.please_select')"
              class="width90"
              clearable
            >
              <el-option
                v-for="(item, index) in genderList"
                :key="index"
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

          <el-form-item v-show="hasTeacherRole" :label="$t('state.teacherTeam')" prop="teamId">
            <el-select
              v-model="form.teamId"
              :placeholder="$t('tip.please_select')"
              class="width120"
              clearable
            >
              <el-option
                v-for="item in teacherTeamsList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="hasTeacherRole"
            :label="$t('state.type_of_teacher')"
            prop="teacherTypeId"
          >
            <el-select
              v-model="form.teacherTypeId"
              :placeholder="$t('tip.please_select')"
              class="width120"
              clearable
            >
              <el-option
                v-for="item in teacherTypesList"
                :key="item.id"
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
    <DiaLog
      :id="detailId"
      v-model:isShow="isShow"
      :roleInfo="roleInfo"
      :type="type"
      @updateData="updateData"
    />
  </div>
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { computed, defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import DiaLog from './Dialog.vue'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useData from '/@/hooks/useUser'
  import { useI18n } from '/@/hooks/useI18n'
  import { useRouter } from 'vue-router'
  import common from '/@/hooks/useCommon'
  import useTeacher from '/@/hooks/teacher'
  import { batchDeleteUsersId, deleteUsersId, getUsersList } from '/@/api/user'

  export default defineComponent({
    components: {
      VxeTable,
      DiaLog,
      FormBtn,
    },
    props: {
      roleInfo: Object,
    },
    setup(props) {
      const { t } = useI18n()
      const router = useRouter()
      const { accountStatus, genderList } = common()
      const { teacherTypesList, teacherTeamsList, getTeacherTypes, getTeacherTeams } = useTeacher()
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
            title: t('state.full_name'),
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
            title: t('state.identification_number'),
            minWidth: 100,
          },
          {
            field: 'phone',
            title: t('state.phone_number'),
            minWidth: 100,
          },
          {
            field: 'username',
            title: t('state.login_name'),
            minWidth: 100,
          },
          {
            field: 'team.name',
            title: t('state.teacherTeam'),
            minWidth: 100,
            visible: hasTeacherRole.value,
          },
          {
            field: 'teacherType.name',
            title: t('state.type_of_teacher'),
            minWidth: 100,
            visible: hasTeacherRole.value,
          },
          {
            field: 'createdDate',
            title: t('state.create_time'),
            minWidth: 100,
            formatter: 'formatDateTime',
            visible: false,
          },
          {
            field: 'lastLoginTime',
            title: t('state.last_login_time'),
            minWidth: 100,
            formatter: 'formatDateTime',
            visible: false,
          },
          {
            field: 'prohibited',
            title: t('state.account_status'),
            width: 80,
            formatter: 'formatStatus',
          },
          {
            field: 'remark',
            title: t('state.remarks'),
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
      onMounted(() => {
        // getList()
        getTeacherTypes()
        getTeacherTeams()
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
        teacherTypesList,
        teacherTeamsList,
        hasTeacherRole,
      }
    },
  })
</script>

<style scoped></style>
