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
  import configCmp from './components/configCmp.vue'
  import listCmp from './components/listCmp.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useRoute } from 'vue-router'
  const { t } = useI18n()
  const userStore = useFtmUserStore()
  const route = useRoute()

  const userInfo = computed(() => userStore.$state)
  const totalAuthorities = computed(() => userInfo.value?.totalAuthorities)
  const allAuth = computed(() => !!route.meta?.params?.allAuth)

  const tabActive = ref(0)
  const tabList = shallowRef([
    // 资质信息配置
    {
      id: 'infoConfig',
      name: t('router.qualificationInfoConfig'),
      cmp: configCmp,
      menuName: 'QUALIFICATION_CONFIGURATION_MANAGEMENT',
    },
    // 资质列表
    {
      id: 'list',
      name: t('router.qualificationList'),
      cmp: listCmp,
      menuName: 'QUALIFICATION_CONFIGURATION_MANAGEMENT',
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}

  watch(
    totalAuthorities,
    () => {
      tabList.value =
        tabList.value.filter((item) => {
          return allAuth.value ? item.menuName : totalAuthorities.value.includes(item.menuName)
        }) || []
    },
    { immediate: true },
  )
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
