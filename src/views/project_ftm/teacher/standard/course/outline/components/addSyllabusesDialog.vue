<template>
  <el-dialog
    width="400px"
    v-model="isShow"
    :title="title"
    :before-close="cancel"
    :close-on-click-modal="false"
    center
    @closed="refeshForm"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('table.codeOfTrainingCourses')" prop="courseId">
        <el-select
          v-model="ruleForm.courseId"
          :placeholder="$t('holder.pleaseSelect')"
          style="width: 100%"
          @change="courseIdChange"
        >
          <el-option
            :label="item.code"
            :value="item.id"
            v-for="item in coursesAll"
            :key="item.index"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.versionNumber')" prop="version">
        <el-input v-model="ruleForm.version" :placeholder="$t('holder.pleaseEnter')" />
      </el-form-item>
      <el-form-item :label="$t('table.outlineName')">
        <el-input v-model="ruleForm.shortName" />
      </el-form-item>
      <el-form-item :label="$t('table.modelNumber')" prop="airplaneType">
        <!-- <el-input v-model="ruleForm.courseAirType" disabled></el-input> -->
        <el-select v-model="ruleForm.airplaneType">
          <el-option
            v-for="(item, index) in courseAirList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getCourses } from '/@/api/ftm/teacher/trainingPlan'
  import { postSyllabuses, getSyllabusesId, putSyllabusesId } from '/@/api/ftm/teacher/teachingPlan'
  export default {
    props: {
      syllabusesDialog: Boolean,
      syllabusesId: [Number, String],
      title: String,
    },
    data() {
      return {
        isShow: false,
        coursesAll: [],
        courseAirList: [],
        ruleForm: {
          version: '',
          courseId: undefined,
          shortName: '',
          airplaneType: '',
        },
        rules: {
          version: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.versionNumber')}`,
              trigger: 'blur',
            },
          ],
          courseId: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.courseCode')}`,
              trigger: 'blur',
            },
          ],
          airplaneType: [
            {
              required: true,
              validator: (rule, value, cb) => {
                if (!value || value == '') {
                  return cb(new Error(this.$t('holder.pleaseSelectAriModel')))
                } else {
                  return cb()
                }
              },
            },
          ],
        },
      }
    },
    created() {
      this.isShow = this.syllabusesDialog
    },
    watch: {
      syllabusesDialog(val) {
        this.isShow = val
        if (val) {
          this.getCourses()
          if (this.syllabusesId) {
            this.getSyllabusesId()
          }
        }
      },
    },
    methods: {
      getCourses() {
        getCourses({
          page: 1,
          size: 1000,
        }).then((res) => {
          if (res.status == 200) {
            this.coursesAll = res.data.content
          }
        })
      },
      getSyllabusesId() {
        getSyllabusesId({ id: this.syllabusesId }).then((res) => {
          if (res.status == 200) {
            this.ruleForm.version = res.data.version
            this.ruleForm.courseId = res.data.course.id
            this.ruleForm.shortName = res.data.shortName
            this.ruleForm.airplaneType = res.data.airplaneType
            this.courseAirList = res.data.course.airplaneTypes
          }
        })
      },
      courseIdChange() {
        const data = this.coursesAll.find((v) => v.id == this.ruleForm.courseId)
        this.courseAirList = data.airplaneTypes
        this.ruleForm.shortName = data.name
        this.ruleForm.version = ''
        this.ruleForm.airplaneType = ''
      },
      cancel() {
        this.isShow = false
      },
      refeshForm() {
        this.$refs['ruleForm'].resetFields()
        this.ruleForm = {
          version: '',
          courseId: undefined,
          shortName: '',
          airplaneType: '',
        }
        this.$emit('cancelDialog')
      },
      handleSave() {
        let promies = null
        if (this.syllabusesId) {
          promies = putSyllabusesId
          this.ruleForm.id = this.syllabusesId
        } else {
          promies = postSyllabuses
        }
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            promies(this.ruleForm).then((res) => {
              if (res.status == 200) {
                this.$message.success(
                  this.syllabusesId ? this.$t('tip.editSuccessTip') : this.$t('tip.addsuccessTip'),
                )
                this.$emit('getData')
                this.cancel()
              }
            })
          }
        })
      },
    },
  }
</script>
