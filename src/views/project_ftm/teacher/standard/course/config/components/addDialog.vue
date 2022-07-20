<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="evaluationsId ? $t('button.modify') : $t('button.add')"
    v-model="visible"
    @close="cancel"
    center
    width="25%"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="90px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('table.evaluationContent')" prop="name">
        <el-input v-model="ruleForm.name" :placeholder="$t('holder.pleaseEnter')" />
      </el-form-item>
      <el-form-item :label="$t('table.normalScore')" prop="normalScore">
        <el-input-number
          style="width: 100%"
          controls-position="right"
          :min="1"
          :max="5"
          v-model="ruleForm.normalScore"
          :placeholder="$t('holder.pleaseEnter')"
        />
      </el-form-item>
      <el-form-item :label="$t('table.sort')">
        <el-input-number
          style="width: 100%"
          controls-position="right"
          :precision="0"
          v-model="ruleForm.seq"
        />
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
    getEvaluationsId,
  } from '/@/api/ftm/teacher/teachingPlan'
  export default {
    props: ['evaluationsDialog', 'evaluationsId'],
    data() {
      return {
        ruleForm: {
          name: '',
          normalScore: '',
          seq: '',
        },
        rules: {
          name: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.evaluationContent')}`,
              trigger: 'blur',
            },
          ],
          // normalScore: [{ validator: this.scoreValide }]
        },
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
    watch: {
      evaluationsDialog() {
        if (this.evaluationsId) {
          this.getEvaluationsId()
        }
      },
    },
    methods: {
      cancel() {
        this.$refs['ruleForm'].resetFields()
        this.$emit('cancelDialog')
      },
      getEvaluationsId() {
        getEvaluationsId({ id: this.evaluationsId }).then((res) => {
          if (res.status == 200) {
            this.ruleForm.name = res.data.name
            this.ruleForm.normalScore = res.data.normalScore
            this.ruleForm.seq = res.data.seq
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
            this.ruleForm.seq =
              typeof this.ruleForm.seq == 'string' ||
              (typeof this.ruleForm.seq == 'number' && typeof this.ruleForm.seq.length)
                ? Number(this.ruleForm.seq)
                : undefined
            this.ruleForm.normalScore = !this.ruleForm.normalScore
              ? 0
              : Number(this.ruleForm.normalScore)
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
      scoreValide(rule, value, cb) {
        if (!value) {
          cb(new Error(`${this.$t('holder.pleaseEnter')}${this.$t('table.normalScore')}`))
        } else if (Number.isNaN(parseInt(value)) || parseInt(value) < 1 || parseInt(value) > 5) {
          cb(new Error(this.$t('tip.pleaseEnterRang')))
        } else {
          cb()
        }
      },
    },
  }
</script>
