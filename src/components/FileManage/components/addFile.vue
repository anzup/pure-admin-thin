<template>
  <el-drawer
    v-model="dialogVisible"
    :size="300"
    :title="getTitle"
    center
    @close="close"
    @open="open"
  >
    <el-scrollbar>
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :on-change="onFileChange"
        :on-remove="onFileRemove"
        action="https://jsonplaceholder.typicode.com/posts/"
        class="upload-demo"
        drag
        multiple
      >
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">点击或拖拽文件到此处</div>
      </el-upload>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ t('buttons.hscancel') }}
        </el-button>
        <el-button :disabled="fileList.length === 0" type="primary" @click="confirm">
          {{ t('buttons.hsdefine') }}
        </el-button>
      </span>
    </template>
  </el-drawer>
</template>
<script lang="ts" setup>
  import { computed, getCurrentInstance, h } from 'vue'
  import { useVModel } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { UploadFilled } from '@element-plus/icons-vue'
  import { ElNotification, UploadFile, UploadFiles, UploadInstance } from 'element-plus'
  import { debounce } from 'lodash-es'
  import UploadProgress from '/@/components/UploadProgress/Index.vue'
  import { FileResources, postFileResources } from '/@/api/file'

  const { t } = useI18n()

  interface Prop {
    modelValue: boolean
    folderUuid?: string
  }

  const props = withDefaults(defineProps<Prop>(), {
    modelValue: false,
  })
  const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void
    (e: 'updateData'): void
  }>()
  const dialogVisible = useVModel(props, 'modelValue', emit)
  const getTitle = computed(() => (!props.folderUuid ? t('buttons.hsadd') : t('buttons.modify')))

  let uploadRef = $ref<UploadInstance>()
  // eslint-disable-next-line no-unused-vars
  let fileList = $ref<File[]>([])
  const instance = getCurrentInstance()
  const confirm = () => {
    const notificationInstance = ElNotification(
      {
        duration: 0,
        message: h(UploadProgress, {
          files: fileList,
          onError: (val) => {
            console.log(val)
          },
          onSuccess: (val) => {
            console.log(val)
          },
          onFinallY: (val: ResponseFileType[]) => {
            //上传完成过后应该清除文件列表
            uploadRef.clearFiles()
            postFileResources(
              val.map<FileResources>((v) => {
                return {
                  fileUuid: v.uuid,
                  folderUuid: props.folderUuid,
                  name: v.name,
                }
              }),
            ).then(() => {
              emit('updateData')
            })
            notificationInstance.close()
          },
        }),
      },
      instance.appContext,
    )
  }
  const onFileChange = debounce((uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileList = uploadFiles.map((v) => v.raw)
  }, 100)
  const onFileRemove = debounce((uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileList = uploadFiles.map((v) => v.raw)
  }, 100)

  const open = () => {}
  const close = () => {
    uploadRef.clearFiles()
  }
</script>
<style lang="scss" scoped></style>
