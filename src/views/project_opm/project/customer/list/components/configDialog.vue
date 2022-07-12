<template>
  <el-dialog
    title="客户类型配置"
    v-model="dialogVisible"
    width="1000px"
    @close="close"
    @open="open"
    destroy-on-close
  >
    <el-row>
      <el-col :span="10" class="form-container">
        <el-form
          :model="dynamicValidateForm"
          ref="formRef"
          class="demo-dynamic"
          label-width="100px"
        >
          <!-- :label="$t('text.type') + (index + 1)" -->
          <el-form-item
            v-for="(client, index) in dynamicValidateForm.clients"
            :key="index"
            :prop="'clients.' + index + '.name'"
            :rules="{
              required: true,
              message: $t('text.customer_type_cannot_be_empty'),
              trigger: 'blur',
            }"
          >
            <el-tag
              style="width: 150px; margin-right: 10px"
              v-show="client.id && !client.canEdit"
              >{{ client.name }}</el-tag
            >
            <el-input
              style="width: 150px; margin-right: 10px"
              v-model="client.name"
              v-show="!(client.id && !client.canEdit)"
              clearable
            />

            <el-button
              size="mini"
              v-if="client.id && !client.canEdit"
              @click.prevent="editClient(client)"
              plain
              type="primary"
            >
              <el-icon>
                <Edit />
              </el-icon>
            </el-button>
            <el-button
              v-if="client.id && client.canEdit"
              @click.prevent="saveClient(client, 'clients.' + index + '.name')"
              plain
              type="primary"
              size="mini"
            >
              <el-icon>
                <Check />
              </el-icon>
            </el-button>
            <el-button plain type="danger" @click.prevent="removeDomain(client)" size="mini">
              <el-icon>
                <close />
              </el-icon>
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">
              {{ $t('message.submit') }}
            </el-button>
            <el-button @click="addDomain">
              {{ $t('text.new_customer_type') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { reactive, toRefs, ref, onMounted, computed } from 'vue'
  import {
    getCustomersTypesList,
    postCustomersTypes,
    putCustomersTypesId,
    deleteCustomersTypesId,
  } from '/@/api/opm/customer'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { Edit, Check, Close } from '@element-plus/icons-vue'
  interface Props {
    isShow: boolean
  }
  const props = withDefaults(defineProps<Props>(), {
    isShow: false,
  })
  const emit = defineEmits<{
    (e: 'update:isShow', data: boolean): void
  }>()
  const dialogVisible = computed({
    get: (): boolean => props.isShow,
    set: (val: boolean) => emit('update:isShow', val),
  })
  const { t } = useI18n()
  const formRef = ref(null)
  const state = reactive({
    dynamicValidateForm: {
      clients: [
        {
          name: '',
          id: undefined,
          canEdit: true,
        },
      ],
    },
  })
  const { dynamicValidateForm } = toRefs(state)
  const methods = reactive({
    submitForm() {
      formRef.value.validate((valid) => {
        if (valid) {
          // alert("submit!");
          methods.postCustomers()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      formRef.value.resetFields()
    },
    removeDomain(item) {
      ElMessageBox.confirm(t('tip.this_operation_will_delete_the_selected_data'), {
        type: 'warning',
      })
        .then(() => {
          var index = state.dynamicValidateForm.clients.indexOf(item)

          if (index !== -1 && item.id) {
            deleteCustomersTypesId(item.id).then(() => {
              ElMessage.success(t('message.delete_succeeded'))
              state.dynamicValidateForm.clients.splice(index, 1)
            })
          } else {
            state.dynamicValidateForm.clients.splice(index, 1)
          }
        })
        .catch((_) => {})
    },
    addDomain() {
      state.dynamicValidateForm.clients.push({
        name: '',
        // key: Date.now(),
        id: undefined,
        canEdit: true,
      })
    },
    getList() {
      getCustomersTypesList({
        page: 1,
        size: 1000,
      }).then((res) => {
        state.dynamicValidateForm.clients = res.data.content.map((v) => {
          v.canEdit = false
          return v
        })
      })
    },
    postCustomers() {
      postCustomersTypes(state.dynamicValidateForm.clients.filter((v) => !v.id)).then(() => {
        ElMessage.success(t('message.successfully_added'))
        methods.getList()
      })
    },
    editClient(item: any) {
      item.canEdit = true
    },
    saveClient(item: object, prop: string) {
      formRef.value.validateField(prop, (valid) => {
        console.log(valid)

        if (!valid) {
          putCustomersTypesId(item).then(() => {
            ElMessage.success(t('message.modified_successfully'))
            methods.getList()
          })
        }
      })
    },
    close() {},
    open() {},
  })

  const {
    submitForm,
    resetForm,
    removeDomain,
    addDomain,
    getList,
    postCustomers,
    editClient,
    saveClient,
  } = toRefs(methods)
  onMounted(() => {
    methods.getList()
  })
</script>

<style scoped lang="scss">
  .form-container {
    margin-top: 50px;
  }
  :deep(.el-form-item) {
    .el-form-item__content {
      width: 150px;
      display: flex;
    }
  }
  :deep(.el-tag) {
    width: 100%;
    height: 100%;
    line-height: 30px;
    text-align: center;
  }
</style>
