<template>
  <file-manage :handleOptions="handleOptions" :hasDownload="false" rootName="READ_PREVIEW" />
</template>

<script>
  import fileManage from '/@/views/project_ftm/teacher/components/FileManage/index.vue'
  export default {
    computed: {
      handleOptions() {
        return [
          {
            label: 'download',
            disabled: true,
          },
        ]
      },
    },
    components: { fileManage },
  }
</script>
