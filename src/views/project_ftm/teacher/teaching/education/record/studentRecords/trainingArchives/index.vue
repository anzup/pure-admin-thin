<template>
  <VxeTable
    :loading="loading"
    :data="tableData"
    :columns="tableColumns"
    :toolbar-config="tableTools"
    v-model:form="form"
    :buttons="tableButtons"
    @handlePageChange="pageChange"
  >
    <template #form>
      <slot />
    </template>
    <template #pager />

    <template #right_tools>
      <!-- 一键导出 -->
      <el-button type="primary" size="mini" :loading="loadingExport" @click="Export">{{
        $t('button.allLeadingOut')
      }}</el-button>
      <!-- 一键查看 -->
      <el-button type="primary" size="mini" :loading="loadingCheck" @click="checkPDF">{{
        $t('button.allLeadingSee')
      }}</el-button>
    </template>
    <template #progress="{ row }">
      <!-- 档案进度 -->
      <p>{{ row.finishedFileCount }} / {{ row.totalFileCount }}</p>
    </template>
  </VxeTable>
  <preview-dialog v-model:show="showDialog" :url="previewURL" :name="recordName || PDFName" />
  <!-- 上传选择文件 -->
  <el-dialog
    :title="$t('button.selectFile')"
    v-model="showUploadDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="500px"
    center
    @close="refreshUpload"
  >
    <el-upload
      action="#"
      :file-list="uploadFiles"
      :before-upload="() => false"
      :on-change="changeUpload"
      :auto-upload="false"
    >
      <el-button type="primary">{{ $t('button.addFile') }}</el-button>
    </el-upload>
    <template #footer>
      <el-button @click="showUploadDialog = false">{{ $t('button.cancel') }}</el-button>
      <el-button type="primary" @click="handleUpload">{{ $t('button.upload') }}</el-button>
    </template>
  </el-dialog>

  <!-- 上传进度条 -->
  <el-dialog
    :title="$t(`button.${progressPoint}ProgressBar`)"
    v-model="showProgressDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    width="500px"
  >
    <div class="dialogBox" v-for="(item, index) in progressList" :key="index">
      <div style="width: 30%">{{ $t(`button.${progressPoint}`) }} {{ $t('common.progress') }}:</div>
      <div style="width: 70%">
        <el-progress
          :text-inside="true"
          :stroke-width="20"
          :percentage="item.progress ? Number((item.progress * 100).toFixed(0)) : 0"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import {
    getStudentTrainingFiles,
    getStudentTrainingFilesInline,
    putStudentTrainingFiles,
  } from '/@/api/ftm/teacher/studentTraining'
  import { previewFile } from '/@/api/ftm/teacher/file'
  import previewDialog from './components/previewDialog.vue'
  import axios from 'axios'
  import to from 'await-to-js'
  import { mergePDF, dataURLtoFile, deleteEmptyParams } from '/@/utils/index'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useUserStore } from '/@/store/modules/user'
  import { useI18n } from 'vue-i18n'
  const accountStore = useUserStore()
  const userStore = useFtmUserStore()
  export default {
    data() {
      return {
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'seq', title: this.$t('common.serialNumber'), width: 60 },
          {
            field: 'type',
            title: this.$t('table.archivesName'),
            minWidth: 150,
            formatter: this.typeFormat,
          },
          {
            field: 'systemGeneration',
            title: this.$t('table.isBySystem'),
            minWidth: 120,
            formatter: ({ cellValue }) =>
              cellValue ? this.$t('common.yes') : this.$t('common.no'),
          },
          {
            field: 'status',
            title: this.$t('button.status'),
            minWidth: 100,
            formatter: this.statusFormat,
          },
          {
            title: this.$t('table.fileGenerationProgress'),
            width: 200,
            slots: { default: 'progress' },
          },
          { title: this.$t('table.tableEdit'), width: 210, slots: { default: 'operate' } },
        ],
        loading: false,
        loadingExport: false,
        loadingCheck: false,
        examType: undefined,
        examTypeArr: [
          { id: 'PRACTICE', name: this.$t('status.practiceExam') },
          { id: 'THEORY', name: this.$t('status.theoryExam') },
        ],
        form: {
          page: 1,
          size: 100,
          total: 0,
          studentTrainingRecordId: undefined,
          order: 'asc',
          sort: 'id',
        },
        showDialog: false,
        showProgressDialog: false,
        showUploadDialog: false,
        uploadFiles: [],
        previewURL: '',
        previewTitle: this.$t('button.preview') + 'pdf',
        progressPoint: '',
        progressList: [],
        saveItem: {},
        recordName: '',
      }
    },
    props: {
      details: Object,
      clazz: Object,
    },
    computed: {
      name() {
        return userStore.name
      },
      PDFName() {
        try {
          return `${this.clazz.courseNumber} ${this.details.name}`
        } catch (e) {
          return ''
        }
      },
    },
    components: { previewDialog, VxeTable },
    created() {
      // 培训档案接口未调
      let id = this.$route.params.recordId
      this.form.studentTrainingRecordId = id
      this.getData()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      const { locale } = useI18n()
      return {
        routerGo,
        locale,
      }
    },
    methods: {
      async getData() {
        this.loading = true
        let [err, res] = await to(getStudentTrainingFiles(this.form))
        this.loading = false
        if (!err) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      // 导出全部
      async Export() {
        this.progressPoint = 'download'
        this.loadingExport = true
        let id = this.$route.params.recordId
        let that = this

        this.progressList = [{ progress: 0, name: `${this.PDFName}.pdf` }]
        this.showProgressDialog = true
        axios({
          url:
            import.meta.env.VITE_BASE_API_FTM +
            '/studentTrainingFiles/download?studentTrainingRecordId=' +
            id,
          responseType: 'blob',
          timeout: 180000, // 三分钟超时
          headers: {
            Authorization: 'Bearer ' + accountStore.token,
            'Accept-Language': this.locale,
          },
          onDownloadProgress: function (e) {
            if (e.lengthComputable) {
              var rate = e.loaded / e.total
              if (rate < 1) {
                that.progressList[0].progress = rate
              } else {
                that.progressList[0].progress = 0.99
              }
            }
          },
        })
          .then((res) => {
            this.loadingExport = false
            if (res.status == 200) {
              this.progressList[0].progress = 1
              setTimeout(() => {
                this.showProgressDialog = false
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(new Blob([res.data]))
                link.download = this.PDFName + '.pdf'
                link.click()
              }, 500)
            } else {
              this.showProgressDialog = false
              this.$message.error(this.$t('tip.exportFail'))
            }
          })
          .catch((e) => {
            this.loadingExport = false
            this.showProgressDialog = false
            this.$message.error(this.$t('tip.exportFail'))
          })
      },
      // 导出
      async ExportItem(item) {
        this.progressPoint = 'download'
        this.loadingExport = true
        let that = this
        let fileName = `${this.typeFormat({ cellValue: item.type })} (${
          item.studentTrainingRecord.student.name
        }).pdf`

        this.progressList = [{ progress: 0, name: fileName }]
        this.showProgressDialog = true
        axios({
          url: import.meta.env.VITE_BASE_API_FTM + `/studentTrainingFiles/${item.id}/download`,
          responseType: 'blob',
          timeout: 180000, // 三分钟超时
          headers: {
            'Accept-Language': this.locale,
            Authorization: 'Bearer ' + accountStore.token,
          },
          onDownloadProgress: function (e) {
            if (e.lengthComputable) {
              var rate = e.loaded / e.total
              if (rate < 1) {
                that.progressList[0].progress = rate
              } else {
                that.progressList[0].progress = 0.99
              }
            }
          },
        })
          .then((res) => {
            this.loadingExport = false
            if (res.status == 200) {
              this.progressList[0].progress = 1
              setTimeout(() => {
                this.showProgressDialog = false
                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(new Blob([res.data]))
                link.download = fileName
                link.click()
              }, 500)
            } else {
              this.showProgressDialog = false
              this.$message.error(this.$t('tip.exportFail'))
            }
          })
          .catch((e) => {
            this.loadingExport = false
            this.showProgressDialog = false
            this.$message.error(this.$t('tip.exportFail'))
          })
      },
      // 预览全部
      async checkPDF() {
        let id = this.$route.params.recordId
        this.loadingCheck = true
        let [err, res] = await to(getStudentTrainingFilesInline(id))
        this.loadingCheck = false
        if (!err) {
          this.recordName = ''
          this.previewURL = window.URL.createObjectURL(new Blob([res.data]))
          this.showDialog = true
        }
      },
      // 选择上传
      uploadItem(row) {
        this.progressPoint = 'upload'
        this.progressList = [{ progress: 0, over: false }]
        this.saveItem = row
        this.showUploadDialog = true
      },
      // 关闭上传
      refreshUpload() {
        this.uploadFiles = []
      },
      // 文件上传
      async handleUpload() {
        if (this.uploadFiles.length < 1)
          return this.$message.error(this.$t('tip.uploadFileIsNotSelected'))
        let that = this
        let FileFormData = new FormData()
        let fileBase64 = await mergePDF(
          this.uploadFiles.map((file) => file.raw),
          'base64string',
        )
        let file = dataURLtoFile(fileBase64, 'megerPDF.pdf')
        FileFormData.append('file', file)

        let url = import.meta.env.VITE_BASE_API_PUB + '/files/upload'
        let index = 0
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept-Language': this.locale,
            Authorization: 'Bearer ' + accountStore.token,
          },
          onUploadProgress: function (e) {
            //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
            //如果lengthComputable为false，就获取不到e.total和e.loaded
            if (e.lengthComputable) {
              var rate = e.loaded / e.total //已上传的比例
              if (rate < 1) {
                //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                //等响应回来时，再将进度设为100%
                that.progressList[index].progress = rate
              } else {
                that.progressList[index].progress = 0.99
              }
            }
          },
        }
        this.showProgressDialog = true
        let [err, res] = await to(axios.post(url, FileFormData, config))
        if (!err) {
          this.progressList[index].progress = 1
          setTimeout(() => {
            this.progressList[index].over = true
            this.saveFileUuid(res.data.uuid)
            if (this.progressList.every((v) => v.over && v.progress == 1)) {
              this.showProgressDialog = false
              this.showUploadDialog = false
              this.progressList = []
              this.$message.success(this.$t('tip.uploadSuccessTip'))
            }
          }, 500)
        } else {
          this.progressList[index].over = true
          if (this.progressList.every((v) => v.over && v.progress == 1)) {
            this.showProgressDialog = false
            this.showUploadDialog = false
            this.progressList = []
            this.$message.error(this.$t('tip.uploadFail'))
          }
        }
      },
      changeUpload(file) {
        let fileName = file.name
        let suffix = fileName.split('.').pop() || ''
        suffix = suffix.toLocaleLowerCase()
        if (suffix != 'pdf') {
          this.$message.error(this.$t('tip.uploadedFileFormatError'))
          this.uploadFiles.pop()
        }
      },
      // 文件下载
      async handleDownload() {
        let that = this
        let PromiseArray = this.progressList.map((v, i) => {
          return axios({
            url: import.meta.env.VITE_BASE_API_PUB + `/files/${v.uuid}/download`,
            responseType: 'blob',
            headers: {
              Authorization: 'Bearer ' + accountStore.token,
            },
            onDownloadProgress: function (e) {
              if (e.lengthComputable) {
                var rate = e.loaded / e.total
                if (rate < 1) {
                  that.progressList[i].progress = rate
                } else {
                  that.progressList[i].progress = 0.99
                }
              }
            },
          })
        })
        Promise.all(PromiseArray)
          .then((resList) => {
            resList.forEach((res, index) => {
              this.progressList[index].progress = 1
              let link = document.createElement('a')
              link.href = window.URL.createObjectURL(new Blob([res.data]))
              link.download = this.progressList[index].name
              link.click()
            })
            setTimeout(() => {
              this.showProgressDialog = false
            }, 500)
          })
          .catch((e) => {
            this.showProgressDialog = false
            this.$message.error(this.$t('status.downloadFailed'))
          })
      },
      // 关联文件uuid
      async saveFileUuid(uuid, id) {
        let params = {
          generateFiles: [
            {
              fileUuid: uuid,
              sourceId: this.saveItem.id,
            },
          ],
        }
        let [err, res] = await to(putStudentTrainingFiles({ id: this.saveItem.id, ...params }))
        if (!err) {
          this.getData()
        }
      },
      // 查看档案
      async previewItem(item) {
        // 预览pdf
        // if(!item.generateFiles || ((item.generateFiles instanceof Array) && item.generateFiles.length < 1)) return
        this.recordName = this.typeFormat({ cellValue: item.type })
        if (
          item.type == 'TRAIN_QUALIFICATION_INVEST_SHEET' ||
          item.type == 'STUDENT_REGISTER_SHEET' ||
          item.type == 'ATTENDANCE_SHEET' ||
          item.type == 'CLASS_SCHEDULE' ||
          item.type == 'CERTS' ||
          item.type == 'OTHERS'
        ) {
          let file = item.generateFiles[item.generateFiles.length - 1]
          previewFile(file.fileUuid)
            .then(async (res) => {
              this.previewURL = window.URL.createObjectURL(new Blob([res.data]))
              this.showDialog = true
              resolve()
            })
            .catch((e) => {
              reject()
            })
        } else {
          let params = this.$route.params
          let url = `${params.recordId}/triningRecords?`
          const query = deleteEmptyParams({
            name: item.type,
            clazzId: item.studentTrainingRecord.clazz.id,
            studentId: item.studentTrainingRecord.student.id,
            studentUserid: item.studentTrainingRecord.student.userId,
            recordId: this.form.studentTrainingRecordId,
            courseNumber: item.studentTrainingRecord.clazz.courseNumber,
          })
          for (let [key, value] of Object.entries(query)) {
            url += `${key}=${value}&`
          }
          url = url.substring(0, url.length - 1)
          this.routerGo(url)
        }
      },
      // 格式化结果
      statusFormat({ cellValue }) {
        switch (cellValue) {
          case 'AVALIBLE':
            return this.$t('status.generated')
          case 'NOT_AVALIABLE':
            return this.$t('status.notGenerate')
          default:
            return ''
        }
      },
      typeFormat({ cellValue }) {
        switch (cellValue) {
          case 'TRAIN_QUALIFICATION_INVEST_SHEET':
          case 'STUDENT_REGISTER_SHEET':
          case 'THEORY_PROGRESS_SHEET':
          case 'FLIGHT_EVALUATION':
          case 'FLIGHT_EXAM_RECORD':
          case 'THEORY_EXAM_RECORD':
          case 'ATTENDANCE_SHEET':
          case 'CLASS_SCHEDULE':
          case 'FINAL_EVALUATION':
          case 'CERTS':
          case 'OTHERS':
            return this.$t(`supplement.${cellValue}`)
          default:
            return ''
        }
      },
      pageChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getData()
      },
      tableButtons({ row }) {
        return [
          {
            disabled:
              (!row.systemGeneration &&
                (!(row.generateFiles instanceof Array) || row.generateFiles.length < 1)) ||
              (!!row.systemGeneration && row.totalFileCount == 0),
            name: this.$t('button.view'),
            event: () => {
              this.previewItem(row)
            },
          },
          {
            disabled: !(row.generateFiles instanceof Array) || row.generateFiles.length < 1,
            name: this.$t('button.leadingOut'),
            event: () => {
              this.ExportItem(row)
            },
          },
          {
            visible: !row.systemGeneration,
            name:
              row.generateFiles instanceof Array && row.generateFiles.length > 0
                ? this.$t('button.upData')
                : this.$t('button.upload'),
            event: () => {
              this.uploadItem(row)
            },
          },
        ]
      },
    },
  }
</script>

<style scoped lang="scss">
  .disabled {
    color: #ccc;
    cursor: default;
  }
  .dialogBox {
    display: flex;
    margin-bottom: 10px;
  }
</style>
