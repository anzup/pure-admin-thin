<template>
  <div>
    <div style="height: 32px">
      <Tabs @tab-click="tabClick" v-model="tabActive">
        <TabPanel :label="item.name" v-for="(item, index) in roleAllList" :name="index"></TabPanel>
      </Tabs>
    </div>

    <div class="main-table-content">
      <Table :roleInfo="roleAllList[tabActive]" ref="refTable" />
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'staffManagement',
  }
</script>
<script lang="ts" setup>
  import { defineComponent, onActivated, onMounted, ref } from 'vue'
  import useList from '/@/hooks/useUser'
  import Table from './components/Table.vue'
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
  const { roleAllList, getRolesStaffList } = useList()

  onMounted(() => {
    getRolesStaffList().then((res) => {
      refTable.value.getList()
    })
  })
  onActivated(() => {
    getRolesStaffList().then((res) => {
      refTable.value.getList()
    })
  })
</script>

<style scoped lang="scss">
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
