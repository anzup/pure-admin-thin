<template>
  <div :id="EchartId" />
</template>

<script>
  import * as echarts from 'echarts'
  import XEUtils from 'xe-utils'
  export default {
    data() {
      return {
        EchartId: `EchartLine${Math.ceil(Math.random() * 100)}`,
        echartsDOM: null,
        EchartsOptions: {
          title: {
            text: '',
            textAlign: 'center',
            left: '50%',
            textStyle: {
              fontSize: 20,
              color: '#4F81BD',
            },
            top: 20,
          },
          legend: {
            bottom: '5%',
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
            data: [],
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 5,
          },
          axisPointer: { show: true },
          series: [],
        },
        lineLabel: [],
        lineData: [],
        lineSeries: {
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 4,
          },
        },
        lineTitle: '',
      }
    },
    props: {
      title: String,
      data: {
        type: Object,
        default: () => ({
          title: '',
          label: [],
          value: [],
        }),
      },
    },
    mounted() {
      this.initEchart()
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.resizeEchart)
    },
    methods: {
      initEchart() {
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
        let option = this.echartsDOM.getOption()
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
            selectedOptions[key] = i == 0 ? true : false
            i++
          }
        }

        option.series = seriesArr
        option.title[0].text = this.lineTitle
        option.xAxis[0].data = this.lineLabel
        option.legend[0].selected = selectedOptions
        this.echartsDOM.setOption(option)
      },
    },
    watch: {
      data: {
        deep: true,
        handler(data) {
          this.lineTitle = data.title || ''
          this.lineData = data.value || {}
          this.lineLabel = data.label || []
          this.refreshEchart()
        },
      },
    },
  }
</script>
