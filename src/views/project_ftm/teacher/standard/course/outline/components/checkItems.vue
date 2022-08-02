<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :buttons="tableButtons"
    v-model:form="form"
    @handlePageChange="handleCurrentChange"
  >
    <template #evaluations="{ row }">
      <span v-for="(item, index) in row.evaluations" :key="index"
        >{{ item.name }}<i v-if="index < row.evaluations.length - 1" class="spacing">|</i></span
      >
    </template>
  </VxeTable>

  <maintain
    :evaluationIdDialog="evaluationIdDialog"
    :evaluationId="evaluationId"
    :evaluations="evaluations"
    @getData="getSyllabusItems"
    @cancelDialog="cancelDialog"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import maintain from './maintainDialog.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { getSyllabusItems } from '/@/api/ftm/teacher/teachingPlan'
  export default {
    props: ['id'],
    data() {
      return {
        form: {
          page: 1,
          size: 10,
          total: 1,
          sort: undefined,
          order: 'asc',
          syllabusId: undefined,
          type: 'FLIGHT_PRACTICE',
        },
        loading: false,
        allAlign: null,
        tableData: [],
        tableColumns: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.courseName'), width: 200 },
          {
            field: 'evaluations',
            title: this.$t('table.assessmentItemDetail'),
            slots: { default: 'evaluations' },
          },
          {
            field: 'lastModifiedDate',
            title: this.$t('table.updateTime'),
            formatter: this.formatDate,
            width: 140,
          },
          { title: this.$t('table.tableEdit'), width: 100, slots: { default: 'operate' } },
        ],
        evaluationIdDialog: false,
        evaluationId: undefined,
        evaluations: [],
      }
    },
    components: { maintain, VxeTable },
    computed: {},
    created() {
      this.form.syllabusId = this.id
      this.getSyllabusItems()
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getSyllabusItems()
      },
      async getSyllabusItems() {
        this.loading = true
        let [err, res] = await to(getSyllabusItems(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
          res.data.content.length !== 0 && this.$emit('getCourse', res.data.content[0].syllabus)
        }
      },
      cancelDialog() {
        this.evaluationIdDialog = false
        this.evaluationId = undefined
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      maintain(id, evaluations) {
        this.evaluationIdDialog = true
        this.evaluationId = id
        this.evaluations = evaluations
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.maintain'),
            event: () => {
              this.maintain(row.id, row.evaluations)
            },
          },
        ]
      },
    },
  }
</script>

<style scoped>
  .spacing {
    font-style: normal;
    display: inline-block;
    margin-right: 8px;
    margin-left: 8px;
  }
</style>
