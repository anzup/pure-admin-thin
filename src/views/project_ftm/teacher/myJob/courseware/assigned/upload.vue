<template>
  <div class="fromContinerCom">
    <el-col :xl="14" :lg="16" :md="18" :sm="24" :xs="24">
      <el-form
        ref="ruleForm"
        class="ruleForm"
        label-width="160px"
        label-suffix=":"
        :model="ruleForm"
        :rules="rules"
      >
        <!-- 课件名称 -->
        <el-form-item :label="$t('table.coursewareName')" prop="name" v-if="viewFlag">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <!-- 课件类型 -->
        <el-form-item :label="$t('table.coursewareType')" v-if="viewFlag">
          <span class="fileType">{{ fileType }}</span>
          <!-- <img :src="iconSrc" class="iconSrc"/> -->
        </el-form-item>
        <!-- 内容 -->
        <el-form-item :label="$t('table.content')" prop="name">
          <el-button @click="clickEvent" type="primary">{{ $t('button.select') }}</el-button>
          <div class="el-upload__tip">{{ $t('holder.fileFormat') }}</div>
          <div class="fileBox">
            <div class="fileInfo" v-for="(item, index) in fileList1" :key="index">
              <el-input v-model="item.coursewareName" />
              <span class="name">{{ item.name }}</span>
              <i class="el-icon-delete" @click="deleteFile(index)" />
            </div>
          </div>
        </el-form-item>
        <!-- 机型 -->
        <el-form-item :label="$t('table.modelNumber')" prop="airplaneTypes">
          <el-select
            v-model="ruleForm.airplaneTypes"
            :placeholder="$t('holder.pleaseSelect')"
            multiple
            style="width: 100%"
          >
            <el-option
              :label="item.keyTranslation"
              :value="item.key"
              v-for="item in airplaneTypesAll"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <!-- 系统 -->
        <el-form-item :label="$t('table.system')" prop="systemTypes">
          <el-select
            v-model="ruleForm.systemTypes"
            :placeholder="$t('holder.pleaseSelect')"
            multiple
            style="width: 100%"
          >
            <el-option
              :label="item.keyTranslation"
              :value="item.key"
              v-for="item in systemTypeList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <!-- 所属课程 -->
        <el-form-item :label="$t('table.itsCouse')" prop="courseId">
          <el-select
            class="full-width"
            v-model="ruleForm.courseId"
            :placeholder="$t('holder.pleaseSelect')"
            multiple
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in courseList"
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
            v-model="ruleForm.remark"
          />
        </el-form-item>
        <!-- 属性 -->
        <el-form-item :label="$t('table.attribute')" prop="propertyIds">
          <div v-for="(item, index) in propertyList" :key="index" class="propertyContainer">
            <!-- <el-checkbox
              v-model="checkedAll[index]"
              @change="handleCheckAllChange(index, checkedAll[index])"
            ><span style="font-weight: bold;">{{item.name}}</span></el-checkbox> -->
            <span class="form-content-tit">{{ item.name }}</span>
            <el-checkbox-group v-model="ruleForm.propertyIds">
              <el-checkbox v-for="cItem in item.children" :key="cItem.id" :label="cItem.id">{{
                cItem.name
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
    </el-col>

    <div class="footerBtn">
      <el-button @click="handleCancel" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" class="rightBtn" @click="modifySave">{{
        $t('button.save')
      }}</el-button>
    </div>

    <el-dialog
      :title="$t('button.uploadProgressBar')"
      v-model:visible="progressDialogVisible"
      :before-close="dialogCancel"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      center
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
  </div>
</template>

