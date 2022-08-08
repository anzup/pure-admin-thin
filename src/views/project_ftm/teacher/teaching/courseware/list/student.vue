<template>
  <div>
    <VxeTable
      ref="xTable"
      :data="tableData"
      :loading="loading"
      :columns="tableColumns"
      :toolbarConfig="tableTools"
      @checkbox="selectAllEvent"
      @handlePageChange="handleCurrentChange"
    >
      <template #pager />
      <template #form>
        <el-form ref="form" :model="form" inline size="medium">
          <el-form-item :label="$t('table.classNumber')">
            <el-select
              v-model="form.clazzId"
              :placeholder="$t('holder.pleaseSelect')"
              style="width: 200px"
              filterable
              clearable
            >
              <el-option
                :label="item.courseNumber"
                :value="item.id"
                v-for="item in classList"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item :label="$t('table.groupName')">
            <el-select v-model="form.groupingId" :placeholder="$t('holder.pleaseSelect')" style="width: 200px" clearable>
              <el-option :label="item.name" :value="item.id" v-for="item in groupList" :key="item.index"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-input
              :placeholder="$t('holder.pleaseEnter') + $t('table.studentName')"
              clearable
              v-model="form.searchKey"
            >
              <template #suffix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchEvent">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #right_tools>
        <el-button size="mini" type="primary" :disabled="records.length == 0" @click="assignment">{{
          $t('button.confirmAssignment')
        }}</el-button>
      </template>
    </VxeTable>

    <el-dialog
      v-model="assignmentFlag"
      width="400px"
      center
      :title="$t('table.CourseAssignment')"
      :before-close="beforeHideMethod"
      @closed="refreshEvent"
    >
      <el-form :model="assignmentForm" ref="assignmentForm" label-width="120px">
        <el-form-item
          prop="endDate"
          :label="$t('tip.AssignedReadingPeriod')"
          :rules="[
            { required: true, message: $t('holder.pleaseEnterReadingPeriod'), trigger: 'blur' },
          ]"
        >
          <el-date-picker
            v-model="assignmentForm.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            :placeholder="$t('holder.pleaseSelectDate')"
            :disabled-date="pickerOptions1.disabledDate"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" plain @click="handleCancel">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handelSave">{{ $t('button.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import {
    getClazzs,
    getGroupings,
    getClazzStudents,
    getClazzAllStudents,
  } from '/@/api/ftm/teacher/teachingPlan'
  import { postCoursewareAssignments } from '/@/api/ftm/teacher/courseware'
  import to from 'await-to-js'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()

  export default {
    name: 'coursewareTeacher',
    data() {
      return {
        form: {
          page: 1,
          size: 1000,
          clazzId: undefined,
          groupingId: undefined,
          prohibited: false,
          teacherUserId: undefined,
          searchKey: undefined,
        },
        searchedForm: {},
        groupForm: {
          page: 1,
          size: 1000,
          clazzId: undefined,
        },
        assignmentForm: {
          assigneeType: 'STUDENT',
          coursewareIds: [],
          endDate: '',
          assignees: [],
        },
        loading: false,
        records: [],
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: 40 },
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.studentName'), minWidth: 100 },
          { field: 'clazz.courseNumber', title: this.$t('table.classNumber'), minWidth: 120 },
          { field: 'grouping.name', title: this.$t('table.groupName'), minWidth: 90 },
          { field: 'customer.name', title: this.$t('table.airlines'), minWidth: 90 },
          { field: 'clazz.department.name', title: this.$t('table.department'), minWidth: 90 },
          { field: 'phone', title: this.$t('table.cellPhoneNumber'), minWidth: 120 },
        ],
        assignmentFlag: false,
        classList: [],
        groupList: [],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < Date.now()
          },
        },
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
    },
    components: { selectedView, VxeTable, Search },
    created() {
      let { ids } = this.$route.query
      this.assignmentForm.coursewareIds = ids ? ids.split(',') : []
      // JSON.parse(sessionStorage.getItem("ids"))
      this.getClazzsAll()
      let teacherId = sessionStorage.getItem('userId')
      this.form.teacherUserId = teacherId
      this.getStudents()
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
        this.getStudents()
      },
      getClazzsAll() {
        getClazzs({
          statusIN: 'TRAINING',
          teacherId: this.userInfo.id,
          size: 1000,
        }).then((res) => {
          if (res.status == 200) {
            this.classList = res.data.content
          }
        })
      },
      getGroupings() {
        this.groupForm.clazzId = JSON.parse(JSON.stringify(this.form.clazzId))
        this.form.groupingId = ''
        this.groupList = []
        getGroupings(this.groupForm).then((res) => {
          if (res.status == 200) {
            this.groupList = res.data.content
          }
        })
      },
      async getStudents() {
        this.loading = true
        this.tableData = []
        this.form.id = this.form.clazzId
        this.form.clazzId = this.form.clazzId || undefined
        let api = this.form.clazzId ? getClazzStudents : getClazzAllStudents
        let params = this.form.clazzId
          ? {
              teacherId: this.userInfo.id,
              statusIN: 'NOT_STARTED,NOT_GRADUATED',
              ...this.form,
            }
          : {
              id: this.userInfo.id,
              clazzStatusIN: 'NOT_STARTED,TRAINING',
              studentStatusIN: 'NOT_STARTED,NOT_GRADUATED',
              searchKey: this.form.searchKey,
            }
        let [err, res] = await to(api(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data
        }
      },
      assignment() {
        // 指派
        this.assignmentFlag = true
      },
      beforeHideMethod() {
        this.assignmentFlag = false
      },
      handelSave() {
        this.assignmentForm.assignees = []
        this.$refs['assignmentForm'].validate((valid) => {
          if (valid) {
            this.tableData
              .filter((v) => this.records.map((v) => v.id).includes(v.id))
              .forEach((v) => {
                this.assignmentForm.assignees.push({
                  courseNumber: v.clazz.courseNumber,
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
            let endDate = new Date(this.assignmentForm.endDate)
            endDate.setHours(23)
            endDate.setMinutes(59)
            endDate.setSeconds(59)
            this.assignmentForm.endDate = endDate
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
      handleCancel() {
        this.assignmentFlag = false
      },
      searchEvent() {
        this.form.page = 1
        this.getStudents()
      },
      refreshEvent() {
        this.$refs.assignmentForm.resetFields()
      },
    },
  }
</script>

<style scoped lang="scss"></style>
