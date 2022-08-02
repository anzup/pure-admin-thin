<template>
  <div>
    <el-scrollbar>
      <!-- 模板信息 -->
      <div class="content-box">
        <div class="content-header">{{ $t('table.templateInfo') }}</div>
        <div class="content">
          <el-form :inline="true" :model="form" :rules="formRules" ref="templateForm">
            <el-form-item :label="$t('table.templateName')" required prop="name">
              <el-input
                :placeholder="$t('holder.pleaseEnter') + $t('table.questionnaireName')"
                v-model="form.name"
                style="width: 20em"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 问卷内容 -->
      <div class="content-box">
        <div class="content-header">
          {{ $t('table.questionnaireContent') }}
          <el-button type="primary" class="s-btn" @click="addClazz">
            <template #icon>
              <Plus />
            </template>
            {{ $t('button.addTo') }}{{ $t('button.classify') }}
          </el-button>
        </div>
        <div class="content">
          <div class="question-item" v-for="(clazz, iclazz) in List" :key="clazz.id">
            <!-- 问题分类 -->
            <span class="question-label">{{ $t('button.classify') }}{{ iclazz + 1 }}</span>
            <div class="question-content">
              <el-input
                class="question-input size-xl"
                v-model="clazz.name"
                :ref="`clazzify${iclazz}`"
              />
              <el-button type="primary" @click="addQuestion(clazz)">{{
                $t('table.addQuestion')
              }}</el-button>
              <el-button type="danger" @click="delClazz(clazz)">{{
                $t('table.delClassify')
              }}</el-button>
              <!-- 问题 -->
              <div
                class="question-con"
                v-for="(question, iquestion) in clazz.questions"
                :key="iquestion"
              >
                <span class="question-label mt"
                  >{{ $t('common.question') }}{{ iquestion + 1 }}</span
                >
                <div class="question-con">
                  <el-input
                    class="question-input size-m"
                    v-model="question.name"
                    :ref="`clazzify${iclazz}_question${iquestion}`"
                  />
                  <el-radio-group v-model="question.type">
                    <el-radio :label="optionsType['radio']">{{
                      $t('status.singleChoice')
                    }}</el-radio
                    ><!-- 单选 -->
                    <el-radio :label="optionsType['checkbox']">{{
                      $t('status.multipleChoice')
                    }}</el-radio
                    ><!-- 多选 -->
                    <el-radio :label="optionsType['input']">{{ $t('status.Q&A') }}</el-radio
                    ><!-- 问答 -->
                  </el-radio-group>
                  <el-icon
                    class="deleteIcon right-icon"
                    style="cursor: pointer"
                    @click="delQuestion(clazz, iquestion)"
                  >
                    <Delete />
                  </el-icon>
                  <!-- 选项 -->
                  <section v-if="question.type != optionsType['input']">
                    <div v-for="(option, optionIndex) in question.options || []" :key="optionIndex">
                      <span class="question-label"
                        >{{ $t('button.select') }}{{ optionIndex + 1 }}</span
                      >
                      <div class="question-con">
                        <el-input
                          class="question-input size-s"
                          v-model="option.name"
                          :ref="`clazzify${iclazz}_question${iquestion}_option${optionIndex}`"
                        />
                        <el-icon
                          class="deleteIcon"
                          style="cursor: pointer"
                          @click="delSelect(iclazz, iquestion, optionIndex)"
                        >
                          <Delete />
                        </el-icon>
                      </div>
                    </div>

                    <div class="question-button">
                      <el-button type="primary" @click="addSelect(question)">
                        <template #icon>
                          <Plus />
                        </template>
                        {{ $t('table.addOptions') }}</el-button
                      >
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>

    <fix-footer :loading="loading" @confirm="Save" />
  </div>
</template>

