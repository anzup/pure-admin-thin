<template>
  <div class="educations-form">
    <el-scrollbar>
      <div class="content-box">
        <div class="content-header">
          <el-divider direction="vertical" />
          <span>{{ $t('table.contentDetails') }}</span>
        </div>
        <div class="content warp-content-table" ref="detailTable">
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
              <td><div class="message-con w-e-text" v-html="Details.content" /></td>
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
                  ><Paperclip />{{ item.name }}</span
                >
              </td>
            </tr>
          </table>
        </div>
        <div
          class="content-main"
          v-show="
            Details.type &&
            Details.type != 1 &&
            (userInfo.teacherAdmin || Details.createdBy == userInfo.userId)
          "
        >
          <div class="content-header">
            <el-divider direction="vertical" />
            <span>{{ $t('button.readMore') }}</span>
          </div>
          <div class="content-table">
            <DetailTable
              :Details="Details"
              :loading="loading"
              v-model:data="tableData"
              :origin="originData"
              :pagination="pagination"
              :printFunc="getAllData"
              :printDOM="getPrintHTML"
              @change="tableFilterChange"
              @export="tableExportEvent"
              @handlePagination="tablePageChange"
            />
          </div>
        </div>
      </div>
    </el-scrollbar>
    <PreviewFile
      v-if="showFile"
      v-model="showFile"
      :fileType="fileType"
      :fileUuid="fileUuid"
      :playFilePath="playFilePath"
      :name="fileTitle"
    />
    <el-image-viewer v-if="showViewer" :url-list="[previewUrl]" @close="closeViewer" />
  </div>
