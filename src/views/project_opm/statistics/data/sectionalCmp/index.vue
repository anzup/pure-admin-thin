<template>
  <div class="header_con">
    <el-row>
      <el-col :span="18">
        <el-form inline>
          <el-form-item>
            <el-date-picker
              :placeholder="$t('text.please_select')"
              @change="getList"
              type="year"
              value-format="YYYY"
              v-model="form.year"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item>
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
    <div class="main_con">
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
            <span>{{ form.year + ' ' + $t('text.year') + ' ' + title }}</span>
            &nbsp; &nbsp;
            <el-button type="text" plain>
              <SvgIcon name="panel_btn-day_right" @click="changeYearEvent('add')" />
            </el-button>
            <div class="tip_con" v-show="tip">{{ tip }}</div>
          </div>
        </template>
      </vxe-grid>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { reactive, ref, onMounted, computed, nextTick } from 'vue'
  import { VxeGridProps, VxeTableInstance } from 'vxe-table'

  import { useI18n } from 'vue-i18n'
  import useResources from '/@/commonTs/resources'
  import SvgIcon from '/@/components/SvgIcon/index.vue'
  import dayjs from 'dayjs'

  const props = withDefaults(
    defineProps<{
      gridOptions: VxeGridProps

      getData: (params: { year: string; resourceId: number; builtinRole?: string }) => void
      // initChart: () => void；
      resourceType?: 'FACILITIES' | 'TEACHER'
      title: string
      required?: boolean
      tip?: string
      useBuiltinRole?: boolean
    }>(),
    {
      gridOptions: () => ({}),
      resourceType: 'FACILITIES',
      title: '',
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
    year: dayjs().year().toString(),
    resourceId: undefined,
    builtinRole: undefined,
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
        showOverflow: true,

        printConfig: {
          isMerge: true,
          useStyle: true,
          style: `
                .vxe-table {
                  color: #000; // 修改表格默认颜色
                  font-size: 12px; // 修改表格默认字体大小
                  font-family: "Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu; // 修改表格默认字体
                }

                .vxe-table colgroup col:first-child{
                    width: 500px !important;
                }
                .vxe-table tbody tr:nth-child(5n-1),.vxe-table tbody tr:nth-child(5n){
                    background-color: #f4f4f5;
                }

            `,
          // beforePrintMethod({ content }) {

          //     return content
          // }
        },

        data: [],
        // rowClassName: ({ row }) => {
        //     return row.merge ? 'merge_row' : ''

        // },
        cellStyle: ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) => {
          // console.log(row);
          if (row.merge) {
            return {
              'background-color': '#f4f4f5',
            }
          }
        },
      } as VxeGridProps,
      props.gridOptions,
    )
  })

  const changeYearEvent = (direction: 'reduce' | 'add') => {
    switch (direction) {
      case 'reduce':
        form.year = (+form.year - 1).toString()
        break
      default:
        form.year = (+form.year + 1).toString()
        break
    }

    getList()
  }
  const tableRef = ref<VxeTableInstance>(),
    chartRef = ref()
  const getList = () => {
    if (props.useBuiltinRole && form.resourceId) {
      form.builtinRole = cptResourcesList.value.find(
        (v) => v.id == form.resourceId,
      )?.builtinResource
    }
    props.getData(form)
  }

  const printEvent = () => {
    nextTick(() => {
      tableRef.value.print({
        style: `
                        h3{
                            text-align:center;
                        }
                    `,
        beforePrintMethod: ({ content }) => {
          // 拦截打印之前，返回自定义的 html 内容
          return `<h3>${form.year + ' ' + t('text.year') + props.title}</h3>` + content
        },
      })
    })
  }
  const exportEvent = () => {
    nextTick(() => {
      const $grid = tableRef.value
      $grid.exportData({
        filename: form.year + ' ' + t('text.year') + props.title,
        sheetName: 'Sheet1',
        type: 'xlsx',
        useStyle: true,
        // sheetMethod:(val)=>{
        //     console.log(val);
        // },
        isMerge: true,
      })
    })
  }

  onMounted(async () => {
    await getResourcesoScheduleList()
    if (cptResourcesList.value.length > 0 && props.required)
      form.resourceId = cptResourcesList.value[0].id

    if (props.useBuiltinRole && form.resourceId) {
      form.builtinRole = cptResourcesList.value.find(
        (v) => v.id == form.resourceId,
      )?.builtinResource
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
      height: 100%;
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
  :deep(.merge_row) {
    background-color: #f4f4f5;
  }
</style>
