<template>
  <div class="coursewareDetails">
    <el-scrollbar>
      <div class="header warp-content-table">
        <div class="title">{{ coursewaresInfo.name }}</div>
        <el-row>
          <el-col :xs="18" :sm="18" :md="16" :lg="16" :xl="16">
            <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td>{{ $t('table.modelNumber') }}</td>
                <td>{{ coursewaresInfo.airplaneTypes }}</td>
                <td>{{ $t('table.attribute') }}</td>
                <td>{{ coursewaresInfo.properties }}</td>
              </tr>
              <tr>
                <td>{{ $t('table.system') }}</td>
                <td>{{ systemFormat(coursewaresInfo.systemTypes) }}</td>
                <td>{{ $t('table.publisher') }}</td>
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
          <el-col :xs="5" :sm="5" :md="7" :lg="7" :xl="7" :offset="1" class="review-wrapper">
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
      <div class="commentContanier">
        <div class="commentNum">
          <el-divider direction="vertical" />
          <span>{{ $t('button.reviewDetails') }}</span>
        </div>
        <div class="resultInfo">
          <div class="result">
            <span>{{ $t('table.currentResult') }}:</span>
            <el-button type="primary" size="mini"
              >{{ approvedNum }} {{ $t('common.approve') }}</el-button
            >
            <el-button type="danger" size="mini"
              >{{ rejectedNum }} {{ $t('status.filled') }}</el-button
            >
            <el-button type="info" size="mini"
              >{{ pendingNum }} {{ $t('common.notAudit') }}</el-button
            >
          </div>
          <div>
            <el-button
              type="primary"
              size="mini"
              @click="reviewClick('approval')"
              v-if="
                containsPermissions(menuName + ':REVIEW_RESULTS') && builtinRole == 'TRAINING_ADMIN'
              "
              :disabled="finished"
              >{{ $t('table.reviewResults') }}</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="reviewClick('approvalResults')"
              v-else-if="containsPermissions(menuName + ':REVIEW')"
              :disabled="finished"
              >{{ $t('common.Audit') }}</el-button
            >
          </div>
        </div>

        <div class="coursewareTableBox">
          <!-- 评审人员 -->
          <vxe-table
            border
            size="medium"
            class="mytable-style"
            header-cell-class-name="headerCellClassName"
            row-class-name="rowClassName"
            ref="coursewaresTable"
            :height="null"
            :data="coursewareApprovalResults"
          >
            <vxe-table-column type="seq" width="60" :title="$t('common.serialNumber')" />
            <vxe-table-column field="comment" :title="$t('table.reviewComments')" />
            <vxe-table-column field="approver" :title="$t('table.name')" />
            <vxe-table-column
              field="approverRole"
              :title="$t('table.role')"
              :formatter="roleFormat"
            />
            <vxe-table-column
              field="createdDate"
              :title="$t('table.reviewDate')"
              :formatter="formatDate"
            />
            <vxe-table-column
              field="status"
              :title="$t('table.reviewResults')"
              :formatter="formatStatus"
            />
          </vxe-table>
        </div>
      </div>
    </el-scrollbar>

    <el-dialog
      width="500px"
      center
      v-model="dialogVisible"
      :title="$t('table.reviewAndAudit')"
      :before-hide-method="beforeHideMethod"
      @closed="refreshDialogEvent"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item :label="$t('table.coursewareReviewResult')" prop="auditResults">
          <el-radio v-model="ruleForm.auditResults" label="1">{{ $t('common.agree') }}</el-radio>
          <el-radio v-model="ruleForm.auditResults" label="2">{{ $t('common.disagree') }}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('button.reason')" prop="reason">
          <el-input type="textarea" v-model="ruleForm.reason" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" plain @click="handelCancel">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handelSave">{{ $t('button.confirm') }}</el-button>
      </template>
    </el-dialog>

    <video-dialog
      v-if="videoDialogVisible"
      ref="Player"
      :videoDialog="videoDialogVisible"
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
    getCoursewareApprovalId,
    putCoursewareApprovalIdApprove,
    putCoursewareApprovalIdReject,
    putCoursewareApprovalResultsIdApprove,
    putCoursewareApprovalResultsIdReject,
  } from '/@/api/ftm/teacher/courseware'
  import videoDialog from '/@/views/project_ftm/teacher/myJob/courseware/assigned/components/videoPlayer.vue'
  import { FullScreen } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import { systemFormat } from './components/format'
  import { encode } from 'js-base64'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        menuName: 'COURSEWARE_APROVAL_LIST',
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
        coursewareApprovalResults: [],
        playerOptions: {
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
          // poster: this.cover_url, // 你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: this.$t('tip.cannotPlayVideo'), // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true, // 全屏按钮
          },
        },
        tableData: [],
        dialogVisible: false,
        approvedNum: undefined,
        pendingNum: undefined,
        rejectedNum: undefined,
        ruleForm: {
          auditResults: '1',
          reason: '',
        },
        rules: {
          reason: {
            required: true,
            message: `${this.$t('holder.pleaseEnter')}${this.$t('button.reason')}`,
            trigger: 'blur',
          },
        },
        type: '',
        finished: false,
        officeUrl: '',
        videoDialogVisible: false,
        showTool: false,
      }
    },
    computed: {
      builtinRole() {
        return userStore.builtinRole
      },
    },
    async created() {
      this.id = this.$route.query.id
      this.getCoursewareApprovalIdEvent((id) => this.getCoursewaresId(id))
    },
    unmounted() {
      clearInterval(this.Timer)
      this.Timer = null
    },
    components: { videoDialog, FullScreen },
    methods: {
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      getCoursewaresId(id) {
        // 课件详情
        return getCoursewaresId({
          id,
        }).then((res) => {
          if (res.status == 200) {
            this.coursewaresInfo.name = res.data.name
            this.coursewaresInfo.airplaneTypes = res.data.airplaneTypes.toString()
            this.coursewaresInfo.systemTypes = res.data.systemTypes.toString()
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
              // window.API.uri = `${import.meta.env.VITE_BASE_API_PUB}/open`;
            }
          }
        })
      },
      getCoursewareApprovalIdEvent(cb) {
        getCoursewareApprovalId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            this.coursewareApprovalResults = res.data.coursewareApprovalResults
            this.finished = res.data.status != 'PENDING'
            if (this.coursewareApprovalResults.length > 0) {
              this.approvedNum = this.coursewareApprovalResults.filter(
                (v) => v.status == 'APPROVED',
              ).length
              this.pendingNum = this.coursewareApprovalResults.filter(
                (v) => v.status == 'PENDING',
              ).length
              this.rejectedNum = this.coursewareApprovalResults.filter(
                (v) => v.status == 'REJECTED',
              ).length
            }
            cb && cb(res.data.coursewareId)
          }
        })
      },
      reviewClick(type) {
        this.dialogVisible = true
        this.type = type
      },
      handelSave() {
        let promise = null
        let data = {}
        if (this.type == 'approval') {
          // 教务员
          data.id = this.id
          data.reason = this.ruleForm.reason
          if (this.ruleForm.auditResults == '1') {
            promise = putCoursewareApprovalIdApprove
          } else {
            promise = putCoursewareApprovalIdReject
          }
        } else {
          // 教员
          data.comment = this.ruleForm.reason
          data.id = this.id

          if (this.ruleForm.auditResults == '1') {
            promise = putCoursewareApprovalResultsIdApprove
          } else {
            promise = putCoursewareApprovalResultsIdReject
          }
        }

        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            promise(data).then((res) => {
              if (res.status == 200) {
                this.$message.success(this.$t('tip.auditSuccessTip'))
                this.getCoursewareApprovalId()
                this.dialogVisible = false
              }
            })
          }
        })
      },
      handelCancel() {
        this.dialogVisible = false
        this.type = ''
      },
      beforeHideMethod() {
        this.dialogVisible = false
      },
      refreshDialogEvent() {
        this.$refs.ruleForm.resetFields()
      },
      formatStatus({ cellValue }) {
        return cellValue == 'APPROVED'
          ? this.$t('common.approve')
          : cellValue == 'PENDING'
          ? this.$t('status.inProgress')
          : this.$t('status.filled')
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      systemFormat(arr) {
        return Array.isArray(arr)
          ? arr.map((v) => systemFormat.call(this, v)).join(',')
          : arr
              .split(',')
              .map((v) => systemFormat.call(this, v))
              .join(',')
      },
      // 格式化角色
      roleFormat({ cellValue }) {
        switch (cellValue) {
          case 'THEORY_TEACHER':
            return this.$t('table.theoryTeacher')
          case 'FLIGHT_TEACHER':
            return this.$t('table.flightTeacher')
          case 'TRAINING_ADMIN':
            return this.$t('table.academicAdministrator')
          case 'PLANNER':
            return this.$t('table.planner')
          case 'CUSTOMER_CONTACTOR':
            return this.$t('table.customerOffice')
          default:
            return ''
        }
      },
      // 全屏显示预览
      fullScreenReview() {
        this.videoDialogVisible = true
      },
      closeVideo() {
        this.videoDialogVisible = false
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
  .coursewareDetails {
    .header {
      // height: 252px;
      background: #fff;
      padding: 16px;
      margin-bottom: 0;
      .title {
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: 700;
        text-align: left;
        color: #333333;
      }
      .player {
        width: 1920px * 0.2;
        height: 1080px * 0.2;
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
      height: calc(100% - 272px);
      background: #fff;
      .commentNum {
        height: 44px;
        line-height: 44px;
        background: $textBg;
        color: $elButtonBg;
        padding-left: 10px;
        font-size: 14px;
        margin-bottom: 14px;
        font-weight: 700;
        .el-divider--vertical {
          width: 2px;
          height: 15px;
          vertical-align: unset;
          background: $elButtonBg;
        }
      }
      .resultInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        margin-bottom: 20px;
        .result span {
          font-size: 14px;
          font-weight: bold;
          margin-right: 20px !important;
          display: inline-block;
        }
      }
      .coursewareTableBox {
        height: calc(100% - 124px);
        padding: 0 16px 16px 16px;
      }
    }
    .review {
      &-wrapper {
        position: relative;
        overflow: hidden;
      }
      &-wrapper:hover {
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
      &-office,
      &-scorm {
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          touch-action: none;
          user-select: none;
        }
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
  }
</style>
