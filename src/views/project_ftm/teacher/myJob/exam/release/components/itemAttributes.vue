<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
      <el-row :gutter="20">
        <!-- 教务员无补考 -->
        <el-col :lg="24" :sm="24" v-if="builtinRole != 'TRAINING_ADMIN'">
          <el-form-item :label="$t('table.examCategory')" prop="supplementaryType">
            <el-radio
              v-model="ruleForm.supplementaryType"
              label="FIRST_TIME"
              @change="supplementaryTypeChange"
              :disabled="modifyDisabled || isDisabled('supplementaryType')"
              >{{ $t('table.firstExam') }}</el-radio
            >
            <el-radio
              v-model="ruleForm.supplementaryType"
              label="SUPPLEMENTARY"
              @change="supplementaryTypeChange"
              :disabled="modifyDisabled || isDisabled('supplementaryType')"
              >{{ $t('table.makeUpRxam') }}</el-radio
            >
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12" v-if="ruleForm.supplementaryType == 'SUPPLEMENTARY'">
          <el-form-item :label="$t('table.makeUpExamination')" prop="previousExamId">
            补考考试
            <el-select
              style="width: 100%"
              :placeholder="$t('holder.pleaseSelect')"
              :disabled="isDisabled('previousExamId')"
              v-model="ruleForm.previousExamId"
              @change="previousExamIdChange"
            >
              <el-option
                v-for="item in makeUpList"
                :label="item.name"
                :value="item.id"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item :label="$t('table.examType')" prop="examTypeId">
            <!-- 考试类型 -->
            <el-select
              style="width: 100%"
              :placeholder="$t('holder.pleaseSelect')"
              :disabled="disabled || isDisabled('examTypeId')"
              v-model="ruleForm.examTypeId"
            >
              <el-option
                v-for="item in examTypesAll"
                :label="item.name"
                :value="item.id"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 如果是教务员出题则不需要填写考试课号 -->
        <el-col :lg="6" v-if="builtinRole !== 'TRAINING_ADMIN'" :md="8" :sm="12">
          <el-form-item :label="$t('table.examCourseNum')" prop="courseNumber">
            <el-autocomplete
              style="width: 100%"
              :fetch-suggestions="searchCourseNumber"
              :disabled="disabled || isDisabled('courseNumber')"
              :placeholder="$t('holder.pleaseEnter')"
              v-model="ruleForm.courseNumber"
              @select="selectCourseNumberEvent"
              @input="changeCourseNumberEvent"
            />
          </el-form-item>
        </el-col>
        <!-- 考试名称 -->
        <!-- 教员出题不用填写考试名称，传入考试课号 -->
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item :label="$t('table.examName')" prop="name">
            <el-input
              v-model="ruleForm.name"
              :placeholder="$t('holder.pleaseEnter')"
              :disabled="disabled || isDisabled('name')"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item :label="$t('table.examDurationMinutes')" prop="duration">
            <!-- 考试时长 -->
            <el-input
              v-model="ruleForm.duration"
              :placeholder="$t('holder.pleaseEnter')"
              :disabled="isDisabled('duration')"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item :label="$t('table.examYear')" prop="year">
            <!-- 考试年份 -->
            <el-date-picker
              v-model="ruleForm.year"
              type="year"
              :disabled="isDisabled('year')"
              :placeholder="$t('holder.pleaseSelectYear')"
              style="width: 100%"
              value-format="yyyy"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="12" :md="16" :sm="24">
          <el-form-item
            prop="endDate"
            :label="$t('table.endDate')"
            v-if="examsInfo && examsInfo.modify"
          >
            <el-date-picker
              style="width: 100%"
              type="datetime"
              :disabled="isDisabled('examPeriod')"
              v-model="ruleForm.endDate"
            />
          </el-form-item>
          <el-form-item :label="$t('table.examPeriod')" prop="examPeriod" v-else>
            <!-- 考试时段 -->
            <el-date-picker
              v-model="ruleForm.examPeriod[0]"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              :disabled="isDisabled('examPeriod')"
              :placeholder="$t('table.startDate')"
            />
            {{ $t('common.to') }}
            <el-date-picker
              v-model="ruleForm.examPeriod[1]"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              :disabled="isDisabled('examPeriod')"
              :placeholder="$t('table.endDate')"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :sm="24">
          <div style="height: 40px; line-height: 40px; font-size: 14px">
            {{ $t('table.examRules') }}
          </div>
          <!-- 考试规则 -->
          <editor
            ref="Editor"
            :content="ruleForm.regulation"
            :disabled="isDisabled('regulation')"
            @input="
              (html) => {
                ruleForm.regulation = html
              }
            "
          />
        </el-col>
      </el-row>
      <div class="footerBtn" v-if="!hideFooter">
        <el-button @click="handleCancel" type="primary" plain>{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" class="rightBtn" @click="nexeStep">{{
          $t('button.nexeStep')
        }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import editor from '/@/components/Editor/index.vue'
  import { getClazzs } from '/@/api/ftm/teacher/teachingPlan'
  import { getExams, getExamTypesAll, getExamsId, putExamsId } from '/@/api/ftm/teacher/examCenter'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  // 试题属性
  const userStore = useFtmUserStore()
  export default {
    props: {
      examsInfo: {
        type: Object,
        default: () => ({}),
      },
      type: {
        type: String,
      },
      disableds: {
        type: Array,
        default: () => [],
      },
      hideFooter: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      const validateDuration = (rule, value, callback) => {
        if (!/^[0-9]+.?[0-9]*$/.test(value)) {
          callback(new Error(this.$t('holder.mustBeANumber')))
        } else if (value < 0 || value % 1 !== 0) {
          callback(new Error(this.$t('holder.positiveInteger')))
        } else {
          callback()
        }
      }
      const validatePassScore = (rule, value, callback) => {
        if (!/^[0-9]+.?[0-9]*$/.test(value)) {
          callback(new Error(this.$t('holder.mustBeANumber')))
        } else if (value < 0 || value % 1 !== 0) {
          callback(new Error(this.$t('holder.positiveInteger')))
        } else if (Number(value) > Number(this.ruleForm.totalScore)) {
          callback(
            new Error(this.$t('holder.thePassScoreMustBeLessThanTheTotalScoreOfTheTestPaper')),
          )
        } else {
          callback()
        }
      }
      const validateEndTime = (rule, value, callback) => {
        if (new Date(value[1]).getTime() <= new Date().getTime()) {
          callback(new Error(this.$t('holder.endTimeMustBeGreaterThanCurrentTime')))
        } else if (new Date(value[1]).getTime() <= new Date(value[0]).getTime()) {
          callback(new Error(this.$t('holder.endTimeMustBeGreaterThanStartTime')))
        } else if (!value[0]) {
          callback(new Error(`${this.$t('holder.pleaseSelect')}${this.$t('table.examPeriod')}`))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          supplementaryType: 'FIRST_TIME',
          previousExamId: undefined,
          examTypeId: undefined,
          name: '',
          courseNumber: '',
          duration: '', //分钟
          startDate: '',
          endDate: '',
          passScore: null,
          totalScore: null,
          regulation: `<p>${this.$t('tip.examRules')}</p>`,
          examPeriod: [],
        },
        examTypesAll: [],
        classList: [],
        makeUpList: [], // 补考考试
        count: 0, // 次数
        disabled: false,
        modifyDisabled: false,
        rules: {
          supplementaryType: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.examCategory')}`,
              trigger: 'blur',
            },
          ],
          examTypeId: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.examType')}`,
              trigger: ['blur', 'change'],
            },
          ],
          name: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.examName')}`,
              trigger: 'blur',
            },
          ],
          courseNumber: [
            {
              required: true,
              message: this.$t('holder.pleaseEnterExamCourseNum'),
              trigger: ['blur', 'change'],
            },
          ],
          duration: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.examDurationMinutes')}`,
              trigger: 'blur',
            },
            { validator: validateDuration, trigger: 'blur' },
          ],
          examPeriod: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.examPeriod')}`,
              trigger: 'blur',
            },
            { validator: validateEndTime, trigger: 'blur' },
          ],
          regulation: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.examRules')}`,
              trigger: 'blur',
            },
          ],
          year: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.examYear')}`,
              trigger: 'blur',
            },
          ],
          endDate: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.endDate')}`,
              trigger: 'blur',
            },
          ],
        },
      }
    },
    components: {
      editor,
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
    },
    created() {
      if (this.examsInfo && Object.keys(this.examsInfo).length > 0) {
        // 修改
        this.modifyDisabled = true
        this.init()
      } else {
        if (sessionStorage.getItem('examId')) {
          // 在试题选择界面 生成试卷后 返回上一页 TODO 当前考试已经生成
          this.getExamsIdEvent()
        } else {
          // 点击下一页存储当前数据
          if (sessionStorage.getItem('itemAttributesForm')) {
            this.ruleForm = JSON.parse(sessionStorage.getItem('itemAttributesForm'))
            if (this.ruleForm.supplementaryType == 'SUPPLEMENTARY') {
              this.disabled = true
            }
          }
        }
        // 模拟考试 不存在 补考
        if (this.type == 'SIMULATED') {
          this.modifyDisabled = true
        }
      }
      this.builtinRole !== 'TRAINING_ADMIN' && this.getClazzsAll()
      this.getExamsEvent()
      this.getExamTypesAllEvent()
    },
    mounted() {},
    methods: {
      init() {
        this.ruleForm.supplementaryType = this.examsInfo.supplementaryType
        this.ruleForm.examTypeId = this.examsInfo.examType.id
        this.ruleForm.name = this.examsInfo.name
        this.ruleForm.courseNumber = this.examsInfo.courseNumber
        this.ruleForm.duration = this.examsInfo.duration
        this.ruleForm.examPeriod = [this.examsInfo.startDate, this.examsInfo.endDate]
        this.ruleForm.passScore = this.examsInfo.passScore
        this.ruleForm.totalScore = this.examsInfo.totalScore
        this.ruleForm.regulation = this.examsInfo.regulation
        this.ruleForm.endDate = this.examsInfo.modify ? this.examsInfo.endDate : ''
        this.$refs.Editor && this.$refs.Editor.setHtml(this.ruleForm.regulation)
        this.ruleForm['year'] = this.examsInfo.year + ''
        if (this.ruleForm.supplementaryType == 'SUPPLEMENTARY') {
          this.ruleForm.previousExamId = this.examsInfo?.previousExam?.id
          this.disabled = true
        }
      },
      getExamsIdEvent() {
        let id = null
        this.ruleForm.previousExamId
          ? (id = this.ruleForm.previousExamId)
          : (id = sessionStorage.getItem('examId'))
        getExamsId({ id: id }).then((res) => {
          if (res.status == 200) {
            this.ruleForm.examTypeId = res.data.examType.id
            this.ruleForm.courseNumber = res.data.courseNumber
            this.ruleForm.duration = res.data.duration
            this.ruleForm.examPeriod = [res.data.startDate, res.data.endDate]
            this.ruleForm.passScore = res.data.passScore
            this.ruleForm.totalScore = res.data.totalScore
            this.ruleForm.regulation = res.data.regulation
            this.$refs.Editor && this.$refs.Editor.setHtml(this.ruleForm.regulation)
            this.ruleForm['year'] = res.data.year + ''
            if (this.ruleForm.previousExamId) {
              // 补考
              this.ruleForm.supplementaryType = 'SUPPLEMENTARY'
              this.ruleForm.name = res.data.name + this.$t('status.makeUpTest') + this.count
              res.data.name = res.data.name + this.$t('status.makeUpTest') + this.count
              sessionStorage.setItem('makeUpInfo', JSON.stringify(res.data))
            } else {
              this.ruleForm.supplementaryType = res.data.supplementaryType
              this.ruleForm.name = res.data.name
            }
          }
        })
      },
      getClazzsAll() {
        const data = {
          statusIN: 'TRAINING',
          type: 'WET_LEASE',
          page: 1,
          size: 1000,
        }
        getClazzs(data).then((res) => {
          if (res.status == 200) {
            this.classList = res.data.content
          }
        })
      },
      getExamTypesAllEvent() {
        getExamTypesAll().then((res) => {
          if (res.status == 200) {
            this.examTypesAll = res.data
          }
        })
      },
      handleCancel() {
        sessionStorage.removeItem('examId')
        sessionStorage.removeItem('itemAttributesForm')
        sessionStorage.removeItem('makeUpInfo')
        this.$router.go(-1)
      },
      nexeStep() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (sessionStorage.getItem('examId')) {
              this.putExamsIdEvent()
            } else {
              sessionStorage.setItem('itemAttributesForm', JSON.stringify(this.ruleForm))
              this.$emit('getActive', 2)
            }
          }
        })
      },
      putExamsIdEvent() {
        this.ruleForm.id = sessionStorage.getItem('examId')
        putExamsId(this.ruleForm).then((res) => {
          if (res.status == 200) {
            this.$emit('getId', sessionStorage.getItem('examId'))
            this.$emit('getActive', 2)
          }
        })
      },
      getExamsEvent() {
        // 补考 考试list
        const data = {
          page: 1,
          size: 1000,
          type: 'FORMAL',
          allPass: false,
          showAll: true,
          // status: "FINISHED",
          supplementaryType: 'FIRST_TIME',
          onlyShowNotGraduated: true,
        }
        getExams(data).then((res) => {
          if (res.status == 200) {
            this.makeUpList = res.data.content
          }
        })
      },
      supplementaryTypeChange() {
        if (this.ruleForm.supplementaryType == 'FIRST_TIME') {
          sessionStorage.removeItem('makeUpInfo')
          this.ruleForm.previousExamId = undefined
          this.disabled = false
        } else {
          this.disabled = true
        }
        this.resetForm()
      },
      previousExamIdChange() {
        const data = {
          page: 1,
          size: 1000,
          previousExamId: this.ruleForm.previousExamId,
        }
        getExams(data).then((res) => {
          if (res.status == 200) {
            // 获取当前补考次数
            this.count = res.data.content.length + 1
            this.getExamsIdEvent()
          }
        })
      },
      resetForm() {
        this.ruleForm.examTypeId = undefined
        this.ruleForm.courseNumber = ''
        this.ruleForm.duration = ''
        this.ruleForm.examPeriod = []
        this.ruleForm.passScore = null
        this.ruleForm.totalScore = null
        this.ruleForm.regulation = `<p>${this.$t('tip.examRules')}</p>`
        this.ruleForm.name = ''
        this.ruleForm['year'] = ''
      },
      validateForm(cb) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            cb && cb(this.ruleForm)
          }
        })
      },
      // 是否禁用
      isDisabled(name) {
        // # supplementaryType 是否补考
        // # previousExamId  补考考试
        // # examTypeId 考试类型
        // # courseNumber 课号
        // # name 考试名称
        // # duration 考试时长
        // # year 考试年份
        // # examPeriod 考试时段
        // # totalScore 试卷总分
        // # passScore 及格分数
        // # regulation 考试规则
        return Boolean(this.disableds) && this.disableds.includes(name)
      },
      // 匹配课号
      searchCourseNumber(str, cb) {
        var restaurants = this.classList.map((v) => ({ value: v.courseNumber }))
        var results = str
          ? restaurants.filter(
              (item) => item.value.toLocaleLowerCase().indexOf(str.toLocaleLowerCase()) == 0,
            )
          : restaurants
        cb(results)
      },
      // 选择课号
      selectCourseNumberEvent({ value }) {
        let hasClass = this.classList.some((v) => v.courseNumber == value)
        if (hasClass) {
          // 选择课号后自动填入该课号的年份
          this.ruleForm['year'] = String(this.classList.find((v) => v.courseNumber == value).year)
          // this.ruleForm.year = String(this.classList.find(v => v.courseNumber == value).year)
        }
      },
      // 更改课号
      changeCourseNumberEvent(value) {
        this.ruleForm['name'] = value
      },
    },
  }
</script>
