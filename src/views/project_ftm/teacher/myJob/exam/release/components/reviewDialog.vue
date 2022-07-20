<template>
  <el-dialog
    :title="$t('table.checkPaperReview')"
    width="500px"
    v-model="model"
    :close-on-click-modal="false"
    center
  >
    <el-form :model="form" :rules="formRules" ref="form">
      <el-form-item :label="$t('table.examineSelect')">
        <el-radio name="review" label="1" v-model="form.type">{{ $t('common.agree') }}</el-radio>
        <el-radio name="review" label="2" v-model="form.type">{{ $t('common.turnDown') }}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('table.reviewTime')" v-show="form.type == '1'" prop="time">
        <el-input-number v-model="form.time" :min="1" controls-position="right" />
        &nbsp;{{ $t('common.hour') }}
      </el-form-item>
      <el-form-item :label="$t('table.reasonsForRejection')" v-show="form.type == '2'" prop="mark">
        <el-input type="textarea" v-model.trim="form.mark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="confirm">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      const validateTime = (rule, value, cb) => {
        if (this.form.type == '1' && !value) {
          cb(new Error(this.$t('holder.pleaseEnter') + this.$t('table.reviewTime')))
        } else {
          cb()
        }
      }
      const validateMark = (rule, value, cb) => {
        if (this.form.type == '2' && !value) {
          cb(new Error(this.$t('holder.pleaseEnter') + this.$t('table.reasonsForRejection')))
        } else {
          cb()
        }
      }

      return {
        form: {
          type: '1',
          time: '',
          mark: '',
        },
        formRules: {
          time: [{ validator: validateTime }],
          mark: [{ validator: validateMark }],
        },
      }
    },
    props: ['value'],
    computed: {
      model: {
        get() {
          return this.value || false
        },
        set(bool) {
          this.$emit('update:modelValue', bool)
        },
      },
    },
    methods: {
      cancel() {
        this.model = false
        this.$emit('cancel')
      },
      confirm() {
        this.$refs.form.validate((bool) => {
          if (bool) {
            this.$emit('confirm', this.form)
          }
        })
      },
    },
  }
</script>
