<template>
  <el-dialog
    :title="id ? $t('button.modify') : $t('button.add')"
    v-model="dialogVisible"
    :before-close="cancel"
    center
    width="500px"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="150px"
      class="demo-ruleForm"
    >
      <!-- 课程名称 -->
      <el-form-item :label="$t('table.courseName')" prop="name">
        <el-input
          class="full-width"
          v-model="ruleForm.name"
          :placeholder="$t('holder.pleaseEnter')"
        />
      </el-form-item>
      <!-- 课程编号 -->
      <el-form-item :label="$t('table.courseNumber')" prop="code">
        <el-input
          class="full-width"
          v-model="ruleForm.code"
          :placeholder="$t('holder.pleaseEnter')"
        />
      </el-form-item>
      <!-- 训练机型 -->
      <el-form-item :label="$t('table.trainingModel')" prop="airplaneTypes">
        <el-select
          class="full-width"
          v-model="ruleForm.airplaneTypes"
          :placeholder="$t('holder.pleaseSelect')"
          filterable
          multiple
        >
          <el-option
            :label="item"
            :value="item"
            v-for="item in airplaneTypesAll"
            :key="item.index"
          />
        </el-select>
      </el-form-item>
      <!-- 课程分类 -->
      <el-form-item :label="$t('table.courseClassify')" prop="courseClassifyId">
        <el-select
          class="full-width"
          v-model="ruleForm.courseClassifyId"
          :placeholder="$t('holder.pleaseSelect')"
        >
          <el-option
            v-for="item in courseClassifyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave">{{
        $t('button.save')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import {
    getAirplaneTypesAll,
    postCourses,
    putCoursesId,
    getCoursesId,
  } from '/@/api/ftm/teacher/trainingPlan'
  export default {
    props: ['dialogVisible', 'id', 'courseClassifyList'],
    data() {
      return {
        airplaneTypesAll: [],
        ruleForm: {
          name: '',
          code: '',
          airplaneTypes: [],
          courseClassifyId: '',
        },
        rules: {
          name: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.courseName')}`,
              trigger: 'blur',
            },
          ],
          code: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.courseNumber')}`,
              trigger: 'blur',
            },
          ],
          airplaneTypes: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.trainingModel')}`,
              trigger: 'blur',
            },
          ],
          courseClassifyId: [
            {
              required: true,
              message: this.$t('holder.pleaseSelectCourseClassify'),
              trigger: 'blur',
            },
          ],
        },
      }
    },
    created() {
      this.getAirplaneTypesAll()
      if (this.id) {
        this.getCoursesId()
      }
    },
    watch: {
      id(val) {
        this.getCoursesId()
      },
    },
    methods: {
      getAirplaneTypesAll() {
        getAirplaneTypesAll().then((res) => {
          if (res.status == 200) {
            this.airplaneTypesAll = res.data
          }
        })
      },
      cancel() {
        this.$refs['ruleForm'].resetFields()
        this.$emit('cancel')
      },
      getCoursesId() {
        getCoursesId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            this.ruleForm.name = res.data.name
            this.ruleForm.code = res.data.code
            this.ruleForm.airplaneTypes = res.data.airplaneTypes
            if (
              typeof res.data.courseClassify == 'object' &&
              res.data.courseClassify != null &&
              res.data.courseClassify != undefined
            ) {
              this.ruleForm.courseClassifyId = res.data.courseClassify.id
            }
          }
        })
      },
      handleSave() {
        let promies = null
        if (this.id) {
          promies = putCoursesId
          this.ruleForm.id = this.id
        } else {
          promies = postCourses
        }
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            promies(this.ruleForm).then((res) => {
              if (res.status == 200) {
                this.cancel()
                this.$emit('getData')
                this.$message.success(
                  this.id ? this.$t('tip.editSuccessTip') : this.$t('tip.addsuccessTip'),
                )
              }
            })
          }
        })
      },
    },
  }
</script>
