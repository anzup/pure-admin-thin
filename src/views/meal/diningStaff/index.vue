<template>
  <div class="!p-0">
    <Tabs>
      <TabPanel v-for="item in roleAllList" :key="item.id" :label="item.name">
        <Template
          :builtinRoles="item.builtinRole ?? ''"
          :departmentList="departmentList"
          :roleId="item.id"
        />
      </TabPanel>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import Template from './components/Template.vue'

  import useUser from '/@/hooks/useUser'
  import useDepartment from '/@/hooks/useDepartment'

  const { getRolesList, roleAllList, rolesForm } = useUser()
  const { getDepartmentList, departmentList } = useDepartment()

  onMounted(async () => {
    await getDepartmentList()
    rolesForm.order = 'asc'
    await getRolesList()
  })
</script>

<style scoped>
  .d-tab-pane {
    height: 100%;
    padding: 16px;
  }
</style>
