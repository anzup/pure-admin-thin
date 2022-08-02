<template>
  <!-- effectDisplay 导航效果展示-->
  <div class="display_con">
    <div class="logo_con">
      <el-image :src="imgSrc" fit="scale-down" />
    </div>
    <div
      class="title_con"
      :style="{ 'background-color': detailData.backgroundColor, color: detailData.fontColor }"
    >
      <Hamburger
        class="icon-hamburger"
        @click.prevent.stop
        :style="{ fill: detailData.fontColor }"
      />
      <span class="name">{{ detailData.systemName }}</span>
      <div class="right-menu">
        <svg-icon icon-class="home" class="svg-icon" />
        <svg-icon icon-class="message" class="svg-icon mg" />
        <div class="user-customer">
          <svg-icon icon-class="person" class="svg-icon" />
          <span class="user-name">admin</span>
          <el-icon><CaretBottom /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import Hamburger from '@/components/Hamburger'
  import { CaretBottom } from '@element-plus/icons-vue'
  export default {
    name: 'effectDisplay',
    props: {
      title: String,
      src: String,
      bcColor: String,
      detailData: Object,
    },
    computed: {
      imgSrc() {
        return this.src ? this.src : undefined
      },
    },
    components: { CaretBottom },
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>
  .display_con {
    height: 62px;
    // background: red;
    display: flex;
    .logo_con {
      width: 210px;
      height: 62px;
      background: #215ebe;
      >>> .el-image {
        width: 100%;
        height: 100%;
      }
      img {
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
      }
    }
    .title_con {
      flex: 1;
      // padding-left: 70px;
      // background-color: aquamarine;
      font-size: 20px;
      line-height: 62px;
      .icon-hamburger {
        float: left;
        line-height: 62px;
      }
      .name {
        float: left;
        margin-left: 20px;
        line-height: 62px;
        width: 35%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .right-menu {
        float: right;
        height: 62px;
        display: flex;
        align-items: center;
        & > i {
          margin-right: 40px;
        }
        .user-customer {
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-right: 40px;
          .user-name {
            margin-left: 10px;
          }
        }
      }
    }
    .svg-icon {
      font-size: 32px;
      &.mg {
        margin: 0 18px;
      }
    }
  }
</style>
