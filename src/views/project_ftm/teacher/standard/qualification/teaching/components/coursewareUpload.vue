<template>
  <el-scrollbar class="section">
    <header>
      <!--TODO 重构返回按钮样式-->
      <span @click="backEvent"> 返回 </span>
    </header>
    <el-form ref="form" label-suffix=":" :model="form" :rules="rules" label-width="200px">
      <!-- 课件名称 -->
      <el-form-item :label="$t('table.coursewareName')" prop="name" v-if="viewFlag">
        <el-input v-model="form.name" />
      </el-form-item>
      <!-- 课件类型 -->
      <el-form-item :label="$t('table.coursewareType')" v-if="viewFlag">
        <span class="fileType">{{ fileType }}</span>
      </el-form-item>
      <!-- 内容 -->
      <el-form-item :label="$t('table.content')" prop="name">
        <el-button @click="selectFileEvent" type="primary" size="medium">{{
          $t('button.select')
        }}</el-button>
        <div class="el-upload__tip">{{ $t('holder.fileFormat') }}</div>
        <div class="fileBox">
          <div class="fileInfo" v-for="(item, index) in fileList" :key="index">
            <el-input v-model="item.coursewareName" />
            <span class="name">{{ item.name }}</span>
            <i class="el-icon-delete" @click="deleteFileEvent(index)" />
          </div>
        </div>
      </el-form-item>
      <!-- 机型 -->
      <el-form-item :label="$t('table.modelNumber')" prop="airplaneTypes">
        {{ airplan }}
      </el-form-item>
      <!-- 系统 -->
      <el-form-item :label="$t('table.system')" prop="systemTypes">
        <el-select
          v-model="form.systemTypes"
          :placeholder="$t('holder.pleaseSelect')"
          multiple
          style="width: 100%"
        >
          <el-option
            :label="item.keyTranslation"
            :value="item.key"
            v-for="item in formFilter.system"
            :key="item.index"
          />
        </el-select>
      </el-form-item>
      <!-- 所属课程 -->
      <el-form-item :label="$t('table.itsCouse')">
        <el-select
          class="full-width"
          v-model="form.courseId"
          :placeholder="$t('holder.pleaseSelect')"
          multiple
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in formFilter.course"
            :key="item.index"
          />
        </el-select>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item :label="$t('table.remarks')" prop="remark">
        <el-input
          type="textarea"
          :autosize="{ minRows: 3 }"
          :placeholder="$t('holder.pleaseEnter')"
          v-model="form.remark"
        />
      </el-form-item>
      <!-- 属性 -->
      <el-form-item :label="$t('table.attribute')" prop="propertyIds">
        <div v-for="(item, index) in formFilter.attr" :key="index" class="propertyContainer">
          <span class="form-content-tit">{{ item.name }}</span>
          <el-checkbox-group v-model="form.propertyIds">
            <el-checkbox v-for="cItem in item.children" :key="cItem.id" :label="cItem.id">{{
              cItem.name
            }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
    <footer>
      <el-button size="medium" type="primary" @click="backEvent">{{
        $t('button.cancel')
      }}</el-button>
      <el-button size="medium" type="primary" @click="saveEvent">{{ $t('button.save') }}</el-button>
    </footer>

    <!-- 上传进度条 -->
    <el-dialog
      center
      :modal="false"
      :title="$t('button.uploadProgressBar')"
      v-model="progressDialogVisible"
      :before-close="cancelUploadEvent"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="35%"
    >
      <span class="dialogBox">
        <div v-for="(item, index) in progressList" :key="index" class="progress">
          <div style="width: 30%">{{ item.coursewareName }}:</div>
          <div style="width: 70%">
            <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="item.progress ? Number((item.progress * 100).toFixed(0)) : 0"
            />
          </div>
        </div>
      </span>
    </el-dialog>
  </el-scrollbar>
</template>

<script>
  import axios from 'axios'
  import {
    getCoursewareProperties,
    getCoursewaresSystemTypes,
    getCoursewaresId,
  } from '/@/api/ftm/teacher/courseware'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import to from 'await-to-js'
  // import { getLanguage } from '@/utils/i18n'
  export default {
    data() {
      return {
        form: {
          name: '',
          propertyIds: [],
          remark: '',
          courseId: [],
          airplaneTypes: [],
          systemTypes: [],
          type: 'PUBLIC',
        },
        formFilter: {
          airplan: [],
          system: [],
          attr: [],
          course: [],
        },
        rules: {
          name: { required: true, validator: this.validateName, trigger: 'blur' },
          systemTypes: {
            required: true,
            message: `${this.$t('holder.pleaseSelect')}${this.$t('table.system')}`,
            trigger: 'blur',
          },
        },
        source: {},
        fileType: '',
        fileList: [],
        fileFormat: ['pdf', 'mp4', 'docx', 'xlsx', 'pptx', 'wmv', 'zip', 'doc', 'ppt', 'xls'],
        progressDialogVisible: false,
        progressList: [],
      }
    },
    props: {
      id: [String, Number],
      airplan: String,
      courseId: [String, Number],
    },
    computed: {
      // 是否为编辑状态
      viewFlag() {
        if (this.id && this.fileList.length == 0) {
          return true
        } else {
          return false
        }
      },
    },
    watch: {
      progressList: {
        deep: true,
        handler(newArr) {
          let arr = JSON.parse(JSON.stringify(newArr))
          var finish = arr.every((v) => v.over)
          if (finish && arr.every((v) => !v.errMsg)) {
            this.$message.success(this.$t('tip.uploadSuccessTip'))
            this.$emit('changePage', { type: 'home' })
          } else if (finish) {
            this.$message.error(
              arr
                .filter((v) => v.errMsg)
                .map((v) => v.errMsg)
                .join('，  '),
            )
            this.progressDialogVisible = false
          }
        },
      },
    },
    async created() {
      this.form.airplaneTypes = this.airplan
      await this.getCoursewareProperties()
      await this.getCoursewaresSystemTypes()
      await this.getCourse()
      if (this.id) {
        this.getCoursewaresId()
      }
    },
    methods: {
      // 获取课件信息
      async getCoursewaresId() {
        const [err, res] = await to(getCoursewaresId({ id: this.id }))
        if (!err && res.status == 200) {
          this.form.airplaneTypes = res.data.airplaneTypes
          this.form.systemTypes = res.data.systemTypes
          this.form.propertyIds = res.data.properties.map((v) => v.id)
          this.form.remark = res.data.remark
          this.form.name = res.data.name
          this.fileType = (res.data.fileType || '').toLocaleUpperCase()
          this.form.courseId =
            res.data.courses instanceof Array ? res.data.courses.map((v) => v.id) : []
        }
      },
      // 获取属性列表
      async getCoursewareProperties() {
        const params = {
          page: 1,
          size: 10000,
          level: 0,
        }
        const [err, res] = await to(getCoursewareProperties(params))
        if (!err && es.status == 200) {
          this.formFilter.attr = res.data.content
        }
      },
      // 获取系统下拉列表
      async getCoursewaresSystemTypes() {
        const [err, res] = await to(getCoursewaresSystemTypes())
        if (!err && res.status == 200) {
          this.formFilter.system = res.data
        }
      },
      // 获取课程下拉列表
      async getCourse() {
        const [err, res] = await to(getCoursesAll())
        if (!err && res.status == 200) {
          this.formFilter.course = res.data
          this.form.courseId = [this.courseId]
        }
      },
      // 返回列表
      backEvent() {
        this.$emit('changePage', { type: 'home' })
      },
      // 选择文件
      async selectFileEvent() {
        try {
          // 使用 cancel token 取消请求
          this.source = axios.CancelToken.source()
          let { files } = await this.$XReadFile({ multiple: true })
          for (let [key, file] of Object.entries(files)) {
            let format = file.name.includes('.') ? file.name.split('.')[1] : ''
            // TODO 静态属性 如果直接set 没有getter setter
            format = format.toLocaleLowerCase()
            if (this.fileFormat.includes(format)) {
              this.fileList.push({
                file,
                coursewareName: file.name.split('.')[0],
              })
            } else {
              this.$message.warning(this.$t('tip.theFormatDoesNotMeetTheRequirements'))
              return false
            }
          }
        } catch (e) {}
      },
      // 删除文件
      deleteFileEvent(index) {
        this.fileList.splice(index, 1)
      },
      // 取消上传
      cancelUploadEvent() {
        if (this.source) {
          this.source.token
          this.progressDialogVisible = false
        } else {
          this.progressDialogVisible = false
        }
      },
      // 保存课件
      saveEvent() {
        this.$refs.form.validate((valid) => {
          if (!valid) return
          if (this.viewFlag) {
            this.postCoursewaresId()
          } else {
            this.postAddCourseware()
          }
        })
      },
      // 修改课件请求
      postCoursewaresId() {
        const url = `${process.env.VUE_APP_BASE_API}/coursewares/${this.id}`
        const formData = new FormData()
        formData.append('remark', this.form.remark)
        formData.append('airplaneTypes', this.form.airplaneTypes.toString())
        formData.append('systemTypes', this.form.systemTypes.toString())
        formData.append('propertyIds', this.form.propertyIds.toString())
        formData.append('type', this.form.type)
        formData.append('name', this.form.name)
        formData.append(
          'courseIds',
          this.form.courseId instanceof Array ? this.form.courseId.join(',') : this.form.courseId,
        )
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            // TODO 传递语言环境
            // 'Accept-Language': getLanguage()
          },
        }
        axios.defaults.headers['Authorization'] =
          'Bearer ' + window.sessionStorage.getItem('access_token')
        // TODO 传递语言环境
        // axios.defaults.headers['Accept-Language'] = getLanguage()
        const vm = this
        axios
          .post(url, formData, config)
          .then(function (res) {
            if (res.status == 200) {
              vm.$message.success(vm.$t('tip.editSuccessTip'))
              vm.$emit('changePage', { type: 'home' })
            }
          })
          .catch(function (err) {
            if (err.response.data && err.response.data.msg) {
              vm.$message.error(err.response.data.msg)
            }
          })
      },
      // 添加课件请求
      async postAddCourseware() {
        const url = this.id
          ? `${process.env.VUE_APP_BASE_API}/coursewares/${this.id}`
          : `${process.env.VUE_APP_BASE_API}/coursewares`
        const pub_upload_url = import.meta.env.VITE_BASE_API_PUB + '/files/upload'

        // 非zip格式的文件通过pub上传
        const formData = new FormData()
        formData.append('remark', this.form.remark)
        formData.append('airplaneTypes', this.form.airplaneTypes.toString())
        formData.append('systemTypes', this.form.systemTypes.toString())
        formData.append('propertyIds', this.form.propertyIds.toString())
        formData.append('type', this.form.type)
        formData.append(
          'courseIds',
          this.form.courseId instanceof Array ? this.form.courseId.join(',') : this.form.courseId,
        )

        var vm = this
        var myArr = this.fileList
        this.progressDialogVisible = true
        this.progressList = myArr.map((v, i) => ({
          coursewareName: this.fileList[i]['coursewareName'],
          progress: 0,
        }))
        // //循环文件数组挨个上传
        for (let [index, ele] of myArr.entries()) {
          let progress = this.progressList[index]
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              // TODO 传递语言环境
              // 'Accept-Language': getLanguage()
            },
            cancelToken: this.source.token,
            onUploadProgress: function (e) {
              if (e.lengthComputable) {
                var rate = e.loaded / e.total //已上传的比例
                if (rate < 1) {
                  progress.progress = rate
                } else {
                  progress.progress = 0.99
                }
              }
            },
          }
          axios.defaults.headers['Authorization'] =
            'Bearer ' + window.sessionStorage.getItem('access_token')
          // TODO 传递语言环境
          // axios.defaults.headers['Accept-Language'] = getLanguage()
          let extension = myArr[index].file.name.split('.').pop()
          var _formData = new FormData()
          var data = myArr[index].file
          var data1 = vm.fileList[index]
          for (var [a, b] of formData.entries()) {
            _formData.append(a, b)
          }
          _formData.append('name', data1.coursewareName)
          let _failFormData = new FormData()
          _failFormData.append('file', data)
          if (extension.toLocaleLowerCase() == 'zip') {
            _failFormData.append('unzip', true)
          }
          let [ferr, fres] = await to(axios.post(pub_upload_url, _failFormData, config))
          if (ferr) {
            if (ferr.response.data && ferr.response.data.msg) {
              vm.$set(this.progressList[index], 'errMsg', ferr.response.data.msg)
            }
            break
          }
          _formData.append('fileUuid', fres.data.uuid)
          let [err, res] = await to(axios.post(url, _formData, config))
          vm.$set(this.progressList[index], 'over', true)
          if (err) {
            vm.$set(vm.progressList[index], 'errMsg', err.response.data.msg)
          } else if (res.status == 200) {
            vm.$set(vm.progressList[index], 'progress', 1)
          }
        }
      },
      // 表单验证
      validateName(rule, value, callback) {
        if (this.id) {
          value == '' ? callback(new Error(this.$t('holder.pleaseEnterContentName'))) : callback()
        } else {
          const flag = this.fileList.filter((v) => !v.coursewareName.trim())
          if (this.fileList.length == 0) {
            callback(new Error(this.$t('tip.pleaseSelectFileImport')))
          } else if (flag.length != 0) {
            callback(new Error(this.$t('holder.pleaseEnterContentName')))
          } else {
            callback()
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .section {
    position: relative;
    padding-top: 40px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }
  }
  header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    .el-button {
      margin-left: auto;
      margin-right: 0;
    }
  }
  footer {
    margin-top: 16px;
    text-align: center;
  }
  .ruleForm {
    padding-top: 40px;
    :deep(.el-form-item__label) {
      text-align: right;
    }
    .form-content-tit {
      display: block;
      margin-top: 20px;
    }
  }
  .fileBox {
    .fileInfo {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .name {
        display: inline-block;
        width: 300px;
        margin: 0 40px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .el-icon-delete {
        color: red;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .progress {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .iconSrc {
    height: 45px;
    vertical-align: middle;
    cursor: pointer;
    margin-left: 20px;
  }
  .fileType {
    color: #17a5fc;
  }
</style>
