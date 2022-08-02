<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <template v-for="plane in tabList" :key="plane.id">
        <component
          v-if="currentTab.id === plane.id"
          :is="facultyCmp"
          :id="currentTab.id"
          :builtinRole="currentTab.builtinRole"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import facultyCmp from './components/facultyTheory.vue'
  import { getRolesAll } from '/@/api/ftm/teacher/account'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, onMounted, ref, shallowRef } from 'vue'
  import to from 'await-to-js'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabActive = ref(0)
  const tabList = ref([])

  const currentTab = computed(() => tabList.value[tabActive.value] || {})
  const tabClick = () => {}

  onMounted(async () => {
    const [err, res] = await to(getRolesAll({}))
    if (!err && res.status === 200) {
      tabList.value = res.data
    }
  })
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
