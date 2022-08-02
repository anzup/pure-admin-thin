<template>
  <el-dialog :title="title" v-model="visible" top="10vh" width="800px" modal center>
    <iframe
      v-if="/pdf/i.test(fileType)"
      width="100%"
      :height="computeHeight"
      scrolling="auto"
      allowfullscreen
      webkitallowfullscreen
      :src="officeUrl"
    />
    <div class="preview-image" v-else>
      <img :src="previewUri" alt="" />
    </div>
  </el-dialog>
</template>

<script>
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  export default {
    props: {
      title: String,
      show: Boolean,
      uuid: String,
      fileType: String,
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
      officeUrl() {
        let url = `${import.meta.env.VITE_BASE_API_PUB}/open/${this.uuid}/inline`
        return `pdf/web/viewer.html?file=${encodeURIComponent(url)}`
      },
      computeHeight() {
        return parseInt((600 - 40) / (639 / 800)) + 'px'
      },
      previewUri() {
        return previewURL(this.uuid)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .preview-image {
    display: flex;
    width: 100%;
    min-height: 500px;
    align-items: center;
    justify-content: center;
    background: #666;
    img {
      max-width: 100%;
    }
  }
</style>
