<template>
  <el-dialog
    v-model="isShow"
    :title="name || $t('table.title')"
    :zIndex="10000"
    :before-close="beforeHideMethod"
    custom-class="custom_dialog"
    fullscreen
    @close="handelClose"
  >
    <div v-if="videoTypeMethod(fileType)">
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        v-bind="playerOptions"
        style="width: 100%; height: 100%"
        @play="onPlayerPlay($event)"
        @ready="playerReadied"
        @pause="onPlayerPause($event)"
        @ended="onPlayerEnded($event)"
        @playing="onPlayerPlaying($event)"
        @timeupdate="onPlayerTimeupdate($event)"
      />
    </div>
    <!-- v-if="fileType == 'PDF' || fileType == 'DOC' || fileType == 'DOCX'
  || fileType == 'EXCEL' || fileType == 'EXCELX' || fileType == 'PPT'
  || fileType == 'PPTX' || fileType == 'SCORM'" -->
    <div class="iframe-container" v-else>
      <iframe
        width="100%"
        height="auto"
        ref="offceIframe"
        id="iframescorm"
        allowfullscreen
        webkitallowfullscreen
        :src="officeUrl"
      />
    </div>
  </el-dialog>
</template>
<script>
  import { setLMSValue } from './scorm.ts'
  import { encode } from 'js-base64'
  export default {
    name: '',
    props: {
      videoDialog: Boolean,
      playId: {
        type: Number,
      },
      fileType: {
        type: String,
      },
      fileUuid: {
        type: String,
      },
      name: {
        type: String,
      },
      playFilePath: {
        type: String,
      },
    },
    model: {
      prop: 'videoDialog',
      event: 'change',
    },
    data() {
      return {
        duration: 0, // 视频观看时间
        systemDuration: undefined, // 当前系统时间
        currentTime: null, //当前观看时间点
        Timer: null, // 定时器
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
              src: `${import.meta.env.VITE_BASE_API_PUB}/open/${this.fileUuid}/inline`, // 路径
              type: 'video/mp4', // 类型
            },
          ],
          // poster: this.cover_url, // 你的封面地址
          // width: document.documentElement.clientWidth,
          notSupportedMessage: "this.$t('tip.cannotPlayVideo')", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true, // 全屏按钮
          },
        },
        officeUrl: '',
      }
    },
    // watch: {
    //     videoDialog(val) {
    //         if (val) {
    //             console.log(val);
    //             this.init();
    //         }
    //     },
    // },
    created() {
      this.init()
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      },
      isShow: {
        get() {
          return this.videoDialog
        },
        set(val) {
          this.$emit('change', val)
        },
      },
    },
    // mounted() {

    //     this.init();
    // },
    methods: {
      init() {
        if (
          this.fileType == 'MP4' ||
          this.fileType == 'WMV' ||
          this.fileType == 'MOV' ||
          this.fileType == 'AVI'
        ) {
          this.playerOptions['sources'][0]['src'] = `${import.meta.env.VITE_BASE_API_PUB}/open/${
            this.fileUuid
          }/inline`
        } else if (this.fileType == 'PDF') {
          let url = `${import.meta.env.VITE_BASE_API_PUB}/open/${this.fileUuid}/inline`
          this.officeUrl = `pdf/web/viewer.html?file=${encodeURIComponent(url)}`
        } else if (
          this.fileType == 'DOC' ||
          this.fileType == 'DOCX' ||
          this.fileType == 'EXCEL' ||
          this.fileType == 'EXCELX' ||
          this.fileType == 'PPT' ||
          this.fileType == 'PPTX'
        ) {
          let { origin } = window.location
          let url = import.meta.env.MODE === 'development' ? import.meta.env.VITE_BASE_URL : origin
          this.officeUrl =
            `${url}/kkfileview/onlinePreview?url=` + encodeURIComponent(encode(this.fileUuid))
        } else if (this.fileType == 'SCORM' || this.fileType == 'H5') {
          this.officeUrl = `${import.meta.env.VITE_BASE_API_PUB}/open/${this.fileUuid}/${
            this.playFilePath
          }`
          window.API_1484_11.apiLogLevel = 4 // Log errors only
          window.API.apiLogLevel = 4 // Log errors only

          // 1.2 开始与LMS的通信会话
          window.API.on('LMSInitialize', function () {
            console.log('LMSInitialize')
          })
          // 1.2 SCORM终止函数
          // window.API.on("LMSFinish", function() {
          //   console.log('LMSFinish',)
          // });
          window.API.on('LMSGetValue', function (CMIElement) {
            // console.log('LMSGetValue', window.API)
            console.log('LMSGetValue', CMIElement)
          })
          window.API.on('LMSSetValue', function (CMIElement, value) {
            // console.log('LMSSetValue', window.API)
            console.log('LMSSetValue', CMIElement, value)
            setLMSValue(CMIElement, value)
          })
          // window.API.on("LMSCommit", function() {
          //   console.log('LMSCommit', window.API)
          // });
          window.API.on('LMSFinish', function (value) {
            console.log('LMSFinish', value)
          })

          // 2004 开始与LMS的通信会话
          window.API_1484_11.on('Initialize', function () {
            console.log('Initialize')
          })
          // 2.4 SCORM终止函数
          // window.API_1484_11.on("Terminate", function() {
          //   console.log('Terminate',)
          // });
          window.API_1484_11.on('GetValue', function (CMIElement) {
            // console.log('GetValue',window.API_1484_11)
            console.log('GetValue', CMIElement)
          })
          window.API_1484_11.on('SetValue', function (CMIElement, value) {
            // console.log('SetValue',window.API_1484_11.cmi)
            console.log('SetValue', CMIElement, value)
            setLMSValue(CMIElement, value)
          })
          window.API.on('finish', function (value) {
            console.log('finish', value)
          })
          // window.API_1484_11.on("Commit", function() {
          //   console.log('Commit', window.API_1484_11)
          // });
        }
      },
      onPlayerPlay(player) {
        // 系统时间
        this.systemDuration = undefined
        // 开始播放
      },
      /* 设置视频开始的进度 */
      playerReadied(player) {
        player.currentTime(this.currentTime)
      },
      onPlayerPause(player) {
        this.systemDuration = undefined
      },
      onPlayerEnded(player) {},
      onPlayerPlaying(player) {},
      onPlayerTimeupdate(player) {},
      beforeHideMethod() {
        // 发请求
        if (this.fileType == 'SCORM') {
          window.API.reset()
          window.API_1484_11.reset()
          setLMSValue('finish')
          this.officeUrl = ''
          sessionStorage.removeItem('scormDuration')
          sessionStorage.removeItem('scormId')
          // this.$emit('beforeHideMethod')
        }
      },
      handelClose() {
        if (this.fileType == 'SCORM') {
          window.API.reset()
          window.API_1484_11.reset()
          setLMSValue('finish')
          this.officeUrl = ''
          sessionStorage.removeItem('scormDuration')
          sessionStorage.removeItem('scormId')
          // this.$emit('beforeHideMethod')
        }
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
    unmounted() {
      clearInterval(this.Timer)
      this.Timer = null
    },
  }
</script>
<style scoped lang="scss">
  .iframe-container {
    width: 100%;
    height: 100%;
  }
  .iframe-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
    margin: 0;
  }
  iframe::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
</style>
