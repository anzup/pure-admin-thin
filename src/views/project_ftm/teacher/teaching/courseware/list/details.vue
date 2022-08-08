<template>
  <div class="courseware-container">
    <div class="header warp-content-table">
      <el-row type="flex" class="flex-row" :gutter="20">
        <el-col :xs="24" :md="16" :lg="14" :xl="14">
          <div class="title">{{ coursewaresInfo.name }}</div>
          <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td>{{ $t('table.modelNumber') }}</td>
              <td>{{ coursewaresInfo.airplaneTypes }}</td>
              <td>{{ $t('table.attribute') }}</td>
              <td>{{ coursewaresInfo.properties }}</td>
            </tr>
            <tr>
              <td>{{ $t('table.system') }}</td>
              <td>{{ filterSystem(coursewaresInfo.systemTypes) }}</td>
              <td>{{ $t('table.modelNumber') }}</td>
              <td>{{ coursewaresInfo.creatorName }}</td>
            </tr>
            <tr>
              <td>{{ $t('table.remarks') }}</td>
              <td>{{ coursewaresInfo.remark }}</td>
              <td />
              <td />
            </tr>
          </table>
        </el-col>
        <!-- <el-col :xs="6" :sm="6" :md="8" :lg="8" :xl="8">
          <img :src="iconSrc" class="iconSrc" @click="playerClick"/>
        </el-col> -->
        <el-col :xs="24" :md="10" :lg="10" :xl="10" class="review-mtop">
          <div v-if="videoTypeMethod(coursewaresInfo.fileType)" class="player">
            <vue3-video-play
              class="video-player vjs-custom-skin"
              ref="videoPlayer"
              :playsinline="true"
              v-bind="playerOptions"
            />
          </div>
          <div
            v-if="
              coursewaresInfo.fileType == 'PDF' ||
              coursewaresInfo.fileType == 'DOC' ||
              coursewaresInfo.fileType == 'DOCX' ||
              coursewaresInfo.fileType == 'EXCEL' ||
              coursewaresInfo.fileType == 'EXCELX' ||
              coursewaresInfo.fileType == 'PPT' ||
              coursewaresInfo.fileType == 'PPTX'
            "
            class="review-box"
          >
            <div class="review-office">
              <iframe
                ref="fileViewIframe"
                width="700px"
                height="1000px"
                scrolling="auto"
                allowfullscreen
                webkitallowfullscreen
                :src="officeUrl"
              />
            </div>
          </div>

          <div
            class="review-box"
            v-if="coursewaresInfo.fileType == 'SCORM' || coursewaresInfo.fileType == 'H5'"
          >
            <div class="review-scorm">
              <iframe
                ref="fileViewIframe"
                width="100%"
                height="100%"
                scrolling="no"
                allowfullscreen
                webkitallowfullscreen
                :src="officeUrl"
              />
            </div>
            <span class="play-button" @click="previewScorm">{{ $t('button.play') }}</span>
          </div>

          <div class="review-tool" v-if="showTool">
            <el-icon @click="fullScreenReview">
              <FullScreen />
            </el-icon>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- :style="{height: scrollerHeight}" -->
    <div class="commentContanier">
      <div class="commentNum">
        <el-divider direction="vertical" />
        <span>{{ $t('table.coursewareReview') }}（{{ commentNum }}）</span>
      </div>
      <!-- 评论 -->
      <div class="commentContent">
        <div class="coursewareCommentsBox">
          <div class="coursewareCommentsInfo">
            <el-input
              type="textarea"
              class="coursewareComments"
              :autosize="{ minRows: 2, maxRows: 4 }"
              :placeholder="$t('holder.pleaseEnter')"
              v-model="content"
            />
            <div>
              <el-button
                type="primary"
                class="submit"
                @click="postCoursewareComments"
                style="width: 138px"
                >{{ $t('button.submit') }}</el-button
              >
            </div>
          </div>
        </div>
        <div class="flex-hidden">
          <el-scrollbar>
            <ul class="commentBox">
              <li class="commentInfos" v-for="(item, index) in coursewareComments" :key="index">
                <div class="headPortrait">
                  <span>
                    <el-icon class="icon">
                      <Avatar />
                    </el-icon>
                  </span>
                </div>
                <div class="commentInfo">
                  <div class="name">{{ item.creator && item.creator.name }}</div>
                  <div class="time">{{ formatDate(item.createdDate) }}</div>
                  <div class="info">
                    <div class="info-txt">{{ item.content }}</div>
                    <div class="icons">
                      <img
                        :src="images.dianzan"
                        v-if="!item.liked"
                        class="dianzan"
                        @click="postCoursewareLikesIdComment(item.id)"
                      />
                      <img
                        :src="images.dianzan1"
                        v-if="item.liked"
                        class="dianzan"
                        @click="postCoursewareLikesIdComment(item.id)"
                      />
                      <span class="likeCount">{{ item.likeCount }}</span>
                      <img :src="images.huifu" class="huifu" @click="replyClick(item.id)" />
                      <span class="likeCount">{{ item.replyCount || 0 }}</span>
                      <img
                        :src="images.shanchu"
                        class="huifu"
                        v-show="item.creator && item.creator.id == userId"
                        @click="deleteCoursewareCommentsId(item.id)"
                      />
                      <span class="comment" @click="replyEvent(item, true)">{{
                        $t('button.reply')
                      }}</span>
                    </div>
                  </div>
                  <div>
                    <div style="overflow: hidden" v-if="item.replyStatus">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 3 }"
                        :placeholder="$t('holder.pleaseContent')"
                        v-model="item.replyCon"
                      />
                      <el-button
                        class="submit"
                        type="primary"
                        plain
                        size="mini"
                        @click="replyEvent(item, false)"
                        >{{ $t('button.cancel') }}</el-button
                      >
                      <el-button
                        type="primary"
                        size="mini"
                        class="submit"
                        @click="postCoursewareReplysComment(item.id, item.replyCon)"
                        >{{ $t('button.submit') }}</el-button
                      >
                    </div>

                    <!-- 回复课件评论 -->
                    <div
                      class="commentInfosChildren commentInfos"
                      v-for="(iItem, iIndex) in item.coursewareReplys || []"
                      :key="iIndex"
                    >
                      <div class="headPortrait">
                        <span>
                          <el-icon class="icon">
                            <Avatar />
                          </el-icon>
                        </span>
                      </div>
                      <div class="commentInfo">
                        <div class="name">
                          {{ iItem.creator && iItem.creator.name
                          }}<span class="ashy" v-if="iItem.replyToUser"
                            >&nbsp;{{ `@${iItem.replyToUser.name}` }}:</span
                          >
                        </div>
                        <div class="time">{{ formatDate(iItem.createdDate) }}</div>
                        <div class="info">
                          <div class="info-txt">{{ iItem.content }}</div>
                          <div class="icons">
                            <img
                              :src="images.dianzan"
                              v-if="!iItem.liked"
                              class="dianzan"
                              @click="postCoursewareLikesIdReply(iItem.id, item.id)"
                            />
                            <img
                              :src="images.dianzan1"
                              v-if="iItem.liked"
                              class="dianzan"
                              @click="postCoursewareLikesIdReply(iItem.id, item.id)"
                            />
                            <span class="likeCount">{{ iItem.likeCount }}</span>
                            <!-- <img src="@/assets/huifu.png" class="huifu" @click="coursewareReplysReplyClick(iItem.id)"/> -->
                            <img
                              :src="images.shanchu"
                              class="huifu"
                              v-show="iItem.creator && iItem.creator.id == userId"
                              @click="deleteCoursewareReplysId(iItem.id, item.id)"
                            />
                            <span class="comment" @click="replyEvent(iItem, true)">{{
                              $t('button.reply')
                            }}</span>
                          </div>
                        </div>
                        <div v-show="iItem.replyStatus">
                          <div style="overflow: hidden">
                            <el-input
                              type="textarea"
                              :autosize="{ minRows: 2, maxRows: 3 }"
                              :placeholder="$t('holder.pleaseContent')"
                              v-model="iItem.replyCon"
                            />
                            <el-button
                              class="submit"
                              type="primary"
                              plain
                              size="mini"
                              @click="replyEvent(iItem, false)"
                              >{{ $t('button.cancel') }}</el-button
                            >
                            <el-button
                              type="primary"
                              size="mini"
                              class="submit"
                              @click="postCoursewareReplysReply(iItem.id, item.id, iItem.replyCon)"
                              >{{ $t('button.submit') }}</el-button
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>

    <video-dialog-box
      v-if="videoDialog"
      ref="Player"
      :videoDialog="videoDialog"
      :playId="coursewaresInfo.playId"
      :fileType="coursewaresInfo.fileType"
      :fileUuid="coursewaresInfo.fileUuid"
      :playFilePath="coursewaresInfo.playFilePath"
      :name="coursewaresInfo.name"
      :addListen="false"
      :isFull="true"
      @beforeHideMethod="closeVideo"
    />
  </div>
