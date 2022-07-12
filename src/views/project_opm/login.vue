<template>
  <div class="login">
    <info :ruleForm="contextInfo" @on-behavior="onLogin" @refreshVerify="refreshVerify" />
  </div>
</template>

<script lang="ts">
  import { reactive, onBeforeMount } from 'vue'
  import info, { ContextProps } from './components/info.vue'
  import { useRouter } from 'vue-router'
  import { storageSession } from '/@/utils/storage'
  import { useOpmUserStoreHook } from '/@/store/modules/opmUser'
  export default {
    name: 'login',
    components: {
      info,
    },
    setup() {
      const router = useRouter()

      // 刷新验证码
      const refreshGetVerify = async () => {
        // let { svg } = await getVerify();
        // contextInfo.svg = svg;
      }

      const contextInfo: ContextProps = reactive({
        userName: '',
        passWord: '',
        verify: null,
        svg: null,
      })

      const toPage = (info: Object): void => {
        storageSession.setItem('info', info)
        router.push('/')
      }

      // 登录
      const onLogin = async () => {
        let { userName, passWord } = contextInfo
        let { access_token } = await useOpmUserStoreHook().Login({
          username: userName,
          password: passWord,
          // verify: verify
        })
        router.push('/')
      }

      const refreshVerify = (): void => {
        refreshGetVerify()
      }

      onBeforeMount(() => {
        // refreshGetVerify();
      })

      return {
        contextInfo,
        onLogin,
        router,
        toPage,
        refreshVerify,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .login,
  .register {
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
    background: url('/@/assets/bg.png') no-repeat center;
    background-size: cover;
  }
</style>
