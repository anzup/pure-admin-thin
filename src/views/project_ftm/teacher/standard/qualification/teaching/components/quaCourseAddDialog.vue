<template>
  <el-dialog
    :title="title"
    v-model="visible"
    :close-on-click-modal="false"
    v-loading="loading"
    width="600px"
    modal
    center
    @closed="freshEvent"
  >
    <el-form ref="form" label-width="120px" :model="formData" :rules="formRules">
      <!-- 所属课程 -->
      <el-form-item :label="$t('table.itsCouse')" prop="courseId">
        <el-select
          class="full-width"
          :placeholder="$t('holder.pleaseSelectCourseNumber')"
          v-model="formData.courseId"
          :disabled="isUpdate || isModify"
          @change="changeCourseEvent"
        >
          <el-option
            v-for="item in formFilter.course"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 机型 -->
      <el-form-item :label="$t('table.modelNumber')" prop="airplaneType">
        <el-select
          class="full-width"
          :placeholder="$t('holder.pleaseSelectAriModel')"
          :disabled="isUpdate || isModify"
          v-model="formData.airplaneType"
        >
          <el-option
            v-for="item in airplanList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 资质类型 -->
      <el-form-item :label="$t('table.qualificationType')" prop="classifyType">
        <el-select
          class="full-width"
          :placeholder="$t('holder.pleaseSelectQualificationType')"
          :disabled="isUpdate || isModify"
          v-model="formData.classifyType"
        >
          <el-option
            v-for="item in formFilter.type"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 资质内容 -->
      <el-form-item :label="$t('table.qualificationContent')" prop="content">
        <el-input
          class="full-width"
          :placeholder="$t('holder.pleaseContent')"
          v-model="formData.content"
        ></el-input>
      </el-form-item>
      <!-- 版本号 -->
      <el-form-item :label="$t('table.versionNumber')" prop="version">
        <el-input
          class="full-width"
          :placeholder="$t('holder.pleaseEnterVersion')"
          v-model="formData.version"
        ></el-input>
      </el-form-item>
      <!-- 批准日期 -->
      <el-form-item :label="$t('table.approvalDate')" prop="checkDate">
        <el-date-picker class="full-width" v-model="formData.checkDate"></el-date-picker>
      </el-form-item>
      <!-- 批准人 -->
      <el-form-item :label="$t('table.approvalPerson')" prop="checkName">
        <el-input class="full-width" v-model="formData.checkName"></el-input>
      </el-form-item>
      <!-- 资质文件 -->
      <el-form-item
        :label="$t('table.qualificationFile')"
        prop="attachments"
        v-if="formData.classifyType == 'FILE'"
      >
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
    getCourseQualificationDetail,
    postCourseQualification,
    putCourseQualification,
  } from '/@/api/ftm/teacher/qualification'
  import { getCourses } from '/@/api/ftm/teacher/trainingPlan'
  import { uploadFile } from '/@/api/ftm/teacher/education'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        loading: false,
        formData: {
          courseId: '',
          airplaneType: '',
          classifyType: '',
          content: '',
          version: '',
          checkDate: '',
          checkName: '',
          attachments: [],
        },
        formRules: {
          airplaneType: [{ required: true, message: this.$t('holder.pleaseSelectAriModel') }],
          classifyType: [
            { required: true, message: this.$t('holder.pleaseSelectQualificationType') },
          ],
          content: [{ required: true, message: this.$t('holder.pleaseContent') }],
          courseId: [{ required: true, message: this.$t('holder.pleaseSelectCourseNumber') }],
          version: [{ required: true, message: this.$t('holder.pleaseEnterVersion') }],
        },
        formFilter: {
          course: [],
          type: [
            { id: 'FILE', name: this.$t('table.qualificationFile') }, // 文件资质
            { id: 'COURSEWARE', name: this.$t('table.courseware') }, // 课件
            { id: 'QUESTIONS', name: this.$t('table.question') }, // 试题
          ],
        },
      }
    },
    props: {
      id: [String, Number],
      show: Boolean,
      isModify: Boolean,
      isUpdate: Boolean,
    },
    computed: {
      title() {
        return this.isModify
          ? this.isUpdate
            ? this.$t('button.upData')
            : this.$t('button.modify')
          : this.$t('button.add')
      },
      visible: {
        get() {
          return !!this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
      airplanList() {
        return (
          (this.formFilter.course.find((item) => this.formData.courseId == item.id) || {})
            .airplaneTypes || []
        )
      },
    },
    watch: {
      visible: {
        immediate: true,
        async handler(bool) {
          if (bool && this.isModify && !this.isUpdate) {
            this.loading = true
            const [err, res] = await to(getCourseQualificationDetail({ id: this.id }))
            this.loading = false
            if (!err && res.status == 200) {
              this.formData.courseId = res.data.course ? res.data.course.id : ''
              this.formData.airplaneType = res.data.airplaneType
              this.formData.classifyType = res.data.classifyType
              this.formData.content = res.data.content
              this.formData.version = res.data.version
              this.formData.checkDate = res.data.checkDate
              this.formData.checkName = res.data.checkName
              this.formData.attachments = res.data.fileVOS.map((item) => ({
                name: item.name + item.suffix,
                size: item.size,
                uid: item.uuid,
                uuid: item.uuid,
                origin: true,
              }))
            }
          } else if (bool && this.isUpdate) {
            const { course, airplaneType, classifyType, content } = this.$attrs
            this.formData.courseId = course ? course.id : ''
            this.formData.airplaneType = airplaneType
            this.formData.classifyType = classifyType
            this.formData.content = content
          }
        },
      },
    },
    created() {
      this.getCourseAll()
    },
    methods: {
      // 获取课程下拉列表
      async getCourseAll() {
        const [err, res] = await to(getCourses({ page: 1, size: 1000 }))
        if (!err && res.status == 200) {
          this.formFilter.course = res.data.content
        }
      },
      freshEvent() {
        this.$refs.form.resetFields()
      },
      // 选择课程（清空机型）
      changeCourseEvent() {
        this.formData.airplaneType = ''
      },
      addUploadFile(file, files) {
        const fileRE = /((pdf)|(jpg)|(png)|(jpeg)|(gif))+?/i
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
          if (this.isModify && this.isUpdate) {
            this.updateSubmit()
          } else if (this.isModify) {
            this.modifySubmit()
          } else {
            this.addSubmit()
          }
        })
      },
      // 新增请求
      async addSubmit() {
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
        const [err, res] = await to(postCourseQualification(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.addsuccessTip'))
          this.visible = false
          this.$emit('complate')
        }
      },
      // 修改请求
      async modifySubmit() {
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
          id: this.id,
          ...this.$filterObject(this.formData, ['checkDate', 'checkName', 'content', 'version']),
          attachments,
        }
        let [err, res] = await to(putCourseQualification(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.modifySuccessTop'))
          this.visible = false
          this.$emit('complate')
        }
      },
      // 更新请求
      async updateSubmit() {
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
          originId: this.$attrs.originId,
          attachments: resFiles.map((v) => v.data.uuid),
        }
        let [err, res] = await to(postCourseQualification(params))
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