</template>

<script>
  import {
    getCoursewaresId,
    getCoursewareComments,
    postCoursewareComments,
    getCoursewareReplys,
    postCoursewareReplysComment,
    postCoursewareReplysReply,
    postCoursewareLikesIdComment,
    postCoursewareLikesIdReply,
    deleteCoursewareCommentsId,
    deleteCoursewareReplysId,
  } from '/@/api/ftm/teacher/courseware'
  import videoDialogBox from './components/videoPlayer.vue'
  import { FullScreen, Avatar } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import { encode } from 'js-base64'
  import { useCoursewareStore } from '/@/store/modules/courseware'
  import dianzan from '/@/assets/ftm/dianzan.png'
  import dianzan1 from '/@/assets/ftm/dianzan1.png'
  import huifu from '/@/assets/ftm/huifu.png'
  import shanchu from '/@/assets/ftm/shanchu.png'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  const coursewareStore = useCoursewareStore()
  export default {
    data() {
      const playerOptions = {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:10', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            src: '', // 路径
            type: 'video/mp4', // 类型
          },
        ],
        notSupportedMessage: this.$t('tip.cannotPlayVideo'), // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, // 全屏按钮
        },
      }
      return {
        id: undefined,
        coursewaresInfo: {
          name: '',
          airplaneTypes: '',
          systemTypes: '',
          properties: '',
          creatorName: '',
          remark: '',
          fileType: '',
          fileUuid: '',
          playFilePath: '',
        },
        playerOptions,
        commentInfo: {
          page: 1,
          size: 100000,
          coursewareId: undefined,
        },
        commentNum: 0, // 总评论数量
        content: '', // 评论
        coursewareComments: [], // 评论list
        coursewareReplys: [], // 当前评论的回复list
        userId: undefined, // 当前用户id
        officeUrl: '',
        componentName: '',
        videoDialog: false,
        playId: undefined,
        fileUuid: '',
        fileType: '',
        playFilePath: '',
        name: '',
        iconSrc: '',
        showTool: false,
        images: {
          dianzan,
          dianzan1,
          huifu,
          shanchu,
        },
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      coursewareSystem() {
        return coursewareStore.system
      },
    },
    components: { videoDialogBox, FullScreen, Avatar },
    created() {
      this.id = this.$route.query.id
      this.commentInfo.coursewareId = this.id
      this.userId = this.userInfo.userId
      this.getCoursewaresId()
      this.getCoursewareComments()
      coursewareStore.UPDATE_SYSTEM()
    },
    methods: {
      handleCancel() {
        this.$router.go(-1)
      },
      beforeHideMethod() {
        this.componentName = ''
        this.videoDialog = false
        this.playId = undefined
        this.fileUuid = undefined
        this.fileType = undefined
        this.playFilePath = undefined
        this.name = undefined
      },
      playerClick() {
        ;(this.componentName = 'videoPlayer'), (this.videoDialog = true)
        this.playId = this.id
        this.fileUuid = this.coursewaresInfo.fileUuid
        this.fileType = this.coursewaresInfo.fileType
        this.playFilePath = this.coursewaresInfo.playFilePath
        this.name = this.coursewaresInfo.name
      },
      getCoursewaresId() {
        // 课件详情
        getCoursewaresId({
          id: this.id,
        }).then((res) => {
          if (res.status == 200) {
            this.coursewaresInfo.name = res.data.name
            this.coursewaresInfo.airplaneTypes = res.data.airplaneTypes.toString()
            this.coursewaresInfo.systemTypes = res.data.systemTypes
            this.coursewaresInfo.properties = res.data.properties.map((v) => v.name).toString()
            this.coursewaresInfo.creatorName = res.data.creator.name
            this.coursewaresInfo.remark = res.data.remark
            this.coursewaresInfo.fileType = res.data.fileType
            this.coursewaresInfo.fileUuid = res.data.fileUuid
            this.coursewaresInfo.playFilePath = res.data.playFilePath
            this.showTool =
              this.coursewaresInfo.fileType != 'MP4' && this.coursewaresInfo.fileType != 'SCORM'

            if (
              this.coursewaresInfo.fileType == 'MP4' ||
              this.coursewaresInfo.fileType == 'WMV' ||
              this.coursewaresInfo.fileType == 'MOV' ||
              this.coursewaresInfo.fileType == 'AVI'
            ) {
              this.playerOptions['sources'][0]['src'] = `${
                import.meta.env.VITE_BASE_API_PUB
              }/open/${res.data.fileUuid}/inline`
            } else if (this.coursewaresInfo.fileType == 'PDF') {
              let url = `${import.meta.env.VITE_BASE_API_PUB}/open/${res.data.fileUuid}/inline`
              this.officeUrl = `pdf/web/viewer.html?file=${encodeURIComponent(url)}`
            } else if (
              this.coursewaresInfo.fileType == 'DOC' ||
              this.coursewaresInfo.fileType == 'DOCX' ||
              this.coursewaresInfo.fileType == 'EXCEL' ||
              this.coursewaresInfo.fileType == 'EXCELX' ||
              this.coursewaresInfo.fileType == 'PPT' ||
              this.coursewaresInfo.fileType == 'PPTX'
            ) {
              let { origin } = window.location
              let url =
                import.meta.env.MODE === 'development' ? import.meta.env.VITE_BASE_URL : origin
              this.officeUrl =
                `${url}/kkfileview/onlinePreview?url=` +
                encodeURIComponent(encode(res.data.fileUuid))
            } else if (this.coursewaresInfo.fileType == 'SCORM') {
              // window.API && window.API.reset()
              // window.API_1484_11 && window.API_1484_11.reset()
              // this.officeUrl = `${import.meta.env.VITE_BASE_API_PUB}/open/${res.data.fileUuid}/${res.data.playFilePath}`
            }
          }
        })
      },
      getCoursewareComments() {
        // 评论总数
        getCoursewareComments(this.commentInfo).then((res) => {
          if (res.status == 200) {
            this.commentNum = res.data.totalElements
            let comments = res.data.content
            comments = comments.map((item) => {
              let origin = this.coursewareComments.find((v) => v.id == item.id)
              item = { ...item, replyStatus: false, replyCon: '' }
              if (origin) {
                item = { ...origin, ...item }
              }
              return item
            })
            this.coursewareComments = comments
          }
        })
      },
      postCoursewareComments() {
        // 课件 评论
        if (!this.content) return
        postCoursewareComments({
          content: this.content,
          coursewareId: this.id,
        }).then((res) => {
          if (res.status == 200) {
            this.content = ''
            this.getCoursewareComments()
            this.$message.success(this.$t('tip.commentsSuccessTip'))
          }
        })
      },
      getCoursewareReplys(id) {
        // 回复 评论
        getCoursewareReplys({
          page: 1,
          size: 10000,
          commentId: id,
        }).then((res) => {
          if (res.status == 200) {
            // this.coursewareReplys = res.data.content
            let index = this.coursewareComments.findIndex((v) => v.id == id)
            this.coursewareComments[index].coursewareReplys = res.data.content
          }
        })
      },
      async replyClick(id) {
        // this.coursewareComments.forEach(v => {
        //   v.replyStatus = false
        //   if (v.id == id) {
        //   v.replyStatus = true
        //     return
        //   }
        // })
        let comment = this.coursewareComments.find((v) => v.id == id)
        let index = this.coursewareComments.findIndex((v) => v.id == id)
        if (comment && comment.coursewareReplys) {
          this.coursewareComments[index].coursewareReplys = null
        } else {
          await this.getCoursewareReplys(id)
        }
      },
      replyEvent(item, bool) {
        item.replyStatus = Boolean(bool)
      },
      postCoursewareReplysComment(id, con) {
        if (!con) return
        postCoursewareReplysComment({
          commentId: id,
          content: con,
        }).then((res) => {
          if (res.status == 200) {
            this.getCoursewareReplys(id)
            let index = this.coursewareComments.findIndex((v) => v.id == id)
            this.coursewareComments[index].replyStatus = false
            this.coursewareComments[index].replyCon = ''
            this.$message.success(this.$t('tip.commentsSuccessTip'))
          }
        })
      },
      coursewareReplysReplyClick(id) {
        // 回复课件回复
        this.coursewareReplys.forEach((v) => {
          if (v.id == id) {
            v.replyStatus = true
            v.replyCon = ''
          }
        })
      },
      postCoursewareReplysReply(id, pid, con) {
        // 回复评论回复
        if (!con) return
        postCoursewareReplysReply({
          replyId: id,
          content: con,
        }).then((res) => {
          if (res.status == 200) {
            this.getCoursewareReplys(pid)
            this.$message.success(this.$t('tip.commentsSuccessTip'))
          }
        })
      },
      postCoursewareLikesIdComment(id) {
        // 评论点赞
        postCoursewareLikesIdComment({
          sourceId: id,
        }).then((res) => {
          if (res.status == 200) {
            this.getCoursewareComments()
            this.$message.success(this.$t('tip.subSuccessTip'))
          }
        })
      },
      postCoursewareLikesIdReply(id, pid) {
        // 回复点赞
        postCoursewareLikesIdReply({
          sourceId: id,
        }).then((res) => {
          if (res.status == 200) {
            this.getCoursewareReplys(pid)
            // this.$message.success(this.$t('tip.subSuccessTip'))
          }
        })
      },
      deleteCoursewareCommentsId(id) {
        // 删除评论
        this.$confirm(this.$t('common.deleteComment'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteCoursewareCommentsId({ id: id }).then((res) => {
            if (res.status == 200) {
              this.getCoursewareComments()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      deleteCoursewareReplysId(iId, id) {
        // 删除回复
        this.$confirm(this.$t('common.deleteComment'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteCoursewareReplysId({ id: iId }).then((res) => {
            if (res.status == 200) {
              this.getCoursewareReplys(id)
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      filterSystem(arr) {
        let systemName = []
        if (arr instanceof Array) {
          arr.forEach((name) => {
            let f =
              (this.coursewareSystem instanceof Array &&
                this.coursewareSystem.find((v) => v.key == name)) ||
              {}
            systemName.push(f.keyTranslation)
          })
          return systemName.join(',')
        } else {
          return ''
        }
      },
      // 全屏显示预览
      fullScreenReview() {
        this.videoDialog = true
      },
      closeVideo() {
        this.videoDialog = false
      },
      previewScorm($event) {
        let { fileUuid, playFilePath } = this.coursewaresInfo
        window.API && window.API.reset()
        window.API_1484_11 && window.API_1484_11.reset()
        this.officeUrl = `${import.meta.env.VITE_BASE_API_PUB}/open/${fileUuid}/${playFilePath}`
        this.showTool = true
        $event.target.remove()
      },
      videoTypeMethod(type) {
        let t = String(type).toLocaleLowerCase()
        if (t == 'mp4' || t == 'mov' || t == 'wmv' || t == 'avi') {
          return true
        } else {
          return false
        }
      },
    },
  }
</script>
<style scoped lang="scss">
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  @import '/@/style/table.scss';
  .courseware-container {
    display: flex;
    flex-direction: column;
    // margin: 24px;
    // height: calc(100vh - 230px);\
    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden !important;
    }
    padding: 0;
    background: none;
    .review-fix {
      width: 50vw;
      top: 0;
      right: 0;
    }
    .header {
      position: relative;
      // height: 172px;
      background: #fff;
      padding: 16px;
      margin-bottom: 0;
      flex-shrink: 0;
      .title {
        margin: 0 10px 20px 0;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Bold;
        font-weight: 700;
        text-align: left;
        color: #333333;
      }
      .info-table-box {
        margin-bottom: 20px;
      }
      .player {
        width: 60%;
        height: 220px;
        overflow: hidden;
      }
      .infos {
        margin-bottom: 20px;
        span {
          font-size: 14px;
        }
        .info {
          color: #8f8f8f;
          display: inline-block;
          margin-left: 10px;
        }
      }
    }
    .commentContanier {
      display: flex;
      flex-direction: column;
      flex: 1;
      background: #fff;
      position: relative;
      overflow: hidden;
      .commentContent {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }
      .commentNum {
        height: 54px;
        background: #fafafa;
        line-height: 54px;
        padding-left: 20px;
        font-size: 14px;
        background: $textBg;
        color: $elButtonBg;
        padding-left: 10px;
        font-size: 14px;
        margin-bottom: 30px;
        font-weight: 700;
        .el-divider--vertical {
          width: 2px;
          height: 15px;
          vertical-align: unset;
          background: $elButtonBg;
        }
      }
      .commentBox {
        // height: 240px;
        padding: 10px 10%;
        .commentInfos {
          display: flex;
          margin: 16px 0;
          .headPortrait {
            width: 49px;
            margin-right: 15px;
            span {
              width: 49px;
              height: 49px;
              border-radius: 50%;
              background: #215ebe;
              display: inline-block;
              text-align: center;
              line-height: 60px;
              .icon {
                color: #fff;
                font-size: 27px;
              }
            }
          }
          .commentInfo {
            width: calc(100% - 55px);
            .name {
              font-size: 14px;
              font-weight: 700;
              color: #333333;
              .ashy {
                font-weight: normal;
                color: #c1c1c1;
              }
            }
            .time {
              color: #bfbfbf;
              margin: 4px 0 12px 0;
            }
            .info {
              // display: flex;
              // justify-content: space-between;
              margin: 5px 0;
              .info-txt {
                display: inline-block;
                width: 100%;
                padding: 9px 12px;
                font-size: 14px;
                margin-bottom: 18px;
                color: #333;
                background: #f8f8f9;
              }
              .icons {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 16px;
                img {
                  width: 18px;
                  height: 18px;
                  object-fit: contain;
                  cursor: pointer;
                }
                .huifu {
                  margin-left: 21px;
                }
                .likeCount {
                  color: #bfbfbf;
                  display: inline-block;
                  margin-left: 5px;
                }
                .icon-delete {
                  color: red;
                  font-size: 20px;
                  margin-left: 21px;
                }
                .comment {
                  margin-left: 16px;
                  cursor: pointer;
                  color: #215ebe;
                  white-space: nowrap;
                }
                .delete {
                  cursor: pointer;
                }
              }
            }
            .submit {
              margin-top: 10px;
              margin-left: 10px;
              float: right;
            }
          }
        }
      }
      .coursewareCommentsBox {
        width: 100%;
        margin: 0 auto;
        .coursewareCommentsInfo {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-bottom: 20px;
          .coursewareComments {
            width: 80%;
            margin-bottom: 24px;
          }
        }
      }
      .commentBox::-webkit-scrollbar {
        display: none;
      }
    }
    .iconSrc {
      height: 45px;
      vertical-align: middle;
      cursor: pointer;
      margin-left: 20px;
    }

    .review {
      &-mtop {
        position: relative;
        overflow: hidden;
      }
      &-mtop:hover {
        .review-tool {
          transform: translateY(0);
        }
      }
      &-box {
        position: relative;
        width: 500px;
        height: 200px;
        overflow: hidden;
        .play-button {
          position: absolute;
          top: 50%;
          left: 40%;
          height: 30px;
          padding: 0 10px;
          border: 1px solid #777;
          font-size: 15px;
          color: #777;
          line-height: 30px;
          border-radius: 99px;
          cursor: pointer;
          transform: translate(-50%, -50%);
          box-shadow: 0 2px 5px rgba($color: #000000, $alpha: 0.2);
        }
      }
      &-office {
        width: 1920px;
        height: 1080px;
        transform: scale(0.5) translate(-50%, -50%);
      }
      &-scorm {
        width: 1920px;
        height: 1080px;
        transform: scale(0.2);
        transform-origin: left top;
      }
      &-tool {
        position: absolute;
        width: 384px;
        height: 30px;
        bottom: 0;
        text-align: right;
        line-height: 30px;
        background: rgba(#000, 0.5);
        transition: transform 0.2s;
        transform: translateY(100%);
        i {
          margin-right: 10px;
          font-size: 16px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
    .flex-row {
      width: 100%;
      flex-wrap: wrap;
    }
  }
  .flex-hidden {
    flex: 1;
    overflow: hidden;
  }
</style>
