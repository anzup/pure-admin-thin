<template>
  <modify-view :examsInfo="info" v-if="info" />
  <div v-else v-loading="true" />
</template>

<script>
  import modifyView from './add.vue'
  import to from 'await-to-js'
  import { getpExamTemplate } from '/@/api/ftm/teacher/examCenter'
  export default {
    data() {
      return {
        info: null,
      }
    },
    components: {
      modifyView,
    },
    async created() {
      let { id } = this.$route.params
      let [err, res] = await to(getpExamTemplate({ id }))
      if (!err) {
        this.info = res.data
      }
    },
  }
</script>
