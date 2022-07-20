<template>
  <vxe-modal
    v-model="examineVisible"
    show-footer
    :before-hide-method="beforeHideMethod"
    width="600"
    height="325"
    remember
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
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
          <el-form-item :label="$t('table.auditResults')">
            <el-radio v-model="ruleForm.auditResults" label="1">{{ $t('button.pass') }}</el-radio>
            <el-radio v-model="ruleForm.auditResults" label="2">{{ $t('button.noPass') }}</el-radio>
          </el-form-item>
          <el-form-item
            :label="$t('table.reasonsForRejection')"
            prop="rejectReason"
            v-if="ruleForm.auditResults == '2'"
          >
            <el-input type="textarea" v-model="ruleForm.rejectReason" />
          </el-form-item>
          <el-form-item
            :label="$t('table.reviewDeadline')"
            prop="endDate"
            v-if="ruleForm.auditResults == '1'"
          >
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
            v-if="ruleForm.auditResults == '1'"
            :placeholder="$t('holder.pleaseSelect')"
          >
            <el-checkbox-group v-model="ruleForm.approverIds">
              <el-checkbox :label="item.id" v-for="item in approverList" :key="item.index">{{
                item.name
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </vxe-modal>
</template>

<script>
  import { getEmployees } from '/@/api/ftm/teacher/account'
  import {
    putCoursewareApprovalRequestsIdApprove,
    putCoursewareApprovalRequestsIdReject,
  } from '/@/api/ftm/teacher/courseware'
  export default {
    props: {
      examineVisible: {
        type: Boolean,
      },
      examineId: {
        type: Number,
      },
    },
    data() {
      return {
        ruleForm: {
          auditResults: '1',
          rejectReason: '',
          endDate: '',
          approverIds: [],
        },
        approverList: [],
        rules: {
          rejectReason: {
            required: true,
            message: `${this.$t('holder.pleaseEnter')}${this.$t('table.rejectReason')}`,
            trigger: 'blur',
          },
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
      beforeHideMethod() {
        this.$emit('beforeHideMethod')
      },
      handelCancel() {
        this.$emit('beforeHideMethod')
      },
      handelSave() {
        let promise = null
        this.ruleForm.id = this.examineId
        if (this.ruleForm.auditResults == '1') {
          promise = putCoursewareApprovalRequestsIdApprove
        } else {
          promise = putCoursewareApprovalRequestsIdReject
        }
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let reviewDate = new Date(this.ruleForm.endDate)
            reviewDate.setHours(23)
            reviewDate.setMinutes(59)
            reviewDate.setSeconds(59)
            this.ruleForm.endDate = reviewDate
            promise(this.ruleForm).then((res) => {
              if (res.status == 200) {
                this.$emit('beforeHideMethod')
                this.$message.success(this.$t('tip.auditSuccessTip'))
              }
            })
          }
        })
      },
      getEmployees() {
        const data = {
          page: 1,
          size: 1000,
          builtinRole: 'THEORY_TEACHER,FLIGHT_TEACHER',
        }
        getEmployees(data).then((res) => {
          if (res.status == 200) {
            this.approverList = res.data.content
          }
        })
      },
    },
  }
</script>
