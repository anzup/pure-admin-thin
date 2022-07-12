<template>
  <VxeTable
    v-bind="gridOptions"
    v-model:form="form"
    @action="btnClick"
    @handlePageChange="handlePageChange"
  >
    <template #form>
      <el-form :model="form" ref="headerFormRef" inline class="header-form">
        <el-form-item :label="$t('text.is_disabled')" prop="prohibited">
          <el-select clearable v-model="form.prohibited" :placeholder="$t('text.please_select')">
            <el-option :label="$t('text.yes')" :value="true" />
            <el-option :label="$t('text.no')" :value="false" />
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
      <el-button type="primary" @click="add">
        {{ $t('message.hsadd') }}
      </el-button>
    </template>
  </VxeTable>
  <DiaLog
    v-model:isShow="isShow"
    :id="detailId"
    :type="type"
    @updateData="updateData"
    :roleInfo="roleInfo"
  />
</template>

<script lang="ts">
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { defineComponent, reactive, onMounted, toRefs } from 'vue'
  import FormBtn from '/@/components/headerFormBtn/index.vue'
  import { deleteStaffsId, getStaffsList } from '/@/api/opm/roles'
  import DiaLog from './components/diaLog.vue'
  import useData from './components/useList'
  import { judgePage, setPage } from '/@/utils/utils'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import to from 'await-to-js'

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
      const state = reactive({
        gridOptions: {
          height: 'auto',
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
              field: 'username',
              title: t('text.login_name'),
              minWidth: 100,
              // formatter:formatObj.formatType
            },

            {
              // sortable: true,
              field: 'lastLoginTime',
              title: t('text.last_login_time'),
              minWidth: 100,
              formatter: 'formatDateTime',
            },
            {
              // sortable: true,
              field: 'prohibited',
              title: t('text.account_status'),
              minWidth: 100,
              formatter: 'formatStatus',
            },

            {
              title: t('text.operation'),
              width: 250,
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
          roleId: props.roleInfo.roleId,
        },
        isShow: false,
        detailId: undefined,
        type: '',
        headerFormRef: null,
      })

      const { postStaffsSattus, resetPassword } = useData()
      onMounted(() => {
        getList()
      })
      function getButtons({ row }) {
        if (row.prohibited == false) {
          return [
            {
              name: t('text.reset_password'),
              type: 'reset',
            },

            {
              name: t('text.disable'),
              type: 'disable',
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
        } else {
          return [
            {
              name: t('text.reset_password'),
              type: 'reset',
            },

            {
              name: t('text.enable'),
              type: 'enable',
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
      }
      const btnClick = ({ type: btnType, row }) => {
        switch (btnType) {
          case 'edit':
            state.isShow = true
            state.type = btnType
            state.detailId = row.id
            break
          case 'reset':
            resetPassword({
              id: row.id,
              password: '111111',
            })
            break
          case 'disable':
            postStaffsSattus(
              {
                ids: [row.id],
                prohibited: true,
              },
              getList,
            )
            break
          case 'enable':
            postStaffsSattus(
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
      const getList = async () => {
        state.gridOptions.loading = true
        const [err, res] = await to(getStaffsList(state.form))
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
            deleteStaffsId(id).then(() => {
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
        handlePageChange,
      }
    },
  })
</script>

<style scoped></style>
