<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <component :is="currentTab.cmp" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import fileCmp from './fileStudyNotice/index.vue'
  import noticeCmp from './notice/index.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabActive = ref(0)
  const tabList = shallowRef([
    { id: 'notice', name: '信息公告', cmp: noticeCmp },
    {
      id: 'fileStudyNotice',
      name: '文件学习通知',
      cmp: fileCmp,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}
</script>
<script lang="ts">
  export default {
    name: 'BasicInfomationMessageIndex',
  }
</script>

<style lang="scss" scoped>
  .main-content {
    padding: 0 !important;
  }

  .main-table-content {
    padding: $padding;
    height: calc(100% - 32px);
  }

  :deep(.el-tabs--top) {
    height: 100%;
  }

  :deep(.el-tabs__content) {
    padding: 0;
    height: calc(100% - 55px);
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
</style>
