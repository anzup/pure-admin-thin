<template>
  <el-scrollbar>
    <vxe-table
      border
      size="medium"
      class="mytable-style"
      header-cell-class-name="headerCellClassName"
      row-class-name="rowClassName"
      align="center"
      :loading="loading"
      :data="tableData"
      :span-method="rowspanMethod"
    >
      <vxe-table-column
        field="name1"
        :title="$t('table.firstLevelPermission')"
        width="200px"
      /><!-- 一级功能 -->
      <vxe-table-column
        field="name2"
        :title="$t('table.secondLevelPermission')"
        width="200px"
      /><!-- 二级功能 -->
      <vxe-table-column
        field="name3"
        :title="$t('table.thirdLevelPermission')"
        width="200px"
      /><!-- 三级功能 -->
      <vxe-table-column :title="$t('table.permissionAuth')" min-width="200px">
        <!-- 功能权限 -->
        <template v-slot="{ row }">
          <el-radio-group v-model="row.authorized">
            <el-radio :label="true">{{ $t('common.show') }}</el-radio>
            <el-radio :label="false">{{ $t('common.hide') }}</el-radio>
          </el-radio-group>
        </template>
      </vxe-table-column>
      <vxe-table-column :title="$t('table.handleAuth')" min-width="250px">
        <!-- 操作权限 -->
        <template v-slot="{ row }">
          <el-checkbox
            v-for="auth in row.promission || []"
            :key="auth.authCode"
            :label="auth.authCode"
            :disabled="!row.authorized"
            v-model="auth.authorized"
          >
            {{ auth.name.substr(auth.name.indexOf(':') + 1) }}
          </el-checkbox>
        </template>
      </vxe-table-column>
    </vxe-table>

    <fix-footer :loading="loadingBtn" @confirm="Save">
      <el-button slot="left" @click="Reset">{{ $t('button.reset') }}</el-button>
    </fix-footer>
  </el-scrollbar>
</template>

