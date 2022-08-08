<template>
  <VxeTable
    :data="tableData"
    :loading="tableLoading"
    :columns="tablsColumns"
    :buttons="tableButtons"
    v-model:form="form"
    @handlePageChange="paginationEvent"
  >
    <template #top>
      <el-form inline size="medium">
        <!-- 课号 -->
        <!-- <el-form-item :label="$t('table.CourseNumber')">
              <el-select v-model="form.courseNumber" clearable>
                  <el-option v-for="(item,index) in clazzs" :key="index" :label="item.courseNumber" :value="item.id"></el-option>
              </el-select>
          </el-form-item> -->
        <!-- 直播状态 -->
        <el-form-item :label="$t('table.LiveStatus')">
          <el-select v-model="form.status" class="sort-select" clearable>
            <el-option
              v-for="(item, index) in statusArray"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <!-- 直播讲师 -->
        <el-form-item :label="$t('table.LiveTeacher')">
          <el-select v-model="form.userId" class="sort-select" clearable filterable>
            <el-option
              v-for="(item, index) in teachers"
              :key="index"
              :label="item.name"
              :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            class="searchInput"
            v-model="form.searchKey"
            :placeholder="$t('holder.pleaseEnterKeywordOfSearch')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getEmployees } from '/@/api/ftm/student/account'
  import { getLives } from '/@/api/ftm/student/teachingCenter'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    components: { VxeTable },
    data() {
      return {
        form: {
          page: 1,
          size: 10,
          total: 0,
          participantUserId: undefined,
        },
        statusArray: [
          { id: 'BROADCASTING', name: this.$t('status.broadcasting') },
          { id: 'NOT_STARTED', name: this.$t('status.pending') },
          { id: 'FINISHED', name: this.$t('status.over') },
        ],
        teachers: [],
        clazzs: [],
        tableLoading: false,
        tableData: [],
        tablsColumns: [
          { type: 'seq', width: 80, title: this.$t('common.serialNumber') },
          { field: 'name', width: 200, title: this.$t('table.LiveName') },
          { field: 'courseNumber', width: 160, title: this.$t('table.CouseCode') },
          { field: 'courseName', minWidth: 200, title: this.$t('table.courseName') },
          { field: 'user.name', width: 140, title: this.$t('table.LiveTeacher') },
          {
            field: 'startTime',
            width: 200,
            title: this.$t('table.Airtime'),
            formatter: this.dateFormat,
          },
          {
            field: 'joined',
            width: 120,
            title: this.$t('table.learningState'),
            formatter: ({ cellValue }) =>
              cellValue ? this.$t('status.studied') : this.$t('status.notStudy'),
          },
          {
            field: 'status',
            width: 120,
            title: this.$t('table.LiveStatus'),
            formatter: this.statusFormat,
          },
          { width: 120, title: this.$t('table.operation'), slots: { default: 'operate' } },
        ],
      }
    },
    async created() {
      const [err, res] = await to(getEmployees({ size: 1000 }))
      if (!err && res.status === 200) {
        this.teachers = this.teachers.concat(res.data.content)
      }
    },
    mounted() {
      this.form.participantUserId = this.userInfo.userId
      this.getList()
    },
    computed: {
      userInfo() {
        return userStore.userInfo
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
      async getList() {
        this.tableLoading = true
        let params = JSON.parse(JSON.stringify(this.form))
        delete params['total']
        let [err, res] = await to(getLives(params))
        this.tableLoading = false
        if (!err) {
          this.tableData = res.data.content
        }
      },
      // 分页
      paginationEvent({ page, size }) {
        this.$set(this.form, 'page', page)
        this.$set(this.form, 'size', size)
        this.getList()
      },
      // 格式化时间
      dateFormat({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      // 格式化状态
      statusFormat({ cellValue }) {
        switch (cellValue) {
          case 'BROADCASTING':
            return this.$t('status.broadcasting')
          case 'FINISHED':
            return this.$t('status.over')
          case 'NOT_STARTED':
            return this.$t('status.pending')
          default:
            return ''
        }
      },
      toLive(row) {
        this.routerGo(`online/live/${row.id}`)
      },
      handleSearch() {
        this.form.page = 1
        this.getList()
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.enterLive'),
            visible: row.status != 'FINISHED',
            event: () => {
              this.toLive(row)
            },
          },
        ]
      },
    },
  }
</script>
