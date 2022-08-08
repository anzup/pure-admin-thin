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
  import centerCmp from './components/quaCenterCmp.vue'
  import courseCmp from './components/quaCourseCmp.vue'
  import quaCmp from './components/quaCmp.vue'
  import qualificationsCmp from './components/qualificationsCmp.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef, watch } from 'vue'
  import { EmployeeEnum } from '/@/enums/employeeEnum'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useFtmSettingsStore } from '/@/store/modules/ftmSetting'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  const { t } = useI18n()
  const settingsStore = useFtmSettingsStore()
  const route = useRoute()

  const userInfo = computed(() => userStore.userInfo)
  const totalAuthorities = computed(() => userInfo.value?.totalAuthorities)
  const allAuth = computed(() => !!route.meta?.params?.allAuth)
  const configs = computed(() => settingsStore.configs)
  const airplaneAlone = computed(() => {
    try {
      return configs.value.find((item) => item.name == EmployeeEnum.airplaneType).value
    } catch (e) {
      return true
    }
  })

  const tabActive = ref(0)
  const tabList = shallowRef([
    // 中心资质
    {
      id: 'center',
      name: t('router.centerQualification'),
      menuName: 'CENTER_QUALIFICATION_MANAGEMENT',
      cmp: centerCmp,
      airplaneAlone: false,
    },
    // 课程资质
    {
      id: 'course',
      name: t('router.courseQualification'),
      menuName: 'COURSE_QUALIFICATION_MANAGEMENT',
      cmp: courseCmp,
      airplaneAlone: false,
    },
    // 证照管理
    {
      id: 'licence',
      name: t('table.licenseManagement'),
      menuName: 'LICENSING_MANAGEMENT',
      cmp: quaCmp,
      airplaneAlone: true,
    },
    // 教员资质
    {
      id: 'qualifications',
      name: t('router.teacherQualification'),
      menuName: 'EMPLOYEE_QUALIFICATION_MANAGEMENT',
      cmp: qualificationsCmp,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}

  watch(
    totalAuthorities,
    () => {
      tabList.value = tabList.value.filter((item) => {
        return (
          (allAuth.value ? item.menuName : totalAuthorities.value.includes(item.menuName)) &&
          (item?.airplaneAlone ? airplaneAlone.value == item.airplaneAlone : true)
        )
      })
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
