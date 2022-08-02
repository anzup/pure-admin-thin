<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <component
        v-if="state.visible"
        :is="currentTab.cmp"
        :type="currentTab.id"
        :details="state.Details"
        :clazz="state.Clazz"
      >
        <div style="overflow: hidden">
          <div class="header student-info-wrapper">
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.name') }}：</span>{{ state.Details?.name }}</span
            >
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.gender') }}：</span>
              {{ state.Details?.gender == 'M' ? $t('common.male') : $t('common.female') }}
            </span>
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.idNumber') }}：</span
              >{{ state.Details?.idNumber }}</span
            >
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.cellPhoneNumber') }}：</span
              >{{ state.Details?.phone }}</span
            >
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.airlines') }}：</span
              >{{ state.Details?.customer?.name }}</span
            >
            <span class="student-info-nav"
              ><span class="label">{{ $t('table.belongToDepartment') }}：</span
              >{{ state.Clazz?.department?.name }}</span
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
  import failCmp from './failRecords/index.vue'
  import CBTACmp from './CBTARecords/index.vue'
  import coreCmp from './CoreCompetenceStatistics/index.vue'
  import recordCmp from './recordOrder/index.vue'
  import leaveCmp from './leaveRecords/index.vue'
  import abilityCmp from './abilityEcharts/index.vue'
  import archivesCmp from './trainingArchives/index.vue'
  import behavioralCmp from './behavioralIndicatorsStatic/index.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { getStudentDetails } from '/@/api/ftm/teacher/studentTraining'
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
    // 理论考试记录
    {
      id: 'ExamRecord',
      name: t('router.TheoryExamRecord'),
      cmp: examCmp,
    },
    // 不及格记录
    {
      id: 'FailRecord',
      name: t('router.failRecord'),
      cmp: failCmp,
    },
    // CBTA
    {
      id: 'CBTARecord',
      name: 'CBTA',
      cmp: CBTACmp,
    },
    // 核心胜任力评估表
    {
      id: 'CoreCompetenceStatistics',
      name: t('router.coreCompetenceStatistics'),
      cmp: coreCmp,
    },
    // 岗位胜任力评估表
    {
      id: 'RecordOrder',
      name: t('router.positionCompetenceEvaluation'),
      cmp: recordCmp,
    },
    // 学员离队训练评定表
    {
      id: 'LeaveOrder',
      name: t('router.leaveTrainEvaluation'),
      cmp: leaveCmp,
    },
    // 核心能力图
    {
      id: 'AbilityEcharts',
      name: t('router.abilityRecord'),
      cmp: abilityCmp,
    },
    // 培训档案
    {
      id: 'trainingArchives',
      name: t('router.trainingArchives'),
      cmp: archivesCmp,
    },
    // 行为指标统计
    {
      id: 'behavioralIndicatorsStatic',
      name: t('table.behavioralIndicatorsStatic'),
      cmp: behavioralCmp,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])
  const state = reactive({
    Details: {},
    Clazz: {},
    visible: false,
  })

  const tabClick = () => {}

  onMounted(async () => {
    const id = route.params.recordId
    const [err, res] = await to(getStudentDetails({ id }))
    if (!err && res.status === 200) {
      state.Details = res.data.student
      state.Clazz = res.data.clazz
      state.visible = true
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
      font-size: 12px;
      color: #333;
      line-height: 1.5;
      .label {
        color: #333;
      }
    }
  }
</style>
