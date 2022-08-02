<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :buttons="tableButtons"
    v-model:form="form"
    @checkbox="selectChangeEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <div class="outlineInfos">
        <span>{{ $t('table.coursewareName') }}: {{ courseware.name }}</span>
        <span>{{ $t('table.coursewareType') }}: {{ formatType(courseware.type) }}</span>
        <!-- <span>{{ $t("router.coursewareClassification") }}: </span> -->
        <el-button
          type="primary"
          size="medium"
          :disabled="!records || !records.length"
          @click="exportCount"
          >{{ $t('button.batchExport') }}</el-button
        ><!-- 下载 -->
      </div>
    </template>
  </VxeTable>
</template>
<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { formatTime } from '/@/utils/index'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { coursewareExport } from '/@/api/ftm/teacher/courseware'
  import {
    getCoursewareAssignmentReadRecords,
    deleteCoursewareAssignmentReadRecordsId,
  } from '/@/api/ftm/teacher/courseware'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: { VxeTable },
    data() {
      return {
        form: {
          searchKey: undefined,
          page: 1,
          size: 10,
          total: 0,
          assignmentId: undefined,
          createdBy: undefined,
          courseNumber: undefined,
        },
        id: undefined,
        loading: false,
        tableData: [],
        coursewareTypeList: [
          { id: 'PUBLIC', name: this.$t('table.openCourseware') },
          { id: 'THIRD_PARTY', name: this.$t('table.thirdPartyCourseware') },
          { id: 'SELF', name: this.$t('table.ownCourseware') },
        ],
        records: [],
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      tableColumns() {
        let { isByStudent } = this.$route.query
        return [
          { type: 'checkbox', width: 40 },
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'assignee.name', title: this.$t('table.studentName'), minWidth: 120 },
          {
            field: 'assignment.courseware.name',
            title: this.$t('table.coursewareTitle'),
            minWidth: 120,
          },
          {
            field: 'assignment.courseware.type',
            title: this.$t('table.coursewareType'),
            formatter: this.formatTypes,
            width: 90,
          },
          {
            field: 'assignment.courseware.creator.name',
            title: this.$t('table.coursewarePublisher'),
            width: 90,
          },
          {
            field: 'status',
            formatter: this.formatStatus,
            title: this.$t('table.readingStatus'),
            width: 150,
          },
          {
            field: 'createdDate',
            title: this.$t('table.assignedTime'),
            formatter: this.formatDate,
            width: 180,
          },
          // isByStudent ? { field: "createdDate", title: this.$t('table.startReadingTime'), formatter: this.formatDate, width: 180 }: null,
          {
            field: 'startDate',
            title: this.$t('table.startTime'),
            formatter: this.formatDate,
            width: 180,
          },
          {
            field: 'finishDate',
            title: this.$t('table.endTime'),
            formatter: this.formatDate,
            width: 180,
          },
          {
            field: 'readDuration',
            title: this.$t('table.readDuration'),
            formatter: this.formatDuration,
            width: 180,
          },
          {
            field: 'lastReadTime',
            title: this.$t('table.lastReadTime'),
            formatter: this.formatDate,
            width: 180,
          },
          !isByStudent
            ? { title: this.$t('table.tableEdit'), width: 120, slots: { default: 'operate' } }
            : null,
        ].filter((v) => Boolean(v))
      },
      courseware() {
        try {
          return {
            name: this.tableData[0].assignment.courseware.name,
            type: this.tableData[0].assignment.courseware.type,
          }
        } catch (e) {
          return {
            name: this.$route.query.name,
            type: this.$route.query.type,
          }
        }
      },
    },
    created() {
      this.form.assignmentId = this.$route.query.id
      this.form.assigneeId = this.$route.query.assigneeId
      this.form.createdBy = this.userInfo.userId
      this.form.courseNumber = this.$route.query.courseNumber
      this.getCoursewareAssignmentReadRecords()
    },
    methods: {
      getList() {
        this.getCoursewareAssignmentReadRecords()
      },
      formatTypes({ cellValue }) {
        if (this.coursewareTypeList.filter((v) => v.id == cellValue).length !== 0) {
          return this.coursewareTypeList.filter((v) => v.id == cellValue)[0].name
        }
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getList()
      },
      async getCoursewareAssignmentReadRecords() {
        this.loading = true
        let [err, res] = await to(getCoursewareAssignmentReadRecords(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      cancel(id) {
        this.$confirm(this.$t('common.cancelData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteCoursewareAssignmentReadRecordsId({ id: id }).then((res) => {
            if (res.status == 200) {
              if (
                parseInt(this.form.total / this.form.size) < this.form.page &&
                this.form.page !== 1
              ) {
                this.form.page = parseInt(this.form.total / this.form.size)
              }
              this.getCoursewareAssignmentReadRecords()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      formatGender({ cellValue }) {
        return cellValue == 'M' ? this.$t('common.male') : this.$t('common.female')
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatType(str) {
        let name = (str + '').trim().toLocaleUpperCase()
        switch (name) {
          case 'PUBLIC':
            return this.$t('table.openCourseware')
          case 'SELF':
            return this.$t('table.ownCourseware')
          case 'THIRD_PARTY':
            return this.$t('table.thirdPartyCourseware')
          default:
            return ''
        }
      },
      formatDuration({ cellValue }) {
        return formatTime.call(this, cellValue)
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      formatStatus({ cellValue }) {
        switch (cellValue) {
          // 未开始
          case 'NOT_STARTED':
            return this.$t('status.notStarted')
            break
          // 阅读中
          case 'READING':
            return this.$t('table.reading')
            break
          // 按时完成
          case 'FINISHED_IN_TIME':
            return this.$t('table.finishonTime')
            break
          // 超期完成
          case 'FINISHED_DELAYED':
            return this.$t('table.overdueCompletion')
            break
          case 'DELETED':
            return this.$t('status.deleted')
            break
          default:
            // return 123
            break
        }
      },
      selectChangeEvent({ records }) {
        this.records = records.map((item) => item.id)
      },
      exportCount() {
        coursewareExport({ ids: this.records })
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.revoke'),
            event: () => {
              this.cancel(row.id)
            },
          },
        ]
      },
    },
  }
</script>
<style scoped lang="scss">
  .outlineInfos {
    font-size: 14px;
    width: 100%;
    padding-bottom: 17px;
    // border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      display: inline-block;
      // margin-right: 170px;
    }
  }
</style>
