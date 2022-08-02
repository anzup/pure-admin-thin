<template>
  <div>
    <VxeTable
      :loading="loading"
      :data="tableData"
      :columns="tableColumns"
      :toolbarConfig="tableTools"
      :buttons="tableButtons"
      v-model:form="pagination"
      @checkbox="selectAllEvent"
      @handle-page-change="handleCurrentChange"
    >
      <template #form>
        <el-form inline size="medium">
          <el-form-item :label="$t('table.classNumber')">
            <!-- 班级课号 -->
            <el-select v-model="form.groupId" :placeholder="$t('common.all')" clearable>
              <el-option
                v-for="(item, index) in form.groupIdArr"
                :key="index"
                :label="item.courseNumber"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.keyWord" :placeholder="$t('holder.enterNotificationMessage')" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #right_tools>
        <el-button
          v-if="containsPermissions(menuName + ':ADD')"
          type="primary"
          size="mini"
          @click="addTask"
          >{{ $t('button.add') }}</el-button
        >
        <el-button
          v-if="containsPermissions(menuName + ':BULK_DELETION')"
          type="danger"
          size="mini"
          :disabled="records.length < 1"
          @click="DeleteAll"
          >{{ $t('button.batchDeletion') }}</el-button
        >
      </template>
    </VxeTable>
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getNotice, delNotice } from '/@/api/ftm/teacher/education'
  import XEUtils from 'xe-utils'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useRouter } from 'vue-router'
  import { useGo } from '../../../../../../hooks/usePage'
  const userStore = useFtmUserStore()

  export default {
    data() {
      return {
        menuName: 'TEACHING_TASKS',
        form: {
          keyWord: '',
          noticeType: 4,
          groupIdArr: [],
          groupId: undefined,
        },
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: 60 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          {
            field: 'groups',
            title: this.$t('table.classNumber'),
            minWidth: 250,
            formatter: this.formatGroups,
          },
          { field: 'title', title: this.$t('table.messageTitle'), minWidth: 250 },
          {
            field: 'type',
            formatter: this.typeFormat,
            title: this.$t('table.messageType'),
            minWidth: 120,
          },
          { field: 'creator.name', title: this.$t('table.publisher'), minWidth: 140 },
          {
            field: 'allRead',
            formatter: this.boolFormat,
            title: this.$t('table.readItAll'),
            minWidth: 120,
          },
          {
            field: 'createdDate',
            formatter: this.dateFormat,
            title: this.$t('table.releaseTime'),
            minWidth: 200,
          },
          { title: this.$t('table.tableEdit'), width: 180, slots: { default: 'operate' } },
        ],
        records: [],
        loading: false,
        pagination: {
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
        return userStore.$state
      },
    },
    components: { VxeTable },
    // TODO: 原缓存activated
    mounted() {
      this.getClazzs()
      this.loading = true
      this.getData()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      formatGroups({ cellValue }) {
        return cellValue && cellValue.map((v) => v.name).join(', ')
      },
      dateChange() {
        this.form.groupId = undefined
        this.getClazzs()
      },
      getClazzs() {
        getClazzs({
          page: 1,
          size: 1000,
          // year:this.form.schoolYear
          type: 'WET_LEASE',
          statusIN: 'TRAINING',
        }).then((res) => {
          this.form.groupIdArr = res.data.content
        })
      },
      disabledDate(val) {
        return moment(val).valueOf() > moment().add(1, 'year').valueOf()
      },
      async getData() {
        // 可能还未获取到userinfo，等待获取到id后执行
        let params = {
          page: this.pagination.page,
          size: this.pagination.size,
          searchKey: this.form.keyWord,
          order: 'desc',
          type: this.form.noticeType,
          groupId: this.form.groupId,
          createdBy: this.userInfo.userId,
        }
        this.loading = true
        let { data } = await getNotice(params).catch(() => {
          this.loading = false
        })
        this.loading = false
        this.tableData = data.content
        this.pagination.total = data.totalElements
        this.records = []
      },
      // 删除一条消息
      Delete(row) {
        this.$confirm(this.$t('tip.areYouSureYouWantToDelete'), this.$t('button.delete'), {
          type: 'error',
        })
          .then(() => {
            this.delData(row.id)
          })
          .catch(() => {})
      },
      // 批量删除
      DeleteAll() {
        if (this.records.length > 0) {
          let ids = this.records.map((v) => v.id)
          this.$confirm(
            this.$t('tip.areYouSureYouWantToDeleteTheSelected'),
            this.$t('button.delete'),
            {
              type: 'error',
            },
          )
            .then(() => {
              this.delData(ids)
            })
            .catch(() => {})
        }
      },
      async delData(id) {
        let loading = this.$loading()
        await delNotice({ id }).catch(() => {
          loading.close()
        })
        loading.close()
        this.getData()
        this.$message({
          type: 'success',
          duration: 1500,
          message: this.$t('tip.delsuccessTip'),
        })
      },
      selectAllEvent({ records }) {
        this.records = records
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        this.getData()
      },
      // 格式化消息类型
      typeFormat({ cellValue }) {
        return this.$t('router.TeachingTask')
      },
      // 格式化日期
      dateFormat({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      // 格式化布尔值
      boolFormat({ cellValue }) {
        return cellValue ? this.$t('common.yes') : this.$t('common.no')
      },
      search() {
        this.pagination.page = 1
        this.pagination.total = 0
        this.getData()
      },
      addTask() {
        this.routerGo('task/teachingTaskAdd')
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            visible: userStore.ContainsPermissions(this.menuName + ':DETAIL'),
            event: () => {
              this.routerGo(`task/teachingTaskDetail?id=${row.id}`)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: userStore.ContainsPermissions(this.menuName + ':DELETE'),
            event: () => {
              this.Delete(row)
            },
          },
        ]
      },
    },
  }
</script>
