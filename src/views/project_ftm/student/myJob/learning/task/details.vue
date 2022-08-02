<template>
  <div class="educations-form">
    <div class="content-box">
      <div class="content-header">{{ Details.title || '' }}</div>
      <div class="content-nav">
        <span class="tag" v-for="(item, index) in Details.tags || []" :key="index"
          >【{{ item }}】</span
        >
        <span class="datetime">{{ formatDate(Details.createdDate) }}</span>
      </div>
      <p class="content-divider" />
      <div class="content">{{ Details.content || '' }}</div>
      <div class="content-download-file" v-if="files.length">
        <div class="content-file" v-for="item in files" :key="item.id">
          <span @click="previewFile(item)"
            ><el-icon><Paperclip /></el-icon>{{ `${item.name}${item.suffix}` }}</span
          >
        </div>
      </div>
    </div>

    <!--<video-player-->
    <!--  :videoDialog="videoDialogVisible"-->
    <!--  :name="preview.name"-->
    <!--  :addListen="false"-->
    <!--  :playId="preview.playId"-->
    <!--  :fileType="preview.fileType"-->
    <!--  :fileUuid="preview.fileUuid"-->
    <!--  :playFilePath="preview.playFilePath"-->
    <!--  @beforeHideMethod="beforeHideMethod"-->
    <!--/>-->
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[previewURL]" />
  </div>
</template>

<script>
  import videoPlayer from '/@/views/project_ftm/student/myJob/myCourseware/list/components/videoPlayer.vue'
  import { Paperclip } from '@element-plus/icons-vue'
  import { postMessage, putMessage } from '/@/api/ftm/student/education'
  import { detailsFiles } from '/@/api/ftm/student/file'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        Details: {},
        loading: false,
        files: [],
        preview: {},
        videoDialogVisible: false,
        showViewer: false,
        previewURL: '',
      }
    },
    created() {
      this.getDetails()
    },
    components: {
      Paperclip,
      videoPlayer,
    },
    methods: {
      async getDetails() {
        let { id } = this.$route.query
        let [err, res] = await to(postMessage({ id }))
        if (err) return false
        let { data } = res
        this.Details = data
        if (!(data.attachments instanceof Array) || !data.attachments.length) {
          // 无预览文件
          await putMessage({ id, hasRead: true })
        } else {
          // 有文件预览
          let [fileErr, files] = await to(detailsFiles({ uuids: data.attachments.join(',') }))
          if (!fileErr) {
            this.files = files.data
          }
        }
      },
      closeViewer() {
        this.showViewer = false
      },
      previewFile(row) {
        let type = row.fileType.toString().toLocaleUpperCase()
        if (type == 'JPG' || type == 'PNG' || type == 'GIF') {
          this.previewURL = `${import.meta.env.VITE_BASE_API_PUB}/open/${row.uuid}/inline`
          this.showViewer = true
        } else if (
          type == 'PDF' ||
          type == 'MP4' ||
          type == 'DOC' ||
          type == 'DOCX' ||
          type == 'EXCEL' ||
          type == 'EXCELX' ||
          type == 'PPT' ||
          type == 'PPTX'
        ) {
          this.preview = {
            playId: row.id,
            fileUuid: row.uuid,
            fileType: row.fileType,
            playFilePath: undefined,
            name: row.name,
          }
          this.videoDialogVisible = true
        } else if ((type == 'SCORM' || type == 'H5') && row.playFilePath) {
          this.preview = {
            playId: row.id,
            fileUuid: row.uuid,
            fileType: row.fileType,
            playFilePath: row.playFilePath,
            name: row.name,
          }
          this.videoDialogVisible = true
        } else {
          this.$message({
            message: this.$t('holder.CannotPreview'),
            type: 'warning',
          })
        }
        row.preview = true
        let allRead = this.files.every((v) => v.preview)
        let { id } = this.$route.query
        allRead && putMessage({ id, hasRead: true })
      },
      beforeHideMethod() {
        this.videoDialogVisible = false
        this.preview.playId = undefined
        this.preview.fileUuid = undefined
        this.preview.fileType = undefined
        this.preview.playFilePath = undefined
        this.preview.name = undefined
      },
      // 筛选表格
      filterTable(val) {
        if (val == '') {
          // 全部
          this.tableData = [].concat(this.originData)
        } else {
          this.tableData = this.originData.filter((v) => v.hasRead == val)
        }
      },
      formatDate(date) {
        let d = new Date(date)
        return d.getDate() ? XEUtils.toDateString(d, 'yyyy-MM-dd') : ''
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
  .educations-form {
    .content {
      color: #333333;
      &-header {
        font-size: 18px;
        text-align: center;
        line-height: 32px;
        font-weight: 700;
      }
      &-nav {
        zoom: 1;
        overflow: hidden;
        color: #bfbfbf;
        .tag {
          margin-right: 12px;
          font-size: 14px;
        }
        .datetime {
          float: right;
          font-size: 14px;
        }
      }
      &-divider {
        margin: 10px 0;
        border-bottom: 1px solid #dcdfe6;
      }
      & {
        margin: 20px 0;
        font-size: 14px;
        line-height: 2;
        text-indent: 2em;
      }
      &-download-file {
        margin: 50px 0 10px;
        padding: 12px;
        border: 1px solid #ccc;
      }
      &-file {
        margin-left: 30px;
        font-size: 14px;
        line-height: 28px;
        span {
          position: relative;
          cursor: pointer;
          i {
            position: absolute;
            top: 50%;
            left: -26px;
            transform: translateY(-50%);
            font-size: 18px;
            visibility: hidden;
          }
        }
        span:hover {
          color: #17adfc;
          text-decoration: underline;
          i {
            visibility: visible;
          }
        }
      }
    }
  }
</style>
