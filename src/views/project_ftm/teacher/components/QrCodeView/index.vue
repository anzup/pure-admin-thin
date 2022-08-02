<template>
  <el-dialog
    :title="$t('button.qrCode')"
    v-model="visible"
    width="350px"
    center
    :before-close="handleCancel"
  >
    <div class="qrCodeBox">
      <vue-qr :text="url" :size="200" colorDark="#000" ref="Qrcode" />
      <div class="code">{{ qrTitle }}</div>
      <div class="downloadBox">
        <el-button type="primary" size="medium" class="download" @click="download">{{
          $t('button.download')
        }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import VueQr from 'vue-qr/src/packages/vue-qr.vue'
  export default {
    name: 'QrCode',
    props: ['qrDialogVisible', 'qrTitle', 'url', 'classCode'],
    data() {
      return {
        studentInfo: '',
      }
    },
    components: {
      VueQr,
    },
    computed: {
      visible: {
        get() {
          return this.qrDialogVisible
        },
        set(val) {
          this.$emit('update:qrDialogVisible', val)
        },
      },
    },
    methods: {
      handleCancel() {
        this.$emit('cancelDialog')
      },
      download() {
        let a = document.createElement('a')
        // 下载图名字
        a.download = this.classCode
        //url
        a.href = this.$refs.Qrcode.$el.src
        //合成函数，执行下载
        a.dispatchEvent(new MouseEvent('click'))
      },
    },
  }
</script>

<style scoped lang="scss">
  .qrCodeBox {
    text-align: center;
    .code {
      margin-bottom: 10px;
      font-size: 16px;
      color: #215ebe;
      font-weight: bold;
    }
    .downloadBox {
      margin: 0 auto;
      width: 85%;
      border-top: 1px solid #215ebe;
      .download {
        margin-top: 15px;
      }
    }
  }
</style>
