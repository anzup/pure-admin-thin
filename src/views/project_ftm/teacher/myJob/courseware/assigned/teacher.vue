<template>
  <div class="container">
    <VxeTable
      ref="xTable"
      :data="tableData"
      :loading="loading"
      :columns="tableColumns"
      v-model:from="form"
      :toolbarConfig="tableTools"
      @checkbox="selectAllEvent"
      @handlePageChange="handleCurrentChange"
    >
      <template #form>
        <el-form ref="form" :model="form" inline size="medium">
          <el-form-item :label="$t('table.belongToDepartment')">
            <el-select
              v-model="departmentParentId"
              style="width: 140px"
              @change="departmentChange"
              :placeholder="$t('holder.pleaseSelect')"
              clearable
            >
              <el-option
                v-for="item in departmentsAll"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select
              v-model="departmentId"
              style="width: 140px; margin-left: 20px"
              :placeholder="$t('holder.pleaseSelect')"
              clearable
            >
              <el-option
                v-for="item in departmentsAll1"
                :key="item.index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getEmployees">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #right_tools>
        <el-button type="primary" size="mini" :disabled="records.length == 0" @click="assignment">{{
          $t('button.confirmAssignment')
        }}</el-button>
      </template>

      <template #department="{ row }">
        <span>{{
          row.departments
            .map((item) => (item.superior ? item.superior.name + '-' + item.name : item.name))
            .join(', ')
        }}</span>
      </template>
    </VxeTable>

    <vxe-modal v-model="assignmentFlag" width="400" show-footer>
      <template v-slot:title>
        <span>{{ $t('table.CourseAssignment') }}</span>
      </template>
      <template v-slot:footer>
        <vxe-button type="submit" status="primary" @click="handelSave">{{
          $t('button.submit')
        }}</vxe-button>
      </template>
      <template v-slot>
        <el-form :model="assignmentForm" ref="assignmentForm">
          <el-form-item
            prop="endDate"
            :label="$t('tip.AssignedReadingPeriod')"
            :rules="[
              {
                required: true,
                message: $t('holder.pleaseEnter') + $t('tip.AssignedReadingPeriod'),
                trigger: 'blur',
              },
            ]"
          >
            <el-date-picker
              v-model="assignmentForm.endDate"
              type="date"
              :placeholder="$t('holder.pleaseSelectDate')"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1"
            />
          </el-form-item>
        </el-form>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import { getEmployees, getDepartments } from '/@/api/ftm/teacher/account'
  import { postCoursewareAssignments } from '/@/api/ftm/teacher/courseware'
  import to from 'await-to-js'
  export default {
    name: 'coursewareTeacher',
    data() {
      return {
        form: {
          page: 1,
          size: 10,
          total: 1,
          clazzId: undefined,
          builtinRole: 'THEORY_TEACHER,FLIGHT_TEACHER',
          departmentId: undefined,
        },
        departmentId: undefined,
        departmentParentId: undefined,
        departmentForm: {
          superiorId: undefined,
          name: undefined,
          level: 0,
          page: 1,
          size: 10000,
        },
        assignmentForm: {
          assigneeType: 'TEACHER',
          coursewareIds: [],
          endDate: '',
          assignees: [],
        },
        departmentsAll: [],
        departmentsAll1: [],
        records: [],
        loading: false,
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: '40' },
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.name'), width: 140 },
          {
            field: 'gender',
            title: this.$t('table.gender'),
            formatter: this.formatGender,
            width: 90,
          },
          { field: 'phone', title: this.$t('table.cellPhoneNumber'), width: 120 },
          { title: this.$t('table.department'), slots: { default: 'department' }, minWidth: 120 },
          { field: 'role.name', title: this.$t('table.job'), minWidth: 100 },
        ],
        assignmentFlag: false,
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now()
          },
        },
      }
    },
    components: {
      selectedView,
      VxeTable,
    },
    created() {
      let { ids } = this.$route.query
      this.assignmentForm.coursewareIds = ids ? ids.split(',') : []
      // this.assignmentForm.coursewareIds = JSON.parse(sessionStorage.getItem("ids"))
      this.getEmployees()
      this.getDepartments()
    },
    methods: {
      selectAllEvent({ records }) {
        this.records = records
      },
      getClearAll() {
        this.$refs.xTable.clearSelectEvent()
        this.records = []
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getEmployees()
      },
      async getEmployees() {
        if (!this.departmentId) {
          this.form.departmentId = this.departmentParentId
        } else {
          this.form.departmentId = this.departmentId
        }
        this.loading = true
        let [err, res] = await to(getEmployees(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      getDepartments() {
        getDepartments(this.departmentForm).then((res) => {
          if (res.status == 200) {
            this.departmentsAll = res.data.content
          }
        })
      },
      departmentChange(val) {
        this.departmentForm.superiorId = val
        this.departmentForm.level = undefined
        getDepartments(this.departmentForm).then((res) => {
          if (res.status == 200) {
            this.departmentsAll1 = res.data.content
            this.departmentId = ''
            this.departmentForm.level = 0
          }
        })
      },
      assignment() {
        // 指派
        this.assignmentFlag = true
      },
      handelSave() {
        this.assignmentForm.assignees = []
        this.$refs['assignmentForm'].validate((valid) => {
          if (valid) {
            this.records.forEach((v) => {
              this.assignmentForm.assignees.push({
                departmentName:
                  v.department && v.department.superior
                    ? v.department.superior.name + '-' + v.department.name
                    : v.department && v.department.name,
                gender: v.gender,
                name: v.name,
                phone: v.phone,
                userId: v.userId,
              })
            })
            postCoursewareAssignments(this.assignmentForm).then((res) => {
              if (res.status == 200) {
                this.assignmentFlag = false
                this.$router.go(-1)
                this.$message.success(this.$t('tip.assignmentAddsuccessTip'))
              }
            })
          }
        })
      },
      formatGender({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
    },
  }
</script>

<style scoped lang="scss"></style>
