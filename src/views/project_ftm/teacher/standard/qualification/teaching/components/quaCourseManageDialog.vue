<template>
  <!-- 课件管理 -->
  <el-dialog
    v-if="type == 1"
    :title="$t('router.coursewareManagement')"
    v-model="visible"
    :close-on-click-modal="false"
    custom-class="custom-courseware-dialog"
    fullscreen
    v-loading="loading"
    center
    @closed="freshEvent"
  >
    <components
      v-if="cmpVisible"
      :is="coursewarePageName"
      @changePage="changeCmpEvent"
      v-bind="coursewareProps"
    />
  </el-dialog>
  <!-- 试题管理 -->
  <el-dialog
    v-else
    :width="computeWidth"
    :title="isModify ? $t('table.questionManagement') : $t('router.questionDetails')"
    v-model="visible"
    :close-on-click-modal="false"
    v-loading="loading"
    :custom-class="computeClass"
    :fullscreen="!isModify"
    center
    @closed="freshEvent"
  >
    <components
      v-if="cmpVisible"
      :is="questionPageName"
      @handleEvent="modifyEvent"
      v-bind="questionProps"
    />
  </el-dialog>
</template>
<script>
  import coursewareTable from './coursewareTable.vue'
  import coursewareUpload from './coursewareUpload.vue'
  import questionTable from './questionTable.vue'
  import questionDetail from './questionDetail.vue'
  import questionDetails from './questionDetail.vue'
  export default {
    data() {
      return {
        loading: false,
        tableLoading: false,
        params: {
          page: 1,
          size: 10,
          total: 0,
        },
        tableData: [],
        tableColumns: [
          { type: 'radio', width: 40 },
          { title: this.$t('common.serialNumber'), type: 'seq', width: 60 },
          { title: this.$t('table.questionBankName'), field: '', minWidth: 200 }, // 题库名称
          { title: this.$t('table.creator'), field: '', minWidth: 150 }, // 创建者
          { title: this.$t('table.questionBankProperties'), field: '', minWidth: 150 }, // 题库性质
          { title: this.$t('table.numberOfTestQuestions'), field: '', minWidth: 150 }, // 试题数量
        ],
        checkedCourseId: null,
        coursewarePageName: 'coursewareTable',
        checkedQuestionId: null,
        questionPageName: 'questionTable',
        cmpVisible: false,
      }
    },
    components: {
      coursewareTable,
      coursewareUpload,
      questionTable,
      questionDetail,
      questionDetails,
    },
    props: {
      show: Boolean,
      isModify: Boolean,
      itemProps: {},
    },
    computed: {
      windowHeight() {
        return window.innerHeight
      },
      visible: {
        get() {
          return !!this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
      type() {
        switch (this.itemProps.classifyType) {
          case 'COURSEWARE':
            return 1
          case 'QUESTIONS':
            return 2
          default:
            return null
        }
      },
      coursewareProps() {
        const { airplaneType, course } = this.itemProps
        const courseId = course ? course.id : ''
        switch (this.coursewarePageName) {
          case 'coursewareTable':
            return { airplaneId: airplaneType, courseId, isModify: this.isModify }
          case 'coursewareUpload':
            return { id: this.checkedCourseId, airplan: airplaneType, courseId }
          case 'coursewareComment':
            return { id: this.checkedCourseId }
          default:
            return {}
        }
      },
      questionProps() {
        const { airplaneType, questionBankId, id } = this.itemProps
        switch (this.questionPageName) {
          case 'questionTable':
            return {
              id,
              airplane: airplaneType,
              defaultSelecteRows: questionBankId ? [questionBankId] : [],
            }
          case 'questionDetails':
            return { questionBankId }
          case 'questionDetail':
            return {
              questionBankId: this.checkedQuestionId,
              showBack: this.isModify ? true : false,
            }
          default:
            return {}
        }
      },
      computeWidth() {
        if (this.type == 2) {
          return this.isModify ? '940px' : undefined
        } else {
          return ''
        }
      },
      computeClass() {
        if (this.type == 2) {
          return this.isModify
            ? this.questionPageName == 'questionDetail'
              ? 'custom-question-dialog'
              : ''
            : 'custom-courseware-dialog'
        } else {
          return 'custom-courseware-dialog'
        }
      },
    },
    watch: {
      visible(bool) {
        if (bool == true) {
          this.cmpVisible = true
          this.questionPageName = this.isModify ? 'questionTable' : 'questionDetails'
        }
      },
      windowHeight: {
        immediate: true,
        handler() {
          this.setHeightMethod()
        },
      },
    },
    updated() {
      this.setHeightMethod()
    },
    methods: {
      async getTableData() {},
      freshEvent() {
        this.cmpVisible = false
        if (this.type == 1) {
          this.coursewarePageName = 'coursewareTable'
        } else {
          this.questionPageName = 'questionTable'
        }
      },
      changePageEvent({ page, size }) {
        this.params.page = page
        this.params.size = size
        this.getTableData()
      },
      // 课件跳转不同页面事件
      changeCmpEvent(event) {
        const { type, id } = event
        switch (type) {
          case 'upload':
            this.checkedCourseId = null
            this.coursewarePageName = 'coursewareUpload'
            break
          case 'modify':
            this.checkedCourseId = id
            this.coursewarePageName = 'coursewareUpload'
            break
          case 'home':
            this.coursewarePageName = 'coursewareTable'
            break
        }
      },
      // 题库操作
      modifyEvent(event) {
        const { type, questionBankId } = event
        switch (type) {
          case 'close':
            this.visible = false
            this.questionPageName = 'questionTable'
            break
          case 'save':
            this.visible = false
            this.questionPageName = 'questionTable'
            this.$emit('complate')
            break
          case 'detail':
            this.questionPageName = 'questionDetail'
            this.checkedQuestionId = questionBankId
            break
          case 'home':
            this.questionPageName = 'questionTable'
            break
        }
      },
      // 计算弹框高度
      setHeightMethod() {
        const contentDOM = document.querySelector('.custom-question-dialog')
        const h = this.windowHeight
        if (contentDOM && h * 0.8 > 600) {
          contentDOM.style.setProperty('--contentHeight', h * 0.8 + 'px')
        } else if (contentDOM) {
          contentDOM.style.setProperty('--contentHeight', '600px')
        }
      },
    },
  }
</script>

<style lang="scss">
  .custom-courseware-dialog .el-dialog__body {
    height: calc(100% - 54px);
  }
  .custom-question-dialog {
    --contentHeight: 600px;
    .el-dialog__body {
      height: calc(var(--contentHeight) - 54px);
    }
  }
</style>
