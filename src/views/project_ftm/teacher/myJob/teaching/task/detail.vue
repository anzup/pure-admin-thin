<template>
  <div class="educations-form">
    <div class="content-box">
      <el-scrollbar max-height="100%">
        <div class="content-header">
          <el-divider direction="vertical" />
          <span>{{ $t('table.contentDetails') }}</span>
        </div>
        <div class="content warp-content-table">
          <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td>{{ $t('table.messageType') }}</td>
              <td>{{ type(Details.type) }}</td>
            </tr>
            <tr>
              <td>{{ $t('table.messageTitle') }}</td>
              <td>{{ Details.title || '' }}</td>
            </tr>
            <tr v-show="Details.type != 1">
              <td>{{ $t('table.messageContent') }}</td>
              <td>
                <div class="message-con">{{ Details.content || '' }}</div>
              </td>
            </tr>
            <tr>
              <td>{{ $t('table.messageAttachment') }}</td>
              <td>
                <span
                  class="downfile-link"
                  v-for="item in fileList"
                  :key="item.id"
                  @click="readClick(item)"
                  @dblclick="getAttachmentIdDownload(item)"
                  ><el-icon><Paperclip /></el-icon>{{ item.name }}</span
                >
              </td>
            </tr>
          </table>
        </div>
        <div class="content-main" v-show="Details.type != 1">
          <div class="content-header">
            <el-divider direction="vertical" />
            <span>{{ $t('button.readMore') }}</span>
          </div>
          <div class="content-table">
            <DetailTable
              :Details="Details"
              :loading="loading"
              :origin="originData"
              :pagination="pagination"
              v-model:data="tableData"
              @handlePagination="tablePageChange"
            />
          </div>
        </div>
      </el-scrollbar>
    </div>

    <PreviewFile
      v-if="showFile"
      v-model:videoDialog="showFile"
      :fileType="fileType"
      :fileUuid="fileUuid"
      :playFilePath="playFilePath"
      :name="fileTitle"
    />
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[previewUrl]" />
  </div>
</template>

<script>
  import { Paperclip } from '@element-plus/icons-vue'
  import { getNoticeDetails, getNoticeReadRecord } from '/@/api/ftm/teacher/education'
  import { getFileDetail, previewFile, getFilesId, getFileDownload } from '/@/api/ftm/teacher/file'
  import PreviewFile from '/@/views/project_ftm/teacher/myJob/fileCenter/download/components/previewFile.vue'
  import DetailTable from './components/detailTable.vue'
  import { debounce } from '/@/utils/index'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        Details: {},
        form: {
          readType: '',
        },
        loading: false,
        tableData: [],
        originData: [],
        fileList: [],
        showViewer: false,
        previewUrl: '',
        showFile: false,
        fileType: undefined,
        fileUuid: undefined,
        playFilePath: undefined,
        fileTitle: undefined,
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
        isDobleClick: false,
      }
    },
    components: {
      PreviewFile,
      Paperclip,
      DetailTable,
    },
    created() {
      this.getDetails()
      this.getRecords()
    },
    methods: {
      async getDetails() {
        let { id } = this.$route.query
        let [err, res] = await to(getNoticeDetails({ id }))
        if (!err) {
          let data = res.data
          this.Details = data
          let requestArr = data.attachments.map((v) => getFileDetail({ uuid: v }))
          Promise.all(requestArr).then((resArr) => {
            this.fileList = resArr.map((v) => v.data)
          })
        }
      },
      // 获取阅读详情
      async getRecords() {
        let params = {
          announcementId: this.$route.query.id,
          page: this.pagination.page,
          size: this.pagination.size,
        }
        this.loading = true
        let [err, res] = await to(getNoticeReadRecord(params))
        this.loading = false
        if (!err) {
          this.tableData = res.data.content
          this.pagination.total = res.data.totalElements
          this.originData = this.tableData
        }
      },
      // 分页事件
      tablePageChange(pagination) {
        this.pagination = JSON.parse(JSON.stringify(pagination))
        this.getRecords()
      },
      readClick: debounce(async function (item) {
        if (this.isDobleClick) {
          this.isDobleClick = false
          return false
        }
        let [err, res] = await to(getFilesId({ uuid: item.uuid }))
        if (!err) {
          let { data } = res
          this.priview(data)
        }
      }, 300),
      // 预览文件
      async priview(data) {
        let type = data.fileType || ''
        type = type.toLocaleUpperCase()
        if (type == 'JPG' || type == 'PNG' || type == 'GIF') {
          let loading = this.$loading({ target: '.container' })
          let [err, res] = await to(previewFile(data.uuid))
          loading.close()
          if (!err) {
            let blob = new Blob([res.data], { type: 'image/*' })
            this.previewUrl = window.URL.createObjectURL(blob)
            this.showViewer = true
          }
        } else if (type == 'PDF' || type == 'MP4') {
          this.fileTitle = data.name
          this.fileUuid = data.uuid
          this.fileType = data.fileType
          this.playFilePath = undefined
          this.showFile = true
        } else if ((type == 'SCORM' || type == 'H5') && data.playFilePath) {
          this.fileTitle = data.name
          this.fileUuid = data.uuid
          this.fileType = data.fileType
          this.playFilePath = data.playFilePath
          this.showFile = true
        } else {
          this.$message.closeAll()
          this.$message({
            message: this.$t('holder.CannotPreview&DoubleClickDownload'),
            type: 'warning',
          })
        }
      },
      // 关闭预览
      closeViewer() {
        this.showViewer = false
      },
      // 下载文件
      getAttachmentIdDownload(item) {
        this.isDobleClick = true
        getFileDownload({ uuid: item.uuid })
      },
      type(str) {
        switch (str + '') {
          case '1':
            return this.$t('table.publicInformation')
          case '2':
            return this.$t('table.notificationInformation')
          case '3':
            return this.$t('table.learningDocumentNotification')
          case '4':
            return this.$t('table.studyTask')
          default:
            return ''
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  @import '/@/style/table.scss';
  $borderStyle: 1px solid #ccc;
  .container {
    padding: 0;
  }
  .mytable-style {
    :deep(.unread) {
      color: #d9001b;
    }
  }
  .educations-form {
    .content-box {
      height: 100%;
      .content-header {
        padding-left: 12px;
        height: 44px;
        line-height: 44px;
        background: $textBg;
        font-size: 16px;
        font-weight: 700;
        color: $elButtonBg;
        .el-divider--vertical {
          width: 2px;
          height: 15px;
          vertical-align: unset;
          background: $elButtonBg;
        }
      }
      .content {
        padding: 16px;
        .danger {
          color: #d9001b;
        }
      }
      .header {
        height: 36px;
      }
      .message-con {
        word-break: break-word;
      }
      .downfile-link {
        margin-right: 20px;
        color: #215ebe;
        cursor: pointer;
      }
      .el-form-item__label {
        width: 6em;
      }
      .el-upload {
        display: block;
        text-align: left;
      }
      .table-box {
        padding: 16px;
      }
      .content-main {
      }
      .content-table {
        width: 100%;
        padding: 10px;
        height: calc(100% - 44px);
        box-sizing: border-box;
      }
    }
  }
</style>
