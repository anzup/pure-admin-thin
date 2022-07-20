<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <component :is="currentTab?.cmp" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import evaluationCmp from './components/evaluationCmp.vue'
  import behaviorCmp from './components/behaviorCmp.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabActive = ref(0)
  const tabList = shallowRef([
    // 核心能力评估项
    {
      id: 'evaluationCoreCompetenceProj',
      name: t('table.evaluationCoreCompetenceProj'),
      cmp: evaluationCmp,
      menuName: 'EVALUATION',
    },
    // 行为指标
    {
      id: 'behavioralIndicators',
      name: t('table.behavioralIndicators'),
      cmp: behaviorCmp,
      menuName: 'EVALUATION',
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}
</script>
<script lang="ts">
  export default {
    name: 'StandardCourseConfigIndex',
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
