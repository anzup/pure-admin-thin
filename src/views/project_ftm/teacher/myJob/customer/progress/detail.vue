<template>
  <div class="sm:w-full sm:h-full sm:flex sm:!bg-transparent sm:!p-0">
    <div class="mt-4 sm:w-67.5 sm:mt-0 sm:mr-4 sm:bg-white">
      <div class="flex items-center sm:h-30 nav-header">
        <div class="w-15.5 h-15.5 mr-3 ml-4.5">
          <img class="w-full h-full" :src="AvatarPng" alt="" />
        </div>
        <div class="flex-1">
          <h2 class="font-bold my-1">{{ state.studentDetails?.name }}</h2>
          <div
            class="inline-block bg-white rounded px-2 mr-2 text-sm"
            v-for="(tag, tagIndex) in state.customers"
            :key="tagIndex"
          >
            {{ tag }}
          </div>
        </div>
      </div>
      <div class="p-4 nav-form">
        <p class="my-2 break-all">
          <span class="inline-block w-25 text-right">{{ t('table.classNumber') }}:</span
          >{{ state.courseNumber }}
        </p>
        <p class="my-2 break-all">
          <span class="inline-block w-25 text-right">{{ t('table.gender') }}:</span
          >{{ formatGender(state.studentDetails?.gender) }}
        </p>
        <p class="my-2 break-all">
          <span class="inline-block w-25 text-right">{{ t('table.cellPhoneNumber') }}:</span
          >{{ state.studentDetails?.phone }}
        </p>
        <p class="my-2 break-all">
          <span class="inline-block w-25 text-right">{{ t('table.idNumber') }}:</span
          >{{ state.studentDetails?.idNumber }}
        </p>
        <p class="my-2 break-all">
          <span class="inline-block w-25 text-right">{{ t('table.mailbox') }}:</span
          >{{ state.studentDetails?.email }}
        </p>
      </div>
    </div>
    <div class="sm:flex-1 sm:flex sm:h-full sm:flex-col">
      <div style="height: 32px">
        <Tabs v-model="tabActive" @tab-click="tabClick">
          <TabPanel
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.name"
            :name="index"
          />
        </Tabs>
      </div>

      <div class="main-table-content bg-white sm:flex-1">
        <component :is="currentTab.cmp" :type="currentTab.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import { useI18n } from 'vue-i18n'
  import { computed, onMounted, reactive, ref, shallowRef } from 'vue'
  import AvatarPng from '/@/assets/ftm/avatar.png'
  import { useRoute } from 'vue-router'
  import to from 'await-to-js'
  import { getStudentsId } from '/@/api/ftm/teacher/account'
  const { t } = useI18n()
  const route = useRoute()

  const tabActive = ref(0)
  const tabList = shallowRef([
    { id: '1', name: '基本信息表' },
    {
      id: '2',
      name: '任务进度',
    },
    {
      id: '3',
      name: '理论课进度',
    },
    {
      id: '4',
      name: '模拟机课进度',
    },
  ])
  const currentTab = computed(() => tabList.value[tabActive.value])
  const tabClick = () => {}
  const state = reactive({
    studentDetails: {},
    customers: [],
    courseNumber: '',
  })
  const formatGender = (value: string) =>
    value === 'F' ? t('common.female') : value === 'M' ? t('common.male') : value

  async function getStudentDetail() {
    const params = {
      id: route.query.studentId,
    }
    const [err, res] = await to(getStudentsId(params))
    if (!err && res.status === 200) {
      state.studentDetails = res.data
      state.customers = route.query?.customer
        ? route.query?.customer.split(',')
        : res.data.clazz?.customers?.map((v) => v.name)
      state.courseNumber = route.query?.courseNumber
        ? route.query.courseNumber
        : res.data.clazz?.courseNumber
    }
  }

  onMounted(() => {
    getStudentDetail()
  })
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
  .nav-header {
    background-image: url('/@/assets/ftm/nav-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .nav-form {
    font-size: 14px;
    color: #333;
  }
</style>
