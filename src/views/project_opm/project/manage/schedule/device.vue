<template>
  <VxeTable v-bind="gridOptions" @handle-page-change="handlePageChange">
    <template #form>
      <el-form :model="form" inline class="header-form">
        <el-form-item :label="$t('text.facility_type')" prop="airplaneTypes">
          <el-select v-model="form.resourceId" @change="getList">
            <el-option
              v-for="item in resourcesList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #top>
      <div class="top_content">
        <el-button type="text" icon="el-icon-d-arrow-left" @click="dateChange('left', 'year')" />
        <el-button type="text" icon="el-icon-arrow-left" @click="dateChange('left', 'month')" />
        {{ form.month }}
        <el-button type="text" icon="el-icon-arrow-right" @click="dateChange('right', 'month')" />
        <el-button type="text" icon="el-icon-d-arrow-right" @click="dateChange('right', 'year')" />
      </div>
    </template>

    <template #itemHeader="{ column }">
      <span style="float: left">{{ formatDate(column.property) }}</span>
      <span style="float: right">{{ formatWeek(column.property) }}</span>
    </template>
    <template #contentSlot="{ column, row }">
      <template v-if="!!row.listMap[column.property]">
        <div
          class="scheduler_item"
          v-for="(item, index) in row.listMap[column.property]"
          :key="item.id"
          :style="{ background: colorList[index % 5] + '1A' }"
        >
          <div class="scheduler_header" :style="{ background: colorList[index % 5] }">
            {{ item.syllabusItemName }}
          </div>
          <div class="scheduler_conten" :style="{ color: colorList[index % 5] }">
            <div>
              <div class="subitem">
                <span class="subitem_icon">
                  <SvgIconVue name="timeTable-clock" />
                </span>
                <span>
                  {{ formatDateRange(item.startDate, item.endDate) }}
                </span>
              </div>
              <div class="subitem">
                <span class="subitem_icon">
                  <SvgIconVue name="timeTable-sharpicons_disc" />
                </span>
                <span>{{ item.courseNumber }}</span>
              </div>
              <!-- <div class="subitem">
                                    <span class="subitem_icon">
                                        <SvgIconVue name="timeTable-user" />
                                    </span>
                                    <span>{{ formatTeacher(item.teacherId) }}</span>
                                </div>-->
              <div class="subitem" v-if="!!item.teachers">
                <span class="subitem_icon">
                  <SvgIconVue name="timeTable-user" />
                </span>
                <span>
                  <span v-for="v in item.teachers" :key="v.id">
                    {{ v.name }}&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <template #pager />
  </VxeTable>
</template>

<script lang="ts" setup>
  import { VxeGridProps } from 'vxe-table'
  import VxeTable from '/@/components/Table/index.vue'
  import { ref, reactive, onMounted } from 'vue'

  import { getScheduleBuildFacilitie, IScheduleBuild } from '/@/api/opm/timetable'
  import useResources from '/@/commonTs/resources'
  import dayjs from 'dayjs'
  import { useI18n } from 'vue-i18n'
  import { setPage } from '/@/utils/utils'
  import SvgIconVue from '/@/components/SvgIcon/index.vue'
  import to from 'await-to-js'

  const { t } = useI18n()
  const weekList = [
    t('text.sunday'),
    t('text.monday'),
    t('text.tuesday'),
    t('text.wednesday'),
    t('text.thursday'),
    t('text.friday'),
    t('text.saturday'),
  ]

  const gridOptions = reactive<VxeGridProps>({
    columns: [
      // { type: "checkbox", width: 50 },
      {
        width: 120,
        title: t('text.equipment_name'),
        field: 'name',
        fixed: 'left',
      },
    ],

    data: [],
    border: true,
    align: 'center',
    loading: false,
  })
  const form = reactive<IScheduleBuild>({
    month: dayjs().format('YYYY-MM'),
    searchKey: undefined,
    resourceId: undefined,
    builtinResource: undefined,
  })

  const getColums = () => {
    const columns: any[] = [
      // { type: "checkbox", width: 50 },
      {
        width: 120,
        title: t('text.equipment_name'),
        field: 'name',
        fixed: 'left',
      },
    ]
    for (let index = 0; index < dayjs(form.month).daysInMonth(); index++) {
      let date = dayjs(form.month).startOf('month').add(index, 'days').format('YYYY-MM-DD')
      let obj = {
        title: date,
        field: date,
        minWidth: 120,
        slots: {
          header: 'itemHeader',
          default: 'contentSlot',
        },
      }
      columns.push(obj)
    }
    gridOptions.columns = columns
  }

  const getList = async () => {
    gridOptions.loading = true
    form.builtinResource = (
      resourcesList.value.find((v) => v.id == form.resourceId) as any
    )?.builtinResource

    const [err, res] = await to(getScheduleBuildFacilitie(form))
    gridOptions.loading = false
    if (!err && res.status === 200) {
      const { data } = res
      gridOptions.data = data
      getColums()
    }
  }
  const formatDate = (date) => dayjs(date).format('DD')
  const formatWeek = (date) => weekList[dayjs(date).day()]

  const colorList = ['#5CA5F2', '#4CAC6D', '#6C86DF', '#EFA31E', '#4ECBCE']

  const formatDateRange = (startDate, endDate) =>
    dayjs(startDate).format('HH:mm') + '-' + dayjs(endDate).format('HH:mm')

  const dateChange = (direction: string, type: string) => {
    form.month = dayjs(form.month)
      .add(direction == 'left' ? -1 : 1, type == 'year' ? 'year' : 'month')
      .format('YYYY-MM')
    getList()
  }

  const { getResourcesoScheduleList, resourcesList } = useResources()

  onMounted(async () => {
    await getResourcesoScheduleList({ resourceType: 'FACILITIES' })

    if (resourcesList.value.length == 0) return false
    form.resourceId = resourcesList.value[0].id
    getList()
  })
  const handlePageChange = (val) => {
    if (val.type == 'size') {
      form.page = setPage(form.total, form)
    }
    getList()
  }
</script>

<style scoped lang="scss">
  .scheduler_item {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .scheduler_header {
      // background: rgba($color: #000000, $alpha: 0.08);
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-align: center;
      color: #ffffff;
      line-height: 24px;
    }
    .scheduler_conten {
      flex: 1;
      padding: 7px;
      & > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 2px;
        .subitem {
          font-size: 12px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: left;
          // &:not(:last-child) {
          //     margin-bottom: 8px;
          // }
          .subitem_icon {
            display: inline-block;
            margin-right: 7px;
            width: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            text-align: center;
            line-height: 16px;
          }
        }
      }
    }
  }

  :deep(.vxe-body--column) {
    padding: 0 !important;
    .vxe-cell {
      padding: 0 0.5px !important;
    }
  }

  .top_content {
    text-align: center;
  }
  :deep(.vxe-body--column:not(:first-child)) {
    vertical-align: unset;
  }
</style>
