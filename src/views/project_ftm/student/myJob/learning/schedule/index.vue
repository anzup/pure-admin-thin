<template>
  <div class="schedule-container">
    <div class="holder-line">
      <el-date-picker
        v-model="form.date"
        type="month"
        @change="getData"
        :placeholder="$t('holder.SelectMonth')"
      />
    </div>
    <section v-loading="loading">
      <ScheduleTable :data="timeTableData" :month="scheduleDate" />
    </section>
  </div>
</template>

<script>
  import { getStudentsId } from '/@/api/ftm/student/account'
  import { getOldScheduleStudent } from '/@/api/ftm/student/teachingCenter'
  import moment from 'moment'
  import to from 'await-to-js'
  import ScheduleTable from './components/schedule.vue'
  import { useWeek } from './common/enum'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        moment,
        form: {
          date: new Date(),
        },
        loading: false,
        tableData: [],
        timeTableData: [],
        tableToolbar: {
          slots: {
            buttons: 'left_tools',
          },
        },
        courseName: '',
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      scheduleDate() {
        return moment(this.form.date).format('YYYY/MM/DD')
      },
    },
    components: { ScheduleTable },
    setup() {
      return { ...useWeek() }
    },
    async mounted() {
      let [err, res] = await to(getStudentsId({ id: this.userInfo.id }))
      if (!err) {
        this.courseName = res.data.clazz.courseNumber || ''
      }
      this.getData()
    },
    methods: {
      formatDate(date) {
        return moment(date).format('DD')
      },
      formatWeek(date) {
        return this.WEEK_LIST[moment(date).day()]
      },
      formatDateRange(startDate, endDate) {
        return moment(startDate).format('HH:mm') + '-' + moment(endDate).format('HH:mm')
      },
      // 获取课表数据
      async getData() {
        let params = {
          ids: this.userInfo.id,
          month: this.form.date ? moment(this.form.date).format('YYYY-MM') : undefined,
          // searchKey: this.courseName + ',' + this.userInfo.name
        }
        this.loading = true
        let [err, res] = await to(getOldScheduleStudent(params))
        this.loading = false
        if (!err) {
          let list = res.data.content
          let tableData = {}
          if (list instanceof Array && list.length > 0) {
            list.forEach((item) => {
              if (item.hasOwnProperty('listMap')) {
                for (let [unix, val] of Object.entries(item.listMap)) {
                  let key = moment(unix, 'x').format('YYYY-MM-DD')
                  if (tableData.hasOwnProperty(key)) {
                    tableData[key] = tableData[key].concat(val)
                  } else {
                    tableData[key] = val
                  }
                }
              }
            })
          } else {
            list = []
          }
          this.timeTableData = list.length > 0 ? [tableData] : []
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .schedule-container {
    display: flex;
    flex-direction: column;
    > section {
      flex: 1;
      overflow: hidden;
    }
  }
  .table-header {
    line-height: 24px;
  }
  :deep(.vxe-body--column) {
    vertical-align: top;
  }
  .scheduler_item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .scheduler_header {
      padding: 12px 10px;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
      background: rgba($color: #000000, $alpha: 0.08);
      p {
        display: -webkit-box;
        min-height: 24px;
        margin: 0;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .scheduler_conten {
      flex: 1;
      padding: 14px 23px;
      & > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 2px;
        .subitem {
          font-size: 12px;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          &:not(:last-child) {
            margin-bottom: 8px;
          }
          .subitem_icon {
            display: inline-block;
            margin-right: 11px;
            width: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            text-align: center;
            line-height: 20px;
          }
        }
      }
    }
  }
  .holder-line {
    margin-bottom: 20px;
  }
</style>
