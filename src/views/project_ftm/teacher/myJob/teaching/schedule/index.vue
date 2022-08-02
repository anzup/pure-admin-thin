<template>
  <div class="schedule-container">
    <template v-if="builtinRole == 'TRAINING_ADMIN'">
      <el-tabs class="schedule-tabs" v-model="activedSimulator" @tab-click="changeSimulator">
        <el-tab-pane
          v-for="(item, index) in simulatorList"
          :key="index"
          :label="item.name"
          :name="item.name"
        />
      </el-tabs>
      <el-form size="medium" inline>
        <el-form-item>
          <el-date-picker
            v-model="form.date"
            type="month"
            :clearable="false"
            :placeholder="$t('holder.SelectMonth')"
            @change="getData"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            :placeholder="$t('holder.searchKeyOfTeacherAndCouseNumber')"
            v-model="form.searchKey"
          >
            <template #suffix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getData">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
      <section v-loading="loading">
        <ScheduleTable
          :data="adminScheduleDate"
          :month="scheduleDate"
          @clickItem="handleShowDetail"
        />
      </section>
    </template>

    <template v-else>
      <div class="holder-line">
        <el-form inline>
          <el-form-item>
            <el-date-picker
              v-model="form.date"
              type="month"
              :clearable="false"
              @change="getData"
              :placeholder="$t('holder.SelectMonth')"
            />
          </el-form-item>
          <el-form-item>
            <el-input :placeholder="$t('table.classNumber')" v-model="form.className">
              <template #suffix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getData">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <section v-loading="loading">
        <ScheduleTable :data="timeTableData" :month="scheduleDate" @clickItem="handleShowDetail" />
      </section>
    </template>

    <DetailDialog
      :title="$t('router.classScheduleDetail')"
      :detail="detailStudentDetail"
      :data="detailData"
      v-model="detailVisble"
    />
  </div>
</template>

