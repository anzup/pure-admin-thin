<template>
  <div>
    <el-dialog
      :title="getTitle"
      v-model="dialogVisible"
      width="800px"
      @close="close"
      @open="open"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" class="demo-form">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('text.full_name')" prop="name">
              <el-input v-model="form.name" :placeholder="$t('text.please_enter')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('text.gender')" prop="gender">
              <el-select v-model="form.gender" :placeholder="$t('text.please_select')">
                <el-option
                  v-for="item in genderList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('text.identification_number')" prop="idNumber">
              <el-input v-model="form.idNumber" :placeholder="$t('text.please_enter')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('text.contact_number')" prop="phone">
              <el-input v-model="form.phone" :placeholder="$t('text.please_enter')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('text.connection')" prop="customerId">
              <el-select v-model="form.customerId" :placeholder="$t('text.please_select')">
                <el-option
                  v-for="type in clientsAllList"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('text.personnel_class')" prop="type">
              <el-select v-model="form.type" :placeholder="$t('text.please_select')">
                <el-option
                  v-for="type in studentTypeList"
                  :key="type.id"
                  :label="type.name"
                  :value="type.id"
                />
              </el-select>
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
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
  import { postStudents, getStudentsDetail, putStudentsId } from '/@/api/opm/roles'
  import { ElMessage } from 'element-plus'
  import useCommonData from '../../components/commonData'
  import useParticip from './useList'
  import { useI18n } from 'vue-i18n'
  import useStudentType from '/@/commonTs/studentsType'
  interface IForm {
    customerId: string
    gender: string
    idNumber: string
    name: string
    phone: string
    type: string
    username: string
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
      clazzId: Number,
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
        return props.type == 'add' ? t('text.new_participants') : t('text.modify_participants')
      })
      const { genderList } = useCommonData()
      const { state: clientsSate, getCustomersAllList } = useParticip()
      const { studentTypeList, getStudentsType } = useStudentType()
      const state = reactive({
        form: {
          customerId: undefined,
          gender: undefined,
          idNumber: undefined,
          name: undefined,
          phone: undefined,
          type: undefined,
          // 前端固定传值后端自动生成
          username: '123',
          clazzId: props.clazzId,
        } as IForm,
        rules: {
          name: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          gender: [
            {
              required: true,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          idNumber: [
            {
              required: false,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          phone: [
            {
              required: false,
              message: t('text.please_enter'),
              trigger: 'change',
            },
          ],
          type: [
            {
              required: true,
              message: t('text.please_select'),
              trigger: 'change',
            },
          ],
          customerId: [
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
        getStudentsType()
        getCustomersAllList()
        if (props.type == 'edit') {
          getStudentsDetail(props.id).then((res) => {
            if (res.status == 200) {
              res.data.customerId = res.data.customer?.id
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
              api = postStudents
            } else {
              api = putStudentsId
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
                emit('updateData', res.data)
                dialogVisible.value = false
              }
            })
          } else {
            return false
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
        genderList,
        ...toRefs(clientsSate),
        studentTypeList,
      }
    },
  })
</script>

<style scoped></style>
