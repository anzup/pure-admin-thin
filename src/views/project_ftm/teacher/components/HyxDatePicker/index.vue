<template>
  <div class="el-inline">
    <el-date-picker
      v-model="startDate"
      :readonly="readonly"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :size="size"
      :placeholder="translate.startPlaceholder"
      :type="computeType"
      :format="format"
      :default-value="startDefaultValue"
      :default-time="defaultTime[0]"
      :value-format="valueFormat"
      :prefix-icon="prefixIcon"
      :clear-icon="clearIcon"
      :disabledDate="pickerOptions.disabledDate"
      :cell-class-name="pickerOptions.cellClassName"
      @change="changeStartDate"
    />
    <span class="el-range-separator">{{ translate.rangeSeparator }}</span>
    <el-date-picker
      ref="endDatePicker"
      v-model="endDate"
      :readonly="readonly"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :size="size"
      :placeholder="translate.endPlaceholder"
      :type="computeType"
      :format="format"
      :default-value="endDefaultValue"
      :default-time="defaultTime[1]"
      :value-format="valueFormat"
      :prefix-icon="prefixIcon"
      :clear-icon="clearIcon"
      :disabled-date="endPickerOptions.disabledDate"
      :cell-class-name="endPickerOptions.cellClassName"
      @change="changeEndDate"
    />
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'hyxDatePicker',
    data() {
      return {
        d: new Date(),
        value1: '',
      }
    },
    props: {
      modelValue: Array,
      readonly: Boolean,
      disabled: Boolean,
      // 文本框可输入
      editable: {
        type: Boolean,
        default: true,
      },
      // 是否显示清除按钮
      clearable: {
        type: Boolean,
        default: true,
      },
      // 输入框尺寸 large, small, mini
      size: String,
      placeholder: String,
      // 范围选择时开始日期的占位内容
      startPlaceholder: {
        type: String,
      },
      // 范围选择时结束日期的占位内容
      endPlaceholder: {
        type: String,
      },
      // 是否使用箭头进行时间选择
      timeArrowControl: Boolean,
      // 显示类型 year/month/date/week/datetime/datetimerange/daterange
      type: {
        type: String,
        default: 'date',
      },
      // 显示在输入框中的格式
      format: String,
      // 对齐方式 left, center, right
      align: {
        type: String,
        default: 'left',
      },
      // 选择范围时的分隔符
      rangeSeparator: {
        type: String,
      },
      // 可选，选择器打开时默认显示的时间
      defaultValue: Array,
      // 选择器打开默认显示具体时刻
      defaultTime: {
        type: Array,
        default: () => [undefined, undefined],
      },
      // 可选，绑定值的格式。不指定则绑定值为 Date 对象
      valueFormat: {
        type: String,
      },
      // 自定义头部图标的类名
      prefixIcon: String,
      clearIcon: String,
    },
    computed: {
      translate() {
        return {
          startPlaceholder: this.startPlaceholder || this.$t('table.startTime'),
          endPlaceholder: this.endPlaceholder || this.$t('table.endTime'),
          rangeSeparator: this.rangeSeparator || this.$t('common.to'),
        }
      },
      startDate: {
        get() {
          return this.modelValue instanceof Array ? this.modelValue[0] : ''
        },
        set(val) {
          console.log(val, 'start')
          this.$emit('update:modelValue', [val, this.endDate])
        },
      },
      endDate: {
        get() {
          return this.modelValue instanceof Array ? this.modelValue[1] : ''
        },
        set(val) {
          this.$emit('update:modelValue', [this.startDate, val])
        },
      },
      startDefaultValue() {
        return this.defaultValue instanceof Array ? this.defaultValue[0] : ''
      },
      endDefaultValue() {
        return this.defaultValue instanceof Array ? this.defaultValue[1] : ''
      },
      computeType() {
        return this.type.replace(/range/g, '')
      },
      pickerOptions() {
        // 精确到日的时间类型
        const startDate = new Date(moment(this.startDate).format('YYYY/MM/DD'))
        const endDate = new Date(moment(this.endDate).format('YYYY/MM/DD'))
        return {
          disabledDate: (time) => {
            return time.getTime() > endDate.getTime()
          },
          cellClassName: (time) => {
            let className = []
            if (
              time.getTime() >= new Date(startDate).getTime() &&
              time.getTime() <= new Date(endDate).getTime()
            ) {
              className.push('in-range')
            }
            if (time.getTime() == new Date(startDate).getTime()) {
              className.push('start-date')
            }
            if (time.getTime() == new Date(endDate).getTime()) {
              className.push('end-date')
            }
            return className.join(' ')
          },
        }
      },
      endPickerOptions() {
        // 精确到日的时间类型
        const startDate = new Date(moment(this.startDate).format('YYYY/MM/DD'))
        const endDate = new Date(moment(this.endDate).format('YYYY/MM/DD'))
        return {
          disabledDate: (time) => {
            return startDate.getTime() > time.getTime()
          },
          cellClassName: (time) => {
            let className = []
            if (
              time.getTime() >= new Date(startDate).getTime() &&
              time.getTime() <= new Date(endDate).getTime()
            ) {
              className.push('in-range')
            }
            if (time.getTime() == new Date(startDate).getTime()) {
              className.push('start-date')
            }
            if (time.getTime() == new Date(endDate).getTime()) {
              className.push('end-date')
            }
            return className.join(' ')
          },
        }
      },
    },
    methods: {
      changeStartDate(time) {
        if (!!time && this.endDate && time.getTime() > this.endDate.getTime()) {
          this.startDate = ''
          Message.error({
            duration: 1500,
            message: '开始时间不能大于结束时间',
          })
        }
      },
      changeEndDate(time) {
        if (!!time && this.startDate && this.startDate.getTime() > time.getTime()) {
          this.endDate = ''
          Message.error({
            duration: 1500,
            message: '结束时间不能小于开始时间',
          })
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-inline {
    display: flex;
    align-items: center;
  }
  .el-range-separator {
    padding: 0 10px;
    font-size: 12px;
  }
</style>
