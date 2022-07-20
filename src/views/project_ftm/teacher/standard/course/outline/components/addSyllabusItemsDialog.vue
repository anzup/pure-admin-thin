<template>
  <el-dialog
    :title="$t('button.add')"
    v-model="syllabusItemsDialog"
    :before-close="cancel"
    center
    width="25%"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('table.courseTaskName')" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="$t('holder.pleaseEnter')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.courseType')" prop="type">
        <el-select
          v-model="ruleForm.type"
          :placeholder="$t('holder.pleaseSelect')"
          style="width: 100%"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in typeList"
            :key="item.index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.classHours')">
        <el-input v-model="ruleForm.period" :placeholder="$t('holder.pleaseEnter')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.testOrNot')">
        <el-select v-model="ruleForm.exam" style="width: 100%">
          <el-option :label="$t('common.yes')" :value="true"></el-option>
          <el-option :label="$t('common.no')" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.commentOnline')">
        <el-select v-model="ruleForm.online" style="width: 100%">
          <el-option :label="$t('common.yes')" :value="true"></el-option>
          <el-option :label="$t('common.no')" :value="false"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <tempalte #footer>
      <el-button @click="cancel" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave">{{
        $t('button.confirm')
      }}</el-button>
    </tempalte>
  </el-dialog>
</template>

<script>
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import {
    getSyllabusItemsId,
    postSyllabusItems,
    putSyllabusItemsId,
  } from '/@/api/ftm/teacher/teachingPlan'
  export default {
    props: ['syllabusItemsDialog', 'syllabusItemsId', 'syllabusId'],
    data() {
      return {
        isShow: false,
        ruleForm: {
          name: '',
          type: '',
          period: undefined,
          exam: true,
          online: true,
          syllabusId: undefined,
        },
        typeList: [
          { id: 'FLIGHT_PRACTICE', name: this.$t('status.flightPractice') },
          { id: 'GROUND_THEORY', name: this.$t('status.groundTheory') },
        ],
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
        },
      }
    },
    created() {},
    watch: {
      syllabusItemsDialog(val) {
        this.ruleForm.syllabusId = this.syllabusId
        if (val) {
          this.getCoursesAll()
          if (this.syllabusItemsId) {
            this.getSyllabusItemsId()
          }
        }
      },
    },
    methods: {
      getCoursesAll() {
        getCoursesAll().then((res) => {
          if (res.status == 200) {
            this.coursesAll = res.data
          }
        })
      },
      getSyllabusItemsId() {
        getSyllabusItemsId({ id: this.syllabusItemsId }).then((res) => {
          if (res.status == 200) {
            this.ruleForm.name = res.data.name
            this.ruleForm.type = res.data.type
            this.ruleForm.period = res.data.period
            this.ruleForm.exam = res.data.exam
            this.ruleForm.online = res.data.online
          }
        })
      },
      cancel() {
        this.$refs['ruleForm'].resetFields()
        this.$emit('cancelDialog')
      },
      handleSave() {
        let promies = null
        if (this.syllabusItemsId) {
          promies = putSyllabusItemsId
          this.ruleForm.id = this.syllabusItemsId
        } else {
          promies = postSyllabusItems
        }
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            promies(this.ruleForm).then((res) => {
              if (res.status == 200) {
                this.$message.success(
                  this.syllabusItemsId
                    ? this.$t('tip.editSuccessTip')
                    : this.$t('tip.addsuccessTip'),
                )
                this.$emit('getData')
                this.$emit('success')
              }
            })
          }
        })
      },
    },
  }
</script>
