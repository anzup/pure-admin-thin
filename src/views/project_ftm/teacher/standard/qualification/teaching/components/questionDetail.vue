<template>
  <el-scrollbar ref="scroll" class="section" :class="{ pt: showBack }">
    <header v-if="showBack">
      <!--TODO 重构返回按钮样式-->
      <span @click="backEvent"> 返回 </span>
      <!--<BackBtn @click="backEvent"/>-->
    </header>
    <div class="itemBankConDetails">
      <div class="tabsContanier" style="margin-bottom: 25px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            :label="formatData(item.type, typeList) + '(' + (item.count || 0) + ')'"
            :name="item.type"
            v-for="item in questionTypeCounts"
            :key="item.index"
          />
        </el-tabs>
      </div>

      <div v-loading="loading" :style="{ minHeight: parentHeight }">
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
            </div>
          </div>
          <div class="subjectCon">
            <div class="subject">
              <span class="w-e-text" v-html="item.name" />
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
        <p v-if="tableData.length > 0 && pageLoading" style="text-align: center; color: #333">
          {{ this.$t('status.loading') }}
        </p>
        <p v-else-if="tableData.length >= activedCount" style="text-align: center; color: #333">
          {{ this.$t('status.loadingFinished') }}
        </p>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
  import { getQuestionBanksId, getQuestions } from '/@/api/ftm/teacher/examCenter'
  import to from 'await-to-js'
  export default {
    data() {
      return {
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
        loading: false,
        form: {
          page: 1,
          size: 100,
        },
        pageLoading: false,
      }
    },
    props: {
      questionBankId: [String, Number],
      showBack: Boolean,
    },
    computed: {
      parentHeight() {
        const minHeight = '500px'
        try {
          let parentDOM = this.$parent.$el
          let parentOffsetHeight = parentDOM
            ? parentDOM.offsetHeight -
              54 /*弹窗头部高度 */ -
              40 /*内间距距离 */ -
              65 /*tab高度和外间距距离 */ +
              'px'
            : minHeight
          return parentOffsetHeight
        } catch (e) {
          return minHeight
        }
      },
      activedCount() {
        return (
          (this.questionTypeCounts.find((item) => item.type == this.activeName) || {}).count || 0
        )
      },
      noMore() {
        return this.tableData.length >= this.activedCount
      },
    },
    watch: {
      questionBankId: {
        immediate: true,
        handler(id) {
          console.log(id, 'id')
          id && this.getQuestionBanksId()
        },
      },
    },
    mounted() {
      this.bindingScroll()
    },
    methods: {
      async getQuestionBanksId() {
        const [err, res] = await to(getQuestionBanksId({ id: this.questionBankId }))
        if (!err && res.status == 200) {
          this.questionTypeCounts = res.data.questionTypeCounts
          this.activeName = res.data.questionTypeCounts[0].type
          this.getQuestionsData()
        }
      },
      async getQuestionsData() {
        const params = {
          ...this.form,
          questionBankId: this.questionBankId,
          type: this.activeName,
        }
        this.loading = true
        const [err, res] = await to(getQuestions(params))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = this.tableData.concat(res.data.content)
        }
      },
      bindingScroll() {
        let scrollbarWrap = this.$refs.scroll.wrap
        if (scrollbarWrap) {
          scrollbarWrap.onscroll = () => {
            if (
              scrollbarWrap.scrollHeight > parseInt(this.parentHeight) &&
              scrollbarWrap.scrollTop + scrollbarWrap.offsetHeight > scrollbarWrap.scrollHeight - 50
            ) {
              this.pagingEvent()
            }
          }
        }
      },
      handleClick() {
        this.tableData = []
        this.form.page = 1
        this.getQuestionsData()
      },
      backEvent() {
        this.$emit('handleEvent', { type: 'home' })
      },
      async pagingEvent() {
        if (this.loading) return
        if (this.pageLoading) return
        if (this.noMore) return
        this.pageLoading = true
        this.form.page += 1
        this.getQuestionsData()
        this.pageLoading = false
      },
      formatData(val, arr) {
        if (!val) {
          return false
        }
        return arr.filter((v) => v.id == val)[0].name
      },
      formatOption(num) {
        return String.fromCharCode(65 + Number(num))
      },
    },
  }
</script>

<style scoped lang="scss">
  .section {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    :deep(.el-scrollbar__wrap) {
      overflow-x: hidden;
    }
    &.pt {
      padding-top: 40px;
    }
  }
  header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    z-index: 2;
    .el-button {
      margin-left: auto;
      margin-right: 0;
    }
  }
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
        padding: 0 5px;
        min-width: 28px;
        height: 28px;
        box-sizing: border-box;
        color: #fff;
        text-align: center;
        font-size: 16px;
        line-height: 28px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        background: #215ebe;
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
      font-weight: 700;
      font-size: 0;
      line-height: 24px;
      padding: 16px;
      color: #333;
      .subject {
        font-size: 14px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        >>> img {
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
    >>> img {
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
