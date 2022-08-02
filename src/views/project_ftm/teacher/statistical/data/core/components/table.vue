<template>
  <div class="container-tab">
    <el-scrollbar>
      <p class="title">{{ $t('table.coreCompetenceAverageStatistics') }}</p>
      <vxe-table
        border
        size="medium"
        class="mytable-style"
        header-cell-class-name="headerCellClassName"
        row-class-name="rowClassName"
        align="center"
        :loading="loading"
        :data="tableData"
      >
        <vxe-table-column
          field="name"
          :title="$t('table.sourse')"
          :minWidth="140"
          v-if="type == 'lineEchart1'"
          fixed="left"
        />
        <vxe-table-column
          field="name"
          :title="$t('table.classNumber')"
          :minWidth="140"
          v-if="type == 'lineEchart2'"
          fixed="left"
        />
        <vxe-table-column
          v-for="config in tableColumns"
          :key="config.key"
          :title="config.title"
          :minWidth="60"
          :field="config.field"
        >
          <template #default="{ row }">
            <span v-for="e in row.scores" :key="e.id">
              <span v-if="e.id == config.key">{{ e.score === null ? '-' : e.score }} </span>
            </span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-scrollbar>
  </div>
</template>

<script>
  import { coreCapabilityAverageScoreStats } from '/@/api/ftm/teacher/studentTraining'
  import { toISODateTime } from '/@/utils/index'
  export default {
    data() {
      return {
        tableData: [],
        tableTools: {
          enabled: false,
          perfect: true,
          slots: {},
        },
        tableColumns: [],
        loading: false,
        loadingExport: false,
        pagination: {
          // 表格分页信息
          page: 1,
          size: 10,
          total: 0,
        },
      }
    },
    props: {
      formInline: {},
      type: '',
    },
    mounted() {
      // this.getData();
    },
    methods: {
      getData(flag) {
        if (!this.formInline.daterange || !this.formInline.courseId) {
          if (flag) {
            this.$message.warning(this.$t('holder.pleaseSelectDateAndCourse'))
          }
          return
        }
        let startDate = this.formInline.daterange[0]
        startDate.setHours(0)
        startDate.setMinutes(0)
        startDate.setSeconds(0)
        let endDate = this.formInline.daterange[1]
        endDate.setHours(23)
        endDate.setMinutes(59)
        endDate.setSeconds(59)
        coreCapabilityAverageScoreStats({
          courseId: this.formInline.courseId,
          startTime: toISODateTime(startDate),
          endTime: toISODateTime(endDate),
          type: this.type == 'lineEchart1' ? 'BY_CUSTOMER' : 'BY_CLAZZ', // BY_CLAZZ, BY_CUSTOMER
        }).then((res) => {
          let data = res.data
          this.tableData = data.courseScores
          let names = data.names
          this.tableColumns = []
          names.forEach((item) => {
            this.tableColumns.push({
              key: item.id,
              title: item.name,
            })
          })
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .container-tab {
    height: 100%;
    //height: calc(var(--contentHeight) - 68px - 32px - 50px - 32px);
    .title {
      font-size: 20px;
      color: rgb(79, 129, 189);
      text-align: center;
      font-weight: 700;
      margin-top: -40px;
    }
  }
</style>
