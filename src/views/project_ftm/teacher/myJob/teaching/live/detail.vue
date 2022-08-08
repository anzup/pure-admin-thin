<template>
  <el-scrollbar>
    <div class="container" ref="Container">
      <div class="live-main">
        <el-alert
          :title="$t('tip.liveCompatibleError')"
          type="error"
          show-icon
          :closable="false"
          v-show="disabledLive"
          class="live-notice"
        />
        <header class="live-header">
          <div class="live-title">
            <h2>{{ liveInfo.name || '' }}</h2>
          </div>
          <div class="nav-right">
            <div class="switch">
              <span>{{ $t('common.camera') }}</span>
              <el-switch
                :disabled="disabledLive"
                :value="!isMuteLocalCamera"
                @change="muteLocalCamera"
              />
            </div>
            <span>{{ $t('common.liveTeacher') }}：{{ liveTeacher }}</span>
          </div>
        </header>
        <div class="live-wrapper">
          <section style="display: flex; width: 100%">
            <aside class="live-box">
              <div class="live-video-wrapper">
                <video class="live-video" :poster="images.close" id="localVideo" />
              </div>
            </aside>
            <aside class="live-comment">
              <ul class="comment-tabs">
                <li
                  class="comment-tab"
                  :class="{ active: commentActiveTab == 1 }"
                  @click="commentActiveTab = 1"
                >
                  {{ $t('common.onlineList') }}({{ userInfos?.onlineCount || 0 }}/{{
                    userInfos.totalCount || 0
                  }})
                </li>
                <li
                  class="comment-tab"
                  :class="{ active: commentActiveTab == 0 }"
                  @click="commentActiveTab = 0"
                >
                  {{ $t('common.chatRoom') }}
                </li>
              </ul>
              <div class="comment-box" v-show="commentActiveTab == 0">
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
              <div class="comment-students" v-show="commentActiveTab == 1">
                <ul class="comment-students-list">
                  <li
                    v-for="item in users"
                    :key="item.userId"
                    :class="{
                      [item.status]: true,
                      self: item.userId == userInfo.userId,
                      onLine: linkList.length && linkList.find((v) => v.userId == item.userId),
                    }"
                    :id="'studentItem' + item.userId"
                  >
                    <div class="comment-students-item">
                      <span class="student-name">{{ item.name }}</span>
                      <video
                        autoplay
                        v-show="
                          item.userId == userInfo.userId ||
                          (linkList.length && linkList.find((v) => v.userId == item.userId))
                        "
                        :id="'previewVideo' + item.userId"
                        :poster="images.close"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </aside>
          </section>
          <section class="live-preview">
            <!-- <div class="live-all-list">
                <div class="live-thumbnail-item">
                    <ul class="thumbnail-list">
                        <li v-for="item in linkList" :key="item.userId">
                            <video :id="item.userId" :poster="require('/@/assets/live_imgs/close.jpg')" autoplay></video>
                            <span class="thumbnail-name">{{ item.displayName || '' }}</span>
                            <img :src="require('/@/assets/live_imgs/close.jpg')" alt="" v-if="item.streamConfigs.some(v => v.muted)">
                        </li>
                    </ul>
                </div>
            </div> -->
            <div class="comment-textarea">
              <textarea :placeholder="$t('holder.pleaseEnterContent')" v-model="form.chat" />
              <div class="comment-textarea-footer">
                <el-button type="primary" size="mini" @click="sendChat">{{
                  $t('button.send')
                }}</el-button>
              </div>
            </div>
          </section>
        </div>
        <div class="live-footer">
          <el-button size="medium" @click="muteLocalMic">
            <template #icon>
              <el-icon v-if="isMuteLocalMic"><Mute /></el-icon>
              <el-icon v-else><Microphone /></el-icon>
            </template>
            {{ isMuteLocalMic ? this.$t('button.cancelMute') : this.$t('button.Mute') }}</el-button
          >
          <el-button size="medium" @click="setBanned">
            <template #icon>
              <el-icon v-if="isAllMute"><Mute /></el-icon>
              <el-icon v-else><Microphone /></el-icon>
            </template>
            {{ isAllMute ? this.$t('button.cancelAllMute') : this.$t('button.AllMute') }}</el-button
          >
          <el-button
            size="medium"
            v-if="liveState.supportInfo && liveState.supportInfo.browser != 'Safari'"
            type="primary"
            @click="publishScreen"
          >
            <template #icon>
              <el-icon><Platform /></el-icon>
            </template>
            {{
              liveState.isPublishScreen
                ? this.$t('button.cancelScreenSharing')
                : this.$t('button.ScreenSharing')
            }}</el-button
          >
          <el-button
            size="medium"
            :type="isClose ? 'primary' : 'danger'"
            :disabled="disabledLive"
            @click="endLive"
          >
            <template #icon>
              <el-icon><SwitchButton /></el-icon>
            </template>
            {{ $t('button.finishCourse') }}</el-button
          >
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
  import RTCClient from '/@/utils/live-setting/core/rtc-client'
  import Util from '/@/utils/live-setting/core/utils/utils'
  import { Mute, Microphone, Platform, SwitchButton } from '@element-plus/icons-vue'
  import {
    getLivesToken,
    getLivesUserInfo,
    postLivesChat,
    postLivesMute,
    getpLives,
    putLives,
    postLivesStartRecord,
    postLivesEndRecord,
  } from '/@/api/ftm/teacher/teachingCenter'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { Client } from '@stomp/stompjs'
  import closeImg from '/@/assets/live_imgs/close.jpg'
  import avatarImg from '/@/assets/live_imgs/avatar.png'
  import { useLiveStore } from '/@/store/modules/live'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  const liveStore = useLiveStore()
  export default {
    components: { Mute, Microphone, Platform, SwitchButton },
    data() {
      return {
        id: null,
        form: {
          allbanned: false,
        },
        liveInfo: {},
        userInfos: {},
        linkList: [],
        audioDevices: null,
        videoDevices: null,
        screenDevices: null,
        isPublish: false,
        isScreenPreview: false, // 是否开启屏幕共享
        isMute: false, // 是否开启静音
        isAllMute: false,
        isPreview: false, // 是否开启视频
        isClose: true, // 是否结束课程
        isCanRecord: false, // 是否可开启录播
        commentActiveTab: 1,
        users: [], // 直播所有人员
        commentChat: [], // 聊天信息
        stompClient: '',
        srcObject: '',
        timer: null,
        isMuteLocalMic: false,
        isMuteLocalCamera: false,
        ReContact: null,
        images: {
          close: closeImg,
          avatar: avatarImg,
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
      liveState() {
        return liveStore
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
      liveTeacher() {
        return this.userInfo.name || ''
      },
      students() {
        return this.users.filter((v) => v && v.userId != this.userInfo.userId)
      },
    },
    beforeMount() {
      window.AppConfig = {}
    },
    beforeUnmount() {
      // 销毁ws连接
      this.stompClient.deactivate()
      Util.exitRoom()
      this.isCanRecord && this.endRecord()
      clearTimeout(this.ReContact)
    },
    mounted() {
      let { id } = this.$route.params
      this.id = id
      this.getToken()
      RTCClient.instance.setClientRole(1)
      RTCClient.instance.setAutoPublishSubscribe(false, true)
      this.registerCallBack()
    },
    methods: {
      // 获取直播token
      async getToken() {
        let loading = this.$loading({
          target: this.$refs.Container,
          text: this.$t('tip.StudioConnecting'),
        })
        let [err, res] = await to(getLivesToken({ id: this.id }))
        loading.close()
        if (!err) {
          liveStore.SET_ATTR_OBJECT(res.data)
          await this.getLiveInfo()
          this.initWebSocket()
          this.$nextTick(() => {
            let data = res.data
            RTCClient.instance
              .isSuppert()
              .then((re) => {
                liveStore.SET_ATTR_OBJECT({ supportInfo: re, role: 0 })
                RTCClient.instance
                  .login(data.channelId, this.name)
                  .then((info) => {
                    let userId = info.userid
                    Util.startPreview(document.getElementById('localVideo')).then(() => {
                      console.log('映射')
                      setTimeout(() => {
                        document.querySelector(
                          `#previewVideo${this.userInfo.userId}`,
                        ).style.display = 'block'
                        document.querySelector(`#previewVideo${this.userInfo.userId}`).srcObject =
                          document.getElementById('localVideo').srcObject
                      }, 1000)
                    })
                    RTCClient.instance.enterSeat()
                    liveStore.SET_ATTR({
                      name: 'userId',
                      value: userId,
                    })
                    this.isCanRecord && this.startRecord()
                  })
                  .catch((err) => {})
              })
              .catch((err) => {
                alert(err.message)
              })
          })
        }
      },
      // 获取直播信息
      async getLiveInfo() {
        let [err, res] = await to(getpLives({ id: this.id }))
        if (!err) {
          this.isCanRecord = res.data.record
          this.liveInfo = res.data
        }
        this.linkLive()
        this.getLiveUsers()
      },
      // 获取直播学员
      async getLiveUsers() {
        let [err, res] = await to(getLivesUserInfo({ id: this.id }))
        if (!err) {
          this.userInfos = res.data
          this.users = res.data.users
        }
      },
      // 开启录播
      startRecord() {
        postLivesStartRecord({ id: this.id })
          .then((res) => {
            if (res.status != 200) {
              clearTimeout(this.ReContact)
              this.ReContact = setTimeout(() => {
                this.startRecord()
              }, 2000)
            }
          })
          .catch(() => {
            clearTimeout(this.ReContact)
            this.ReContact = setTimeout(() => {
              this.startRecord()
            }, 2000)
          })
      },
      // 关闭录播
      endRecord() {
        postLivesEndRecord({ id: this.id })
      },
      // 建立连接
      linkLive() {
        let { id } = this.$route.params
        putLives({ id, status: 'BROADCASTING' })
      },
      // 关闭直播
      endLive() {
        putLives({ id: this.id, status: 'FINISHED' })
        this.$router.go(-1)
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
              RTCClient.instance.stopScreenSharePreview(document.getElementById('localVideo'))
              document.getElementById('localVideo').srcObject = AppConfig.localStream
              liveStore.SET_ATTR_OBJECT({ isPublishScreen: false })
            })
            .catch((err) => {})
        } else {
          RTCClient.instance
            .startPublishScreen()
            .then(() => {
              liveStore.SET_ATTR_OBJECT({ isPublishScreen: true })
              RTCClient.instance.startScreenSharePreview(document.getElementById('localVideo'))
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
          Util.toast(this.$t('status.NotPublish'))
          return false
        }
        RTCClient.instance
          .muteLocalCamera(document.getElementById('localVideo'))
          .then((re) => {
            this.isMuteLocalCamera = !this.isMuteLocalCamera
            liveStore.SET_ATTR({
              name: 'isPreview',
              value: RTCClient.instance.isPreview,
            })
            if (RTCClient.instance.isPreview) {
              AppConfig.localStream = document.getElementById('localVideo').srcObject
              // document.getElementById(RTCClient.instance.userId).srcObject = document.getElementById("localVideo").srcObject;
            }
          })
          .catch((err) => {})
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
              this.linkList = RTCClient.instance.getRoomUserList()
              console.log(this.linkList, '1111')
              break
            case 'onSubscribeResult':
              Util.showRemoteVideo(data)
              break
            case 'onEnterSeatResult':
              liveStore.SET_ATTR({
                name: 'isPublish',
                value: true,
              })
              break
            case 'onLeaveSeatResult':
              liveStore.SET_ATTR({
                name: 'isPublish',
                value: false,
              })
              break
            case 'onError':
              Util.showErrorMsg(data)
              break
            case 'onBye':
              Util.onByeMessage(data)
              break
            case 'onLeave':
              this.linkList = RTCClient.instance.getRoomUserList()

            case 'onUpdateRole':
              break
          }
        })
      },
      // 初始化ws连接
      initWebSocket() {
        let host = window.location.host
        this.stompClient = new Client({
          brokerURL: `wss://${host}:443/live/api/ws`,
          connectHeaders: {
            Authorization: 'Bearer ' + window.sessionStorage.getItem('access_token'),
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
          console.log(channel, '频道')
          let topic = '/topic/' + channel
          let topic_mute = topic + '/mute'
          let topic_user_list = topic + '/userlist'
          let topic_chat = topic + '/chat'
          that.stompClient.subscribe(topic_mute, function (message) {
            console.log(message, '静音')
          })
          that.stompClient.subscribe(topic_user_list, function (list) {
            let res = JSON.parse(list.body)
            that.userInfos = res
            that.users = res.users
          })
          that.stompClient.subscribe(topic_chat, function (message) {
            that.commentChat.push(JSON.parse(message.body))
          })
        }

        this.stompClient.onStompError = function (frame) {}

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
      // 设置全员静音
      async setBanned() {
        let [err] = await to(postLivesMute({ id: this.id, forceMute: !this.isAllMute }))
        if (!err) {
          this.isAllMute = !this.isAllMute
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '/@/views/project_ftm/teacher/styles/live.scss';
  .container {
    padding: 0 17px;
  }
</style>
