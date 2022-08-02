<template>
  <div class="fromContinerCom staff">
    <div class="title">
      {{ $t('table.job') }}: <span>{{ tabName }}</span>
    </div>
    <el-row class="warp-content-table" type="flex" justify="center">
      <el-col :span="24" :xl="14" :lg="16" :xs="24">
        <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td>{{ Name }}</td>
            <td>{{ ruleForm.name }}</td>
            <td>{{ $t('table.gender') }}</td>
            <td>{{ ruleForm.gender }}</td>
            <td>{{ $t('table.loginAccount') }}</td>
            <td>{{ ruleForm.username }}</td>
          </tr>
          <tr>
            <td>{{ $t('table.cellPhoneNumber') }}</td>
            <td>{{ ruleForm.phone }}</td>
            <td>{{ $t('table.seatNumber') }}</td>
            <td>{{ ruleForm.landline }}</td>
            <td>{{ $t('table.idCard') }}</td>
            <td>{{ ruleForm.idNumber }}</td>
          </tr>
          <tr>
            <td>{{ $t('table.mailbox') }}</td>
            <td>{{ ruleForm.email }}</td>
            <td v-if="tabBuiltinRole == 'CUSTOMER_CONTACTOR'">{{ $t('table.customerName') }}</td>
            <td v-if="tabBuiltinRole == 'CUSTOMER_CONTACTOR'">{{ ruleForm.customerId }}</td>
            <td v-if="tabBuiltinRole !== 'CUSTOMER_CONTACTOR'">{{ $t('table.department') }}</td>
            <td v-if="tabBuiltinRole !== 'CUSTOMER_CONTACTOR'">{{ ruleForm.departmentId }}</td>
            <td>{{ $t('table.remarks') }}</td>
            <td>{{ ruleForm.remarks }}</td>
          </tr>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getRolesAll, getDepartmentsAll, getEmployeesId } from '/@/api/ftm/teacher/account'
  export default {
    name: 'staffMemberDetails',
    data() {
      return {
        ruleForm: {
          name: '',
          departmentId: undefined,
          email: '',
          gender: '',
          idNumber: '',
          landline: '',
          phone: '',
          remark: '',
          roleId: undefined,
          username: '',
          customerId: undefined,
        },
        roleId: undefined,
        id: undefined,
        rolesAll: [],
        departmentsAll: [],
      }
    },
    computed: {
      tabName() {
        return this.rolesAll.filter((v) => v.id == this.roleId).length !== 0
          ? this.rolesAll.filter((v) => v.id == this.roleId)[0].name
          : ''
      },
      tabBuiltinRole() {
        return this.rolesAll.filter((v) => v.id == this.roleId).length !== 0
          ? this.rolesAll.filter((v) => v.id == this.roleId)[0].builtinRole
          : undefined
      },
      Name() {
        let { builtinRole } = this.$route.query
        return builtinRole == 'CUSTOMER_CONTACTOR'
          ? this.$t('table.customerName')
          : this.$t('table.teacherName')
      },
    },
    created() {
      this.id = this.$route.query.id
      this.getRolesAll()
      this.getEmployeesId()
    },
    methods: {
      getDepartmentsAll() {
        getDepartmentsAll().then((res) => {
          if (res.status == 200) {
            this.departmentsAll = res.data
          }
        })
      },
      getRolesAll() {
        getRolesAll().then((res) => {
          if (res.status == 200) {
            this.rolesAll = res.data
          }
        })
      },
      getEmployeesId() {
        getEmployeesId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            this.roleId = res.data.role.id
            if (!res.data.customer) {
              let arr = []
              let departments = res.data.departments
              if (departments instanceof Array && departments.length) {
                departments.forEach((department) => {
                  department.superior
                    ? arr.push(`${department.superior.name} / ${department.name}`)
                    : arr.push(department.name)
                })
              }
              this.ruleForm.departmentId = arr.join(',')
            } else {
              this.ruleForm.customerId = res.data.customer.name
            }
            this.ruleForm.name = res.data.name
            res.data.gender == 'F'
              ? (this.ruleForm.gender = this.$t('common.female'))
              : (this.ruleForm.gender = this.$t('common.male'))
            this.ruleForm.username = res.data.username
            this.ruleForm.phone = res.data.phone
            this.ruleForm.landline = res.data.landline
            this.ruleForm.idNumber = res.data.idNumber
            this.ruleForm.email = res.data.email
            this.ruleForm.remark = res.data.remark
          }
        })
      },
      handleCancel() {
        this.$refs['ruleForm'].resetFields()
        this.$router.go(-1)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '/@/style/table.scss';
  .editAuth {
    color: #1991ff;
    cursor: pointer;
  }
  .title {
    font-size: 14px;
  }
  .staff-name {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .staff .ruleForm .el-form-item__label {
    text-align: right !important;
    font-size: 14px;
  }
  .staff .ruleForm .el-form-item__content {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
  }
</style>
