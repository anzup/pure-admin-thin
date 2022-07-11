<template>
  <div>
    <el-dialog
      :title="$t('message.import')"
      v-model="dialogVisible"
      width="500px"
      @close="close"
      destroy-on-close
    >
      <el-form size="mini" v-loading="testLoading">
        <el-form-item :label="$t('text.please_download_the_template_before_importing')">
          <el-button type="primary" @click="downloadFile">{{
            $t('text.download_template')
          }}</el-button>
        </el-form-item>
        <el-form-item :label="$t('text.fill_in_according_to_the_fields_in_the_template')" />
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="#"
            :show-file-list="false"
            :http-request="uploadFile"
            accept=".xlc, .xls, .xlsx"
            ref="uploadRef"
          >
            <el-button type="primary">{{ $t('text.select_file') }}</el-button>
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
  import { computed, defineComponent, ref } from 'vue'
  import { getStudentsTemplate, postStudentsImport } from '/@/api/opm/roles'
  import { convertResBlob } from '/@/utils/utils'
  import { useI18n } from 'vue-i18n'
  export default defineComponent({
    name: 'LeadingIn',
    props: {
      modelValue: Boolean,
      clazzId: Number,
    },
    emits: ['update:modelValue', 'updateData'],
    setup(props, { emit }) {
      const { t } = useI18n()
      const testLoading = ref(false)
      const uploadRef = ref()
      const dialogVisible = computed({
        get: () => {
          return props.modelValue
        },
        set: (val) => {
          emit('update:modelValue', val)
        },
      })
      const errInfo = ref([])
      const downloadFile = async () => {
        const res = await getStudentsTemplate()
        // getOpenDownload(data).then(res=>{
        convertResBlob(res)
        // })
      }
      const uploadFile = (file) => {
        testLoading.value = true
        const formData = new FormData()
        formData.append('file', file.file)
        props.clazzId ? formData.append('clazzId', props.clazzId + '') : undefined
        postStudentsImport(formData)
          .then((res) => {
            emit('updateData')
            errInfo.value = res.data.msgs
            if (res.data.msgs?.length == 0) {
              ElMessage.success(t('message.import_succeeded'))

              dialogVisible.value = false
            }
          })
          .finally(() => {
            testLoading.value = false
            uploadRef.value.clearFiles()
          })
      }
      const close = () => {
        errInfo.value = []
      }
      return {
        dialogVisible,
        downloadFile,
        uploadFile,
        testLoading,
        uploadRef,
        errInfo,
        close,
      }
    },
  })
</script>

<style scoped></style>
