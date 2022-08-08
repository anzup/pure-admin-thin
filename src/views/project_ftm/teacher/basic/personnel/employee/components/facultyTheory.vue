<template>
  <VxeTable
    ref="xTable"
    :data="tableData"
    :key="id"
    :loading="loading"
    :columns="tableColumns"
    v-model:form="form"
    :toolbar-config="tableTool"
    :buttons="tableButtons"
    @checkbox="selectChangeEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form ref="form" :model="form" inline size="medium">
        <!-- 执教机型 暂时未做 -->
        <!-- <el-form-item :label="$t('table.teachingModel')">
            <el-select v-model="airplaneType" :placeholder="$t('holder.pleaseSelect')" style="width:140px" clearable>
              <el-option :label="item" :value="item" v-for="item in airplaneTypesAll" :key="item.index"></el-option>
            </el-select>
          </el-form-item> -->
        <el-form-item :label="$t('table.accountStatus')">
          <el-select
            v-model="form.prohibited"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 160px"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in prohibitedList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseEnterName')"
            v-model="form.searchKey"
            style="width: 280px"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #right_tools>
      <div class="btnBox">
        <el-button
          v-if="containsPermissions(menuName + ':ADD')"
          size="mini"
          type="primary"
          @click="add"
          >{{ $t('button.add') }}</el-button
        >
        <el-button
          v-if="containsPermissions(menuName + ':BULK_DISABLED')"
          size="mini"
          type="primary"
          :disabled="records.length == 0"
          @click="postEmployeesProhibit(records, false)"
          >{{ $t('button.batchDisable') }}</el-button
        >
        <el-button
          v-if="containsPermissions(menuName + ':BULK_DELETION')"
          size="mini"
          type="danger"
          :disabled="records.length == 0"
          @click="postEmployeesBatchDelete"
          >{{ $t('button.batchDeletion') }}</el-button
        >
      </div>
    </template>

    <template #department="{ row }">
      <span v-show="builtinRole !== 'CUSTOMER_CONTACTOR'">{{
        row.departments instanceof Array ? row.departments.map((v) => v.name).join(',') : ''
      }}</span>
    </template>
  </VxeTable>

  <!-- 关联帐号 -->
  <ConnectAccountDialog v-model:show="showConnectAccountDialog" :form="connectAccountForm" />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import {
    getEmployees,
    putEmployeesIdPassword,
    deleteEmployeesId,
    postEmployeesProhibit,
    postEmployeesBatchDelete,
  } from '/@/api/ftm/teacher/account'
  import { getAirplaneTypesAll } from '/@/api/ftm/teacher/trainingPlan'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import ConnectAccountDialog from './connectAccountDialog.vue'
  import { deleteEmptyParams } from '/@/utils/index'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    name: '',
    props: ['id', 'builtinRole'],
    data() {
      return {
        menuName: 'EMPLOYEE',
        form: {
          name: undefined,
          page: 1,
          size: 10,
          total: 0,
          sort: 'createdDate',
          order: 'desc',
          roleId: undefined,
          prohibited: undefined,
          searchKey: undefined,
        },
        airplaneType: undefined,
        records: [],
        loading: false,
        tableData: [],
        tableTool: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        airplaneTypesAll: [],
        prohibitedList: [
          { id: undefined, name: this.$t('common.all') },
          { id: false, name: this.$t('common.normal') },
          { id: true, name: this.$t('common.disable') },
        ],
        showConnectAccountDialog: false,
        connectAccountForm: {},
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      totalAuthorities() {
        return this.userInfo.totalAuthorities
      },
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
      tableColumns() {
        return [
          { type: 'checkbox', width: '40' },
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.name'), minWidth: 90 },
          {
            field: 'gender',
            title: this.$t('table.gender'),
            formatter: this.formatGender,
            width: 80,
          },
          { field: 'phone', title: this.$t('table.contactMobilePhone'), minWidth: 120 },
          this.builtinRole !== 'CUSTOMER_CONTACTOR'
            ? {
                field: 'department',
                title: this.$t('table.department'),
                width: 200,
                slots: { default: 'department' },
              }
            : false,
          this.builtinRole == 'CUSTOMER_CONTACTOR'
            ? { field: 'customer.name', title: this.$t('table.customerName'), minWidth: 120 }
            : false,
          { field: 'username', title: this.$t('table.loginName'), minWidth: 120 },
          {
            field: 'createdDate',
            title: this.$t('table.addTime'),
            formatter: this.formatDate,
            width: 200,
          },
          {
            field: 'lastLoginTime',
            title: this.$t('table.lastLoginTime'),
            formatter: this.formatDate,
            width: 200,
          },
          {
            field: 'prohibited',
            title: this.$t('table.accountStatus'),
            formatter: this.formatProhibited,
            width: 100,
          },
          { title: this.$t('table.tableEdit'), width: 420, slots: { default: 'operate' } },
        ].filter((v) => Boolean(v))
      },
    },
    created() {
      this.getAirplaneTypesAll()
    },
    // TODO 原缓存页面执行activated
    mounted() {
      this.form.roleId = this.id
      this.refresh()
      this.getEmployees()
    },
    watch: {
      id(val) {
        this.form.roleId = Number(val)
        this.refresh()
        this.getEmployees()
      },
    },
    components: { selectedView, ConnectAccountDialog, VxeTable, Search },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      selectChangeEvent({ records }) {
        this.records = XEUtils.map(records, (item) => item.id)
      },
      getClearAll() {
        this.xTable.clearSelectEvent()
        this.records = []
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getEmployees()
      },
      add() {
        this.routerGo(
          `employee/add?id=${this.form.roleId}&status=add&builtinRole=${this.builtinRole}`,
        )
      },
      async getEmployees() {
        this.loading = true
        this.form = deleteEmptyParams(this.form)
        let [err, res] = await to(getEmployees(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.total = res.data.totalElements
          this.getClearAll()
        }
      },
      putEmployeesIdPassword(id) {
        putEmployeesIdPassword({ id: id, password: '111111' }).then((res) => {
          if (res.status == 200) {
            this.$message.success(this.$t('holder.passwordResetSuccessful'))
          }
        })
      },
      postEmployeesProhibit(id, prohibited) {
        postEmployeesProhibit({ ids: id, prohibited: !prohibited }).then((res) => {
          if (res.status == 200) {
            this.$message.success(this.$t('tip.setsuccessTip'))
            this.getEmployees()
          }
        })
      },
      deleteEmployeesId(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteEmployeesId({ id: id }).then((res) => {
            if (res.status == 200) {
              if (
                parseInt(this.form.total / this.form.size) < this.form.page &&
                this.form.page !== 1
              ) {
                this.form.page = parseInt(this.form.total / this.form.size)
              }
              this.getEmployees()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      modify(id, roleId) {
        this.routerGo(
          `employee/add?id=${id || ''}&roleId=${roleId || ''}&status=modify&builtinRole=${
            this.builtinRole
          }`,
        )
      },
      connectAccount(id, roleId) {
        this.showConnectAccountDialog = true
        this.connectAccountForm = {
          id,
          roleId,
        }
      },
      details(id) {
        this.routerGo(`employee/details?id=${id}&builtinRole=${this.builtinRole}`)
      },
      getAirplaneTypesAll() {
        getAirplaneTypesAll().then((res) => {
          if (res.status == 200) {
            this.airplaneTypesAll = res.data
          }
        })
      },
      postEmployeesBatchDelete() {
        postEmployeesBatchDelete({
          ids: this.records,
        }).then((res) => {
          if (res.status == 200) {
            this.getEmployees()
            this.$message.success(this.$t('tip.delsuccessTip'))
          }
        })
      },
      formatGender({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatProhibited({ cellValue }) {
        return cellValue ? this.$t('button.disable') : this.$t('button.normal')
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getEmployees()
      },
      refresh() {
        this.form.page = 1
        this.form.size = 10
        this.form.total = 0
        this.records = []
        this.form.searchKey = ''
        this.form.prohibited = undefined
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.resetPassword'),
            visible: this.totalAuthorities.includes(this.menuName + ':RESET_PASSWORD'),
            event: () => {
              this.putEmployeesIdPassword(row.id)
            },
          },
          {
            name: row.prohibited ? this.$t('button.enable') : this.$t('button.disable'),
            visible: this.totalAuthorities.includes(this.menuName + ':DISABLE'),
            event: () => {
              this.postEmployeesProhibit([row.id], row.prohibited)
            },
          },
          {
            name: this.$t('button.details'),
            visible: this.totalAuthorities.includes(this.menuName + ':DETAIL'),
            event: () => {
              this.details(row.id)
            },
          },
          {
            name: this.$t('button.modify'),
            visible: this.totalAuthorities.includes(this.menuName + ':UPDATE'),
            event: () => {
              this.modify(row.id, row.role?.id)
            },
          },
          // {
          //   name: this.$t('button.ConnectAccount'),
          //   event: () => {
          //     this.connectAccount(row.id, row.role.id)
          //   },
          // },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: this.totalAuthorities.includes(this.menuName + ':DELETE'),
            event: () => {
              this.deleteEmployeesId(row.id)
            },
          },
        ]
      },
    },
  }
</script>
