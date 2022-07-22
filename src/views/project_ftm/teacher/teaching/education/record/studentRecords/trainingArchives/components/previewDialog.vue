<template>
  <el-dialog
    custom-class="custom_dialog"
    :title="name"
    v-model="isShow"
    :zIndex="10000"
    :fullscreen="true"
  >
    <iframe
      width="100%"
      height="100%"
      ref="offceIframe"
      id="iframescorm"
      scrolling="no"
      allowfullscreen
      webkitallowfullscreen
      :src="officeUrl"
    >
    </iframe>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      show: Boolean,
      name: String,
      url: String,
    },
    computed: {
      isShow: {
        get() {
          return this.show
        },
        set(bool) {
          this.$emit('update:show', bool)
        },
      },
      officeUrl() {
        return `pdf/web/viewer.html?file=${encodeURIComponent(this.url)}`
      },
    },
  }
</script>
