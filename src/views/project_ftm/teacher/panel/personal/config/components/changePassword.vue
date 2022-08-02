<template>
  <el-scrollbar>
    <el-form
      class="change-password-form"
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
    >
      <!-- 帐号 -->
      <el-form-item :label="$t('table.username')">
        <span class="form-content">{{ userInfo.username }}</span>
      </el-form-item>
      <!--手机号-->
      <el-form-item v-if="showCode" :label="$t('table.cellPhoneNumber')" key="phone">
        <el-input disabled :placeholder="$t('holder.pleaseEnter')" v-model="form.phone" />
      </el-form-item>
      <!--验证码-->
      <el-form-item
        v-if="showCode"
        :label="$t('common.verificationCode')"
        prop="smsCode"
        key="smsCode"
      >
        <el-row>
          <el-col :span="16">
            <el-input :placeholder="$t('holder.pleaseEnter')" v-model="form.smsCode" />
          </el-col>
          <el-col :span="6" :offset="1">
            <el-button type="primary" :disabled="flag" @click="verificationCode"
              >{{ $t('common.getVerificationCode') }}
              <span v-show="flag && form.phone" class="count">({{ count }}s)</span></el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
      <!--原密码-->
      <el-form-item
        v-if="!showCode"
        :label="$t('common.originPass')"
        prop="oldPassword"
        key="oldPassword"
      >
        <el-input
          type="password"
          :placeholder="$t('common.pleaseInputPassword')"
          v-model="form.oldPassword"
        />
      </el-form-item>
      <!--密码-->
      <el-form-item :label="$t('common.newPass')" prop="password">
        <el-input
          type="password"
          :placeholder="$t('common.pleaseInputLetters')"
          v-model="form.password"
        />
      </el-form-item>
      <!--确认密码-->
      <el-form-item :label="$t('common.confirmPassword')" prop="confirmPassword">
        <el-input
          type="password"
          :placeholder="$t('common.pleaseInputLetters')"
          v-model="form.confirmPassword"
        />
      </el-form-item>
      <!--忘记密码/已有密码  -->
      <el-form-item>
        <template v-if="accountType != 'ADMIN'">
          <el-button type="text" v-if="!showCode" @click="switchType"
            >{{ $t('common.forgetThePassword') }}？</el-button
          >
          <el-button type="text" v-if="showCode" @click="switchType"
            >{{ $t('common.existingPassword') }}？</el-button
          >
        </template>
      </el-form-item>
      <!--保存  -->
      <el-form-item>
        <el-button :loading="loadingSave" type="primary" @click="confirm">{{
          $t('button.saveModify')
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-scrollbar>
</template>

<script>
  import { postChangePassword } from '/@/api/ftm/teacher/user'
  import axios from 'axios'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useUserStore } from '/@/store/modules/user'
  import { useI18n } from 'vue-i18n'
  const accountStore = useUserStore()
  const userStore = useFtmUserStore()
  const TIME_COUNT = 60
  export default {
    name: 'ChangePassword',
    data() {
      return {
        form: {
          password: '',
          oldPassword: '',
          confirmPassword: '',
          phone: '',
          smsCode: '',
        },
        showCode: false,
        flag: false,
        count: '', // 初始化次数
        timer: null,
        loadingSave: false,
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      accountType() {
        return this.userInfo.accountType
      },
      rules() {
        return {
          password: [
            {
              required: true,
              pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^09a-zA-Z]).{8,16}$/,
              message: this.$t('common.pleaseInputLetters'),
              trigger: ['blur', 'change'],
            },
            {
              validator: this.validatePass,
              trigger: ['blur', 'change'],
            },
          ],
          oldPassword: [
            {
              required: this.showCode ? false : true,
              message: this.$t('common.pleaseInputPassword'),
              trigger: ['blur', 'change'],
            },
          ],
          confirmPassword: [
            {
              required: true,
              pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^09a-zA-Z]).{8,16}$/,
              message: this.$t('common.pleaseInputLetters'),
              trigger: ['blur', 'change'],
            },
            {
              validator: this.validatePass2,
              trigger: ['blur', 'change'],
            },
          ],
          smsCode: [
            {
              required: this.showCode ? true : false,
              min: 6,
              max: 6,
              message: this.$t('common.incorrectFormatOfVerificationCode'),
              trigger: ['blur', 'change'],
            },
          ],
          // phone: [{ validator: this.validatePhone, trigger: "change" }],
        }
      },
    },
    setup() {
      const { locale } = useI18n()
      return { locale }
    },
    methods: {
      async switchType() {
        this.showCode = !this.showCode
        this.$refs.form.clearValidate()

        if (this.showCode) {
          const { data } = await axios({
            method: 'get',
            baseURL: import.meta.env.VITE_BASE_API_ACCOUNT,
            url: `/public/userInfo/${this.userInfo.userId}`,
            headers: {
              Authorization: 'Basic aHVheXVleGluZzpodWF5dWV4aW5n',
            },
          })

          // const {phone}= await getUsersInfo({id:this.$store.getters.userId})
          this.form.phone = data.phone
          if (!data.phone) {
            this.flag = true
            return this.$message.error(this.$t('common.noMobilePhoneNumberIsSet'))
          }
          this.form.oldPassword = undefined
        } else {
          this.form.smsCode = undefined
        }
      },
      postChangePassword() {
        this.$refs.form.validate((validaty) => {
          if (!validaty) return
          const params = {
            oldPassword: this.showCode ? undefined : this.form.oldPassword,
            smsCode: this.showCode ? this.form.smsCode : undefined,
            password: this.form.password,
          }
          postChangePassword(params).then((res) => {
            if (res.status == 200) {
              this.$message.success(this.$t('tip.editSuccessTip'))
              this.$refs.form.resetFields()
            } else {
              this.$message.warning(res.data.msg)
            }
          })
        })
      },
      validatePass(rule, value, callback) {
        if (value === '') {
          callback(new Error(this.$t('common.pleaseInputPassword')))
        } else {
          if (this.form.confirmPassword !== '') {
            this.$refs.form.validateField('confirmPassword')
          }
          callback()
        }
        // /^[a-zA-Z0-9]{6,15}$/
      },
      validatePass2(rule, value, callback) {
        if (value === '') {
          callback(new Error(this.$t('common.pleaseEnterThePasswordAgain')))
        } else if (value !== this.form.password) {
          callback(new Error(this.$t('common.theTwoPasswordsAreInconsistent')))
        } else {
          callback()
        }
      },

      verificationCode() {
        axios({
          method: 'post',
          baseURL: import.meta.env.VITE_BASE_API_ACCOUNT,
          url: '/users/smsCode',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': this.locale,
            Authorization: 'Bearer ' + accountStore.token,
          },
          data: {
            phone: this.form.phone,
            type: 'VERIFY_PHONE',
          },
        })
          .then((res) => {
            if (res.status == 200) {
              this.$message.success(this.$t('common.verificationCodeSentSuccessfully'))
              this.flag = true
              this.count = TIME_COUNT
              this.timer = setInterval(() => {
                // console.log(this.count);
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--
                } else {
                  this.flag = false
                  clearInterval(this.timer) // 清除定时器
                  this.timer = null
                }
              }, 1000)
            }
          })
          .catch(() => {
            this.$message.error(this.$t('common.failedToSendVerificationCode'))
          })
      },
      cancel() {
        Object.assign(this.$data, this.$options.data())
        this.$refs.form.clearValidate()
      },
      confirm() {
        this.postChangePassword()
        // Object.assign(this.$data,this.$options)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .change-password-form {
    width: 500px;
  }
  .form-content {
    padding: 0 16px;
  }
</style>
