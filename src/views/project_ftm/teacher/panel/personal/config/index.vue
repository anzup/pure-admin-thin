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
  import infoCmp from './components/info.vue'
  import signCmp from './components/sign.vue'
  import changePasswordCmp from './components/changePassword.vue'
  import changePinCmp from './components/changePin.vue'
  import archivesCmp from './components/teacherArchives.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { EmployeeEnum } from '/@/enums/employeeEnum'
  import { useFtmSettingsStore } from '/@/store/modules/ftmSetting'
  const { t } = useI18n()
  const settingsStore = useFtmSettingsStore()

  const configs = computed(() => settingsStore.configs)
  const airplaneAlone = computed(
    () => configs.value.find((item) => item.name == EmployeeEnum.airplaneType)?.value,
  )
  const tabActive = ref(0)
  const tabList = shallowRef([
    // 个人信息
    // { id: 'PersonalInformation', name: t('table.personalInformation'), cmp: infoCmp },
    // 个人签名
    {
      id: 'configSign',
      name: t('router.personConfigSign'),
      cmp: signCmp,
    },
    // 修改密码
    {
      id: 'ChangePassword',
      name: t('common.changePassword'),
      cmp: changePasswordCmp,
    },
    // 修改pin码
    {
      id: 'ChangePinCode',
      name: t('common.changePinCode'),
      cmp: changePinCmp,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}
  if (airplaneAlone.value) {
    tabList.value.push({
      id: 'TeacherArchives',
      name: t('table.teacherArchives'),
      cmp: archivesCmp,
    })
  }
</script>
<script lang="ts">
  export default {
    name: 'MyJobCoursewareAssignedRecordIndex',
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
