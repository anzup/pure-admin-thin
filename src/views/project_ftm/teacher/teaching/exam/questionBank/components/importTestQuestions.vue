<template>
  <el-dialog
    width="500px"
    center
    :title="$t('button.importTestQuestions')"
    v-model="isShow"
    @closed="dialogClosed"
  >
    <div class="importInfo">
      <div class="import">
        <span class="importTxt">
          {{ $t('holder.importFormat') }}
        </span>
        <el-button type="primary" @click="getQuestionBanksBatchDeleteImport">{{
          $t('table.downloadTemplate')
        }}</el-button>
      </div>
      <el-upload
        ref="QuillUpload"
        id="quill-upload"
        accept=".xlc,.xls,.xlsx"
        action="#"
        name="upload_file"
        :multiple="false"
        :auto-upload="false"
        :http-request="getFile"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :limit="1"
      >
        <el-button size="small" type="primary">{{ $t('button.selectFile') }}</el-button>
      </el-upload>
    </div>
    <template #footer>
      <el-button @click="handleCancel" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave" :loading="uploadLoading">{{
        $t('button.leadingIn')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getQuestionBanksBatchDeleteImport } from '/@/api/ftm/teacher/examCenter'
  import axios from 'axios'
  import { useI18n } from 'vue-i18n'
  export default {
    props: ['importTestQuestionsDialogVisible', 'questionBankId'],
    data() {
      return {
        formData: undefined,
        studentList: [],
        status: false,
        uploadLoading: false,
      }
    },
    computed: {
      isShow: {
        get() {
          return this.importTestQuestionsDialogVisible
        },
        set(b) {
          this.$emit('update:importTestQuestionsDialogVisible', b)
        },
      },
    },
    setup() {
      const { locale } = useI18n()
      return { locale }
    },
    methods: {
      beforeUpload(file) {
        const isJpg =
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        if (!isJpg) {
          this.$message.error(this.$t('tip.onlyImportExcel'))
        }
        return isJpg
      },
      getFile(file) {
        this.formData = new FormData()
        this.formData.append('file', file.file)
        let config = {
          headers: {
            Authorization: 'Bearer ' + window.sessionStorage.getItem('access_token'),
            'Accept-Language': this.locale,
          },
        }
        var baseURL = `${import.meta.env.VITE_BASE_API_FTM}/questionBanks/${
          this.questionBankId
        }/questionImport`
        this.uploadLoading = true
        axios
          .post(baseURL, this.formData, config)
          .then((res) => {
            if (res.status == 200) {
              // this.status = true
              this.isShow = false
              this.$message({
                type: 'success',
                duration: 5000,
                message: this.$t('tip.uploadSuccess'),
              })
              this.$emit('confirm')
            } else {
              this.$message({
                type: 'error',
                duration: 5000,
                message: this.$t('tip.uploadFail'),
              })
            }
            this.uploadLoading = false
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              duration: 5000,
              message: error.response.data.msg,
            })
            // this.status = false
            this.uploadLoading = false
          })
      },
      handleRemove() {
        this.formData = new FormData()
        this.formData.set('file', null)
      },
      handleCancel() {
        this.isShow = false
        this.$refs.QuillUpload.clearFiles()
        this.$emit('handleCancel')
      },
      // 点击导入
      handleSave() {
        this.$refs.QuillUpload.submit()
      },
      dialogClosed() {
        this.$refs.QuillUpload.clearFiles()
        this.$emit('handleCancel')
      },
      getQuestionBanksBatchDeleteImport() {
        getQuestionBanksBatchDeleteImport().then((res) => {})
      },
    },
  }
</script>

<style lang="scss" scoped>
  .importInfo {
    margin-left: 10px;
  }

  .import {
    margin-bottom: 15px;
  }
  .importTxt {
    display: inline;
    line-height: 40px;
    margin-right: 20px;
  }
</style>
