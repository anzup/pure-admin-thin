<template>
  <div>
    <el-dialog
      :title="getTitle"
      v-model="dialogVisible"
      width="500px"
      @close="close"
      @open="open"
      destroy-on-close
    >
      <el-form :model="form" label-width="50px" ref="formRef">
        <el-form-item
          :label="$t('text.resource_type')"
          v-if="!resourcesType"
          prop="resourcesTypeId"
        >
          <el-select v-model="form.resourcesTypeId">
            <el-option
              v-for="(item, index) in resourcesTypeList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('message.hssearch')">
          <el-input v-model="form.searchKey" :placeholder="$t('text.please_enter')" />
        </el-form-item>
        <el-form-item label-width="0" prop="id">
          <el-scrollbar height="200px">
            <el-radio-group v-model="form.id">
              <el-radio v-for="item in resourcesList" :key="item.rid" :label="item.rid">{{
                item.name
              }}</el-radio>
            </el-radio-group>
          </el-scrollbar>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('message.hscancel') }}
          </el-button>
          <el-button type="primary" :disabled="!form.id" @click="confirm">{{
            $t('message.hsdefine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed, toRefs, inject, Ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { putSchedulesBind, ClazzTheorySeting } from '/@/api/opm/train'
  import { useI18n } from 'vue-i18n'
  import type { ElForm } from 'element-plus'

  type ElFormInstance = InstanceType<typeof ElForm>
  export default defineComponent({
    name: 'FacilitiesDialog',
    props: {
      isShow: Boolean,
      selectList: {
        type: Array as PropType<any[]>,
        default: () => [],
      },
      functionType: String,
    },
    emits: ['updateData', 'update:isShow'],
    setup(props, { emit }) {
      const allResources = inject<Ref<Array<Scheduler.IResourcesTypeList>>>('allResources')

      const { t } = useI18n()
      const formRef = ref<ElFormInstance>(null)
      const dialogVisible = computed({
        get: (): boolean => props.isShow,
        set: (val: boolean) => emit('update:isShow', val),
      })
      const getTitle = computed(() => {
        return t('text.teacher_batch_binding')
      })

      const state = reactive({
        list: [],
        form: {
          resourcesTypeId: undefined,
          searchKey: undefined,
          id: undefined,
        },
        rules: {
          resourcesTypeId: {
            required: true,
            message: t('text.please_select'),
          },
          id: {
            required: true,
            message: t('text.please_select'),
          },
        } as ElFormInstance['rules'],
      })

      const close = () => {
        formRef.value.resetFields()
      }
      const resourcesType = ref()
      const resourcesList = computed(
        () =>
          allResources.value
            .find((v) => v.id == state.form.resourcesTypeId)
            ?.resources.filter((v) =>
              state.form.searchKey
                ? v.name.toLowerCase().includes(state.form.searchKey.toLowerCase())
                : true,
            ) || [],
      )
      const resourcesTypeList = computed(() =>
        allResources.value.filter(
          (v) =>
            v.resourceType == (props.functionType == 'teacherBinding' ? 'TEACHER' : 'FACILITIES'),
        ),
      )
      const open = () => {
        resourcesType.value =
          props.selectList[0][
            props.functionType == 'teacherBinding' ? 'needTeacher' : 'needResource'
          ]
        if (resourcesType.value) {
          state.form.resourcesTypeId =
            props.selectList[0][
              props.functionType == 'teacherBinding' ? 'teacherResourceId' : 'facilityResourceId'
            ]
        }
      }
      const confirm = () => {
        formRef.value.validate((valid) => {
          if (valid) {
            const obj: ClazzTheorySeting = {
              resourceIds: [state.form.id],
              resourceTypeId: state.form.resourcesTypeId,
              ids: props.selectList.map((v: any) => v.id),
            }

            putSchedulesBind(obj).then(() => {
              ElMessage.success(t('message.binding_succeeded'))
              dialogVisible.value = false
              emit('updateData')
            })
          }
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
        resourcesType,
        resourcesList,
        resourcesTypeList,
      }
    },
  })
</script>

<style scoped lang="scss">
  :deep(.el-radio) {
    line-height: 2;
    width: 120px;
  }
  :deep(.el-radio-group) {
    background: transparent;
  }
</style>
