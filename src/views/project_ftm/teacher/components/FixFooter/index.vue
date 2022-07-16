<template>
  <div class="footer-wrapper">
    <div class="footerBtn">
      <slot name="left"></slot>
      <el-button
        type="primary"
        class="rightBtn"
        :loading="props.loading"
        @click="confirm"
        v-if="props.showConfirm"
        >{{ props.okTxt || t('button.save') }}</el-button
      >
      <slot></slot>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  interface Props {
    okTxt: string
    loading: boolean
    showConfirm: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    okTxt: '',
    loading: false,
    showConfirm: true,
  })
  const emit = defineEmits<{
    (e: 'confirm'): void
  }>()

  const confirm = () => {
    emit('confirm')
  }
</script>

<style lang="scss" scoped>
  .footer-wrapper {
    margin-top: 60px;
    .footerBtn {
      position: fixed;
      right: 0;
      bottom: 0px;
      background-color: #fff;
      width: 100%;
      text-align: right;
      height: 60px;
      line-height: 60px;
      z-index: 10;
      .rightBtn {
        margin-right: 24px;
      }
    }
  }
</style>
