<template>
  <VxeTable
    :data="tableData"
    :loading="tableLoading"
    :columns="tableColumns"
    :buttons="tableButtons"
  >
    <template #top>
      <div class="warp-content-table">
        <table class="info-table-box" id="NavInfoTable" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td>{{ $t('table.name') }}</td>
            <td>{{ Details.name }}</td>
            <td>{{ $t('table.gender') }}</td>
            <td>{{ Details.gender == 'M' ? $t('common.male') : $t('common.female') }}</td>
          </tr>
          <tr>
            <td>{{ $t('table.idNumber') }}</td>
            <td>{{ Details.idNumber }}</td>
            <td>{{ $t('table.cellPhoneNumber') }}</td>
            <td>{{ Details.phone }}</td>
          </tr>
          <tr>
            <td>{{ $t('table.airlines') }}</td>
            <td>{{ output('Details.customer.name') }}</td>
            <td>{{ $t('table.mailbox') }}</td>
            <td>{{ Details.email }}</td>
          </tr>
        </table>
      </div>
    </template>
    <template #pager />

    <template #startTime="{ row }">{{
      XEUtils.toDateString(row.startTime, 'yyyy-MM-dd HH:mm:ss')
    }}</template>
    <template #endTime="{ row }">{{
      XEUtils.toDateString(row.endTime, 'yyyy-MM-dd HH:mm:ss')
    }}</template>
    <template #simulatorTeacher="{ row }"
      ><span class="keep-word">{{
        teacherFormat({ cellValue: getProperty(row, 'grouping.teachers') })
      }}</span></template
    >
    <template #theoryTeacher="{ row }"
      ><span class="keep-word">{{
        teacherFormat({ cellValue: getProperty(row, 'clazz.theoryTeachers') })
      }}</span></template
    >
  </VxeTable>
</template>
<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getStudents } from '/@/api/ftm/teacher/studentTraining'
  import { getStudentsId } from '/@/api/ftm/teacher/account'
  import to from 'await-to-js'
  import XEUtils from 'xe-utils'
  export default {
    components: { VxeTable },
    data() {
      return {
        XEUtils,
        Details: {}, // 学生详情
        tableData: [],
        tableColumns: [
          { type: 'checkbox', width: 40 },
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          { field: 'clazz.courseNumber', title: this.$t('table.courseNumber'), minWidth: 120 },
          { field: 'clazz.course.name', title: this.$t('table.trainingProject'), minWidth: 120 },
          {
            field: 'clazz.course.code',
            title: this.$t('table.trainingProjectCode'),
            minWidth: 150,
          },
          {
            field: 'grouping.teachers',
            title: this.$t('table.simulatorTeacher'),
            minWidth: 120,
            slots: { default: 'simulatorTeacher' },
          },
          {
            field: 'clazz.theoryTeachers',
            title: this.$t('table.theoryTeacher'),
            minWidth: 120,
            slots: { default: 'theoryTeacher' },
          },
          {
            field: 'startTime',
            title: this.$t('table.trainingStartTime'),
            width: 160,
            slots: { default: 'startTime' },
          },
          {
            field: 'endTime',
            title: this.$t('table.trainingEndTime'),
            width: 160,
            slots: { default: 'endTime' },
          },
          {
            field: 'status',
            title: this.$t('table.trainingStatusName'),
            width: 160,
            formatter: this.statusFormatter,
          },
          { title: this.$t('table.tableEdit'), width: 140, slots: { default: 'operate' } },
        ],
        tableLoading: false,
      }
    },
    mounted() {
      this.getStudents()
      this.getDetails()
    },
    methods: {
      output(key) {
        try {
          return eval(`(this.${key})`)
        } catch (e) {
          return ''
        }
      },
      // 格式化教师数组
      teacherFormat({ cellValue }) {
        return cellValue instanceof Array ? cellValue.map((v) => v.name).join(', ') : ''
      },
      // 格式化结业状态
      statusFormatter({ cellValue }) {
        switch (cellValue) {
          case 'GRADUATED':
            return this.$t('status.finishedStatus')
          case 'NOT_GRADUATED':
            return this.$t('status.unfinishedStatus')
          case 'NOT_STARTED':
            return this.$t('status.notStarted')
          default:
            return this.$t('status.training')
        }
      },
      toPage(row, name) {
        let params = this.$route.params
        this.$router.push({
          name,
          params: {
            ...params,
            recordId: row.id || this.$route.query.id,
          },
        })
      },
      async getDetails() {
        const id = this.$route.params.studentId
        let [err, res] = await to(getStudentsId({ id }))
        if (!err) {
          this.Details = res.data
        }
      },
      getStudents() {
        const param = {
          page: 1,
          size: 100,
          // clazzId: this.form.className,
          // searchKey: this.form.searchKey ? this.form.searchKey : undefined,
          // customerId: this.form.airlines,
          // status: this.form.graduation,
          // year: this.form.schoolYear,
          // teacherUserId: this.userInfo.teacher ? this.userInfo.userId : undefined,
          studentId: this.$route.params.studentId,
        }
        getStudents(param).then((res) => {
          let data = res.data
          this.tableData = data.content
        })
      },
      getProperty(row, key) {
        try {
          let keys = key.split('.')
          let item = row
          for (let i = 0; i < keys.length; i++) {
            item = item[keys[i]]
          }
          return item
        } catch (e) {
          return ''
        }
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            event: () => {
              this.toPage(row, 'TeachingEducationRecordStudentDetail')
            },
          },
        ]
      },
    },
  }
</script>
<style lang="scss" scoped>
  .warp-content-table {
    .info-table-box {
      width: 100%;
      border-top: 1px solid #e8eaec;
      border-left: 1px solid #e8eaec;
      td {
        padding: 14px 5px;
        font-size: 14px;
        text-align: center;
        border-right: 1px solid #e8eaec;
        border-bottom: 1px solid #e8eaec;
      }
      td:nth-of-type(2n + 1) {
        width: 9%;
        background-color: #f8f8f9;
        color: #191919;
        font-weight: bold;
      }
      td:nth-of-type(2n) {
        width: 15%;
        text-align: left;
        padding: 0 20px;
      }
    }
  }
</style>
