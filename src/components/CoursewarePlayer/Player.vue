<template>
  <div>
    <vxe-modal
      v-model="showDialog"
      :fullscreen="isFull"
      :title="name"
      :zIndex="10000"
      className="player-model"
      destroy-on-close
      height="625"
      remember
      show-zoom
      width="800"
      @close="close"
      @show="open"
    >
      <div v-if="isVideo" ref="videoRef" class="w-full h-fulw-full"></div>
      <div v-else class="iframe-container">
        <iframe
          id="iframescorm"
          ref="offceIframe"
          :src="state.officeUrl"
          allowfullscreen
          height="auto"
          scrolling="no"
          webkitallowfullscreen
          width="100%"
        ></iframe>
      </div>
    </vxe-modal>
  </div>
</template>

<script lang="ts" setup>
  import dayjs from 'dayjs'
  import { computed, nextTick, reactive, ref } from 'vue'
  import { encode } from 'js-base64'
  import type XGPlayer from 'xgplayer'
  import { IPlayerOptions } from 'xgplayer'
  import Player from 'xgplayer/dist/simple_player'
  import volume from 'xgplayer/dist/controls/volume'
  import playbackRate from 'xgplayer/dist/controls/playbackRate'
  import { postCoursewaresIdPlayProgress, postCoursewaresIdPlayStart } from '/@/api/coursewares'
  import { setLMSValue } from './scorm'
  import { useUserStoreHook } from '/@/store/modules/user'

  const props = defineProps({
    modelValue: {
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
  })
  const emit = defineEmits<{
    (e: 'beforeHideMethod'): void
    (e: 'refresh'): void
    (e: 'update:modelValue', val: boolean): void
  }>()

  const showDialog = computed({
    get: () => props.modelValue,
    set(val: boolean) {
      emit('update:modelValue', val)
    },
  })

  interface State {
    playerOptions: IPlayerOptions
    officeUrl: string
    Timer: any
    duration: number
    systemDuration: number
    currentTime: number
  }

  const state = reactive<State>({
    // https://v2.h5player.bytedance.com/gettingStarted/#%E5%AE%89%E8%A3%85
    playerOptions: undefined,
    officeUrl: '',
    Timer: undefined,
    duration: 0, // 视频观看时间
    systemDuration: undefined, // 当前系统时间
    currentTime: null, //当前观看时间点
  })

  let xg: InstanceType<typeof XGPlayer> = undefined
  const videoRef = ref<HTMLElement>()

  const isVideo = computed(() => ['MP4', 'WMV', 'MOV', 'AVI'].includes(props.fileType))

  const store = useUserStoreHook()

  // 初始化
  const init = () => {
    if (isVideo.value) {
      if (!xg) {
        // 文件类型为视频,初始化视频播放器,下一次更新再加载,确保元素已经存在
        nextTick(() => {
          if (videoRef.value) {
            state.playerOptions = {
              el: videoRef.value,
              url: `${import.meta.env.VITE_BASE_URL + import.meta.env.VITE_BASE_API_PUB}/open/${
                props.fileUuid
              }/inline`,
              width: '100%',
              height: '100%',
              controlPlugins: [volume, playbackRate],
            }
            xg = new Player(state.playerOptions)
            // 给播放器实例挂载事件
            xg.on('play', playerPlay)
            xg.on('canplay', playerReadied)
            xg.on('pause', playerPause)
            xg.on('ended', playerEnded)
            xg.on('timeupdate', playerTimeupdate)
          }
        })
      } else {
        xg.src = `${import.meta.env.VITE_BASE_URL + import.meta.env.VITE_BASE_API_PUB}/open/${
          props.fileUuid
        }/inline`
      }
    } else if (props.fileType == 'PDF') {
      let url = `${import.meta.env.VITE_BASE_URL + import.meta.env.VITE_BASE_API_PUB}/open/${
        props.fileUuid
      }/inline`
      state.officeUrl = `pdf/web/viewer.html?file=${encodeURIComponent(url)}`
      onStart()
    } else if (['DOC', 'DOCX', 'EXCEL', 'EXCELX', 'PPT', 'PPTX'].includes(props.fileType)) {
      let { origin } = window.location
      let url = import.meta.env.MODE === 'development' ? import.meta.env.VITE_BASE_URL : origin
      state.officeUrl =
        `${url}/kkfileview/onlinePreview?url=` + encodeURIComponent(encode(props.fileUuid))
      onStart()
    } else if (props.fileType == 'SCORM') {
      state.officeUrl = `${
        import.meta.env.VITE_BASE_URL + import.meta.env.VITE_BASE_API_PUB
      }/open/${props.fileUuid}/${props.playFilePath}`
      sessionStorage.setItem('scormId', props.playId + '')

      window.API_1484_11.apiLogLevel = 4 // Log errors only
      window.API.apiLogLevel = 4 // Log errors only
      // 1.2 开始与LMS的通信会话
      let coursewareId = props.playId
      const coursewareHistoryName = 'CMIElement' + store.userId + '_' + coursewareId
      let obj: any = props.progress || window.localStorage.getItem(coursewareHistoryName)
      // console.log('init-progress--', coursewareHistoryName, this.progress)
      if (props.progress) {
        window.localStorage.setItem(coursewareHistoryName, JSON.stringify(obj))
      }
      try {
        obj = obj ? JSON.parse(obj) : {}
      } catch (e) {
        obj = {}
      }
      if (!props.addListen) return
      window.API.on('LMSInitialize', function () {
        // postCoursewaresIdPlayStart({id: sessionStorage.getItem('scormId')})
        onStart()
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
        !state.Timer && onStart()
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
    } else if (props.fileType == 'H5') {
      state.officeUrl = `${
        import.meta.env.VITE_BASE_URL + import.meta.env.VITE_BASE_API_PUB
      }/open/${props.fileUuid}/${props.playFilePath}`
      if (!props.addListen) return
      onStart()
    }
  }

  const onStart = () => {
    // 记录 office or PDF 时间
    if (!props.addListen) return
    if (state.Timer) {
      clearInterval(state.Timer)
    }

    sessionStorage.setItem('scormStartTime', new Date().toISOString())
    state.Timer = setInterval(() => {
      state.duration += 1000
      if (state.duration > 5000) {
        let now = dayjs().valueOf()
        let old = dayjs(sessionStorage.getItem('scormStartTime')).valueOf()
        sessionStorage.setItem('scormStartTime', new Date().toISOString())
        let coursewareId = props.playId
        const coursewareHistoryName = 'CMIElement' + store.userId + '_' + coursewareId
        let progress = window.localStorage.getItem(coursewareHistoryName)
        let duration = Math.ceil((now - old) / 1000)
        duration = duration > 7 ? 7 : duration // 若修改了系统时间，计算时长超过7s统一取7s
        postCoursewaresIdPlayProgress({
          id: props.playId,
          coursewareId: props.playId,
          duration: duration,
          finished: false,
          progress: progress,
        })
          .then((res) => {
            state.duration = 0
          })
          .catch(() => {
            clearInterval(state.Timer)
          })
      }
    }, 1000)
  }

  // 开始播放
  const playerPlay = (player: XGPlayer) => {
    // console.log(player)

    // 系统时间
    state.systemDuration = undefined
  }

  const playerReadied = (player: XGPlayer) => {
    console.log(player)
  }
  const playerPause = (player) => {
    state.systemDuration = undefined
  }
  const playerEnded = (player: XGPlayer) => {
    console.log('playerEnded')

    // 更新当前播放进度
    postCoursewaresIdPlayProgress({
      id: props.playId,
      coursewareId: props.playId,
      duration: state.duration / 1000,
      finished: true,
      progress: player.currentTime || null,
    })
  }

  const playerTimeupdate = (player: XGPlayer) => {
    state.currentTime = player.currentTime

    if (!state.systemDuration) {
      state.systemDuration = dayjs().valueOf()
    } else {
      state.duration += dayjs().valueOf() - state.systemDuration
      state.systemDuration = dayjs().valueOf()

      if (state.duration / 1000 >= 5) {
        //Call progress
        postCoursewaresIdPlayProgress({
          id: props.playId,
          coursewareId: props.playId,
          duration: state.duration / 1000,
          finished: false,
          progress: player.currentTime || '',
        }).then((res) => {
          if (res.status == 200) {
            state.duration -= 5 * 1000
          }
        })
      }
    }
  }

  const open = () => {
    props.addListen && postCoursewaresIdPlayStart({ id: props.playId })
    init()
  }
  const close = () => {
    if (xg) xg.src = ''
    xg = undefined
    clearInterval(state.Timer)
    emit('refresh')
  }
</script>

<style lang="scss" scoped>
  .iframe-container {
    width: 100%;
    height: 100%;

    :deep iframe {
      width: 100%;
      height: calc(100% - 3px);
      border: none;
      padding: 0;
      margin: 0;

      &::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
      }
    }
  }
</style>
