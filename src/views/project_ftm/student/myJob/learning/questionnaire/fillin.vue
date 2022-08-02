<template>
  <el-scrollbar>
    <div class="container" v-loading="loading">
      <div class="questionnair-table">
        <div class="questionnair-table-head">
          <h2 class="questionnair-title">{{ questionName }}</h2>
        </div>
        <section class="questionnair-table-content">
          <aside class="questionnair-class" v-for="(clazz, item) in questionClazz" :key="item">
            <h2 class="questionnair-class-title">
              <span>{{ clazz.name }}</span>
            </h2>
            <ul class="questionnair-list">
              <li
                class="questionnair-item"
                v-for="(question, questionSeq) in clazz.questions || []"
                :key="question.id"
              >
                <h3 class="questionnair-item-title">
                  <span class="seq">{{ questionSeq + 1 }}.</span>{{ question.name }}
                </h3>
                <!-- 选择 -->
                <div
                  class="questionnair-item-answer"
                  v-if="
                    question.type == 'MULTIPLE_SELECTION' || question.type == 'SINGLE_SELECTION'
                  "
                >
                  <div v-for="(option, index) in question.options || []" :key="index">
                    <label class="questionnair-item-checkbox">
                      <i
                        class="icon-checked"
                        v-if="question.answer instanceof Array && question.answer.includes(option)"
                      />
                      <i class="icon-unchecked" v-else />
                      <input
                        v-if="question.type == 'MULTIPLE_SELECTION'"
                        type="checkbox"
                        :checked="
                          question.answer instanceof Array && question.answer.includes(option)
                        "
                        @change="handleChangeCheckbox(question.answer, option)"
                      />
                      <input
                        v-else
                        type="checkbox"
                        :checked="
                          question.answer instanceof Array && question.answer.includes(option)
                        "
                        @change="handleChangeRadio(question.answer, option)"
                      />
                      <span>{{ option }}</span>
                    </label>
                  </div>
                </div>
                <!-- 填空 -->
                <div class="questionnair-item-answer" v-else>
                  <el-input
                    type="textarea"
                    class="questionnair-item-textarea"
                    :autosize="{ minRows: 3 }"
                    :placeholder="$t('tip.pleaseEnterContent')"
                    v-model="question.answer"
                  />
                </div>
              </li>
            </ul>
          </aside>
        </section>
      </div>
      <div class="questionnair-footer">
        <el-button
          type="primary"
          class="questionnair-submit-button"
          :loading="submitLoading"
          :disabled="submitDisabled"
          @click="submitFill"
          >{{ $t('button.submit') }}</el-button
        >
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
  import to from 'await-to-js'
  import { getDetailQrecord, putQrecord } from '/@/api/ftm/student/teachingCenter'
  export default {
    data() {
      return {
        loading: false,
        submitLoading: false,
        submitDisabled: false,
        questionClazz: [], // 大类
        questionName: '', // 问卷名
      }
    },
    computed: {
      id() {
        return this.$route.query.id
      },
      recordId() {
        return this.$route.query.recordId
      },
    },
    created() {
      this.getQuestionnairesInfo()
    },
    methods: {
      // 试卷信息
      async getQuestionnairesInfo() {
        this.loading = true
        let [err, res] = await to(getDetailQrecord({ questionnaireId: this.id }))
        this.loading = false
        if (!err) {
          this.questionName = res.data.questionnaire.name
          this.questionClazz = res.data.classifications.map((clazz) => {
            clazz.questions.map((question) => {
              if (
                !Array.isArray(question.answer) &&
                (question.type == 'MULTIPLE_SELECTION' || question.type == 'SINGLE_SELECTION')
              ) {
                question.answer = []
              } else if (question.type == 'FILL' && typeof question.answer != 'string') {
                question.answer = ''
              }
              return question
            })
            return clazz
          })
        }
      },
      // 多选
      handleChangeCheckbox(checkedList, originValue) {
        if (Array.isArray(checkedList) && checkedList.includes(originValue)) {
          let index = checkedList.indexOf(originValue)
          checkedList.splice(index, 1)
        } else {
          Array.isArray(checkedList) ? checkedList.push(originValue) : (checkedList = [originValue])
        }
      },
      // 单选切换
      handleChangeRadio(radioList, value) {
        this.$set(radioList, 0, value)
      },
      // 提交问卷
      async submitFill() {
        let valide = false
        let that = this
        let params = {
          id: this.recordId,
          classifications: this.questionClazz.map((classify) => ({
            id: classify.id,
            questions: classify.questions.map((question) => {
              if (
                (question.type == 'MULTIPLE_SELECTION' || question.type == 'SINGLE_SELECTION') &&
                question.answer.length < 1
              ) {
                valide = true
              } else if (question.type == 'FILL' && question.answer.trim() == '') {
                valide = true
              }
              return {
                id: question.id,
                answer:
                  question.answer instanceof Array
                    ? question.answer
                        .map((v, i) => v && i)
                        .filter((v) => typeof v != 'boolean')
                        .map((v) => that.formatIndex(v))
                        .join('')
                    : question.answer,
              }
            }),
          })),
        }
        if (valide) return this.$message.error(this.$t('tip.pleaseFinishSelect'))
        this.submitLoading = true
        let [err] = await to(putQrecord(params))
        this.submitLoading = false
        if (!err) {
          this.$message.success(this.$t('tip.subSuccessTip'))
          this.submitDisabled = true
          setTimeout(() => {
            this.$router.back()
          }, 1000)
        }
      },
      // 数字转字母
      formatIndex(num) {
        return String.fromCharCode(parseInt(num) + 65)
      },
    },
  }
