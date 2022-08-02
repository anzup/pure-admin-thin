<template>
  <VxeTable
    ref="xTable"
    class="schedule-table"
    :loading="loading"
    border="outer"
    :highlightHoverRow="false"
    :highlightCurrentRow="false"
    :data="data"
    :columns="tableColumns"
  >
    <template #pager />
    <template #header="{ column }">
      <div class="header-column" :class="{ checked: column.params.isnow }">
        <div class="header-date">{{ formatStart(column.params.date) }}</div>
        <div class="header-week">{{ column.params.week }}</div>
      </div>
    </template>
    <template #schedule="{ row, column }">
      <div v-if="row[column.params.dateStr]" class="schedule-content">
        <div
          class="schedule-item"
          v-for="(item, index) in row[column.params.dateStr]"
          :key="`${column.params.dateStr}_${index}`"
          :style="{ background: column.params.background }"
        >
          <p>{{ item['syllabusItemName'] }}</p>
          <p v-if="item['teachers'] instanceof Array">
            {{ item['teachers'].map((v) => v.name).join(',') }}
          </p>
          <p>{{ item['courseNumber'] }}</p>
          <p>{{ formatDate(item['startDate'], item['endDate']) }}</p>
          <p>{{ item['facilityPlace'] }}</p>
        </div>
      </div>
    </template>
  </VxeTable>
</template>

<script>
  import moment from 'moment'
  import XEUtils from 'xe-utils'
  import VxeTable from '/@/components/Table/index.vue'
  import { useWeek } from '../common/enum'
  import { getStyle } from '/@/utils/index'
  const NOW_DATE = new Date()
  const NOW_MONTH = NOW_DATE.getFullYear() + '-' + (NOW_DATE.getMonth() + 1)
  const window_height = window.innerHeight
  export default {
    components: { VxeTable },
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      month: {
        type: String,
        default: NOW_MONTH,
      },
      data: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        tableHeight: window_height,
        tableColumn: {
          field: '',
          title: '',
          width: 120,
          params: null,
          slots: { header: 'header', default: 'schedule' },
        },
        tableColumns: [],
      }
    },
    watch: {
      month: {
        immediate: true,
        handler(val) {
          this.setDateList(val)
        },
      },
    },
    setup() {
      return { ...useWeek() }
    },
    mounted() {
      // setTimeout(() => {
      //   this.resetHeight()
      // }, 200)
    },
    beforeUpdate() {
      // this.resetHeight()
    },
    methods: {
      setDateList(date) {
        const current_date = new Date(date)
        const now_month = current_date.getFullYear() + '/' + (current_date.getMonth() + 1) + '/01'
        const days_list = []
        const month_days_count = moment(now_month).daysInMonth()
        let scrollIndex = 0
        for (let i = 0; i < month_days_count; i++) {
          let current_date_moment = moment(now_month).startOf('month').add(i, 'days')
          days_list.push({
            week: this.WEEK_LIST[+current_date_moment.day()],
            date: current_date_moment.date(),
            unix: current_date_moment.format('X'),
            isnow:
              current_date_moment.format('YYYY-MM-DD') === moment(NOW_DATE).format('YYYY-MM-DD'),
            dateStr: current_date_moment.format('YYYY-MM-DD'),
            background: this.WEEK_COLORS[+current_date_moment.day()],
          })
          if (current_date_moment.format('YYYY-MM-DD') === moment(NOW_DATE).format('YYYY-MM-DD')) {
            scrollIndex = i
          }
        }
        this.tableColumns = days_list.map((item) => {
          let Column = XEUtils.clone(this.tableColumn, true)
          Column.params = item
          return Column
        })

        this.$nextTick(() => {
          this.$refs.xTable.$refs.xTable.reloadData()
          setTimeout(() => {
            this.$refs.xTable &&
              (this.$refs.xTable.$el.querySelector(
                '.vxe-table--body-wrapper.body--wrapper',
              ).scrollLeft = scrollIndex * 120)
          }, 50)
        })
      },
      resetHeight() {
        let client_height = 0
        let parent_node = this.$parent.$el
        let parent_height = this.$parent.$el.clientHeight
        let children_node = Array.from(this.$parent.$el.childNodes)
        children_node.forEach((node) => {
          if (
            node.nodeType == 1 &&
            node.isEqualNode(this.$el) == false &&
            node.contains(this.$el) == false
          ) {
            let h =
              node.clientHeight +
              parseInt(getStyle(node, 'marginTop')) +
              parseInt(getStyle(node, 'marginBottom')) +
              parseInt(getStyle(node, 'paddingTop')) +
              parseInt(getStyle(node, 'paddingBottom'))
            client_height += h
          }
        })
        this.tableHeight =
          parent_height -
          client_height -
          parseInt(getStyle(parent_node, 'marginTop')) -
          parseInt(getStyle(parent_node, 'marginBottom'))
      },
      // 格式化日期天数
      formatStart(day) {
        return day ? day.toString().padStart(2, 0) : ''
      },
      formatDate(startDate, endDate) {
        return moment(startDate).format('HH:mm') + '-' + moment(endDate).format('HH:mm')
      },
    },
  }
</script>

<style scoped lang="scss">
  .schedule-table {
    .vxe-header--column {
      padding: 2px 0 !important;
      vertical-align: middle;
    }
    .vxe-cell--title {
      line-height: 1;
    }
    .vxe-body--column,
    .vxe-body--column .vxe-cell,
    .vxe-body--column p {
      padding: 0 !important;
      margin: 0 !important;
    }

    .header-column {
      position: relative;
      display: inline-block;
      height: 100%;
      padding: 6px 8px;
      line-height: 1.5;

      &.checked {
        color: #f98233;
        border-radius: 4px;
        background: #ffefe5;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          border-bottom: 6px #f86604 solid;
        }
      }
    }
    .schedule-content {
      color: #fff;
      white-space: initial;
    }
    .schedule-item {
      margin: 1px 0;
      padding: 6px;
    }
  }
</style>
