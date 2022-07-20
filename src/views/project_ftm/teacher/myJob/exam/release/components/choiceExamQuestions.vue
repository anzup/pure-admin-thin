<template>
  <div class="questionBankContainer">
    <el-form ref="infoForm" inline label-width="100px" :model="infoForm" :rules="infoRules">
      <el-form-item :label="$t('table.createType')" prop="templateSelect">
        <el-radio-group v-model="infoForm.templateSelect">
          <el-radio :label="true">{{ $t('table.templateSelect') }}</el-radio>
          <el-button
            type="primary"
            :disabled="!infoForm.templateSelect"
            @click="templateDialogVisible = true"
            v-if="examType != 'SIMULATED'"
            style="margin-right: 32px"
            >{{ $t('button.templateSelect') }}</el-button
          >
          <el-radio :label="false">{{ $t('table.createManual') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <br />
      <el-form-item :label="$t('table.totalScore')" prop="totalScore">
        <el-input-number
          :controls="false"
          :min="0"
          v-model="infoForm.totalScore"
          @input="handleUpdateTable"
          :disabled="!isEdit"
        />
      </el-form-item>
      <el-form-item :label="$t('table.passScore')" prop="passScore">
        <el-input-number
          :controls="false"
          :min="0"
          v-model="infoForm.passScore"
          :disabled="!isEdit"
        />
      </el-form-item>
      <!-- <div class="right-tool" v-if="examType != 'SIMULATED'">
          <el-button type="primary" @click="templateDialogVisible = true">{{ $t('button.templateSelect') }}</el-button>
      </div> -->
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
          <el-button type="primary" size="medium" class="fl" @click="selectQb">{{
            $t('button.select')
          }}</el-button>
          <div class="question-scroll">
            <span
              class="questionBankBox"
              v-for="(item, index) in questionBankList"
              :key="item.index"
            >
              <span class="questionBank">{{ item.name }}</span>
              <el-icon @click="deleteQb(index)">
                <IconifyIconOffline icon="close" />
              </el-icon>
            </span>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('table.examContent')">
        <el-radio-group v-model="ruleForm.sameQuestion" :disabled="!isEdit">
          <el-radio :label="true">{{ $t('table.sameExamQuestion') }}</el-radio>
          <el-radio :label="false">{{ $t('table.differentExamQuestion') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('table.autoRetestTimes')">
        <el-input-number
          :controls="false"
          style="width: 187px"
          v-model="ruleForm.maxRetryCount"
          step-strictly
          controls-position="right"
          :min="0"
          :disabled="setDisabled || !isEdit"
        />
        <span style="margin-left: 10px; font-size: 12px; color: #888">{{
          $t('tip.autoRetestTip')
        }}</span>
      </el-form-item>
      <el-form-item :label="$t('table.testPaperGenerationMethod')" class="flex-column">
        <el-radio-group
          v-model="ruleForm.questionSelectType"
          @change="questionSelectTypeChange"
          :disabled="!isEdit"
        >
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
              <el-input-number
                :controls="false"
                :min="0"
                :disabled="!isEdit"
                v-if="typeof row[column.property] != 'undefined'"
                :value="row[column.property]"
                @input="handleChangeInput($event, row, column.property)"
              />
            </template>
          </vxe-grid>
        </div>
        <div class="!w-full" v-if="ruleForm.questionSelectType == 'DIFFICULTY_PERCENT'">
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
                  <el-input-number
                    :controls="false"
                    :min="0"
                    type="number"
                    :disabled="!isEdit"
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
                  <el-input-number
                    :controls="false"
                    :min="0"
                    :disabled="!isEdit"
                    v-if="typeof row[column.property] != 'undefined'"
                    :value="row[column.property]"
                    @input="handleChangeInput($event, row, column.property)"
                  />
                </template>
              </vxe-grid>
            </el-col>
          </el-row>
        </div>
        <div class="!w-full" v-if="ruleForm.questionSelectType == 'IMPORTANCE_PERCENT'">
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
                  <el-input-number
                    :controls="false"
                    :min="0"
                    type="number"
                    :disabled="!isEdit"
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
                  <el-input-number
                    :controls="false"
                    :min="0"
                    :disabled="!isEdit"
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
        <div class="!w-full" v-if="ruleForm.questionSelectType == 'CHAPTER_PERCENT'">
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
                  <el-input-number
                    :controls="false"
                    :min="0"
                    type="number"
                    :disabled="!isEdit"
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
                :disabled="!questionBankList.map((item) => item.id).join()"
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
                  <el-input-number
                    :controls="false"
                    :min="0"
                    :disabled="!isEdit"
                    v-if="typeof row[column.property] != 'undefined'"
                    :value="row[column.property]"
                    @input="handleChangeInput($event, row, column.property)"
                  />
                </template>
              </vxe-grid>
            </el-col>
          </el-row>
        </div>
        <div class="footPoint !w-full">
          <el-button type="primary" @click="postExamsEvent" v-if="ruleForm.sameQuestion">{{
            $t('button.generateExamPaper')
          }}</el-button>
          <el-button type="primary" @click="viewExamPaper" v-if="ruleForm.sameQuestion">{{
            $t('button.viewExamPaper')
          }}</el-button>
          <span type="primary" v-if="ruleForm.sameQuestion">{{
            $t('tip.choiceExamQuestionsTip')
          }}</span>
        </div>
      </el-form-item>
      <div class="footerBtn">
        <el-button @click="handleCancel" type="primary" plain>{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="lastStep">{{ $t('button.lastStep') }}</el-button>
        <el-button type="primary" class="rightBtn" @click="nexeStep">{{
          $t('button.nexeStep')
        }}</el-button>
      </div>
    </el-form>

    <questiion-bank-dialog
      v-model:dialogVisible="dialogVisible"
      :defaultSelecteRows="defaultSelecteRows"
      @questiionBankCancel="questiionBankCancel"
    />

    <exam-details-dialog
      v-model:examDetailsDialogVisible="examDetailsDialogVisible"
      :questionBankId="questionBankId"
      @examDetailsClose="examDetailsClose"
    />

    <template-dialog
      v-model:visible="templateDialogVisible"
      :loading="templateLoading"
      @checkbox="handleCheckbox"
    />

    <chapter-dialog
      v-model:dialogVisible="chapterDialogVisible"
      :questionBankIds="questionBankList.map((item) => item.id)"
      @chapterList="setchapterList"
      @close="chapterDialogVisible = false"
    />
  </div>
</template>

<script>
  // 试题选择
  import XEUtils from 'xe-utils'
  import chapterDialog from './chapterDialog.vue'
  import questiionBankDialog from './questiionBankDialog.vue'
  import examDetailsDialog from './examDetailsDialog.vue'
  import templateDialog from './templateDialog.vue'
  import { postExams, putExamsId, getpExamTemplate } from '/@/api/ftm/teacher/examCenter'
  import to from 'await-to-js'
  import { IconifyIconOffline } from '/@/components/ReIcon'
  export default {
    name: 'choiceExamQuestions',
    props: ['examsInfo', 'type', 'panelHeight'],
    data() {
      return {
        dialogVisible: false, // 选择题库
        examDetailsDialogVisible: false, //查看试卷
        questionBankId: undefined,
        defaultSelecteRows: [], // 默认选中
        ruleForm: {
          type: '',
          questionSelectType: 'QUESTION_BANK_COUNT',
          questionBankIds: [],
          difficulties: [], // 难度配置
          importances: [], // 重要配置
          chapters: [], //章节
          bankQuestionCounts: [], // 题型
          questionTypeConfigs: [],
          students: [],
          sameQuestion: true,
          maxRetryCount: 0,
        },
        questionBankList: [],
        rules: {},
        setTemplate: false,
        chapters: [],
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
          passScore: '',
          totalScore: '',
          templateSelect: true,
        },
        infoRules: {
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
        templateDialogVisible: false, // 模板选择弹窗显示
        templateLoading: false,
        // 章节
        chapterDialogVisible: false,
      }
    },
    computed: {
      validRules() {
        //    this.tableData.forEach(v => {
        //    if (!/^[0-9]+.?[0-9]*$/.test(v.totalScore)) {
        //      console.log(v.totalScore)
        //     return {
        //       totalScore: [{message: '必须为数字'}]
        //     }
        //    }
        //  })
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
        if (this.panelHeight) {
          return parseInt(this.panelHeight) - 77 - 62 - 40 - 60 - 50
        } else {
          return 'auto'
        }
      },
      leftTableCol() {
        return 18
      },
      rightTableCol() {
        return 6
      },
      examType() {
        return this.$route.query.type
      },
      setDisabled() {
        let tableData = []
        if (this.ruleForm.questionSelectType == 'QUESTION_BANK_COUNT') {
          tableData = this.tableData
        } else {
          tableData = this.tableData1
        }
        let disabled = false
        if (tableData && tableData.length) {
          tableData.forEach((item) => {
            if ((item.type == 'JUDEGE' || item.type == 'QA') && item.count) {
              disabled = true
              this.ruleForm.maxRetryCount = 0
            }
          })
        }
        return disabled
      },
      isEdit() {
        return !this.infoForm.templateSelect || this.setTemplate
      },
    },
    watch: {},
    components: {
      questiionBankDialog,
      examDetailsDialog,
      templateDialog,
      chapterDialog,
      IconifyIconOffline,
    },
    created() {
      this.tableColumnClone = XEUtils.clone(this.tableColumn, true) // 深拷贝表头
      this.tableDataClone = XEUtils.clone(this.tableData, true)
      this.tableData1Clone = XEUtils.clone(this.tableData1, true)
      this.tableData2Clone = XEUtils.clone(this.tableData2, true)
      this.tableData3Clone = XEUtils.clone(this.tableData3, true)

      if (this.examsInfo) {
        // 修改
        this.infoForm.templateSelect = false
        this.setTemplate = true
        this.setForm()
        this.init()
      } else if (sessionStorage.getItem('makeUpInfo')) {
        // 补考
        const makeUpInfo = JSON.parse(sessionStorage.getItem('makeUpInfo'))
        this.questionBankList = makeUpInfo.questionBanks
        this.infoForm.passScore = makeUpInfo.passScore
        this.infoForm.totalScore = makeUpInfo.totalScore
        if (makeUpInfo.bankQuestionCounts.length !== 0) {
          this.ruleForm.questionSelectType = 'QUESTION_BANK_COUNT'
        } else if (makeUpInfo.difficulties instanceof Array && makeUpInfo.difficulties.length > 0) {
          this.ruleForm.questionSelectType = 'DIFFICULTY_PERCENT'
        } else if (makeUpInfo.chapters instanceof Array && makeUpInfo.chapters.length > 0) {
          this.ruleForm.questionSelectType = 'CHAPTER_PERCENT'
        } else {
          this.ruleForm.questionSelectType = 'IMPORTANCE_PERCENT'
        }
        this.questiionBankCancel(this.questionBankList, makeUpInfo)
      }
    },
    methods: {
      init() {
        if (this.examsInfo.chapters && this.examsInfo.chapters.length) {
          this.ruleForm.questionSelectType = 'CHAPTER_PERCENT'
        } else if (this.examsInfo.difficulties.length !== 0) {
          this.ruleForm.questionSelectType = 'DIFFICULTY_PERCENT'
        } else if (this.examsInfo.importances.length !== 0) {
          this.ruleForm.questionSelectType = 'IMPORTANCE_PERCENT'
        } else if (this.examsInfo.questionTypeConfigs.length !== 0) {
          this.ruleForm.questionSelectType = 'QUESTION_BANK_COUNT'
        }
        this.questionBankList = this.examsInfo.questionBanks
        this.questiionBankCancel(this.questionBankList, this.examsInfo)
      },
      setForm() {
        this.infoForm.passScore = this.examsInfo.passScore
        this.infoForm.totalScore = this.examsInfo.totalScore
        this.ruleForm.sameQuestion = this.examsInfo.sameQuestion
        this.ruleForm.maxRetryCount = this.examsInfo.maxRetryCount
        this.questionBankList = this.examsInfo.questionBanks
      },
      nexeStep() {
        this.postExamsEvent('nexeStep')
      },
      lastStep() {
        this.$emit('getActive', 1)
      },
      questionSelectTypeChange() {
        this.questiionBankCancel(this.questionBankList)
      },
      questiionBankCancel(val, template) {
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
              }
              // 模板
              if (template) {
                if (template.bankQuestionCounts instanceof Array) {
                  template.bankQuestionCounts.forEach((j) => {
                    if (v.name == j.bank.name && j.type == k.type) {
                      k[`count${i}`] = j.count
                    }
                  })
                }
                if (template.questionTypeConfigs instanceof Array) {
                  template.questionTypeConfigs.forEach((j) => {
                    if (j.type == k.type) {
                      k['totalScore'] = j.totalScore
                      k['score'] = j.questionScore
                    }
                  })
                }
              }
            })
          })
        } else {
          if (!template) {
            this.questionBankList.forEach((v, i) => {
              this.tableData1.forEach((k) => {
                k['unmarkedCount'] = this.questionBankList.reduce((count, item) => {
                  let questionTypeCounts = item.questionTypeCounts
                  let targetItem = questionTypeCounts.find((v) => v.type == k.type) || {}
                  return (count += Number(targetItem.unmarkedCount || 0))
                }, 0)
              })
            })
          } else if (template) {
            this.questionBankList.forEach((v, i) => {
              this.tableData1.forEach((k) => {
                k['unmarkedCount'] = this.questionBankList.reduce((count, item) => {
                  let questionTypeCounts = item.questionTypeCounts
                  let targetItem = questionTypeCounts.find((v) => v.type == k.type) || {}
                  return (count += Number(targetItem.unmarkedCount || 0))
                }, 0)
                v.questionTypeCounts.forEach((j) => {
                  if (k.type == j.type) {
                    if (template && template.questionTypeConfigs.length !== 0) {
                      template.questionTypeConfigs.forEach((j) => {
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
                          template.difficulties.find((v) => v.difficulty == item.difficulty) || {},
                        )
                      })
                    } else if (this.ruleForm.questionSelectType == 'IMPORTANCE_PERCENT') {
                      this.tableData3.forEach((item) => {
                        item = XEUtils.merge(
                          item,
                          template.importances.find((v) => v.importance == item.importance) || {},
                        )
                      })
                    } else if (this.ruleForm.questionSelectType == 'CHAPTER_PERCENT') {
                      template.chapters.forEach((item) => {
                        item.chapterId = item.chapter.id
                        item.name = item.chapter.name
                      })
                      this.chapters = template.chapters
                    }

                    this.infoForm.totalScore = template.totalScore
                    this.infoForm.passScore = template.passScore
                    this.ruleForm.sameQuestion = template.sameQuestion
                    this.ruleForm.maxRetryCount = template.maxRetryCount
                    // this.infoForm.name =  template.name
                  }
                })
              })
            })
          }
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
        if (!row.hasOwnProperty(column.property)) {
          return false
        } else {
          for (let i in row) {
            if (i.startsWith('unmarkedCount') && row.hasOwnProperty(i)) {
              return true
            }
          }
        }
      },
      activeRowMethod1({ row }) {
        if (row.unmarkedCount == '') {
          return false
        } else {
          return true
        }
      },
      totalScoreChangeEvent({ data, row }) {
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
        } else if (this.ruleForm.questionSelectType == 'CHAPTER_PERCENT') {
          this.ruleForm.chapters = []
          this.ruleForm.bankQuestionCounts = []
        } else {
          this.ruleForm.bankQuestionCounts = []
          this.ruleForm.difficulties = []
        }
      },
      deleteQb(index) {
        this.questionBankList.splice(index, 1)
        this.defaultSelecteRows = this.questionBankList
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
      postExamsEvent(type) {
        // 组卷方式  DIFFICULTY_PERCENT, IMPORTANCE_PERCENT, QUESTION_BANK_COUNT, CHAPTER_PERCENT
        this.ruleForm.difficulties = []
        this.ruleForm.importances = []
        this.ruleForm.chapters = []
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

        const itemAttributesForm = JSON.parse(sessionStorage.getItem('itemAttributesForm'))
        const data = XEUtils.merge(this.ruleForm, itemAttributesForm, this.infoForm)
        data.startDate =
          data.examPeriod instanceof Array && data.examPeriod.length > 0 ? data.examPeriod[0] : ''
        data.endDate =
          data.examPeriod instanceof Array && data.examPeriod.length > 1 ? data.examPeriod[1] : ''
        data.ignoreNotMatch = false
        this.ruleForm.questionBankIds = XEUtils.map(this.questionBankList, (item) => item.id)
        data.type = this.type
        let promies = null
        if (this.examsInfo) {
          data.id = this.examsInfo.id
          data.students = this.examsInfo.students
          promies = putExamsId
        } else {
          if (this.questionBankId) {
            promies = putExamsId
            data.id = this.questionBankId
          } else {
            promies = postExams
          }
        }

        promies(data).then((res) => {
          if (res.status == 200) {
            if (this.examsInfo) {
              sessionStorage.setItem('examId', this.examsInfo.id)
              this.questionBankId = this.examsInfo.id
            } else {
              if (res.data) {
                sessionStorage.setItem('examId', res.data)
                this.questionBankId = res.data
              } else {
                if (!sessionStorage.getItem('examId')) {
                  sessionStorage.setItem('examId', this.questionBankId)
                }
              }
            }

            if (type == 'viewExamPaper') {
              console.log('显示')
              this.examDetailsDialogVisible = true
            } else if (type == 'nexeStep') {
              this.$emit('getActive', 3)
            } else {
              this.$message.success(this.$t('tip.testGeneratedSuccessfully'))
            }
          }
        })
      },
      examDetailsClose() {
        this.examDetailsDialogVisible = false
      },
      viewExamPaper() {
        this.postExamsEvent('viewExamPaper')
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
        this.$set(item, keyname, val)
        this.handleUpdateTable()
      },
      // 更新表格
      handleUpdateTable() {
        this.ruleForm.questionSelectType == 'QUESTION_BANK_COUNT' &&
          this.$refs.xTable &&
          this.$refs.xTable.updateData()
        this.ruleForm.questionSelectType == 'DIFFICULTY_PERCENT' &&
          this.$refs.xTable1 &&
          this.$refs.xTable2 &&
          this.$refs.xTable1.updateData() &&
          this.$refs.xTable2.updateData()
        this.ruleForm.questionSelectType == 'IMPORTANCE_PERCENT' &&
          this.$refs.xTable3 &&
          this.$refs.xTable4 &&
          this.$refs.xTable3.updateData() &&
          this.$refs.xTable4.updateData()
        this.ruleForm.questionSelectType == 'CHAPTER_PERCENT' &&
          this.$refs.xTable5 &&
          this.$refs.xTable6 &&
          this.$refs.xTable5.updateData() &&
          this.$refs.xTable6.updateData()
      },
      // 选择一条模板
      async handleCheckbox(row) {
        this.infoForm.totalScore = row.totalScore
        this.infoForm.passScore = row.passScore
        this.ruleForm.sameQuestion = row.sameQuestion
        this.ruleForm.maxRetryCount = row.maxRetryCount
        this.ruleForm.questionSelectType = row.questionSelectType
        if (row.questionBanks instanceof Array && row.questionBanks.length > 0) {
          this.questionBankList = row.questionBanks
          this.templateLoading = true
          let [err, res] = await to(getpExamTemplate({ id: row.id }))
          this.templateLoading = false
          this.setTemplate = true
          if (!err) {
            this.questionBankList = res.data.questionBanks
            this.questiionBankCancel(this.questionBankList, res.data)
          }
        }
      },
      // 选择章节获取数据
      setchapterList(data) {
        data.forEach((item) => {
          item.percent = ''
          item.chapterId = item.id
        })
        this.chapters = data
      },
    },
  }
