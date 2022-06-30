<script lang="ts" setup>
  import { useFullscreen } from '@vueuse/core'
  import { useI18n } from '/@/hooks/useI18n'

  const { t } = useI18n()
  const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <div class="screen-full" @click="toggle">
    <FontIcon
      :icon="isFullscreen ? 'team-iconexit-fullscreen' : 'team-iconfullscreen'"
      :title="isFullscreen ? t('buttons.exitFullscreen') : t('buttons.fullscreen')"
    />
  </div>
</template>

<style lang="scss" scoped>
  .screen-full {
    width: 36px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
</style>
