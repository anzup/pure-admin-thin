<template>
  <!-- 教员表 -->
  <VxeTable
    v-if="builtinRole != 'TRAINING_ADMIN'"
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    v-model:form="form"
    :toolbar-config="tableTools"
    :buttons="tableButtons"
    @handlePageChange="handleCurrentChange"
  >
    <template #pager v-if="!isPagination" />
    <template #form>
      <el-form ref="form" :model="form" inline size="medium">
        <!-- 部门 -->
        <!-- <el-form-item :label="$t('table.department')">
          <el-select v-model="form.departId" :placeholder="$t('holder.pleaseSelect')" style="width: 200px" clearable>
            <el-option v-for="item in departmentsAll" :key="item.index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 班级课号 -->
        <el-form-item :label="$t('table.classNumber')">
          <el-select
            v-model="form.courseNumber"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 100%"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.courseNumber"
              v-for="item in classList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>

  <!-- 教务员表格 -->
  <VxeTable
    v-else
    :data="tableData"
    :loading="loading"
    :columns="tableColumns2"
    v-model:form="form"
    :toolbar-config="tableTools"
    :buttons="tableButtons"
    @handlePageChange="handleCurrentChange"
  >
    <template #pager />
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  import { deleteEmptyParams } from '/@/utils/index'
  import { getDepartmentsAll, getEmployees } from '/@/api/ftm/teacher/account'
  import { getCoursewareByAssignee } from '/@/api/ftm/teacher/courseware'
  import { getClazzs, getClazzAllStudents } from '/@/api/ftm/teacher/teachingPlan'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()

  export default {
    components: { VxeTable },
    data() {
      return {
        menuName: 'COURSEWARE_ASSIGNMENT',
        form: {
          coursewareAssignmentCountGT: '0', // 指派数量大于0
          departId: undefined,
          clazzId: undefined,
          courseNumber: undefined,
          page: 1,
          size: 10,
          total: 0,
          // sort: "createdDate",
          // order: "desc"
        },
        searchedForm: {},
        loading: false,
        isPagination: true,
        tableData: [],
        tableTools: {
          enabled: false,
          slots: {
            buttons: 'left_tools',
          },
        },
        tableColumns: [],
        tableColumns2: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.name'), minWidth: 120 },
          {
            field: 'gender',
            title: this.$t('table.gender'),
            width: 90,
            formatter: this.genderFormatter,
          },
          { field: 'phone', title: this.$t('table.cellPhoneNumber'), minWidth: 120 },
          {
            field: 'coursewareAssignmentCount',
            title: this.$t('table.coursewareAssignmentCount'),
            minWidth: 80,
          },
          {
            field: 'coursewareAssignmentFinishedCount',
            title: this.$t('table.coursewareAssignmentFinishedCount'),
            minWidth: 120,
          },
          { title: this.$t('table.tableEdit'), width: 140, slots: { default: 'operate' } },
        ],
        records: [],
        coursewareTypeList: [
          { id: 'PUBLIC', name: this.$t('table.openCourseware') },
          { id: 'THIRD_PARTY', name: this.$t('table.thirdPartyCourseware') },
          { id: 'SELF', name: this.$t('table.ownCourseware') },
        ],
        departmentsAll: [],
        classList: [],
      }
    },
    mounted() {
      this.getCoursewareAssignments()
      this.getDepartmentsAll()
      this.getClazzsAll()
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      // 格式化性别
      genderFormatter({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      getDepartmentsAll() {
        getDepartmentsAll().then((res) => {
          if (res.status == 200) {
            this.departmentsAll = res.data
          }
        })
      },
      getClazzsAll() {
        getClazzs({
          teacherUserId: this.userInfo.userId,
          size: 100,
          statusIN: 'NOT_STARTED,TRAINING',
          type: 'WET_LEASE',
        }).then((res) => {
          if (res.status == 200) {
            this.classList = res.data.content
          }
        })
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getCoursewareAssignments()
      },
      async getCoursewareAssignments() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        let Api, params
        if (this.builtinRole == 'TRAINING_ADMIN') {
          Api = getEmployees
          params = XEUtils.clone(this.form, true)
          this.isPagination = true
        } else {
          if (this.form.courseNumber) {
            params = this.$filterObject(this.form, ['page', 'size', 'courseNumber'])
            Api = getCoursewareByAssignee
            this.isPagination = true
            this.tableColumns = [
              { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
              { field: 'assignee.name', title: this.$t('table.name'), minWidth: 120 },
              {
                field: 'assignee.gender',
                title: this.$t('table.gender'),
                width: 90,
                formatter: this.genderFormatter,
              },
              { field: 'assignee.phone', title: this.$t('table.cellPhoneNumber'), minWidth: 120 },
              { field: 'assignee.departmentName', title: this.$t('table.department'), width: 140 },
              {
                field: 'assignee.courseNumber',
                title: this.$t('table.courseNumber'),
                minWidth: 120,
              },
              {
                field: 'assignCount',
                title: this.$t('table.coursewareAssignmentCount'),
                minWidth: 80,
              },
              {
                field: 'finishCount',
                title: this.$t('table.coursewareAssignmentFinishedCount'),
                minWidth: 120,
              },
              { title: this.$t('table.tableEdit'), width: 140, slots: { default: 'operate' } },
            ]
          } else {
            params = {
              id: this.userInfo.id,
              clazzStatusIN: 'NOT_STARTED,TRAINING',
              studentStatusIN: 'NOT_STARTED,NOT_GRADUATED',
            }
            Api = getClazzAllStudents
            this.isPagination = false
            this.tableColumns = [
              { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
              { field: 'name', title: this.$t('table.name'), minWidth: 120 },
              {
                field: 'gender',
                title: this.$t('table.gender'),
                width: 90,
                formatter: this.genderFormatter,
              },
              { field: 'phone', title: this.$t('table.cellPhoneNumber'), minWidth: 120 },
              { field: 'clazz.department.name', title: this.$t('table.department'), width: 140 },
              { field: 'clazz.courseNumber', title: this.$t('table.courseNumber'), minWidth: 120 },
              {
                field: 'coursewareAssignmentCount',
                title: this.$t('table.coursewareAssignmentCount'),
                minWidth: 80,
              },
              {
                field: 'coursewareAssignmentFinishedCount',
                title: this.$t('table.coursewareAssignmentFinishedCount'),
                minWidth: 120,
              },
              { title: this.$t('table.tableEdit'), width: 140, slots: { default: 'operate' } },
            ]
          }
        }
        this.searchedForm = XEUtils.clone(params, true)
        let [err, res] = await to(Api(params))
        this.loading = false
        if (!err && res.status == 200) {
          if (this.isPagination) {
            this.tableData = res.data.content
            this.form.total = res.data.totalElements
          } else {
            this.tableData = res.data
          }
        }
      },
      readMore(row) {
        let query = {
          courseNumber: this.form.courseNumber,
          isByStudent: true,
        }

        if (this.isPagination && this.builtinRole != 'TRAINING_ADMIN') {
          query.assigneeId = row.assignee.userId
        } else {
          query.assigneeId = row.userId
        }

        let url = 'record/details?'
        query = deleteEmptyParams(query)
        for (let [key, value] of Object.entries(query)) {
          url += `${key}=${value}&`
        }
        url = url.substring(0, url.length - 1)
        this.routerGo(url)
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatType({ cellValue }) {
        if (this.coursewareTypeList.filter((v) => v.id == cellValue).length !== 0) {
          return this.coursewareTypeList.filter((v) => v.id == cellValue)[0].name
        }
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getCoursewareAssignments()
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.readMore'),
            visible: this.userInfo.totalAuthorities.includes(this.menuName + ':READ_MORE'),
            event: () => {
              this.readMore(row)
            },
          },
        ]
      },
    },
  }
</script>
