<template>
  <VxeTable
    ref="xTable"
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    v-model:form="form"
    :toolbarConfig="tableTools"
    :buttons="tableButtons"
    @checkbox="selectChangeEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form ref="form" :model="form" inline size="medium">
        <el-form-item :label="$t('table.date')">
          <hyx-date-picker v-model="form.dateTime" />
        </el-form-item>
        <!-- <el-form-item :label="$t('table.examType')">
            <el-select v-model="form.examTypeId" :placeholder="$t('holder.pleaseSelect')" style="width:160px" clearable>
              <el-option :label="item.name" :value="item.id" v-for="item in propertyList" :key="item.index"></el-option>
            </el-select>
          </el-form-item> -->
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseEnter') + $t('table.examCategory')"
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

    <template #startDate="{ row }">
      <span class="date-range"
        >{{ formatDate(row.startDate) }} - {{ formatDate(row.endDate) }}</span
      >
    </template>
  </VxeTable>
</template>

<script>
  import XEUtils from 'xe-utils'
  import VxeTable from '/@/components/Table/index.vue'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import HyxDatePicker from '/@/views/project_ftm/teacher/components/HyxDatePicker/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import { getExamTypesAll, getListByexamType } from '/@/api/ftm/teacher/examCenter'
  import { deleteEmptyParams } from '/@/utils/index'
  import to from 'await-to-js'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useUserStore } from '/@/store/modules/user'
  const userStore = useUserStore()
  export default {
    data() {
      return {
        allAlign: null,
        loading: false,
        records: [],
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: 'startDate',
          order: 'desc',
          dateTime: [new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), new Date()],
          startDate: '',
          endDate: '',
          examTypeId: undefined,
          createdBy: undefined,
        },
        propertyList: [],
        confidentialList: [
          { id: 'PUBLIC', name: this.$t('status.publicQuestionBank') },
          { id: 'CONFIDENTIAL', name: this.$t('status.confidentialQuestionBank') },
        ],
        tableTools: {
          enabled: false,
          perfect: true,
          slots: {},
        },
        tableData: [],
        tableColumns: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.examCategory'), minWidth: 90 },
          { field: 'examCount', title: this.$t('table.examTimes'), minWidth: 90 },
          // { field: "examRecordCount", title: this.$t('table.candidatesNum'), minWidth: 90 },
          { field: 'examRecordCount', title: this.$t('table.examActualNum'), minWidth: 90 },
          { field: 'examRecordPassCount', title: this.$t('table.passPeopleNum'), minWidth: 90 },
          {
            field: 'examRecordPassRate',
            title: this.$t('table.passRate'),
            formatter: this.formatPassRate,
            minWidth: 90,
          },
          { title: this.$t('table.tableEdit'), width: 80, slots: { default: 'operate' } },
        ],
      }
    },
    components: { selectedView, VxeTable, HyxDatePicker, Search },
    computed: {
      userInfo() {
        return userStore.userInfo
      },
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
    },
    created() {
      this.getExamTypeAll()
    },
    mounted() {
      this.form.createdBy = this.userInfo.userId
      this.getExams()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      selectChangeEvent({ records }) {
        this.records = XEUtils.map(records, (item) => item.id)
      },
      getClearAll() {
        this.xTable.clearSelectEvent()
        this.records = []
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getExams()
      },
      // 考试类型下拉菜单
      async getExamTypeAll() {
        let [err, res] = await to(getExamTypesAll())
        if (!err) {
          this.propertyList = res.data
        }
      },
      getExams() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        this.form.startDate = this.form.dateTime ? this.form.dateTime[0] : ''
        this.form.endDate = this.form.dateTime ? this.form.dateTime[1] : ''
        getListByexamType(this.form)
          .then((res) => {
            if (res.status == 200) {
              this.tableData = res.data.content
              this.form.total = res.data.totalElements
              this.loading = false
              this.getClearAll()
            }
          })
          .catch(() => {
            this.loading = false
          })
      },
      formatDate(cellValue) {
        return XEUtils.toDateString(cellValue, 'yyyy/MM/dd HH:mm:ss')
      },
      formatPassRate({ cellValue }) {
        return cellValue ? (Number(cellValue) * 100).toFixed(2) + '%' : 0
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      formatStatus({ cellValue }) {
        if (cellValue == 'EXAMING') {
          return this.$t('status.inProgress')
        } else if (cellValue == 'FINISHED') {
          return this.$t('status.finished')
        } else {
          return this.$t('status.notStarted')
        }
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        if (!this.form.dateTime || !this.form.dateTime.length) {
          this.$message.warning(this.$t('holder.pleaseSelect') + this.$t('table.date'))
          return
        }
        this.getExams()
      },
      detail(row) {
        const startDate = XEUtils.toDateString(this.form.dateTime[0], 'yyyy-MM-dd HH:mm:ss') || ''
        const endDate = XEUtils.toDateString(this.form.dateTime[1], 'yyyy-MM-dd HH:mm:ss') || ''
        this.routerGo(`statistical/details?id=${row.id}&startDate=${startDate}&endDate=${endDate}`)
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            event: () => {
              this.detail(row)
            },
          },
        ]
      },
    },
  }
</script>

<style scoped lang="scss">
  .date-range {
    word-break: keep-all;
  }
</style>
