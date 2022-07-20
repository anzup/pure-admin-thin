<template>
  <el-tabs class="full-screen" v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane v-for="item in tabsList" :key="item.id" :label="item.code" :name="item.id + ''">
      <listTable v-if="activeName == item.id" :course="currentCourse" :roles="roles" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import listTable from './listTable.vue'
  import { getQualificationRoles } from '/@/api/ftm/teacher/qualification'
  import { getCourses } from '/@/api/ftm/teacher/trainingPlan'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        activeName: '',
        tabsList: [],
        roles: [],
      }
    },
    components: { listTable },
    computed: {
      currentCourse() {
        return this.tabsList.find((item) => item.id == this.activeName) || {}
      },
    },
    created() {
      this.getCourses()
      this.getQualificationRoles()
    },
    methods: {
      async getCourses() {
        const [err, res] = await to(getCourses({ page: 1, size: 1000 }))
        if (!err && res.status == 200 && res.data.content.length > 0) {
          this.tabsList = res.data.content
          this.activeName = this.tabsList[0].id + ''
        }
      },
      // 获取职位
      async getQualificationRoles() {
        const [err, res] = await to(getQualificationRoles())
        if (!err && res.status == 200) {
          this.roles = res.data
        }
      },
      handleClick() {},
    },
  }
</script>

<style lang="scss" scoped>
  .full-screen {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    :deep(.el-tabs__content) {
      flex: 1;
    }
    :deep(.el-tabs__header) {
      padding-left: 0;
      padding-right: 0;
    }
    :deep(.el-tab-pane) {
      width: 100%;
      height: 100%;
    }
  }
</style>
