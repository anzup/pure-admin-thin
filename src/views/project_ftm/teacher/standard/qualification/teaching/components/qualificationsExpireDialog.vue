<template>
  <el-dialog
    width="900px"
    :title="$t('table.expireList')"
    v-model="visible"
    :close-on-click-modal="false"
    center
    @closed="freshEvent"
  >
    <VxeTable
      :data="data"
      :columns="tableColumns"
      :loading="tableLoading"
      :height="null"
      :max-height="windowHeight * 0.8"
    >
      <template #pager />
    </VxeTable>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  export default {
    components: { VxeTable },
    data() {
      return {
        tableData: [],
        tableColumns: [
          { title: this.$t('table.teacherLastName'), minWidth: 100, field: 'employeeName' }, // 教员姓名
          { title: this.$t('table.teacherType'), minWidth: 100, field: 'employeeType' }, // 教员类型
          { title: this.$t('table.teacherSource'), minWidth: 100, field: 'employeeSource' }, // 教员来源
          { title: this.$t('table.qualificationContent'), minWidth: 180, field: 'content' }, // 资质内容
          { title: this.$t('table.itsCouse'), minWidth: 120, field: 'courseName' }, // 所属课程
          { title: this.$t('table.modelNumber'), minWidth: 150, field: 'airplaneType' }, // 机型
          {
            title: this.$t('table.expirationTime'),
            minWidth: 100,
            formatter: 'formatDate',
            field: 'expireTime',
          }, // 到期时间
        ],
        tableLoading: false,
      }
    },
    props: {
      show: Boolean,
      data: Array,
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
    methods: {
      freshEvent() {},
    },
  }
</script>
