<template>
  <div class="template-container" ref="main">
    <el-form inline label-width="100px" ref="infoForm" :rules="infoRules" :model="infoForm">
      <el-form-item :label="$t('table.templateName')" prop="name">
        <el-input v-model="infoForm.name" />
      </el-form-item>
      <el-form-item :label="$t('table.totalScore')" prop="totalScore">
        <el-input v-model="infoForm.totalScore" @input="handleUpdateTable" />
      </el-form-item>
      <el-form-item :label="$t('table.passScore')" prop="passScore">
        <el-input v-model="infoForm.passScore" />
      </el-form-item>
    </el-form>
    <el-form
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm en-sort-line"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item :label="$t('table.multipleChoiceQuestionBank')">
        <div class="question-flex">
          <el-button type="primary" @click="selectQb">{{ $t('button.select') }}</el-button>
          <el-scrollbar style="overflow-y: hidden">
            <div class="question-scroll">
              <span
                class="questionBankBox"
                v-for="(item, index) in questionBankList"
                :key="item.index"
              >
                <span class="questionBank">{{ item.name }}</span>
                <el-icon class="questionBankIncon" @click="deleteQb(index)">
                  <Close />
                </el-icon>
              </span>
            </div>
          </el-scrollbar>
        </div>
      </el-form-item>
      <el-form-item :label="$t('table.examContent')">
        <el-radio-group v-model="ruleForm.sameQuestion">
          <el-radio :label="true">{{ $t('table.sameExamQuestion') }}</el-radio>
          <el-radio :label="false">{{ $t('table.differentExamQuestion') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('table.autoRetestTimes')">
        <el-input-number
          v-model="ruleForm.maxRetryCount"
          controls-position="right"
          :min="0"
          size="small"
        />
        <span style="margin-left: 10px; font-size: 12px; color: #999">{{
          $t('tip.autoRetestTip')
        }}</span>
      </el-form-item>
      <el-form-item :label="$t('table.testPaperGenerationMethod')">
        <el-radio-group v-model="ruleForm.questionSelectType" @change="questionSelectTypeChange">
          <el-radio label="QUESTION_BANK_COUNT">{{ $t('table.questionBankCount') }}</el-radio>
          <el-radio label="CHAPTER_PERCENT">{{ $t('table.chapterCount') }}</el-radio>
          <el-radio label="DIFFICULTY_PERCENT">{{ $t('table.difficultyPercent') }}</el-radio>
          <el-radio label="IMPORTANCE_PERCENT">{{ $t('table.importancePercent') }}</el-radio>
        </el-radio-group>
        <div class="!w-full" v-if="ruleForm.questionSelectType == 'QUESTION_BANK_COUNT'">
          <vxe-grid
            size="medium"
            class="mytable-vxe-style"
            header-cell-class-name="headerCellClassName"
            row-class-name="rowClassName"
            ref="xTable"
            border
            stripe
            resizable
            show-footer
            :columns="tableColumn"
            :data="tableData"
            :max-height="tableHeight"
            :edit-rules="validRules"
            :edit-config="{ trigger: 'manual', mode: 'cell', activeMethod: activeRowMethod }"
            :footer-method="footerMethod"
          >
            <template #modify="{ column, row }">
              <el-input
                v-if="typeof row[column.property] != 'undefined'"
                :value="row[column.property]"
                @input="handleChangeInput($event, row, column.property)"
              />
            </template>
          </vxe-grid>
        </div>
        <div v-if="ruleForm.questionSelectType == 'DIFFICULTY_PERCENT'">
          <el-row :gutter="20">
            <el-col :span="leftTableCol">
              <vxe-grid
                size="medium"
                class="mytable-style"
                header-cell-class-name="headerCellClassName"
                row-class-name="rowClassName"
                ref="xTable1"
                border
                stripe
                resizable
                show-footer
                :columns="tableColumn1"
                :data="tableData1"
                :max-height="tableHeight"
                :edit-config="{ trigger: 'manual', mode: 'cell', activeMethod: activeRowMethod1 }"
                :span-method="countMethod"
                :footer-method="footerMethod"
              >
                <template #modify="{ column, row }">
                  <el-input
                    type="number"
                    v-if="typeof row[column.property] != 'undefined'"
                    :value="row[column.property]"
                    @input="handleChangeInput($event, row, column.property)"
                  />
                </template>
              </vxe-grid>
            </el-col>
            <el-col :span="rightTableCol">
              <vxe-grid
                size="medium"
                class="mytable-style"
                header-cell-class-name="headerCellClassName"
                row-class-name="rowClassName"
                border
                stripe
                resizable
                show-footer
                ref="xTable2"
                :columns="tableColumn2"
                :data="tableData2"
                :max-height="tableHeight"
                :edit-config="{ trigger: 'manual', mode: 'cell' }"
                :footer-method="footerMethod2"
              >
                <template #modify="{ column, row }">
                  <el-input
                    v-if="typeof row[column.property] != 'undefined'"
                    :value="row[column.property]"
                    @input="handleChangeInput($event, row, column.property)"
                  />
                </template>
              </vxe-grid>
            </el-col>
          </el-row>
        </div>
        <div v-if="ruleForm.questionSelectType == 'IMPORTANCE_PERCENT'">
          <el-row :gutter="20">
            <el-col :span="leftTableCol">
              <vxe-grid
                size="medium"
                class="mytable-style"
                header-cell-class-name="headerCellClassName"
                row-class-name="rowClassName"
                ref="xTable3"
                border
                stripe
                resizable
                show-footer
                :columns="tableColumn1"
                :data="tableData1"
                :max-height="tableHeight"
                :span-method="countMethod"
                :edit-config="{ trigger: 'manual', mode: 'cell', activeMethod: activeRowMethod1 }"
                :footer-method="footerMethod"
              >
                <template #modify="{ column, row }">
                  <el-input
                    type="number"
                    v-if="typeof row[column.property] != 'undefined'"
                    :value="row[column.property]"
                    @input="handleChangeInput($event, row, column.property)"
                  />
                </template>
              </vxe-grid>
            </el-col>
            <el-col :span="rightTableCol">
              <vxe-grid
                size="medium"
                class="mytable-style"
                header-cell-class-name="headerCellClassName"
                row-class-name="rowClassName"
                border
                stripe
                resizable
                show-footer
                ref="xTable4"
                :columns="tableColumn2"
                :data="tableData3"
                :max-height="tableHeight"
                :edit-config="{ trigger: 'manual', mode: 'cell' }"
                :footer-method="footerMethod2"
              >
                <template #modify="{ column, row }">
                  <el-input
                    v-if="typeof row[column.property] != 'undefined'"
                    :value="row[column.property]"
                    @input="handleChangeInput($event, row, column.property)"
                  />
                </template>
              </vxe-grid>
            </el-col>
          </el-row>
        </div>
        <!-- 按章节组卷 -->
        <div v-if="ruleForm.questionSelectType == 'CHAPTER_PERCENT'">
          <el-row :gutter="20">
            <el-col :span="leftTableCol">
              <vxe-grid
                size="medium"
                class="mytable-style"
                header-cell-class-name="headerCellClassName"
                row-class-name="rowClassName"
                ref="xTable5"
                border
                stripe
                resizable
                show-footer
                :columns="tableColumn1"
                :data="tableData1"
                :max-height="tableHeight"
                :span-method="countMethod"
                :edit-config="{ trigger: 'manual', mode: 'cell', activeMethod: activeRowMethod1 }"
                :footer-method="footerMethod"
              >
                <template #modify="{ column, row }">
                  <el-input
                    type="number"
                    v-if="typeof row[column.property] != 'undefined'"
                    :value="row[column.property]"
                    @input="handleChangeInput($event, row, column.property)"
                  />
                </template>
              </vxe-grid>
            </el-col>
            <el-col :span="rightTableCol">
              <el-button
                type="primary"
                @click="chapterDialogVisible = true"
                class="chapter-select"
                >{{ $t('table.selectChapter') }}</el-button
              >
              <vxe-grid
                size="medium"
                class="mytable-style"
                header-cell-class-name="headerCellClassName"
                row-class-name="rowClassName"
                border
                stripe
                resizable
                show-footer
                ref="xTable6"
                :columns="chaptersColumn"
                :data="chapters"
                :max-height="tableHeight"
                :edit-config="{ trigger: 'manual', mode: 'cell' }"
                :footer-method="footerMethod2"
              >
                <template #modify="{ column, row }">
                  <el-input
                    v-if="typeof row[column.property] != 'undefined'"
                    :value="row[column.property]"
                    @input="handleChangeInput($event, row, column.property)"
                  />
                </template>
              </vxe-grid>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button @click="lastStep">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" class="rightBtn" :loading="loading" @click="nexeStep">{{
          $t('button.save')
        }}</el-button>
      </el-form-item>
    </el-form>

    <questiion-bank-dialog
      :dialogVisible="dialogVisible"
      @questiionBankCancel="questiionBankCancel"
      :defaultSelecteRows="defaultSelecteRows"
    />
    <chapter-dialog
      :dialogVisible="chapterDialogVisible"
      @close="chapterDialogVisible = false"
      @chapterList="setchapterList"
      :chapterIds="chapters.map((item) => item.chapterId)"
    />
  </div>
