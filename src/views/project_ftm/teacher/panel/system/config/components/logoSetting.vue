<template>
  <el-upload
    :disabled="!canEdit"
    class="avatar-uploader"
    action="#"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :http-request="getFile"
    :auto-upload="false"
    :on-change="beforeAvatarUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon">
      <Plus />
    </el-icon>
  </el-upload>
</template>

<script>
  import axios from 'axios'
  import { Plus } from '@element-plus/icons-vue'
  import { useUserStore } from '/@/store/modules/user'
  import { useI18n } from 'vue-i18n'
  const accountStore = useUserStore()
  export default {
    name: 'LogoSetting',
    components: { Plus },
    props: {
      canEdit: Boolean,
      src: String,
    },
    data() {
      return {
        imageUrl: '',
      }
    },
    watch: {
      src: {
        immediate: true,
        handler(val) {
          this.imageUrl = val
        },
      },
    },
    setup() {
      const { locale } = useI18n()
      return { locale }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
      },
      beforeAvatarUpload(file) {
        // console.log(file);
        const list = ['image/jpeg', 'image/png']
        const isJPG = list.includes(file.raw.type)
        if (!isJPG) {
          this.$message.error(this.$t('tip.pleaseUploadThePicture'))
          return isJPG
        }
        this.imageUrl = URL.createObjectURL(file.raw)
        this.$emit('changeFile', file)
        // const isJPG = file.type === "image/jpeg";
      },
      getFile(file) {
        let formData = new FormData()
        formData.append('file', file.file)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept-Language': this.locale,
            Authorization: 'Bearer ' + accountStore.token,
          },
        }
        var baseURL = window.myFileBaseUrl + '/quality/attachment/upload'
        axios.post(baseURL, formData, config).then((res) => {
          if (res.status == 200) {
            this.form.logoId = res.data.id
            this.logoUrl = `${window.myFileBaseUrl}/quality/attachment/${res.data.id}/inlineFile`
            this.$message({
              message: this.$t('common.uploadSuccess'),
              type: 'success',
            })
          } else {
            this.$message({
              message: this.$t('common.failSuccess'),
              type: 'error',
            })
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  }
  .avatar-uploader {
    :deep(.el-upload:hover) {
      border-color: #215ebe;
    }
  }
  :deep(.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  :deep(.avatar) {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
