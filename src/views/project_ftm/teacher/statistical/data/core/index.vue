<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>

    <div class="main-table-content">
      <template v-for="plane in tabList" :key="plane.id">
        <div class="ablity-echarts-wrap" v-if="currentTab.id == plane.id">
          <el-form :inline="true" :model="formInline" class="form-inline" size="small">
            <el-form-item :label="$t('table.date')">
              <hyx-date-picker v-model="formInline.daterange" />
            </el-form-item>
            <el-form-item :label="$t('table.courseName')">
              <el-select
                v-model="formInline.courseId"
                :placeholder="$t('holder.pleaseSelect')"
                style="width: 150px"
                clearable
                filterable
              >
                <el-option
                  :label="item.name"
                  :value="item.id"
                  v-for="item in coursesAll"
                  :key="item.index"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{ $t('button.query') }}</el-button>
            </el-form-item>
          </el-form>
          <el-radio-group
            class="flex-right"
            v-model="radio"
            size="small"
            style="float: right; margin-right: 16px"
            @change="tabChange"
          >
            <el-radio-button label="0">{{ $t('button.statistics') }}</el-radio-button>
            <el-radio-button label="1">{{ $t('button.tableData') }}</el-radio-button>
          </el-radio-group>
          <div class="clear-both" />
          <section>
            <component
              ref="statisticsRef"
              :is="currentTab.echart"
              :type="currentTab.id"
              :radio="radio"
              :formInline="formInline"
              v-if="radio == 0"
              style="width: 100%"
            />
            <component
              ref="statisticsTableRef"
              :is="currentTab.table"
              :type="currentTab.id"
              :radio="radio"
              :formInline="formInline"
              v-if="radio == 1"
              style="width: 100%; margin-top: 16px"
            />
          </section>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import HyxDatePicker from '/@/views/project_ftm/teacher/components/HyxDatePicker/index.vue'
  import lineEchart from './components/lineEchart.vue'
  import tableCmp from './components/table.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
  import { getCoursesAll } from '/@/api/ftm/teacher/trainingPlan'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const tabActive = ref(0)
  const tabList = shallowRef([
    // 客户统计
    {
      id: 'lineEchart1',
      name: t('table.customerStatistics'),
      menuName: 'EVALUATION',
      echart: lineEchart,
      table: tableCmp,
    },
    // 班级统计
    {
      id: 'lineEchart2',
      name: t('table.classStatistics'),
      menuName: 'EVALUATION',
      echart: lineEchart,
      table: tableCmp,
    },
  ])

  const currentTab = computed(() => tabList.value[tabActive.value])

  const radio = ref('0')
  const coursesAll = ref([])
  const formInline = reactive({
    daterange: ['', ''],
    courseId: '',
  })
  const statisticsRef = ref()
  const statisticsTableRef = ref()

  const tabClick = () => {}
  const tabChange = () => {
    if (radio.value == '0') {
      statisticsRef.value instanceof Array &&
        statisticsRef.value[0] &&
        statisticsRef.value[0].getData()
    } else {
      statisticsTableRef.value instanceof Array &&
        statisticsTableRef.value[0] &&
        statisticsTableRef.value[0].getData()
    }
  }
  const onSubmit = () => {
    if (radio.value == '0') {
      statisticsRef.value instanceof Array &&
        statisticsRef.value[0] &&
        statisticsRef.value[0].getData(1)
    } else {
      statisticsTableRef.value instanceof Array &&
        statisticsTableRef.value[0] &&
        statisticsTableRef.value[0].getData(1)
    }
  }

  onMounted(async () => {
    await getCoursesAll({}).then((res) => {
      if (res.status == 200) {
        coursesAll.value = res.data
      }
    })
  })
</script>
<script lang="ts">
  export default {
    name: 'StatisticalDataCoreIndex',
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

  .ablity-echarts-wrap {
    display: flex;
    flex-direction: column;
    background: #fff;
    height: 100%;
    .flex-right {
      margin-left: auto;
      margin-right: 0;
    }
    section {
      flex: 1;
    }
  }
  .clear-both {
    clear: both;
  }
</style>
