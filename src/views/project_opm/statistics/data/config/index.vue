<template>
  <el-tabs
    :class="{ 'one-leve-tab': true, 'is-footer': isFooter }"
    tab-position="left"
    type="border-card"
    style="height: 100%"
    v-model="activeName"
  >
    <el-tab-pane :label="$t('text.training_shift_setting')" name="first">
      <VxeTable v-bind="gridOptions">
        <template #form>
          <el-button type="primary" @click="open(undefined)">{{ $t('message.hsadd') }}</el-button>
        </template>
      </VxeTable>
    </el-tab-pane>
    <el-tab-pane :label="$t('text.efficiency_setting')" name="second">
      <el-row>
        <el-col :offset="8" :span="8">
          <el-form
            :model="efficiencyForm.form"
            ref="efficiencyFormRef"
            :rules="efficiencyForm.rules"
            label-position="top"
            :disabled="!canEdit"
          >
            <el-form-item :label="$t('text.equipment_operation_utilization')" prop="useBaseTime">
              <span class="text">{{ $t('text.press_every_day') }}</span>
              <el-input-number
                :min="1"
                :max="24"
                :precision="0"
                v-model="efficiencyForm.form.useBaseTime"
              />
              <span class="text">{{ $t('text.hour_calculation') }}</span>
            </el-form-item>
            <el-form-item :label="$t('text.equipment_sales_utilization')" prop="saleBaseTime">
              <span class="text">{{ $t('text.press_every_day') }}</span>
              <el-input-number
                :min="1"
                :max="24"
                :precision="0"
                v-model="efficiencyForm.form.saleBaseTime"
              />
              <span class="text">{{ $t('text.hour_calculation') }}</span>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-tab-pane>

    <div class="footer">
      <el-button v-show="!canEdit" type="primary" @click="canEdit = true" plain>{{
        $t('message.modify')
      }}</el-button>
      <el-button v-show="canEdit" type="primary" @click="confirm">{{
        $t('message.hssave')
      }}</el-button>
    </div>
    <Dialog v-model="isShow" @updateData="getData" :rowData="rowData" />
  </el-tabs>
</template>

<script setup lang="ts">
  import VxeTable from '/@/components/Table/index.vue'
  import Dialog from './components/dialog.vue'
  import { computed, onMounted, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { getTimeLimits, putTimeLimitsBaseTime, deleteSpecialTime } from '/@/api/opm/controlPanel'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import dayjs from 'dayjs'
  import duration from 'dayjs/plugin/duration'
  dayjs.extend(duration)
  const { t } = useI18n()
  const isFooter = computed(() => activeName.value == 'second')
  const gridOptions = reactive<VxeTableAllProps>({
    height: null,
    columns: [
      {
        field: 'name',
        title: t('text.shift_name'),
      },
      {
        field: 'startDate',
        title: t('text.start_time'),
        formatter: ({ cellValue }) => dayjs(cellValue).format('HH:mm'),
      },
      {
        field: 'endDate',
        title: t('text.end_time'),
        formatter: ({ cellValue }) => dayjs(cellValue).format('HH:mm'),
      },
      {
        field: '',
        title: t('text.duration'),
        formatter: ({ row }) =>
          Math.abs(dayjs(row.startDate).diff(row.endDate, 'hour')) + t('text.hour'),
      },
      {
        title: t('text.operation'),
        slots: { default: 'operate' },
        field: 'operationTypes',
      },
    ],
    loading: false,
    buttons: ({ row }) => [
      {
        name: t('message.edit'),
        event: ({ row }) => {
          open(row)
        },
      },
      {
        name: t('message.hsdelete'),
        status: 'danger',
        disabled: !!row.builtinType,
        event: ({ row }) => {
          ElMessageBox.confirm(
            t('tip.this_operation_will_delete_the_selected_data'),
            t('text.tip'),
            {
              type: 'warning',
            },
          )
            .then(() => {
              deleteSpecialTime(row.id).then((res) => {
                ElMessage.success(t('message.delete_succeeded'))
                getData()
              })
            })
            .catch(() => {})
        },
      },
    ],
  })
  const isShow = ref(false)
  const activeName = ref('first')
  const efficiencyForm = reactive({
    form: {
      useBaseTime: 24,
      saleBaseTime: 24,
    },
    rules: {
      useBaseTime: {
        required: true,
        type: 'number',
        message: t('text.please_enter'),
      },
      saleBaseTime: {
        required: true,
        type: 'number',
        message: t('text.please_enter'),
      },
    } as ElFormInstance['rules'],
  })
  const efficiencyFormRef = ref<ElFormInstance>(),
    canEdit = ref(false)
  const confirm = () => {
    efficiencyFormRef.value.validate((valid) => {
      if (valid) {
        putTimeLimitsBaseTime(efficiencyForm.form).then((res) => {
          ElMessage.success(t('message.modified_successfully'))
          getData()
          canEdit.value = false
        })
      }
    })
  }
  const getData = () => {
    gridOptions.loading = true
    getTimeLimits().then((res) => {
      gridOptions.data = res.data.specialTimes
      efficiencyForm.form.saleBaseTime = res.data.saleBaseTime
      efficiencyForm.form.useBaseTime = res.data.useBaseTime
      gridOptions.loading = false
    })
  }
  const rowData = ref()

  const open = (val: any) => {
    rowData.value = val
    isShow.value = true
  }
  onMounted(() => {
    getData()
  })
</script>

<style scoped lang="scss">
  :deep(.vxe-grid--form-wrapper) {
    padding: 0;
    text-align: right;
    padding-bottom: 10px;
  }
  :deep(.el-form-item__content) {
    display: flex;
    .el-input-number {
      width: 150px;
      margin: 0 $defaultMarginWidth;
    }
  }
</style>
