<template>
  <div>
    <div style="height: 32px">
      <Tabs v-model="tabActive" @tab-click="tabClick">
        <TabPanel
          v-for="(item, index) in roleAllList"
          :key="index"
          :label="item.name"
          :name="index"
        />
      </Tabs>
    </div>

    <!--<div class="main-table-content">-->
    <!--  <Table ref="refTable" :roleInfo="roleAllList[tabActive]" />-->
    <!--</div>-->
  </div>
</template>

<script lang="ts">
  export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Staff',
  }
</script>
<script lang="ts" setup>
  import { onActivated, onMounted, ref } from 'vue'
  import useUser from '/@/hooks/useUser'
  // import Table from './components/Table.vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'

  const refTable = ref()
  const tabActive = ref(0)
  const tabClick = (val) => {
    setTimeout(() => {
      refTable.value.form.page = 1
      refTable.value.gridOptions.columns = refTable.value.getColumns
      refTable.value.submit('reset')
    }, 0)
  }
  const { roleAllList, getRolesStaffList } = useUser()

  onMounted(() => {
    getRolesStaffList().then((res) => {
      refTable.value.getList()
    })
  })
  onActivated(async () => {
    await getRolesStaffList()
    refTable.value.getList()
  })
</script>

<style lang="scss" scoped>
  .main-content {
    padding: 0 !important;
  }

  .main-table-content {
    padding: $padding16;
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
