<template>
  <el-dialog
    :title="getTitle"
    v-model="dialogVisible"
    width="600px"
    @close="close"
    @open="open"
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="demo-form">
      <el-form-item :label="$t('text.resource_type_name')" prop="name">
        <el-input v-model="form.name" :placeholder="$t('text.please_enter')" />
      </el-form-item>

      <el-form-item :label="$t('text.settlement_unit')" prop="unit">
        <el-input v-model="form.unit" :placeholder="$t('text.please_select')" />
      </el-form-item>
      <el-form-item :label="$t('text.resource_type')" prop="resourceType">
        <el-select disabled v-model="form.resourceType" :placeholder="$t('text.please_select')">
          <el-option :label="$t('text.training_facilities')" value="FACILITIES" />
          <el-option :label="$t('text.trainer')" value="TEACHER" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item :label="$t('text.bill_type')" prop="courseType">
                    <el-select
                    disabled
                        v-model="form.courseType"
                        :placeholder="$t('text.please_select')"
                    >
                        <el-option
                            :label="$t('text.wet_lease')"
                            value="WET_LEASE"
                        ></el-option>
                        <el-option
                            :label="$t('text.dry_lease')"
                            value="DRY_LEASE"
                        ></el-option>
                    </el-select>
                </el-form-item> -->

      <el-form-item :label="$t('text.remarks')" prop="remark">
        <el-input type="textarea" v-model="form.remark" :placeholder="$t('text.please_enter')" />
      </el-form-item>
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
  import { getAirplaneTypesAll } from '/@/api/opm/device'
  import { postResources, getResourcesDetail, putResourcesId } from '/@/api/opm/contract'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
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
        return props.type == 'add' ? t('text.new_resource_type') : t('text.modify_resource_type')
      })
      const state = reactive({
        form: {
          name: undefined,
          airplaneType: undefined,
          unit: undefined,
          resourceType: 'FACILITIES',
          remark: undefined,
          courseType: undefined,
        },
        rules: {
          name: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          airplaneType: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          unit: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          resourceType: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          remark: [
            {
              required: false,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          courseType: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
        },
        airplaneTypesAll: [],
      })
      const resetForm = () => {
        formRef.value.resetFields()
      }
      const close = () => {
        resetForm()
      }
      const open = () => {
        // getAirplaneTypesAllList();

        if (props.type == 'edit') {
          getResourcesDetail(props.id).then((res) => {
            if (res.status == 200) {
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
              api = postResources
            } else {
              api = putResourcesId
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
      const getAirplaneTypesAllList = () => {
        getAirplaneTypesAll().then((res) => {
          state.airplaneTypesAll = res.data
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
