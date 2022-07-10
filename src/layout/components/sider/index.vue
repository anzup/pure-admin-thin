<template>
  <div :class="['sidebar-container', getShowLogo ? 'has-logo' : '']">
    <Menu :menu-mode="getMenuType" />
  </div>
</template>
<script lang="ts" setup>
  import Menu from '/@/layout/components/menu/index.vue'
  import { useMenuSetting } from '/@/hooks/settings/useMenuSetting'

  const { getMenuType, getShowLogo } = useMenuSetting()
</script>
