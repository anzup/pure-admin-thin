<template>
  <VxeTable
    v-if="tableSwitch"
    :loading="loading"
    :columns="tearchAdmin_tableColumns"
    :data="tableData"
    v-model:form="pagination"
    :toolbarConfig="tableTools"
    :buttons="tableButtons"
    @checkbox="selectAllEvent"
    @handlePageChange="handleCurrentChange"
  >
    <!-- 教务员和监察员可见 -->
    <template #form>
      <el-form inline size="medium">
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
        @click="addFileStudy"
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
  <VxeTable
    v-else
    :loading="loading"
    :columns="tearch_tableColumns"
    :data="tableData"
    v-model:form="pagination"
    :toolbarConfig="tableTools"
    :buttons="tableButtons"
    @checkbox="selectAllEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form inline>
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
        @click="addFileStudy"
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
  import { getMessage } from '/@/api/ftm/teacher/user'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { VxeTable },
    data() {
      return {
        menuName: 'FILE_LEARNING_NOTIFICATIONS',
        form: {
          keyWord: '',
          noticeType: '3',
          noticeArr: [
            { id: 1, name: this.$t('table.publicInformation') },
            { id: 2, name: this.$t('table.notificationInformation') },
            { id: 3, name: this.$t('table.learningDocumentNotification') },
          ],
        },
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tearchAdmin_tableColumns: [
          { type: 'checkbox', width: 60 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'title', title: this.$t('table.messageTitle'), minWidth: 250 },
          {
            field: 'type',
            formatter: this.typeFormat,
            title: this.$t('table.messageType'),
            minWidth: 250,
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
        tearch_tableColumns: [
          { type: 'checkbox', width: 60 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'title', title: this.$t('table.messageTitle'), minWidth: 250 },
          {
            formatter: () => this.$t('table.learningDocumentNotification'),
            title: this.$t('table.messageType'),
            width: 250,
          },
          { field: 'creator.name', title: this.$t('table.publisher'), minWidth: 120 },
          {
            field: 'createdDate',
            formatter: this.dateFormat,
            title: this.$t('table.releaseTime'),
            minWidth: 200,
          },
          {
            field: 'hasRead',
            title: this.$t('table.readingStatus'),
            formatter: this.formatRead,
            width: 150,
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
    computed: {
      userInfo() {
        return userStore.$state
      },
      totalAuthorities() {
        return this.userInfo.totalAuthorities
      },
      tableSwitch() {
        return this.userInfo.teacherAdmin || this.userInfo.builtinRole == 'AVIATION_INSPECTOR'
      },
    },
    // TODO 原缓存页面执行activated
    mounted() {
      let { teacherAdmin, builtinRole } = this.userInfo
      if (teacherAdmin || builtinRole == 'AVIATION_INSPECTOR') {
        this.getData()
      } else {
        this.getList()
      }
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      // 教务员查看列表
      async getData() {
        let params = {
          page: this.pagination.page,
          size: this.pagination.size,
          searchKey: this.form.keyWord,
          order: 'desc',
          sort: 'createdDate',
          type: this.form.noticeType,
        }
        this.loading = true
        let [err, { data }] = await to(getNotice(params))
        if (!err) {
          this.loading = false
          this.tableData = data.content
          this.pagination.total = data.totalElements
          this.records = []
        }
      },
      // 教员查看列表
      async getList() {
        let params = {
          userId: this.userInfo.userId,
          sourceType: 0,
          sourceSubType: 3,
          sort: 'hasRead,createdDate',
          order: 'asc,desc',
          page: this.pagination.page,
          size: this.pagination.size,
        }
        this.loading = true
        let [err, res] = await to(getMessage(params))
        if (!err) {
          let data = res.data
          this.loading = false
          this.tableData = res.data.content
          this.pagination.total = data.totalElements
          this.records = []
        }
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
        let [err, res] = await to(delNotice({ id }))
        loading.close()
        if (!err) {
          let { teacherAdmin, builtinRole } = this.userInfo
          teacherAdmin || builtinRole == 'AVIATION_INSPECTOR' ? this.getData() : this.getList()
          this.$message({
            type: 'success',
            duration: 1500,
            message: this.$t('tip.delsuccessTip'),
          })
        }
      },
      selectAllEvent({ checked, records }) {
        this.records = records
      },
      handleCurrentChange({ page, size }) {
        this.pagination.page = page
        this.pagination.size = size
        let { teacherAdmin, builtinRole } = this.userInfo
        teacherAdmin || builtinRole == 'AVIATION_INSPECTOR' ? this.getData() : this.getList()
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
      boolFormat({ cellValue }) {
        return cellValue ? this.$t('common.yes') : this.$t('common.no')
      },
      formatRead({ cellValue }) {
        return cellValue ? this.$t('common.read') : this.$t('common.unread')
      },
      // 查看通知
      toPriew(row) {
        this.routerGo(`message/fileNotice/detail/${row.id}`)
      },
      search() {
        this.pagination.page = 1
        let { teacherAdmin, builtinRole } = this.userInfo
        if (teacherAdmin || builtinRole == 'AVIATION_INSPECTOR') {
          this.getData()
        } else {
          this.getList()
        }
      },
      addFileStudy() {
        this.routerGo(`message/fileNotice/add?status=filestudy`)
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return this.tableSwitch
          ? [
              {
                name: this.$t('button.details'),
                visible: this.totalAuthorities.includes(this.menuName + ':DETAIL'),
                event: () => {
                  this.routerGo(`message/fileNotice/detail?id=${row.id}`)
                },
              },
              {
                name: this.$t('button.delete'),
                visible: this.totalAuthorities.includes(this.menuName + ':DELETE'),
                event: () => {
                  this.Delete(row)
                },
              },
            ]
          : [
              {
                name: this.$t('button.view'),
                event: () => {
                  this.toPriew(row)
                },
              },
            ]
      },
    },
  }
</script>
