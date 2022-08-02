<template>
  <section class="warp-content-table">
    <p class="remark"><em class="tag-danger">*</em>{{ $t('tip.fillTableTip') }}</p>
    <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <!-- 档案号 -->
        <td>{{ $t('table.archivesNumber') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.fileNumber" />
          </template>
          <template v-else>
            {{ form.fileNumber }}
          </template>
        </td>
        <!-- 执照类型 -->
        <td>{{ $t('table.licenseType') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.licenseType" />
          </template>
          <template v-else>
            {{ form.licenseType }}
          </template>
        </td>
        <!-- 等级 -->
        <td>{{ $t('table.level') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.level" />
          </template>
          <template v-else>
            {{ form.level }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 体验标准 -->
        <td>{{ $t('table.experienceCriterion') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.experienceStandard" />
          </template>
          <template v-else>
            {{ form.experienceStandard }}
          </template>
        </td>
        <!-- 体验等级 -->
        <td>{{ $t('table.experienceLevel') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.experienceLevel" />
          </template>
          <template v-else>
            {{ form.experienceLevel }}
          </template>
        </td>
        <!-- 体验有效期 -->
        <td>{{ $t('table.experienceValidPeriod') }}</td>
        <td>
          <template v-if="isEdit">
            <el-date-picker
              size="small"
              type="date"
              value-format="YYYY-MM-DD"
              v-model="form.experienceValidityPeriod"
            />
          </template>
          <template v-else>
            {{ formatDate(form.experienceValidityPeriod) }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- ICAO等级 -->
        <td>{{ $t('table.ICAOLevel') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.icaolevel" />
          </template>
          <template v-else>
            {{ form.icaolevel }}
          </template>
        </td>
        <!-- ICAO有效日期 -->
        <td>{{ $t('table.ICAOPeriod') }}</td>
        <td>
          <template v-if="isEdit">
            <el-date-picker
              size="small"
              type="date"
              value-format="YYYY-MM-DD"
              v-model="form.icaovalidityPeriod"
            />
          </template>
          <template v-else>
            {{ formatDate(form.icaovalidityPeriod) }}
          </template>
        </td>
        <!-- 飞行经历 -->
        <td>{{ $t('table.flightExperience') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.flightExperience" />
          </template>
          <template v-else>
            {{ form.flightExperience }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 机长时间 -->
        <td>{{ $t('table.airplaneCaptainTime') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.machineTime" @blur="validatyMinMethod">
              <template v-slot:append>{{ $t('common.year') }}</template>
            </el-input>
          </template>
          <template v-else>
            {{ formatYear(form.machineTime) }}
          </template>
        </td>
        <!-- 教员时间 -->
        <td>{{ $t('table.teacherTime') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.facultyTime" @blur="validatyMinMethod">
              <template v-slot:append>{{ $t('common.year') }}</template>
            </el-input>
          </template>
          <template v-else>
            {{ formatYear(form.facultyTime) }}
          </template>
        </td>
        <!-- 现飞机型 -->
        <td>{{ $t('table.nowAircraftType') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.currentAircraft" />
          </template>
          <template v-else>
            {{ form.currentAircraft }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 机型经历 -->
        <td>{{ $t('table.airplaneTypeExperience') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.modelExperience" />
          </template>
          <template v-else>
            {{ form.modelExperience }}
          </template>
        </td>
        <!-- 运行航司 -->
        <td>{{ $t('table.airlines') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.runAirline" />
          </template>
          <template v-else>
            {{ form.runAirline }}
          </template>
        </td>
        <!-- 公司聘职 -->
        <td>{{ $t('table.airlinesJob') }}</td>
        <td>
          <template v-if="isEdit">
            <el-input size="small" v-model="form.companyPosition" />
          </template>
          <template v-else>
            {{ form.companyPosition }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 聘职时间 -->
        <td>{{ $t('table.airlinesWorkTime') }}</td>
        <td>
          <template v-if="isEdit">
            <el-date-picker type="date" value-format="YYYY-MM-DD" v-model="form.hiringTime" />
          </template>
          <template v-else>
            {{ formatDate(form.hiringTime) }}
          </template>
        </td>
        <!-- 执照有效期 -->
        <td>{{ $t('table.licenseValidPeriod') }}</td>
        <td>
          <template v-if="isEdit">
            <el-date-picker
              size="small"
              type="date"
              value-format="YYYY-MM-DD"
              v-model="form.licenseStartTime"
            />
          </template>
          <template v-else>
            {{ formatDate(form.licenseStartTime) }}
          </template>
        </td>
        <!-- 教员等级有效期 -->
        <td>{{ $t('table.teacherLevelValidPeriod') }}</td>
        <td>
          <template v-if="isEdit">
            <el-date-picker
              size="small"
              type="date"
              value-format="YYYY-MM-DD"
              v-model="form.facultyLevelStartTime"
            />
          </template>
          <template v-else>
            {{ formatDate(form.facultyLevelStartTime) }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 121熟练检查有效期 -->
        <td>{{ $t('table.121PC-PICValidPeriod') }}</td>
        <td>
          <template v-if="isEdit">
            <el-date-picker
              size="small"
              type="date"
              value-format="YYYY-MM-DD"
              v-model="form.twelveProficientTestingStartTime"
            />
          </template>
          <template v-else>
            {{ formatDate(form.twelveProficientTestingStartTime) }}
          </template>
        </td>
        <!-- 142熟练检查有效期 -->
        <td>{{ $t('table.142PC-PICValidPeriod') }}</td>
        <td colspan="3">
          <template v-if="isEdit">
            <el-date-picker
              style="width: auto"
              size="small"
              type="date"
              value-format="YYYY-MM-DD"
              v-model="form.fourteenProficientTestingStartTime"
            />
          </template>
          <template v-else>
            {{ formatDate(form.fourteenProficientTestingStartTime) }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 近期经历 -->
        <td>{{ $t('table.recentExperience') }}</td>
        <td colspan="5">
          <template v-if="isEdit">
            <el-input
              type="textarea"
              size="small"
              :autosize="{ minRows: 1 }"
              v-model="form.recentExperience"
            />
          </template>
          <template v-else>
            {{ form.recentExperience }}
          </template>
        </td>
      </tr>
      <tr>
        <!-- 安全奖惩（近3年） -->
        <td>{{ $t('table.Safety/Rewards/Punishments(recent3years)') }}</td>
        <td colspan="5">
          <template v-if="isEdit">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1 }"
              size="small"
              v-model="form.incentive"
            />
          </template>
          <template v-else>
            <div class="rick-text" v-html="form.incentive" />
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
  import {
    postPilotLicenses,
    putPilotLicenses,
    getPilotcensesUserInfo,
  } from '/@/api/ftm/teacher/pilotLicenses'
  import XEUtils from 'xe-utils'
  import moment from 'moment'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        isEdit: false,
        loading: false,
        formFilter: {},
        originData: {},
        form: {
          id: '',
          fileNumber: '',
          licenseType: '',
          level: '',
          experienceStandard: '',
          experienceLevel: '',
          experienceValidityPeriod: '',
          icaolevel: '', // ICAO等级
          icaovalidityPeriod: '', // ICAO有效日期
          flightExperience: '',
          machineTime: null,
          facultyTime: null,
          currentAircraft: '',
          modelExperience: '',
          runAirline: '',
          companyPosition: '',
          hiringTime: '',
          licenseEndTime: '',
          licenseStartTime: '',
          facultyLevelEndTime: '',
          facultyLevelStartTime: '',
          fourteenProficientTestingStartTime: '',
          fourteenProficientTestingEndTime: '',
          twelveProficientTestingEndTime: '',
          twelveProficientTestingStartTime: '',
          recentExperience: '',
          incentive: '',
        },
      }
    },
    props: ['userId'],
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        this.loading = true
        const [err, res] = await to(getPilotcensesUserInfo({ id: this.userId }))
        this.loading = false
        if (!err && res.status == 200) {
          for (let key of Object.keys(this.form)) {
            if (typeof res.data[key] !== 'undefined') {
              this.form[key] = res.data[key]
            }
          }
          this.formatFormMethod(this.form, false)
          this.originData = XEUtils.clone(this.form, true)
        }
      },
      cancelEvent() {
        this.form = XEUtils.clone(this.originData, true)
        this.isEdit = false
      },
      saveEvent() {
        const params = XEUtils.clone(this.form, true)
        this.formatFormMethod(params, true)
        if (params.id) {
          this.modifyDataMethod(params)
        } else {
          this.addDataMethod(params)
        }
      },
      // 新增
      async addDataMethod(data) {
        this.loading = true
        const [err, res] = await to(
          postPilotLicenses({
            userId: this.userId,
            ...data,
          }),
        )
        this.loading = false
        this.isEdit = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.saveSuccessTip'))
          this.getData()
        }
      },
      // 修改
      async modifyDataMethod(data) {
        this.loading = true
        const [err, res] = await to(putPilotLicenses(data))
        this.loading = false
        this.isEdit = false
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.saveSuccessTip'))
          this.getData()
        }
      },
      formatFormMethod(params, decode) {
        if (decode) {
          // 解构
          try {
          } catch (e) {}
        } else {
          // 加构
          try {
          } catch (e) {}
        }
      },
      validatyMinMethod(e) {
        let t = e.target,
          value = t.value
        if (Number.isNaN(+value) || value < 0) {
          t.value = 0
        }
      },
      formatDate(val) {
        return val ? moment(val).format('YYYY-MM-DD') : ''
      },
      formatYear(val) {
        return typeof val == 'number' ? `${val}${this.$t('common.year')}` : ''
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
    .el-select,
    .el-date-editor {
      width: 100%;
    }
  }
  .rick-text {
    white-space: pre-line;
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
