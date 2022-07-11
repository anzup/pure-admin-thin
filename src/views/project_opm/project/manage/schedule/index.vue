<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <component :is="currentTab.cmp" />
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'ProjectManageScheduleIndex',
  }
</script>
<script lang="ts" setup>
  import { computed, onActivated, onMounted, ref, shallowRef } from 'vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import TeacherCmp from './teacher.vue'
  import StudentCmp from './student.vue'
  import ClassCmp from './clazz.vue'
  import DeviceCmp from './device.vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabList = shallowRef([
    { id: 'teacher', name: t('message.teacherSchedule'), code: '', cmp: TeacherCmp },
    { id: 'wetLeaseStudent', name: t('text.wet_rent_student'), code: '', cmp: StudentCmp },
    { id: 'dryLeaseStudent', name: t('text.dry_rent_student'), code: '', cmp: StudentCmp },
    { id: 'class', name: t('message.classSchedule'), code: '', cmp: ClassCmp },
    { id: 'device', name: t('message.facilities_schedule'), code: '', cmp: DeviceCmp },
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
