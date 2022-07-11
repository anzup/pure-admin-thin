<template>
  <Contract :valid="false" />
</template>

<script lang="ts">
  import Contract from './contract.vue'
  export default {
    components: {
      Contract,
    },
    setup() {
      return {}
    },
  }
</script>

<style scoped></style>
