<template>
  <div class="addCourseConfigDialog">
    <el-dialog
      width="500px"
      center
      :title="$t('table.addTemporaryCandidates')"
      :close-on-click-modal="false"
      v-model="temporaryExamDialogVisible"
      :before-close="handleCancel"
    >
      <span class="dialogBox">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('table.name')" prop="name">
            <el-input
              v-model="ruleForm.name"
              style="width: 90%"
              :placeholder="$t('holder.pleaseEnter')"
            />
          </el-form-item>
          <el-form-item :label="$t('table.gender')" prop="gender">
            <el-select
              v-model="ruleForm.gender"
              :placeholder="$t('holder.selectGender')"
              style="width: 90%"
            >
              <el-option :label="$t('common.male')" value="M" />
              <el-option :label="$t('common.female')" value="F" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.idNumber')" prop="idNumber">
            <el-input
              v-model="ruleForm.idNumber"
              style="width: 90%"
              :placeholder="$t('holder.pleaseEnter')"
            />
          </el-form-item>
          <el-form-item :label="$t('table.cellPhoneNumber')" prop="phone">
            <el-input
              v-model="ruleForm.phone"
              style="width: 90%"
              :placeholder="$t('holder.pleaseEnter')"
            />
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <el-button @click="handleCancel" type="primary" plain size="medium">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" size="medium" @click="handleSave">{{
          $t('button.save')
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import XEUtils from 'xe-utils'
  export default {
    props: ['temporaryExamDialogVisible'],
    data() {
      return {
        ruleForm: {
          type: 'TEMPORARY',
          studentId: undefined,
          name: '',
          gender: '',
          idNumber: '',
          phone: '',
        },
        rules: {
          name: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.name')}`,
              trigger: 'blur',
            },
          ],
          gender: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.gender')}`,
              trigger: 'blur',
            },
          ],
          idNumber: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.idNumber')}`,
              trigger: 'blur',
            },
          ],
          phone: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.cellPhoneNumber')}`,
              trigger: 'blur',
            },
          ],
        },
      }
    },
    created() {},
    methods: {
      handleCancel() {
        this.$refs['ruleForm'].resetFields()
        this.$emit('handleCancel')
      },
      handleSave() {
        var ruleForm = XEUtils.clone(this.ruleForm, true)
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$emit('geteTmporaryData', ruleForm)
            this.handleCancel()
          }
        })
      },
    },
  }
</script>

<style>
  .addCourseConfigDialog .el-dialog__footer {
    margin: 0 30px;
    border-top: 1px solid #e8e8e8;
    padding-right: 0;
  }
</style>
