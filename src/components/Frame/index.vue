<template>
  <div :style="{ 'margin-bottom': 0 + 'px' }" class="frame-container">
    <el-card class="box-card">
      <template #header>
        <div class="clearfix">
          <div
            v-show="leftShow"
            :class="{
              'left_title_con-sub': isSub,
              'el-divider-sub': isSub,
            }"
            class="left_title_con"
            @click="leftClick"
          >
            <slot name="left">
              <el-divider direction="vertical"></el-divider>
              <span>{{ title }}</span>
              <span v-if="hint" class="small-title">({{ hint }})</span>
            </slot>
          </div>
          <div v-show="rightShow" class="right_title_con" @click="rightClick">
            <slot name="right">
              <el-button type="text"
                >{{ Subtitle }}<i class="el-icon-arrow-down el-icon--right"></i
              ></el-button>
            </slot>
          </div>
        </div>
      </template>
      <template #default>
        <div class="frame-content">
          <slot></slot>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
  import { $t } from '/@/plugins/i18n'

  export default {
    name: 'Frame',
    props: {
      title: {
        type: [String, Number, Function],
        default: $t('state.title'),
      },
      hint: String,
      Subtitle: {
        type: [String, Number, Function],
        default: $t('state.more'),
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

<style lang="scss">
  $systemColor: #215ebe;
  $textBg: #dee7f5;
  .frame-container {
    .box-card {
      .el-card__header {
        padding: 0;
        display: flex;
        text-align: left;
        background: $textBg;

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
            color: $systemColor;

            &-sub {
              font-weight: 500;
            }
          }

          .right_title_con {
            max-width: 200px;
            flex-grow: 0;
            padding-right: 20px;

            .el-button--text {
              color: $systemColor;
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
            background: $systemColor;
          }
        }
      }

      .el-card__body {
        padding: 16px;
      }

      .el-divider {
        width: 2px;
      }
    }

    .el-divider-sub {
      .el-divider {
        width: 1px !important;
      }
    }

    .frame-content {
      min-height: 50px;
    }
  }

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
      color: $systemColor;

      &-sub {
        font-weight: 500;
      }
    }

    .right_title_con {
      max-width: 200px;
      flex-grow: 0;
      padding-right: 20px;

      .el-button--text {
        color: $systemColor;
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
      background: $systemColor;
    }
  }
</style>
