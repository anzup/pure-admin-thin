<template>
  <el-scrollbar>
    <el-form class="change-pin-form" :model="form" :rules="rules" ref="form" label-width="120px">
      <!--手机号-->
      <el-form-item v-if="showCode" :label="$t('table.cellPhoneNumber')" key="phone">
        <el-input disabled :placeholder="$t('holder.pleaseEnter')" v-model="form.phone" />
      </el-form-item>
      <!--短信验证码-->
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
          <el-col :span="6" :offset="2">
            <el-button type="text" :disabled="flag" @click="verificationCode"
              >{{ $t('common.getVerificationCode') }}
              <span v-show="flag && form.phone" class="count">({{ count }}s)</span></el-button
            >
          </el-col>
        </el-row>
      </el-form-item>
      <!--原pin码-->
      <el-form-item
        v-if="!showCode"
        :label="$t('common.oldPinCode')"
        prop="oldPinCode"
        key="oldPinCode"
      >
        <el-input
          type="password"
          :placeholder="$t('common.pleaseEnterPinCode')"
          v-model="form.oldPinCode"
        />
      </el-form-item>
      <!--新pin码-->
      <el-form-item :label="$t('common.newPinCode')" prop="pinCode">
        <el-input
          type="password"
          :placeholder="$t('common.pleaseEnterPinCode')"
          v-model="form.pinCode"
        />
      </el-form-item>
      <!--确认pin码-->
      <el-form-item :label="$t('common.confirmPinCode')" prop="confirmPassword">
        <el-input
          type="password"
          :placeholder="$t('common.pleaseEnterPinCode')"
          v-model="form.confirmPassword"
        />
      </el-form-item>
      <!--忘记密码/已有密码-->
      <el-form-item>
        <el-button v-if="!showCode" type="text" @click="switchType"
          >{{ $t('common.forgetPinCode') }}？</el-button
        >
        <el-button v-if="showCode" type="text" @click="switchType"
          >{{ $t('common.existingPinCode') }}？</el-button
        >
      </el-form-item>
      <!--保存-->
      <el-form-item>
        <el-button :loading="loadingSave" type="primary" @click="confirm">{{
          $t('button.saveModify')
        }}</el-button>
      </el-form-item>
    </el-form>
  </el-scrollbar>
</template>

<script>
  import { postChangePinCode } from '/@/api/ftm/teacher/user'
  import axios from 'axios'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useUserStore } from '/@/store/modules/user'
  import { useI18n } from 'vue-i18n'
  const userStore = useFtmUserStore()
  const accountStore = useUserStore()
  const TIME_COUNT = 60
  export default {
    name: 'ChangePassword',
    data() {
      return {
        form: {
          pinCode: undefined,
          oldPinCode: undefined,
          confirmPassword: undefined,
          phone: undefined,
          smsCode: undefined,
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
      rules() {
        return {
          pinCode: [
            {
              required: true,
              pattern: /^[0-9]{6}$/,
              message: this.$t('common.pleaseEnterPinCode'),
              trigger: ['blur', 'change'],
            },
            {
              validator: this.validatePass,
              trigger: ['blur', 'change'],
            },
          ],
          oldPinCode: [
            {
              required: this.showCode ? false : true,
              pattern: /^[0-9]{6}$/,
              message: this.$t('common.pleaseEnterPinCode'),
              trigger: ['blur', 'change'],
            },
          ],
          confirmPassword: [
            {
              required: true,
              pattern: /^[0-9]{6}$/,
              message: this.$t('common.pleaseEnterPinCode'),
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
          this.form.oldPinCode = undefined
        } else {
          this.form.smsCode = undefined
        }
      },
      postChangePinCode() {
        // debugger
        this.$refs.form.validate((validaty) => {
          if (!validaty) return
          const params = {
            oldPinCode: this.showCode ? undefined : this.form.oldPinCode,
            smsCode: this.showCode ? this.form.smsCode : undefined,
            pinCode: this.form.pinCode,
          }
          postChangePinCode(params).then((res) => {
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
        } else if (value !== this.form.pinCode) {
          callback(new Error(this.$t('common.theTwoPasswordsAreInconsistent') + '!'))
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
        this.postChangePinCode()
        // Object.assign(this.$data,this.$options)
      },
    },
  }
</script>

<style lang="scss" scoped>
  :deep(.el-form) {
    width: 500px;
  }
</style>
