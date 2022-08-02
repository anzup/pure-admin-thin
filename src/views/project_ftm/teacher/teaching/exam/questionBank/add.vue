<template>
  <div class="addQuestionBank">
    <el-steps :active="active">
      <el-step
        :class="{
          'my-el-step-1': true,
          'my-el-step-2': active != 1 && active != 2,
        }"
        :title="$t('table.questionBankInformation')"
      />
      <el-step
        :class="{
          'my-el-step-1': active == 2,
          'my-el-step-2': active != 2,
        }"
        :title="$t('table.questionManagement')"
      />
    </el-steps>

    <div class="question-form" v-if="active == 1">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="136px">
        <el-form-item :label="$t('table.questionBankName')" prop="name">
          <el-input v-model="ruleForm.name" :placeholder="$t('holder.pleaseEnter')" />
        </el-form-item>
        <el-form-item
          :label="$t('table.questionBankProperties')"
          prop="confidentialType"
          v-if="$route.query.id == 1"
        >
          <el-select
            v-model="ruleForm.confidentialType"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 100%"
          >
            <el-option
              v-for="item in confidentialList"
              :key="item.index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.modelNumber')" prop="airplaneTypes">
          <el-select
            v-model="ruleForm.airplaneTypes"
            multiple
            :multiple-limit="
              ruleForm.airplaneTypes.length == 1 && ruleForm.airplaneTypes[0] == 'any' ? 1 : 0
            "
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 100%"
            @change="handleSelectAny"
          >
            <el-option
              v-for="item in airplaneTypesAll"
              :key="item.index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.topicClassification')" prop="propertyIds">
          <el-select
            v-model="ruleForm.propertyIds"
            multiple
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 100%"
          >
            <el-option
              v-for="item in propertyList"
              :key="item.index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.remarks')">
          <el-input type="textarea" v-model="ruleForm.remark" :autosize="{ minRows: 3 }" />
        </el-form-item>
      </el-form>
    </div>
    <div class="btnBox" v-if="active == 2">
      <div style="margin-bottom: 20px; position: absolute; left: 8px">
        <el-input
          v-model="questionForm.searchKey"
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
          @click=";(questionForm.searchKey = ''), clearTable(), getQuestions()"
          >{{ $t('button.reset') }}</el-button
        >
      </div>
      <el-button type="primary" @click="addTestQuestions">{{
        $t('button.addTestQuestions')
      }}</el-button>
      <el-button type="primary" @click="importTestQuestions">{{
        $t('button.importTestQuestions')
      }}</el-button>
    </div>
    <div v-if="active == 2" class="subjectContainer">
      <ul
        class="infinite-list"
        style="overflow: auto"
        v-infinite-scroll="load"
        infinite-scroll-distance="50"
        :infinite-scroll-disabled="noMore"
      >
        <li class="subjectBox infinite-list-item" v-for="(item, index) in subjectList" :key="index">
          <div class="subjectTitle">
            <div style="display: flex; color: #333">
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
                }}{{
                  item.chapter &&
                  item.chapter.name &&
                  `${item.chapter.superior ? '/' : ''}${item.chapter.name}`
                }}</span
              >
              <span class="degree"
                >{{ $t('table.importance') }}：{{
                  formatData(item.importance, importanceList)
                }}</span
              >
            </div>
            <span class="iconBox">
              <el-icon class="editIcon" @click="modifyQuestion(item.id)">
                <Edit />
              </el-icon>
              <el-icon class="deleteIcon" @click="deleteQuestion(item.id)">
                <Delete />
              </el-icon>
            </span>
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
              <div
                :class="[
                  item.answers.length !== 0 && item.answers[0].name.search('<img') !== -1
                    ? 'ql-editor-custom'
                    : '',
                  'successOption',
                ]"
              >
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
      <div v-if="active == 1">
        <el-button @click="handleMainCancel" type="primary" plain>{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" class="rightBtn" @click="nexeStep">{{
          $t('button.nexeStep')
        }}</el-button>
      </div>
      <div v-if="active == 2">
        <el-button @click="handleMainCancel" type="primary" plain>{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" @click="handleSave">{{ $t('button.save') }}</el-button>
        <el-button type="primary" class="rightBtn" @click="lastStep">{{
          $t('button.lastStep')
        }}</el-button>
      </div>
    </div>

    <add-questions-dialog
      v-model:dialogVisible="dialogVisible"
      :questionBankId="questionBankId"
      :questionId="questionId"
      :status="dialogStatus"
      @cancel="cancel"
      @getData="addQuestions"
      @modify="editQuestions"
    />

    <!-- 导入试题 -->
    <importTestQuestions
      v-model:importTestQuestionsDialogVisible="importTestQuestionsDialogVisible"
      :questionBankId="questionBankId"
      @handleCancel="handleCancel"
      @confirm="importOver"
    />
  </div>
</template>

<script>
  import { getAirplaneTypesAll } from '/@/api/ftm/teacher/trainingPlan'
  import {
    getQuestionBankPropertiesAll,
    postQuestionBanks,
    deleteQuestionBanksId,
    getQuestions,
    getQuestionsId,
    deleteQuestionsId,
    getQuestionBanksId,
    putQuestionBanksId,
  } from '/@/api/ftm/teacher/examCenter'
  import addQuestionsDialog from './components/addQuestionsDialog.vue'
  import importTestQuestions from './components/importTestQuestions.vue'
  import { Search, Edit, Delete } from '@element-plus/icons-vue'
  export default {
    name: 'addQuestionBank',
    components: {
      Search,
      Edit,
      Delete,
      addQuestionsDialog,
      importTestQuestions,
    },
    data() {
      return {
        active: 1,
        subjectList: [],
        subjectCount: null,
        ruleForm: {
          name: '',
          airplaneTypes: [],
          confidentialType: undefined,
          propertyIds: [],
          remark: '',
          type: '',
        },
        questionForm: {
          page: 0,
          size: 100,
          questionBankId: undefined,
          type: undefined,
          searchKey: undefined,
        },
        questionBankId: undefined, // 当前题库Id
        propertyList: [],
        airplaneTypesAll: [],
        confidentialList: [
          {
            id: 'PUBLIC',
            name: this.$t('status.publicQuestionBank'),
          },
          {
            id: 'CONFIDENTIAL',
            name: this.$t('status.confidentialQuestionBank'),
          },
        ],
        dialogVisible: false,
        dialogStatus: '',
        questionId: undefined, // 当前题 id
        status: '',
        rules: {
          name: [
            {
              required: true,
              message: `${this.$t('holder.pleaseEnter')}${this.$t('table.questionBankName')}`,
              trigger: 'blur',
            },
          ],
          confidentialType: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t(
                'table.questionBankProperties',
              )}`,
              trigger: 'blur',
            },
          ],
          airplaneTypes: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.modelNumber')}`,
              trigger: 'blur',
            },
          ],
          propertyIds: [
            {
              required: true,
              message: `${this.$t('holder.pleaseSelect')}${this.$t('table.topicClassification')}`,
              trigger: 'blur',
            },
          ],
        },
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
            name: this.$t('status.lessImportant'),
          },
          {
            id: 'EASY',
            name: this.$t('status.unimportant'),
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
        importTestQuestionsDialogVisible: false,
        loading: false,
        noMore: false,
      }
    },
    created() {
      this.$route.query.id == 1 ? (this.ruleForm.type = 'PUBLIC') : (this.ruleForm.type = 'TEACHER')
      this.status = this.$route.query.status
      this.getAirplaneTypesAll()
      this.getQuestionBankPropertiesAll()
      if (this.status == 'modify') {
        this.questionBankId = this.$route.query.questionBankId
        this.questionForm.page = 1
        this.getQuestionBanksId()
      }
    },
    methods: {
      // 获取机型
      async getAirplaneTypesAll() {
        await getAirplaneTypesAll()
          .then((res) => {
            if (res.status == 200) {
              let list = res.data
              let target = list.find((v) => v.toLocaleUpperCase() == 'ANY')
              let targetIndex = list.findIndex((v) => v.toLocaleUpperCase() == 'ANY')
              if (targetIndex > -1) {
                let item = JSON.parse(JSON.stringify(list[0]))
                list[0] = target
                list[targetIndex] = item
              }
              this.airplaneTypesAll = list
            }
          })
          .catch(() => {})
      },
      // 题库性质
      async getQuestionBankPropertiesAll() {
        await getQuestionBankPropertiesAll()
          .then((res) => {
            if (res.status == 200) {
              this.propertyList = res.data
            }
          })
          .catch(() => {})
      },
      // 题库详情
      async getQuestionBanksId() {
        await getQuestionBanksId({ id: this.$route.query.questionBankId })
          .then((res) => {
            if (res.status == 200) {
              this.ruleForm.name = res.data.name
              this.ruleForm.confidentialType = res.data.confidentialType
              this.ruleForm.airplaneTypes = res.data.airplaneTypes
              this.ruleForm.propertyIds = res.data.properties.map((v) => v.id)
              this.ruleForm.remark = res.data.remark
            }
          })
          .catch(() => {})
      },
      load() {
        if ((typeof this.subjectCount == 'number' && this.subjectCount < 10) || this.loading) return
        this.questionForm.page += 1
        this.getQuestions()
      },
      nexeStep() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.status == 'add') {
              if (this.questionBankId) {
                sessionStorage.setItem('qBForm', JSON.stringify(this.ruleForm))
                this.getQuestions(() => {
                  this.active = 2
                })
              } else {
                this.postQuestionBanks(() => {
                  this.active = 2
                })
              }
              //
            } else {
              // 存本地
              sessionStorage.setItem('qBForm', JSON.stringify(this.ruleForm))
              this.getQuestions(() => {
                this.active = 2
              })
            }
          }
        })
      },
      lastStep() {
        this.active = 1
      },
      // 数字转换为ABCD
      formatOption(num) {
        if (Object.prototype.toString.call(num) === '[object Number]') {
          return String.fromCharCode(65 + Number(num))
        } else {
          var n = parseInt(num)
          if (!isNaN(n)) {
            return String.fromCharCode(65 + Number(n))
          } else {
            return num
          }
        }
      },
      postQuestionBanks(cb) {
        postQuestionBanks(this.ruleForm).then((res) => {
          if (res.status == 200) {
            this.questionBankId = res.data
            cb && cb()
          }
        })
      },
      handleMainCancel() {
        // 取消 回到list界面 && 删除新增
        if (this.status == 'add') {
          // 判断当前有无创建 有删除 没有退出
          if (this.questionBankId) {
            deleteQuestionBanksId({
              id: this.questionBankId,
            }).then((res) => {
              if (res.status == 200) {
                this.$router.back()
              }
            })
          } else {
            this.$router.go(-1)
          }
        } else {
          // 修改 直接返回
          this.$router.go(-1)
        }
      },
      handleSave() {
        // 1. 添加 直接退出 2.修改 发送请求
        if (this.status == 'add') {
          this.$router.back()
        } else {
          const data = JSON.parse(sessionStorage.getItem('qBForm'))
          data.id = this.questionBankId
          putQuestionBanksId(data).then((res) => {
            if (res.status == 200) {
              this.$router.back()
            }
          })
        }
      },
      clearTable(id) {
        if (id) {
          this.subjectList.splice(
            this.subjectList.findIndex((item) => item.id == id),
            1,
          )
        } else {
          this.subjectList = []
          this.questionForm.page = 1
          this.noMore = false
        }
      },
      async getQuestions(cb) {
        this.questionForm.questionBankId = this.questionBankId
        this.loading = true
        await getQuestions(this.questionForm)
          .then((res) => {
            this.loading = false
            if (res.status == 200) {
              if (!res.data.content || !res.data.content.length) {
                this.noMore = true
              }
              this.subjectList = this.subjectList.concat(res.data.content)
              this.subjectCount = res.data.totalElements
              this.questionForm.type = res.data.content.type
              cb && cb()
            }
          })
          .catch((err) => {
            this.loading = false
          })
      },
      addTestQuestions() {
        this.questionId = null
        this.dialogStatus = 'add'
        this.dialogVisible = true
      },
      cancel() {
        this.dialogVisible = false
        this.questionId = undefined
      },
      modifyQuestion(id) {
        this.questionId = id
        this.dialogStatus = 'edit'
        this.dialogVisible = true
      },
      deleteQuestion(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteQuestionsId({
            id: id,
          }).then((res) => {
            if (res.status == 200) {
              this.$message.success(this.$t('tip.delsuccessTip'))
              this.clearTable(id)
              // this.getQuestions()
            }
          })
        })
      },
      // 修改试题成功后回调
      async editQuestions(id) {
        await getQuestionsId({ id }).then((res) => {
          if (res.status == 200) {
            let index = this.subjectList.findIndex((item) => item.id == id)
            this.subjectList[index] = res.data
          }
        })
      },
      // 添加试题成功后回调
      async addQuestions(id) {
        console.log(this.questionForm, 'form1')
        console.log(this.subjectCount)
        if (
          (this.questionForm.page == (Math.ceil(this.subjectCount / this.questionForm.size) || 1) &&
            this.questionForm.page ==
              Math.ceil((this.subjectCount + 1) / this.questionForm.size)) ||
          this.questionForm.page > (Math.ceil(this.subjectCount / this.questionForm.size) || 1)
        ) {
          // 已翻页到最后一页且新增的数据不会添加页数
          await getQuestionsId({ id })
            .then((res) => {
              if (res.status == 200) {
                this.subjectList.push(res.data)
              }
            })
            .catch(() => {})
        } else if (
          this.questionForm.page + 1 ==
          Math.ceil(this.subjectCount + 1 / this.questionForm.size)
        ) {
          // 已翻页到最后一页且新增数据添加了一页
          console.log(this.questionForm, 'form2')
          await this.getQuestions().then().catch()
        }
        this.subjectCount++
      },
      formatData(val, arr) {
        if (!val) {
          return false
        }
        return arr.filter((v) => v.id == val)[0].name
      },
      importTestQuestions() {
        this.importTestQuestionsDialogVisible = true
      },
      handleCancel() {
        this.importTestQuestionsDialogVisible = false
      },
      importOver() {
        this.clearTable()
        this.getQuestions()
      },
      handleSelectAny(val) {
        if (val.includes('any')) {
          this.ruleForm.airplaneTypes = ['any']
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  $elButtonBg: #215ebe;
  .addQuestionBank {
    background: #fff;
    overflow: auto;
    :deep(.el-steps--horizontal) {
      padding: 6px 25% 0 25%;
    }
    :deep(.el-step__title, .el-step__title.is-process) {
      font-size: 14px;
      font-weight: 700;
      color: #333 !important;
    }
    :deep(.el-step__head.is-finish) {
      color: $elButtonBg;
      border-color: $elButtonBg;
    }
    .my-el-step-1 {
      :deep(.el-step__icon.is-text) {
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
      :deep(.el-step__icon.is-text) {
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

  .subjectContainer {
    height: calc(100% - 210px); //114 48 32 16
  }
  .infinite-list {
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .subjectContainer::-webkit-scrollbar {
    // width: 0 !important
  }

  .subjectContainer {
    -ms-overflow-style: none;
  }

  .subjectContainer {
    overflow: -moz-scrollbars-none;
  }

  .btnBox {
    display: flex;
    justify-content: flex-end;
    margin: 24px 0;
    position: relative;
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
        width: 88px;
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
          font-size: 18px;
          margin-right: 10px;
          cursor: pointer;
        }

        .deleteIcon {
          color: #d44949;
          font-size: 18px;
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
  .subjectCon :deep(img) {
    max-width: 500px;
    vertical-align: top;
  }
  .ql-editor-custom {
    // height: 200px !important;
    overflow-y: auto;
    display: inline-block;
  }
  .ql-editor-custom::-webkit-scrollbar {
    display: none;
  }
  .question-form {
    max-width: 590px;
    position: relative;
    margin: 80px auto 0;
    padding: 46px 36px 80px;
    box-shadow: 0 0 5px rgba($color: #000, $alpha: 0.1);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    &::before {
      content: '';
      position: absolute;
      top: -6px;
      left: 0;
      width: 100%;
      height: 4px;
      border-radius: 99px;
      background: #0030ac;
    }
  }

  .footerBtn {
    margin: 20px 0;
    text-align: center;
  }
</style>
