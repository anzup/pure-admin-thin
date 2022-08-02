<template>
  <div class="fromContiner itemBankConDetails">
    <div style="margin-bottom: 20px">
      <el-input
        v-model="form.searchKey"
        :placeholder="$t('holder.PleaseEnterYourSearchKeyword')"
        size="medium"
        style="width: 350px"
      />
      <el-button
        type="primary"
        size="medium"
        style="width: 36px; padding: 10px 0; margin-left: 10px"
        @click="clearTable(), getQuestions()"
      >
        <template #icon>
          <Search />
        </template>
      </el-button>
      <el-button
        type="primary"
        size="medium"
        @click=";(form.searchKey = ''), clearTable(), getQuestions()"
        >{{ $t('button.reset') }}</el-button
      >
      <el-button type="primary" size="medium" @click="statisticsDetail()" class="statistics">{{
        $t('table.statisticsDetail')
      }}</el-button>
    </div>
    <div class="tabsContanier" style="margin-bottom: 25px">
      <div class="titleBox">
        <div>
          <span>{{ $t('table.itemBankTitle') }}: </span
          ><span class="title">{{ questionBanksInfo.name }}</span>
        </div>
        <div>
          <span>{{ $t('table.topicClassification') }}: </span>
          <span
            class="title"
            v-for="(item, index) in questionBanksInfo.properties"
            :key="item.index"
          >
            {{ item.name }}
            <i v-if="index < questionBanksInfo.properties.length - 1" class="spacing">|</i>
          </span>
        </div>
        <div>
          <span>{{ $t('table.itemBankProperties') }}: </span
          ><span class="title">
            {{
              questionBanksInfo.type == 'PUBLIC'
                ? $t('table.publicQuestionBank')
                : $t('table.teacherQuestionBank')
            }}
          </span>
        </div>
        <div>
          <span>{{ $t('table.remarks') }}: </span
          ><span class="title">{{ questionBanksInfo.remark }}</span>
        </div>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="formatData(item.type, typeList) + '(' + item.count + ')'"
          :name="item.type"
          v-for="item in questionTypeCounts"
          :key="item.index"
        />
      </el-tabs>
    </div>
    <div class="subjectContainer">
      <ul
        class="infinite-list"
        style="overflow: auto"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="noMore"
      >
        <li class="subjectBox infinite-list-item" v-for="(item, index) in tableData" :key="index">
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
                >{{ $t('table.belongToChapter') }}：{{
                  item.chapter && item.chapter.superior && item.chapter.superior.name
                }}{{ item.chapter && item.chapter.name && `/${item.chapter.name}` }}</span
              >
              <span class="degree"
                >{{ $t('table.importance') }}：{{
                  formatData(item.importance, importanceList)
                }}</span
              >
              <span class="warningBox">
                <span class="warningRemark" v-show="item.markedShow && !item.marked">{{
                  $t('holder.errorFlag')
                }}</span>
                <span class="warningRemark" v-show="item.markedShow && item.marked">{{
                  $t('holder.cancelErrorFlag')
                }}</span>
                <el-icon
                  class="warningIcon"
                  @mouseenter="enters(index)"
                  @mouseleave="leaver(index)"
                  @click="putQuestionsId(item.id, item.marked, item)"
                  :style="{ color: item.marked ? '#D44949' : '' }"
                >
                  <Warning />
                </el-icon>
              </span>
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
        </li>
      </ul>
      <p v-if="loading" style="text-align: center; color: #333">{{ this.$t('status.loading') }}</p>
      <p v-if="noMore" style="text-align: center; color: #333">
        {{ this.$t('status.loadingFinished') }}
      </p>
    </div>
    <div class="footerBtn">
      <el-button @click="handleCancel" class="rightBtn" type="primary" plain>{{
        $t('button.cancel')
      }}</el-button>
    </div>

    <statisticsDialog @close="dialogClose" v-model:visible="statisticsDetailVisible" />
  </div>
</template>

