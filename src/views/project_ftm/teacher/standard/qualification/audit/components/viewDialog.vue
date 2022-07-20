<template>
  <el-dialog
    width="900px"
    :title="title"
    v-model="visible"
    :close-on-click-modal="false"
    center
    @closed="freshEvent"
  >
    <VxeTable
      :height="null"
      :max-height="windowHeight * 0.8"
      :data="tableData"
      :columns="tableColumns"
      :loading="tableLoading"
    >
      <template #form>
        <div class="ruleView-navbar">
          <span>{{ courseName }}</span>
          <span>{{ airplaneType }}</span>
        </div>
      </template>
      <template #pager />

      <template #files="{ row }">
        <ul class="ruleView-files">
          <li v-for="item in row.fileVOS" :key="item.id">
            <a @click="previewEvent(item)">{{ item.name }}{{ item.suffix }}</a>
          </li>
        </ul>
      </template>
    </VxeTable>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getQualificationProvideDetail } from '/@/api/ftm/teacher/qualification'
  import to from 'await-to-js'
  export default {
    components: { VxeTable },
    data() {
      return {
        tableData: [],
        tableColumns: [
          { title: this.$t('table.qualificationContent'), minWidth: 200, field: 'type.name' }, // 资质内容
          { title: this.$t('table.qualificationFile'), minWidth: 200, slots: { default: 'files' } }, // 资质文件
          {
            title: this.$t('table.updateTime'),
            minWidth: 120,
            field: 'lastModifiedDate',
            formatter: 'formatDate',
          }, // 更新时间
          {
            title: this.$t('table.expirationTime'),
            minWidth: 120,
            field: 'expireTime',
            formatter: 'formatDate',
          }, // 到期时间
        ],
        tableLoading: false,
      }
    },
    props: {
      show: Boolean,
      title: String,
      id: [String, Number],
      airplaneType: String,
      courseName: String,
    },
    computed: {
      windowHeight() {
        return window.innerHeight
      },
      visible: {
        get() {
          return !!this.show
        },
        set(val) {
          this.$emit('update:show', val)
        },
      },
    },
    watch: {
      visible(val) {
        val && this.searchDetailMethod()
      },
    },
    methods: {
      freshEvent() {
        this.tableData = []
      },
      async searchDetailMethod() {
        this.tableLoading = true
        const [err, res] = await to(getQualificationProvideDetail({ id: this.id }))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.qualifications
        }
      },
      previewEvent(row) {
        this.$emit('preview', row)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '/@/views/project_ftm/teacher/styles/variables.scss';
  .ruleView-navbar {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    font-size: 16px;
  }
  .ruleView-files {
    margin: 0;
    padding: 0;
    list-style: none;
    a {
      color: $elButtonBg;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
