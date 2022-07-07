<template>
  <div class="!h-auto">
    <el-descriptions :column="2" border class="mb-4">
      <el-descriptions-item :label="$t('state.fullName')" width="25%"
        >kooriookami
      </el-descriptions-item>
      <el-descriptions-item :label="$t('state.department')" width="25%"
        >18100000000
      </el-descriptions-item>
      <el-descriptions-item :label="$t('state.position')" width="25%">
        <el-tag size="small">School</el-tag>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('state.phoneNumber')" width="25%"
        >No.1188,
      </el-descriptions-item>
    </el-descriptions>

    <Tabs v-model="tabName" head-background="#fff">
      <TabPanel :label="$t('state.frequency')" :name="payMethodEnum.COUNT" />
      <TabPanel :label="$t('state.sum')" :name="payMethodEnum.BALANCE" />
      <TabPanel :label="$t('state.mealRecord')" :name="transactionTypeEnum.CONSUME" />
      <TabPanel :label="$t('state.rechargeRecord')" :name="transactionTypeEnum.CHARGE" />
      <BasicTable :type="tabName" />
    </Tabs>
    <div class="w-full mt-4 text-center">
      <el-button type="primary" @click="$router.back()">
        {{ $t('buttons.back') }}
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import BasicTable from './components/BasicTable.vue'
  import { transactionTypeEnum } from '/@/enums/transactionTypeEnum'
  import { payMethodEnum } from '/@/enums/payMethodEnum'

  const tabName = ref(payMethodEnum.COUNT)
</script>
