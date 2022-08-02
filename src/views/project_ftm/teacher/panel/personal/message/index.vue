<template>
  <VxeTable
    v-bind="gridOptions"
    :loading="loading"
    :toolbarConfig="tableTools"
    v-model:form="form"
    @handlePageChange="handlePageChange"
  >
    <template #form>
      <el-form :inline="true" size="medium">
        <el-form-item :label="$t('table.readingStatus')">
          <!-- 阅读状态 -->
          <el-select v-model="form.hasRead" clearable>
            <el-option
              v-for="(item, index) in readingList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.messageType')">
          <!-- 消息类型 -->
          <el-select v-model="form.sourceSubType" clearable>
            <el-option
              v-for="(item, index) in msgTypeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">
            {{ $t('button.query') }}
          </el-button>
        </el-form-item>
      </el-form>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { getMessages, deleteMessagesId } from '/@/api/ftm/teacher/personCenter'
  import moment from 'moment'
  export default {
    name: 'Message',
    components: {
      VxeTable,
    },
    data() {
      return {
        form: {
          page: 1,
          size: 10,
          total: 0,
          sourceTypeIN: '', // 消息类型 0:消息公告 1,2,3,4,5: 其他公告；  公众信息0-1，通知信息0-2，系统信息sourceTypeNI 0,  IN:in NI:not in
          sourceSubType: undefined, // 源子类型 1:公众消息 2:通知消息 3:文件学习通知 4:学习任务
          hasRead: undefined,
          sourceSubTypeNI: '3,4',
          order: 'desc',
        },
        tableTools: {
          enabled: false,
        },
        buttons: [
          {
            type: 'detail',
            label: this.$t('button.view'),
          },
          // {
          //     type: "delete",
          //     label: this.$t("button.delete"),
          //     status: "danger",
          // },
        ],
        gridOptions: {
          resizable: true,
          autoResize: true,
          // showOverflow: true,
          columns: [
            { type: 'seq', width: 50, title: this.$t('common.serialNumber') },
            {
              field: 'title',
              title: this.$t('table.messageTitle'),
              minWidth: 100,
            },
            {
              field: 'sourceSubType',
              title: this.$t('table.messageType'),
              formatter: this.formatMessageType,
            },
            {
              field: 'createdDate',
              title: this.$t('table.sendingTime'),
              formatter: this.formatDateTime,
              minWidth: 160,
            },
            {
              field: 'hasRead',
              title: this.$t('table.readingStatus'),
              formatter: this.formatStatus,
            },
            {
              // field: "operationTypes",
              title: this.$t('table.tableEdit'),
              slots: {
                default: 'operate',
              },
            },
          ],
          data: [],
          buttons: ({ row }) => [
            {
              name: this.$t('button.view'),
              event: () => {
                this.btnClick({ row, type: 'detail' })
              },
            },
          ],
        },
        readingList: [
          {
            name: this.$t('common.read'),
            id: true,
          },
          {
            name: this.$t('common.unread'),
            id: false,
          },
        ],
        msgTypeList: [
          { id: 1, name: this.$t('table.publicInformation') },
          { id: 2, name: this.$t('table.notificationInformation') },
          { id: 3, name: this.$t('table.systemNotice') },
        ],
        loading: false,
      }
    },
    created() {
      let status = this.$route.query.status
      this.form.sourceSubType = status ? parseInt(status) : undefined
    },
    // TODO 原缓存页面 执行activated
    mounted() {
      this.getMessages()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      formatStatus({ cellValue }) {
        return cellValue ? this.$t('common.read') : this.$t('common.unread')
      },
      formatDateTime({ cellValue }) {
        return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
      },
      formatMessageType({ cellValue, row }) {
        let typeItem = {}
        if (row.sourceType > 0) {
          typeItem = this.msgTypeList.find((v) => v.id == 3)
        } else {
          typeItem = this.msgTypeList.find((v) => v.id == row.sourceSubType) || {}
        }
        return typeItem.name
      },
      btnClick({ row, type }) {
        switch (type) {
          case 'detail':
            // putMessagesId({ id: row.id, hasRead: true }).then((res) => {
            //     if (res.status == 200) {
            //         this.$store.commit(
            //             "settings/SET_UPDATEBUM",
            //             row.id
            //         );
            this.routerGo(`message/detail/${row.id}`)
            //     }
            // });
            break

          default:
            this.$confirm(
              this.$t('tip.thisOperationWillPermanentlyDeleteTheData'),
              this.$t('tip.tip'),
              {
                confirmButtonText: this.$t('button.confirm'),
                cancelButtonText: this.$t('button.cancel'),
                type: 'warning',
              },
            )
              .then((res) => {
                deleteMessagesId({ id: row.id }).then((res) => {
                  if (res.status == 200) {
                    this.$store.commit('settings/SET_UPDATEBUM', row.id)
                    this.$message.success(this.$t('tip.delsuccessTip'))
                    this.getMessages()
                  }
                })
              })
              .catch((_) => {})
            break
        }
      },
      handlePageChange({ page, size }) {
        this.form.size = size
        this.form.page = page
        this.getMessages()
      },
      async getMessages() {
        let params = JSON.parse(JSON.stringify(this.form))
        switch (params.sourceSubType) {
          case 3:
            params.sourceTypeIN = '1,2,5'
            params.sourceSubType = undefined
            break
          case undefined:
            params.sourceTypeIN = '0,1,2,5'
            params.sourceSubType = undefined
            break
          default:
            params.sourceTypeIN = '0'
        }
        this.loading = true
        let [err, res] = await to(getMessages(params))
        this.loading = false
        if (res.status == 200) {
          this.gridOptions.data = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.getMessages()
      },
    },
  }
</script>

<style></style>