<script>
  import {
    getOldScheduleEmployee,
    getOldScheduleFacilitie,
  } from '/@/api/ftm/teacher/teachingCenter'
  import { getTeachers } from '/@/api/ftm/teacher/education'
  import moment from 'moment'
  import ScheduleTable from './components/schedule.vue'
  import DetailDialog from './components/detailDialog.vue'
  import { Search } from '@element-plus/icons-vue'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  const colorList = ['#468fce', '#8bc34a', '#4cac6d', '#48c7ad', '#48a8e4', '#b495e1']
  export default {
    data() {
      return {
        moment,
        colorList,
        weekList: [
          this.$t('common.Sun'),
          this.$t('common.Mon'),
          this.$t('common.Tue'),
          this.$t('common.Wed'),
          this.$t('common.Thu'),
          this.$t('common.Fri'),
          this.$t('common.Sat'),
        ],
        form: {
          date: new Date(),
          searchKey: null,
          className: null,
        },
        loading: false,
        tableData: [],
        timeTableData: [],
        tableColumns: [],
        tableToolbar: {
          slots: {
            buttons: 'left_tools',
          },
        },
        teachersList: [],
        firstColumn: {
          fixed: 'left',
          minWidth: 120,
          title: this.$t('table.simulator'),
          field: 'name',
          className: 'vertical-center',
        },
        activedSimulator: '',
        simulatorList: [],
        adminScheduleDate: [],
        detailVisble: false,
        detailStudentDetail: {},
        detailData: [],
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
      scheduleDate() {
        return this.form.date ? moment(this.form.date).format('YYYY/MM/DD') : ''
      },
    },
    components: {
      ScheduleTable,
      DetailDialog,
      Search,
    },
    created() {
      this.getData()
    },
    methods: {
      getTeachers() {
        getTeachers().then((res) => {
          this.teachersList = res.data.content
        })
      },
      getTeacherName(val) {
        return this.teachersList
          .filter((ele) => ele.id == val)
          .map((ele) => ele.name)
          .join()
      },
      formatDate(date) {
        return moment(date).format('DD')
      },
      formatWeek(date) {
        return this.weekList[moment(date).day()]
      },
      formatDateRange(startDate, endDate) {
        return moment(startDate).format('HH:mm') + '-' + moment(endDate).format('HH:mm')
      },
      // 获取课表数据
      async getData() {
        let params = {
          month: this.form.date ? moment(this.form.date).format('YYYY-MM') : undefined,
          ids: this.builtinRole == 'TRAINING_ADMIN' ? undefined : this.userInfo.id,
          builtinResource: this.builtinRole == 'TRAINING_ADMIN' ? 'SIMULATOR' : undefined,
          searchKey:
            this.builtinRole == 'TRAINING_ADMIN' ? this.form.searchKey : this.userInfo.name,
          className: this.builtinRole == 'TRAINING_ADMIN' ? undefined : this.form.className,
        }
        this.loading = true
        let [err, res] = await to(
          this.builtinRole == 'TRAINING_ADMIN'
            ? getOldScheduleFacilitie(params)
            : getOldScheduleEmployee(params),
        )
        this.loading = false
        if (!err) {
          if (this.builtinRole == 'TRAINING_ADMIN') {
            let date =
              this.form.date && !Number.isNaN(new Date(this.form.date).getTime())
                ? new Date(this.form.date)
                : new Date()
            let month = date.getMonth() + 1
            let day = moment(`${date.getFullYear()}-${month}-${date.getDate()}`).daysInMonth()
            let columns = []
            for (let i = 0; i < day; i++) {
              let t = moment(date).startOf('month').add(i, 'days').format('YYYY-MM-DD')
              columns.push({
                field: t,
                title: t,
                minWidth: 210,
                slots: {
                  header: 'itemHeader',
                  default: 'contentSlot',
                },
              })
            }
            this.tableColumns = columns
            // this.$refs.xTable.$refs.xTable.refreshColumn()
            this.tableData = res.data

            if (res.data instanceof Array && res.data.length > 0) {
              this.simulatorList = res.data
              this.activedSimulator = res.data[0].name
            } else {
              this.simulatorList = []
              this.activedSimulator = ''
            }
            this.$nextTick(() => {
              this.changeSimulator()
            })
          } else {
            let column = {}
            for (let i = 0; i < res.data.length; i++) {
              let item = res.data[i]['listMap'] || []
              for (let [unix, arr] of Object.entries(item)) {
                let key = moment(unix, 'x').format('YYYY-MM-DD')
                if (column.hasOwnProperty(key)) {
                  column[key] = column[key].concat(arr)
                } else {
                  column[key] = arr
                }
              }
            }
            this.$nextTick(() => {
              this.timeTableData = res.data.length > 0 ? [column] : []
            })
          }
        }
      },
      changeSimulator() {
        if (this.simulatorList.findIndex((item) => item.name == this.activedSimulator) > -1) {
          this.adminScheduleDate = this.simulatorList.find(
            (item) => item.name == this.activedSimulator,
          ).listMap
            ? [this.simulatorList.find((item) => item.name == this.activedSimulator).listMap]
            : []
        } else {
          this.adminScheduleDate = []
        }
      },
      handleShowDetail(row) {
        this.detailVisble = true
        this.detailStudentDetail = {
          courseNumber: row.courseNumber,
          courseName: row.syllabusName
            ? `${row.syllabusName}${row.syllabusItemName ? `[${row.syllabusItemName}]` : ''}`
            : row.syllabusItemName,
          projectName: '',
          schoolDate: moment(row.startDate).format('YYYY-MM-DD'),
          schoolTime:
            moment(row.startDate).format('HH:mm') + '~' + moment(row.endDate).format('HH:mm'),
          schoolPeriod: row.period,
          teacherName:
            row.teachers instanceof Array ? row.teachers.map((v) => v.name).join(',') : '',
          facility: row.facilityPlace,
          remark: row.remark,
        }
        this.detailData = row.students
      },
    },
  }
</script>

<style scoped lang="scss">
  .schedule-container {
    display: flex;
    flex-direction: column;
    & > section {
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
      background: rgba($color: #000, $alpha: 0.08);
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
  .schedule-tabs {
    :deep(.el-tabs__header) {
      padding: 0;
    }
  }
  .schedule-aside-admin {
    width: 100%;
    height: calc(100% - 62px);
  }
  .schedule-aside-teacher {
    width: 100%;
    height: calc(100% - 62px);
  }
  .holder-line {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    .date {
      font-size: 18px;
      margin-left: 10px;
    }
  }
  :deep(.vertical-center) {
    vertical-align: middle;
  }
</style>
