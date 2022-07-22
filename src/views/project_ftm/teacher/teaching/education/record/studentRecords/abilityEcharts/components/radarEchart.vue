<template>
  <div :id="EchartId"></div>
</template>

<script>
  import * as echarts from 'echarts'
  import XEUtils from 'xe-utils'
  export default {
    data() {
      return {
        EchartId: `EchartsRadar${Math.ceil(Math.random() * 100)}`,
        echartsDOM: null,
        radarOptions: {
          tooltip: {
            trigger: 'axis',
          },
          title: {
            text: '',
            textStyle: {
              fontSize: 20,
              color: '#4F81BD',
            },
            textAlign: 'center',
            left: '50%',
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
          },
          radar: {
            name: { color: '#4F81BD' }, // 指示器文字样式
            axisLine: { show: false }, // 坐标轴轴线
            splitArea: { show: false }, // 分割区域样式
            axisLabel: {
              show: true,
              showMinLabel: false,
              color: '#4F81BD',
            },
            center: ['50%', '50%'],
            indicator: [],
            radius: '66%',
            splitNumber: this.splitNumber,
          },
          series: [
            {
              name: '',
              type: 'radar',
              data: [],
            },
          ],
        },
        radarSeries: {
          type: 'radar',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 4,
          },
          tooltip: {
            trigger: 'item',
          },
          data: [],
        },
        radarIndicator: { name: '', max: this.splitNumber },
        radarData: [],
        radarHead: [],
        radarPostion: [],
        radarTitle: '',
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
      splitNumber: {
        type: Number,
        default: 5, // 指示器的最大值和分隔断数
      },
    },
    mounted() {
      this.initEcharts()
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resizeEchart)
    },
    methods: {
      initEcharts() {
        const chartDom = document.getElementById(this.EchartId)
        let radarChart = echarts.init(chartDom)
        this.echartsDOM = radarChart
        radarChart.setOption(this.radarOptions)
        setTimeout(() => {
          window.addEventListener('resize', this.resizeEchart)
        }, 200)
      },
      resizeEchart() {
        this.echartsDOM.resize()
      },
      // 更新echart数据、标题、表头
      refreshData() {
        let option = this.echartsDOM.getOption()
        let seriesArr = [],
          seriesObj = XEUtils.clone(this.radarSeries, true)
        let selectedOptions = {}
        let indicatorArr = this.radarHead.map((item) => {
          let Indicator = JSON.parse(JSON.stringify(this.radarIndicator))
          return Object.assign(Indicator, { name: item })
        })

        if (this.radarData instanceof Array) {
          seriesArr = this.radarData.map((v) => {
            let seriesOptions = XEUtils.clone(this.radarSeries, true)
            seriesOptions.value = v
            seriesOptions.name = this.radarTitle
            return seriesOptions
          })
          option.series[0].data = seriesArr
        } else {
          let i = 0
          for (let [key, value] of Object.entries(this.radarData)) {
            let item = XEUtils.clone(this.radarSeries, true)
            seriesArr.push(XEUtils.assign(item, { name: key, data: [value] }))
            selectedOptions[key] = i == 0 ? true : false
            seriesObj.data.push({ name: key, value })
            i++
          }
          option.series = seriesObj
        }

        option.title[0].text = this.radarTitle
        option.radar[0].indicator = indicatorArr
        option.radar[0].center = this.radarPostion
        this.echartsDOM.setOption(option)
      },
    },
    watch: {
      data: {
        deep: true,
        handler(obj) {
          this.radarData = obj.value || []
          this.radarHead = obj.label || []
          this.radarTitle = obj.title || ''
          this.radarPostion = obj.postion || ['50%', '50%']
          this.refreshData()
        },
      },
    },
  }
</script>
