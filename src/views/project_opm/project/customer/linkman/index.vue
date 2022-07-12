<template>
  <el-tabs v-model="tabname" style="height: 100%">
    <el-tab-pane v-for="tab in roleAllList" :key="tab.roleId" :label="tab.name">
      <component :is="tab.cmp" :roleInfo="tab" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue'
  import useList from './components/useList'
  import Cmp from './cmp.vue'
  export default defineComponent({
    name: 'AccountIndex',
    components: {
      Cmp,
    },
    setup() {
      const tabname = ref(undefined)
      const { roleAllList, getRolesAllList } = useList()

      onMounted(() => {
        getRolesAllList()
      })
      return {
        tabname,
        roleAllList,
      }
    },
  })
</script>

<style scoped lang="scss">
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
