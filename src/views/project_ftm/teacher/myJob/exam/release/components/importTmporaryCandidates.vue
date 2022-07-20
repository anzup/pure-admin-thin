<template>
  <div class="importTmporaryCandidates">
    <el-dialog
      width="500px"
      center
      :title="$t('button.importTemporaryCandidates')"
      v-model:visible="isShow"
      :before-close="handleCancel"
      @closed="closed"
    >
      <span class="dialogBox">
        <div class="importInfo">
          <div class="import">
            <span style="display: inline-block; margin-right: 20px">
              {{ $t('holder.importFormat') }}
            </span>
            <el-button type="primary" @click="getExamsStudentImportEvent">{{
              $t('table.downloadTemplate')
            }}</el-button>
          </div>
          <el-upload
            id="quill-upload"
            ref="upload"
            accept=".xlc,.xls,.xlsx"
            :auto-upload="false"
            :action="uploadAddress"
            name="file"
            :limit="1"
            :headers="uploadHeader"
            :multiple="false"
            :file-list="fileList"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-progress="handleProgress"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="primary">{{ $t('button.selectFile') }}</el-button>
          </el-upload>
        </div>
      </span>
      <template #footer>
        <el-button @click="handleCancel" type="primary" plain size="medium">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" size="medium" :loading="loading" @click="handleSave">{{
          $t('button.leadingIn')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { getExamsStudentImport } from '/@/api/ftm/teacher/examCenter'
  export default {
    props: ['importTemporaryDialogVisible'],
    data() {
      return {
        isShow: false,
        formData: undefined,
        studentList: [],
        fileList: [],
        loading: false,
        uploadAddress: `${import.meta.env.VITE_BASE_API_FTM}/exams/studentImport`,
        uploadHeader: {
          Authorization: 'Bearer ' + window.sessionStorage.getItem('access_token'),
          // TODO 传递语言环境
          // 'Accept-Language': getLanguage()
        },
      }
    },
    watch: {
      importTemporaryDialogVisible(val) {
        this.isShow = val
      },
    },
    methods: {
      beforeUpload(file) {
        const isJpg =
          file.type === 'application/vnd.ms-excel' ||
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        if (!isJpg) {
          this.$message.error(this.$t('tip.onlyImportExcel'))
        }
      },
      getFile(file) {
        return false
      },
      handleChange(file, list) {
        this.fileList = list
      },
      handleRemove(file, list) {
        this.fileList = list
      },
      handleCancel() {
        this.$emit('handleCancel')
      },
      handleSave() {
        if (this.fileList.length == 0) {
          this.$message.error(this.$t('tip.pleaseSelectFileImport'))
        } else {
          this.loading = true
          this.$refs.upload.submit()
        }
      },
      handleSuccess(data) {
        this.loading = false
        this.$message.success(this.$t('tip.uploadSuccess'))
        this.$emit('getImportData', data)
      },
      handleError(res) {
        this.loading = false
        try {
          let data = JSON.parse(res.message)
          this.$message.error(data.msg || `error status:${res.status}`)
        } catch (e) {
          this.$message.error(this.$t('tip.uploadFail'))
        }
      },
      handleProgress() {
        console.log('上传')
      },
      closed() {
        this.loading = false
        this.fileList = []
        this.$refs.upload.clearFiles()
        this.$refs.upload.abort()
      },
      getExamsStudentImportEvent() {
        getExamsStudentImport().then((res) => {})
      },
    },
  }
</script>

<style>
  .importTmporaryCandidates .el-dialog__footer {
    margin: 0 30px;
    border-top: 1px solid #e8e8e8;
    padding-right: 0;
  }
  .importTmporaryCandidates .importInfo {
    margin-left: 10px;
  }
  .importTmporaryCandidates .import {
    margin-bottom: 15px;
  }
</style>
