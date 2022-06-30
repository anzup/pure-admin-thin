<template>
  <Page v-bind="form" />
</template>

<script setup lang='ts'>
import { reactive } from 'vue'
import Page, { Props as PageProps } from '/@/components/ConfigPage/index.vue';
import {
  getTeacherTeamsList,
  postTeacherTeams,
  putTeacherTeamsId,
  deleteTeacherTeamsId,
} from '/@/api/teacherTeams'
const form = reactive<PageProps>({
  api: {
    getList: getTeacherTeamsList,
    postData: postTeacherTeams,
    putData: putTeacherTeamsId,
    deleteData: deleteTeacherTeamsId
  }
})

</script>

<style scoped lang="scss">
.main-content {
  padding: 0 !important;
}
</style>