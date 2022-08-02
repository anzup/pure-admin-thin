<template>
  <el-dialog
    custom-class="custom_dialog"
    :title="name"
    fullscreen
    v-model="videoDialog"
    @close="beforeHideMethod"
    @closed="handelClose"
    width="800px"
    height="625px"
    :zIndex="10000"
    :fullscreen="isFull"
  >
    <div v-if="videoTypeMethod(fileType)" class="video-container">
      <vue3-video-play
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
  import {
    postCoursewaresIdPlayStart,
    postCoursewaresIdPlayProgress,
  } from '/@/api/ftm/teacher/courseware'
  import XEUtils from 'xe-utils'
  import { setLMSValue } from './scorm'
  import { encode } from 'js-base64'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()

  export default {
    props: {
      videoDialog: {
        type: Boolean,
        default: false,
      },
      playId: {
        type: Number,
      },
      fileType: {
        type: String,
      },
      progress: {
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
      addListen: {
        type: Boolean,
        default: true,
      },
      isFull: {
        type: Boolean,
        default: false,
      },
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
          notSupportedMessage: this.$t('tip.cannotPlayVideo'), // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
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
    watch: {
      videoDialog(val) {
        if (val) {
          this.init()
        }
      },
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      player() {
        return this.$refs.videoPlayer.player
      },
    },
    mounted() {
      this.addListen && postCoursewaresIdPlayStart({ id: this.playId })
      this.init()
    },
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
          this.onStart()
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

          this.onStart()
        } else if (this.fileType == 'SCORM') {
          this.officeUrl = `${import.meta.env.VITE_BASE_API_PUB}/open/${this.fileUuid}/${
            this.playFilePath
          }`
          sessionStorage.setItem('scormId', this.playId)

          window.API_1484_11 &&
            typeof window.API_1484_11 === 'object' &&
            (window.API_1484_11.apiLogLevel = 4) // Log errors only
          window.API && typeof window.API === 'object' && (window.API.apiLogLevel = 4) // Log errors only
          // 1.2 开始与LMS的通信会话
          const that = this
          let userId = this.userInfo.id
          let coursewareId = this.playId
          const coursewareHistoryName = 'CMIElement' + userId + '_' + coursewareId
          let obj = this.progress || window.localStorage.getItem(coursewareHistoryName)
          // console.log('init-progress--', coursewareHistoryName, this.progress)
          if (this.progress) {
            window.localStorage.setItem(coursewareHistoryName, JSON.stringify(obj))
          }
          try {
            obj = obj ? JSON.parse(obj) : {}
          } catch (e) {
            obj = {}
          }
          if (!this.addListen) return
          window.API.on('LMSInitialize', function () {
            // postCoursewaresIdPlayStart({id: sessionStorage.getItem('scormId')})
            that.onStart()
            console.log('LMSInitialize')
          })
          // 1.2 SCORM终止函数
          // window.API.on("LMSFinish", function() {
          //   console.log('LMSFinish',)
          // });
          window.API.on('LMSGetValue', function (CMIElement) {
            // console.log('LMSGetValue', window.API)
            console.log('LMSGetValue', CMIElement)
            for (let [key, name] of Object.entries(obj)) {
              window.API.LMSSetValue(key, name)
            }
          })
          window.API.on('LMSSetValue', function (CMIElement, value) {
            // console.log('LMSSetValue', window.API)
            console.log('LMSSetValue', CMIElement, value)
            setLMSValue(CMIElement, value, JSON.stringify(obj))
            obj[CMIElement] = value
            window.localStorage.setItem(coursewareHistoryName, JSON.stringify(obj))
          })
          // window.API.on("LMSCommit", function() {
          //   console.log('LMSCommit', window.API)
          // });
          window.API.on('LMSFinish', function (value) {})
          // 2004 开始与LMS的通信会话
          window.API_1484_11.on('Initialize', function () {
            // postCoursewaresIdPlayStart({id: sessionStorage.getItem('scormId')})
            !that.Timer && that.onStart()
            console.log('Initialize')
            for (let [key, name] of Object.entries(obj)) {
              window.API_1484_11.SetValue(key, name)
            }
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
            setLMSValue(CMIElement, value, JSON.stringify(obj))
            obj[CMIElement] = value
            window.localStorage.setItem(coursewareHistoryName, JSON.stringify(obj))
          })
          window.API_1484_11.on('Terminate', function () {})
          window.API.on('finish', function (value) {
            console.log('finish 2', value)
          })
          // window.API_1484_11.on("Commit", function() {
          //   console.log('Commit', window.API_1484_11)
          // });
        } else if (this.fileType == 'H5') {
          this.officeUrl = `${import.meta.env.VITE_BASE_API_PUB}/open/${this.fileUuid}/${
            this.playFilePath
          }`
          const vm = this
          if (!this.addListen) return
          this.onStart()
        }
      },
      onStart() {
        // 记录 office or PDF 时间
        if (!this.addListen) return
        if (this.Timer) {
          clearInterval(this.Timer)
        }
        let vm = this
        sessionStorage.setItem('scormStartTime', new Date())
        vm.Timer = setInterval(() => {
          vm.duration += 1000
          if (vm.duration > 5000) {
            let now = new Date()
            let old = new Date(sessionStorage.getItem('scormStartTime'))
            sessionStorage.setItem('scormStartTime', new Date())
            let userId = this.userInfo.id
            let coursewareId = this.playId
            const coursewareHistoryName = 'CMIElement' + userId + '_' + coursewareId
            let progress = window.localStorage.getItem(coursewareHistoryName)
            let duration = Math.ceil((now - old) / 1000)
            duration = duration > 7 ? 7 : duration // 若修改了系统时间，计算时长超过7s统一取7s
            postCoursewaresIdPlayProgress({
              id: vm.playId,
              coursewareId: vm.playId,
              duration: duration,
              finished: false,
              progress: progress,
            })
              .then((res) => {
                if (res.status == 200) {
                  vm.duration = 0
                }
              })
              .catch(() => {
                clearInterval(vm.Timer)
              })
          }
        }, 1000)
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
      onPlayerEnded(player) {
        // 更新当前播放进度
        postCoursewaresIdPlayProgress({
          id: this.playId,
          coursewareId: this.playId,
          duration: this.duration / 1000,
          finished: true,
          progress: player.cache_.currentTime || '',
        })
      },
      onPlayerPlaying(player) {},
      onPlayerTimeupdate(player) {
        this.currentTime = player.cache_.currentTime

        if (!this.systemDuration) {
          this.systemDuration = XEUtils.now()
        } else {
          this.duration += XEUtils.now() - this.systemDuration
          this.systemDuration = XEUtils.now()

          if (this.duration / 1000 >= 5) {
            //Call progress
            postCoursewaresIdPlayProgress({
              id: this.playId,
              coursewareId: this.playId,
              duration: this.duration / 1000,
              finished: false,
              progress: player.cache_.currentTime || '',
            }).then((res) => {
              if (res.status == 200) {
                this.duration -= 5 * 1000
              }
            })
          }
        }
      },
      beforeHideMethod() {
        // 发请求
      },
      handelClose() {
        // console.log(this.fileType, 297)
        if (!this.addListen) {
          window.API.reset()
          window.API_1484_11.reset()
          this.$emit('beforeHideMethod')
        } else if (this.fileType == 'SCORM') {
          window.API.reset()
          window.API_1484_11.reset()
          setLMSValue('finish')
          this.officeUrl = ''
          sessionStorage.removeItem('scormStartTime')
          sessionStorage.removeItem('scormId')
          this.$emit('beforeHideMethod')
        } else {
          if (this.playId && this.fileType !== 'SCORM') {
            let { page, total } = this.position()
            postCoursewaresIdPlayProgress({
              id: this.playId,
              coursewareId: this.playId,
              duration: this.duration / 1000,
              finished: this.fileType == 'MP4' ? false : page >= total ? true : false,
              progress: this.fileType == 'MP4' ? this.currentTime : '',
            }).then((res) => {
              if (res.status == 200) {
                this.$emit('beforeHideMethod')
              }
            })
          }
        }
      },
      // 定位元素
      position() {
        try {
          let dom = document.querySelector('#iframescorm').contentWindow
          let pagination = dom.document.querySelector('#currentPageIndexTextField')
          let paginationHTML = pagination.value
          let [page, total] = paginationHTML.split('/')
          page = page.includes('-') ? page.split('-')[1] : page
          return { page, total }
        } catch (e) {
          return { page: 0, total: 1 }
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
    :deep(iframe) {
      width: 100%;
      height: 100%;
      border: none;
      padding: 0;
      margin: 0;
      &::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
      }
    }
  }
  .video-container {
    width: 100%;
    height: 100%;
    :deep(.video-js.vjs-fluid) {
      height: 100%;
      padding-top: 0;
    }
  }
</style>
