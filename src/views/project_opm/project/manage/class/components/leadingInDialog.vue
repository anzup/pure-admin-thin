<template>
  <div>
    <el-dialog
      destroy-on-close
      :title="$t('message.import')"
      v-model="dialogVisible"
      width="600px"
      @open="open"
    >
      <el-form v-loading="testLoading" ref="formRef" :model="form" :rules="rules">
        <p class="tip">
          {{ $t('text.please_select_a_customer_before_downloading_the_template') }}
        </p>

        <el-form-item
          prop="customerId"
          :label="$t('text.please_select_a_customer')"
          label-width="120px"
        >
          <el-select
            style="width: 250px"
            v-model="form.customerId"
            :placeholder="$t('text.please_select')"
          >
            <el-option
              v-for="item in customerAllList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="syllabusId" :label="$t('message.trainingCourses')" label-width="120px">
          <el-select
            style="width: 250px"
            v-model="form.syllabusId"
            :placeholder="$t('text.please_select')"
          >
            <el-option
              v-for="item in syllabusesAllList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="minNumber" :label="$t('text.start_serial_number')" label-width="120px">
          <el-input-number
            style="width: 250px"
            v-model="form.minNumber"
            :min="0"
            :max="form.maxNumber"
            :step="1"
            step-strictly
          />
        </el-form-item>
        <el-form-item prop="maxNumber" :label="$t('text.end_serial_number')" label-width="120px">
          <el-input-number
            style="width: 250px"
            v-model="form.maxNumber"
            :min="form.minNumber || 0"
            :step="1"
            step-strictly
          />
        </el-form-item>
        <el-form-item
          prop="dateRange"
          :label="$t('text.please_select_a_time_period')"
          label-width="120px"
        >
          <el-date-picker
            style="width: 250px"
            v-model="form.dateRange"
            type="daterange"
            :range-separator="$t('text.to')"
            :start-placeholder="$t('text.start_date')"
            :end-placeholder="$t('text.end_date')"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label-width="120px">
          <el-button type="primary" @click="downloadFile">{{
            $t('text.download_template')
          }}</el-button>
        </el-form-item>
        <p class="tip">
          {{ $t('text.the_system_can_only_import_files_exported_from_the_system') }}
        </p>
        <p class="tip">
          {{ $t('text.the_format_of_the_document_and_the_existing_data_cannot_be_modified') }}
        </p>
        <p class="tip">{{ $t('text.if_the_import_is_repeated') }}</p>
        <p class="tip">
          {{ $t('text.the_information_of_import_failure_will_be_given_in_the_prompt') }}
        </p>

        <el-form-item>
          <el-upload
            class="upload-demo"
            action="#"
            :show-file-list="false"
            :http-request="uploadFile"
            accept=".xlc, .xls, .xlsx"
            ref="uploadRef"
          >
            <el-button type="primary">
              {{ $t('text.select_file') }}
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-alert
        v-for="(item, index) in errInfo"
        :key="index"
        :title="item"
        type="error"
        :closable="false"
        show-icon
      />

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ $t('message.hscancel') }}
          </el-button>
          <el-button type="primary" @click="dialogVisible = false">{{
            $t('message.hsdefine')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  import { ElMessage } from 'element-plus'
  import { computed, defineComponent, reactive, ref } from 'vue'
  import { getClazzsTemplate, postClazzsImport } from '/@/api/opm/train'
  import { convertResBlob } from '/@/utils/utils'
  import useCustomers from '/@/commonTs/customer'
  import { useI18n } from 'vue-i18n'
  import usesyllabuses from '/@/commonTs/syllabuses'
  export default defineComponent({
    name: 'LeadingIn',
    props: {
      modelValue: Boolean,
    },
    emits: ['update:modelValue', 'updateData'],
    setup(props, { emit }) {
      const { t } = useI18n()
      const testLoading = ref(false)
      const uploadRef = ref()

      const { syllabusesAllList, getSyllabusesAllList, syllabusesForm } = usesyllabuses()

      const form = reactive({
        dateRange: undefined,
        customerId: undefined,
        syllabusId: undefined,
        minNumber: undefined,
        maxNumber: undefined,
      })
      const rules = reactive({
        dateRange: [
          {
            required: false,
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
        syllabusId: [
          {
            required: true,
            message: t('text.please_select'),
            trigger: 'change',
          },
        ],
        minNumber: [
          {
            required: true,
            message: t('text.please_enter'),
            trigger: 'change',
          },
        ],
        maxNumber: [
          {
            required: true,
            message: t('text.please_enter'),
            trigger: 'change',
          },
        ],
      })
      const errInfo = ref([]),
        formRef = ref()

      const dialogVisible = computed({
        get: () => {
          return props.modelValue
        },
        set: (val) => {
          emit('update:modelValue', val)
        },
      })
      const downloadFile = () => {
        formRef.value.validate(async (valid) => {
          if (valid) {
            const formData = JSON.parse(JSON.stringify(form))
            formData.dateRange = formData.dateRange?.join()
            formData.number = `${formData.minNumber},${formData.maxNumber}`
            delete formData.minNumber
            delete formData.maxNumber
            const res = await getClazzsTemplate(formData)
            convertResBlob(res)
            // getOpenDownload(data).then((res) => {
            // });
          } else {
            return false
          }
        })
      }
      const uploadFile = (file) => {
        testLoading.value = true
        const formData = new FormData()
        formData.append('file', file.file)
        postClazzsImport(formData)
          .then((res) => {
            ElMessage.success(t('message.import_succeeded'))
            emit('updateData')
            errInfo.value = res.data.msgs
            if (res.data.msgs?.length == 0) {
              dialogVisible.value = false
            }
          })
          .finally(() => {
            testLoading.value = false
            uploadRef.value.clearFiles()
          })
      }
      const { getCustomersAllList, customerAllList } = useCustomers()
      const open = () => {
        Object.assign(form, {
          dateRange: undefined,
          customerId: undefined,
        })
        getCustomersAllList()
        syllabusesForm.courseType = 'DRY_LEASE'
        getSyllabusesAllList()
      }
      return {
        dialogVisible,
        downloadFile,
        uploadFile,
        testLoading,
        uploadRef,
        form,
        customerAllList,
        open,
        rules,
        errInfo,
        syllabusesAllList,
        formRef,
      }
    },
  })
</script>

<style scoped></style>
