<template>
  <div class="examManageDetails">
    <el-steps :active="active">
      <el-step
        :class="{
          'my-el-step-1': true,
          'my-el-step-2': active != 1 && active != 2,
        }"
        :title="$t('table.examinationQuestions')"
      />
      <el-step
        :class="{
          'my-el-step-1': active == 2,
          'my-el-step-2': active != 2,
        }"
        :title="$t('table.examineeManagement')"
      />
    </el-steps>
    <div style="margin-top: 20px" v-if="active == 1" class="warp-content-table">
      <table class="info-table-box" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td>{{ $t('table.examType') }}</td>
          <td>{{ examsInfo.examType.name }}</td>
          <td>{{ $t('table.examName') }}</td>
          <td>{{ examsInfo.name }}</td>
          <td>{{ $t('table.examPeriod') }}</td>
          <td>{{ formatDate(examsInfo.startDate) }} - {{ formatDate(examsInfo.endDate) }}</td>
        </tr>
        <tr>
          <td>{{ $t('table.examDurationMinutes') }}</td>
          <td>{{ examsInfo.duration }}</td>
          <td>{{ $t('table.passScore') }}</td>
          <td>{{ examsInfo.passScore }}</td>
          <td>{{ $t('table.examPaperToTalScore') }}</td>
          <td>{{ examsInfo.totalScore }}</td>
        </tr>
        <tr>
          <td>{{ $t('table.multipleChoiceQuestionBank') }}</td>
          <td>
            <span v-for="item in examsInfo.questionBanks" :key="item.index">
              {{ item.name }}
            </span>
          </td>
          <td>{{ this.$t('table.examContent') }}</td>
          <td>
            {{
              examsInfo.sameQuestion
                ? this.$t('table.sameExamQuestion')
                : $t('table.differentExamQuestion')
            }}
          </td>
          <td>{{ this.$t('table.autoRetestTimes') }}</td>
          <td>{{ examsInfo.maxRetryCount }}</td>
        </tr>
      </table>
      <el-form :model="examsInfo" ref="ruleForm" class="ruleForm">
        <el-row :gutter="20">
          <el-col :lg="24">
            <el-form-item :label="$t('table.examRules') + ':'" prop="regulation">
              <div v-html="examsInfo.regulation" class="ql-editor w-e-text" />
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-form-item :label="$t('table.choiceOfTestQuestions') + ':'" prop="name" />
            <vxe-grid
              size="medium"
              class="mytable-vxe-style"
              header-cell-class-name="headerCellClassName"
              row-class-name="rowClassName"
              border
              stripe
              resizable
              height="250px"
              :columns="tableColumn"
              :data="tableData"
            />
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="active == 2" style="margin-top: 20px">
      <vxe-table
        border
        size="medium"
        class="mytable-style"
        header-cell-class-name="headerCellClassName"
        row-class-name="rowClassName"
        ref="xTable"
        :data="examsInfo.students"
      >
        <vxe-table-column type="seq" width="60" :title="$t('common.serialNumber')" />
        <vxe-table-column field="name" :title="$t('table.name')" />
        <vxe-table-column field="gender" :title="$t('table.gender')" :formatter="formatGender" />
        <vxe-table-column field="phone" :title="$t('table.cellPhoneNumber')" />
        <vxe-table-column field="idNumber" :title="$t('table.idNumber')" />
        <vxe-table-column field="courseNumber" :title="$t('table.courseNumber')" />
        <vxe-table-column
          field="type"
          :title="$t('table.examIdentity')"
          :formatter="formatExamType"
        />
      </vxe-table>
    </div>
    <div class="footerBtn">
      <div v-if="active == 1">
        <el-button type="primary" class="rightBtn" @click="nexeStep" size="medium">{{
          $t('button.nexeStep')
        }}</el-button>
      </div>
      <div v-if="active == 2">
        <el-button @click="handleCancel" type="primary" plain size="medium">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" size="medium" class="rightBtn" @click="lastStep">{{
          $t('button.lastStep')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { getExamsId } from '/@/api/ftm/teacher/examCenter'
  import XEUtils from 'xe-utils'
  export default {
    name: 'examManageDetails',
    data() {
      return {
        active: 1,
        id: undefined,
        examsInfo: {
          examType: { name: '' },
          name: '',
          startDate: '',
          endDate: '',
          duration: '',
          passScore: '',
          totalScore: '',
          questionBanks: [],
          students: [],
          regulation: '',
        },
        tableColumn: [
          {
            title: this.$t('table.questionBankType'),
            field: 'type',
            formatter: this.formatType,
          },
          {
            title: this.$t('table.totalScore'),
            field: 'totalScore',
          },
          {
            title: this.$t('table.singleQuestionScore'),
            field: 'score',
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
      }
    },
    created() {
      this.id = this.$route.query.id
      this.getExamsId()
    },
    components: {},
    methods: {
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
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
      formatGender({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      formatExamType({ cellValue }) {
        return cellValue == 'SYSTEM'
          ? this.$t('status.systemCandidates')
          : this.$t('status.temporaryCandidates')
      },
      getExamsId() {
        getExamsId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            this.examsInfo = res.data
            this.examsInfo.regulation = res.data.regulation
            console.log(this.examsInfo)
            // if (res.data.bankQuestionCounts.length !== 0 || true) {
            // this.examsInfo.questionSelectType = 'QUESTION_BANK_COUNT'
            // 组装表头
            res.data.questionBanks.forEach((k, ki) => {
              this.tableColumn.push({
                title: k.name,
                field: `count${ki}`,
                id: k.id,
              })

              // 组装选项
              this.tableData.forEach((v, vi) => {
                k.questionTypeCounts.forEach((j) => {
                  if (v.type == j.type) {
                    v[`count${ki}`] = j.count
                  }
                })
              })
            })

            res.data.questionTypeConfigs.forEach((v) => {
              this.tableData.forEach((k) => {
                if (k.type == v.type) {
                  k.totalScore = v.totalScore
                  k.score = v.questionScore
                }
              })
            })
            // } else if(data.difficulties instanceof Array && data.difficulties.length > 0){
            //   this.examsInfo.questionSelectType = 'DIFFICULTY_PERCENT'
            // }else if(data.chapters instanceof Array && data.chapters.length > 0){
            //   this.examsInfo.questionSelectType = 'CHAPTER_PERCENT'
            // }else{
            //   this.examsInfo.questionSelectType = 'IMPORTANCE_PERCENT'
            // }
          }
        })
      },
      nexeStep() {
        this.active = 2
      },
      lastStep() {
        this.active = 1
      },
      handleCancel() {
        this.$router.go(-1)
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '/@/style/table.scss';
  .examManageDetails {
    background: #fff;
    height: calc(var(--contentHeight) - 60px - 20px - 12px);
    padding: 16px;
    padding-bottom: 0;
    margin: 16px;
    margin-bottom: 0;
    overflow: auto;
    .ql-editor {
      padding: 6px 0;
      line-height: 30px;
    }
    .el-form-item {
      margin: 16px 0 10px 0;
    }
    .ruleForm {
      margin-bottom: 16px;
      :deep(.el-form-item__label) {
        text-align: left;
      }
    }
  }
  .examManageDetails::-webkit-scrollbar {
    display: none;
  }
</style>
<style lang="scss" scoped>
  $elButtonBg: #215ebe;
  .examManageDetails {
    .el-steps--horizontal {
      padding: 6px 30% 0 30%;
    }
    .el-step__title,
    .el-step__title.is-process {
      font-size: 14px;
      font-weight: 700;
      color: #333 !important;
    }
    .el-step__head.is-finish {
      color: $elButtonBg;
      border-color: $elButtonBg;
    }
    .my-el-step-1 {
      .el-step__icon.is-text {
        color: #fff;
        width: 35px; // 24px
        height: 35px;
        left: -6px;
        top: -6px;
        border: none;
        background: url('/@/assets/ftm/icon/exam_icon1.png') 100% 100%;
      }
    }
    .my-el-step-2 {
      .el-step__icon.is-text {
        color: #fff;
        width: 35px; // 24px
        height: 35px;
        left: -6px;
        top: -6px;
        border: none;
        background: url('/@/assets/ftm/icon/exam_icon2.png') 100% 100%;
      }
    }
  }
  .footerBtn {
    margin-top: 20px;
  }
</style>
