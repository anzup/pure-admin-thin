<template>
  <div class="!p-0">
    <Tabs v-model="tabName">
      <TabPanel v-for="item in tabList" :key="item.id" :label="item.name" :name="item.id">
        <component :is="item.cmp" v-if="tabName === item.id" />
      </TabPanel>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { useI18n } from '/@/hooks/useI18n'
  import Restaurant from './components/Restaurant/index.vue'
  import Period from './components/Period/index.vue'
  import CountConfigs from './components/CountConfigs/index.vue'

  const { t } = useI18n()

  const tabName = ref('Restaurant')
  const tabList: (DefaultAllListItem<string> & { cmp: any })[] = [
    {
      name: t('state.restaurantSetting'),
      id: 'Restaurant',
      cmp: Restaurant,
    },
    {
      name: t('state.mealTime'),
      id: 'Period',
      cmp: Period,
    },
    {
      name: t('state.timesConfiguration'),
      id: 'CountConfigs',
      cmp: CountConfigs,
    },
  ]
</script>

<style scoped>
  .d-tab-pane {
    height: 100%;
    padding: 16px;
  }
</style>
