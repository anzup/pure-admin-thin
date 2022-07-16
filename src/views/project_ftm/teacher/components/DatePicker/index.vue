<template>
  <div class="el-inline">
    <el-date-picker
      v-model="startDate"
      :readonly="readonly"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :size="size"
      :placeholder="startPlaceholder"
      :type="computeType"
      :format="format"
      :align="align"
      :picker-options="pickerOptions"
      :default-value="startDefaultValue"
      :default-time="defaultTime[0]"
      :value-format="valueFormat"
      :prefix-icon="prefixIcon"
      :clear-icon="clearIcon"
      @change="changeStartDate"
    />
    <span class="el-range-separator">{{ rangeSeparator }}</span>
    <el-date-picker
      ref="endDatePicker"
      v-model="endDate"
      :readonly="readonly"
      :disabled="disabled"
      :editable="editable"
      :clearable="clearable"
      :size="size"
      :placeholder="endPlaceholder"
      :type="computeType"
      :format="format"
      :align="align"
      :picker-options="endPickerOptions"
      :default-value="endDefaultValue"
      :default-time="defaultTime[1]"
      :value-format="valueFormat"
      :prefix-icon="prefixIcon"
      :clear-icon="clearIcon"
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
      }
    },
    props: {
      value: Array,
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
        default: '开始日期',
      },
      // 范围选择时结束日期的占位内容
      endPlaceholder: {
        type: String,
        default: () => '结束日期',
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
        default: () => '至',
      },
      // 可选，选择器打开时默认显示的时间
      defaultValue: Array,
      // 选择器打开默认显示具体时刻
      defaultTime: {
        type: Array,
        default: () => [null, null],
      },
      // 可选，绑定值的格式。不指定则绑定值为 Date 对象
      valueFormat: {},
      // 自定义头部图标的类名
      prefixIcon: String,
      clearIcon: String,
    },
    computed: {
      startDate: {
        get() {
          return this.value instanceof Array ? this.value[0] : ''
        },
        set(val) {
          this.$emit('input', [val, this.endDate])
        },
      },
      endDate: {
        get() {
          return this.value instanceof Array ? this.value[1] : ''
        },
        set(val) {
          this.$emit('input', [this.startDate, val])
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
