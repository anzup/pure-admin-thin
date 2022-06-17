<template>
  <div class="contract-container">
    <Tabs v-model="tabName">
      <TabPanel :label="t('state.trainingContract')" name="TRAINING">
        <Template contract-type="TRAINING" />
      </TabPanel>
      <TabPanel :label="t('state.otherContract')" name="OTHER">
        <Template contract-type="OTHER" />
      </TabPanel>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Tabs, TabPanel } from '/@/components/Tabs'
  import Template from './components/Template.vue'

  const { t } = useI18n()
  const tabName = ref('TRAINING')
</script>
<script lang="ts">
  export default {
    name: 'contractInfoIndex',
  }
</script>

<style lang="scss" scoped>
  .contract-container {
    padding: 0 !important;
  }

  .d-tabs__content > div {
    padding: $padding16;
    height: 100%;
  }
</style>
