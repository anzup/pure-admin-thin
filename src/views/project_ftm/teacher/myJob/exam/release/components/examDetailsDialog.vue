<template>
  <el-dialog
    :title="$t('table.multipleChoiceQuestionBank')"
    v-model="isShow"
    :before-close="handleClose"
    center
    width="70%"
  >
    <div class="itemBankConDetails">
      <div class="tabsContanier" style="margin-bottom: 25px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            :label="formatData(item.type, typeList) + '(' + item.questions.length + ')'"
            :name="item.type"
            v-for="item in questionTypeCounts"
            :key="item.index"
          />
        </el-tabs>
      </div>

      <div>
        <div class="subjectBox" v-for="(item, index) in tableData" :key="index">
          <div class="subjectTitle">
            <div style="display: flex; width: 100%; color: #333">
              <span class="serialNumber">{{ index + 1 }}</span>
              <span class="subjectType">{{ formatData(item.type, typeList) }}</span>
              <span class="degree"
                >{{ $t('table.difficultyOfQuestionType') }}：{{
                  formatData(item.difficulty, difficultyList)
                }}</span
              >
              <span class="degree"
                >{{ $t('table.importance') }}：{{
                  formatData(item.importance, importanceList)
                }}</span
              >
              <!-- <span class="warningBox">
                <span></span>
                <i class="el-icon-warning warningIcon"></i>
            </span> -->
            </div>
          </div>
          <div class="subjectCon">
            <div class="subject">
              <span class="w-e-text" v-html="item.name" />
              <!-- <span class="enclosure">附件></span> -->
            </div>
            <div class="options">
              <div class="option" v-for="(iItem, iIndex) in item.options" :key="iIndex">
                {{ formatOption(iIndex) }}.<span class="w-e-text" v-html="iItem.name" />
              </div>
              <div class="successOption">
                {{ $t('table.answer') }}:
                <span
                  v-if="item.type == 'FILL_BLANK' || item.type == 'QA'"
                  class="success w-e-text"
                  v-html="item.answers[0].name"
                />
                <span
                  class="success"
                  v-for="(kItem, kIndex) in item.answers"
                  :key="kIndex"
                  v-else
                  >{{ formatOption(kItem.name) }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { getExamsIdQuestions } from '/@/api/ftm/teacher/examCenter'
  export default {
    name: 'examDetailsDialog',
    props: ['examDetailsDialogVisible', 'questionBankId'],
    computed: {
      isShow: {
        get() {
          return this.examDetailsDialogVisible
        },
        set(val) {
          this.$emit('update:examDetailsDialogVisible', val)
        },
      },
    },
    data() {
      return {
        id: undefined,
        questionTypeCounts: [],
        activeName: '',
        typeList: [
          { id: 'FILL_BLANK', name: this.$t('status.completion') },
          { id: 'INDEFINITE_CHOICES', name: this.$t('status.uncertainOptions') },
          { id: 'JUDEGE', name: this.$t('status.judgmentQuestions') },
          { id: 'MULTIPLE_CHOICES', name: this.$t('status.multipleChoiceQuestions') },
          { id: 'SINGLE_CHOICE', name: this.$t('status.singleChoiceQuestions') },
          { id: 'QA', name: this.$t('status.questionAndAnswer') },
        ],
        importanceList: [
          { id: 'LESS_IMPORTANT', name: this.$t('status.lessImportant') },
          { id: 'UNIMPORTANT', name: this.$t('status.unimportant') },
          { id: 'NORMAL', name: this.$t('status.normal') },
          { id: 'IMPORTANT', name: this.$t('status.important') },
          { id: 'MOST_IMPORTANT', name: this.$t('status.mostImportant') },
        ],
        difficultyList: [
          { id: 'EASIEST', name: this.$t('status.lessImportant') },
          { id: 'EASY', name: this.$t('status.unimportant') },
          { id: 'NORMAL', name: this.$t('status.normal') },
          { id: 'HARD', name: this.$t('status.hard') },
          { id: 'HARDEST', name: this.$t('status.hardest') },
        ],
        tableData: [],
      }
    },
    created() {},
    methods: {
      formatData(val, arr) {
        if (!val) {
          return false
        }
        return arr.filter((v) => v.id == val)[0].name
      },
      // 数字转换为ABCD
      formatOption(num) {
        return String.fromCharCode(65 + Number(num))
      },
      getExamsIdQuestions() {
        console.log(this.questionBankId, 133)
        getExamsIdQuestions({ id: this.questionBankId }).then((res) => {
          if (res.status == 200) {
            this.questionTypeCounts = res.data
            if (res.data[0].length !== 0) {
              this.activeName = res.data[0].type
              this.tableData = res.data[0].questions
            }
          }
        })
      },
      handleClick(tab) {
        const data = this.questionTypeCounts.filter((v) => v.type == tab.name)
        this.tableData = data[0].questions
      },
      handleClose() {
        this.$emit('examDetailsClose')
      },
    },
    watch: {
      examDetailsDialogVisible(val) {
        if (val) {
          this.getExamsIdQuestions()
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .subjectBox {
    margin-bottom: 15px;

    .subjectTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 46px;
      background: #fafafa;
      padding: 0 16px;

      .serialNumber {
        width: 28px;
        height: 28px;
        background: #215ebe;
        color: #fff;
        text-align: center;
        font-size: 16px;
        line-height: 28px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }

      .subjectType {
        color: #333333;
        border: 1px solid #215ebe;
        min-width: 88px;
        height: 28px;
        line-height: 28px;
        padding: 0 6px;
        text-align: center;
        font-size: 14px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      .iconBox {
        float: right;

        .editIcon {
          color: #215ebe;
          font-size: 24px;
          margin-right: 10px;
          cursor: pointer;
        }

        .deleteIcon {
          color: #d44949;
          font-size: 24px;
          cursor: pointer;
        }
      }

      .degree {
        font-size: 14px;
        font-weight: bold;
        margin-left: 20px;
        line-height: 24px;
      }
    }

    .subjectCon {
      width: 100%;
      font-weight: 700; // 为什么不用flex 浮动 考虑移动端换行 第二行处于中间位置
      font-size: 0; // 为了消除span的边距
      line-height: 24px;
      padding: 16px;
      color: #333;

      .subject {
        font-size: 14px;
        // margin: 20px 0;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        :deep(img) {
          max-width: 500px;
          object-fit: cover;
        }
      }

      .enclosure {
        color: #215ebe;
        font-size: 14px;
        margin-left: 20px;
      }
    }
  }

  .options {
    :deep(img) {
      max-width: 500px;
      object-fit: cover;
    }
    .option {
      font-size: 12px;
      font-weight: 400;
      // line-height: 32px;
      display: flex;
      align-items: center;
    }

    .successOption {
      font-size: 12px;
      display: flex;
      align-items: center;
      margin-top: 10px;

      .success {
        color: #215ebe;
        padding-left: 20px;
      }
    }

    .optionSelect {
      background: #e6f7ff;
    }
  }

  .titleBox {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #333;

    div {
      width: 25%;
    }

    .title {
      font-weight: 400;
    }
  }

  .spacing {
    font-style: normal;
    display: inline-block;
    margin-right: 8px;
    margin-left: 8px;
  }

  .warningBox {
    margin-left: auto;
    display: block;
    flex: 1;
    text-align: right;
    position: relative;

    .warningIcon {
      font-size: 24px;
      cursor: pointer;
    }

    .warningIcon:hover {
      color: #d44949;
    }

    .warningRemark {
      display: inline-block;
      font-size: 12px;
      padding: 5px 6px;
      color: #d44949;
      position: absolute;
      right: 35px;
      top: 2px;
      background: rgba(212, 73, 73, 0.1);
      border-radius: 4px;
    }
  }
</style>
<style>
  .itemBankConDetails .el-tabs__header {
    padding: 0 !important;
  }
</style>
