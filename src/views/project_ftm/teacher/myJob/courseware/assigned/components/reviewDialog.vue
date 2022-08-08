<template>
  <el-dialog
    :title="$t('table.reviewAndAudit')"
    center
    v-model="show"
    width="600px"
    :before-close="beforeHideMethod"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item :label="$t('table.reviewDeadline')" prop="endDate">
        <el-date-picker
          v-model="ruleForm.endDate"
          type="date"
          :placeholder="$t('holder.pleaseSelectDate')"
          :disabled-date="pickerOptions.disabledDate"
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.membersOfTheReviewTeam')"
        prop="approverIds"
        :placeholder="$t('holder.pleaseSelect')"
      >
        <el-scrollbar max-height="500px">
          <el-checkbox-group v-model="ruleForm.approverIds">
            <el-checkbox :label="item.id" v-for="(item, index) in approverList" :key="index">{{
              item.name
            }}</el-checkbox>
          </el-checkbox-group>
        </el-scrollbar>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" plain @click="handelCancel">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="handelSave">{{ $t('button.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { getEmployees } from '/@/api/ftm/teacher/account'
  import to from 'await-to-js'
  export default {
    props: {
      visible: {
        type: Boolean,
      },
    },
    computed: {
      show: {
        get() {
          return this.visible
        },
        set(val) {
          this.$emit('update:visible', val)
        },
      },
    },
    data() {
      return {
        ruleForm: {
          endDate: '',
          approverIds: [],
        },
        approverList: [],
        rules: {
          endDate: {
            required: true,
            message: `${this.$t('holder.pleaseSelect')}${this.$t('table.reviewDeadline')}`,
            trigger: 'blur',
          },
          approverIds: {
            required: true,
            message: `${this.$t('holder.pleaseSelect')}${this.$t('table.membersOfTheReviewTeam')}`,
            trigger: 'blur',
          },
        },
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() < new Date().getTime() - 1000 * 60 * 60 * 24
          },
        },
      }
    },
    created() {
      this.getEmployees()
    },
    methods: {
      refresh() {
        this.$emit('update:visible', false)
        this.$refs.ruleForm.resetFields()
        this.$refs.ruleForm.clearValidate()
      },
      beforeHideMethod() {
        this.refresh()
        this.$emit('beforeHideMethod')
      },
      handelCancel() {
        this.refresh()
        this.$emit('beforeHideMethod')
      },
      handelSave() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let reviewDate = new Date(this.ruleForm.endDate)
            reviewDate.setHours(23)
            reviewDate.setMinutes(59)
            reviewDate.setSeconds(59)
            this.ruleForm.endDate = reviewDate
            this.$emit('submit', this.ruleForm)
          }
        })
      },
      async getEmployees() {
        const data = {
          page: 1,
          size: 1000,
          builtinRole: 'THEORY_TEACHER,FLIGHT_TEACHER',
        }
        let [err, res] = await to(getEmployees(data))
        if (res.status == 200) {
          this.approverList = res.data.content
        }
      },
    },
  }
</script>
