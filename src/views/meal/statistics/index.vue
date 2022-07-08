<template>
  <div class="!p-0">
    <Tabs v-model="tabName">
      <TabPanel v-for="item in tabList" :key="item.id" :label="item.name" :name="item.id">
        <component :is="item.cmp" @changeTab="changeTab" />
      </TabPanel>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref } from 'vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { useI18n } from '/@/hooks/useI18n'
  import Statistics from './components/Statistics.vue'
  import Detail from './components/Detail.vue'

  const { t } = useI18n()

  const tabName = ref('statistics')

  const tabList: (DefaultAllListItem<string> & { cmp: any })[] = [
    {
      id: 'statistics',
      name: t('state.mealStatistics'),
      cmp: Statistics,
    },
    {
      id: 'detail',
      name: t('state.mealDetails'),
      cmp: Detail,
    },
  ]

  const changeTab = (val) => {
    nextTick(() => {
      tabName.value = val
    })
  }

  onMounted(async () => {})
</script>

<style scoped>
  .d-tab-pane {
    height: 100%;
    padding: 16px;
  }
</style>
