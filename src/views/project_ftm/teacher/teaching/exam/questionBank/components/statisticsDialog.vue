<template>
  <el-dialog
    v-model="show"
    width="65%"
    center
    :title="$t('table.statisticsDetail')"
    :before-close="cancel"
  >
    <div style="margin-bottom: 20px">
      <el-radio-group v-model="type" @change="getQuestionBanksStats">
        <el-radio-button label="0">{{ $t('router.questionChapter') }}</el-radio-button>
        <el-radio-button label="1">{{ $t('table.quesDifficulty') }}</el-radio-button>
        <el-radio-button label="2">{{ $t('table.importance') }}</el-radio-button>
      </el-radio-group>
    </div>
    <div>
      <VxeTable
        :height="null"
        :data="tableData"
        :loading="loading"
        :columns="tableColumns"
        :toolbarConfig="tableTools"
      >
        <template #pager />
      </VxeTable>
    </div>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getQuestionBanksStats } from '/@/api/ftm/teacher/examCenter'
  export default {
    components: { VxeTable },
    data() {
      return {
        type: '0',
        loading: false,
        tableData: [],
        tableTools: {
          enabled: false,
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
      }
    },
    computed: {
      tableColumns() {
        return [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', minWidth: '150', title: this.getTitle() },
          {
            field: 'typeCounts',
            minWidth: 90,
            title: this.$t('status.singleChoice'),
            formatter: this.formatType,
          },
          {
            field: 'typeCounts',
            minWidth: 90,
            title: this.$t('status.multipleChoice'),
            formatter: this.formatType,
          },
          {
            field: 'typeCounts',
            minWidth: 90,
            title: this.$t('status.uncertainOptions'),
            formatter: this.formatType,
          },
          {
            field: 'typeCounts',
            minWidth: 90,
            title: this.$t('status.judgmentQuestions'),
            formatter: this.formatType,
          },
          {
            field: 'typeCounts',
            minWidth: 90,
            title: this.$t('status.questionAndAnswer'),
            formatter: this.formatType,
          },
          {
            field: 'typeCounts',
            minWidth: 90,
            title: this.$t('status.completion'),
            formatter: this.formatType,
          },
          { field: 'totalCount', title: this.$t('table.total'), minWidth: 90 },
        ]
      },
      show: {
        get() {
          return this.visible
        },
        set(val) {
          this.$emit('update:visible', val)
        },
      },
    },
    props: ['visible'],
    mounted() {
      this.getQuestionBanksStats()
    },
    methods: {
      formatType(cellValue) {
        let data = cellValue.cellValue
        let columnIndex = cellValue.columnIndex
        switch (columnIndex) {
          case 2:
            return data
              .filter((item) => item.type == 'SINGLE_CHOICE')
              .map((ee) => ee.count)
              .join()
            break
          case 3:
            return data
              .filter((item) => item.type == 'MULTIPLE_CHOICES')
              .map((ee) => ee.count)
              .join()
            break
          case 4:
            return data
              .filter((item) => item.type == 'INDEFINITE_CHOICES')
              .map((ee) => ee.count)
              .join()
            break
          case 5:
            return data
              .filter((item) => item.type == 'JUDEGE')
              .map((ee) => ee.count)
              .join()
            break
          case 6:
            return data
              .filter((item) => item.type == 'QA')
              .map((ee) => ee.count)
              .join()
            break
          case 7:
            return data
              .filter((item) => item.type == 'FILL_BLANK')
              .map((ee) => ee.count)
              .join()
            break
          default:
            return ''
            break
        }
      },
      getTitle() {
        let key = this.type
        switch (key) {
          case '0':
            return this.$t('router.questionChapter')
            break
          case '1':
            return this.$t('table.quesDifficulty')
            break
          case '2':
            return this.$t('table.importance')
            break
          default:
            return ''
            break
        }
      },
      getQuestionBanksStats() {
        this.loading = true
        getQuestionBanksStats({
          bankId: this.$route.query.id,
          countType:
            this.type == '0' ? 'BY_CHAPTER' : this.type == '1' ? 'BY_DIFFICULTY' : 'BY_IMPORTANCE', // BY_CHAPTER, BY_DIFFICULTY, BY_IMPORTANCE
        })
          .then((res) => {
            this.loading = false
            let totalTypeCounts = res.data.totalTypeCounts
            totalTypeCounts.name = this.$t('table.total')
            this.tableData = res.data.nameTypeCounts
            this.tableData.push(totalTypeCounts)
          })
          .catch(() => {
            this.loading = false
          })
      },
      cancel() {
        this.$emit('close')
      },
    },
  }
</script>

<style scoped></style>
