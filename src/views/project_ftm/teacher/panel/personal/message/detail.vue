<template>
  <div>
    <div class="MessageCenterDetails">
      <div class="header">{{ announcement.title }}</div>
      <div class="navbar">
        <div class="tag" v-for="(item, index) in tags" :key="index">{{ `【${item}】` }}</div>
        <div class="time">{{ createdDate }}</div>
      </div>

      <div class="content">
        <div class="text-con w-e-text" v-html="announcement.content" />
        <div class="file-con" v-if="fileList && fileList.length">
          <ul>
            <li v-for="(item, index) in fileList" :key="index">
              <span
                :class="{ visited: item.read }"
                @click="readClick(item)"
                @dblclick="getAttachmentIdDownload(item)"
              >
                <el-icon> <Paperclip /> </el-icon>{{ item.name + item.suffix }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <PreviewFile
      v-if="showFile"
      v-model="showFile"
      :fileType="fileType"
      :fileUuid="fileUuid"
      :playFilePath="playFilePath"
      :name="fileTitle"
    />
    <el-image-viewer v-if="showViewer" @close="closeViewer" :url-list="[url]" />
  </div>
</template>
<script>
  import { getMessagesId, putMessagesId, putMessageMarkRead } from '/@/api/ftm/teacher/personCenter'
  import { getFileDownload, getFilesId, previewFile } from '/@/api/ftm/teacher/file'
  import moment from 'moment'
  import PreviewFile from '/@/views/project_ftm/teacher/myJob/fileCenter/download/components/previewFile.vue'
  import { Paperclip } from '@element-plus/icons-vue'
  import to from 'await-to-js'
  export default {
    name: 'MessageCenterDetails',
    components: {
      PreviewFile,
      Paperclip,
    },
    data() {
      return {
        id: null,
        createdDate: '',
        announcement: {
          title: '',
          content: '',
        },
        fileList: [],
        readList: [],
        tags: [],
        showFile: false,
        timers: null,
        showViewer: false,
        url: '',
        fileType: undefined,
        fileUuid: undefined,
        playFilePath: undefined,
        fileTitle: undefined,
      }
    },
    watch: {
      showFile(bool) {
        if (Boolean(bool) == false) {
          this.handleSetRead()
        }
      },
      showViewer(bool) {
        if (Boolean(bool) == false) {
          this.handleSetRead()
        }
      },
    },
    created() {
      //   console.log(this.$route);
      this.id = this.$route.params.detail
    },
    mounted() {
      this.getMessagesId()
    },
    methods: {
      // 关闭查看器
      closeViewer() {
        this.showViewer = false
      },
      async readClick(item) {
        if (!this.readList.includes(item.uuid)) {
          this.readList.push(item.uuid)
        }
        try {
          const { data } = await getFilesId({ uuid: item.uuid })
          this.priview(data)
          if (!!item.read == false) {
            let [err, res] = await to(putMessageMarkRead({ id: +this.id, uuid: item.uuid }))
            if (!err && res.status == 200) {
              item.read = true
            }
          }
        } catch (error) {
          console.log(error)
        }
      },
      priview(data) {
        let timers = this.timer
        if (timers) {
          window.clearTimeout(timers)
          this.timer = null
        }
        this.timer = window.setTimeout(() => {
          if (data.fileType == 'JPG' || data.fileType == 'PNG' || data.fileType == 'GIF') {
            previewFile(data.uuid).then((res) => {
              let blob = new Blob([res.data], { type: 'image/*' })
              this.url = window.URL.createObjectURL(blob)
              this.showViewer = true
            })
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
        }, 300)
      },
      getAttachmentIdDownload(item) {
        let timers = this.timer
        if (timers) {
          window.clearTimeout(timers)
          this.timer = null
        }
        getFileDownload({ uuid: item.uuid })
      },
      cancelBtn() {
        this.$router.go(-1)
      },
      getMessagesId() {
        getMessagesId({ id: this.id }).then(async (res) => {
          if (res.status == 200) {
            this.createdDate = moment(res.data.createdDate).format('YYYY-MM-DD HH:mm:ss')
            this.announcement = {
              ...res.data,
              content: res.data.content.replace(/[\n]/g, '</br>'),
            }
            this.tags = res.data.tags
            this.fileList = res.data.attInfos
            this.readList = res.data.attInfos.filter((file) => file.read)
            if (this.fileList instanceof Array && this.fileList.length == 0) this.readMessage()
          }
        })
      },
      // 标记已读
      async readMessage() {
        await to(putMessagesId({ id: this.id, hasRead: true }))
        // TODO 标记-1
        // this.$store.commit('settings/SET_UPDATEBUM', this.id)
      },
      // 是否标记已读
      handleSetRead() {
        if (this.readList.length == this.fileList.length || this.fileList.length == 0) {
          this.readMessage()
        }
      },
    },
  }
</script>
<style scoped lang="scss">
  .MessageCenterDetails {
    font-size: 14px;
    .header {
      display: block;
      font-size: 18px;
      text-align: center;
      margin: 0;
      font-weight: 700;
      color: #333333;
    }
    .navbar {
      padding: 0 0 10px 0;
      overflow: hidden;
      border-bottom: 1px solid #f1f1f1;
      color: #bfbfbf;
      .time {
        float: right;
        font-size: 14px;
      }
    }

    .content {
      margin: 20px 0;
      font-size: 14px;
      line-height: 26px;
      word-break: break-word;
      color: #333333;
    }
    .footer {
      margin-top: 30px;
      width: 100%;
      text-align: center;
    }
  }
  .text-con {
    margin-bottom: 20px;
  }
  .file-con {
    margin: 30px 0 10px;
    border: 1px solid #f1f1f1;
    ul {
      padding: 0;
      list-style: none;
      li {
        position: relative;
        padding-left: 24px;
        font-size: 0;
        line-height: 28px;
        span {
          color: #409eff;
          cursor: pointer;
          font-size: 14px;
          i {
            position: absolute;
            font-size: 16px;
            top: 50%;
            left: 0;
            margin-top: -10px;
          }
        }
        span:hover {
          text-decoration: underline;
        }
        span.visited {
          color: #5840ff;
        }
      }
    }
  }
</style>