</script>

<style scoped lang="scss">
  h1,
  h2,
  h3,
  h4,
  h5,
  p {
    margin: 0;
  }
  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .questionnair {
    $border: 1px solid #e8e8e8;
    $color-blue: #1253ba;
    &-table {
      margin: 40px 38px;
      border: $border;
    }
    &-table-head {
      width: 100%;
      height: 56px;
      border-bottom: $border;
    }
    &-title {
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      line-height: 56px;
      color: #161616;
    }
    &-class {
      padding: 0 26px;
      border-bottom: $border;
      &:last-of-type(1) {
        border: 0;
      }
    }
    &-class-title {
      display: block;
      height: 26px;
      margin: 26px 0;
      & > span {
        position: relative;
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        color: #161616;
        line-height: 26px;
        &::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 100%;
          height: 3px;
          background: $color-blue;
        }
      }
    }
    &-item {
      padding-bottom: 20px;
    }
    &-item-title {
      font-size: 16px;
      color: #161616;
      line-height: 26px;
      .seq {
        color: $color-blue;
      }
    }
    &-item-list {
      margin: 10px 0;
    }
    &-item-checkbox {
      display: inline-block;
      font-size: 16px;
      line-height: 36px;
      cursor: pointer;
      user-select: none;
      i[class^='icon'] {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 10px;
        border-width: 1px;
        border-style: solid;
        border-radius: 99px;
        &::after {
          content: '';
          box-sizing: content-box;
          border: 1px solid #fff;
          border-left: 0;
          border-top: 0;
          height: 6px;
          left: 3px;
          position: absolute;
          top: 1px;
          transform: rotate(45deg) scaleY(0);
          width: 3px;
          transition: transform 0.15s ease-in 0.05s;
          transform-origin: center;
        }
      }
      .icon-unchecked {
        border-color: #e8e8e8;
      }
      .icon-checked {
        position: relative;
        border-color: $color-blue;
        background: $color-blue;
        &::after {
          transform: rotate(45deg) scaleY(1) !important;
        }
      }

      input[type='checkbox'],
      input[type='radio'] {
        display: none;
      }

      span {
        font-size: 15px;
        font-weight: normal;
        color: #777;
      }
      input:checked + span {
        color: rgba($color: $color-blue, $alpha: 0.7);
      }
    }
    &-item-textarea {
      margin-top: 10px;
    }

    &-footer {
      margin: 64px 0 54px;
      text-align: center;
    }
    &-submit-button {
      width: 270px;
      height: 46px;
      background: $color-blue;
    }
  }
</style>
