<template>
  <el-dialog
    :title="getTitle"
    v-model="dialogVisible"
    width="1000px"
    @close="close"
    @open="open"
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="demo-form">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('text.customer_type')" prop="customerTypeId">
            <el-select v-model="form.customerTypeId" :placeholder="$t('text.please_select')">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.customer_name')" prop="name">
            <el-input v-model="form.name" :placeholder="$t('text.please_enter')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.customer_abbreviation')" prop="shortName">
            <el-input v-model="form.shortName" :placeholder="$t('text.please_enter')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.customer_code')" prop="code">
            <el-input v-model="form.code" :placeholder="$t('text.please_enter')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.customer_classification')" prop="regularSettle">
            <el-select v-model="form.regularSettle" :placeholder="$t('text.please_select')">
              <el-option :label="$t('text.settlement_customer')" :value="true" />
              <el-option :label="$t('text.non_settlement_customer')" :value="false" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.customer_contact_')" prop="contactPersonName">
            <el-input v-model="form.contactPersonName" :placeholder="$t('text.please_enter')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('text.contact_mobile_phone')" prop="contactPersonPhone">
            <el-input v-model="form.contactPersonPhone" :placeholder="$t('text.please_enter')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('message.hscancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('message.hsdefine') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
  import {
    postCustomers,
    getCustomersDetail,
    putCustomersId,
    getCustomersTypesAll,
  } from '/@/api/opm/customer'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  interface IForm {
    shortName: string
    customerTypeId: number
    code: string
    contactPersonPhone: string
    contactPersonName: string
    name: string
    regularSettle: boolean
  }
  export default defineComponent({
    name: 'ClassRoomDiaLog',
    props: {
      isShow: Boolean,
      type: {
        type: String,
        default: 'add',
      },
      id: Number,
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
        return props.type == 'add' ? t('text.new_customers') : t('text.modify_customer')
      })
      const state = reactive({
        form: {
          shortName: undefined,
          customerTypeId: undefined,
          code: undefined,
          contactPersonPhone: undefined,
          contactPersonName: undefined,
          name: undefined,
          regularSettle: undefined,
        } as IForm,
        rules: {
          shortName: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          customerTypeId: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          code: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          contactPersonPhone: [
            {
              required: false,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          contactPersonName: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          name: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          regularSettle: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
        },
        typeList: [],
      })
      const resetForm = () => {
        formRef.value.resetFields()
      }
      const close = () => {
        resetForm()
      }
      const open = () => {
        getTypeList()
        if (props.type == 'edit') {
          getCustomersDetail(props.id).then((res) => {
            if (res.status == 200) {
              res.data.customerTypeId = res.data.customerType.id
              state.form = res.data
            }
          })
        }
      }
      const confirm = () => {
        formRef.value.validate((valid: boolean) => {
          if (valid) {
            let api = undefined
            if (props.type == 'add') {
              api = postCustomers
            } else {
              api = putCustomersId
            }
            api(state.form).then((res) => {
              const { status } = res
              if (status == 200) {
                ElMessage.success({
                  message:
                    props.type == 'add'
                      ? t('message.successfully_added')
                      : t('message.modified_successfully'),
                  type: 'success',
                })
                emit('updateData')
                dialogVisible.value = false
              }
            })
          } else {
            return false
          }
        })
      }
      const getTypeList = () => {
        getCustomersTypesAll().then((res) => {
          state.typeList = res.data
        })
      }
      return {
        dialogVisible,
        getTitle,
        ...toRefs(state),
        formRef,
        close,
        confirm,
        open,
      }
    },
  })
</script>

<style scoped></style>
