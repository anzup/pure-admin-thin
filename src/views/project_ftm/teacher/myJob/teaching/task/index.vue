<template>
  <div>
    <VxeTable
      :loading="loading"
      :data="tableData"
      :columns="tableColumns"
      :toolbarConfig="tableTools"
      :form="pagination"
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
        <!--v-permission="menuName + ':ADD'"-->
        <el-button
          type="primary"
          size="mini"
          @click="$router.push({ path: '/teachingCenter/teachingTask/teachingTaskAdd' })"
          >{{ $t('button.add') }}</el-button
        >
        <!--v-permission="menuName + ':BULK_DELETION'"-->
        <el-button type="danger" size="mini" :disabled="records.length < 1" @click="DeleteAll">{{
          $t('button.batchDeletion')
        }}</el-button>
      </template>

      <template #edit="{ row }">
        <div class="button-line">
          <span
            class="buttonEdit"
            @click="
              $router.push({
                name: 'TeachingTaskDetail',
                query: { id: row.id },
              })
            "
            v-permission="menuName + ':DETAIL'"
            >{{ $t('button.details') }}</span
          >
          <span class="buttonDelete" @click="Delete(row)" v-permission="menuName + ':DELETE'">{{
            $t('button.delete')
          }}</span>
        </div>
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
    },
  }
</script>
