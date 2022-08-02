<template>
  <div :id="EchartId" style="width: 100%; height: 100%" class="echart-a-wrap" />
</template>

<script>
  import * as echarts from 'echarts'
  import XEUtils from 'xe-utils'
  import { coreCapabilityAverageScoreStats } from '/@/api/ftm/teacher/studentTraining'
  import { toISODateTime } from '/@/utils/index'
  export default {
    data() {
      return {
        EchartId: `EchartLine${Math.ceil(Math.random() * 100)}`,
        echartsDOM: null,
        EchartsOptions: {
          title: {
            text: this.$t('table.coreCompetenceAverageStatistics'),
            textAlign: 'center',
            left: '50%',
            textStyle: {
              fontSize: 20,
              color: '#4F81BD',
            },
            top: 20,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                // backgroundColor: '#6a7985'
              },
            },
          },
          legend: {
            bottom: '15%',
            left: 'center',
            width: '80%',
            itemWidth: 30,
            itemHeight: 2,
            itemGap: 20,
            icon: 'rect',
            selectedMode: 'multiple',
            selected: {},
          },
          grid: { bottom: '35%' },
          xAxis: {
            type: 'category',
            name: this.$t('table.flightCourse'),
            nameLocation: 'center',
            nameGap: 30,
            nameTextStyle: {
              fontSize: 13,
              fontWeight: '600',
              color: '#4F81BD',
            },
            min: 'dataMin',
            max: 'dataMax',
            boundaryGap: false,
            axisTick: false,
            // data: []
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 5,
          },
          axisPointer: { show: true },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 100,
            },
            {
              type: 'inside',
              realtime: true,
              start: 0,
              end: 100,
            },
          ],
          series: [],
        },
        lineLabel: [],
        lineData: [],
        lineSeries: {
          type: 'line',
          smooth: false,
          symbol: 'none',
          lineStyle: {
            width: 4,
          },
        },
        lineTitle: '',
      }
    },
    props: {
      data: {
        type: Object,
        default: () => ({
          title: '',
          label: [],
          value: [],
        }),
      },
      type: '',
      formInline: Object,
    },
    mounted() {
      this.initEchart()
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.resizeEchart)
    },
    methods: {
      initEchart() {
        if (this.echartsDOM) {
          this.echartsDOM.clear()
        }
        const chartDom = document.getElementById(this.EchartId)
        let lineChart = echarts.init(chartDom)
        this.echartsDOM = lineChart
        lineChart.setOption(this.EchartsOptions)
        setTimeout(() => {
          window.addEventListener('resize', this.resizeEchart)
        }, 200)
      },
      resizeEchart() {
        this.echartsDOM.resize()
      },
      // 更新echart
      refreshEchart() {
        if (this.echartsDOM) {
          this.echartsDOM.clear()
        }
        let option = this.EchartsOptions
        let seriesArr = []
        let selectedOptions = {}
        if (this.lineData instanceof Array) {
          seriesArr = this.lineData.map((v) => {
            let item = XEUtils.clone(this.lineSeries, true)
            return XEUtils.assign(item, v)
          })
        } else {
          let i = 0
          for (let [key, value] of Object.entries(this.lineData)) {
            let item = XEUtils.clone(this.lineSeries, true)
            seriesArr.push(XEUtils.assign(item, { name: key, data: value }))
            selectedOptions[key] = i < 6 ? true : false
            i++
          }
        }

        option.series = seriesArr
        option.xAxis.data = this.lineLabel
        option.legend.selected = selectedOptions
        this.echartsDOM.setOption(option)
      },
      getData(flag) {
        if (!this.formInline.daterange || !this.formInline.courseId) {
          if (flag) {
            this.$message.warning(this.$t('holder.pleaseSelectDateAndCourse'))
          }
          return
        }
        let startDate = this.formInline.daterange[0]
        startDate.setHours(0)
        startDate.setMinutes(0)
        startDate.setSeconds(0)
        let endDate = this.formInline.daterange[1]
        endDate.setHours(23)
        endDate.setMinutes(59)
        endDate.setSeconds(59)
        coreCapabilityAverageScoreStats({
          courseId: this.formInline.courseId,
          startTime: toISODateTime(startDate),
          endTime: toISODateTime(endDate),
          type: this.type == 'lineEchart1' ? 'BY_CUSTOMER' : 'BY_CLAZZ', // BY_CLAZZ, BY_CUSTOMER
        }).then((res) => {
          this.lineData = {}
          this.lineLabel = []
          let courseScores = res.data.courseScores
          this.lineLabel = res.data.names.map((i) => i.name)
          courseScores.forEach((item) => {
            this.lineData[item.name] = item.scores.map((ee) => ee.score)
          })
          this.refreshEchart()
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .echart-a-wrap {
    height: 100%;
    //height: calc(var(--contentHeight) - 68px - 32px - 50px - 32px);
  }
</style>
