<template>
  <el-dialog
    v-model="visible"
    v-loading="loading"
    :title="$t('button.apply')"
    :close-on-click-modal="false"
    width="600px"
    modal
    center
    @closed="freshEvent"
  >
    <el-form ref="form" label-width="150px" label-suffix=":" :model="formData" :rules="formRules">
      <!-- 课程名称 -->
      <el-form-item :label="$t('table.courseName')">
        {{ detail.courseName }}
      </el-form-item>
      <!-- 机型 -->
      <el-form-item :label="$t('table.modelNumber')">
        {{ detail.airplaneType }}
      </el-form-item>
      <!-- 资质名称 -->
      <el-form-item :label="$t('table.qualificationName')">
        {{ detail.name }}
      </el-form-item>
      <!-- 获取时间 -->
      <el-form-item :label="$t('table.acquisitionTime')" prop="getTime">
        <el-date-picker
          :disabled-date="getDatePickerOptions.disabledDate"
          :placeholder="$t('holder.pleaseSelectDate')"
          class="full-width"
          v-model="formData.getTime"
          @change="changeGetDateEvent"
        />
      </el-form-item>
      <template v-if="!hasLifelong">
        <!-- 到期时间 -->
        <el-form-item :label="$t('table.expirationTime')" prop="expireTime">
          <el-date-picker
            :disabled-date="expiraDatePickerOptions.disabledDate"
            :placeholder="$t('holder.pleaseSelectDate')"
            class="full-width"
            v-model="formData.expireTime"
          />
        </el-form-item>
      </template>
      <!-- 上传文件 -->
      <el-form-item :label="$t('button.uploadFolder')" prop="attachments">
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
      <el-button class="btn" type="primary" :loading="loading" @click="submitEvent">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import to from 'await-to-js'
  import { uploadFile } from '/@/api/ftm/teacher/education'
  import { postQualifications } from '/@/api/ftm/teacher/qualification'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        loading: false,
        formData: {
          getTime: '',
          expireTime: '',
          attachments: [],
        },
        formRules: {
          getTime: [{ required: true, message: this.$t('holder.pleaseSelectDate') }],
          expireTime: [{ required: true, message: this.$t('holder.pleaseSelectDate') }],
          attachments: [{ required: true, validator: this.validateFiles }],
        },
      }
    },
    props: {
      show: Boolean,
      id: [String, Number],
      isModify: Boolean,
    },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      visible: {
        get() {
          return !!this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
      detail() {
        let { courseName, name, airplaneType } = this.$attrs
        return { courseName, name, airplaneType }
      },
      getDatePickerOptions() {
        return {
          disabledDate: (time) => {
            return false
            // return moment(time).format('YYYY/MM/DD') < moment().format('YYYY/MM/DD')
          },
        }
      },
      expiraDatePickerOptions() {
        return {
          disabledDate: (time) => {
            return new Date(time) <= new Date(this.formData.getTime)
          },
        }
      },
      hasLifelong() {
        return !!this.$attrs.lifeLong
      },
    },
    methods: {
      addUploadFile(file, files) {
        const fileRE = /((pdf)|(jpg)|(png)|(jpeg)|(gif))+?/i
        if (file.raw && fileRE.test(file.raw.type) == false) {
          this.formData.attachments = this.formData.attachments.filter((f) =>
            fileRE.test(file.raw.type),
          )
          return this.$message.warning(this.$t('tip.uploadImgPDF'))
        }
        const nowFile = this.formData.attachments[0]
        let fileSame = true
        // 对比属性避免重复上传同一个文件
        for (let [key, val] of Object.entries(file)) {
          if ((typeof val == 'string' || typeof val == 'number') && key != 'uid') {
            if (!nowFile || nowFile[key] != val) {
              fileSame = false
              break
            }
          }
        }
        if (fileSame === false) {
          this.formData.attachments = [file]
        } else {
          files.splice(files.length - 1, 1)
          this.formData.attachments = files
        }
      },
      // 获取将上传的文件
      removeUploadFile(file, files) {
        this.formData.attachments = files
      },
      freshEvent() {
        this.$refs.form && this.$refs.form.resetFields()
      },
      submitEvent() {
        this.$refs.form.validate((validity) => {
          if (!validity) return
          this.isModify ? this.updateMethod() : this.applyMethod()
        })
      },
      // 若过期时间小于获取时间 将过期时间清空
      changeGetDateEvent(getTime) {
        if (this.formData.expireTime && this.formData.expireTime <= getTime) {
          this.formData.expireTime = ''
        }
      },
      // 验证文件列表
      validateFiles(rule, value, cb) {
        if (value.length < 1) {
          cb(new Error(this.$t('holder.pleaseSelectUploadFile')))
        } else {
          cb()
        }
      },
      // 申请请求
      async applyMethod() {
        this.loading = true
        const { builtinRole, lifeLong } = this.$attrs
        // 永久有效 获取日期+9999
        if (lifeLong) {
          this.formData.expireTime = moment(this.formData.getTime).add(9999, 'days')
        }
        const params = {
          ...this.formData,
          qualificationTypeId: this.id,
          userId: this.userInfo.userId,
          builtinRole,
        }
        const uploadData = new FormData()
        uploadData.append('file', this.formData.attachments[0].raw)
        const [e, r] = await to(uploadFile(uploadData))
        if (!e && r.status == 200) {
          params.attachments = [r.data.uuid]
        }
        const [err, res] = await to(postQualifications(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.subSuccessTip'))
          this.visible = false
          this.$emit('complate')
        }
      },
      // 更新请求
      async updateMethod() {
        this.loading = true
        const { builtinRole, originId, lifeLong } = this.$attrs
        if (lifeLong) {
          this.formData.expireTime = moment(this.formData.getTime).add(9999, 'days')
        }
        const params = {
          ...this.formData,
          qualificationTypeId: this.id,
          userId: this.userInfo.userId,
          originId,
          builtinRole,
        }
        const uploadData = new FormData()
        uploadData.append('file', this.formData.attachments[0].raw)
        const [e, r] = await to(uploadFile(uploadData))
        if (!e && r.status == 200) {
          params.attachments = [r.data.uuid]
        }
        const [err, res] = await to(postQualifications(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.updateSucceeded'))
          this.visible = false
          this.$emit('complate')
        }
      },
    },
  }
</script>
