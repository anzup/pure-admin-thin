<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <component :is="currentTab.cmp" :allAuth="allAuth" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import applicationCmp from './components/applicationCmp.vue'
  import managementCmp from './components/managementCmp.vue'
  import quaCmp from '/@/views/project_ftm/teacher/standard/qualification/teaching/components/quaCmp.vue'
  import qualificationsCmp from '/@/views/project_ftm/teacher/standard/qualification/teaching/components/qualificationsCmp.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { EmployeeEnum } from '/@/enums/employeeEnum'
  import { useFtmSettingsStore } from '/@/store/modules/ftmSetting'
  import { useRoute } from 'vue-router'
  import { useUserStore } from '/@/store/modules/user'

  const userStore = useUserStore()
  const { t } = useI18n()
  const settingsStore = useFtmSettingsStore()
  const route = useRoute()

  const configs = computed(() => settingsStore.configs)
  const airplaneAlone = computed(
    () => configs.value.find((item) => item.name == EmployeeEnum.airplaneType)?.value,
  )
  const allAuth = computed(() => route.meta.params && route.meta?.params?.allAuth)
  const tabActive = ref(0)
  const tabList = shallowRef([
    // 申请列表
    {
      id: 'application',
      name: t('router.applicationList'),
      cmp: applicationCmp,
      menuName: 'PERSONAL_QUALIFICATIONS',
      airplaneAlone: false,
    },
    // 资质管理
    {
      id: 'management',
      name: t('router.qualificationManagement'),
      cmp: managementCmp,
      menuName: 'PERSONAL_QUALIFICATIONS',
      airplaneAlone: false,
    },
    // 证照管理
    {
      id: 'licence',
      name: t('table.licenseManagement'),
      cmp: quaCmp,
      menuName: 'PERSONAL_QUALIFICATIONS',
      airplaneAlone: true,
    },
    // 资质管理
    {
      id: 'qualifications',
      name: t('table.qualificationManagement'),
      cmp: qualificationsCmp,
      menuName: 'PERSONAL_QUALIFICATIONS',
      airplaneAlone: true,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}

  tabList.value = tabList.value.filter((item) => {
    return (
      (allAuth.value ? item.menuName : userStore.ContainsPermissions(item.menuName)) &&
      airplaneAlone.value == item.airplaneAlone
    )
  })
</script>
<script lang="ts">
  export default {
    name: 'PanelPersonalQualificationIndex',
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
