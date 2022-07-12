<template>
  <!-- 预览 -->
  <el-dialog
    :title="data.pdfTitle"
    v-model="data.isShow"
    width="80%"
    top="10vh"
    :before-close="handleClose"
    append-to-body
  >
    <iframe :src="data.url" width="100%" height="700px" />
  </el-dialog>
</template>
<script lang="ts" setup>
  /**
   * pdf预览弹窗
   * 需固定传参更新弹窗生命周期
   * v-if="viewDialogVisible" :viewDialogVisible.sync="viewDialogVisible" :id=""
   */
  import { ElMessage } from 'element-plus'
  import { onMounted, reactive } from 'vue'
  import { getAttachmentIdFileExists } from '/@/api/opm/file'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const data = reactive({
    fileId: '',
    url: '',
    pdfTitle: '',
    isShow: false,
  })
  const emit = defineEmits(['update:viewDialogVisible'])
  const props = defineProps({
    id: [Number, String],
    viewDialogVisible: Boolean,
    preViewObj: {
      type: Object,
      default: () => {
        return {
          id: null,
          url: null,
        }
      },
    },
  })
  onMounted(() => {
    getFileExists(props.preViewObj.id)
  })

  function getFileExists(id) {
    getAttachmentIdFileExists({ attachmentId: id }).then((res) => {
      if (res.data) {
        data.isShow = true
        console.log(data.isShow)
        let uri =
          (import.meta.env.VITE_BASE_URL as string) +
          import.meta.env.VITE_BASE_API_DMM +
          props.preViewObj.url
        data.url = `pdf/web/viewer.html?file=${encodeURIComponent(uri)}`
      } else {
        ElMessage({
          message: t('text.file_does_not_exist'),
          type: 'warning',
        })
        handleClose()
      }
    })
  }
  function handleClose() {
    data.isShow = false
    emit('update:viewDialogVisible', false)
  }
</script>
<style scoped lang="scss">
  :deep(.el-dialog__header) {
    height: 0.9rem;
  }
</style>
