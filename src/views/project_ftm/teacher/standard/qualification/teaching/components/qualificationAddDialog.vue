<template>
  <el-dialog
    :title="title"
    v-model="visible"
    :close-on-click-modal="false"
    v-loading="loading"
    width="600px"
    modal
    center
    @close="closeEvent"
    @closed="freshEvent"
  >
    <el-form ref="form" label-width="120px" :model="formData" :rules="formRules">
      <!-- 资质内容 -->
      <el-form-item :label="$t('table.qualificationContent')" prop="name">
        <el-input
          class="full-width"
          v-model="formData.name"
          :placeholder="$t('holder.pleaseEnterQualificationContent')"
        />
      </el-form-item>
      <!-- 版本号 -->
      <el-form-item :label="$t('table.versionNumber')" prop="version">
        <el-input
          class="full-width"
          v-model="formData.version"
          :placeholder="$t('holder.pleaseEnterVersion')"
        />
      </el-form-item>
      <!-- 批准日期 -->
      <el-form-item :label="$t('table.approvalDate')" prop="checkDate">
        <el-date-picker
          :placeholder="$t('holder.pleaseSelectDate')"
          class="full-width"
          v-model="formData.checkDate"
        />
      </el-form-item>
      <!-- 批准人 -->
      <el-form-item :label="$t('table.approvalPerson')" prop="checkName">
        <el-input class="full-width" v-model="formData.checkName" />
      </el-form-item>
      <!-- 资质文件 -->
      <el-form-item :label="$t('table.qualificationFile')" prop="attachments">
        <el-upload
          action="#"
          accept=".pdf,image/*"
          :file-list="formData.attachments"
          :auto-upload="false"
          :on-change="addUploadFile"
          :on-remove="removeUploadFile"
        >
          <span class="buttonEdit">{{ $t('table.uploadAttachment') }}</span>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button class="btn" type="primary" plain @click="visible = false">{{
        $t('button.cancel')
      }}</el-button>
      <el-button class="btn" type="primary" @click="submitEvent">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import {
    postCenterQualification,
    putCenterQualification,
    uploadFile,
  } from '/@/api/ftm/teacher/education'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  const FormDataDto = {
    name: '',
    version: '',
    checkDate: '',
    checkName: '',
    attachments: [],
  }
  export default {
    data() {
      return {
        loading: false,
        formData: XEUtils.clone(FormDataDto, true),
        formRules: {
          name: [{ required: true, message: this.$t('holder.pleaseEnterQualificationContent') }],
          version: [{ required: true, message: this.$t('holder.pleaseEnterVersion') }],
        },
      }
    },
    props: {
      show: Boolean,
      isModify: Boolean,
      isUpdate: Boolean,
      modifyData: Object,
    },
    watch: {
      show: {
        immediate: true,
        handler(boolean) {
          if (
            boolean &&
            (this.isModify || this.isUpdate) &&
            this.modifyData != null &&
            this.modifyData != undefined
          ) {
            for (let [key, val] of Object.entries(this.modifyData)) {
              if (key == 'attachments') {
                this.formData[key] =
                  val instanceof Array
                    ? val.map((res) => ({
                        name: res.name + res.suffix,
                        size: res.size,
                        uid: res.uuid,
                        uuid: res.uuid,
                        origin: true,
                      }))
                    : []
              } else if (this.formData.hasOwnProperty(key)) {
                this.formData[key] = val
              }
            }
          }
        },
      },
    },
    computed: {
      title() {
        return this.isModify
          ? this.$t('button.modify')
          : this.isUpdate
          ? this.$t('button.upData')
          : this.$t('button.add')
      },
      visible: {
        get() {
          return this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
    },
    methods: {
      closeEvent() {},
      freshEvent() {
        this.formData = XEUtils.clone(FormDataDto, true)
        this.$refs.form.resetFields()
      },
      addUploadFile(file, files) {
        const fileRE = /(pdf|jpg|png|jpeg|gif)+?/i
        if (file.raw && fileRE.test(file.raw.type) == false) {
          this.$message.warning(this.$t('tip.uploadImgPDF'))
        }
        if (file.raw && fileRE.test(file.raw.type)) {
          let _files = files.filter((f) => (f.raw ? fileRE.test(f.raw.type) : true))
          _files = _files.length > 1 ? _files.slice(_files.length - 1) : _files
          this.formData.attachments = _files
        }
      },
      // 获取将上传的文件
      removeUploadFile(file, files) {
        this.formData.attachments = files
      },
      submitEvent() {
        this.$refs.form.validate((validity) => {
          if (!validity) return
          this.isModify
            ? this.putQualification()
            : this.isUpdate
            ? this.updateQualification()
            : this.postQualification()
        })
      },
      // 修改
      async putQualification() {
        this.loading = true
        let attachments = []
        // 已上传的文件uuid
        attachments = this.formData.attachments.filter((file) => file.origin).map((v) => v.uuid)
        // 准备上传的文件
        let uploadFunc = this.formData.attachments
          .filter((file) => !file.origin)
          .map((file) => {
            let uploadData = new FormData()
            uploadData.append('file', file.raw)
            return uploadFile(uploadData)
              .then((res) => {
                attachments.push(res.data.uuid)
              })
              .catch(() => {
                this.loading = false
              })
          })
        await Promise.all(uploadFunc)
        const params = {
          id: this.modifyData.id,
          ...this.formData,
          attachments,
        }
        let [err, res] = await to(putCenterQualification(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.modifySuccessTop'))
          this.$emit('success')
        }
      },
      // 新增
      async postQualification() {
        this.loading = true
        let uploadFunc = this.formData.attachments.map((file) => {
          let uploadData = new FormData()
          uploadData.append('file', file.raw)
          return uploadFile(uploadData)
            .then()
            .catch(() => {
              this.loading = false
            })
        })
        let resFiles = await Promise.all(uploadFunc)
        const params = {
          ...this.formData,
          attachments: resFiles.map((v) => v.data.uuid),
        }
        let [err, res] = await to(postCenterQualification(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.addsuccessTip'))
          this.$emit('success')
        }
      },
      // 更新
      async updateQualification() {
        this.loading = true
        let uploadFunc = this.formData.attachments.map((file) => {
          let uploadData = new FormData()
          uploadData.append('file', file.raw)
          return uploadFile(uploadData)
            .then()
            .catch(() => {
              this.loading = false
            })
        })
        let resFiles = await Promise.all(uploadFunc)
        const params = {
          ...this.formData,
          originId: this.modifyData.originId,
          attachments: resFiles.map((v) => v.data.uuid),
        }
        let [err, res] = await to(postCenterQualification(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.updateSucceeded'))
          this.$emit('success')
        }
      },
    },
  }
</script>
