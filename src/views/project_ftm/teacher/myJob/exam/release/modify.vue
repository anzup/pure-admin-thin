<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel v-for="(item, index) in tabList" :key="index" :label="item.name" :name="index" />
      </Tabs>
    </div>
    <div class="main-table-content">
      <div style="flex: 1">
        <component
          ref="modifyRef"
          :is="currentTab?.cmp"
          :examsInfo="state.examInfo"
          :disableds="disabledOptions"
          :hideFooter="true"
        />
      </div>
      <fix-footer @confirm="saveEvent" :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import itemAttributesCmp from './components/itemAttributes.vue'
  import candidatesCmp from './components/candidates.vue'
  import FixFooter from '/@/views/project_ftm/teacher/components/FixFooter/index.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
  import { getExamsId, putExamsId } from '/@/api/ftm/teacher/examCenter'
  import to from 'await-to-js'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const tabActive = ref(0)
  const tabList = shallowRef([
    {
      id: 'itemAttributes',
      name: t('table.itemAttributes'),
      cmp: itemAttributesCmp,
    },
    { id: 'candidates', name: t('table.candidates'), cmp: candidatesCmp },
  ])
  const currentTab = computed(() => tabList.value[tabActive.value])

  const state = reactive({
    examInfo: {},
  })
  const disabledOptions = computed((): string[] => {
    switch (state.examInfo?.status) {
      case 'EXAMING':
        return [
          'supplementaryType',
          'previousExamId',
          'examTypeId',
          'courseNumber',
          'name',
          'duration',
          'year',
          'totalScore',
          'passScore',
          'regulation',
        ]
      case 'FINISHED':
        return [
          'supplementaryType',
          'previousExamId',
          'examTypeId',
          'courseNumber',
          'name',
          'duration',
          'year',
          'totalScore',
          'passScore',
          'regulation',
          'examPeriod',
        ]
      case 'NOT_STARTED':
        return []
    }
  })
  const id = computed(() => route.query.id)
  const modifyRef = ref()
  const loading = ref(false)

  // 交互事件
  const tabClick = (tab) => {
    let { query, path } = route
    router.replace({
      path,
      query: {
        ...query,
        tab_name: tab.name,
      },
    })
  }
  const saveEvent = () => {
    if (currentTab.value?.id === 'itemAttributes') {
      submitExamAttr()
    } else {
      submitExamStudents()
    }
  }

  // 请求事件
  // 获取考试详情
  const getExamDetails = async () => {
    let [err, res] = await to(getExamsId({ id: id.value }))
    if (!err && res.status == 200) {
      state.examInfo = {
        ...res.data,
        modify: res.data.status == 'EXAMING',
      }
    }
  }
  // 修改试题属性
  const submitExamAttr = async () => {
    modifyRef.value.validateForm(async (form) => {
      let { endDate, examPeriod } = form
      let data = { id: id.value }
      // 已开始的考试只能修改结束时间
      if (state.examInfo?.status == 'EXAMING') {
        data.endDate = endDate
      } else if (state.examInfo?.status == 'NOT_STARTED') {
        // 未开始的考试可以修改全部
        data = {
          ...data,
          ...form,
          startDate: examPeriod instanceof Array && examPeriod.length > 0 ? examPeriod[0] : '',
          endDate: examPeriod instanceof Array && examPeriod.length > 1 ? examPeriod[1] : '',
        }
      }
      loading.value = true
      let [err, res] = await to(putExamsId(data))
      loading.value = false
      if (!err) {
        ElMessage.success(t('tip.modifySuccessTop'))
        getExamDetails()
      }
    })
  }
  // // 新增考生
  const submitExamStudents = async () => {
    let data = {
      id: id.value,
      students: modifyRef.value?.tableData,
    }
    loading.value = true
    let [err, res] = await to(putExamsId(data))
    loading.value = false
    if (!err) {
      ElMessage.success(t('tip.modifySuccessTop'))
      getExamDetails()
    }
  }

  onMounted(() => {
    getExamDetails()
  })
</script>
<script lang="ts">
  export default {
    name: 'MyJobExamReleaseModify',
  }
</script>

<style lang="scss" scoped>
  .main-content {
    padding: 0 !important;
  }

  .main-table-content {
    display: flex;
    flex-direction: column;
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
