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
  import evaluationCmp from './flightTrainingEvaluation/index.vue'
  import testCmp from './flightTest/index.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabActive = ref(0)
  const tabList = shallowRef([
    // 飞行训练评价
    {
      id: 'flightTrainingEvaluation',
      name: t('router.flightTrainingEvaluation'),
      cmp: evaluationCmp,
    },
    // 飞行考核
    {
      id: 'flightCheck',
      name: t('router.flightCheck'),
      cmp: testCmp,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}
</script>
<script lang="ts">
  export default {
    name: 'MyJobLearningFlightSignIndex',
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
