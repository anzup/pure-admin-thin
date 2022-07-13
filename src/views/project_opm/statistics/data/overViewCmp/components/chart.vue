<template>
  <div id="chart_box" />
</template>
<script setup lang="ts">
  import { computed, onMounted, ref, watch, nextTick } from 'vue'
  import echarts from '/@/plugins/echarts'

  import { VXETable } from 'vxe-table'
  import { downloadFileByBase64 } from '/@/utils/utils'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const props = defineProps({
    isShow: Boolean,
    chartOptions: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  })

  const option = {
    color: [
      '#3d66e1',
      '#7981eb',
      '#7997eb',
      '#006dcc',
      '#0a88f6',
      '#67b3ff',
      '#0caacc',
      '#2cc4e5',
      '#6fdde6',
      '#7ab558',
      '#d5e268',
      '#e2b968',
    ].reverse(),

    legend: {
      type: 'scroll',
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      containLabel: true,
    },
    xAxis: [],
    yAxis: {
      type: 'value',
    },
    series: [],
  }

  const chartCase = ref()

  const cptOptions = computed(() => {
    return Object.assign({}, option, props.chartOptions)
  })

  const initChart = () => {
    nextTick(() => {
      chartCase.value.clear()
      chartCase.value.setOption(cptOptions.value)
    })
  }
  onMounted(() => {
    const chartDom = document.getElementById('chart_box')
    if (!chartDom) return
    chartCase.value = echarts.init(chartDom)
    initChart()
  })
  watch(
    () => props.chartOptions,
    (val) => {
      initChart()
    },
    { deep: true },
  )

  const print = () => {
    const url = chartCase.value.getDataURL()
    if (!url) return t('text.please_try_again')
    VXETable.print({
      sheetName: t('text.print_image'),
      style: `
                img {
                  width: 100%;
                }
                `,
      content: `<img src="${url}">`,
    })
  }
  const exportImg = (filename: string) => {
    const url = chartCase.value.getDataURL()
    if (!url) return t('text.please_try_again')
    downloadFileByBase64(url, filename)
  }

  defineExpose({
    print,
    exportImg,
  })
</script>
<style lang="scss" scoped>
  #chart_box {
    height: 100%;
    // background-color: chartreuse;
  }
</style>
