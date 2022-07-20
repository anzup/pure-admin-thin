<template>
  <div class="img-pre-box">
    <!-- <img class="u-img-pre" :src="imgUrl" alt="图片资料"> -->
    <el-image-viewer v-show="true" :on-close="imgClose" :url-list="[imgUrl]" @close="imgClose" />
  </div>
</template>

<script>
  export default {
    props: {
      url: {
        type: String,
      },
    },
    mounted() {
      // 绑定键盘事件
      window.addEventListener('keyup', this.imgClose, false)
    },
    methods: {
      imgClose(e) {
        if (e == 'close' || !e) {
          this.$emit('closeImg')
          return
        }

        if (e.keyCode === 27) {
          this.$emit('closeImg')
        }
      },
    },
    computed: {
      imgUrl() {
        return this.url
      },
    },
    beforeUnmount() {
      // 卸载键盘事件
      window.removeEventListener('keyup', this.imgClose, false)
    },
  }
</script>

<style lang="scss">
  .img-pre-box {
    // position: absolute;
    // top: 0;
    // left: 0;
    // width: 100%;
    // height: 100%;
    // z-index: 99;
  }
</style>
