<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <component :is="currentTab?.cmp" :allAuth="allAuth" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import indexCmp from './index.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabActive = ref(0)
  const tabList = shallowRef([
    // 湿租大纲
    {
      id: 'wet_lease',
      name: '湿租大纲',
      cmp: indexCmp,
    },
    // 干租大纲
    // {
    //   id: 'dry_lease',
    //   name: '干租大纲',
    //   cmp: listCmp,
    // },
    // 内训大纲
    // {
    //   id: 'list',
    //   name: t('router.qualificationList'),
    //   cmp: listCmp,
    // },
    // 客户大纲
    // {
    //   id: 'list',
    //   name: t('router.qualificationList'),
    //   cmp: listCmp,
    // }
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}
</script>
<script lang="ts">
  export default {
    name: 'StandardQualificationTeachingIndex',
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
