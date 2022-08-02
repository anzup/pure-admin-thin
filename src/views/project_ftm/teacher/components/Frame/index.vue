<template>
  <div class="frame-container" :style="{ 'margin-bottom': 0 + 'px' }">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <div
            v-show="leftShow"
            class="left_title_con"
            :class="{
              'left_title_con-sub': isSub,
              'el-divider-sub': isSub,
            }"
            @click="leftClick"
          >
            <slot name="left">
              <el-divider direction="vertical" />
              <span>{{ title || $t('table.title') }}</span>
            </slot>
          </div>
          <div v-show="rightShow" class="right_title_con" @click="rightClick">
            <slot name="right"
              ><el-button type="text">{{ Subtitle || $t('table.more') }}</el-button></slot
            >
          </div>
        </div>
      </template>
      <template #default>
        <div class="frame-content">
          <slot />
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Frame',
    props: {
      title: {
        type: [String, Number, Function],
      },
      Subtitle: {
        type: [String, Number, Function],
      },
      rightShow: Boolean,
      leftShow: {
        type: Boolean,
        default: true,
      },
      'margin-bottom': {
        type: [Number, String],
        default: 20,
      },
      isSub: Boolean,
    },
    data() {
      return {}
    },
    methods: {
      leftClick() {
        this.$emit('leftClick')
      },
      rightClick() {
        this.$emit('rightClick')
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  .frame-container {
    width: 100%;
    // height: 200px;
    // background: red;
    // margin-bottom: 20px;
    .box-card {
      :deep(.el-card__header) {
        padding: 0;
        display: flex;
        border: none;
        .clearfix {
          flex-grow: 1;
          display: flex;
          align-items: center;
          padding: 10px;
          // justify-content: space-between;
          background: $textBg;
          height: 44px;
          line-height: 44px;

          .left_title_con {
            flex: 1;
            font-size: 16px;
            font-weight: 700;
            color: $elButtonBg;
            &-sub {
              font-weight: 500;
            }
          }
          .right_title_con {
            max-width: 200px;
            flex-grow: 0;
            padding-right: 20px;
            .el-button--text {
              color: $elButtonBg;
            }
          }
          .small-title {
            font-size: 12px;
            margin-left: 10px;
            color: #8fafe2;
          }
          .el-divider--vertical {
            // width: 2px;
            height: 15px;
            vertical-align: unset;
            background: $elButtonBg;
          }
        }
      }
      :deep(.el-card__body) {
        padding: 16px;
      }
      :deep(.el-divider) {
        width: 2px;
      }
    }
    .el-divider-sub {
      :deep(.el-divider) {
        width: 1px !important;
      }
    }
    .frame-content {
      min-height: 100px;
    }
  }
  .frame-container {
    :deep(.el-card) {
      border: none;
      border-radius: none;
    }
  }
</style>
