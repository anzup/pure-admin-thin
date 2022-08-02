<template>
  <el-dialog
    width="900px"
    center
    v-model="visible"
    :title="$t('table.connectedAccount')"
    :close-on-click-modal="false"
    @closed="fresh"
  >
    <div class="tag-box" v-if="accountList.length > 0">
      <span class="tag-label">{{ $t('table.connectedAccount') }}:</span>
      <div class="tag-content">
        <el-tag
          class="tag"
          v-for="tag in accountList"
          :key="tag.userId"
          :disable-transitions="true"
          closable
          effect="dark"
          @close="removeAccount(tag)"
        >
          {{ tag.name }}
        </el-tag>
      </div>
    </div>
    <el-tabs
      class="custom-tabs-box"
      type="border-card"
      v-model="tabActive"
      @tab-click="handleClickTab"
    >
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.id + ''"
      />
      <VxeTable
        :height="null"
        min-height="300px"
        max-height="500px"
        :checkbox-config="{ showHeader: false, checkMethod: checkValidate }"
        :data="tableData"
        :loading="loading"
        :columns="tableColumns"
        @checkbox="handleCheckbox"
      >
        <template #form>
          <!-- <el-form inline size="small">
              <el-form-item>
                  <el-input :placeholder="$t('holder.pleaseEnterName')" suffix-icon="el-icon-search" v-model="searchKey"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button @click="getEmployees(tabActive)" type="primary">{{$t('button.query')}}</el-button>
              </el-form-item>
          </el-form> -->
        </template>
        <template #pager />
      </VxeTable>
    </el-tabs>
    <template #footer>
      <el-button type="primary" plain @click="visible = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="submit" :loading="submitLoading">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import {
    getAccountAssociationsByEmployeeId,
    putAccountAssociations,
    postAccountAssociations,
  } from '/@/api/ftm/teacher/accountAssociations'
  import { getEmployees } from '/@/api/ftm/teacher/account'
  import XEUtils from 'xe-utils'
  export default {
    components: { VxeTable },
    data() {
      return {
        tabActive: '0',
        loading: false,
        submitLoading: false,
        searchKey: '',
        tableData: [],
        tableColumns: [
          { type: 'checkbox', title: this.$t('button.select'), width: 80 },
          {
            title: this.$t('table.userName'),
            minWidth: 120,
            field: 'name',
            filters: [{ data: null }],
            filterRender: { name: 'FilterSearchKey' },
          },
          { title: this.$t('table.username'), minWidth: 120, field: 'username' },
        ],
        accountList: [],
        originAccounts: [],
        employeeInfo: {},
      }
    },
    props: {
      show: Boolean,
      form: Object,
    },
    inject: ['roles'],
    computed: {
      visible: {
        get() {
          return this.show
        },
        set(bool) {
          this.$emit('update:show', bool)
        },
      },
      tabList() {
        try {
          if (this.form.hasOwnProperty('roleId')) {
            return this.roles.list.filter((item) => item.id != this.form.roleId)
          } else {
            return this.roles.list
          }
        } catch (e) {
          return []
        }
      },
    },
    watch: {
      show(bool) {
        if (bool) {
          this.init()
        }
      },
    },
    methods: {
      async init() {
        let _roleId = this.tabList[0]['id']
        this.tabActive = _roleId + ''
        await this.getConnectedAccount()
        this.getEmployees(_roleId)
      },
      // 获取已关联账号
      async getConnectedAccount() {
        await getAccountAssociationsByEmployeeId({ employeeId: this.form.id })
          .then((res) => {
            if (res.status == 200) {
              let arr = res.data ? res.data.employees : []
              this.employeeInfo = res.data
              this.accountList = XEUtils.clone(
                arr.filter((v) => v.id != this.form.id),
                true,
              )
              this.originAccounts = XEUtils.clone(arr, true)
            }
          })
          .catch(() => {})
      },
      // 获取当前职位所有职员
      async getEmployees(id) {
        let params = {
          page: 1,
          size: 1000,
          roleId: id,
          searchKey: this.searchKey,
        }
        this.loading = true
        await getEmployees(params)
          .then((res) => {
            this.loading = false
            if (res.status == 200) {
              this.tableData = res.data.content
              let checked_list = res.data.content.filter((row) =>
                this.accountList.some((v) => v.id == row.id),
              )
              this.$refs.table.$refs.xTable.setCheckboxRow(checked_list, true)
            }
          })
          .catch(() => {
            this.loading = false
          })
      },
      handleClickTab({ name }) {
        this.searchKey = ''
        this.getEmployees(name)
      },
      handleCheckbox({ ids, records }) {
        let Item = records[0]
        if (ids.length > 0) {
          this.accountList.push(Item)
        } else {
          this.accountList = this.accountList.filter(
            (item) => !this.tableData.find((v) => v.id == item.id),
          )
        }
      },
      fresh() {
        this.searchKey = ''
        this.tableData = []
      },
      checkValidate({ row }) {
        return this.tableData.some((item) => !!this.accountList.find((v) => v.id == item.id))
          ? this.accountList.find((item) => item.id == row.id)
            ? true
            : false
          : true
      },
      removeAccount(item) {
        let row = this.tableData.find((v) => v.id == item.id)
        row && this.$refs.table.$refs.xTable.setCheckboxRow(row, false)
        this.accountList.findIndex((v) => item.id == v.id) > -1 &&
          this.accountList.splice(
            this.accountList.findIndex((v) => item.id == v.id),
            1,
          )
      },
      submit() {
        let Api, params
        if (this.originAccounts.length > 0) {
          Api = putAccountAssociations
          params = {
            id: this.employeeInfo.id,
            employeeIds: [...this.accountList.map((v) => v.id), this.form.id],
          }
        } else {
          Api = postAccountAssociations
          params = {
            employeeIds: [...this.accountList.map((v) => v.id), this.form.id],
          }
        }
        this.submitLoading = true
        Api(params)
          .then((res) => {
            this.submitLoading = false
            if (res.status == 200) {
              this.$message.success(this.$t('tip.editSuccessTip'))
              this.visible = false
              this.$emit('complate')
            }
          })
          .catch(() => {
            this.submitLoading = false
          })
      },
    },
  }
</script>

<style scoped lang="scss">
  .tag-box {
    display: flex;
    align-items: flex-start;
    .tag-label {
      white-space: nowrap;
      margin-right: 10px;
      line-height: 30px;
    }
    .tag {
      margin-bottom: 10px;
      margin-right: 10px;
    }
  }
  .custom-tabs-box {
    :deep(.el-tabs__content) {
      overflow: unset;
    }
  }
</style>