<script>
  import { getQuestionBanksId, getQuestions, putQuestionsId } from '/@/api/ftm/teacher/examCenter'
  import statisticsDialog from './components/statisticsDialog.vue'
  import { Search, Warning } from '@element-plus/icons-vue'
  export default {
    name: 'ItemBankConDetails',
    components: {
      Search,
      Warning,
      statisticsDialog,
    },
    data() {
      return {
        id: undefined,
        questionBanksInfo: {
          name: '',
          properties: [],
          type: '',
          remark: '',
        },
        questionTypeCounts: [],
        activeName: '',
        typeList: [
          {
            id: 'FILL_BLANK',
            name: this.$t('status.completion'),
          },
          {
            id: 'INDEFINITE_CHOICES',
            name: this.$t('status.uncertainOptions'),
          },
          {
            id: 'JUDEGE',
            name: this.$t('status.judgmentQuestions'),
          },
          {
            id: 'MULTIPLE_CHOICES',
            name: this.$t('status.multipleChoiceQuestions'),
          },
          {
            id: 'SINGLE_CHOICE',
            name: this.$t('status.singleChoiceQuestions'),
          },
          {
            id: 'QA',
            name: this.$t('status.questionAndAnswer'),
          },
        ],
        importanceList: [
          {
            id: 'LESS_IMPORTANT',
            name: this.$t('status.lessImportant'),
          },
          {
            id: 'UNIMPORTANT',
            name: this.$t('status.unimportant'),
          },
          {
            id: 'NORMAL',
            name: this.$t('status.normal'),
          },
          {
            id: 'IMPORTANT',
            name: this.$t('status.important'),
          },
          {
            id: 'MOST_IMPORTANT',
            name: this.$t('status.mostImportant'),
          },
        ],
        difficultyList: [
          {
            id: 'EASIEST',
            name: this.$t('status.veryEasy'),
          },
          {
            id: 'EASY',
            name: this.$t('status.simple'),
          },
          {
            id: 'NORMAL',
            name: this.$t('status.normal'),
          },
          {
            id: 'HARD',
            name: this.$t('status.hard'),
          },
          {
            id: 'HARDEST',
            name: this.$t('status.hardest'),
          },
        ],
        tableData: [],
        form: {
          page: 1,
          size: 100,
          questionBankId: undefined,
          type: '',
          searchKey: '',
        },
        type: '',
        statisticsDetailVisible: false,
        loading: false,
        noMore: false,
      }
    },
    created() {
      this.form.questionBankId = this.$route.query.id
      this.getQuestionBanksId()
    },
    methods: {
      load() {
        if (this.loading) return
        if (this.tableData.length < 100) return
        this.form.page += 1
        this.getQuestions()
      },
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
      getQuestionBanksId() {
        getQuestionBanksId({
          id: this.form.questionBankId,
        }).then((res) => {
          if (res.status == 200) {
            this.questionBanksInfo = res.data
            this.questionTypeCounts = res.data.questionTypeCounts
            if (res.data.questionTypeCounts.length !== 0) {
              this.activeName = res.data.questionTypeCounts[0].type
              this.form.type = res.data.questionTypeCounts[0].type
            }
            this.getQuestions()
          }
        })
      },
      putQuestionsId(id, marked, itemData) {
        const data = {
          id: id,
          marked: !marked,
        }
        putQuestionsId(data).then((res) => {
          if (res.status == 200) {
            this.type = itemData.type
            let index = this.tableData.findIndex((v) => v.id == id)
            index > -1 && (this.tableData[index].marked = !marked)
            // this.getQuestionBanksId()
          }
        })
      },
      handleClick(tab) {
        this.form.type = tab.name
        this.clearTable()
        this.getQuestions()
      },
      clearTable() {
        this.tableData = []
        this.form.page = 1
        this.noMore = false
      },
      getQuestions() {
        this.loading = true
        getQuestions(this.form)
          .then((res) => {
            this.loading = false
            if (res.status == 200) {
              if (!res.data.content || !res.data.content.length) {
                this.noMore = true
              }
              this.tableData = this.tableData.concat(res.data.content)
            }
          })
          .catch((err) => {
            this.loading = false
          })
      },
      statisticsDetail() {
        this.statisticsDetailVisible = true
      },
      dialogClose() {
        this.statisticsDetailVisible = false
      },
      enters(index) {
        this.tableData[index].markedShow = true
      },
      leaver(index) {
        this.tableData[index].markedShow = false
      },
      handleCancel() {
        this.$router.go(-1)
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
        min-width: 28px;
        height: 28px;
        background: #215ebe;
        color: #fff;
        text-align: center;
        font-size: 16px;
        line-height: 28px;
        padding: 0 5px;
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
          max-width: 500px !important;
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
      max-width: 500px !important;
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
    height: 54px;
    padding: 0 16px;
    line-height: 54px;
    color: #333;
    background: #dee7f5;

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
  .statistics {
    position: absolute;
    right: 32px;
  }
  .subjectContainer {
    height: calc(100vh - 102px - 60px - 54px - 32px - 36px - 40px - 40px - 50px);
    // overflow: auto;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  .infinite-list {
    height: 100%;
    padding: 0;
    margin: 0;
  }
  .itemBankConDetails .el-tabs__header {
    padding: 0 !important;
  }
  .footerBtn {
    text-align: center;
  }
</style>
