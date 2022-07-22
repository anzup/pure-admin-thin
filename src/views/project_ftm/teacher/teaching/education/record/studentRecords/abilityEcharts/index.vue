<template>
  <el-scrollbar>
    <slot></slot>
    <div class="echarts-wrapper" v-if="windowWidth > 768">
      <radar-echarts class="echarts-table" :data="radarData" :splitNumber="5" key="radar1" />
      <radar-echarts class="echarts-table" :data="radarData2" key="radar2" />
      <line-echarts style="width: 100%" class="echarts-table" :data="lineData" />
    </div>
    <div class="echarts-wrapper" v-else>
      <radar-echarts style="width: 100%" class="echarts-table" :data="radarData" :splitNumber="5" />
      <radar-echarts style="width: 100%" class="echarts-table" :data="radarData2" />
      <line-echarts style="width: 100%" class="echarts-table" :data="lineData" />
    </div>
  </el-scrollbar>
</template>

<script>
  import { getEchartsData } from '/@/api/ftm/teacher/studentTraining'
  import radarEcharts from './components/radarEchart.vue'
  import lineEcharts from './components/lineEchart.vue'
  export default {
    data() {
      return {
        radarData: {},
        radarData2: {},
        lineData: {},
      }
    },
    props: {
      details: Object,
      clazz: Object,
    },
    components: {
      radarEcharts,
      lineEcharts,
    },
    computed: {
      windowWidth() {
        return window.innerWidth
      },
    },
    created() {
      this.init()
    },
    methods: {
      async init() {
        let params = {
          studentId: this.details.id,
          clazzId: this.clazz.id,
        }
        let { data } = await getEchartsData(params)
        this.radarData = {
          title: this.$t('table.coreCapabilitiesRadar'),
          label: data.names,
          value: {
            [`${this.$t('table.coreCompetence')}`]: data.scores,
            [`${this.$t('table.normalScore')}`]: data.normalScores,
          },
        }
        this.lineData = {
          title: this.$t('table.coreCapabilitiesLine'),
          label: data.courses,
          value: data.courseScores,
        }
        this.radarData2 = {
          title: this.$t('table.jobCompetencyAssessmentChart'),
          label: [
            this.$t('table.coreCompetence'),
            this.$t('table.trainingStyleCompetence'),
            this.$t('table.psychologyCompetence'),
          ],
          value: [[data.scoreAvg, data.trainingStyleScore, data.psychologyCompetencyScore]],
          postion: ['50%', '60%'],
        }
      },
    },
  }
</script>

<style lang="scss">
  .echarts-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 20px 0;
    .echarts-table {
      width: 49%;
      height: 500px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
    }
  }
</style>
