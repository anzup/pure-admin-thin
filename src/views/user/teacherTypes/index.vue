<template>
  <Page v-bind="form" />
</template>

<script setup lang='ts'>
import { reactive } from 'vue'
import Page, { Props as PageProps } from '/@/components/ConfigPage/index.vue';
import {
  getTeacherTypesList,
  postTeacherTypes,
  putTeacherTypesId,
  deleteTeacherTypesId,
} from '/@/api/teacherTypes'
const form = reactive<PageProps>({
  api: {
    getList: getTeacherTypesList,
    postData: postTeacherTypes,
    putData: putTeacherTypesId,
    deleteData: deleteTeacherTypesId
  }
})

</script>

<style scoped lang="scss">
.main-content {
  padding: 0 !important;
}
</style>