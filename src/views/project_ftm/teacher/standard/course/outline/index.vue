<template>
  <VxeTable
    ref="xTable"
    :data="tableData"
    :loading="tableLoading"
    :columns="tableColumns"
    :buttons="tableButtons"
    v-model:form="form"
    :toolbar-config="tableTools"
    @checkbox="selectChangeEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form ref="form" :model="form" inline size="medium">
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseEnterTheCourseName')"
            v-model="form.searchKey"
            style="width: 280px"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #right_tools>
      <el-button
        v-if="containsPermissions(menuName + ':ADD')"
        size="mini"
        type="primary"
        @click="add"
        >{{ $t('button.add') }}</el-button
      >
      <el-button
        v-if="containsPermissions(menuName + ':BULK_DELETION')"
        size="mini"
        type="danger"
        :disabled="records.length == 0"
        @click="postSyllabusesBatchDelete"
        >{{ $t('button.batchDeletion') }}</el-button
      >
    </template>

    <template #modelNumber="{ row }">
      <span class="word-line" v-if="row.course && row.course.airplaneTypes">{{
        row.course.airplaneTypes.join(', ')
      }}</span>
    </template>
    <template #courseSection="{ row }"
      >{{ row.practiceCount }} {{ row.examCount > 0 ? ` + ${row.examCount}` : '' }}</template
    >
    <template #practicePeriods="{ row }">{{
      (parseInt(row.practiceExamPeriods) || 0) + (parseInt(row.practicePeriods) || 0)
    }}</template>
  </VxeTable>

  <component :is="componentName" :id="activeName" />

  <!-- 新增大纲 -->
  <add-syllabuses-dialog
    :title="syllabuseTitle"
    :syllabusesDialog="syllabusesDialog"
    :syllabusesId="syllabusesId"
    @cancelDialog="cancelDialog"
    @getData="getSyllabuses"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import addSyllabusesDialog from './components/addSyllabusesDialog.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import {
    getSyllabuses,
    deleteSyllabusesId,
    postSyllabusesBatchDelete,
  } from '/@/api/ftm/teacher/teachingPlan'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { deleteEmptyParams } from '/@/utils/index'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        menuName: 'SYLLABUS',
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: undefined,
          order: 'asc',
          searchKey: undefined,
        },
        id: undefined,
        syllabusesId: undefined,
        allAlign: null,
        records: [],
        activeName: '',
        componentName: '',
        syllabuseTitle: '',
        syllabusesDialog: false,
        tableLoading: false,
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: '40' },
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'course.code', title: this.$t('table.codeOfTrainingCourses'), width: '140' },
          { field: 'shortName', title: this.$t('table.outlineName'), width: '140' },
          { field: 'version', title: this.$t('table.versionNumber'), minWidth: 120 },
          { field: 'airplaneType', title: this.$t('table.modelNumber'), width: 200 },
          {
            title: this.$t('table.courseSection'),
            slots: { default: 'courseSection' },
            width: 150,
          },
          { field: 'theoryPeriods', title: this.$t('table.theoryTrainHours'), width: '140' },
          {
            title: this.$t('table.simulatorTrainHours'),
            width: '140',
            slots: { default: 'practicePeriods' },
          },
          {
            field: 'lastModifiedDate',
            title: this.$t('table.updateTime'),
            width: '140',
            formatter: this.formatDate,
          },
          { title: this.$t('table.tableEdit'), slots: { default: 'operate' }, width: 210 },
        ],
      }
    },
    components: {
      VxeTable,
      selectedView,
      addSyllabusesDialog,
      Search,
    },
    computed: {
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
    },
    created() {},
    // TODO 原缓存页面执行activated
    mounted() {
      this.getSyllabuses()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      selectAllEvent({ checked, records }) {
        checked ? (this.records = XEUtils.map(records, (item) => item.id)) : (this.records = [])
      },
      selectChangeEvent({ checked, records }) {
        this.records = XEUtils.map(records, (item) => item.id)
      },
      getClearAll() {
        this.xTable?.clearSelectEvent()
        this.records = []
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getSyllabuses()
      },
      async getSyllabuses() {
        this.tableLoading = true
        this.form = deleteEmptyParams(this.form)
        let [err, res] = await to(getSyllabuses(this.form))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
          this.getClearAll()
        }
      },
      add() {
        this.syllabuseTitle = this.$t('button.add')
        this.syllabusesDialog = true
        this.syllabusesId = null
      },
      modify(id) {
        this.syllabuseTitle = this.$t('button.modify')
        this.syllabusesDialog = true
        this.syllabusesId = id
      },
      management(id) {
        this.routerGo(`outline/administer?id=${id}`)
      },
      cancelDialog() {
        this.syllabusesDialog = false
        this.syllabusesId = undefined
      },
      deleteSyllabusesId(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteSyllabusesId({ id: id }).then((res) => {
            if (res.status == 200) {
              if (
                parseInt(this.form.total / this.form.size) < this.form.page &&
                this.form.page !== 1
              ) {
                this.form.page = parseInt(this.form.total / this.form.size)
              }
              this.$message.success(this.$t('tip.delsuccessTip'))
              this.getSyllabuses()
            }
          })
        })
      },
      postSyllabusesBatchDelete() {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        })
          .then(() => {
            postSyllabusesBatchDelete({ ids: this.records }).then((res) => {
              if (res.status == 200) {
                this.getSyllabuses()
                this.$message.success(this.$t('tip.delsuccessTip'))
              }
            })
          })
          .catch((_) => {})
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.getSyllabuses()
      },
      containsPermissions(key) {
        return userStore.ContainsPermissions(key)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.management'),
            visible: userStore.ContainsPermissions(this.menuName + ':MANAGE'),
            event: () => {
              this.management(row.id)
            },
          },
          {
            name: this.$t('button.modify'),
            visible: userStore.ContainsPermissions(this.menuName + ':UPDATE'),
            event: () => {
              this.modify(row.id)
            },
          },
          {
            name: this.$t('button.delete'),
            status: 'danger',
            visible: userStore.ContainsPermissions(this.menuName + ':DELETE'),
            event: () => {
              this.deleteSyllabusesId(row.id)
            },
          },
        ]
      },
    },
  }
</script>

<style scoped lang="scss">
  .word-line {
    word-break: keep-all;
  }
</style>
