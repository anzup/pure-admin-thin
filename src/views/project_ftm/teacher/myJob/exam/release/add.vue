<template>
  <div class="addExamManage" ref="Manage">
    <el-steps :active="active" id="AddExamStep">
      <el-step
        :class="{
          'my-el-step-1': true,
          'my-el-step-2': active != 1 && active != 2 && active != 3,
        }"
        :title="$t('table.itemAttributes')"
      />
      <el-step
        :class="{
          'my-el-step-1': active == 2 || active == 3,
          'my-el-step-2': active != 2 && active != 3,
        }"
        :title="$t('table.choiceOfTestQuestions')"
      />
      <el-step
        :class="{
          'my-el-step-1': active == 3,
          'my-el-step-2': active != 3,
        }"
        :title="$t('table.candidates')"
      />
    </el-steps>
    <div class="panel-content">
      <component
        v-if="isload"
        :is="componentName"
        :type="type"
        :examsInfo="examsInfo"
        @getId="getId"
        @getActive="getActive"
      />
    </div>
  </div>
</template>

<script>
  import { getExamsId } from '/@/api/ftm/teacher/examCenter'
  import itemAttributes from './components/itemAttributes.vue'
  import choiceExamQuestions from './components/choiceExamQuestions.vue'
  import candidates from './components/candidates.vue'
  export default {
    name: 'MyJobExamReleaseAdd',
    data() {
      return {
        active: 1,
        activeName: '',
        componentName: '',
        id: undefined,
        examsInfo: null,
        type: '',
        isload: false,
      }
    },
    components: {
      itemAttributes,
      choiceExamQuestions,
      candidates,
    },
    computed: {},
    created() {
      this.id = this.$route.query.id
      this.type = this.$route.query.type
      this.active = Number(this.$route.query.active)
      if (this.id) {
        this.getExamsIdEvent()
      } else {
        this.active = 1
        this.componentName = 'itemAttributes'
        this.isload = true
      }
    },
    methods: {
      // 数字转换为ABCD
      formatOption(num) {
        return String.fromCharCode(65 + num)
      },
      getActive(val) {
        this.active = val
        if (this.active == 1) {
          this.componentName = 'itemAttributes'
        } else if (this.active == 2) {
          this.componentName = 'choiceExamQuestions'
        } else {
          this.componentName = 'candidates'
        }
      },
      getId(val) {
        this.id = val
        getExamsId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            this.examsInfo = res.data
            this.isload = true
          }
        })
      },
      getExamsIdEvent() {
        getExamsId({ id: this.id }).then((res) => {
          if (res.status == 200) {
            this.$nextTick(() => {
              // console.log(this.$route.query.active);
              if (this.$route.query.active === 1) {
                this.componentName = 'itemAttributes'
              } else {
                this.componentName = 'candidates'
              }
              this.examsInfo = res.data
              this.isload = true
            })
          }
        })
      },
    },
  }
</script>
<style scoped lang="scss">
  $elButtonBg: #215ebe;
  .addExamManage {
    display: flex;
    flex-direction: column;

    .panel-content {
      flex: 1;
      overflow: hidden;
    }

    :deep(.el-steps--horizontal) {
      // padding: 6px 30% 0 30%;
    }
    :deep(.el-step__title),
    .el-step__title.is-process {
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
  .addExamManage::-webkit-scrollbar {
    display: none;
  }
  .btnBox {
    display: flex;
    justify-content: flex-end;
    margin: 24px 0;
  }
  #AddExamStep {
    margin-bottom: 20px;
  }
</style>
