<template>
  <div class="dashboard-container">
    <el-row :gutter="30" class="setting-row">
      <el-col :span="4" style="background: #fff">
        <div v-for="item in settingList" :key="item.id">
          <div
            class="tab-btn-setting"
            :class="{ 'is-active': activeIndex == item.id }"
            @click="activeIndex = item.id"
          >
            {{ item.name }}
          </div>
          <div class="triangle" v-if="activeIndex == item.id" style="margin-left: -5px" />
          <div
            class="triangle triangle-2"
            style="margin-left: -6px"
            v-if="activeIndex == item.id"
          />
        </div>
      </el-col>
      <el-col :span="20">
        <div class="my-col">
          <!--<Frame :title="$t('table.displayNavigationEffect')" v-if="activeIndex == 0">-->
          <!--  &lt;!&ndash; 导航效果展示 &ndash;&gt;-->
          <!--  <EffectDisplay :src="src" :detailData="form" />-->
          <!--</Frame>-->
          <Frame :title="$t('table.logoSettings')" v-if="activeIndex == 0">
            <!-- logo设置 -->
            <!-- <LogoSetting @changeFile="changeFile" :canEdit="canEdit" :src="src" /> -->
            <cropper-box @preview="previewLogo" :options="cropperOptions" :canEdit="canEdit" />
          </Frame>
          <Frame :title="$t('table.navigationBarStyle')" v-if="activeIndex == 0">
            <!-- 导航栏样式 -->
            <NavigationSetting @updateData="updateData" :detailData="form" :canEdit="canEdit" />
          </Frame>

          <Frame :title="$t('table.nameSetting')" v-if="activeIndex == 1">
            <el-form :model="settingsForm" ref="settingsForm" :disabled="!canEdit">
              <h2 class="label-title">{{ $t('table.chinese') }}</h2>
              <el-form-item
                :label="$t('router.coursewareDirectory')"
                prop="zhCN1"
                :rules="settingsFormRule('zh-CN', 'router.customCD')"
              >
                <el-input v-model="settingsForm['zh-CN']['router.customCD']" />
              </el-form-item>
              <el-form-item
                :label="$t('table.companyName')"
                prop="zhCN2"
                :rules="settingsFormRule('zh-CN', 'table.customCompany')"
              >
                <el-input v-model="settingsForm['zh-CN']['table.customCompany']">
                  <template v-slot:append>{{ $t('common.ExamResult') }}</template>
                </el-input>
              </el-form-item>
              <h2 class="label-title">{{ $t('table.Traditional') }}</h2>
              <el-form-item
                :label="$t('router.coursewareDirectory')"
                prop="zhTW1"
                :rules="settingsFormRule('zh-TW', 'router.customCD')"
              >
                <el-input v-model="settingsForm['zh-TW']['router.customCD']" />
              </el-form-item>
              <el-form-item
                :label="$t('table.companyName')"
                prop="zhTW2"
                :rules="settingsFormRule('zh-TW', 'table.customCompany')"
              >
                <el-input v-model="settingsForm['zh-TW']['table.customCompany']">
                  <template v-slot:append>{{ $t('common.ExamResult') }}</template>
                </el-input>
              </el-form-item>
              <h2 class="label-title">{{ $t('table.english') }}</h2>
              <el-form-item
                :label="$t('router.coursewareDirectory')"
                prop="enUS1"
                :rules="settingsFormRule('en-US', 'router.customCD')"
              >
                <el-input v-model="settingsForm['en-US']['router.customCD']" />
              </el-form-item>
              <el-form-item
                :label="$t('table.companyName')"
                prop="enUS2"
                :rules="settingsFormRule('en-US', 'table.customCompany')"
              >
                <el-input v-model="settingsForm['en-US']['table.customCompany']">
                  <template v-slot:append>{{ $t('common.ExamResult') }}</template>
                </el-input>
              </el-form-item>
            </el-form>
          </Frame>
          <div class="exam-paper-wrap" v-if="activeIndex == 2">
            <div class="exam-paper-model">
              <div class="title">
                {{ $t('table.flyExamPaper') }}
                <svg-icon class="svg-icon" iconClass="examImg" v-if="!option.img" />
                <img :src="option.img" alt="" v-else style="height: 24px" class="svg-icon" />
              </div>
              <div class="row-gray" v-for="i in 13" :key="i" />
            </div>
            <div class="cropper-box" v-show="canEdit">
              <label class="cropper-upload" for="fileInput" ref="selectLabel">
                <span class="cropper-upload-t">{{ $t('button.clickUpload') }}</span>
              </label>
              <input
                id="fileInput"
                style="position: absolute; clip: rect(0 0 0 0)"
                type="file"
                accept="image/*"
                @change="selectImg"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="footerBtn">
      <el-button
        v-if="containsPermissions(menuName + ':EDIT')"
        v-show="canEdit == false"
        type="primary"
        @click="canEdit = true"
      >
        {{ $t('button.edit') }}
      </el-button>
      <el-button
        v-show="canEdit"
        type="primary"
        class="rightBtn"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ $t('button.save') }}
      </el-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Frame from '/@/views/project_ftm/teacher/components/Frame/index.vue'
  // import EffectDisplay from './components/effectDisplay.vue'
  import LogoSetting from './components/logoSetting.vue'
  import NavigationSetting from './components/navigationSetting.vue'
  import CropperBox from './components/cropper.vue'
  import { putSettings } from '/@/api/ftm/teacher/systemSettings'
  import { previewURL } from '/@/api/ftm/teacher/studentTraining'
  import { dataURLtoFile, blobToDataURL } from '/@/utils/index'
  import { useFtmSettingsStore } from '/@/store/modules/ftmSetting'
  import { useI18n } from 'vue-i18n'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  const accountStore = useUserStore()
  const settingsStore = useFtmSettingsStore()
  export default {
    name: 'BaseSrtting',
    components: {
      Frame,
      // EffectDisplay,
      LogoSetting,
      NavigationSetting,
      CropperBox,
    },
    data() {
      const I18nItems = ['router.customCD', 'table.customCompany']
      const settingsForm = { 'zh-CN': {}, 'zh-TW': {}, 'en-US': {} }
      for (let i = 0; i < I18nItems.length; i++) {
        for (let [key] of Object.entries(settingsForm)) {
          settingsForm[key][I18nItems[i]] = ''
        }
      }
      return {
        menuName: 'NAVIGATION_BAR_SETTINGS',
        src: null,
        form: {
          fileUUID: null,
          systemName: null,
          fontColor: null,
          backgroundColor: null,
        },
        settingsForm,
        loading: false,
        formRef: null,
        canEdit: false,
        file: null,
        cropperOptions: {},
        activeIndex: 0,
        settingList: [
          {
            id: 0,
            name: this.$t('table.navigationBarSet'),
          },
          {
            id: 1,
            name: this.$t('table.nameSetting'),
          },
          {
            id: 2,
            name: this.$t('table.navigationBarExanLogo'),
          },
        ],
        option: {
          img: '',
        },
        file2: null,
      }
    },
    computed: {
      userId() {
        return userStore.userInfo.userId
      },
      backgroundColor() {
        return settingsStore.backgroundColor
      },
      fontColor() {
        return settingsStore.fontColor
      },
      fileUUID() {
        return settingsStore.fileUUID
      },
      systemName() {
        return settingsStore.systemName
      },
      others() {
        return settingsStore.others
      },
      detailData() {
        return {
          backgroundColor: this.backgroundColor,
          fontColor: this.fontColor,
          fileUUID: this.fileUUID,
          systemName: this.systemName,
        }
      },
    },
    watch: {
      detailData: {
        immediate: true,
        deep: true,
        handler(val) {
          Object.assign(this.form, val)
          if (val.fileUUID) {
            this.src = previewURL(val.fileUUID)
            this.cropperOptions.img = previewURL(val.fileUUID)
          }
        },
      },
      others: {
        immediate: true,
        handler(str) {
          try {
            this.settingsForm = JSON.parse(str)
            if (!this.settingsForm['zh-CN']) {
              this.settingsForm['zh-CN'] = {}
            }
            if (!this.settingsForm['zh-TW']) {
              this.settingsForm['zh-TW'] = {}
            }
            if (!this.settingsForm['en-US']) {
              this.settingsForm['en-US'] = {}
            }
            if (!this.settingsForm['examfileUUID']) {
              this.settingsForm['examfileUUID'] = ''
            } else {
              this.option.img = previewURL(this.settingsForm['examfileUUID'])
            }
          } catch (e) {
            this.settingsForm = { 'zh-CN': {}, 'zh-TW': {}, 'en-US': {} }
          }
        },
      },
    },
    setup() {
      const { locale } = useI18n()
      return { locale }
    },
    methods: {
      selectImg(e) {
        let file = e.target.files[0]
        if (!file || !file.type) return false
        if (!file.type.includes('image'))
          return this.$message.error(this.$t('tip.uploadImgFormatError'))
        blobToDataURL(file, (url) => {
          this.option.img = url
          this.previewLogo2(url)
        })
      },
      putSettings() {
        let obj = JSON.parse(JSON.stringify(this.form))
        // obj.id = this.editId
        obj.others = JSON.stringify(this.settingsForm)
        putSettings(obj).then((res) => {
          if (res.status == 200) {
            this.$message.success(this.$t('tip.updateSucceeded'))
            this.$store.dispatch('settings/getNavigationBarId')
            this.canEdit = false
          }
        })
      },
      async uploadForm() {
        let formData = new FormData()
        formData.append('file', this.file)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept-Language': this.locale,
            Authorization: 'Bearer ' + accountStore.token,
          },
        }
        var baseURL = import.meta.env.VITE_BASE_API_PUB + '/files/upload'
        this.loading = true
        await axios.post(baseURL, formData, config).then((res) => {
          if (res.status == 200) {
            this.form.fileUUID = res.data.uuid
            this.cropperOptions.img = this.src
            this.putSettings()
          } else {
            this.$message({
              message: this.$t('common.failSuccess'),
              type: 'error',
            })
          }
        })
        this.loading = false
      },
      async uploadForm2() {
        let formData = new FormData()
        formData.append('file', this.file2)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept-Language': this.locale,
            Authorization: 'Bearer ' + accountStore.token,
          },
        }
        var baseURL = import.meta.env.VITE_BASE_API_PUB + '/files/upload'
        this.loading = true
        await axios.post(baseURL, formData, config).then((res) => {
          if (res.status == 200) {
            this.settingsForm.examfileUUID = res.data.uuid
            this.putSettings()
          } else {
            this.$message({
              message: this.$t('common.failSuccess'),
              type: 'error',
            })
          }
        })
        this.loading = false
      },
      handleConfirm() {
        this.formRef.validate(async (valid) => {
          let settingsValide = false
          if (this.activeIndex == 1) {
            await this.ModifyName((bool) => {
              settingsValide = bool
            })
          } else {
            settingsValide = true
          }
          if (valid && settingsValide) {
            if (this.file) {
              this.uploadForm()
            } else if (this.file2) {
              this.uploadForm2()
            } else {
              this.putSettings()
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      changeFile(file) {
        // console.log(file);
        this.file = file
        this.src = URL.createObjectURL(file.raw)
      },
      updateData([val, form]) {
        this.formRef = form
        let obj = JSON.parse(JSON.stringify(val))
        delete obj.fileUUID
        Object.assign(this.form, obj)
      },
      // 试卷logo
      previewLogo2(base64) {
        let name = new Date().getTime() + '.png'
        this.file2 = dataURLtoFile(base64, name)
      },
      // 预览图片
      previewLogo(base64) {
        let name = new Date().getTime() + '.png'
        this.src = base64
        this.file = dataURLtoFile(base64, name)
      },
      ModifyName(callback) {
        this.$refs.settingsForm.validate((bool) => {
          callback(bool)
        })
      },
      settingsFormRule(lang, key) {
        return [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, cb) => {
              if (
                this.settingsForm[lang] &&
                this.settingsForm[lang][key] &&
                this.settingsForm[lang][key].length
              ) {
                return cb()
              } else {
                return cb(new Error(this.$t('holder.pleaseEnter')))
              }
            },
          },
        ]
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      height: 100%;
      padding: 0;
      background: none !important;
      .footerBtn {
        position: fixed;
        padding-right: 30px;
        right: 0;
        bottom: 0;
        background-color: #fff;
        width: 100%;
        text-align: right;
        height: 60px;
        line-height: 60px;
        z-index: 10;
      }
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
  .tab-btn-setting {
    width: 146px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background: #eaf0f9;
    color: #215ebe;
    border-radius: 4px;
    margin: 16px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: inline-block;
    &.is-active {
      background: #215ebe;
      color: #fff;
    }
  }
  .triangle {
    width: 0px;
    height: 0px;
    display: inline-block;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 6px solid #215ebe;
    border-right: 6px solid transparent;
    &-2 {
      border-left: 6px solid rgba(33, 94, 190, 0.25);
    }
  }
  .setting-row {
    height: calc(100% - 44px);
    .el-col {
      height: 100% !important;
    }
    .my-col {
      height: 100%;
      overflow: auto;
      background: #fff;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .el-col-4 {
      width: 226px;
      padding-right: 0 !important;
    }
    .el-col-20 {
      width: calc(100% - 226px);
    }
  }
  .exam-paper-wrap {
    padding: 20px;
    .exam-paper-model {
      width: 285px;
      height: 403px;
      background: #f5f5f5;
      border-radius: 4px;
      position: relative;
      padding: 16px 12px;
    }
    .title {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
      font-weight: 700;
    }
    .svg-icon {
      font-size: 24px;
      position: absolute;
      top: 12px;
      left: 16px;
    }
    .row-gray {
      width: 261px;
      height: 17px;
      background: #e8e8e8;
      margin-bottom: 7px;
    }
  }

  .cropper-box {
    position: relative;
    width: 98px;
    height: 40px;
    line-height: 40px;
    margin: 26px 0 0 98px;
    .cropper-upload {
      display: block;
      width: 100%;
      height: 100%;
      user-select: none;
      cursor: pointer;
      color: #fff;
      background: #215ebe;
      text-align: center;
      border-radius: 4px;
      .cropper-icon {
        position: relative;
        margin-top: 10%;
        font-size: 50px;
      }
      .cropper-upload-t {
        font-size: 14px;
      }
    }
    .footer-box {
      position: absolute;
      left: 100%;
      top: 0;
      margin-left: 40px;
      >>> .el-button {
        display: block;
        margin: 0 0 15px 0;
      }
    }
  }
</style>
