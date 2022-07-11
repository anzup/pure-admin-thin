<template>
  <div>
    <el-dialog
      :title="$t('text.leading_out')"
      v-model="dialogVisible"
      width="300px"
      @open="open"
      destroy-on-close
    >
      <el-form v-loading="testLoading">
        <el-form-item :label="$t('text.select_customer')">
          <el-select v-model="customerId" :placeholder="$t('text.please_select')">
            <el-option
              v-for="item in customerAllList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('message.hscancel') }}</el-button>
          <el-button type="primary" @click="exportTemplete">{{ $t('message.hsdefine') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { ElMessage } from 'element-plus'
  import { computed, defineComponent, ref } from 'vue'
  import useCustomers from '/@/commonTs/customer'
  import { getClazzsTemplate } from '/@/api/opm/train'
  import { getOpenDownload } from '/@/api/opm/file'
  import { convertResBlob } from '/@/utils/utils'
  export default defineComponent({
    name: 'LeadingIn',
    props: {
      modelValue: Boolean,
    },
    emits: ['update:modelValue', 'updateData'],
    setup(props, { emit }) {
      const testLoading = ref(false)

      const customerId = ref<number>(undefined)
      const dialogVisible = computed({
        get: () => {
          return props.modelValue
        },
        set: (val) => {
          emit('update:modelValue', val)
        },
      })

      const exportTemplete = async () => {
        if (!customerId.value) return ElMessage.error('请选择客户后再导出文件！')

        // const { data } = await getClazzsTemplate(customerId.value);
        // getOpenDownload(data).then(res => {
        //     convertResBlob(res);
        // });
      }
      const { getCustomersAllList, customerAllList } = useCustomers()
      const open = () => {
        customerId.value = undefined
        getCustomersAllList()
      }
      return {
        dialogVisible,

        testLoading,

        customerId,
        customerAllList,
        open,
        exportTemplete,
      }
    },
  })
</script>

<style scoped></style>
