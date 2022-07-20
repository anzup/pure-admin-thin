<template>
  <el-dialog width="600px" center :title="title" v-model="diaLogShow">
    <el-form
      ref="form"
      :disabled="status == 'detail'"
      :model="form"
      label-width="150px"
      :rules="rules"
    >
      <el-form-item :label="$t('table.nameOfLicense')" prop="name">
        <el-input v-model="form.name" :placeholder="$t('holder.pleaseEnter')" />
      </el-form-item>
      <el-form-item :label="$t('table.validityOfLicense')" prop="dateTime">
        <hyx-date-picker v-model="form.dateTime" />
      </el-form-item>
      <el-form-item :label="$t('table.reminderTimeInAdvance')" prop="timeOutOfNotify">
        <el-input-number v-model="form.timeOutOfNotify" :min="0" />
        <!-- label="描述文字" -->
      </el-form-item>
      <el-form-item :label="$t('table.uploadLicense')">
        <el-upload
          id="quill-upload"
          accept=".jpg,.png,.gif,.pdf"
          action="#"
          name="upload_file"
          :multiple="false"
          :file-list="fileList"
          :http-request="getFile"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          ref="upload"
        >
          <el-button size="small" type="primary">{{ $t('button.selectFile') }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="diaLogShow = false" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" @click="comfirm" size="medium">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import axios from 'axios'
  import { previewURL } from '/@/api/ftm/teacher/studentTraining'
  import {
    postEmployeeQualifications,
    getEmployeeQualificationsId,
    putEmployeeQualifications,
  } from '/@/api/ftm/teacher/education'
  // import { getLanguage } from '@/utils/i18n'
  export default {
    name: 'LicenceDialog',
    props: {
      aaa: Boolean,
      rowData: Object,
      title: String,
      detailId: [Number, String],
    },
    model: {
      prop: 'aaa',
      event: 'change',
    },
    data() {
      return {
        form: {
          name: undefined,
          fileUUID: undefined,
          timeOutOfNotify: 0,
          dateTime: ['', ''],
        },
        fileList: [],
        status: undefined,
        fileTypeLits: ['image/jpeg', 'image/png', 'image/gif', 'image/tiff', 'application/pdf'],
        rules: {
          name: [{ required: true, message: this.$t('holder.pleaseEnter') }],
          timeOutOfNotify: [{ required: true, message: this.$t('holder.pleaseEnter') }],
          dateTime: [{ required: true, validator: this.validateDate }],
        },
      }
    },
    computed: {
      diaLogShow: {
        get() {
          return this.aaa
        },
        set(val) {
          this.$emit('change', val)
        },
      },
    },
    created() {
      let { status } = this.rowData
      this.status = status
      if (status !== 'add') {
        this.getEmployeeQualificationsId()
      }
    },
    methods: {
      getFile(file) {
        let formData = new FormData()
        formData.append('file', file.file)
        let config = {
          headers: {
            Authorization: 'Bearer ' + window.sessionStorage.getItem('access_token'),
            // TODO 传递语言环境
            // 'Accept-Language': getLanguage()
          },
        }
        var baseURL = `${import.meta.env.VITE_BASE_API_PUB}/files/upload`
        axios.post(baseURL, formData, config).then((res) => {
          if (res.status == 200) {
            this.$refs.upload.clearFiles()
            res.data.name = res.data.name + res.data.suffix
            res.data.url = previewURL(res.data.uuid)
            this.fileList = [res.data]
            this.form.fileUUID = res.data.uuid
          }
        })
      },
      handleRemove(file) {
        this.fileList = []
        this.form.fileUUID = undefined
      },
      beforeUpload(file) {
        if (this.fileList.length > 0) {
          this.fileList = []
        }
        const isload = this.fileTypeLits.includes(file.type.toLowerCase())

        if (!isload) {
          this.$message.error(this.$t('tip.uploadImgPDF'))
        }

        return isload
      },
      comfirm() {
        if (this.rowData.status == 'add') {
          this.postEmployeeQualifications()
        } else if (this.rowData.status == 'edit') {
          this.putEmployeeQualifications()
        } else {
          this.diaLogShow = false
        }
      },
      postEmployeeQualifications() {
        this.$refs.form.validate((vality) => {
          if (!vality) return
          let { id } = this.rowData
          let data = {
            employeeId: id,
            fileUUID: this.form.fileUUID,
            name: this.form.name,
            timeOutOfNotify: this.form.timeOutOfNotify,
            validityStartTime: this.form.dateTime ? this.form.dateTime[0] : undefined,
            validityEndTime: this.form.dateTime ? this.form.dateTime[1] : undefined,
          }
          postEmployeeQualifications(data).then((res) => {
            if (res.status == 200) {
              this.diaLogShow = false
              this.$message.success(this.$t('tip.saveSuccessTip'))
              this.$emit('updateData')
            }
          })
        })
      },
      getEmployeeQualificationsId() {
        getEmployeeQualificationsId({ id: this.detailId }).then((res) => {
          if (res.status == 200) {
            this.form = res.data
            this.form.dateTime = [res.data.validityStartTime, res.data.validityEndTime]
            this.fileList = [
              {
                name: res.data.name,
                url: previewURL(res.data.uuid),
                uuid: res.data.uuid,
              },
            ]
          }
        })
      },
      putEmployeeQualifications() {
        let { id } = this.rowData
        // console.log(this.form.fileUUID);
        let data = {
          // employeeId: id,
          id: this.detailId,
          fileUUID: this.form.fileUUID,
          name: this.form.name,
          timeOutOfNotify: this.form.timeOutOfNotify,
          validityStartTime: this.form.dateTime ? this.form.dateTime[0] : undefined,
          validityEndTime: this.form.dateTime ? this.form.dateTime[1] : undefined,
        }
        putEmployeeQualifications(data).then((res) => {
          if (res.status == 200) {
            this.diaLogShow = false
            this.$emit('updateData')
            this.$message.success(this.$t('tip.editSuccessTip'))
          }
        })
      },
      validateDate(rule, value, cb) {
        if (value instanceof Array && value.length == 2) {
          if (value.every((val) => !!new Date(val).getTime())) {
            cb()
          } else {
            cb(new Error(this.$t('holder.pleaseSelectDate')))
          }
        } else {
          cb(new Error(this.$t('holder.pleaseSelectDate')))
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  :deep(.is-ready) {
    display: none;
  }
  :deep(.el-select),
  :deep(.el-date-editor),
  :deep(.el-input-number) {
    width: 100%;
  }
</style>
