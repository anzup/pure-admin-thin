<template>
  <el-dialog
    :title="$t('table.examSignSetTrain')"
    v-model="visible"
    :before-close="cancel"
    center
    width="500px"
  >
    <section v-loading="loading">
      <div class="dialogBox">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="" prop="auditType">
            <el-radio-group v-model="ruleForm.auditType">
              <el-radio label="ADDITION">{{ $t('table.additionalTraining') }}</el-radio>
              <!-- <el-radio label="NORMAL_GRADUATE ">正常结训</el-radio> -->
              <el-radio label="ABNORMAL_GRADUATE">{{ $t('table.abnormalGraduate') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 异常结训说明 -->
          <el-form-item
            :label="$t('table.abnormalTrainingInAdvanceMark')"
            prop="auditRemark"
            v-if="ruleForm.auditType == 'ABNORMAL_GRADUATE'"
          >
            <el-input
              v-model="ruleForm.auditRemark"
              :placeholder="$t('holder.pleaseEnter')"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <!-- pin码 -->
          <el-form-item :label="$t('table.pinCode')" prop="pinCode">
            <el-input
              type="password"
              maxlength="6"
              :placeholder="$t('common.pleaseEnterPinCode')"
              v-model="ruleForm.pinCode"
            />
          </el-form-item>
        </el-form>
      </div>
    </section>
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
  import Api from '/@/api/ftm/teacher/trainEva'
  export default {
    props: ['dialogVisible', 'id'],
    data() {
      return {
        isShow: false,
        ruleForm: {
          auditRemark: '',
          auditType: '',
          pinCode: '',
        },
        rules: {
          auditType: [{ required: true, message: `${this.$t('holder.pleaseSelect')}` }],
          auditRemark: [{ required: true, message: `${this.$t('holder.pleaseEnter')}` }],
          pinCode: [{ required: true, message: this.$t('common.pleaseEnterPinCode') }],
        },
        loading: false,
      }
    },
    computed: {
      visible: {
        get() {
          return this.dialogVisible
        },
        set(val) {
          this.$emit('update:dialogVisible', val)
        },
      },
    },
    methods: {
      cancel() {
        this.$refs['ruleForm'].resetFields()
        this.$emit('cancelDialog')
      },
      handleSave() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let param = {
              id: this.id,
              auditRemark: this.ruleForm.auditRemark,
              auditType: this.ruleForm.auditType,
              pinCode: this.ruleForm.pinCode,
            }
            this.loading = true
            Api.setflyTrainAudit(param)
              .then((res) => {
                this.loading = false
                if (res.status == 200) {
                  this.$message({
                    type: 'success',
                    duration: 1500,
                    message: this.$t('tip.saveSuccessTip'),
                  })
                  this.cancel()
                  this.$emit('complate')
                }
              })
              .catch(() => {
                this.loading = false
              })
          }
        })
      },
    },
  }
</script>
