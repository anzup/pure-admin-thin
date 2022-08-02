<template>
  <el-dialog
    width="900px"
    center
    :title="title"
    :close-on-click-modal="false"
    v-model="visible"
    @closed="closedEvent"
  >
    <el-radio-group size="medium" v-model="activedId" class="tabs-nav">
      <el-radio-button v-for="(item, index) in cmpList" :key="index" :label="item.id">{{
        item.name
      }}</el-radio-button>
    </el-radio-group>
    <components :is="activedId" :userId="userId" :id="id" />
  </el-dialog>
</template>

<script>
  import archivesBasicInfo from '/@/views/project_ftm/teacher/panel/personal/config/components/archivesBasicInfo.vue'
  import archivesLicense from '/@/views/project_ftm/teacher/panel/personal/config/components/archivesLicense.vue'
  import archivesRecords from '/@/views/project_ftm/teacher/panel/personal/config/components/archivesRecords.vue'
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
    props: {
      value: {},
      userId: [String, Number],
      id: [String, Number],
    },
    components: {
      archivesBasicInfo,
      archivesLicense,
      archivesRecords,
    },
    computed: {
      visible: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('update:modelValue', val)
        },
      },
      title() {
        return this.cmpList.find((item) => item.id === this.activedId).name
      },
    },
    methods: {
      closedEvent() {
        this.$emit('closed')
      },
    },
  }
</script>