<script>
  import { getAuthConfig, getEmployeeConfig, setEmployeeConfig } from '/@/api/ftm/teacher/account'
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  export default {
    components: { FixFooter },
    data() {
      return {
        form: {},
        loading: false,
        loadingBtn: false,
        tableData: [],
        allAuth: [], // 原职位所有权限
        editAuth: [], // 筛选后的操作权限
        origin: [], // 原始数据
        promission: [], // 四级操作，单独存放，节省提交时再一次遍历查找操作
      }
    },
    mounted() {
      this.getAuth()
    },
    computed: {
      id() {
        return this.$route.query.id
      },
    },
    methods: {
      // 获取当前职员的职位权限
      async getAuth() {
        let { roleId } = this.$route.query
        this.loading = true
        // 职位权限
        let [err, res] = await to(getAuthConfig({ id: roleId }))
        if (!err) {
          this.allAuth = JSON.parse(JSON.stringify(res.data))
        } else {
          return
        }
        // 职员权限
        let [err2, res2] = await to(getEmployeeConfig({ id: this.id }))
        if (!err2) {
          let roles = res.data
          let employees = res2.data
          // 合并当前职员的权限
          let authArr = roles.map((item) => {
            let _employee = employees.find((v) => v.authCode == item.authCode)
            if (_employee) {
              return _employee
            }
            return item
          })
          this.origin = authArr.concat()
          let tree = XEUtils.toArrayTree(authArr, {
            key: 'authCode',
            parentKey: 'superiorAuthCode',
          })
          let arr = this.toColTreeData(tree)
          this.tableData = arr

          // 筛选出当前添加的权限
          this.editAuth = res2.data.map((item) => ({
            authCode: item.authCode,
            authorized: item.authorized,
          }))
        }
        this.loading = false
      },
      // 将普通树结构转换为横向树列表
      toColTreeData(treeData) {
        const list = []
        const keyMap = {}
        XEUtils.eachTree(treeData, (item, index, result, paths, parent) => {
          keyMap[item.authCode] = item
          item.keys = parent ? parent.keys.concat([item.authCode]) : [item.authCode]
          if (
            (item.children.length > 0 &&
              item.superiorAuthCode &&
              item.children.some((child) => child.authCode.includes(':'))) ||
            (!item.authCode.includes(':') && !item.children.length)
          ) {
            const row = XEUtils.clone(item, true)
            item.keys.forEach((key, index) => {
              const level = index + 1
              const obj = keyMap[key]
              row[`name${level}`] = obj.name
            })
            list.push(row)
          } else if (item.authCode.includes(':')) {
            list.forEach((v) => {
              if (item.superiorAuthCode == v.authCode) {
                this.promission.push(item)
                v.promission = Array.isArray(v.promission) ? v.promission.concat([item]) : [item]
              }
            })
          }
        })
        return list
      },
      // 循环判断父节点的选择状态
      toFormatData() {
        // 将所有非叶子节点改为未选
        let cover = this.origin.map((p) => {
          let same = this.tableData.find((c) => c.authCode == p.authCode)
          let child = this.tableData.find(
            (c) => c.superiorAuthCode == p.authCode && !c.authCode.includes(':'),
          )
          if (!child && same) {
            return XEUtils.clone(same, true)
          } else {
            p.authorized = false
            return p
          }
        })
        // 在循环时叶节点选中，将向上改为选中
        cover.forEach((item) => {
          if (item.authCode.includes(':')) {
            item.authorized =
              cover
                .find((v) => item.superiorAuthCode == v.authCode)
                .promission.find((v) => v.authCode == item.authCode).authorized || false
          } else if (item.authorized) {
            let parent = cover.find((v) => v.authCode == item.superiorAuthCode)
            while (parent) {
              parent.authorized = true
              parent = cover.find((v) => v.authCode == parent.superiorAuthCode)
            }
          }
        })
        return cover.map((v) => ({
          authCode: v.authCode,
          authorized: v.authorized,
        }))
      },
      // 通用行合并函数（将相同多列数据合并为一行）
      rowspanMethod({ row, _rowIndex, column, visibleData }) {
        const fields = ['name1', 'name2', 'name3']
        const cellValue = row[column.property]
        if (cellValue && fields.includes(column.property)) {
          const prevRow = visibleData[_rowIndex - 1]
          let nextRow = visibleData[_rowIndex + 1]
          if (prevRow && prevRow[column.property] === cellValue) {
            return { rowspan: 0, colspan: 0 }
          } else {
            let countRowspan = 1
            while (nextRow && nextRow[column.property] === cellValue) {
              nextRow = visibleData[++countRowspan + _rowIndex]
            }
            if (countRowspan > 1) {
              return { rowspan: countRowspan, colspan: 1 }
            }
          }
        }
      },
      async Save() {
        let list = this.toFormatData()
        let auth_list = this.allAuth
        // 筛选出当前职员的权限与职员所属职位的权限不同
        let filter = list
          .filter((item) => {
            let auth = auth_list.find((v) => v.authCode == item.authCode)
            return auth ? item.authorized != auth.authorized : true
          })
          .map((item) => ({
            authCode: item.authCode,
            authorized: item.authorized,
          }))
        this.loadingBtn = true
        let [err, res] = await to(setEmployeeConfig({ id: this.id, data: filter }))
        this.loadingBtn = false
        if (!err) {
          this.$message.success(this.$t('tip.setsuccessTip'))
          this.$router.back()
        }
      },
      // 重置请求
      async Reset() {
        this.$confirm(this.$t('tip.thisOperationWillResetData'), this.$t('tip.tip'), {
          type: 'warning',
        })
          .then(async () => {
            this.loadingBtn = true
            let [err] = await to(setEmployeeConfig({ id: this.id, data: [] }))
            this.loadingBtn = false
            if (!err) {
              this.$message.success(this.$t('tip.updateSucceeded'))
              this.getAuth()
            }
          })
          .catch()
      },
    },
  }
</script>