</template>
<script>
  import {
    getNoticeDetails,
    getNoticeReadRecord,
    postNoticeReadRecordExport,
  } from '/@/api/ftm/teacher/education'
  import { getFileDetail, previewFile, getFilesId } from '/@/api/ftm/teacher/file'
  import PreviewFile from '/@/views/project_ftm/teacher/myJob/fileCenter/download/components/previewFile.vue'
  import { Paperclip } from '@element-plus/icons-vue'
  import DetailTable from './components/detailTable.vue'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        Details: {},
        form: {
          hasRead: undefined,
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
        pageLoading: false,
        pagination: {
          page: 1,
          size: 10,
          total: 0,
        },
      }
    },
    components: {
      PreviewFile,
      Paperclip,
      DetailTable,
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    async created() {
      await this.getDetails()
      ;(this.userInfo.teacherAdmin || this.Details.createdBy == this.userInfo.userId) &&
        this.getRecords()
    },
    methods: {
      async getDetails() {
        let { id } = this.$route.query
        let [err, res] = await to(getNoticeDetails({ id }))
        if (!err) {
          let data = res.data
          this.Details = {
            ...data,
            content: data.content ? data.content.replace(/[\n]/g, '</br>') : '',
          }
          let requestArr = data.attachments.map((v) => getFileDetail({ uuid: v }))
          Promise.all(requestArr).then((resArr) => {
            this.fileList = resArr.map((v) => v.data)
          })
        }
      },
      // 获取公告阅读详情
      async getRecords() {
        let params = {
          announcementId: this.$route.query.id,
          page: this.pagination.page,
          size: this.pagination.size,
          ...this.form,
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
      // 获取所有阅读详情
      getAllData() {
        let params = { announcementId: this.$route.query.id, size: 1000 }
        return getNoticeReadRecord(params)
      },
      // 获取打印拼接表格的html
      getPrintHTML() {
        return {
          dom: this.$refs.detailTable.innerHTML,
          style: `
                    .info-table-box {
                        width: 100%;
                        border-top: 1px solid #E6E6E6;
                        border-left: 1px solid #E6E6E6;
                        border-collapse: collapse;
                    }
                    .info-table-box td{
                        padding: 10px 5px;
                        font-size: 14px;
                        text-align: center;
                        border-right: 1px solid #E6E6E6;
                        border-bottom: 1px solid #E6E6E6;
                        color: #606266;
                    }
                    .info-table-box td:nth-of-type(2n + 1) {
                        width: 9%;
                        background-color: #f8f8f9;
                        font-weight: 700;
                    }
                    .info-table-box td:nth-of-type(2n) {
                        width: 15%;
                        text-align: left;
                        padding: 10px 20px;
                        font-weight: 400;
                    }
                    .info-table-box td .el-form-item{
                        margin-bottom: 0;
                    }
                    .info-table-box td .el-form-item__label{
                        line-height: 1;
                    }
                    .label-require-point{
                        color: #d44949;
                        margin-right: 4px;
                    }
                    .downfile-link{
                        margin-right: 20px;
                        color: #215EBE;
                        cursor: pointer;
                    }
                `,
        }
      },
      // 分页事件
      tablePageChange(pagination) {
        this.pagination = JSON.parse(JSON.stringify(pagination))
        this.getRecords()
      },
      // 切换阅读状态
      tableFilterChange(value) {
        this.form.hasRead = value
        this.pagination.page = 1
        this.pagination.size = 10
        this.pagination.total = 0
        this.getRecords()
      },
      type(str) {
        switch (str + '') {
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
      async readClick(item) {
        let [err, res] = await to(getFilesId({ uuid: item.uuid }))
        if (!err) {
          let { data } = res
          this.priview(data)
        }
      },
      // 预览文件
      async priview(data) {
        if (data.fileType == 'JPG' || data.fileType == 'PNG' || data.fileType == 'GIF') {
          this.pageLoading = true
          let [err, res] = await to(previewFile(data.uuid))
          this.pageLoading = false
          if (!err) {
            let blob = new Blob([res.data], { type: 'image/*' })
            this.previewUrl = window.URL.createObjectURL(blob)
            this.showViewer = true
          }
        } else if (
          data.fileType == 'PDF' ||
          data.fileType == 'MP4' ||
          data.fileType == 'DOC' ||
          data.fileType == 'DOCX' ||
          data.fileType == 'EXCEL' ||
          data.fileType == 'EXCELX' ||
          data.fileType == 'PPT' ||
          data.fileType == 'PPTX'
        ) {
          this.fileTitle = data.name
          this.fileUuid = data.uuid
          this.fileType = data.fileType
          this.playFilePath = undefined
          this.showFile = true
        } else if ((data.fileType == 'SCORM' || data.fileType == 'H5') && data.playFilePath) {
          this.fileTitle = data.name
          this.fileUuid = data.uuid
          this.fileType = data.fileType
          this.playFilePath = data.playFilePath
          this.showFile = true
        } else {
          this.$message({
            message: this.$t('holder.CannotPreview&DoubleClickDownload'),
            type: 'warning',
          })
        }
      },
      // 导出表格
      async tableExportEvent() {
        const data = {
          id: this.$route.query.id,
        }
        const [err, res] = await to(postNoticeReadRecordExport(data))
        if (!err && res.status == 200) {
        }
      },
      // 关闭预览
      closeViewer() {
        this.showViewer = false
      },
    },
    filters: {
      count(num) {
        let n = parseInt(num)
        return Number.isNaN(n) ? 0 : n
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  @import '/@/style/table.scss';
  $borderStyle: 1px solid #ccc;
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
      .message-con {
        word-break: break-word;
      }
      // .el-form-item__label{
      //     width: 6em;
      // }
      .el-upload {
        display: block;
        text-align: left;
      }
      .downfile-link {
        margin-right: 20px;
        color: #215ebe;
        cursor: pointer;
      }
      .table-box {
        padding: 16px;
      }
      .content-main {
        height: calc(100% - 44px - 213px);
      }
      .content-table {
        width: 100%;
        padding: 10px;
        //height: calc(100% - 44px);
        box-sizing: border-box;
      }
    }
  }
</style>
