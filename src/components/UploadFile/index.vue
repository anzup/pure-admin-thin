<template>
  <el-upload
    ref="upload"
    :accept="accept"
    :before-remove="beforeRemove"
    :before-upload="onBeforeUpload"
    :class="{
      'upload-demo': true,
      inline: inline,
    }"
    :file-list="fileList"
    :http-request="httpRequest"
    :multiple="multiple"
    :on-exceed="handleExceed"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success="onSuccess"
    :show-file-list="showFileList"
    action="#"
  >
    <el-button v-if="!isDetail" size="small" type="primary">
      {{ $t('state.select_file') }}
    </el-button>
    <!-- <template #tip>
      <div class="el-upload__tip">jpg/png files with a size less than 500kb</div>
    </template>-->
  </el-upload>
</template>
<script lang="ts" setup>
  import { computed, ref, watch } from 'vue'

  import { getfileInfo, getfileInfoList, postFilesUpload, postFileUpload } from '/@/api/file'
  import { AxiosResponse } from 'axios'

  export interface Prop {
    modelValue?: string | string[] | null
    isDetail?: boolean
    accept?: string
    multiple?: boolean
    showFileList?: boolean
    beforeUpload?: (file: any) => boolean
    inline?: boolean
  }

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: undefined,
    accept: '',
    showFileList: true,
    inline: true,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: string): void
    (e: 'uploadSuccess', data: ResponseFileType[]): void
  }>()
  const uuid = computed({
    get: () => props.modelValue,
    set: (val: string) => emit('update:modelValue', val),
  })
  const fileList = ref<ResponseFileType[]>([])

  watch(
    uuid,
    (val, oldVal) => {
      if (!val) {
        fileList.value = []
        return
      }
      if (val !== oldVal && fileList.value.length < 1) {
        if (typeof val === 'string') {
          getfileInfo(val).then((res) => {
            fileList.value = [res.data]
          })
        } else if (val.length > 0) {
          getfileInfoList({ uuids: val.join() }).then((res) => {
            fileList.value = res.data
          })
        }
      }
    },
    {
      immediate: true,
    },
  )

  const handleRemove = (file, fileList) => {
    console.log(file, fileList)
  }
  const handlePreview = (file) => {
    console.log(file)
  }
  const upload = ref()
  const handleExceed = (files, fileList) => {
    upload.value.clearFiles()
    upload.value.handleStart(files[0])
    upload.value.submit()
  }
  const beforeRemove = (file, fileList) => {
    if (props.isDetail) return false
    // return ElMessageBox.confirm(`Cancel the transfert of ${file.name} ?`)
  }

  // 批量上传时用一个数组接收参数
  let waitUploadFiles = []

  const onBeforeUpload = (file) => {
    if (props.beforeUpload && props.beforeUpload(file) === false) return false
    if (props.multiple) {
      waitUploadFiles.push(file)
    }
  }

  // 批量时是否正在上传的标志
  let isUploading = false
  const httpRequest = (val) => {
    if (!props.multiple) {
      return postFileUpload(val.file)
    } else if (!isUploading) {
      isUploading = true
      return postFilesUpload(waitUploadFiles)
    }
  }

  const onSuccess = (res: AxiosResponse<ResponseFileType | ResponseFileType[]>) => {
    upload.value.clearFiles()

    if (Array.isArray(res.data)) {
      // eslint-disable-next-line no-undef
      fileList.value = res.data as ResponseFileType[]
      uuid.value = res.data.map((v) => v.uuid)
    } else {
      fileList.value = [res.data as ResponseFileType]
      uuid.value = res.data.uuid
    }
    waitUploadFiles = []
    isUploading = false
    emit('uploadSuccess', fileList.value)
  }
</script>
<style lang="scss" scoped>
  .upload-demo {
    // :deep(.el-upload) {
    //   margin-top: 4px;
    // }
    width: 100%;

    :deep(.el-upload-list__item) {
      transition: none;

      &:first-child {
        margin-top: 0;
      }

      &.is-ready {
        display: none;
      }
    }

    &.inline {
      display: flex;
      align-items: center;
    }
  }
</style>
