<template>
  <el-dialog
    width="700px"
    :title="$t('table.addSystemCandidates')"
    v-model="systemStudentDialogVisible"
    :close-on-click-modal="false"
    :before-close="handleCancel"
    center
    @closed="refreshData"
  >
    <VxeTable
      ref="xTable"
      row-id="userId_courseNumber"
      :data="stundetList"
      :loading="loading"
      :columns="tableColumns"
      :height="tableHeight"
      v-model:form="form"
      :checkbox-config="{ checkRowKeys: selectedRowKeys, highlight: true, reserve: true }"
      @checkbox="selectAllEvent"
      @handlePageChange="handleCurrentChange"
    >
      <template #pager v-if="builtinRole !== 'TRAINING_ADMIN'" />
      <template #form>
        <el-form ref="form" :model="form" inline size="medium">
          <el-form-item :label="$t('table.classNumber')" v-if="builtinRole !== 'TRAINING_ADMIN'">
            <el-select
              v-model="form.clazzId"
              :placeholder="$t('holder.pleaseSelect')"
              style="width: 200px"
              clearable
              filterable
            >
              <el-option
                :label="item.courseNumber"
                :value="item.id"
                v-for="item in classList"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input :placeholder="$t('holder.pleaseEnterName')" v-model="form.searchKey">
              <template #suffix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #department="{ row }">
        <div>
          {{
            row.department && row.department.superior
              ? row.department.superior.name + '-' + row.department.name
              : row.department && row.department.name
          }}
        </div>
      </template>
      <template #department2="{ row }">
        <div>
          {{
            row.clazz.department && row.clazz.department.superior
              ? row.clazz.department.superior.name + '-' + row.clazz.department.name
              : row.clazz.department && row.clazz.department.name
          }}
        </div>
      </template>
    </VxeTable>

    <template #footer>
      <el-button @click="handleCancel" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import { getClazzAllStudents, getClazzs, getClazzStudents } from '/@/api/ftm/teacher/teachingPlan'
  import { getEmployees } from '/@/api/ftm/teacher/account'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    name: 'systemStudents',
    components: { VxeTable, Search },
    props: ['systemStudentDialogVisible', 'tableData'],
    data() {
      return {
        stundetList: [],
        classList: [],
        records: [],
        selectedRowKeys: [],
        test: [],
        loading: false,
        form: {
          page: 1,
          size: 10,
          total: 0,
          prohibited: false,
          sort: undefined,
          order: 'asc',
          name: undefined,
          clazzId: undefined,
          searchKey: undefined,
          clazzStatus: 'TRAINING',
        },
        checkedStudents: [],
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
      tableHeight() {
        return window.innerHeight * 0.532
      },
      tableColumns() {
        return [
          { type: 'checkbox', width: 40 },
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.name'), minWidth: 120 },
          this.builtinRole == 'TRAINING_ADMIN'
            ? { field: 'gender', title: this.$t('table.gender'), width: 60 }
            : null,
          this.builtinRole == 'TRAINING_ADMIN'
            ? {
                field: 'department',
                title: this.$t('table.department'),
                slots: { default: 'department' },
                width: 90,
              }
            : null,
          this.builtinRole == 'TRAINING_ADMIN'
            ? { field: 'role.name', title: this.$t('table.teacherType'), minWidth: 90 }
            : null,
          this.builtinRole !== 'TRAINING_ADMIN'
            ? { field: 'clazz.courseNumber', title: this.$t('table.courseNumber'), minWidth: 100 }
            : null,
          this.builtinRole !== 'TRAINING_ADMIN'
            ? { field: 'customer.name', title: this.$t('table.airlines'), minWidth: 120 }
            : null,
          this.builtinRole !== 'TRAINING_ADMIN'
            ? {
                field: 'department',
                title: this.$t('table.trainingDepartment'),
                slots: { default: 'department2' },
                width: 100,
              }
            : null,
          { field: 'phone', title: this.$t('table.cellPhoneNumber'), minWidth: 120 },
        ].filter((v) => Boolean(v))
      },
      teacherAdmin() {
        return this.userInfo.teacherAdmin
      },
      xTable() {
        return this.$refs.xTable.$refs.xTable
      },
    },
    watch: {
      systemStudentDialogVisible: {
        async handler(val) {
          if (val) {
            this.checkedStudents = this.tableData
            this.xTable?.reloadData(this.stundetList)
            this.xTable?.setCheckboxRow(this.tableData, true)
          }
        },
      },
    },
    mounted() {
      if (this.builtinRole !== 'TRAINING_ADMIN') {
        this.getClazzsAll()
      }
      this.getStudents()
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getStudents()
      },
      getClearAll() {
        this.xTable?.clearCheckboxRow()
        this.records = []
      },
      async getClazzsAll() {
        const data = {
          teacherId: this.userInfo.id,
          teacherUserId: this.userInfo.userId,
          statusIN: 'TRAINING',
          type: 'WET_LEASE',
          page: 1,
          size: 1000,
        }
        await getClazzs(data)
          .then((res) => {
            if (res.status == 200) {
              this.classList = res.data.content
            }
          })
          .catch(() => {})
      },
      async getStudents() {
        this.form.teacherUserId = this.userInfo.userId
        // this.form = deleteEmptyParams(this.form)
        this.loading = true
        let api, params
        if (this.builtinRole !== 'TRAINING_ADMIN') {
          if (this.form.clazzId) {
            this.form.id = this.form.clazzId
            params = this.form
            api = getClazzStudents
          } else {
            params = {
              id: this.userInfo.id,
              clazzStatusIN: 'NOT_STARTED,TRAINING',
              studentStatusIN: 'NOT_STARTED,NOT_GRADUATED',
              searchKey: this.form.searchKey,
            }
            api = getClazzAllStudents
          }
        } else {
          this.form.builtinRole = 'THEORY_TEACHER,FLIGHT_TEACHER'
          params = this.form
          api = getEmployees
        }
        let [err, res] = await to(api(params))
        this.loading = false
        if (!err && res.status == 200) {
          if (this.teacherAdmin == false) {
            this.stundetList = res.data.map((item) => ({
              ...item,
              userId_courseNumber: `${item.userId}_${item.clazz.courseNumber}`,
            }))
          } else {
            this.stundetList = res.data.content.map((item) => ({
              ...item,
              userId_courseNumber: item.userId,
            }))
            this.form.total = res.data.totalElements
          }
        }
      },
      handleCancel() {
        this.records = []
        this.$emit('handleCancel')
      },
      handleSave() {
        this.$emit('getStudentData', this.checkedStudents)
        this.records = []
      },
      selectAllEvent(data) {
        const { records } = data
        this.records = records
        this.changeCheckbox(data)
      },
      search() {
        this.form.page = 1
        this.getStudents()
      },
      // 初始化数据
      refreshData() {
        // this.form.searchKey = '';
        // this.form.page = 1;
        // this.form.size = 10;
        this.xTable?.clearCheckboxRow()
        this.xTable?.clearCheckboxReserve()
      },
      // 选择/不选
      changeCheckbox({ checked, records }) {
        if (checked) {
          // 增加
          records.forEach((item) => {
            if (
              this.checkedStudents.findIndex(
                (v) => v.userId_courseNumber == item.userId_courseNumber,
              ) > -1
            ) {
              // 已选 无操作
            } else {
              this.checkedStudents.push(item)
            }
          })
        } else {
          // 减少
          this.stundetList.forEach((item) => {
            if (
              this.checkedStudents.findIndex(
                (v) => v.userId_courseNumber == item.userId_courseNumber,
              ) > -1 &&
              records.findIndex((v) => v.userId_courseNumber == item.userId_courseNumber) == -1
            ) {
              this.checkedStudents.splice(
                this.checkedStudents.findIndex(
                  (v) => v.userId_courseNumber == item.userId_courseNumber,
                ),
                1,
              )
            }
          })
        }
      },
    },
  }
</script>

<style scoped></style>
