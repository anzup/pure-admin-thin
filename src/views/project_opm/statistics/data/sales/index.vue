<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <component :is="currentTab.cmp" :type="currentTab.type" :isTabs="true" />
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ProjectManageClassIndex',
  }
</script>
<script lang="ts" setup>
  import { computed, onActivated, onMounted, ref, shallowRef } from 'vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import OverviewCmp from './overview.vue'
  import DetailsCmp from './details.vue'
  import TrainingCmp from './training.vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabList = shallowRef([
    { id: 'index', name: t('text.sales_revenue_overview'), code: '', cmp: OverviewCmp },
    { id: 'details', name: t('text.sales_revenue_details'), code: '', cmp: DetailsCmp },
    {
      id: 'training',
      name: t('text.statistics_of_training_and_examination'),
      code: '',
      cmp: TrainingCmp,
    },
  ])
  const tabActive = ref(0)
  const tabClick = () => {}
  const currentTab = computed(() => tabList.value[tabActive.value])

  onMounted(() => {})
  onActivated(async () => {})
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
