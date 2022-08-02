<template>
  <el-scrollbar>
    <div class="sign-form-header">
      <el-divider direction="vertical" />
      <span>{{ $t('table.signSet') }}</span>
    </div>
    <!-- 设置签名 -->
    <div class="sign-form-item">
      <div class="sign-image">
        <img :src="imgURL" alt="" v-if="imgURL" />
        <span class="sign-point" v-else-if="imgURL == undefined">{{
          $t('holder.noSetSignature')
        }}</span>
      </div>
      <div class="btn-line">
        <el-upload
          class="sign-upload"
          ref="signUpload"
          accept="image/jpeg, image/jpg, image/png"
          action="#"
          :multiple="false"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="startUpload"
        >
          <el-button slot="trigger" type="primary" plain @click="triggerUpload">{{
            $t('button.clickUpload')
          }}</el-button
          ><!-- 点击上传 -->
        </el-upload>
        <el-button type="primary" @click="signDialogVisible = true">{{
          $t('button.addSign')
        }}</el-button
        ><!-- 手写签名 -->
      </div>
    </div>
    <el-form class="mt20" inline :model="form" :rules="formRules" ref="signForm">
      <!-- <div class="sign-form-header">{{ $t('table.signPincodSet') }}</div> -->
      <el-form-item class="sign-form-item" prop="pinCode" required :label="$t('table.pinCode')">
        <!-- pin码输入框 -->
        <el-input
          type="password"
          class="pincode-input"
          v-model.trim="form.pinCode"
          :placeholder="$t('holder.pleaseEnterSignPinCode')"
        />
      </el-form-item>
      <!-- <el-form-item class="sign-form-item" prop="rePinCode" required :label="$t('button.comfirm') + $t('table.pinCode')">
            <el-input type="password" class="pincode-input" v-model.trim="form.rePinCode" :placeholder="$t('holder.pleaseEnterSignPinCode')"></el-input>
        </el-form-item> -->
    </el-form>
    <el-button class="mt20" :loading="loadingSave" type="primary" @click="submitSave">{{
      $t('button.saveSign')
    }}</el-button>
  </el-scrollbar>

  <sign-dialog v-model="signDialogVisible" :loading="loadingSign" @confirm="getImageData" />
</template>

<script>
  import signDialog from './signDialog.vue'
  import { dataURLtoFile, blobToDataURL } from '/@/utils/index'
  import { updateSignForm, getPersonCurrnt, previewFile } from '/@/api/ftm/teacher/personCenter'
  export default {
    data() {
      const repeatInput = (rule, value, cb) => {
        if (value == '') {
          cb(new Error(this.$t('holder.pleaseEnter') + this.$t('table.pinCode')))
          console.log(this.form)
        } else if (value != this.form.pinCode) {
          cb(new Error(this.$t('tip.repincodeFail')))
        } else {
          cb()
        }
      }
      return {
        signDialogVisible: false,
        loadingSign: false,
        loadingSave: false,
        imgURL: '',
        form: {
          signImg: '',
          pinCode: '',
        },
        formRules: {
          pinCode: [{ required: true, message: this.$t('holder.pleaseEnterSignPinCode') }],
          // rePinCode: [
          //     { validator: repeatInput, trigger: 'blur' }
          // ]
        },
      }
    },
    components: { signDialog },
    created() {
      this.init()
    },
    methods: {
      // 初始化
      async init() {
        let { data } = await getPersonCurrnt()
        let uuid = data.signatureFileUuid
        if (uuid) {
          // 获取签名图片
          previewFile(uuid).then((res) => {
            // 数据流转二进制文件
            let blob = new Blob([res.data], { type: 'image/*' })
            this.imgURL = window.URL.createObjectURL(blob)
            // 二进制转file
            let file_name = Date.parse(new Date()) + '.jpg'
            this.form.signImg = new window.File([blob], file_name, { type: 'image/jpg' })
          })
        } else {
          this.imgURL = undefined
        }
      },
      // 获取图片base64数据
      getImageData(imgBase) {
        this.signDialogVisible = false
        this.imgURL = imgBase
        this.form.signImg = (imgBase && dataURLtoFile(imgBase)) || ''
      },
      // 点击上传签名
      triggerUpload() {
        // this.$refs.signUpload.
      },
      // 上传前检查
      beforeUpload(file) {
        if (file.size > 500 * 1024) {
          this.$message({
            type: 'warning',
            duration: 1500,
            message: this.$t('tip.uploadImgFail'),
          })
        }
      },
      // 开始上传
      startUpload(file) {
        this.form.signImg = file.file
        blobToDataURL(file.file, (url) => {
          this.imgURL = url
        })
      },
      // 保存签名设置
      submitSave() {
        this.$refs.signForm.validate((bool) => {
          if (!bool) return
          if (!this.form.signImg)
            return this.$message({
              type: 'error',
              duration: 1500,
              message: this.$t('holder.noSetSignature'),
            })
          this.uploadForm()
        })
      },
      async uploadForm() {
        let Form = new FormData()
        Form.append('file', this.form.signImg)
        Form.append('pinCode', this.form.pinCode)
        this.loadingSave = true
        try {
          await updateSignForm(Form)
          this.loadingSave = false
          this.init()
          this.$message({
            type: 'success',
            duration: 1500,
            message: this.$t('tip.setsuccessTip'),
          })
          this.form.pinCode = ''
          this.$nextTick(() => {
            this.$refs.signForm.clearValidate()
          })
        } catch (error) {
          this.loadingSave = false
        }
      },
    },
  }
</script>

<style lang="scss" scope>
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  .header-title {
    font-size: 16px;
    color: #666;
  }
  .mt20 {
    margin-top: 20px;
  }
  .sign-form-item {
    // width: calc(50% - 10PX);
    margin-right: 40px !important;
    .sign-image {
      width: 500px;
      height: 300px;
      margin-bottom: 20px;
      text-align: center;
      border: 1px solid #ccc;
      user-select: none;
      &::before {
        content: '';
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
      }
      img {
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
      }
    }
    .pincode-input {
      width: calc(500px - 8em);
    }
    .el-form-item__label {
      width: 8em;
      text-align: left;
      white-space: nowrap;
    }
  }
  .sign-form-header {
    padding: 10px 0;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 700;
    color: $elButtonBg;
    // border-bottom: 1px solid #ccc;
    .el-divider--vertical {
      width: 2px;
      height: 15px;
      vertical-align: unset;
      background: $elButtonBg;
    }
  }
  .sign-upload {
    display: inline-block;
    margin-right: 20px;
  }
</style>
