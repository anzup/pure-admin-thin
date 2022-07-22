<template>
  <el-dialog
    width="400px"
    :title="$t('table.student') + $t('button.qrCode')"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    center
  >
    <div class="qr_container">
      <vue-qr :text="url" :size="200" colorDark="#000" ref="Qrcode" />
      <div class="qr-dialog-content">
        <p class="qr-dialog-item">
          <span class="label">{{ $t('table.name') }}：</span>{{ rowData.studentName || '' }}
        </p>
        <p class="qr-dialog-item">
          <span class="label">{{ $t('table.sourse') }}：</span>{{ rowData.courseName || '' }}
        </p>
        <p class="qr-dialog-item">
          <span class="label">{{ $t('table.group') }}：</span>{{ rowData.groupingName || '' }}
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import VueQr from 'vue-qr'
  export default {
    components: {
      VueQr,
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      rowData: Object,
    },
    data() {
      return {
        // url: "http://localhost:8081/#/teachingCenter/flightEvaluation",
      }
    },
    computed: {
      dialogVisible: {
        get() {
          return this.value
        },
        set(bool) {
          this.$emit('input', bool)
        },
      },
      url() {
        return import.meta.env.MODE === 'development'
          ? `http://localhost:8083/#/?id=${this.rowData.id}&t=f`
          : `${window.location.origin}/ftm/h5/#/?id=${this.rowData.id}&t=f`
      },
    },
  }
</script>

<style lang="scss" scoped>
  .qr_container {
    text-align: center;
  }
  .qr-dialog-content {
    text-align: center;
    .qr-dialog-item {
      // padding-left: 90px;
      white-space: nowrap;
      font-size: 14px;
      text-align: left;
      padding-left: 7em;
      color: #215ebe;
      font-weight: bold;
    }
  }
</style>
