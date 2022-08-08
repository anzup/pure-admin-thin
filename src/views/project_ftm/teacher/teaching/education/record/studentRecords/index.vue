<template>
  <VxeTable
    :data="tableData"
    :columns="tableColumns"
    v-model:form="pagination"
    :toolbarConfig="tableTools"
    :loading="tableLoading"
    :buttons="tableButtons"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form inline size="medium">
        <el-form-item :label="$t('table.airlines')">
          <!-- 航空公司 -->
          <el-select
            :placeholder="$t('common.all')"
            :disabled="builtinRole == 'CUSTOMER_CONTACTOR'"
            v-model="form.airlines"
            clearable
          >
            <el-option
              v-for="(item, index) in form.airlinesArr"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('table.schoolYear')">
              <el-date-picker type="year" v-model="form.schoolYear" :placeholder="$t('common.all')" value-format="yyyy"
              :editable="false" :picker-options="pickerOptions" @change="dateChange" />
          </el-form-item> -->
        <!-- 班级课号 -->
        <!-- <el-form-item :label="$t('table.classNumber')">
              <el-select v-model="form.className" :placeholder="$t('common.all')">
                  <el-option :label="$t('common.all')" :value="undefined"></el-option>
                  <el-option v-for="(item, index) in form.classNameArr" :key="index" :label="item.courseNumber" :value="item.id"/>
              </el-select>
          </el-form-item> -->
        <!-- 结业状态 -->
        <!-- <el-form-item :label="$t('table.graduationStatus')">
              <el-select v-model="form.graduation" :placeholder="$t('common.all')" style="width: 120px">
                  <el-option v-for="(item, index) in form.graduationArr" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
          </el-form-item> -->
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseEnterStudentName')"
            v-model.trim="form.searchKey"
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
          <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import { getEmployeesId, getStudents } from '/@/api/ftm/teacher/account'
  import { airlinesMenu } from '/@/api/ftm/teacher/studentTraining'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import XEUtils from 'xe-utils'
  import moment from 'moment'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    components: { VxeTable, Search },
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
        tableTools: null,
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
          { field: 'customer.name', title: this.$t('table.airlines'), minWidth: 100 },
          { field: 'trainingCount', title: this.$t('table.trainingNum'), minWidth: 70 },
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
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
    },
    created() {
      if (this.userInfo.builtinRole == 'CUSTOMER_CONTACTOR') {
        this.getCustomer(info.id, this.getData)
      } else {
        this.getData()
      }
      airlinesMenu().then((res) => {
        this.form.airlinesArr = res.data
      })

      this.form.schoolYear = moment().format('YYYY')
      this.getClazzs()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
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
          clazzId: this.form.className,
          searchKey: this.form.searchKey ? this.form.searchKey : undefined,
          customerIds: this.form.airlines,
          status: this.form.graduation,
          year: this.form.schoolYear,
          trainingRecordTeacherUserId: this.userInfo.teacher ? this.userInfo.userId : undefined,
        }
        this.tableLoading = true
        getStudents(param)
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
      toPage(row) {
        this.routerGo(`record/student/${row.id}`)
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
              this.toPage(row)
            },
          },
        ]
      },
    },
  }
</script>
