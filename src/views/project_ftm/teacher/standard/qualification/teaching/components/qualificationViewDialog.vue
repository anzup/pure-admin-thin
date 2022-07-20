<template>
  <el-dialog
    :title="title"
    v-model="visible"
    top="10vh"
    width="800px"
    modal
    center
    @closed="freshEvent"
  >
    <iframe
      v-if="/pdf/i.test(fileType)"
      width="100%"
      :height="computeHeight"
      scrolling="auto"
      allowfullscreen
      webkitallowfullscreen
      :src="officeUrl"
    />
    <div v-else class="preview-image">
      <img :src="previewUrlMethod(uuid)" alt="" />
    </div>

    <template #footer v-if="list.length > 1">
      <el-button type="primary" :disabled="disabledPrev" size="small" @click="prveEvent">{{
        $t('button.prev')
      }}</el-button>
      <span>{{ $t('supplement.pageNumber').replace(/\{num\}/g, currentIndex + 1) }}</span>
      <el-button type="primary" :disabled="disabledNext" size="small" @click="nextEvent">{{
        $t('button.next')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  export default {
    data() {
      return {
        currentIndex: 0,
      }
    },
    props: {
      title: String,
      show: Boolean,
      list: {
        type: Array,
        default: () => [],
      },
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
      uuid() {
        return typeof this.list[this.currentIndex] == 'string'
          ? this.list[this.currentIndex]
          : typeof this.list[this.currentIndex] == 'object' && this.list[this.currentIndex].uuid
          ? this.list[this.currentIndex].uuid
          : ''
      },
      fileType() {
        try {
          return this.list[this.currentIndex].fileType
        } catch (e) {
          return ''
        }
      },
      officeUrl() {
        let url = `${import.meta.env.VITE_BASE_API_PUB}/open/${this.uuid}/inline`
        return `pdf/web/viewer.html?file=${encodeURIComponent(url)}`
      },
      computeHeight() {
        return parseInt((600 - 40) / (639 / 800)) + 'px'
      },
      disabledPrev() {
        return this.currentIndex == 0
      },
      disabledNext() {
        return this.currentIndex == this.list.length - 1 || this.list.length == 0
      },
    },
    methods: {
      prveEvent() {
        this.currentIndex -= 1
      },
      nextEvent() {
        this.currentIndex += 1
      },
      freshEvent() {
        this.currentIndex = 0
      },
      previewUrlMethod(uuid) {
        return previewURL(uuid)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .buttons {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .preview-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 500px;
    background: #666;
    img {
      max-width: 100%;
    }
  }
</style>
