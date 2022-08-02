<template>
  <el-dialog v-model="visible" width="350px" center :title="$t('button.qrCode')" @close="Hide">
    <div class="center">
      <vue-qr :text="url" :size="200" colorDark="#000" ref="Qrcode" :callback="getURL" />
    </div>
    <div class="center">
      <slot name="text" />
    </div>
    <template #footer>
      <el-button type="primary" @click="Download">{{ $t('button.downloadQrcode') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import vueQr from 'vue-qr/src/packages/vue-qr.vue'
  export default {
    data() {
      return {
        imgURL: '',
      }
    },
    props: ['show', 'url', 'name'],
    components: { vueQr },
    computed: {
      visible: {
        get() {
          return this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
    },
    methods: {
      getURL(url) {
        this.imgURL = url
      },
      Download() {
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = this.name || ''
        a.href = this.imgURL
        a.dispatchEvent(event)
      },
      Hide() {
        this.$emit('update:show', false)
      },
    },
  }
</script>

<style scoped>
  .center {
    text-align: center;
  }
</style>