</script>

<style scoped lang="scss">
  :deep(.el-form-item__label) {
    font-weight: bold;
  }
  .flex-column {
    :deep(.el-form-item__content) {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
    }
    :deep(table) {
      width: 100%;
    }
  }
  .questionBankBox {
    margin-left: 15px;
    margin-bottom: 10px;
    padding: 0 16px;
    height: 38px;
    line-height: 38px;
    border: 1px solid #215ebe;
    border-radius: 4px;
    position: relative;
    display: inline-block;
    color: #215ebe;
    .questionBank {
      margin-right: 16px;
      display: inline-block;
    }
    .el-icon {
      cursor: pointer;
    }
  }
  .questionBankContainer {
    overflow-y: scroll;
    .question-flex {
      .fl {
        float: left;
      }
    }
    .question-scroll {
    }
    :deep(.el-scrollbar__view) {
      height: 40px;
    }
  }
  .questionBankContainer::-webkit-scrollbar {
    width: 0 !important;
  }
  .table-box {
    height: 380px;
    overflow: auto;
  }
  .table-box-::-webkit-scrollbar {
    display: none;
  }
  :deep(.el-table--scrollable-y::-webkit-scrollbar) {
    display: none;
  }
  .footPoint {
    margin-top: 20px;
    span {
      padding-left: 10px;
    }
  }
  .right-tool {
    float: right;
    margin-left: 20px;
  }
  .chapter-select {
    position: absolute;
    top: -60px;
    right: 10px;
  }
  .el-input-number {
    width: 100%;
  }
</style>
