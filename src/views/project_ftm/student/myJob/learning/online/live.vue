<template>
  <el-scrollbar>
    <div id="Container">
      <div class="live-main">
        <header class="live-header">
          <div class="live-title">
            <h2>{{ liveInfo.name || '' }}</h2>
          </div>
          <div class="nav-right">
            <span
              >{{ $t('table.LiveTeacher') }}：{{ liveInfo.user ? liveInfo.user.name : '' }}</span
            >
          </div>
        </header>
        <div class="live-wrapper">
          <section class="live-box">
            <div class="live-video-wrapper">
              <video class="live-video" id="localVideo" :poster="images.close" />
              <img :src="images.close" alt="" v-if="liveStatus == 'mute'" class="hint-img" />
              <img :src="images.noStart" alt="" v-if="liveStatus == 'error'" class="hint-img" />
              <img :src="previewURL(liveInfo.coverUuid)" alt="" v-if="!isLink" class="hint-img" />
            </div>
          </section>
          <section class="live-comment">
            <div class="live-my-video">
              <video autoplay id="mylocation" :poster="images.close2" />
            </div>
            <div class="comment-box" v-show="commentActive == 0">
              <ul class="comment-chat-list">
                <li
                  v-for="(item, index) in commentChat"
                  :key="index"
                  :class="{ myself: item.userId == userInfo.userId }"
                >
                  <img :src="images.avatar" alt="" class="comment-avatar" />
                  <div class="comment-wrap">
                    <p class="comment-info">
                      <span class="name">{{ item.userName }}</span>
                      <span class="time">{{ timeFormat(item.time) }}</span>
                    </p>
                    <div class="comment-content">{{ item.message }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
        <div class="live-comment-input">
          <textarea :placeholder="$t('holder.pleaseEnterContent')" v-model="form.chat" />
          <el-button type="primary" size="mini" @click="sendChat">{{
            $t('button.send')
          }}</el-button>
        </div>
        <div class="live-footer">
          <el-button @click="logout" size="medium" type="primary">
            <template #icon> <Clock /> </template>
            {{ $t('button.out') }}
          </el-button>
          <el-button
            size="medium"
            v-if="liveInfo.supportInfo && isSupport"
            :disabled="isControlMute"
            @click="muteLocalMic"
          >
            <template #icon>
              <Microphone v-if="isControlMute" />
              <Mute v-else />
            </template>
            {{
              isControlMute
                ? $t('button.AllMute')
                : isMuteLocalMic
                ? $t('button.cancelMute')
                : $t('button.Mute')
            }}</el-button
          >
          <el-button
            size="medium"
            v-if="liveInfo.supportInfo && liveInfo.supportInfo.browser != 'Safari' && isSupport"
            @click="publishScreen"
          >
            <template #icon> <Link /></template>
            {{
              liveInfo.isPublishScreen
                ? $t('button.cancelScreenSharing')
                : $t('button.ScreenSharing')
            }}</el-button
          >
          <el-button
            size="medium"
            v-if="liveInfo.supportInfo && isSupport"
            :loading="loadingInterActive"
            @click="linkPulish"
          >
            <template #icon>
              <Microphone v-if="liveInfo.isPublishLink" />
              <Mute v-else />
            </template>
            {{
              liveInfo.isPublishLink ? $t('button.cancelConnect') : $t('button.connect')
            }}</el-button
          >
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
  import RTCClient from '/@/utils/live-setting/core/rtc-client'
  import Util from '/@/utils/live-setting/core/utils/utils'
  import ImageClose from '/@/assets/live_imgs/close.jpg'
  import ImageClose2 from '/@/assets/live_imgs/close2.jpg'
  import ImageNoStart from '/@/assets/live_imgs/no_start.png'
  import ImageAvatar from '/@/assets/live_imgs/avatar.png'
  import { Clock, Microphone, Mute, Link } from '@element-plus/icons-vue'
  import { getLivesToken, getpLives, postLivesChat } from '/@/api/ftm/student/teachingCenter'
  import { previewURL } from '/@/api/ftm/student/personCenter'
  import { Client } from '@stomp/stompjs'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useLiveStore } from '/@/store/modules/live'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  const accountStore = useUserStore()
  const liveStore = useLiveStore()
  export default {
    components: { Clock, Microphone, Mute, Link },
    data() {
      return {
        previewURL,
        form: {},
        linkList: [],
        liveInfo: {},
        loading: '',
        liveStatus: null,
        audioDevices: null,
        videoDevices: null,
        commentActive: 0,
        isPublish: false, // 是否已推流
        isInterActive: false, // 是否已连麦
        isScreenPreview: false, // 是否进行屏幕共享
        loadingInterActive: false,
        stompClient: '',
        commentChat: [],
        isControlMute: false,
        isMute: false, // 是否静音
        isMuteLocalMic: false,
        isMuteLocalCamera: false,
        isSupport: true,
        isLink: false,
        images: {
          close: ImageClose,
          noStart: ImageNoStart,
          avatar: ImageAvatar,
          close2: ImageClose2,
        },
      }
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      name() {
        return this.userInfo.name
      },
      token() {
        return accountStore.token
      },
      disabledLive() {
        if (
          this.audioDevices instanceof Array &&
          this.audioDevices.length == 0 &&
          this.videoDevices instanceof Array &&
          this.videoDevices.length == 0
        ) {
          return true
        } else {
          return false
        }
      },
      id() {
        let { id } = this.$route.params
        return id
      },
    },
    beforeCreate() {
      window.AppConfig = {}
    },
    created() {
      liveStore.SET_ATTR_OBJECT({
        isSwitchScreen: true,
        isPublishScreen: false,
        isPublishLink: false,
      })
      RTCClient.instance.setClientRole(1)
      RTCClient.instance.setAutoPublishSubscribe(false, true)
      this.registerCallBack()
    },
    mounted() {
      this.$nextTick(() => {
        this.getToken()
      })
    },
    methods: {
      // 获取直播token
      async getToken() {
        let loading = this.$loading({
          target: document.querySelector('#Container'),
          text: this.$t('tip.StudioConnecting'),
        })
        let [err, res] = await to(getLivesToken({ id: this.id }))
        loading.close()
        if (!err) {
          liveStore.SET_ATTR_OBJECT(res.data)
          await this.getLiveInfo()
          this.initWebSocket()
        }
      },
      // 获取直播信息
      async getLiveInfo() {
        let [err, res] = await to(getpLives({ id: this.id }))
        if (!err) {
          this.liveInfo = res.data
          this.isControlMute = res.data.mute
          liveStore.SET_ATTR({ name: 'teacherId', value: res.data.userId })
          this.createCannel()
        }
      },
      // 连接频道
      createCannel() {
        // this.registerCallBack();
        RTCClient.instance
          .isSuppert()
          .then((re) => {
            this.isSupport = true
            liveStore.SET_ATTR_OBJECT({ supportInfo: re })
            RTCClient.instance
              .login(liveStore.channelId, this.name)
              .then(() => {
                // RTCClient.instance.leavelSeat()
                Util.startPreview(document.getElementById('mylocation'))
              })
              .catch((err) => {})
          })
          .catch((err) => {
            this.isSupport = false
          })
      },
      /**
       * 推屏幕流
       */
      publishScreen() {
        if (!liveStore.isPublish) {
          Util.toast(this.$t('status.NotPublish'))
          return false
        }
        if (liveStore.isPublishScreen) {
          RTCClient.instance
            .stopPublishScreen()
            .then((re) => {
              RTCClient.instance.stopScreenSharePreview(document.getElementById('mylocation'))
              document.getElementById('mylocation').srcObject = AppConfig.localStream
              liveStore.SET_ATTR({
                name: 'isPublishScreen',
                value: false,
              })
            })
            .catch((err) => {})
        } else {
          RTCClient.instance
            .startPublishScreen()
            .then(() => {
              liveStore.SET_ATTR({
                name: 'isPublishScreen',
                value: true,
              })
              RTCClient.instance.startScreenSharePreview(document.getElementById('mylocation'))
            })
            .catch((err) => {})
        }
      },
      // 设置是否停止发布本地音频流
      muteLocalMic() {
        if (!liveStore.isPublish) {
          Util.toast(this.$t('status.NotPublish'))
          return false
        }
        RTCClient.instance.muteLocalMic(!this.isMuteLocalMic)
        this.isMuteLocalMic = !this.isMuteLocalMic
      },
      // 设置是否停止发布本地视频流
      muteLocalCamera() {
        if (!liveStore.isPublish) {
          this.isMuteLocalCamera = !this.isMuteLocalCamera
        } else {
          RTCClient.instance
            .muteLocalCamera(document.getElementById('mylocation'))
            .then((re) => {
              this.isMuteLocalCamera = !this.isMuteLocalCamera
              liveStore.SET_ATTR({
                name: 'isPreview',
                value: RTCClient.instance.isPreview,
              })
              if (RTCClient.instance.isPreview) {
                AppConfig.localStream = document.getElementById('mylocation').srcObject
                // document.getElementById(RTCClient.instance.userId).srcObject = document.getElementById("localVideo").srcObject;
              }
            })
            .catch((err) => {})
        }
      },
      /**
       * 注册回调
       */
      registerCallBack() {
        RTCClient.instance.registerCallBack((eventName, data) => {
          console.log(eventName, data)
          switch (eventName) {
            case 'onJoin':
            case 'onPublisher':
            case 'onUnPublisher':
            case 'onNotify':
              liveStore.SET_ATTR_OBJECT({
                userList: RTCClient.instance.getRoomUserList(),
              })
              break
            case 'onSubscribeResult':
              Util.showRemoteVideo(data)
              this.isLink = true
              break
            case 'onEnterSeatResult':
              liveStore.SET_ATTR_OBJECT({
                isPublish: true,
              })
              // // 连麦成功后判断是否要静音
              // if(this.isControlMute){
              //     this.muteLocalMic()
              // }
              // // 是否关闭视频
              // if(this.isMuteLocalCamera){
              //     RTCClient.instance.setLocalCamera(false)
              //     RTCClient.instance
              //     .muteLocalCamera(document.getElementById("mylocation"))
              //     .then(re => {
              //           liveStore.SET_ATTR({ name: 'isPreview', value: false })
              //     })
              // }
              break
            case 'onLeaveSeatResult':
              liveStore.SET_ATTR_OBJECT({
                isPublish: false,
                isPublishScreen: false,
              })
              break
            case 'onUserVideoMuted':
              break
            case 'onUserAudioMuted':
              break
            case 'onError':
              Util.showErrorMsg(data)
              break
            case 'onBye':
              Util.onByeMessage(data)
              break
            case 'onLeave':
              liveStore.SET_ATTR_OBJECT({
                userList: RTCClient.instance.getRoomUserList(),
              })
              if (data.userId == liveStore.teacherId) {
                this.isLink = false
              }
              break
          }
        })
      },
      // 连麦
      linkPulish() {
        this.loadingInterActive = true
        if (RTCClient.instance.currentRole == 1) {
          RTCClient.instance.enterSeat()
          this.loadingInterActive = false
          liveStore.SET_ATTR({ name: 'isPublishLink', value: true })
          !this.isMuteLocalCamera && Util.startPreview(document.getElementById('mylocation'))
        } else {
          RTCClient.instance.leavelSeat()
          document.getElementById('mylocation').srcObject = null
          this.loadingInterActive = false
          liveStore.SET_ATTR({ name: 'isPublishLink', value: false })
        }
      },
      // 初始化连接
      initWebSocket() {
        let host = window.location.host
        this.stompClient = new Client({
          brokerURL: `wss://${host}/live/api/ws`,
          connectHeaders: {
            Authorization: 'Bearer ' + this.token,
          },
          debug: function (str) {
            // console.log(str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        })
        let that = this
        this.stompClient.onConnect = function (frame) {
          let channel = `${that.liveInfo.filialeId}_${that.id}`
          let topic = '/topic/' + channel
          let topic_mute = topic + '/mute'
          let topic_user_list = topic + '/userlist'
          let topic_chat = topic + '/chat'
          that.stompClient.subscribe(topic_mute, function (message) {
            // console.log(message,'静音')
            let con = JSON.parse(message.body)
            that.isControlMute = con.forceMute
            if (con.forceMute) {
              RTCClient.instance._isMuteLocalMic = false
              RTCClient.instance.muteLocalMic()
              that.$message.warning(this.$t('tip.OpenAllMute'))
            } else {
              RTCClient.instance._isMuteLocalMic = !that.isMuteLocalMic
              RTCClient.instance.muteLocalMic()
              that.$message.warning(this.$t('tip.CloseAllMute'))
            }
          })
          that.stompClient.subscribe(topic_user_list, function (message) {
            // console.log(message,'列表')
          })
          that.stompClient.subscribe(topic_chat, function (message) {
            that.commentChat.push(JSON.parse(message.body))
            // console.log(that.commentChat,'聊天')
          })
        }

        this.stompClient.onStompError = function (frame) {
          // console.log('连接错误ws')
        }

        this.stompClient.activate()
      },
      // 发送聊天信息
      async sendChat() {
        postLivesChat({ id: this.id, message: this.form.chat })
        this.form.chat = ''
      },
      timeFormat(time) {
        return XEUtils.toDateString(time, 'HH:mm:ss')
      },
      // 静音
      setMute() {
        if (this.isControlMute) return
        RTCClient.instance.muteLocalMic()
        this.isMute = !this.isMute
      },
      // 退出房间
      logout() {
        this.$confirm(this.$t('holder.areSureOutLive'), this.$t('tip.tip'), { type: 'error' }).then(
          () => {
            // this.stompClient.deactivate();
            // RTCClient.instance.logout()
            this.$router.back()
          },
        )
      },
    },
    beforeUnmount() {
      // 销毁ws连接
      Util.exitRoom()
      this.stompClient.deactivate()
    },
  }
</script>

<style scoped lang="scss">
  .live {
    $headHeight: 68px;
    $borderRadius: 5px;
    $border: 1px solid #f4f4f4;
    &-notice {
      margin-bottom: 20px;
    }
    &-main {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    &-header {
      width: 100%;
      height: $headHeight;
      display: flex;
      align-items: center;
      .nav {
        padding-left: 20px;
      }
      .nav-right {
        display: flex;
        padding-right: 20px;
        line-height: 26px;
        .switch {
          margin-right: 20px;
          span {
            margin-right: 10px;
          }
        }
      }
    }
    &-title {
      flex: 1;
      text-align: center;
      h2 {
        font-size: 22px;
      }
      .time {
        margin-left: 20px;
        font-size: 15px;
        font-weight: normal;
      }
    }
    &-wrapper {
      display: flex;
      flex: 1;
    }
    &-box {
      display: flex;
      flex-direction: column;
      flex-basis: 70%;
    }
    &-my-video {
      position: relative;
      background: #333;
      video {
        width: 100%;
        height: 100%;
      }
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    &-video-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      // min-width: 739px;
      // min-height: 504px;
      background: #333;
      .live-video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .hint-img {
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    &-all-list {
      width: 100%;
      height: 200px;
      overflow-x: auto;
    }
    &-comment {
      display: flex;
      flex-direction: column;
      flex-basis: calc(30% - 20px);
      margin-left: 20px;
      border: $border;
      border-bottom-left-radius: $borderRadius;
      border-bottom-right-radius: $borderRadius;
      .comment {
        &-tabs {
          display: flex;
          width: 100%;
          height: 36px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        &-tab {
          flex: 1;
          line-height: 36px;
          text-align: center;
          cursor: default;
          background: #f1f1f1;
          &.active {
            background: #fff;
          }
        }
        &-box {
          flex: 1;
          .comment-chat-list {
            height: 410px;
            margin: 0;
            padding: 0;
            overflow-y: auto;
            list-style: none;
            li {
              padding: 5px 12px 0;
              overflow: hidden;
              zoom: 1;
              margin: 12px 0;
              &:hover {
                background: #f7f7f7;
              }
            }
            .comment-avatar {
              float: left;
              width: 48px;
              height: 48px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .comment-wrap {
              margin-left: 56px;
              border-bottom: $border;
            }
            .comment-info {
              display: flex;
              width: 100%;
              margin: 0;
              justify-content: space-between;
              font-size: 14px;
              line-height: 24px;
              color: #666;
              .time {
                font-size: 12px;
                color: #ccc;
              }
            }
            .comment-content {
              display: inline-block;
              padding: 5px 0;
              font-size: 12px;
              line-height: 20px;
              color: #ccc;
              word-break: break-all;
            }
            // .myself .comment-content{
            //     float: right;
            //     color: #fff;
            //     background: rgba($color: #215EBE, $alpha: 0.7);
            // }
          }
        }
        &-student-list {
          flex: 1;
        }
        &-textarea {
          border-top: $border;
          .comment-nav {
            height: 36px;
            padding: 0 10px;
            text-align: right;
            line-height: 36px;
            border-top: $border;
            border-bottom: $border;
            span {
              margin-right: 10px;
            }
          }
          textarea {
            width: 100%;
            height: 160px;
            padding: 10px;
            box-sizing: border-box;
            font-size: 15px;
            line-height: 1.5;
            resize: none;
            border: 0;
            outline: none;
          }
          .comment-textarea-footer {
            padding: 5px;
            text-align: right;
            border-top: $border;
          }
        }
      }
    }
    &-footer {
      padding: 40px 0 60px;
    }
    &-comment-input {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 20px;
      border: $border;
      border-radius: $borderRadius;
      textarea {
        width: calc(100% - 76px);
        height: 70px;
        padding: 0 12px;
        box-sizing: border-box;
        border: 0;
        outline: none;
        resize: none;
        line-height: 2;
      }
    }
  }
  video {
    object-fit: cover;
  }
</style>
