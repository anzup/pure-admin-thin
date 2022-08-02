<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <component
        v-if="state.Details.id"
        :is="currentTab.cmp"
        :type="currentTab.id"
        :details="state.Details"
      >
        <div style="overflow: hidden">
          <div class="header student-info-wrapper">
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.name') }}：</span>{{ state.Details.name }}</span
            >
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.gender') }}：</span>
              {{ state.Details.gender == 'M' ? $t('common.male') : $t('common.female') }}
            </span>
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.idNumber') }}：</span
              >{{ state.Details.idNumber }}</span
            >
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.cellPhoneNumber') }}：</span
              >{{ state.Details.phone }}</span
            >
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.belongToDepartment') }}：</span
              >{{ Details?.departments[0]?.name }}</span
            >
          </div>
        </div>
      </component>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import coursewareCmp from './courseWareRecords/index.vue'
  import examCmp from './examRecords/index.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { getEmployeesId } from '/@/api/ftm/teacher/account'
  import to from 'await-to-js'
  import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  const { t } = useI18n()
  const route = useRoute()

  const tabActive = ref(0)
  const tabList = shallowRef([
    // 课件学习记录
    {
      id: 'CoursewareLearningRecord',
      name: t('router.coursewareLearningRecord'),
      cmp: coursewareCmp,
    },
    // 考试记录
    {
      id: 'ExamRecord',
      name: t('router.examRecord'),
      cmp: examCmp,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])
  const state = reactive({
    Details: {},
  })

  const tabClick = () => {}

  onMounted(async () => {
    const id = route.query.id
    const [err, res] = await to(getEmployeesId({ id }))
    if (!err && res.status === 200) {
      state.Details = res.data
    }
  })
</script>
<script lang="ts">
  export default {
    name: 'TeachingEducationRecord',
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

  .student-info-wrapper {
    flex-wrap: wrap;
    justify-content: flex-start;
    .student-info-nav {
      margin-right: 46px;
      font-size: 14px;
      color: #333;
      line-height: 1.5;
      .label {
        color: #aaa;
      }
    }
  }
</style>
