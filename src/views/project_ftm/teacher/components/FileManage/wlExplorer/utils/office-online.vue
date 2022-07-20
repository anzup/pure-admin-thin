<template>
  <el-dialog
    custom-class="custom_dialog"
    :title="$t('button.preview')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    fullscreen
    :zIndex="1002"
    v-model="show"
    @close="close"
  >
    <iframe :src="embedUrl" class="office-box" />
  </el-dialog>
</template>

<script>
  import { encode } from 'js-base64'
  export default {
    name: 'office-online-emded',
    props: {
      url: String,
    },
    data() {
      return {
        show: true,
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
    },
    computed: {
      embedUrl() {
        console.log(import.meta.env, 'env')
        let origin = window.location.origin
        let url = import.meta.env.MODE === 'development' ? import.meta.env.VITE_BASE_URL : origin
        return `${url}/kkfileview/onlinePreview?url=` + encodeURIComponent(encode(this.url))
      },
    },
  }
</script>

<style scoped lang="scss">
  :deep(.el-dialog.is-fullscreen) {
    display: flex;
    flex-direction: column;
    .el-dialog__body {
      flex: 1;
    }
  }
</style>
