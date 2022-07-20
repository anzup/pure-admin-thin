<template>
  <el-dialog width="600px" :title="$t('table.reasonsForRejection')" v-model="visible" center>
    <div class="remark" v-html="remark" />
  </el-dialog>
</template>

<script>
  export default {
    props: {
      show: Boolean,
      remark: String,
    },
    computed: {
      visible: {
        get() {
          return !!this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
    },
  }
</script>

<style scoped lang="scss">
  .remark {
    white-space: pre-line;
  }
</style>
