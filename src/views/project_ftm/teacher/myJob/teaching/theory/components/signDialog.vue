<template>
  <el-dialog
    v-if="type == typeEnum.add"
    center
    key="add"
    :title="title"
    :close-on-click-modal="false"
    v-model="show"
    @closed="refresh"
  >
    <el-form :model="form" :rules="rules" label-width="120px" ref="form">
      <!-- 授课时段 -->
      <el-form-item :label="$t('table.teachingPeriod')" prop="dateTimeRang">
        <date-picker :editable="false" value-format="yyyy-MM-dd" v-model="form.dateTimeRang" />
      </el-form-item>
      <!-- 评语 -->
      <el-form-item :label="$t('table.comment')" prop="remark">
        <el-input
          type="textarea"
          :placeholder="$t('holder.pleaseEnterComment')"
          :autosize="{ minRows: 3 }"
          v-model="form.remark"
        />
      </el-form-item>
      <!-- pincode -->
      <el-form-item :label="$t('table.pinCode')" prop="pinCode">
        <el-input
          class="full-width"
          type="password"
          :placeholder="$t('holder.pleaseEnterSignPinCode')"
          v-model="form.pinCode"
        />
      </el-form-item>
    </el-form>

    <template class="dialog-footer" #footer>
      <el-button class="btn" type="primary" plain @click="show = false">{{
        $t('button.cancel')
      }}</el-button>
      <el-button class="btn" type="primary" :loading="loading" @click="submit">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-else-if="type == typeEnum.modify"
    center
    key="modify"
    width="600px"
    :title="title"
    :close-on-click-modal="false"
    v-model="show"
    @closed="refresh"
  >
    <el-form :model="form" :rules="rules" label-width="120px" ref="form">
      <!-- 评语 -->
      <el-form-item :label="$t('table.comment')" prop="remark">
        <el-input
          type="textarea"
          :placeholder="$t('holder.pleaseEnterComment')"
          :autosize="{ minRows: 3 }"
          v-model="form.remark"
        />
      </el-form-item>
    </el-form>

    <template class="dialog-footer" #footer>
      <el-button class="btn" type="primary" plain @click="show = false">{{
        $t('button.cancel')
      }}</el-button>
      <el-button class="btn" type="primary" :loading="loading" @click="submit">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import XEUtils from 'xe-utils'
  import { typeEnum } from './signDialog.enum'
  import DatePicker from '/@/views/project_ftm/teacher/components/DatePicker/index.vue'
  export default {
    data() {
      return {
        typeEnum,
        form: XEUtils.clone(
          {
            dateTimeRang: ['', ''],
            remark: '',
            pinCode: '',
          },
          true,
        ),
        rules: {
          dateTimeRang: [
            {
              required: true,
              message: this.$t('holder.pleaseSelectPeroid'),
              validator: this.validateDateRange,
            },
          ],
          pinCode: [{ required: true, message: this.$t('holder.pleaseEnterSignPinCode') }],
        },
        loading: false,
      }
    },
    props: {
      title: String,
      value: {},
      type: {
        type: [String, Number],
        default: typeEnum.add,
      },
    },
    components: { DatePicker },
    computed: {
      show: {
        get() {
          return this.value
        },
        set(v) {
          this.$emit('update:modelValue', v)
        },
      },
    },
    methods: {
      refresh() {
        this.$refs.form.resetFields()
        this.loading = false
      },
      submit() {
        this.$refs.form.validate((v) => {
          if (v) {
            this.loading = true
            this.$emit('submit', this.form)
          }
        })
      },
      validateDateRange(rule, value, cb) {
        if (!(value instanceof Array) || value.length < 2) {
          cb(new Error(this.$t('holder.pleaseSelectPeroid')))
        } else if (!value[0] || !value[1]) {
          cb(new Error(this.$t('holder.pleaseSelectDate')))
        } else {
          cb()
        }
      },
    },
  }
</script>
