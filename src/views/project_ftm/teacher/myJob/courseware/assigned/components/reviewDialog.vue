<template>
  <div>
    <vxe-modal
      :value="visible"
      show-footer
      :before-hide-method="beforeHideMethod"
      width="600"
      height="325"
    >
      <template #title>
        <span>{{ $t('table.reviewAndAudit') }}</span>
      </template>
      <template #footer>
        <vxe-button type="submit" @click="handelCancel">{{ $t('button.cancel') }}</vxe-button>
        <vxe-button type="submit" status="primary" @click="handelSave">{{
          $t('button.confirm')
        }}</vxe-button>
      </template>
      <template #default>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
          <el-form-item :label="$t('table.reviewDeadline')" prop="endDate">
            <el-date-picker
              v-model="ruleForm.endDate"
              :picker-options="pickerOptions"
              type="date"
              :placeholder="$t('holder.pleaseSelectDate')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.membersOfTheReviewTeam')"
            prop="approverIds"
            :placeholder="$t('holder.pleaseSelect')"
          >
            <el-checkbox-group v-model="ruleForm.approverIds">
              <el-checkbox :label="item.id" v-for="(item, index) in approverList" :key="index">{{
                item.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
  import { getEmployees } from '/@/api/ftm/teacher/account'
  import {
    putCoursewareApprovalRequestsIdApprove,
    putCoursewareApprovalRequestsIdReject,
  } from '/@/api/ftm/teacher/courseware'
  import to from 'await-to-js'
  export default {
    props: {
      visible: {
        type: Boolean,
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