<script>
  import {
    addQuestionnairesTemplate,
    getQuestionnairesTemplate,
    infoQuestionnairesTemplate,
  } from '/@/api/ftm/teacher/education'
  import XEUtils from 'xe-utils'
  import qualificationEnum from '/@/enums/qualification.enum'
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import { Plus, Delete } from '@element-plus/icons-vue'
  import to from 'await-to-js'
  export default {
    components: {
      FixFooter,
      Plus,
      Delete,
    },
    data() {
      return {
        form: {
          name: '',
          clazzID: 0,
        },
        formRules: {
          name: [
            {
              required: true,
              message: this.$t('holder.pleaseEnter') + this.$t('table.questionnaireName'),
            },
          ],
        },
        List: [],
        loading: false,
        optionsType: qualificationEnum.optionType,
      }
    },
    created() {
      let { t_id } = this.$route.query
      if (this.type) this.getTemplateData(t_id)
    },
    computed: {
      // 操作类型 true: 修改 false: 添加
      type() {
        let { name } = this.$route
        return name == 'InfoQuestionnaireTemplate'
      },
    },
    methods: {
      // 获取模板内容
      async getTemplateData(id) {
        let [err, res] = await to(getQuestionnairesTemplate({ id }))
        if (!err) {
          let { data } = res
          this.List = data.classifications
          this.form.name = data.name
        }
      },
      // 添加分类
      addClazz() {
        this.form.clazzID += 1
        this.List.push({
          id: this.form.clazzID,
          ...XEUtils.clone(qualificationEnum.default.classify, true),
        })
      },
      // 删除分类
      delClazz(item) {
        let arr = this.List.map((v) => v.id)
        let index = arr.indexOf(item.id)
        index > -1 && this.List.splice(index, 1)
      },
      // 添加问题
      addQuestion(clazz) {
        let question = clazz.questions || []
        question.push({
          ...XEUtils.clone(qualificationEnum.default.question),
          type: this.optionsType['radio'],
          options: [
            XEUtils.clone(qualificationEnum.default.option),
            XEUtils.clone(qualificationEnum.default.option),
          ],
        })
        clazz.questions = question
      },
      // 删除问题
      delQuestion(clazz, iquestion) {
        let arr = this.List.map((v) => v.id)
        let index = arr.indexOf(clazz.id)
        this.List[index].questions.splice(iquestion, 1)
      },
      // 添加选项
      addSelect(question) {
        if (!question.options) {
          question.options = ['']
        } else {
          let options = question.options
          options.push(XEUtils.clone(qualificationEnum.default.option, true))
          question.options = options
        }
      },
      // 删除选项
      delSelect(iclazz, iquestion, iselect) {
        let options = this.List[iclazz].questions[iquestion].options
        let length = options.length
        if (length > 2) {
          options.splice(iselect, 1)
        } else {
          this.$message.closeAll()
          this.$message({
            type: 'error',
            duration: 1500,
            message: this.$t('tip.leastChooseTwo'),
          })
        }
      },
      // 校验数据
      validationData() {
        let clazzifyList = []
        let hasError = false
        const errorNotice = (val, notice, ref) => {
          if (!hasError && typeof val == 'string' && val.trim() == '') {
            this.$message({
              type: 'error',
              duration: 1500,
              message: notice,
            })
            hasError = true
            this.$refs[ref][0].focus()
          }
        }
        for (let i = 0; i < this.List.length; i++) {
          let clazzify = this.List[i]
          let valideClazzify = {
            ...clazzify,
            name: clazzify.name,
            questions: [],
          }
          let valideQuestions = []

          errorNotice(clazzify.name, this.$t('tip.unfilledCategoryName'), `clazzify${i}`)

          for (let j = 0; j < clazzify.questions.length; j++) {
            let question = clazzify.questions[j]
            valideQuestions.push({
              ...question,
              name: question.name,
              type: question.type,
              options: question.type == this.optionsType['input'] ? [] : question.options,
            })

            errorNotice(
              question.name,
              this.$t('tip.unfilledQuestions'),
              `clazzify${i}_question${j}`,
            )

            if (question.type != this.optionsType['input']) {
              for (let n = 0; n < question.options.length; n++) {
                errorNotice(
                  question.options[n],
                  this.$t('tip.unfilledOptions'),
                  `clazzify${i}_question${j}_option${n}`,
                )
              }
            }
          }
          valideClazzify.questions = valideQuestions
          clazzifyList.push(valideClazzify)
        }

        return {
          status: !hasError,
          data: clazzifyList,
        }
      },
      Back() {
        this.$router.back()
      },
      async Save() {
        let { status, data } = await this.validationData()
        this.$refs.templateForm.validate((bool) => {
          if (bool && status) {
            let params = {
              classifications: data,
              name: this.form.name,
            }
            this.submitForm(params)
          }
        })
      },
      async submitForm(params) {
        this.loading = true
        let api = this.type ? infoQuestionnairesTemplate : addQuestionnairesTemplate
        if (api) params.id = this.$route.query.t_id
        let [err] = await to(api(params))
        if (err) {
          this.loading = false
        } else {
          this.loading = false
          this.$message({
            type: 'success',
            duration: 1500,
            message: this.$t('tip.subSuccessTip'),
          })
          this.Back()
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  $borderStyle: 1px solid #ccc;
  .content-box {
    border: $borderStyle;
    margin-bottom: 20px;
    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      padding: 12px;
      font-size: 14px;
      color: #111;
      border-bottom: $borderStyle;
      background: #f1f1f1;
    }
    .content {
      padding: 20px;
    }

    .s-btn {
      padding: 0 12px;
      height: 46px;
    }
    .question-item {
      margin-bottom: 20px;
      &::after {
        content: '';
        display: block;
        clear: both;
      }
    }
    .question-input {
      margin-right: 20px;
      &.size-xl {
        width: 640px;
      }
      &.size-m {
        width: 570px;
      }
      &.size-s {
        width: 500px;
      }
    }
    .question-label {
      float: left;
      width: 70px;
      // margin-right: 20px;
      padding-left: 10px;
      font-size: 18px;
      white-space: nowrap;
      line-height: 40px;
      &.mt {
        margin: 20px 0;
      }
    }
    .question-con {
      margin-top: 20px;
      margin-left: 70px;
      overflow: hidden;
      background: #f2f2f2;
    }
    .question-button {
      margin: 20px 0;
    }
    .deleteIcon {
      display: inline-block;
      font-size: 32px;
      color: #d44949;
      vertical-align: middle;
    }
    .right-icon {
      float: right;
      margin: 10px 20px;
    }
  }
</style>
