<template>
  <div class="header_con">
    <el-row>
      <el-col :span="18">
        <el-form inline>
          <el-form-item>
            <el-date-picker
              :placeholder="$t('text.please_select')"
              @change="getList"
              :type="timeScale"
              v-model="form.year"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item v-show="showResources">
            <el-select
              :clearable="!required"
              :placeholder="$t('text.please_select')"
              v-model="form.resourceId"
              @change="getList"
            >
              <el-option
                v-for="(item, index) in cptResourcesList"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" class="btn_con">
        <el-button type="primary" @click="printEvent">{{ $t('text.print') }}</el-button>
        <el-button type="primary" @click="exportEvent">{{ $t('text.leading_out') }}</el-button>
      </el-col>
    </el-row>
  </div>
  <div class="statistics_main_con">
    <!-- <img :src="imgUrl"  /> -->
    <div class="sub_menu" v-show="showTab">
      <el-radio-group v-model="radio" @change="radioChange" size="mini">
        <el-radio-button label="data">{{ $t('text.data') }}</el-radio-button>
        <el-radio-button label="chart">{{ $t('text.chart') }}</el-radio-button>
      </el-radio-group>
    </div>
    <div :class="{ main_con: true, auto_height: !showTab }">
      <vxe-grid
        ref="tableRef"
        class="mytable-scrollbar"
        v-show="radio == 'data'"
        v-bind="gridOptions"
      >
        <template #form>
          <div class="title_con">
            <el-button type="text" plain>
              <SvgIcon name="panel_btn-day_left" @click="changeYearEvent('reduce')" /> </el-button
            >&nbsp; &nbsp;
            <span>{{
              formatDate + ' ' + (timeScale == 'year' ? $t('text.year') : '') + ' ' + title
            }}</span>
            &nbsp; &nbsp;
            <el-button type="text" plain>
              <SvgIcon name="panel_btn-day_right" @click="changeYearEvent('add')" />
            </el-button>
            <div class="tip_con" v-show="tip">{{ tip }}</div>
          </div>
        </template>
      </vxe-grid>
      <!-- :monthList="monthList" -->
      <Chart
        v-loading="chartOptions.loading"
        ref="chartRef"
        :chartOptions="chartOptions"
        v-if="showTab"
        :isShow="radio == 'chart' && !chartOptions.loading"
      />
      <!-- radio == 'chart'&&!chartOptions.loading -->
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref, onMounted, computed, nextTick } from 'vue'
  import { VxeGridProps, VxeTableInstance } from 'vxe-table'

  import { useI18n } from 'vue-i18n'
  import useResources from '/@/commonTs/resources'
  import Chart from './components/chart.vue'
  import SvgIcon from '/@/components/SvgIcon/index.vue'
  import dayjs from 'dayjs'

  const props = withDefaults(
    defineProps<{
      gridOptions: VxeGridProps
      chartOptions: {
        [_: string]: any
      }
      getData: (params: {
        year: string
        resourceId?: number
        builtinRole?: string
        month?: string
      }) => void
      // initChart: () => void；
      resourceType?: 'FACILITIES' | 'TEACHER'
      title: string
      required?: boolean
      tip?: string
      showResources?: boolean
      showTab?: boolean
      timeScale?: 'year' | 'month'
      useBuiltinRole?: boolean
    }>(),
    {
      // 表格配置
      gridOptions: () => ({}),
      // 图表配置
      chartOptions: () => ({
        loading: false,
      }),
      // 资源下拉列表的类型
      resourceType: 'FACILITIES',
      // 标题
      title: '',
      // 是否显示资源下拉列表
      showResources: true,
      // 是否显示表格和图表切换按钮
      showTab: false,
      // 查询的事件尺度
      timeScale: 'year',
      // 是否使用useBuiltinRole来进行查询，主要用在教员和课时
      useBuiltinRole: false,
    },
  )

  const { getResourcesoScheduleList, resourcesList } = useResources()
  const cptResourcesList = computed<Array<resources.ResourcesItem>>(() =>
    (resourcesList.value as resources.ResourcesItem[]).filter(
      (v) => v.resourceType == props.resourceType,
    ),
  )
  const { t } = useI18n()
  const form = reactive({
    year: dayjs().toISOString(),
    resourceId: undefined,
    builtinRole: undefined,
    month: undefined,
  })
  const radio = ref('data')

  const gridOptions = computed<VxeGridProps>(() => {
    return Object.assign(
      {},
      {
        border: true,
        resizable: true,
        height: 'auto',
        align: 'center',

        data: [],
      },
      props.gridOptions,
    )
  })

  const changeYearEvent = (direction: 'reduce' | 'add') => {
    if (props.timeScale == 'year') {
      switch (direction) {
        case 'reduce':
          form.year = dayjs(form.year).subtract(1, 'y').toISOString()
          break
        default:
          form.year = dayjs(form.year).add(1, 'y').toISOString()
          break
      }
    } else {
      switch (direction) {
        case 'reduce':
          form.year = dayjs(form.year).subtract(1, 'M').toISOString()

          break
        default:
          form.year = dayjs(form.year).add(1, 'M').toISOString()
          break
      }
    }
    getList()
  }
  const tableRef = ref<VxeTableInstance>(),
    chartRef = ref()

  const printEvent = () => {
    nextTick(() => {
      switch (radio.value) {
        case 'data':
          tableRef.value.print({
            style: `
                        h3{
                            text-align:center;
                        }
                    `,
            beforePrintMethod: ({ content }) => {
              // 拦截打印之前，返回自定义的 html 内容
              return (
                `<h3>${
                  formatDate.value +
                  ' ' +
                  (props.timeScale == 'year' ? t('text.year') : '') +
                  ' ' +
                  props.title
                }</h3>` + content
              )
            },
          })

          break
        case 'chart':
          chartRef.value.print()

          break

        default:
          break
      }
    })
  }
  const exportEvent = () => {
    nextTick(() => {
      switch (radio.value) {
        case 'data':
          const $grid = tableRef.value
          $grid.exportData({
            filename:
              formatDate.value + ' ' + props.timeScale == 'year'
                ? t('text.year')
                : '' + props.title,
            sheetName: 'Sheet1',
            type: 'xlsx',
            useStyle: true,
            // sheetMethod:(val)=>{
            //     console.log(val);
            // }
          })
          break
        case 'chart':
          chartRef.value.exportImg(
            formatDate.value + ' ' + props.timeScale == 'year' ? t('text.year') : '' + props.title,
          )
          break
        default:
          break
      }
    })
  }
  const radioChange = () => {
    // if(radio.value=="chart"){
    //     props.initChart()
    // }
  }
  const getList = () => {
    if (props.useBuiltinRole && form.resourceId) {
      form.builtinRole = cptResourcesList.value.find(
        (v) => v.id == form.resourceId,
      )?.builtinResource
    }
    const data = JSON.parse(JSON.stringify(form))
    if (props.timeScale == 'year') {
      data.year = dayjs(data.year).year()
      data.month = undefined
    } else {
      data.month = dayjs(data.year).month() + 1
      data.year = dayjs(data.year).year()
    }
    props.getData(data)
  }
  const formatDate = computed(() =>
    props.timeScale == 'year' ? dayjs(form.year).year() : dayjs(form.year).format('YYYY-MM'),
  )

  onMounted(async () => {
    if (props.showResources) {
      await getResourcesoScheduleList()
      if (cptResourcesList.value.length > 0 && props.required)
        form.resourceId = cptResourcesList.value[0].id
    }

    getList()
  })
</script>
<style lang="scss" scoped>
  .header_con {
    padding: 0 $defaultMarginWidth;
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
    .btn_con {
      text-align: right;
    }
    padding-bottom: 5px;
    border-bottom: 1px solid $systemDefaultColor;
  }
  .statistics_main_con {
    $height: calc(100% - 44px);
    height: $height;
    margin-top: 5px;
    .sub_menu {
      padding: 0 10px 5px 10px;
    }
    .main_con {
      height: calc(100% - 33px);
      &.auto_height {
        height: 100%;
      }
      // background-color: chartreuse;
      .title_con {
        height: 40px;
        width: 100%;
        // background-color: chartreuse;
        line-height: 40px;
        text-align: center;
        font-size: 15px;
        font-weight: bold;
        background-color: rgb(248, 248, 249);
        position: relative;
        border: 1px solid #e8eaec;
        border-bottom: unset;
        .tip_con {
          height: 100%;
          position: absolute;
          right: 10px;
          top: 0;
          max-width: 200px;
          // background-color: aqua;
          font-size: 12px;
          font-weight: 400;
          text-align: right;
        }
      }
    }
  }
  :deep(.vxe-grid--form-wrapper) {
    padding: 0;
  }
</style>
