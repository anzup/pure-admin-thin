<script lang="ts" setup>
  import { getCurrentInstance } from 'vue'

  const props = defineProps({
    collapse: Boolean,
  })

  const title = getCurrentInstance().appContext.config.globalProperties.$config?.Title
</script>

<template>
  <div :class="{ collapse: props.collapse }" class="sidebar-logo-container">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="props.collapse"
        key="props.collapse"
        :title="title"
        class="sidebar-logo-link"
        to="/"
      >
        <FontIcon icon="team-iconlogo" style="width: 35px; height: 35px" svg />
        <span class="sidebar-title">{{ title }}</span>
      </router-link>
      <router-link v-else key="expand" :title="title" class="sidebar-logo-link" to="/">
        <FontIcon icon="team-iconlogo" style="width: 35px; height: 35px" svg />
        <span class="sidebar-title">{{ title }}</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 48px;
    text-align: center;
    overflow: hidden;

    .sidebar-logo-link {
      height: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-top: 5px;

      .sidebar-title {
        color: #1890ff;
        font-weight: 600;
        font-size: 20px;
        margin-top: 10px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      }
    }

    .collapse {
      .sidebar-logo {
        margin-right: 0;
      }
    }
  }
</style>
