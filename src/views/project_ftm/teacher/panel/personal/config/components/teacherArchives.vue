<template>
  <div class="flex-vertical-box">
    <el-radio-group size="medium" v-model="activedId" class="tabs-nav">
      <el-radio-button v-for="(item, index) in cmpList" :key="index" :label="item.id">{{
        item.name
      }}</el-radio-button>
    </el-radio-group>
    <div class="flex-con">
      <component :is="activedId" :userId="userInfo.userId" :id="userInfo.id" />
    </div>
  </div>
</template>

<script>
  import archivesBasicInfo from './archivesBasicInfo.vue'
  import archivesLicense from './archivesLicense.vue'
  import archivesRecords from './archivesRecords.vue'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        activedId: 'archivesBasicInfo',
        cmpList: [
          { name: this.$t('button.basicInfo'), id: 'archivesBasicInfo' }, // 基本信息
          {
            name: `${this.$t('table.license')}/${this.$t('table.experience')}`,
            id: 'archivesLicense',
          }, // 执照/经历
          {
            name: `${this.$t('table.train')}/${this.$t('supplement.record')}`,
            id: 'archivesRecords',
          }, // 培训/记录
        ],
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    components: {
      archivesBasicInfo,
      archivesLicense,
      archivesRecords,
    },
  }
</script>

<style lang="scss" scoped>
  .flex-vertical-box {
    display: flex;
    flex-direction: column;
    .flex-con {
      flex: 1;
      width: 100%;
      overflow: hidden;
      .flex-scrollbar {
        width: 100%;
        height: 100%;
        :deep(.el-scrollbar__wrap) {
          overflow-x: hidden;
        }
      }
    }
  }
  .tabs-nav {
    margin-bottom: 16px;
  }
</style>
