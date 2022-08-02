<template>
  <div class="fromContinerCom">
    <div class="title">
      <span>{{ $t('table.job') }}:</span> {{ tabName }}
    </div>
    <el-row class="warp-content-table" type="flex" justify="center">
      <el-col :span="24" :xl="14" :lg="16" :xs="24">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="ruleForm"
          :show-message="false"
        >
          <table class="info-table-box">
            <tr>
              <!-- 用户姓名/客户姓名 -->
              <td><em class="label-require-point">*</em>{{ Name }}</td>
              <td>
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.name" :placeholder="$t('holder.pleaseEnter')" />
                </el-form-item>
              </td>
              <!-- 性别 -->
              <td><em class="label-require-point">*</em>{{ $t('table.gender') }}</td>
              <td>
                <el-form-item prop="gender">
                  <el-select
                    v-model="ruleForm.gender"
                    :placeholder="$t('holder.selectGender')"
                    style="width: 100%"
                  >
                    <el-option :label="$t('common.male')" value="M" />
                    <el-option :label="$t('common.female')" value="F" />
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <!-- 手机号 -->
              <td>{{ $t('table.cellPhoneNumber') }}</td>
              <td>
                <el-form-item prop="phone">
                  <el-input v-model="ruleForm.phone" :placeholder="$t('holder.pleaseEnter')" />
                </el-form-item>
              </td>
              <!-- 邮箱 -->
              <td>{{ $t('table.mailbox') }}</td>
              <td>
                <el-form-item prop="email">
                  <el-input v-model="ruleForm.email" :placeholder="$t('holder.pleaseEnter')" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <!-- 座机号 -->
              <td>{{ $t('table.seatNumber') }}</td>
              <td>
                <el-form-item prop="landline">
                  <el-input v-model="ruleForm.landline" :placeholder="$t('holder.pleaseEnter')" />
                </el-form-item>
              </td>
              <!-- 身份证 -->
              <td>{{ $t('table.idCard') }}</td>
              <td>
                <el-form-item prop="idNumber">
                  <el-input v-model="ruleForm.idNumber" :placeholder="$t('holder.pleaseEnter')" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <!-- 登录账号 -->
              <td><em class="label-require-point">*</em>{{ $t('table.loginAccount') }}</td>
              <td colspan="3">
                <el-form-item prop="username">
                  <div class="flex-box">
                    <el-input
                      v-model="ruleForm.username"
                      class="flex-input"
                      :placeholder="$t('holder.pleaseEnter')"
                    />
                    <el-button
                      class="editAuth"
                      type="primary"
                      @click="toEditAuth"
                      v-if="type == 'modify'"
                      >{{ $t('button.editAuth') }} ></el-button
                    >
                  </div>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="tabBuiltinRole == 'CUSTOMER_CONTACTOR'">
              <!-- 客户名称 -->
              <td><em class="label-require-point">*</em>{{ $t('table.customerName') }}</td>
              <td colspan="3">
                <el-form-item prop="customerId">
                  <el-select
                    v-model="ruleForm.customerId"
                    :placeholder="$t('holder.pleaseSelect')"
                    style="width: 100%"
                  >
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in customersAll"
                      :key="item.index"
                    />
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="tabBuiltinRole !== 'CUSTOMER_CONTACTOR'">
              <!-- 部门 -->
              <td><em class="label-require-point">*</em>{{ $t('table.department') }}</td>
              <td colspan="3">
                <el-form-item prop="departmentId">
                  <el-cascader
                    v-model="departmentId"
                    :options="departmentsAll"
                    :props="departmentProps"
                    separator="-"
                    :show-all-levels="true"
                    clearable
                  />
                </el-form-item>
              </td>
            </tr>

            <tr v-if="showCompany">
              <!-- 运行公司 -->
              <td>{{ $t('table.operateCompany') }}</td>
              <td colspan="3">
                <el-form-item prop="operatingCompany">
                  <el-select v-model="ruleForm.operatingCompany" class="full-width">
                    <el-option
                      :label="item.name"
                      :value="item.id"
                      v-for="item in companyConfigs"
                      :key="item.index"
                    />
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="showLevel || showSource">
              <!-- 教员等级 -->
              <template v-if="showLevel">
                <td>{{ $t('table.teacherLevel') }}</td>
                <td :colspan="showSource ? 1 : 3">
                  <el-form-item prop="employeeLevel">
                    <el-select v-model="ruleForm.employeeLevel" class="full-width">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="item in levelConfigs"
                        :key="item.index"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </template>
              <!-- 教员来源 -->
              <template v-if="showSource">
                <td>{{ $t('table.teacherSource') }}</td>
                <td :colspan="showLevel ? 1 : 3">
                  <el-form-item prop="employeeSource">
                    <el-select v-model="ruleForm.employeeSource" class="full-width">
                      <el-option
                        :label="item.name"
                        :value="item.id"
                        v-for="item in sourceConfigs"
                        :key="item.index"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </template>
            </tr>

            <tr>
              <!-- 备注 -->
              <td>{{ $t('table.remarks') }}</td>
              <td colspan="3">
                <el-form-item prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    :placeholder="$t('holder.pleaseEnter')"
                    v-model="ruleForm.remark"
                  />
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="24" :xl="14" :lg="16" :xs="24">
        <div class="pageContanier">
          <el-button type="primary" class="rightBtn" @click="debouncedClickFn">{{
            $t('button.save')
          }}</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getRolesAll,
    getDepartmentsAll,
    postEmployees,
    getEmployeesId,
    putEmployeesId,
    getDepartments,
  } from '/@/api/ftm/teacher/account'
  import { getCustomersAll } from '/@/api/ftm/teacher/trainingPlan'
  import { debounce } from '/@/utils/index'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { EmployeeEnum } from '/@/enums/EmployeeEnum'
  import { useFtmSettingsStore } from '/@/store/modules/ftmSetting'
  const settingsStore = useFtmSettingsStore()
  export default {
    name: 'AddStaffMember',
    data() {
      return {
        ruleForm: {
          customerId: undefined,
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
          employeeLevel: undefined,
          employeeSource: undefined,
          operatingCompany: undefined,
        },
        roleId: undefined,
        departmentId: [],
        departmentParentId: undefined,
        departmentFrom: {
          superiorId: undefined,
          level: 0,
          name: undefined,
        },
        rolesAll: [],
        tabAll: [],
        departmentsAll: [],
        customersAll: [],
        type: '',
        rules: {
          name: [
            {
              trigger: 'blur',
              validator: (rule, value, cb) => {
                if (!value || value == '') {
                  let { builtinRole } = this.$route.query
                  cb(
                    new Error(
                      builtinRole == 'CUSTOMER_CONTACTOR'
                        ? this.$t('holder.pleaseEnterCustomerName')
                        : this.$t('holder.pleaseEnterTeacherName'),
                    ),
                  )
                } else {
                  cb()
                }
              },
            },
          ],
          gender: [
            { required: true, message: `${this.$t('holder.selectGender')}`, trigger: 'blur' },
          ],
          username: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnterLoginAccount')}`,
              trigger: 'blur',
            },
          ],
          customerId: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelectCustomer')}`,
              trigger: 'blur',
            },
          ],
          departmentId: [
            {
              validator: (rule, value, callback) => {
                if (!this.departmentId || this.departmentId.length < 1) {
                  callback(new Error(`${this.$t('holder.pleaseSelectDepart')}`))
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
        },
        departmentProps: {
          multiple: true,
          checkStrictly: true,
          label: 'name',
          value: 'id',
        },
      }
    },
    computed: {
      configs() {
        return settingsStore.configs
      },
      tabName() {
        if (this.type == 'modify') {
          return this.tabAll.filter((v) => v.id == this.roleId).length !== 0
            ? this.tabAll.filter((v) => v.id == this.roleId)[0].name
            : ''
        } else {
          return this.tabAll.filter((v) => v.id == this.$route.query.id).length !== 0
            ? this.tabAll.filter((v) => v.id == this.$route.query.id)[0].name
            : ''
        }
      },
      tabBuiltinRole() {
        if (this.type == 'modify') {
          return this.tabAll.filter((v) => v.id == this.roleId).length !== 0
            ? this.tabAll.filter((v) => v.id == this.roleId)[0].builtinRole
            : undefined
        } else {
          return this.tabAll.filter((v) => v.id == this.$route.query.id).length !== 0
            ? this.tabAll.filter((v) => v.id == this.$route.query.id)[0].builtinRole
            : undefined
        }
      },
      Name() {
        let { builtinRole } = this.$route.query
        return builtinRole == 'CUSTOMER_CONTACTOR'
          ? this.$t('table.customerCompellation')
          : this.$t('table.userName')
      },
      // 运行公司配置列表
      companyConfigs() {
        try {
          return this.configs.find((item) => item.name === EmployeeEnum.company).value || []
        } catch (e) {
          return []
        }
      },
      showCompany() {
        return this.companyConfigs.length > 0
      },
      // 教员等级配置列表
      levelConfigs() {
        try {
          return this.configs.find((item) => item.name === EmployeeEnum.level).value || []
        } catch (e) {
          return []
        }
      },
      showLevel() {
        return this.levelConfigs.length > 0
      },
      // 教员来源配置列表
      sourceConfigs() {
        try {
          return this.configs.find((item) => item.name === EmployeeEnum.source).value || []
        } catch (e) {
          return []
        }
      },
      showSource() {
        return this.sourceConfigs.length > 0
      },
    },
    created() {
      this.type = this.$route.query.status
      this.getRolesAll()
      this.getDepartmentsAll()
      this.getCustomersAll()
      if (this.type == 'modify') {
        this.getEmployeesId()
      } else {
        this.ruleForm.roleId = this.$route.query.id
      }
    },
    mounted() {
      this.debouncedClickFn = debounce(this.handleSave, 0.5 * 1000)
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      debouncedClickFn() {}, // 防抖
      async getDepartmentsAll() {
        let [err, res] = await to(getDepartments({ size: 1000 }))
        if (!err && res.status == 200) {
          let departments = res.data.content.map((v) => {
            v.parentId = v.superior ? v.superior.id : null
            return v
          })
          this.departmentsAll = XEUtils.toArrayTree(departments, { strict: true })
        }
      },
      departmentChange(val) {
        this.departmentFrom.superiorId = val
        this.departmentFrom.level = undefined
        this.departmentId = undefined
        getDepartmentsAll(this.departmentFrom).then((res) => {
          if (res.status == 200) {
            this.rolesAll = res.data
            this.departmentFrom.level = 0
          }
        })
      },
      postEmployees() {
        this.ruleForm.departmentIds = this.departmentId.map((v) => (v.length > 1 ? v[1] : v[0]))
        postEmployees(this.ruleForm).then((res) => {
          if (res.status == 200) {
            this.handleCancel()
          }
        })
      },
      // 提交修改
      putEmployeesId() {
        this.ruleForm.departmentIds = this.departmentId.map((v) => (v.length > 1 ? v[1] : v[0]))
        this.ruleForm.id = this.$route.query.id
        putEmployeesId(this.ruleForm).then((res) => {
          if (res.status == 200) {
            this.handleCancel()
          }
        })
      },
      handleCancel() {
        this.$refs['ruleForm'].resetFields()
        this.$router.go(-1)
      },
      handleSave() {
        this.$refs['ruleForm'].validate((valid, items) => {
          if (valid) {
            if (this.type == 'modify') {
              this.putEmployeesId()
            } else {
              this.postEmployees()
            }
          } else {
            let msg
            try {
              msg = Object.entries(items)[0][1][0]['message']
            } catch (e) {
              msg = this.$t('holder.pleaseFillForm')
            }
            this.$message.closeAll()
            this.$message.error(msg)
          }
        })
      },
      getEmployeesId() {
        getEmployeesId({ id: this.$route.query.id }).then((res) => {
          if (res.status == 200) {
            this.roleId = res.data.role.id
            this.ruleForm.roleId = res.data.role.id
            if (!res.data.customer) {
              let departments = res.data.departments
              this.departmentId = departments.map((item) => {
                return item.superior ? [item.superior.id, item.id] : [item.id]
              })
              // if (res.data.department && res.data.department.superior) {
              //   this.departmentChange(res.data.department.superior.id)
              //   res.data.department && res.data.department.superior ? this.departmentParentId = res.data.department.superior.id : this.departmentParentId = undefined
              //   this.departmentId = res.data.department.id
              // } else {
              //   this.departmentChange(res.data.department.id)
              //   res.data.department ? this.departmentParentId = res.data.department.id : null
              // }
            } else {
              this.ruleForm.customerId = res.data.customer.id
            }
            this.ruleForm.name = res.data.name
            this.ruleForm.gender = res.data.gender
            this.ruleForm.username = res.data.username
            this.ruleForm.phone = res.data.phone
            this.ruleForm.landline = res.data.landline
            this.ruleForm.idNumber = res.data.idNumber
            this.ruleForm.email = res.data.email
            this.ruleForm.remark = res.data.remark
            this.ruleForm.operatingCompany = res.data.operatingCompany
            this.ruleForm.employeeLevel = res.data.employeeLevel
            this.ruleForm.employeeSource = res.data.employeeSource
          }
        })
      },
      getRolesAll() {
        getRolesAll().then((res) => {
          if (res.status == 200) {
            this.tabAll = res.data
          }
        })
      },
      getCustomersAll() {
        getCustomersAll().then((res) => {
          if (res.status == 200) {
            this.customersAll = res.data
          }
        })
      },
      formatData(val, arr) {
        if (!val) {
          return false
        }
        return arr.filter((v) => v.id == val)
      },
      toEditAuth() {
        let { roleId, id } = this.$route.query
        this.routerGo(`editAuth?roleId=${roleId || ''}&id=${id || ''}`)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '/@/style/table.scss';
  .editAuth {
    margin-left: 12px;
    box-sizing: border-box;
    text-align: center;
  }
  .pageContanier {
    text-align: right;
    .rightBtn {
      margin: 12px 0;
    }
  }
  .flex-box {
    display: flex;
    width: 100%;
    .flex-input {
      flex: 1;
    }
    .editAuth {
      margin-left: 10px;
    }
  }
  .title {
    font-size: 14px;
    color: #333;
    span {
      font-weight: 700;
    }
  }
</style>
