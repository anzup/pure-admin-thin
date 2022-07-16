<script lang="ts" setup>
  import Motion from './utils/motion'
  import { useRouter } from 'vue-router'
  import { loginRules } from './utils/rule'
  import type { FormInstance } from 'element-plus'
  import { computed, reactive, ref, watch } from 'vue'
  import { operates, thirdParty } from './utils/enums'
  import { useUserStoreHook } from '/@/store/modules/user'
  import { bg, currentWeek, avatar } from './utils/static'
  // import { ReImageVerify } from '/@/components/ReImageVerify'
  import { useRenderIcon } from '/@/components/ReIcon/src/hooks'
  import { storageSession } from '/@/utils/storage'
  import { message } from '/@/utils/resetMessage'
  import Phone from './components/phone.vue'
  import QrCode from './components/qrCode.vue'
  import Regist from './components/regist.vue'
  import Update from './components/update.vue'

  const imgCode = ref('')
  const router = useRouter()
  const loading = ref(false)
  const checked = ref(false)
  const ruleFormRef = ref<FormInstance>()
  const currentPage = computed(() => {
    return useUserStoreHook().currentPage
  })

  const ruleForm = reactive({
    username: 'A02748',
    password: '111111',
    verifyCode: '',
  })

  const onLogin = async (formEl: FormInstance | undefined) => {
    loading.value = true
    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        // 模拟请求，需根据实际开发进行修改
        useUserStoreHook()
          .loginByUsername(ruleForm)
          .then(() => {
            loading.value = false
            // initRouter().then(() => {
            message.success('登陆成功')
            router.push('/')
            // })
          })
      } else {
        loading.value = false
        return fields
      }
    })
  }

  function onHandle(value) {
    useUserStoreHook().SET_CURRENTPAGE(value)
  }
</script>

<template>
  <img :src="bg" class="wave" />
  <div class="login-container">
    <div class="img">
      <component :is="currentWeek" />
    </div>
    <div class="login-box">
      <div class="login-form">
        <avatar class="avatar" />
        <Motion>
          <h2>CREW WEB</h2>
        </Motion>

        <el-form
          v-if="currentPage === 0"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="loginRules"
          size="large"
          @keyup.enter="onLogin(ruleFormRef)"
        >
          <Motion :delay="100">
            <el-form-item prop="username">
              <el-input
                v-model="ruleForm.username"
                :input-style="{ 'user-select': 'none' }"
                :prefix-icon="useRenderIcon('user')"
                clearable
                placeholder="账号"
              />
            </el-form-item>
          </Motion>

          <Motion :delay="150">
            <el-form-item prop="password">
              <el-input
                v-model="ruleForm.password"
                :input-style="{ 'user-select': 'none' }"
                :prefix-icon="useRenderIcon('lock')"
                clearable
                placeholder="密码"
                show-password
              />
            </el-form-item>
          </Motion>

          <!--<Motion :delay="200">-->
          <!--  <el-form-item prop="verifyCode">-->
          <!--    <el-input-->
          <!--      v-model="ruleForm.verifyCode"-->
          <!--      :input-style="{ 'user-select': 'none' }"-->
          <!--      clearable-->
          <!--      placeholder="验证码"-->
          <!--    >-->
          <!--      <template #append>-->
          <!--        <ReImageVerify v-model:code="imgCode" />-->
          <!--      </template>-->
          <!--    </el-input>-->
          <!--  </el-form-item>-->
          <!--</Motion>-->

          <Motion :delay="250">
            <el-form-item>
              <div class="w-full h-20px flex justify-between items-center">
                <el-checkbox v-model="checked">记住密码</el-checkbox>
                <el-button type="text" @click="useUserStoreHook().SET_CURRENTPAGE(4)">
                  忘记密码?
                </el-button>
              </div>
              <el-button
                :loading="loading"
                class="w-full mt-4"
                size="default"
                type="primary"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </el-form-item>
          </Motion>

          <Motion :delay="300">
            <el-form-item>
              <div class="w-full h-20px flex justify-between items-center">
                <el-button
                  v-for="(item, index) in operates"
                  :key="index"
                  class="w-full mt-4"
                  size="default"
                  @click="onHandle(index + 1)"
                >
                  {{ item.title }}
                </el-button>
              </div>
            </el-form-item>
          </Motion>
        </el-form>

        <Motion v-if="currentPage === 0" :delay="350">
          <el-form-item>
            <el-divider>
              <p class="text-gray-500 text-xs">第三方登录</p>
            </el-divider>
            <div class="w-full flex justify-evenly">
              <span v-for="(item, index) in thirdParty" :key="index" :title="`${item.title}登陆`">
                <IconifyIconOnline
                  :icon="`ri:${item.icon}-fill`"
                  class="cursor-pointer text-gray-500 hover:text-blue-400"
                  width="20"
                />
              </span>
            </div>
          </el-form-item>
        </Motion>
        <!-- 手机号登陆 -->
        <Phone v-if="currentPage === 1" />
        <!-- 二维码登陆 -->
        <QrCode v-if="currentPage === 2" />
        <!-- 注册 -->
        <Regist v-if="currentPage === 3" />
        <!-- 忘记密码 -->
        <Update v-if="currentPage === 4" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import url('/@/style/login.css');
</style>

<style lang="scss" scoped>
  :deep(.el-input-group__append, .el-input-group__prepend) {
    padding: 0;
  }
</style>
