<template>
  <VxeTable
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    :buttons="tableButtons"
    v-model:form="pagination"
    @checkbox="selectAllEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form inline size="medium">
        <el-form-item>
          <el-input v-model="form.keyWord" :placeholder="$t('holder.enterNotificationMessage')" />
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
  import { delNotice, getMessage } from '/@/api/ftm/student/education'
  import { getClazzs } from '/@/api/ftm/student/teachingPlan'
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
          keyWord: '',
          noticeType: 4,
          groupIdArr: [],
          groupId: undefined,
        },
        tableData: [],
        tableColumns: [
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'title', title: this.$t('table.messageTitle'), minWidth: 250 },
          {
            field: 'attachments',
            width: 120,
            formatter: this.lengthFormat,
            title: this.$t('table.fileNumber'),
          },
          {
            field: 'createdDate',
            formatter: this.dateFormat,
            title: this.$t('table.releaseTime'),
            minWidth: 210,
          },
          {
            field: 'hasRead',
            width: 120,
            title: this.$t('table.readingStatus'),
            formatter: this.readFormat,
            width: 90,
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
        return userStore.userInfo
      },
    },
    mounted() {
      this.getClazzs()
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
        return cellValue && cellValue.map((v) => v.name).join()
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
        let timer = setInterval(async () => {
          if (!this.userInfo.userId) return
          let params = {
            page: this.pagination.page,
            size: this.pagination.size,
            searchKey: this.form.keyWord,
            sourceType: 0,
            sourceSubType: 4,
            order: 'desc',
            userId: this.userInfo.userId,
          }
          this.loading = true
          clearInterval(timer)
          let [err, { data }] = await to(getMessage(params))
          this.loading = false
          if (!err) {
            this.tableData = data.content
            this.pagination.total = data.totalElements
            this.records = []
          }
        }, 100)
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
        return this.$t('router.teachingTask')
      },
      // 格式化日期
      dateFormat({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      // 格式化布尔值
      boolFormat({ cellValue }) {
        return cellValue ? this.$t('common.yes') : this.$t('common.no')
      },
      lengthFormat({ cellValue }) {
        return cellValue instanceof Array ? cellValue.length : 0
      },
      readFormat({ cellValue }) {
        return cellValue ? this.$t('status.haveRead') : this.$t('status.unread')
      },
      search() {
        this.pagination.page = 1
        this.getData()
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            event: () => {
              this.routerGo(`task/details?id=${row.id}`)
            },
          },
        ]
      },
    },
  }
</script>
