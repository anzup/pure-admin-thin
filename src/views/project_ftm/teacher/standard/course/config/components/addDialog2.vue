<template>
  <el-dialog
    :title="evaluationsId ? $t('button.modify') : $t('button.add')"
    v-model="visible"
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
      <el-form-item :label="$t('table.evaluationCoreCompetenceProj')" prop="superiorId">
        <el-select
          v-model="ruleForm.superiorId"
          :placeholder="$t('holder.pleaseSelect')"
          style="width: 100%"
        >
          <el-option
            :label="item.name"
            :value="item.id"
            v-for="item in optionList"
            :key="item.index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.indicatorsCode')" prop="code">
        <el-input v-model="ruleForm.code" :placeholder="$t('holder.pleaseEnter')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.behavioralIndicators')" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="$t('holder.pleaseEnter')"></el-input>
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
  import {
    postEvaluations,
    putEvaluationsId,
    getEvaluations,
    getEvaluationsId,
  } from '/@/api/ftm/teacher/teachingPlan'
  export default {
    props: ['evaluationsDialog', 'evaluationsId'],
    data() {
      const scoreValide = function (rule, value, cb) {
        console.log(value)
        if (!value) {
          cb(new Error(`${this.$t('holder.pleaseEnter')}${this.$t('table.normalScore')}`))
        } else if (Number.isNaN(parseInt(value)) || parseInt(value) < 1 || parseInt(value) > 5) {
          cb(new Error(this.$t('tip.pleaseEnterRang')))
        } else {
          cb()
        }
      }
      return {
        ruleForm: {
          name: '',
          superiorId: '',
          code: '',
        },
        rules: {
          superiorId: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.evaluationContent')}`,
              trigger: 'blur',
            },
          ],
          code: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.evaluationContent')}`,
              trigger: 'blur',
            },
          ],
          name: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.evaluationContent')}`,
              trigger: 'blur',
            },
          ],
        },
        optionList: [],
      }
    },
    computed: {
      visible: {
        get() {
          return this.evaluationsDialog
        },
        set(val) {
          this.$emit('update:evaluationsDialog', val)
        },
      },
    },
    created() {
      this.getEvaluations()
    },
    watch: {
      evaluationsDialog(val) {
        if (this.evaluationsId) {
          this.getEvaluationsId()
        }
      },
    },
    methods: {
      getEvaluations() {
        let params = {
          level: 0,
          page: 1,
          size: 2000,
        }
        getEvaluations(params)
          .then((res) => {
            if (res.status == 200) {
              this.optionList = res.data.content
            }
          })
          .catch(() => {})
      },
      cancel() {
        this.$refs['ruleForm'].resetFields()
        this.$emit('cancelDialog')
      },
      getEvaluationsId() {
        getEvaluationsId({ id: this.evaluationsId }).then((res) => {
          if (res.status == 200) {
            this.ruleForm.name = res.data.name
            this.ruleForm.code = res.data.code
            this.ruleForm.superiorId = res.data.superior.id
          }
        })
      },
      handleSave() {
        let promies = null
        if (this.evaluationsId) {
          promies = putEvaluationsId
          this.ruleForm.id = this.evaluationsId
        } else {
          promies = postEvaluations
        }
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            promies(this.ruleForm).then((res) => {
              if (res.status == 200) {
                this.$message.success(
                  this.evaluationsId ? this.$t('tip.editSuccessTip') : this.$t('tip.addsuccessTip'),
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
