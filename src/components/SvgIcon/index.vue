<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" />
    <title>{{ title }}</title>
  </svg>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon',
      },
      name: {
        type: String,
        required: true,
      },
      title: {
        type: String,
      },
    },
    setup(props) {
      const symbolId = computed(() => `#${props.prefix}-${props.name}`)
      return { symbolId }
    },
  })
</script>

<style scope>
  .svg-icon {
    width: 0.75em;
    height: 0.75em;
    fill: currentColor;
    vertical-align: middle;
  }
</style>
