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
  import Cmp from './cmp.vue'
  const tabList = shallowRef([
    { id: 'wetLease', type: 'WET_LEASE', name: '湿租班级', code: '', cmp: Cmp },
    { id: 'dryLease', type: 'DRY_LEASE', name: '干租班级', code: '', cmp: Cmp },
    { id: 'internal', type: 'INTERNAL_TRAINING', name: '内训班级', code: '', cmp: Cmp },
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
