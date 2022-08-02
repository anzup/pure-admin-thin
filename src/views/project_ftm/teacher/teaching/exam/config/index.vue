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

<script lang="ts" setup>
  import difficultCmp from './components/quesDifficultySet.vue'
  import templateCmp from './template/index.vue'
  import configCmp from './components/itemBankConfiguration.vue'
  import chapterCmp from './components/questionChapter.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, ref, shallowRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabActive = ref(0)
  const tabList = shallowRef([
    // 难度设置
    {
      id: 'quesDifficultySet',
      name: t('router.quesDifficultySet'),
      menuName: 'QUESTION_DIFFICULTY',
      cmp: difficultCmp,
    },
    // 考试模板
    {
      id: 'template',
      name: t('router.examTemplate'),
      menuName: 'EXAM',
      cmp: templateCmp,
    },
    // 题库配置
    {
      id: 'itemBankConfiguration',
      name: t('router.itemBankConfiguration'),
      menuName: 'EXAM_BANK_PROPERTY',
      cmp: configCmp,
    },
    // 试题章节
    {
      id: 'questionChapter',
      name: t('router.questionChapter'),
      menuName: 'CHAPTER',
      cmp: chapterCmp,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const tabClick = () => {}
</script>
<script lang="ts">
  export default {
    name: 'TeachingExamConfigIndex',
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
