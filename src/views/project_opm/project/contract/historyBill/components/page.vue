<template>
  <div id="itemRef" style="dispaly: none">
    <PrintItem type="WET_LEASE" :detailData="detailData" ref="wetref" />
    <PrintItem type="DRY_LEASE" :detailData="detailData" ref="dryref" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue'
  import PrintItem from './printItem.vue'
  export default defineComponent({
    components: {
      PrintItem,
    },
    props: {
      detailData: {
        type: Object,
        default: () => ({}),
      },
    },
    setup() {
      const dryref = ref(),
        wetref = ref()

      const getContent = async () => {
        const res = await dryref.value.getContent()
        const conten = await wetref.value.getContent()
        return conten + res
      }
      return {
        getContent,
        dryref,
        wetref,
      }
    },
  })
</script>

<style scoped></style>
