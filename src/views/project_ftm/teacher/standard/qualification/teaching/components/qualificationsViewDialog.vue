<template>
  <el-dialog
    :title="title"
    v-model="visible"
    :close-on-click-modal="false"
    top="10vh"
    width="900px"
    height="100vh"
    modal
    center
    @closed="freshEvent"
  >
    <div class="content">
      <div class="table">
        <VxeTable
          :data="list"
          :columns="columns"
          :row-class-name="currentRowClass"
          :height="null"
          :max-height="computeHeight"
        >
          <template #pager />
          <template #version="{ row }">
            <span class="link-btn" @click="changeCurrentItem(row)">{{ row.version }}</span>
          </template>
        </VxeTable>
      </div>
      <section>
        <template v-if="currentUUID">
          <iframe
            v-if="/pdf/i.test(currentFileType)"
            width="550px"
            :height="computeHeight"
            scrolling="auto"
            allowfullscreen
            webkitallowfullscreen
            :src="officeUrl"
          />
          <div class="image-preview" v-else>
            <img :src="previewUrlMethod(currentUUID)" alt="" />
          </div>

          <div class="buttons" v-if="fileList.length > 1">
            <el-button type="primary" :disabled="disabledPrev" size="small" @click="prveEvent">{{
              $t('button.prev')
            }}</el-button>
            <span>{{ $t('supplement.pageNumber').replace(/\{num\}/g, currentFileIndex + 1) }}</span>
            <el-button type="primary" :disabled="disabledNext" size="small" @click="nextEvent">{{
              $t('button.next')
            }}</el-button>
          </div>
        </template>
        <template v-else>
          <div class="empty-nothing">
            <img :src="require('@/assets/404_images/nothing.png')" alt="" />
            <p>{{ $t('tip.emptyQualificationFile') }}</p>
          </div>
        </template>
      </section>
    </div>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { previewURL } from '/@/api/ftm/teacher/personCenter'
  export default {
    components: { VxeTable },
    data() {
      return {
        columns: [
          {
            title: this.$t('table.versionNumber'),
            field: 'version',
            minWidth: 120,
            slots: { default: 'version' },
          },
          {
            title: this.$t('table.expirationTime'),
            field: 'checkDate',
            minWidth: 120,
            formatter: 'formatDate',
          },
        ],
        currentFileIndex: 0,
        currentRowIndex: 0,
      }
    },
    props: {
      title: String,
      show: Boolean,
      list: Array,
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
      computeHeight() {
        return parseInt(550 / (639 / 800)) + 'px'
      },
      fileList() {
        return (this.list[this.currentRowIndex] || {}).attachments || []
      },
      fileVOList() {
        return (this.list[this.currentRowIndex] || {}).fileVOS || []
      },
      disabledPrev() {
        return this.currentFileIndex == 0
      },
      disabledNext() {
        return this.currentFileIndex == this.fileList.length - 1 || this.fileList.length == 0
      },
      currentUUID() {
        return this.fileList[this.currentFileIndex] || ''
      },
      currentFileType() {
        return (this.fileVOList[this.currentFileIndex] || {}).fileType || ''
      },
      currentItem() {
        return this.list[this.currentRowIndex] || {}
      },
      officeUrl() {
        let url = `${import.meta.env.VITE_BASE_API_PUB}/open/${this.currentUUID}/inline`
        return `pdf/web/viewer.html?file=${encodeURIComponent(url)}`
      },
    },
    methods: {
      currentRowClass({ rowIndex }) {
        return rowIndex == this.currentRowIndex ? 'current-row' : ''
      },
      changeCurrentItem(row) {
        this.currentRowIndex = this.list.findIndex((v) => v.id == row.id)
        this.currentFileIndex = 0
      },
      prveEvent() {
        this.currentFileIndex -= 1
      },
      nextEvent() {
        this.currentFileIndex += 1
      },
      freshEvent() {
        this.currentRowIndex = 0
        this.currentFileIndex = 0
      },
      previewUrlMethod(uuid) {
        return previewURL(uuid)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .content {
    display: flex;
    align-items: flex-start;
    .table {
      flex: 1;
      margin-right: 20px;
    }
    section {
      width: 550px;
    }
    :deep(.current-row) {
      background: rgba($color: #e6a23c, $alpha: 0.3);
    }
    .link-btn {
      color: #409eff;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .image-preview {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      min-height: 500px;
      background: #666;
      img {
        max-width: 100%;
      }
    }
    .empty-nothing {
      width: 550px;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      img {
        width: 200px;
        object-fit: contain;
      }
      P {
        width: 100%;
        text-align: center;
      }
    }
    .buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