</template>

<script>
  // 试题选择
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import questiionBankDialog from '/@/views/project_ftm/teacher/myJob/exam/release/components/questiionBankDialog.vue'
  import { postExamTemplate, putExamTemplate } from '/@/api/ftm/teacher/examCenter'
  import chapterDialog from './chapterDialog.vue'
  import { Close } from '@element-plus/icons-vue'
  export default {
    data() {
      return {
        dialogVisible: false, // 选择题库
        examDetailsDialogVisible: false, //查看试卷
        questionBankId: undefined,
        defaultSelecteRows: [], // 默认选中
        ruleForm: {
          questionSelectType: 'QUESTION_BANK_COUNT',
          questionBankIds: [],
          difficulties: [], // 难度配置
          importances: [], // 重要配置
          bankQuestionCounts: [], // 题型
          questionTypeConfigs: [],
          chapters: [], // 章节
          sameQuestion: true,
          maxRetryCount: undefined,
        },
        questionBankList: [],
        loading: false,
        rules: {},
        tableColumnClone: [],
        tableDataClone: [],
        tableData1Clone: [],
        tableData2Clone: [],
        tableData3Clone: [],
        tableColumn: [
          {
            title: this.$t('table.questionBankType'),
            field: 'type',
            formatter: this.formatType,
            minWidth: 90,
          },
          {
            title: this.$t('table.totalScore'),
            field: 'totalScore',
            editRender: { name: 'input' },
            slots: { default: 'modify' },
            minWidth: 80,
          },
          {
            title: this.$t('table.singleQuestionScore'),
            field: 'score',
            minWidth: 80,
          },
        ],
        tableData: [
          { type: 'SINGLE_CHOICE', totalScore: '', score: '' },
          { type: 'MULTIPLE_CHOICES', totalScore: '', score: '' },
          { type: 'JUDEGE', totalScore: '', score: '' },
          { type: 'QA', totalScore: '', score: '' },
          { type: 'FILL_BLANK', totalScore: '', score: '' },
          { type: 'INDEFINITE_CHOICES', totalScore: '', score: '' },
        ],
        tableColumn1: [
          {
            title: this.$t('table.questionBankType'),
            field: 'type',
            formatter: this.formatType,
            minWidth: 100,
          },
          {
            title: this.$t('table.numberOfOptionalQuestions'),
            field: 'unmarkedCount',
            minWidth: 80,
          },
          {
            title: this.$t('table.valueDistribution'),
            field: 'totalScore',
            minWidth: 100,
            editRender: { name: '$input', props: { type: 'number', min: 0 } },
            slots: { default: 'modify' },
          },
          {
            title: this.$t('table.numberOfTopics'),
            field: 'count',
            minWidth: 100,
            editRender: { name: '$input', props: { type: 'number', min: 0 } },
            slots: { default: 'modify' },
          },
          {
            title: this.$t('table.singleTopicScore'),
            field: 'score',
            minWidth: 80,
            // editRender: { name: '$input' , props: {type: 'number', min: 0},}
          },
        ],
        tableData1: [
          { type: 'SINGLE_CHOICE', totalScore: '', score: '', unmarkedCount: 0, count: '' },
          { type: 'MULTIPLE_CHOICES', totalScore: '', score: '', unmarkedCount: 0, count: '' },
          { type: 'JUDEGE', totalScore: '', score: '', unmarkedCount: 0, count: '' },
          { type: 'QA', totalScore: '', score: '', unmarkedCount: 0, count: '' },
          { type: 'FILL_BLANK', totalScore: '', score: '', unmarkedCount: 0, count: '' },
          { type: 'INDEFINITE_CHOICES', totalScore: '', score: '', unmarkedCount: 0, count: '' },
        ],
        tableColumn2: [
          {
            title: this.$t('table.questionBankType'),
            field: 'type',
            width: 100,
          },
          {
            title: this.$t('table.setPercentage'),
            field: 'percent',
            minWidth: 120,
            editRender: { name: '$input', props: { type: 'number', min: 0 } },
            slots: { default: 'modify' },
          },
        ],
        tableData2: [
          { type: this.$t('status.hardest'), percent: '', difficulty: 'HARDEST' },
          { type: this.$t('status.hard'), percent: '', difficulty: 'HARD' },
          { type: this.$t('status.normal'), percent: '', difficulty: 'NORMAL' },
          { type: this.$t('status.unimportant'), percent: '', difficulty: 'EASY' },
          { type: this.$t('status.lessImportant'), percent: '', difficulty: 'EASIEST' },
        ],
        tableData3: [
          { type: this.$t('status.mostImportant'), importance: 'MOST_IMPORTANT', percent: '' },
          { type: this.$t('status.important'), importance: 'IMPORTANT', percent: '' },
          { type: this.$t('status.normal'), importance: 'NORMAL', percent: '' },
          { type: this.$t('status.unimportant'), importance: 'LESS_IMPORTANT', percent: '' },
          { type: this.$t('status.lessImportant'), importance: 'UNIMPORTANT', percent: '' },
        ],
        infoForm: {
          name: '',
          passScore: '',
          totalScore: '',
        },
        infoRules: {
          name: [{ required: true, message: this.$t('holder.pleaseFillForm'), trigger: 'blur' }],
          passScore: [
            { required: true, message: this.$t('holder.pleaseFillForm'), trigger: 'blur' },
            {
              validator: (rule, value, cb) => {
                let total = Number(this.infoForm.totalScore)
                let pass = Number(value)
                if (Number.isNaN(pass)) {
                  cb(new Error(this.$t('holder.mustBeANumber')))
                } else if (!Number.isNaN(total) && pass > total) {
                  cb(new Error(this.$t('holder.theScoreCannotBeGreaterThanTheTotalScore')))
                } else {
                  cb()
                }
              },
              trigger: 'blur',
            },
          ],
          totalScore: [
            { required: true, message: this.$t('holder.pleaseFillForm'), trigger: 'blur' },
            {
              validator: (rule, value, cb) => {
                if (Number.isNaN(Number(value))) {
                  cb(new Error(this.$t('holder.mustBeANumber')))
                } else {
                  cb()
                }
              },
              trigger: 'blur',
            },
          ],
        },
        // 章节
        chaptersColumn: [
          {
            title: this.$t('table.questionBankType'),
            field: 'name',
            width: 100,
          },
          {
            title: this.$t('table.setPercentage'),
            field: 'percent',
            minWidth: 120,
            editRender: { name: '$input', props: { type: 'number', min: 0 } },
            slots: { default: 'modify' },
          },
        ],
        chapters: [],
        chapterDialogVisible: false,
      }
    },
    props: {
      examsInfo: {
        type: Object,
        default: () => null,
      },
    },
    computed: {
      windowWidth() {
        return window.innerWidth
      },
      validRules() {
        return {
          totalScore: [{ type: 'number', message: this.$t('holder.mustBeANumber') }],
        }
      },
      validRules1() {
        return {
          totalScore: [{ type: 'number', message: this.$t('holder.mustBeANumber') }],
          count: [{ type: 'number', message: this.$t('holder.mustBeANumber') }],
        }
      },
      tableHeight() {
        return 'auto'
      },
      leftTableCol() {
        return this.windowWidth < 769 ? 14 : 18
      },
      rightTableCol() {
        return this.windowWidth < 769 ? 10 : 6
      },
    },
    watch: {},
    components: {
      questiionBankDialog,
      chapterDialog,
      Close,
    },
    created() {
      this.tableColumnClone = XEUtils.clone(this.tableColumn, true) // 深拷贝表头
      this.tableDataClone = XEUtils.clone(this.tableData, true)
      this.tableData1Clone = XEUtils.clone(this.tableData1, true)
      this.tableData2Clone = XEUtils.clone(this.tableData2, true)
      this.tableData3Clone = XEUtils.clone(this.tableData3, true)
      if (this.examsInfo) {
        // 修改
        this.init()
      }
    },
    methods: {
      init() {
        this.ruleForm.questionSelectType = this.examsInfo.questionSelectType
        this.ruleForm.sameQuestion = this.examsInfo.sameQuestion
        this.ruleForm.maxRetryCount = this.examsInfo.maxRetryCount
        this.questionBankList = this.examsInfo.questionBanks
        this.defaultSelecteRows = this.examsInfo.questionBanks
        this.questiionBankCancel()
      },
      // 保存
      nexeStep() {
        this.$refs.infoForm.validate((bool) => {
          if (!bool) return false
          this.$refs.ruleForm.validate((b) => {
            if (b) {
              this.postExams()
            }
          })
        })
      },
      // 取消
      lastStep() {
        this.$router.back()
      },
      // 选择章节获取数据
      setchapterList(data) {
        data.forEach((item) => {
          item.percent = ''
          item.chapterId = item.id
        })
        this.chapters = data
      },
      // 提交
      async postExams(type) {
        // 组卷方式  DIFFICULTY_PERCENT, IMPORTANCE_PERCENT, QUESTION_BANK_COUNT
        this.ruleForm.difficulties = []
        this.ruleForm.importances = []
        this.ruleForm.questionTypeConfigs = []
        this.ruleForm.bankQuestionCounts = []
        if (this.ruleForm.questionSelectType == 'QUESTION_BANK_COUNT') {
          this.tableData.forEach((v, i) => {
            if (v.totalScore && v.questionCount !== 0) {
              var sum = 0 // 求和
              for (let k in v) {
                if (k.startsWith('count')) {
                  let index = k.substring('count'.length, k.length)
                  let bankId = v['bankId' + index]
                  let count = Number(v[k])
                  this.ruleForm.bankQuestionCounts.push({
                    bankId: bankId,
                    count: count,
                    type: v.type,
                  })
                  sum += Number(count) // 求当前选项和值
                }
              }
              this.ruleForm.questionTypeConfigs.push({
                type: v.type,
                questionCount: sum,
                questionScore: Number(v.totalScore) / sum,
                totalScore: Number(v.totalScore),
              })
            }
          })
        } else if (this.ruleForm.questionSelectType == 'DIFFICULTY_PERCENT') {
          this.ruleForm.bankQuestionCounts = []
          this.ruleForm.importances = []
          this.tableData2.forEach((v) => {
            this.ruleForm.difficulties.push({
              difficulty: v.difficulty,
              percent: Number(v.percent),
            })
          })
          for (let v of this.tableData1) {
            if (v.count > v.unmarkedCount) {
              return this.$message.error(this.$t('tip.chooseNumLessTotalNum'))
            }
            this.ruleForm.questionTypeConfigs.push({
              type: v.type,
              questionCount: Number(v.count),
              questionScore: Number(v.score),
              totalScore: Number(v.totalScore),
            })
          }
        } else if (this.ruleForm.questionSelectType == 'CHAPTER_PERCENT') {
          this.ruleForm.bankQuestionCounts = []
          this.ruleForm.chapters = []
          this.ruleForm.chapters = this.chapters
          for (let v of this.tableData1) {
            if (v.count > v.unmarkedCount) {
              return this.$message.error(this.$t('tip.chooseNumLessTotalNum'))
            }
            this.ruleForm.questionTypeConfigs.push({
              type: v.type,
              questionCount: Number(v.count),
              questionScore: Number(v.score),
              totalScore: Number(v.totalScore),
            })
          }
        } else {
          this.ruleForm.bankQuestionCounts = []
          this.ruleForm.difficulties = []
          this.ruleForm.importances = this.tableData3.map((v) => ({
            importance: v.importance,
            percent: Number(v.percent),
          }))
          for (let v of this.tableData1) {
            if (v.count > v.unmarkedCount) {
              return this.$message.error(this.$t('tip.chooseNumLessTotalNum'))
            }
            this.ruleForm.questionTypeConfigs.push({
              type: v.type,
              questionCount: Number(v.count),
              questionScore: Number(v.score),
              totalScore: Number(v.totalScore),
            })
          }
        }
        this.ruleForm.questionBankIds = XEUtils.map(this.questionBankList, (item) => item.id)
        let params = {
          ...this.ruleForm,
          ...this.infoForm,
        }
        this.loading = true
        let [err] = await to(
          this.examsInfo
            ? putExamTemplate({ id: this.examsInfo.id, ...params })
            : postExamTemplate(params),
        )
        this.loading = false
        if (!err) {
          this.$message({
            type: 'success',
            message: this.examsInfo ? this.$t('tip.editSuccessTip') : this.$t('tip.addsuccessTip'),
            duration: 1500,
            onClose: () => {
              this.$router.back()
            },
          })
        }
      },
      questionSelectTypeChange() {
        this.questiionBankCancel(this.questionBankList)
      },
      questiionBankCancel(val) {
        if (val) {
          this.questionBankList = val
        }
        // field值是唯一的 不能重复 每次都重新计算赋值
        this.tableColumn = XEUtils.clone(this.tableColumnClone, true)
        this.tableData = XEUtils.clone(this.tableDataClone, true)
        // this.tableData1 = XEUtils.clone(this.tableData1Clone, true)
        // this.tableData2 = XEUtils.clone(this.tableData2Clone, true)
        // this.tableData3 = XEUtils.clone(this.tableData3Clone, true)
        this.defaultSelecteRows = this.questionBankList
        if (this.ruleForm.questionSelectType == 'QUESTION_BANK_COUNT') {
          this.questionBankList.forEach((v, i) => {
            this.tableColumn.push({
              title: v.name,
              children: [
                {
                  field: `unmarkedCount${i}`,
                  title: this.$t('table.numberOfOptionalQuestions'),
                  minWidth: 80,
                },
                {
                  field: `count${i}`,
                  title: this.$t('table.numberOfMultipleChoiceQuestions'),
                  editRender: { name: 'input' },
                  slots: { default: 'modify' },
                  minWidth: 140,
                },
              ],
            })
            this.tableData.forEach((k) => {
              ;(v.questionTypeCounts || []).forEach((j, ji) => {
                if (k.type == j.type) {
                  k[`unmarkedCount${i}`] = j.unmarkedCount
                  k[`count${i}`] = 0
                  k[`bankId${i}`] = v.id
                }
              })
              // ======= 修改 赋值回显 ===========
              if (!val) {
                if (this.examsInfo && this.examsInfo.bankQuestionCounts.length !== 0) {
                  this.examsInfo.bankQuestionCounts.forEach((j) => {
                    if (v.name == j.bank.name && j.type == k.type) {
                      k[`count${i}`] = j.count
                    }
                  })
                }

                if (this.examsInfo && this.examsInfo.questionTypeConfigs.length !== 0) {
                  this.examsInfo.questionTypeConfigs.forEach((j) => {
                    if (j.type == k.type) {
                      k['totalScore'] = j.totalScore
                      k['score'] = j.questionScore
                    }
                  })
                }

                this.infoForm.totalScore = this.examsInfo.totalScore
                this.infoForm.passScore = this.examsInfo.passScore
                this.infoForm.name = this.examsInfo.name
              }
            })
          })
        } else {
          this.questionBankList.forEach((v, i) => {
            this.tableData1.forEach((k) => {
              k['unmarkedCount'] = this.questionBankList.reduce((count, item) => {
                let questionTypeCounts = item.questionTypeCounts
                let targetItem = questionTypeCounts.find((v) => v.type == k.type) || {}
                return (count += Number(targetItem.unmarkedCount || 0))
              }, 0)
              v.questionTypeCounts.forEach((j) => {
                if (k.type == j.type) {
                  // k['unmarkedCount'] += Number(j.unmarkedCount)
                  if (!val) {
                    if (this.examsInfo && this.examsInfo.questionTypeConfigs.length !== 0) {
                      this.examsInfo.questionTypeConfigs.forEach((j) => {
                        if (j.type == k.type) {
                          k['totalScore'] = j.totalScore
                          k['score'] = j.questionScore
                          k['count'] = j.questionCount
                        }
                      })
                    }

                    if (this.ruleForm.questionSelectType == 'DIFFICULTY_PERCENT') {
                      this.tableData2.forEach((item) => {
                        item = XEUtils.merge(
                          item,
                          this.examsInfo.difficulties.find(
                            (v) => v.difficulty == item.difficulty,
                          ) || {},
                        )
                      })
                    } else if (this.ruleForm.questionSelectType == 'IMPORTANCE_PERCENT') {
                      this.tableData3.forEach((item) => {
                        item = XEUtils.merge(
                          item,
                          this.examsInfo.importances.find((v) => v.importance == item.importance) ||
                            {},
                        )
                      })
                    } else if (this.ruleForm.questionSelectType == 'CHAPTER_PERCENT') {
                      let chapters = this.examsInfo.chapters
                      chapters.forEach((ii) => {
                        ii.chapterId = ii.chapter.id
                        ii.name = ii.chapter.name
                      })
                      this.chapters = chapters
                    }

                    this.infoForm.totalScore = this.examsInfo.totalScore
                    this.infoForm.passScore = this.examsInfo.passScore
                    this.infoForm.name = this.examsInfo.name
                  }
                }
              })
            })
          })
        }
        this.dialogVisible = false
      },
      footerMethod({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return this.$t('table.residualDistributionValue')
            }
            if (['totalScore'].includes(column.property)) {
              return this.infoForm.totalScore - XEUtils.sum(data, column.property)
            } else if (column.property.startsWith('unmarkedCount')) {
              return XEUtils.sum(data, column.property)
            } else if (['score'].includes(column.property)) {
              this.tableData.forEach((v) => {
                var num = 0
                for (let k in v) {
                  if (k.startsWith('count')) {
                    num += Number(v[k]) // 求当前选项和值
                  }
                }
                var score = undefined
                if (v.totalScore > 0 && num > 0) {
                  score = v.totalScore / num
                }
                v['score'] = this.keepTwoDecimalFull(score)
              })
            } else {
              return null
            }
          }),
        ]
      },
      footerMethod2({ columns, data }) {
        return [
          columns.map((column, columnIndex) => {
            if (columnIndex === 0) {
              return this.$t('table.remainingPercentage')
            }
            if (['percent'].includes(column.property)) {
              return 100 - XEUtils.sum(data, column.property)
            }
          }),
        ]
      },
      countMethod({ row, column, columnIndex, data }) {
        if (column.property == 'score' && row['totalScore'] && row['count']) {
          row['score'] = this.keepTwoDecimalFull(row['totalScore'] / row['count'])
        }
      },
      activeRowMethod({ row, rowIndex, columnIndex, column }) {
        return true
      },
      activeRowMethod1({ row }) {
        if (row.unmarkedCount == '') {
          return false
        } else {
          return true
        }
      },
      totalScoreChangeEvent({ data, row }) {
        console.log(row, data, this.tableData1)
        console.log(row.totalScore / row.count, row.totalScore, row.count)
        return (row.score = row.totalScore / row.count)
      },
      selectQb() {
        this.dialogVisible = true
        // 切换清空数据
        if (this.ruleForm.questionSelectType == 'QUESTION_BANK_COUNT') {
          this.defaultSelecteRows = this.questionBankList
        } else if (this.ruleForm.questionSelectType == 'DIFFICULTY_PERCENT') {
          this.ruleForm.importances = []
          this.ruleForm.bankQuestionCounts = []
        } else {
          this.ruleForm.bankQuestionCounts = []
          this.ruleForm.difficulties = []
        }
      },
      deleteQb(index) {
        this.questionBankList.splice(index, 1)
        this.questiionBankCancel(this.questionBankList)
      },
      formatType({ cellValue }) {
        if (cellValue == 'SINGLE_CHOICE') {
          return this.$t('status.singleChoiceQuestions')
        } else if (cellValue == 'MULTIPLE_CHOICES') {
          return this.$t('status.multipleChoiceQuestions')
        } else if (cellValue == 'JUDEGE') {
          return this.$t('status.judgmentQuestions')
        } else if (cellValue == 'QA') {
          return this.$t('status.questionAndAnswer')
        } else if (cellValue == 'FILL_BLANK') {
          return this.$t('status.completion')
        } else if (cellValue == 'INDEFINITE_CHOICES') {
          return this.$t('status.uncertainOptions')
        }
      },
      examDetailsClose() {
        this.examDetailsDialogVisible = false
      },
      handleCancel() {
        if (sessionStorage.getItem('examId')) {
          sessionStorage.removeItem('examId')
        }
        this.$router.go(-1)
      },
      keepTwoDecimalFull(num) {
        var result = parseFloat(num)
        if (isNaN(result)) {
          return ''
        }
        result = Math.round(num * 100) / 100
        var s_x = result.toString()
        var pos_decimal = s_x.indexOf('.')
        if (pos_decimal < 0) {
          pos_decimal = s_x.length
          s_x += '.'
        }
        while (s_x.length <= pos_decimal + 2) {
          s_x += '0'
        }
        return s_x
      },
      handleChangeInput(val, item, keyname) {
        item[keyname] = val
        this.handleUpdateTable()
      },
      // 手动调用更新表格计算
      handleUpdateTable() {
        this.ruleForm.questionSelectType == 'QUESTION_BANK_COUNT' && this.$refs.xTable.updateData()
        this.ruleForm.questionSelectType == 'DIFFICULTY_PERCENT' &&
          this.$refs.xTable1.updateData() &&
          this.$refs.xTable2.updateData()
        this.ruleForm.questionSelectType == 'IMPORTANCE_PERCENT' &&
          this.$refs.xTable3.updateData() &&
          this.$refs.xTable4.updateData()
        this.ruleForm.questionSelectType == 'CHAPTER_PERCENT' &&
          this.$refs.xTable5.updateData() &&
          this.$refs.xTable6.updateData()
      },
    },
  }
</script>

<style scoped lang="scss">
  .short {
    max-width: 300px;
  }
  .small-short {
    max-width: 150px;
  }
  .questionBankBox {
    padding: 0 16px;
    height: 38px;
    line-height: 38px;
    border: 1px solid #215ebe;
    border-radius: 4px;
    position: relative;
    display: inline-block;
    color: #215ebe;
    margin-left: 15px;
    .questionBank {
      margin-right: 16px;
      display: inline-block;
    }
    .questionBankIncon {
      cursor: pointer;
    }
  }
  .template-container {
    overflow-y: scroll;
    .question-flex {
      display: flex;
      align-items: center;
    }
    .question-scroll {
      display: flex;
      white-space: nowrap;
    }
    :deep(.el-scrollbar__view) {
      height: 40px;
    }
  }
  .table-box {
    height: 380px;
    overflow: auto;
  }
  .table-box-::-webkit-scrollbar {
    display: none;
  }
  :deep(.el-table--scrollable-y ::-webkit-scrollbar) {
    display: none;
  }
  .footPoint {
    margin-top: 20px;
    span {
      padding-left: 10px;
    }
  }
  .chapter-select {
    position: absolute;
    top: -60px;
    right: 10px;
  }
</style>
