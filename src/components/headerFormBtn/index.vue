<template>
  <el-button type="primary" @click="submit('confirm')">{{ $t('buttons.inquiry') }}</el-button>
  <el-button plain type="primary" @click="submit('reset')">{{ $t('buttons.reset') }}</el-button>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'HeaderFormBtn',
    emits: ['submit'],
    setup(props, { emit }) {
      const submit = (type) => {
        emit('submit', type)
      }
      return {
        submit,
      }
    },
  })
</script>

<style scoped></style>
