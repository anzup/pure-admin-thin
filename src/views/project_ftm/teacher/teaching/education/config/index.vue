<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <component :is="currentTab.cmp" :type="currentTab.id" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import trainingCmp from './components/trainingCmp.vue'
  import progressCmp from './components/progressCmp.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabActive = ref(0)
  const tabList = shallowRef([
    // 训练结果配置
    {
      id: 'trainingResultConf',
      name: t('router.trainingResultConf'),
      menuName: 'TRAINING_RESULT_CONFIG',
      cmp: trainingCmp,
    },
    // 进度设置
    {
      id: 'progressSet',
      name: t('router.progressSet'),
      menuName: 'TEACH_SCHEDULE_SETTING',
      cmp: progressCmp,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}
</script>
<script lang="ts">
  export default {
    name: 'TeachingEducationConfigIndex',
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
