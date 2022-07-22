<template>
  <el-scrollbar>
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
      <vxe-table-column field="name" :title="$t('table.sourse')" />
      <vxe-table-column
        v-for="config in tableColumns"
        :key="config.key"
        :title="config.title"
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
</template>

<script>
  import { coreCapabilityScoreStats } from '/@/api/ftm/teacher/studentTraining'
  export default {
    name: 'CoreCompetenceStatistics',
    data() {
      return {
        tableData: [],
        tableColumns: [],
        loading: false,
        pagination: {
          // 表格分页信息
          page: 1,
          size: 10,
          total: 0,
        },
      }
    },
    props: {
      details: {},
      clazz: {},
    },
    created() {
      this.getData()
    },
    methods: {
      async getData() {
        let param = {
          clazzId: this.clazz.id,
          studentId: this.details.id,
          // recordType: this.recordType?this.recordType:undefined,
        }
        this.loading = true
        let { data } = await coreCapabilityScoreStats(param).catch(() => {
          this.loading = false
        })
        this.loading = false
        let courseScores = data.courseScores
        let totalScores = data.totalScores
        let averageScores = data.averageScores
        courseScores.push({
          id: 'total',
          name: this.$t('table.totalScoresNum'),
          scores: totalScores,
        })
        courseScores.push({
          id: 'average',
          name: this.$t('table.averageScoresNum'),
          scores: averageScores,
        })
        this.tableData = data.courseScores

        let names = data.names
        this.tableColumns = []
        names.forEach((item) => {
          this.tableColumns.push({
            key: item.id,
            title: item.name,
          })
        })
      },
    },
  }
</script>