<script>
  import axios from 'axios'
  import {
    getCoursewareProperties,
    getCoursewaresAirplaneTypes,
    getCoursewaresSystemTypes,
    getCoursewaresId,
  } from '/@/api/ftm/teacher/courseware'
  import video_PNG from '/@/assets/ftm/VIDEO.png'
  import pdf_PNG from '/@/assets/ftm/PDF.png'
  import word_PNG from '/@/assets/ftm/WORD.png'
  import excel_PNG from '/@/assets/ftm/EXCEL.png'
  import ppt_PNG from '/@/assets/ftm/PPT.png'
  import scorm_PNG from '/@/assets/ftm/ZIP.png'
  import file_PNG from '/@/assets/ftm/FILE.png'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import to from 'await-to-js'
  export default {
    data() {
      const validateName = (rule, value, callback) => {
        if (this.id) {
          if (value === '') {
            callback(new Error(this.$t('holder.pleaseEnterContentName')))
          } else {
            callback()
          }
        } else {
          if (this.fileList1.length == 0) {
            callback(new Error(this.$t('tip.pleaseSelectFileImport')))
          } else {
            const flag = this.fileList1.filter((v) => !v.coursewareName.trim())
            if (flag.length !== 0) {
              callback(new Error(this.$t('holder.pleaseEnterContentName')))
            } else {
              callback()
            }
          }
        }
      }
      return {
        ruleForm: {
          name: '',
          courseId: [],
          propertyIds: [],
          remark: '',
          airplaneTypes: [],
          systemTypes: [],
          type: '',
        },
        airplaneTypesAll: [],
        systemTypeList: [],
        courseList: [],
        propertyList: [],
        checkedAll: [],
        checkedList: [],
        fileList: [],
        fileList1: [],
        progressList: [],
        formData: null,
        fileFormat: [
          'pdf',
          'mp4',
          'docx',
          'xlsx',
          'pptx',
          'wmv',
          'mov',
          'zip',
          'doc',
          'ppt',
          'xls',
        ],
        progressDialogVisible: false,
        finish: false,
        id: undefined,
        fileType: undefined,
        officeUrl: '',
        iconSrc: '',
        rules: {
          name: { required: true, validator: validateName, trigger: 'blur' },
          // { required: true, message: `${this.$t('holder.pleaseEnter')}${this.$t('table.coursewareName')}`, trigger: 'blur' },
          airplaneTypes: {
            required: true,
            message: `${this.$t('holder.pleaseSelect')}${this.$t('table.modelNumber')}`,
            trigger: 'blur',
          },
          systemTypes: {
            required: true,
            message: `${this.$t('holder.pleaseSelect')}${this.$t('table.system')}`,
            trigger: 'blur',
          },
        },
      }
    },
    async created() {
      this.ruleForm.type = this.$route.query.type
      this.id = this.$route.query.id
      await this.getCoursewareProperties()
      await this.getCoursewaresAirplaneTypes()
      await this.getCoursewaresSystemTypes()
      await this.getCourse()
      if (this.id) {
        this.getCoursewaresId()
      }
    },
    computed: {
      viewFlag() {
        if (this.id && this.fileList.length == 0) {
          return true
        } else {
          return false
        }
      },
    },
    watch: {
      //监听文件列表数组，当全部完成时给出提示并跳转页面
      progressList: {
        handler(newArr) {
          let arr = JSON.parse(JSON.stringify(newArr))
          var finish = arr.every((v) => v.over)
          if (finish && arr.every((v) => !v.errMsg)) {
            this.$message.success(this.$t('tip.uploadSuccessTip'))
            this.$router.go(-1)
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
        deep: true,
      },
    },
    methods: {
      dialogCancel() {
        if (this.source) {
          this.source.token
          this.progressDialogVisible = false
        } else {
          this.progressDialogVisible = false
        }
      },
      handleCancel() {
        this.$router.go(-1)
      },
      modifySave() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.viewFlag) {
              this.postCoursewaresId()
            } else {
              this.handleSave()
            }
          }
        })
      },
      // 课程列表
      async getCourse() {
        const [err, res] = await to(getCoursesAll())
        if (!err && res.status == 200) {
          this.courseList = res.data
        }
      },
      async getCoursewaresAirplaneTypes() {
        const [err, res] = await to(getCoursewaresAirplaneTypes())
        if (!err && res.status == 200) {
          this.airplaneTypesAll = res.data
        }
      },
      async getCoursewaresSystemTypes() {
        const [err, res] = await to(getCoursewaresSystemTypes())
        if (!err && res.status == 200) {
          this.systemTypeList = res.data
        }
      },
      async getCoursewareProperties() {
        const data = {
          page: 1,
          size: 10000,
          level: 0,
        }
        const [err, res] = await to(getCoursewareProperties(data))
        if (!err && res.status == 200) {
          this.propertyList = res.data.content
        }
      },
      getCoursewaresId() {
        getCoursewaresId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            this.ruleForm.airplaneTypes = res.data.airplaneTypes
            this.ruleForm.systemTypes = res.data.systemTypes
            this.ruleForm.propertyIds = res.data.properties.map((v) => v.id)
            this.ruleForm.remark = res.data.remark
            this.ruleForm.name = res.data.name
            this.fileType = res.data.fileType || ''
            this.fileType = this.fileType.toLocaleUpperCase()
            if (res.data.courses instanceof Array) {
              this.ruleForm.courseId = res.data.courses.map((v) => v.id)
            }

            if (this.fileType == 'MP4' || this.fileType == 'WMV' || this.fileType == 'MOV') {
              this.iconSrc = video_PNG
            } else if (this.fileType == 'PDF') {
              this.iconSrc = pdf_PNG
            } else if (this.fileType == 'DOC' || this.fileType == 'DOCX') {
              this.iconSrc = word_PNG
            } else if (this.fileType == 'EXCEL' || this.fileType == 'EXCELX') {
              this.iconSrc = excel_PNG
            } else if (this.fileType == 'PPT' || this.fileType == 'PPTX') {
              this.iconSrc = ppt_PNG
            } else if (this.fileType == 'SCORM') {
              this.iconSrc = scorm_PNG
            } else {
              this.iconSrc = file_PNG
            }
          }
        })
      },
      async handleSave() {
        let url = ''
        if (this.id) {
          url = `${import.meta.env.VUE_APP_BASE_API}/coursewares/${this.id}`
        } else {
          url = `${import.meta.env.VUE_APP_BASE_API}/coursewares`
        }
        const pub_upload_url = import.meta.env.VITE_BASE_API_PUB + '/files/upload'

        // 非zip格式的文件通过pub上传
        this.formData = new FormData()
        this.formData.append('remark', this.ruleForm.remark)
        this.formData.append('airplaneTypes', this.ruleForm.airplaneTypes.toString())
        this.formData.append('systemTypes', this.ruleForm.systemTypes.toString())
        this.formData.append('propertyIds', this.ruleForm.propertyIds.toString())
        this.formData.append('type', this.ruleForm.type)
        this.formData.append(
          'courseIds',
          this.ruleForm.courseId instanceof Array
            ? this.ruleForm.courseId.join(',')
            : this.ruleForm.courseId,
        )

        var vm = this
        var myArr = this.fileList
        this.progressDialogVisible = true
        this.progressList = myArr.map((v, i) => ({
          coursewareName: this.fileList1[i]['coursewareName'],
          progress: 0,
        }))
        // //循环文件数组挨个上传

        for (let [index, ele] of myArr.entries()) {
          let progress = this.progressList[index]
          var config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              // TODO: 引用当前语言环境
              // 'Accept-Language': getLanguage(),
            },
            cancelToken: this.source.token,
            onUploadProgress: function (e) {
              //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
              //如果lengthComputable为false，就获取不到e.total和e.loaded
              if (e.lengthComputable) {
                var rate = e.loaded / e.total //已上传的比例
                // console.log(index, e.loaded, e.total, rate);
                if (rate < 1) {
                  //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                  //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                  //等响应回来时，再将进度设为100%
                  progress.progress = rate
                } else {
                  progress.progress = 0.99
                }
              }
            },
          }
          axios.defaults.headers['Authorization'] =
            'Bearer ' + window.sessionStorage.getItem('access_token')
          // TODO 修改当前语言环境
          // axios.defaults.headers['Accept-Language'] = getLanguage()
          let extension = myArr[index].name.split('.').pop()
          var _formData = new FormData()
          var data = myArr[index]
          var data1 = vm.fileList1[index]
          for (var [a, b] of this.formData.entries()) {
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
            if (ferr?.response?.data?.msg) {
              this.progressList[index].errMsg = ferr.response.data.msg
            }
            break
          }
          _formData.append('fileUuid', fres.data.uuid)
          let [err, res] = await to(axios.post(url, _formData, config))
          this.progressList[index].over = true
          if (err) {
            vm.progressList[index].errMsg = err?.response?.data?.msg
          } else {
            vm.progressList[index].progress = 1
          }
        }
      },
      postCoursewaresId() {
        // 修改 不涉及修改内容
        this.formData = new FormData()
        this.formData.append('remark', this.ruleForm.remark)
        this.formData.append('airplaneTypes', this.ruleForm.airplaneTypes.toString())
        this.formData.append('systemTypes', this.ruleForm.systemTypes.toString())
        this.formData.append('propertyIds', this.ruleForm.propertyIds.toString())
        this.formData.append('type', this.ruleForm.type)
        this.formData.append('name', this.ruleForm.name)
        this.formData.append(
          'courseIds',
          this.ruleForm.courseId instanceof Array
            ? this.ruleForm.courseId.join(',')
            : this.ruleForm.courseId,
        )

        let url = `${import.meta.env.VUE_APP_BASE_API}/coursewares/${this.id}`
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            // TODO 修改当前语言环境
            // 'Accept-Language': getLanguage(),
          },
        }
        axios.defaults.headers['Authorization'] =
          'Bearer ' + window.sessionStorage.getItem('access_token')
        // TODO 修改当前语言环境
        // axios.defaults.headers['Accept-Language'] = getLanguage()
        let vm = this
        axios
          .post(url, this.formData, config)
          .then(function (res) {
            if (res.status == 200) {
              vm.$message.success(vm.$t('tip.editSuccessTip'))
              vm.$router.go(-1)
            }
          })
          .catch(function (err) {
            if (err.response.data && err.response.data.msg) {
              vm.$message.error(err.response.data.msg)
            }
          })
      },
      async clickEvent() {
        // 先获取文件
        try {
          // 使用 cancel token 取消请求
          this.source = axios.CancelToken.source()
          let { files } = await this.$XReadFile({ multiple: true })
          for (let [key, file] of Object.entries(files)) {
            let format = file.name.split('.')[file.name.split('.').length - 1]
            let file1 = {
              name: file.name.split('.')[0],
              coursewareName: file.name.split('.')[0],
            }
            format = format.toLocaleLowerCase()
            if (this.fileFormat.includes(format)) {
              this.fileList1.push(file1)
              this.fileList.push(file)
              console.log(this.fileList, 'files')
            } else {
              this.$message.warning(this.$t('tip.theFormatDoesNotMeetTheRequirements'))
              return false
            }
          }
        } catch (e) {}
      },
      deleteFile(index) {
        this.fileList1.splice(index, 1)
        this.fileList.splice(index, 1)
      },
    },
  }
</script>
<style scoped lang="scss">
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
  .propertyContainer {
    // display: flex;
    // flex-wrap: wrap;
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
