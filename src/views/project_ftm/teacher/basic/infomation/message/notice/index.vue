<template>
  <VxeTable
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    v-model:form="pagination"
    :toolbarConfig="tableTools"
    :buttons="tableButtons"
    @checkbox="selectAllEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form inline size="medium">
        <el-form-item :label="$t('table.messageType')">
          <el-select v-model="form.noticeType" clearable>
            <el-option
              v-for="item in noticeArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            class="searchInput"
            v-model="form.keyWord"
            :placeholder="$t('holder.enterNotificationMessage')"
          />
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
        @click="addNotice"
        >{{ $t('button.add') }}</el-button
      >
      <el-button
        v-if="containsPermissions(menuName + ':BULK_DELETION')"
        type="danger"
        size="mini"
        @click="DeleteAll"
        >{{ $t('button.batchDeletion') }}</el-button
      >
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getNotice, delNotice } from '/@/api/ftm/teacher/education'
  import XEUtils from 'xe-utils'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { VxeTable },
    data() {
      return {
        menuName: 'NOTIFICATION_MESSAGE',
        form: {
          keyWord: '',
          noticeType: undefined,
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
          { field: 'title', title: this.$t('table.messageTitle'), minWidth: 250 },
          {
            field: 'type',
            formatter: this.typeFormat,
            title: this.$t('table.messageType'),
            minWidth: 220,
          },
          { field: 'creator.name', title: this.$t('table.publisher'), minWidth: 120 },
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
      }
    },
    // TODO 原缓存页面执行activated
    mounted() {
      this.getData()
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
      totalAuthorities() {
        return this.userInfo.totalAuthorities
      },
      noticeArr() {
        return [
          this.builtinRole == 'TRAINING_ADMIN'
            ? { id: 1, name: this.$t('table.publicInformation') }
            : null,
          { id: 2, name: this.$t('table.notificationInformation') },
        ].filter((v) => v)
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
      async getData() {
        let params = {
          page: this.pagination.page,
          size: this.pagination.size,
          searchKey: this.form.keyWord,
          order: 'desc',
          type: this.form.noticeType,
          typeIN: '1,2',
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
        switch (cellValue.toString()) {
          case '1':
            return this.$t('table.publicInformation')
          case '2':
            return this.$t('table.notificationInformation')
          case '3':
            return this.$t('table.learningDocumentNotification')
          default:
            return ''
        }
      },
      // 格式化日期
      dateFormat({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      // 格式化布尔值
      boolFormat({ cellValue, row }) {
        return row.type == '1' ? '' : cellValue ? this.$t('common.yes') : this.$t('common.no')
      },
      search() {
        this.pagination.page = 1
        this.getData()
      },
      addNotice() {
        this.routerGo('message/notice/add')
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            visible: this.totalAuthorities.includes(this.menuName + ':DETAIL'),
            event: () => {
              this.routerGo(`message/notice/detail?id=${row.id}`)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: this.totalAuthorities.includes(this.menuName + ':DELETE'),
            event: () => {
              this.Delete(row)
            },
          },
        ]
      },
    },
  }
</script>

<style scoped>
  .searchInput {
    width: 300px !important;
  }
</style>
