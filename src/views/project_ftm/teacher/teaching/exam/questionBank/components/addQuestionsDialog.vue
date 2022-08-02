<template>
  <el-dialog
    title="编辑试题"
    width="920px"
    top="10vh"
    center
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="handleClose"
    @closed="closedEvent"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
      <el-row :gutter="20" class="questionStem">
        <el-col :span="24">
          <!-- 试题类型 -->
          <el-form-item :label="$t('table.questionType')">
            <el-radio-group v-model="form.type" @change="typeChange">
              <el-radio v-for="item in typeList" :key="item.index" :label="item.id">{{
                item.name
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 题型难度 -->
          <el-form-item :label="$t('table.difficultyOfQuestionType')" prop="difficulty">
            <el-select v-model="form.difficulty" :placeholder="$t('holder.pleaseSelect')">
              <el-option
                v-for="item in difficultyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 重要程度 -->
          <el-form-item :label="$t('table.importance')" prop="importance" label-width="120px">
            <el-select v-model="form.importance" :placeholder="$t('holder.pleaseSelect')">
              <el-option
                v-for="item in importanceList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 试题章节 -->
          <el-form-item :label="$t('router.questionChapter')" prop="chapterId" label-width="120px">
            <el-select
              style="width: calc(50% - 8px)"
              v-model="form.pChapterId"
              @change="form.chapterId = ''"
              clearable
            >
              <el-option
                v-for="item in pChapterList || []"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <el-select style="width: 50%" v-model="form.chapterId" clearable>
              <el-option
                v-for="item in chapterList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="questionStem">
          <!-- 题干 -->
          <el-form-item :label="$t('table.questionStemInformation')" prop="name">
            <editor
              ref="QuestionEditor"
              :content="form.name"
              @input="
                (html) => {
                  form.name = html
                }
              "
              :autosize="{ minRows: 1 }"
            />
          </el-form-item>
        </el-col>
        <el-col
          class="questionInfo"
          :span="24"
          v-if="form.type !== 'FILL_BLANK' && form.type !== 'QA' && form.type !== 'JUDEGE'"
          :key="form.type"
        >
          <el-form-item
            class="questionInfos"
            :label="$t('table.option') + ' ' + formatOption(index)"
            v-for="(item, index) in form.options"
            :key="index"
            :style="{ zIndex: form.options.length - index }"
            :prop="`options[${index}]`"
            :rules="rules.options"
          >
            <div>
              <el-row style="margin-bottom: 15px">
                <el-col :span="22">
                  <editor
                    ref="AnswerEditor"
                    :content="item.name"
                    :autosize="{ minRows: 1 }"
                    @input="
                      (html) => {
                        item.name = html
                        refreshCacheForm()
                      }
                    "
                  />
                </el-col>
                <el-col :span="1">
                  <el-icon class="deleteIcon" @click="deleteIcon(index)">
                    <Delete />
                  </el-icon>
                </el-col>
              </el-row>
            </div>
          </el-form-item>

          <el-form-item>
            <el-col :span="24">
              <el-button type="primary" @click="addOption">{{ $t('table.addOptions') }}</el-button>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="24" class="questionInfo">
        <el-form-item :label="$t('table.answer')" prop="answers">
          <!-- 答案 -->
          <el-radio-group
            v-model="form.answers"
            v-if="form.type == 'SINGLE_CHOICE'"
            @change="refreshCacheForm"
          >
            <el-radio
              v-for="(item, index) in form.options"
              :key="item.index"
              :label="index + ''"
              name="radio"
            >
              {{ formatOption(index) }}</el-radio
            >
          </el-radio-group>
          <el-checkbox-group
            @change="refreshCacheForm"
            v-model="form.answers"
            v-if="form.type == 'MULTIPLE_CHOICES' || form.type == 'INDEFINITE_CHOICES'"
          >
            <el-checkbox
              v-for="(item, index) in form.options"
              :key="index + 1"
              :label="index + ''"
              name="checkbox"
            >
              {{ formatOption(index) }}</el-checkbox
            >
          </el-checkbox-group>
          <!-- <el-input type="textarea" v-model="form.answers" v-if="form.type == 'FILL_BLANK' || form.type == 'QA'"></el-input> -->
          <!-- <el-input type="textarea" v-model="form.answers" v-if="form.type == 'FILL_BLANK'"></el-input> -->
          <!-- 问答题答案字段改为富文本输入 -->
          <editor
            v-if="
              (typeof form.answers == 'string' && form.type == 'QA') || form.type == 'FILL_BLANK'
            "
            :autosize="{ minRows: 1 }"
            :content="form.answers"
            @input="
              (html) => {
                form.answers = html
                refreshCacheForm()
              }
            "
          />

          <el-radio-group
            v-model="form.answers"
            v-if="form.type == 'JUDEGE'"
            @change="refreshCacheForm"
          >
            <el-radio label="0">{{ $t('status.success') }}</el-radio>
            <el-radio label="1">{{ $t('status.error') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-form>
    <template #footer>
      <el-button @click="handleClose" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave">{{
        $t('button.save')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  // 体型组件
  import editor from '/@/components/Editor/index.vue'
  import { Delete } from '@element-plus/icons-vue'
  import {
    postQuestions,
    getQuestionsId,
    putQuestionsId,
    questionChapters,
  } from '/@/api/ftm/teacher/examCenter'
  import XEUtils from 'xe-utils'
  export default {
    name: 'AddQuestionsDialog',
    props: ['dialogVisible', 'questionBankId', 'questionId', 'status'],
    data() {
      var validateAnswers = (rule, value, callback) => {
        if (value === '' || !value || value.length == 0) {
          callback(new Error(this.$t('holder.pleaseInputTheAnswer')))
        } else {
          callback()
        }
      }
      const validateOptions = (rule, value, cb) => {
        if (!value.name || value.name.toString().trim() == '') {
          cb(new Error(this.$t('holder.pleaseSelect')))
        } else {
          cb()
        }
      }
      return {
        form: {
          name: '',
          type: 'SINGLE_CHOICE',
          difficulty: 'NORMAL',
          importance: 'NORMAL',
          pChapterId: '',
          chapterId: '',
          options: [
            { name: '', number: '0' },
            { name: '', number: '1' },
          ],
          answers: undefined,
          questionBankId: undefined,
        },
        chapterListCache: null,
        pChapterList: null,
        cache_form: {
          // 缓存试题类型和选项答案，切换试题类型可以共用 分四个类型：填空(1答)、单选(多题1答)、选择(多题多答)、判断(1题多答)
          fill: '',
          single: {},
          select: {},
          judge: {},
        },
        typeList: [
          {
            id: 'SINGLE_CHOICE', // 单选
            name: this.$t('status.singleChoiceQuestions'),
          },
          {
            id: 'MULTIPLE_CHOICES', // 多选
            name: this.$t('status.multipleChoiceQuestions'),
          },
          {
            id: 'INDEFINITE_CHOICES', // 不确定选择
            name: this.$t('status.uncertainOptions'),
          },
          {
            id: 'JUDEGE', // 判断
            name: this.$t('status.judgmentQuestions'),
          },
          {
            id: 'FILL_BLANK', // 填空
            name: this.$t('status.completion'),
          },
          {
            id: 'QA', // 问答
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
        rules: {
          // type: {required: true, message: `${this.$t('holder.pleaseSelect')}${this.$t('table.questionType')}`, trigger: 'blur' },
          difficulty: {
            required: true,
            message: `${this.$t('holder.pleaseSelect')}${this.$t(
              'table.difficultyOfQuestionType',
            )}`,
            trigger: 'blur',
          },
          importance: {
            required: true,
            message: `${this.$t('holder.pleaseSelect')}${this.$t('table.importance')}`,
            trigger: 'blur',
          },
          // chapterId: {
          //   required: true,
          //   message: `${this.$t('holder.pleaseSelect')}${this.$t('router.questionChapter')}`,
          //   trigger: 'blur'
          // },
          name: {
            required: true,
            message: `${this.$t('holder.pleaseEnter')}${this.$t('table.questionStemInformation')}`,
            trigger: 'blur',
          },
          answers: {
            validator: validateAnswers,
            trigger: 'blur',
            required: true,
          },
          options: [{ required: true, trigger: 'blur', validator: validateOptions }],
        },
      }
    },
    components: {
      editor,
      Delete,
    },
    computed: {
      visible: {
        get() {
          return this.dialogVisible
        },
        set(val) {
          this.$emit('update:dialogVisible', val)
        },
      },
      chapterList() {
        return (
          (this.chapterListCache || []).filter(
            (item) => item.superior.id == this.form.pChapterId,
          ) || []
        )
      },
    },
    watch: {
      dialogVisible() {
        this.form.questionBankId = this.questionBankId
        this.form.type = 'SINGLE_CHOICE'
        this.form.answers = ''
        this.form.options = [
          { name: '', number: '0' },
          { name: '', number: '1' },
        ]
        if (this.questionId) {
          this.getQuestionsId()
        }
      },
    },
    created() {
      this.questionChaptersParent()
      this.questionChapters()
    },
    methods: {
      handleClose() {
        // this.$refs['ruleForm'].resetFields();
        this.$emit('cancel')
      },
      closedEvent() {
        this.resetContent()
      },
      async handleSave() {
        this.$refs['ruleForm'].validate((valid) => {
          // if(this.form.pChapterId && !this.form.chapterId) {
          //   this.$message.warning(this.$t('tip.tipChapterOne'))
          //   return
          // }
          let params = XEUtils.clone(this.form, true)
          if (params.type == 'MULTIPLE_CHOICES' || params.type == 'INDEFINITE_CHOICES') {
            params.answers.forEach((v) => {
              v = v + ''
            })
          } else if (params.type == 'JUDEGE') {
            params.options = [
              {
                name: this.$t('status.success'),
                number: '0',
              },
              {
                name: this.$t('status.error'),
                number: '1',
              },
            ]
            params.answers = [params.answers]
          }
          // else if (this.form.type == 'QA') {
          //   // 富文本为字符串类型的值,在这儿不改变为数组类型,依旧保持为字符串类型
          //   params.answers = params.answers
          // }
          else {
            // console.log(this.form, 'this.form')
            if (params.answers instanceof Array == false) params.answers = [params.answers]
          }
          if (params.options.length !== 0) {
            params.options.forEach((v, i) => {
              v.number = i + ''
            })
          }
          if (valid) {
            if (this.questionId) {
              this.putQuestionsId(params)
            } else {
              this.postQuestions(params)
            }
          }
        })
      },
      submit() {},
      postQuestions(params) {
        if (params.type == 'MULTIPLE_CHOICES' && params.answers.length < 2) {
          this.$message.warning(this.$t('tip.multipleChoiceLeastAnswer'))
        }
        let { ...paramesData } = params
        paramesData.chapterId = paramesData.chapterId || paramesData.pChapterId || 0
        postQuestions(paramesData).then((res) => {
          if (res.status == 200) {
            this.$emit('getData', res.data)
            this.handleClose()
          }
        })
      },
      // 获取试题详情
      async getQuestionsId() {
        await getQuestionsId({ id: this.questionId }).then((res) => {
          if (res.status == 200) {
            this.form.type = res.data.type
            this.form.difficulty = res.data.difficulty
            this.form.importance = res.data.importance
            this.form.name = res.data.name
            this.form.options = res.data.options
            this.$refs.QuestionEditor.setHtml(res.data.name)
            if (res.data.chapter && res.data.chapter.superior) {
              this.form.pChapterId = res.data.chapter.superior.id
              this.form.chapterId = res.data.chapter.id
            } else if (res.data.chapter && res.data.chapter.id) {
              this.form.pChapterId = res.data.chapter.id
              this.form.chapterId = undefined
            } else {
              this.form.pChapterId = undefined
              this.form.chapterId = undefined
            }
            if (this.form.type == 'MULTIPLE_CHOICES' || this.form.type == 'INDEFINITE_CHOICES') {
              this.form.answers = []
              res.data.answers.forEach((element) => {
                this.form.answers.push(element.name)
              })
            } else {
              this.form.answers = res.data.answers[0].name
            }
            this.$nextTick(() => {
              this.form.options.forEach((v, i) => {
                this.$refs.AnswerEditor[i].setHtml(v.name)
              })
            })
            console.log(this.form.answers)
            this.refreshCacheForm()
          }
        })
      },
      putQuestionsId(params) {
        params.id = this.questionId
        if (params.type == 'MULTIPLE_CHOICES' && params.answers.length < 2) {
          this.$message.warning(this.$t('tip.multipleChoiceLeastAnswer'))
          return false
        }
        params.chapterId = params.chapterId || params.pChapterId || 0
        putQuestionsId(params).then((res) => {
          if (res.status == 200) {
            this.$emit('modify', params.id)
            this.handleClose()
          }
        })
      },
      addOption() {
        // 添加选项
        this.form.options.push({
          name: '',
          number: this.form.options.length + '',
        })
      },
      deleteIcon(index) {
        if (this.form.type == 'SINGLE_CHOICE' || this.form.type == 'INDEFINITE_CHOICES') {
          // 单选  不定向选项 不少于2项
          if (this.form.options.length <= 2) {
            this.$message.warning(this.$t('tip.keepLeastTwoItems'))
            return false
          } else {
            this.form.options.splice(index, 1)
            // 删除项是否为选中项 如果是则清除选中
            this.form.answers = this.form.answers == index ? '' : this.form.answers
          }
        } else if (this.form.type == 'MULTIPLE_CHOICES') {
          // 多选不少于3项
          if (this.form.options.length <= 3) {
            this.$message.warning(this.$t('tip.keepLeastThreeItems'))
            return false
          } else {
            this.form.options.splice(index, 1)
          }
        } else {
          if (this.form.options.length > 1) {
            this.form.options.splice(index, 1)
          } else {
            this.$message.warning(this.$t('tip.keepLeastOneItem'))
          }
        }
      },
      async typeChange() {
        // 填空 问答
        // 若当前类型为修改试题，切换时不要清空数据
        if (this.status && this.status == 'edit') {
          let type = this.form.type
          let defaultSelect = [
            { name: '', number: '0' },
            { name: '', number: '1' },
            { name: '', number: '2' },
          ]
          let defaultSingle = [
            { name: '', number: '0' },
            { name: '', number: '1' },
          ]
          if (type == 'FILL_BLANK' || type == 'QA') {
            this.form.answers = this.cache_form.fill || ''
            this.form.options = []
          } else if (type == 'MULTIPLE_CHOICES' || type == 'INDEFINITE_CHOICES') {
            this.form.answers = this.cache_form.select.answers || []
            this.form.options = this.cache_form.select.options || defaultSelect
          } else if (type == 'JUDEGE') {
            this.form.answers = this.cache_form.judge.answers || ''
            this.form.options = this.cache_form.judge.options || defaultSingle
          } else {
            this.form.answers = this.cache_form.single.answers || []
            this.form.options = this.cache_form.single.options || defaultSingle
          }
          return
        }
        //  初始化时默认给字符串类型
        this.form.answers = ''
        if (this.form.type == 'FILL_BLANK' || this.form.type == 'QA') {
          this.form.answers = ''
          this.form.options = []
        } else if (this.form.type == 'MULTIPLE_CHOICES') {
          // 多选
          this.form.answers = []
          this.form.options = [
            {
              name: '',
              number: '0',
            },
            {
              name: '',
              number: '1',
            },
            {
              name: '',
              number: '2',
            },
          ]
        } else if (this.form.type == 'SINGLE_CHOICE') {
          // 单选 判断题
          this.form.answers = ''
          this.form.options = [
            {
              name: '',
              number: '0',
            },
            {
              name: '',
              number: '1',
            },
          ]
        } else if (this.form.type == 'JUDEGE') {
          this.form.answers = ''
          this.form.options = []
        } else {
          //不定向选项
          this.form.answers = []
          this.form.options = [
            {
              name: '',
              number: '0',
            },
            {
              name: '',
              number: '1',
            },
          ]
        }

        this.$nextTick(() => {
          this.resetContent()
        })
      },
      // 数字转换为ABCD
      formatOption(num) {
        return String.fromCharCode(65 + num)
      },
      resetContent() {
        this.$refs['ruleForm'].resetFields()
        this.form.name = ''
        this.form.pChapterId = ''
        this.$refs.QuestionEditor.clear('')
        if (this.form.options.length !== 0) {
          this.form.options.forEach((v, i) => {
            // this.$set(this.form.options, i, { name: '', number: i + ''})
            v.name = ''
            v.number = i + ''
            this.$refs.AnswerEditor[i].setHtml(v.name)
          })
        }
        if (this.form.type == 'FILL_BLANK' || this.form.type == 'QA') {
          this.form.answers = ''
        } else {
          this.form.answers = []
        }
      },
      // 加入缓存表单
      refreshCacheForm() {
        this.$nextTick(() => {
          let form = this.form
          let type = form.type
          if (type == 'FILL_BLANK' || type == 'QA') {
            this.cache_form.fill = form.answers
          } else if (type == 'MULTIPLE_CHOICES' || type == 'INDEFINITE_CHOICES') {
            form.answers.sort()
            this.cache_form.select.answers = form.answers
            this.cache_form.select.options = form.options
          } else if (type == 'JUDEGE') {
            this.cache_form.judge.answers = form.answers
            this.cache_form.judge.options = form.options
          } else {
            this.cache_form.single.answers = form.answers
            this.cache_form.single.options = form.options
          }
        })
      },
      async questionChaptersParent() {
        await questionChapters({
          page: 1,
          size: 1000,
          sort: undefined,
          order: 'asc',
          superiorId: undefined,
          name: undefined,
          level: 0,
        })
          .then((res) => {
            this.pChapterList = res.data.content
          })
          .catch(() => {})
      },
      async questionChapters() {
        await questionChapters({
          page: 1,
          size: 1000,
          sort: undefined,
          order: 'asc',
          superiorId: undefined,
          name: undefined,
          level: 1,
        })
          .then((res) => {
            this.chapterListCache = res.data.content
          })
          .catch(() => {})
      },
    },
  }
</script>

<style lang="scss" scoped>
  .deleteIcon {
    font-size: 24px;
    color: #d44949;
    display: inline-block;
    margin-left: 10px;
  }
  .questionStem {
    position: relative;
    z-index: 2;
  }
  .questionInfo {
    position: relative;
    z-index: 1;
  }
  .questionInfos {
    position: relative;
  }
</style>
