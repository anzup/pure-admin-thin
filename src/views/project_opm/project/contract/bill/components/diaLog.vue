<template>
  <!-- 结算 -->
  <el-dialog
    :title="getTitle"
    v-model="dialogVisible"
    width="500px"
    @close="close"
    destroy-on-close
  >
    <!-- @open="open" -->
    <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" class="demo-form">
      <el-form-item :label="$t('text.start_time')" v-if="showStartDate" prop="startDate">
        <el-date-picker
          v-model="form.startDate"
          :placeholder="$t('text.select_month')"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item :label="$t('text.end_time')" prop="endDate" v-if="showEndDate">
        <el-date-picker
          v-model="form.endDate"
          :placeholder="$t('text.select_month')"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item
        v-if="contractsList.length > 0"
        :label="$t('text.select_contract')"
        prop="contractId"
      >
        <el-select v-model="form.contractId" :placeholder="$t('text.please_select')">
          <el-option
            v-for="(item, index) in contractsList"
            :key="index"
            :label="item.contractNo"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <span v-else class="empty_con">{{ $t('text.the_customer_has_no_contract') }}</span>
      <el-form-item prop="proportion" :label="$t('text.settlement_proportion')">
        <el-input-number v-model="form.proportion" :min="0" :max="1" :precision="2" :step="0.1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('message.hscancel') }}
        </el-button>
        <el-button :disabled="contractsList.length == 0" type="primary" @click="confirm">
          {{ $t('message.hsdefine') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { ElMessage } from 'element-plus'
  import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
  import { getBillcheck, postBills, getContractsList } from '/@/api/opm/contract'
  interface IForm {
    billItemIds: number[]
    endDate: string
    startDate: string
    present: boolean
    customerId: number
    contractId: number
    proportion: number
  }
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    name: 'RolesDiaLog',
    props: {
      isShow: Boolean,
      type: {
        type: String,
      },
      selectArr: {
        type: Array,
        default: () => [],
      },
      customerId: Number,
    },
    emits: ['updateData', 'update:isShow'],
    setup(props, { emit }) {
      const { t } = useI18n()
      const formRef = ref(null)
      const dialogVisible = computed({
        get: (): boolean => props.isShow,
        set: (val: boolean) => emit('update:isShow', val),
      })
      const getTitle = computed(() => {
        return props.type == 'settlement'
          ? t('text.settlement_training_course')
          : t('text.complimentary_training_courses')
      })
      const state = reactive({
        form: {
          billItemIds: [],
          endDate: undefined,
          startDate: undefined,
          present: undefined,
          customerId: undefined,
          contractId: undefined,
          proportion: 1,
        } as IForm,
        rules: {
          endDate: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          startDate: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          contractId: [
            {
              required: false,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          proportion: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
        },
      })

      const close = () => {
        formRef.value.resetFields()
        showStartDate.value = false
        showEndDate.value = false
      }
      // 显示开始时间
      const showStartDate = ref<boolean>(false)
      // 显示结束时间
      const showEndDate = ref<boolean>(false)
      // 合同列表
      const contractsList = ref([])
      const open = async () => {
        const { data: contractsData } = await getContractsList({
          page: 1,
          size: 10,
          customerId: props.customerId,
        })
        contractsList.value = contractsData.content
        // if (contractsList.value.length == 1) {
        //     state.form.contractId = contractsList.value[0]?.id
        // }
        const { data } = await getBillcheck({
          value: props.selectArr.join(),
          customerId: props.customerId,
        })
        if (!data) {
          dialogVisible.value = true
          showStartDate.value = true
          showEndDate.value = true
          return
        }

        if (data) {
          dialogVisible.value = true

          // return confirm();
        }
        // showStartDate.value = data[0].length > 0;
        // showEndDate.value = data[0].length > 0 || data[1].length > 0
        // dialogVisible.value = true
      }
      const confirm = () => {
        state.form.customerId = props.customerId
        if (!formRef.value) {
          state.form.billItemIds = props.selectArr as number[]
          state.form.present = props.type == 'give'
          postBills(state.form).then((res) => {
            ElMessage.success(t('message.successfully_added'))
            emit('updateData')
          })
        } else {
          formRef.value.validate((valid: boolean) => {
            if (valid) {
              state.form.billItemIds = props.selectArr as number[]
              state.form.present = props.type == 'give'
              postBills(state.form).then((res) => {
                ElMessage.success(
                  t('text.add_bill_in_total', {
                    total: res.data[0],
                    success: res.data[1],
                    fail: res.data[0] - res.data[1],
                  }),
                )
                dialogVisible.value = false
                emit('updateData')
              })
            } else {
              return false
            }
          })
        }
      }

      return {
        dialogVisible,
        getTitle,
        ...toRefs(state),
        formRef,
        close,
        confirm,
        open,
        showStartDate,
        showEndDate,
        contractsList,
      }
    },
  })
</script>

<style scoped lang="scss">
  .empty_con {
    color: red;
    padding-left: 80px;
  }
</style>
