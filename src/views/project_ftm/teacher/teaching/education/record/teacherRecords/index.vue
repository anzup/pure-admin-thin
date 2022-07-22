<template>
  <VxeTable
    :data="tableData"
    :columns="tableColumns"
    :loading="tableLoading"
    v-model:form="pagination"
    :toolbarConfig="tableTools"
    :buttons="tableButtons"
    @checkbox="checkboxAll"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form inline size="medium">
        <!-- 部门 -->
        <el-form-item :label="$t('table.department')">
          <el-select
            v-model="form.departmentId"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in departmentsAll"
              :key="item.index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 学年 -->
        <!-- <el-form-item :label="$t('table.schoolYear')">
              <el-date-picker v-model="form.schoolYear" type="year" :placeholder="$t('common.all')" value-format="yyyy" :editable="false"
                  :picker-options="pickerOptions" @change="dateChange" />
          </el-form-item> -->
        <!-- 教员类型 -->
        <el-form-item :label="$t('table.teacherType')">
          <el-select v-model="form.builtinRole" :placeholder="$t('common.all')" clearable>
            <el-option
              :label="item.name"
              :value="item.key"
              v-for="item in teacherList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseEnterTeachersNameAndQueryKey')"
            suffix-icon="el-icon-search"
            v-model.trim="form.searchKey"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getEmployeesId, getEmployees, getDepartmentsAll } from '/@/api/ftm/teacher/account'
  import { airlinesMenu } from '/@/api/ftm/teacher/studentTraining'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import XEUtils from 'xe-utils'
  import moment from 'moment'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { VxeTable },
    data() {
      return {
        form: {
          searchKey: '',
          airlines: undefined,
          airlinesArr: [],
          schoolYear: undefined,
          className: undefined,
          classNameArr: [],
          graduation: undefined,
        },
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: 40 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'name', title: this.$t('table.name'), minWidth: 120 },
          {
            field: 'gender',
            title: this.$t('table.gender'),
            minWidth: 60,
            formatter: this.genderFormatter,
          },
          { field: 'phone', title: this.$t('table.cellPhoneNumber'), minWidth: 120 },
          { field: 'idNumber', title: this.$t('table.idNumber'), minWidth: 150 },
          {
            field: 'departments[0].name',
            title: this.$t('table.belongToDepartment'),
            minWidth: 100,
          },
          { field: 'role.name', title: this.$t('table.teacherType'), minWidth: 70 },
          { title: this.$t('table.tableEdit'), width: 100, slots: { default: 'operate' } },
        ],
        tableLoading: false,
        pagination: {
          // 表格分页信息
          page: 1,
          size: 10,
          total: 0,
        },
        pickerOptions: {
          disabledDate: this.disabledDate,
        },
        teacherList: [
          {
            key: 'FLIGHT_TEACHER',
            name: this.$t('table.flightInstructor'),
          },
          {
            key: 'THEORY_TEACHER',
            name: this.$t('table.theoryTeacher'),
          },
        ],
        departmentsAll: [],
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
    },
    created() {
      airlinesMenu().then((res) => {
        this.form.airlinesArr = res.data
      })
      this.form.schoolYear = moment().format('YYYY')
      this.getClazzs()
      this.getDepartmentsAll()
      if (this.builtinRole == 'CUSTOMER_CONTACTOR') {
        this.getCustomer(this.userInfo.id, this.getData)
      } else {
        this.getData()
      }
    },
    methods: {
      getDepartmentsAll() {
        getDepartmentsAll().then((res) => {
          if (res.status == 200) {
            this.departmentsAll = res.data
          }
        })
      },
      dateChange() {
        this.form.className = undefined
        this.getClazzs()
      },
      getClazzs() {
        getClazzs({
          page: 1,
          size: 1000,
          type: 'WET_LEASE',
          year: this.form.schoolYear,
        }).then((res) => {
          this.form.classNameArr = res.data.content
        })
      },
      disabledDate(val) {
        return moment(val).valueOf() > moment().add(1, 'year').valueOf()
      },
      // 获取公司id
      async getCustomer(id, cb) {
        let [err, res] = await to(getEmployeesId({ id }))
        if (!err) {
          this.form.airlines = res.data.customer.id
          cb && cb()
        }
      },
      // 获取学员列表
      getData() {
        const param = {
          page: this.pagination.page,
          size: this.pagination.size,
          searchKey: this.form.searchKey ? this.form.searchKey : undefined,
          year: this.form.schoolYear,
          departmentId: this.form.departmentId,
          builtinRole: this.form.builtinRole,
        }
        this.tableLoading = true
        getEmployees(param)
          .then((res) => {
            let data = res.data
            this.tableData = data.content
            this.pagination.total = data.totalElements
            this.tableLoading = false
          })
          .catch((e) => {
            this.tableLoading = false
          })
      },
      // 格式化日期
      dateTimeFormatter({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      // 格式化性别
      genderFormatter({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      checkboxOne() {},
      checkboxAll() {},
      toPage(row, name) {
        this.$router.push({
          name,
          query: {
            id: row.id,
          },
        })
      },
      search() {
        this.pagination.page = 1
        this.pagination.total = 0
        this.getData()
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            event: () => {
              this.toPage(row, 'TeachingEducationRecordTeacherDetail')
            },
          },
        ]
      },
    },
  }
</script>
