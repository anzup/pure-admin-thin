<template>
  <section class="warp-content-table" v-loading="loading">
    <p class="remark"><em class="tag-danger">*</em>{{ $t('tip.fillTableTip') }}</p>
    <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <!-- 姓名 -->
        <td>{{ $t('table.name') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.name" />
          </template>
          <template v-else>
            {{ form.name }}
          </template>
        </td>
        <!-- 性别 -->
        <td>{{ $t('table.gender') }}</td>
        <td>
          <template v-if="isEdit">
            <el-select size="small" v-model="form.gender">
              <el-option
                v-for="(item, index) in formFilter.gender"
                :key="index"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </template>
          <template v-else>
            {{ formatArrayItem(form.gender, formFilter.gender) }}
          </template>
        </td>
        <!-- 身份证号 -->
        <td>{{ $t('table.idNumber') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.idNumber" />
          </template>
          <template v-else>
            {{ form.idNumber }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 职务 -->
        <td>{{ $t('table.job') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.postTitle" />
          </template>
          <template v-else>
            {{ form.postTitle }}
          </template>
        </td>
        <!-- 职称 -->
        <td>{{ $t('table.technicalTitle') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.jobTitle" />
          </template>
          <template v-else>
            {{ form.jobTitle }}
          </template>
        </td>
        <!-- 政治面貌 -->
        <td>{{ $t('table.politicalStatus') }}</td>
        <td>
          <template v-if="isEdit">
            <el-select size="small" v-model="form.politicalType">
              <el-option
                v-for="item in formFilter.politicalStatus"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </template>
          <template v-else>
            {{ formatArrayItem(form.politicalType, formFilter.politicalStatus) }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 工作时间 -->
        <td>{{ $t('table.worktime') }}</td>
        <td>
          <template v-if="isEdit">
            <el-date-picker size="small" value-format="YYYY-MM-DD" v-model="form.workStartTime" />
          </template>
          <template v-else>
            {{ formatDate(form.workStartTime) }}
          </template>
        </td>
        <!-- 飞行奖章 -->
        <td>{{ $t('table.flightMedal') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.medal" />
          </template>
          <template v-else>
            {{ form.medal }}
          </template>
        </td>
        <!-- 电话 -->
        <td>{{ $t('table.phoneNumber') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.phone" />
          </template>
          <template v-else>
            {{ form.phone }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 邮箱 -->
        <td>{{ $t('table.mailbox') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.email" />
          </template>
          <template v-else>
            {{ form.email }}
          </template>
        </td>
        <!-- 学历 -->
        <td>{{ $t('table.educationBackground') }}</td>
        <td>
          <template v-if="isEdit">
            <el-select size="small" v-model="form.degreeType">
              <el-option
                v-for="item in formFilter.educationBackground"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </template>
          <template v-else>
            {{ formatArrayItem(form.degreeType, formFilter.educationBackground) }}
          </template>
        </td>
        <!-- 毕业院校 -->
        <td>{{ $t('table.graduateInstitutions') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.graduationSchool" />
          </template>
          <template v-else>
            {{ form.graduationSchool }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 所学专业 -->
        <td>{{ $t('table.major') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.major" />
          </template>
          <template v-else>
            {{ form.major }}
          </template>
        </td>
        <!-- 常住地址 -->
        <td>{{ $t('table.permanentAddress') }}</td>
        <td colspan="3">
          <template v-if="isEdit">
            <el-input size="small" v-model="form.address" />
          </template>
          <template v-else>
            {{ form.address }}
          </template>
        </td>
      </tr>
    </table>
    <div class="foot">
      <template v-if="isEdit">
        <el-button size="medium" type="primary" plain key="cancel" @click="cancelEvent">{{
          $t('button.cancel')
        }}</el-button>
        <el-button size="medium" type="primary" key="save" @click="saveEvent">{{
          $t('button.save')
        }}</el-button>
      </template>
      <template v-else>
        <el-button size="medium" type="primary" @click="isEdit = true">{{
          $t('button.modify')
        }}</el-button>
      </template>
    </div>
  </section>
</template>

<script>
  import { getEmployeesId, putEmployeesId } from '/@/api/ftm/teacher/account'
  import { getPilotLicensesAll, getPilotLicensesDegreesAll } from '/@/api/ftm/teacher/pilotLicenses'
  import XEUtils from 'xe-utils'
  import moment from 'moment'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        isEdit: false,
        loading: false,
        originData: {},
        form: {
          name: '',
          gender: '',
          idNumber: '',
          postTitle: '',
          jobTitle: '',
          politicalType: '',
          workStartTime: '',
          medal: '',
          phone: '',
          email: '',
          degreeType: '',
          graduationSchool: '',
          major: '',
          address: '',
        },
        formFilter: {
          gender: [
            { id: 'M', name: this.$t('common.male') },
            { id: 'F', name: this.$t('common.female') },
          ],
          politicalStatus: [],
          educationBackground: [],
        },
      }
    },
    props: ['id'],
    created() {
      this.getPilotLicensesAll()
      this.getPilotLicensesDegreesAll()
      this.getData()
    },
    methods: {
      async getData() {
        this.loading = true
        const [err, res] = await to(getEmployeesId({ id: this.id }))
        this.loading = false
        if (!err && res.status == 200) {
          for (let key of Object.keys(this.form)) {
            this.form[key] = res.data[key]
          }
          this.originData = XEUtils.clone(this.form, true)
        }
      },
      // 获取政治面貌列表
      async getPilotLicensesAll() {
        const [err, res] = await to(getPilotLicensesAll())
        if (!err && res.status === 200) {
          this.formFilter.politicalStatus = res.data
        }
      },
      // 获取学历列表
      async getPilotLicensesDegreesAll() {
        const [err, res] = await to(getPilotLicensesDegreesAll())
        if (!err && res.status === 200) {
          this.formFilter.educationBackground = res.data
        }
      },
      cancelEvent() {
        this.form = XEUtils.clone(this.originData, true)
        this.isEdit = false
      },
      async saveEvent() {
        this.loading = true
        const params = {
          id: this.id,
          ...this.form,
        }
        const [err, res] = await to(putEmployeesId(params))
        this.loading = false
        this.isEdit = false
        if (!err && res.status === 200) {
          this.$message.success(this.$t('tip.saveSuccessTip'))
          this.getData()
        }
      },
      formatArrayItem(id, list) {
        try {
          return list.find((item) => item.id === id).name
        } catch (e) {
          return ''
        }
      },
      formatDate(val) {
        return val ? moment(val).format('YYYY-MM-DD') : ''
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/style/table.scss';
  .info-table-box td {
    padding-top: 4px !important;
    padding-bottom: 4px !important;
    height: 46px;
    .el-input,
    .el-select {
      width: 100%;
    }
  }
  .remark {
    margin-bottom: 8px;
    font-size: 14px;
    color: #333;
    text-align: right;
  }
  .foot {
    margin-top: 170px;
    text-align: center;
  }
  .tag-danger {
    padding: 0 4px;
    color: #d65555;
  }
</style>
