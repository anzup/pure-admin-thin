<template>
  <div class="file-container" v-loading="loading" id="Con">
    <div class="file-path">
      <img :src="images.folder" alt="" class="file-path-img" />
      {{ filterPath() }}
    </div>
    <wlExplorer
      ref="wl-explorer-cpt"
      :header-dropdown="headerHandle"
      :columns="file_table_columns"
      :is-folder-fn="isFolderFn"
      :data="file_table_data"
      :props="explorer_prop"
      :isFolderFn="isFolder"
      :previewType="previewType"
      v-model:previewOptions="previewOptions"
      :useUpload="false"
      size="small"
      :isAdd="authAdd"
      :isUpload="authUpload"
      :isDelete="false"
      @search="fileSearch"
      @del="fileDel"
      @closeFade="closeOtherLayout(fade)"
      @preview="previewEvent"
      @showUpload="upload"
      @handleFolder="addFolder"
    >
      <template v-slot:header-btn>
        <el-button v-if="authDownload" @click="downloadFile" type="primary" plain>{{
          $t('button.download')
        }}</el-button>
      </template>
      <!-- 操作文件夹滑入区 -->
      <fadeIn v-show="fade.folder">
        <h3 class="edit-header">
          <p>{{ $t('button.addFolder') }}</p>
        </h3>
        <el-scrollbar class="scroll">
          <el-form
            size="medium"
            ref="folder_form"
            label-position="top"
            :model="folder_form"
            :rules="folder_rules"
            class="folder_form rule-form"
            @keyup.enter.native="submitFolderFrom"
          >
            <el-form-item :label="$t('common.folderName')" prop="Name">
              <el-input v-model="folder_form.Name" :placeholder="$t('tip.pleaseEnterFolderName')" />
            </el-form-item>
            <el-form-item :label="$t('tip.visitorAuth')">
              <el-checkbox-group v-model="accessControls">
                <el-checkbox label="STUDENT">{{ $t('table.student') }}</el-checkbox>
                <el-checkbox label="PLANNER">{{ $t('table.planner') }}</el-checkbox>
                <el-checkbox label="THEORY_TEACHER">{{ $t('table.theoryTeacher') }}</el-checkbox>
                <el-checkbox label="FLIGHT_TEACHER">{{ $t('table.flightTeacher') }}</el-checkbox>
                <el-checkbox label="TEACHER_ADMIN">{{
                  $t('table.academicAdministrator')
                }}</el-checkbox>
                <el-checkbox label="OTHERS">{{ $t('table.onlyMySelf') }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <div class="submit-btn-box">
          <submit-btn @btn="submitFolderFrom" :status="load.folder" />
          <el-button size="medium" @click="fade.folder = false">{{
            $t('button.cancel')
          }}</el-button>
        </div>
      </fadeIn>
      <!-- 文件上传区 -->
      <fadeIn v-show="uploader.folder">
        <h3 class="edit-header">{{ $t('button.uploadFolder') }}</h3>
        <el-scrollbar class="scroll">
          <el-form
            size="medium"
            ref="upload_form"
            :model="folder_form"
            label-position="top"
            class="folder_form rule-form"
          >
            <el-form-item :label="$t('button.leadingIn')">
              <upload-item
                ref="upload-item"
                :url="uploadUrl"
                :limit="10"
                :headers="uploadHeader"
                :options="uploadOptions"
                @uploadChange="uploadReg"
                @uploadRemove="uploadDel"
                @uploadSuccess="uploadSuccess"
                @uploadError="uploadError"
                :complate="uploadComplate"
              />
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <div class="submit-btn-box">
          <submit-btn size="medium" @btn="fileUpload" :status="uploader.upload">{{
            $t('button.save')
          }}</submit-btn>
          <el-button size="medium" @click="uploader.folder = false">{{
            $t('button.cancel')
          }}</el-button>
        </div>
      </fadeIn>
    </wlExplorer>

    <video-dialog-box
      v-if="scormDialog"
      :videoDialog="scormDialog"
      :fileType="coursewaresInfo.fileType"
      :fileUuid="coursewaresInfo.fileUuid"
      :playFilePath="coursewaresInfo.playFilePath"
      :name="coursewaresInfo.name"
      :addListen="false"
      :isFull="true"
      @beforeHideMethod="scormDialog = false"
    />
    <!-- 修改弹窗 -->
    <el-dialog
      center
      :title="$t('button.modify')"
      v-model:visible="showEditDialog"
      :close-on-click-modal="false"
      @close="handleCancelEdit"
    >
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="100px">
        <el-form-item :label="$t('table.Name')" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item :label="$t('common.visitorAuth')" v-if="editForm.isFolder">
          <el-checkbox-group v-model="editForm.accessControls">
            <el-checkbox label="STUDENT">{{ $t('table.student') }}</el-checkbox>
            <el-checkbox label="PLANNER">{{ $t('table.planner') }}</el-checkbox>
            <el-checkbox label="THEORY_TEACHER">{{ $t('table.theoryTeacher') }}</el-checkbox>
            <el-checkbox label="FLIGHT_TEACHER">{{ $t('table.flightTeacher') }}</el-checkbox>
            <el-checkbox label="TEACHER_ADMIN">{{ $t('table.academicAdministrator') }}</el-checkbox>
            <el-checkbox label="OTHERS">{{ $t('table.other') }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false" type="primary" plain size="medium">{{
          $t('button.cancel')
        }}</el-button>
        <el-button type="primary" size="medium" @click="handleConfirmEdit">{{
          $t('button.confirm')
        }}</el-button>
      </template>
    </el-dialog>

    <!-- 下载进度条 -->
    <el-dialog
      center
      :title="$t('router.downloadFiles')"
      v-model:visible="showProgressDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px"
      @close="cancelDownload"
    >
      <div class="dialogBox" v-for="(item, index) in uploadList" :key="index">
        <div class="txt" :title="item.name">{{ item.name }}</div>
        <div class="process">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="item.progress ? Number((item.progress * 100).toFixed(0)) : 0"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import WlExplorer from './wlExplorer/index.vue' // 导入文件管理器
  import fadeIn from './wlExplorer/utils/fade-in.vue' // 导入文件管理器
  import uploadItem from './wlExplorer/utils/upload-item.vue' // 导入上传组件
  import submitBtn from './wlExplorer/utils/submit-btn.vue' // 导入防抖提交组件
  import { closeOtherLayout } from './wlExplorer/utils/utils.js' // 导入关闭其他弹出类视图函数
  import videoDialogBox from '/@/views/project_ftm/teacher/myJob/courseware/assigned/components/videoPlayer.vue'
  import image_folder from './wlExplorer/images/folder@3x.png'
  import to from 'await-to-js'
  import {
    getFileFolder,
    getFileFolderId,
    putFileFolderDisable,
    pustResourceDisAble,
    putResource,
    postResource,
    postFileFolder,
    putFileFolder,
    getFiles,
  } from '/@/api/ftm/teacher/file'
  import { toExport } from '/@/utils/index'
  import axios from 'axios'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useUserStore } from '/@/store/modules/user'
  import { useI18n } from 'vue-i18n'
  const accountStore = useUserStore()
  const userStore = useFtmUserStore()
  export default {
    components: {
      fadeIn,
      submitBtn,
      WlExplorer,
      videoDialogBox,
      uploadItem,
    },
    props: {
      handleOptions: {
        type: Array,
        default: () => [],
      },
      rootName: {
        type: String,
        default: 'Document',
      },
      hasDownload: {
        type: Boolean,
        default: true,
      },
      unpack: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      const _GB = 1024 * 1024 * 1024
      // const vm = this;
      const folderNameValide = function (rule, value, cb) {
        if (value == '') {
          cb(new Error(this.$t('holder.pleaseEnterFileName')))
        } else if (!/^[^/\\\\:\\*\\?\\<\\>\\|\"]{1,255}$/.test(value)) {
          cb(new Error(this.$t('holder.TheFIleNameContainsInvalidCharacters')))
        } else {
          cb()
        }
      }
      return {
        menuName: 'ONLINE_FILE_READING',
        loading: false,
        load: { folder: false }, // loading管理
        fade: { folder: false }, // 弹出类视图管理
        uploader: { folder: false, upload: false },
        file_table_columns: [
          { label: this.$t('table.Name'), prop: 'name', minWidth: 120 },
          {
            label: this.$t('table.ModificationDate'),
            align: 'center',
            width: 170,
            formatter(row) {
              return row.lastModifiedDate ? row.lastModifiedDate.split('T')[0] || '-' : ''
            },
          },
          {
            label: this.$t('table.type'),
            align: 'center',
            width: 90,
            formatter: (row) => {
              return row.folder ? this.$t('common.folder') : row.type
            },
          },
          {
            label: this.$t('table.size'),
            minWidth: 90,
            align: 'center',
            formatter(row) {
              if (!row.size) return '-'
              if (row.size < 1024) {
                // 1024以下显示字节
                return row.size + 'B'
              }
              if (row.size < 1024 * 1024) {
                let _kb = (row.size / 1024).toFixed(2)
                return parseFloat(_kb) + 'KB'
              }
              if (row.size < _GB) {
                // 1024*1024
                let _mb = (row.size / (1024 * 1024)).toFixed(2)
                return parseFloat(_mb) + 'MB'
              }
              let _gb = (row.size / _GB).toFixed(2)
              return parseFloat(_gb) + 'GB'
            },
          },
          {
            label: this.$t('table.CreationDate'),
            align: 'center',
            width: 150,
            formatter(row) {
              return row.createdDate ? row.createdDate.split('T')[0] || '-' : ''
            },
          },
        ], // 自定义表格列
        file_table_data: [], // 表格数据
        all_folder_list: [], // 所有文件夹列表
        tree_folder_list: [], // 树形文件夹列表
        type: { folder: 1, img: 2, video: 3, other: 4 }, // 文件类型
        rource_type: {}, // 数据来源类型
        explorer_prop: {
          toolbar: false,
          name: 'name',
          match: 'name',
          splic: true,
          suffix: 'type',
          pathId: 'id',
          pathPid: 'parentId',
          pathName: 'name',
          pathChildren: 'children', // String 路径数据 children字段
          pathConnector: '\\', // String 路径父子数据拼接连接符,默认为'\'
        }, // 文件管理器配置项
        path: {}, // 路径数据
        previewType: '',
        previewOptions: '',
        folder_form: {
          ParentId: '',
          Name: '',
          preview: [],
          handle: [],
          Describe: '',
        }, // 文件夹表单
        folder_rules: {
          ParentId: [
            { required: true, message: this.$t('holder.pleaseSelectFilePath'), trigger: 'blur' },
          ],
          Name: [
            { required: true, message: this.$t('holder.pleaseEnterFolderName'), trigger: 'blur' },
          ],
        }, // 文件夹表单验证
        child_act_saved: {}, // 存储子组件数据，用于编辑更新
        tree_select_prop: {
          label: 'Name',
          children: 'Children',
        }, // 树形下拉框配置项
        uploadOptions: {}, // 上传文件附加参数
        uploadHeader: {
          Authorization: 'Bearer ' + window.sessionStorage.getItem('access_token'),
          'Accept-Language': this.locale,
        },
        uploadUrl: `${import.meta.env.VITE_BASE_API_PUB}/files/upload`, // 上传地址
        uploadInfo: {}, // 临时存储上传信息
        isFolder: (row) => {
          return Boolean(row.folder)
        },
        scormDialog: false,
        coursewaresInfo: {},
        showProgressDialog: false,
        uploadList: [],
        accessControls: [],
        showEditDialog: false,
        editForm: {
          name: '',
          accessControls: [],
          isFolder: false,
        },
        editRules: {
          name: [{ required: true, validator: folderNameValide }],
        },
        rootPath: '', // 根目录地址
        images: {
          folder: image_folder,
        },
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
      totalAuthorities() {
        return this.userInfo.totalAuthorities
      },
      authAdd() {
        return this.totalAuthorities.includes(this.menuName + ':NEW_FOLDER')
      },
      authUpload() {
        return this.totalAuthorities.includes(this.menuName + ':UPLOAD_FILE')
      },
      authDelete() {
        return this.totalAuthorities.includes(this.menuName + ':DELETE')
      },
      authDownload() {
        return Boolean(this.hasDownload)
      },
      headerHandle() {
        let handleArr = [
          {
            label: 'rename',
            name: this.$t('button.modify'),
            command: this.renameFile,
            disabled: !this.totalAuthorities.includes(this.menuName + ':RENAME'),
          },
          // { label: 'download' , name: '下载', command: this.downloadFile },
          {
            label: 'delete',
            name: this.$t('button.delete'),
            command: this.fileDel,
            disabled: !this.authDelete,
          },
        ] // 头部按钮更多操作-自定义权限
        this.handleOptions.forEach((item) => {
          if (handleArr.find((v) => v.label == item.label)) {
            let index = handleArr.findIndex((v) => v.label == item.label)
            handleArr[index] = { ...handleArr[index], ...item }
          } else {
            handleArr.push(item)
          }
        })
        return handleArr.filter((v) => !v.disabled)
      },
    },
    setup() {
      const { locale } = useI18n()
      return {
        locale,
      }
    },
    methods: {
      /**
       * 根据关键词搜索文件
       * file: Object 文件属性
       * update: Boolean 数据是否需要更新（不需要表示已存在）
       */
      fileSearch(file, update) {
        if (update) {
          this.path = file
          let query = this.all_folder_list.find((v) => v.id == file.id)
          let uuid = query ? query.uuid : ''
          this.getFileList(uuid)
        }
      },
      // 提交文件夹表单
      submitFolderFrom() {
        this.$refs.folder_form.validate(async (valid) => {
          if (valid) {
            this.load.folder = true
            let parentId, path
            if (this.path.id) {
              let item = this.all_folder_list.find((v) => v.id == this.path.id) || {}
              parentId = item.id.toString().replace('p', '')
              path = item.path
            } else {
              let item = this.all_folder_list.find((v) => !v.id)
              parentId = item.parentId
              path = item.path
            }
            let { uuid } = this.all_folder_list.find((v) => v.id == this.path.id) || {}

            let params = {
              dataOwner: 'FTM',
              name: this.folder_form.Name,
              parentUuid: this.path.id
                ? uuid
                : this.all_folder_list.find((v) => v.id == '').parentUuid,
              accessControls: this.accessControls.map((str) => ({ type: str })),
            }
            let [err] = await to(postFileFolder(params))
            this.load.folder = false
            if (!err) {
              this.fade.folder = false
              this.folder_form.ParentId = ''
              this.folder_form.Name = ''
              this.$refs.upload_form.resetFields()
              this.$message.success(this.$t('tip.subSuccessTip'))
              this.refreshFile()
            }
          } else {
            return false
          }
        })
      },
      // 重命名文件/文件夹
      async renameFile() {
        let data = this.$refs['wl-explorer-cpt'].self_data
        let checked = data.filter((v) => v._checked)
        if (checked.length == 0) {
          return this.$message.error(this.$t('holder.pleaseSelectToModifyFileOrFolder'))
        }
        let { uuid } = checked[0]
        this.showEditDialog = true
        let renameObj = this.all_folder_list.find((v) => v.uuid == uuid)
        this.editForm.name = renameObj.name
        this.editForm.isFolder = renameObj.folder
        Array.isArray(renameObj.accessControls) &&
          (this.editForm.accessControls = renameObj.accessControls.map((v) => v.type))
      },
      handleCancelEdit() {
        this.editForm.name = ''
        this.editForm.accessControls = []
        this.$refs.editForm.clearValidate()
      },
      async handleConfirmEdit() {
        this.$refs.editForm.validate(async (bool) => {
          if (!bool) return
          let data = this.$refs['wl-explorer-cpt'].self_data
          let checked = data.filter((v) => v._checked)
          let { uuid } = checked[0]
          let { name, accessControls } = this.editForm
          let renameObj = this.all_folder_list.find((v) => v.uuid == uuid)
          let { parentId, path } = renameObj
          let folder_params = {
            dataOwner: 'FTM',
            name,
            parentId,
            path,
            uuid: uuid || parentUuid,
            accessControls: accessControls.map((v) => ({ type: v })),
          }
          let file_params = { name, uuid }
          let [err] = await to(
            renameObj.isFolder == false ? putResource(file_params) : putFileFolder(folder_params),
          )
          if (!err) {
            this.$message.success(this.$t('tip.editSuccessTip'))
            this.refreshFile()
            this.showEditDialog = false
          }
        })
      },
      /* 上传文件提交操作 */
      async fileUpload() {
        if (!this.uploadInfo.id) return
        let uploader = this.$refs['upload-item']
        // this.uploader.upload = true
        uploader.toUpload()
      },
      uploadReg(file) {
        let subfix = file.name.split('.').pop().toLocaleLowerCase()
        let parentInfo = this.all_folder_list.find((v) => v.id == this.path.id) || {}
        this.uploadOptions = { unzip: this.unpack ? Boolean(subfix == 'zip') : false }
        this.uploadInfo = parentInfo
      },
      uploadDel(file) {
        this.uploadInfo = {}
      },
      // 上传完成提交文件信息
      async uploadSuccess(res) {
        this.uploader.upload = false
        this.uploadInfo = {}
        this.$message.success(this.$t('tip.uploadSuccessTip'))
        this.$refs['upload-item'].dom.clearFiles()
        this.refreshFile()
      },
      uploadComplate() {
        let getParams = {
          dataOwner: 'FTM',
          name: null,
          fileUuid: null,
          folderUuid: this.uploadInfo.uuid,
        }
        return function (data) {
          getParams.fileUuid = data.uuid
          getParams.name = data.name
          return [postResource, getParams]
        }
      },
      // 上传失败回调
      uploadError(err) {
        try {
          this.$message.error(JSON.parse(err.message).msg)
        } catch (e) {
          this.$message.error('response status:' + e.status)
        }
        this.uploader.upload = false
      },
      // 上传文件
      async upload() {
        this.uploader.folder = true
      },
      // 删除文件
      fileDel() {
        let data = this.$refs['wl-explorer-cpt'].self_data
        let checked = data.filter((v) => v._checked)
        if (checked.length == 0) {
          return this.$message.error(this.$t('tip.noSelectToDeleteFileOrFolder'))
        }

        this.$confirm(this.$t('tip.areYouSureYouWantToDeleteTheSelected'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          let P = checked.map((file) =>
            file.isFolder
              ? putFileFolderDisable({ uuid: file.uuid })
              : pustResourceDisAble({ uuid: file.uuid }),
          )
          Promise.all(P)
            .then(() => {
              this.$message.success(this.$t('tip.delsuccessTip'))
              let parent = this.all_folder_list.find((folder) => folder.id == this.path.id)
              // parent.uuid ? this.getFileList(parent.uuid) : this.getAllFolders()
              this.refreshFile()
            })
            .catch(() => {
              this.refreshFile()
            })
        })
      },
      // 获取文件夹列表
      async getFileList(uuid) {
        this.loading = true
        let [err, res] = await to(getFileFolderId({ uuid }))
        this.loading = false
        if (!err) {
          let folders = res.data.folders
          let files = res.data.resources
          let list = []
          folders.forEach((folder) => {
            list.push({
              folder: true,
              parentId: res.data.id,
              path: res.data.path,
              ...folder,
              id: 'p' + folder.id,
            })
          })
          files.forEach((file) => {
            list.push({
              parentId: res.data.id,
              path: res.data.path,
              ...file,
              type: file.suffix ? file.suffix.substr(1).toLocaleLowerCase() : '',
            })
          })
          let allArr = this.all_folder_list.concat(list)
          // 去重
          this.all_folder_list = allArr.reduce((pre, cur) => {
            let index = pre.findIndex((v) => v.id == cur.id && v.folder == cur.folder)
            if (index < 0) {
              return pre.concat(cur)
            } else {
              pre[index] = cur
              return pre
            }
          }, [])
          this.file_table_data = list
        }
      },
      // 获取所有文件夹
      async getAllFolders() {
        this.loading = true
        let [err, res] = await to(getFileFolder({ folderType: this.rootName }))
        this.loading = false
        if (!err && res.status == 200) {
          let { parentId, path, parentUuid } = res.data
          let list = res.data.folderListVOS.map((v) => ({ parentId, folder: true, ...v }))
          this.file_table_data = list
          this.all_folder_list = [{ id: '', parentId, path, parentUuid }].concat(
            res.data.folderListVOS.map((v) => ({ ...v, parentId, path, folder: true })),
          )
          this.rootPath = res.data.path
        }
      },
      // 刷新文件
      refreshFile() {
        let { uuid } = this.all_folder_list.find((v) => v.id == this.path.id) || {}
        this.all_folder_list = this.all_folder_list.filter((v) => v.parentId != this.path.id)
        this.path.id ? this.getFileList(uuid) : this.getAllFolders()
      },
      // 判断是否文件夹函数
      isFolderFn(row) {
        return row.Type === this.type.folder
      },
      // 预览文件
      async previewEvent(row, cb) {
        if (
          row.type == 'mp4' ||
          row.type == 'avi' ||
          row.type == 'wmv' ||
          row.type == 'mov' ||
          row.type == 'flv' ||
          row.type == 'rmvb' ||
          row.type == 'rm'
        ) {
          this.previewType = 'video'
          this.previewOptions = {
            sources: [
              {
                type: `video/mp4`,
                src: `${import.meta.env.VITE_BASE_API_PUB}/open/${row.fileUuid}/inline`,
              },
            ],
          }
          cb()
        } else if (
          row.type == 'mp3' ||
          row.type == 'wma' ||
          row.type == 'wav' ||
          row.type == 'wma' ||
          row.type == 'ape'
        ) {
          this.previewType = 'audio'
          this.previewOptions = `${import.meta.env.VITE_BASE_API_PUB}/open/${row.fileUuid}/inline`
          cb()
        } else if (
          row.type == 'jpg' ||
          row.type == 'jpeg' ||
          row.type == 'git' ||
          row.type == 'png'
        ) {
          this.previewType = 'img'
          this.previewOptions = `${import.meta.env.VITE_BASE_API_PUB}/open/${row.fileUuid}/inline`
          cb()
        } else if (row.type == 'zip') {
          if (!this.unpack) {
            return console.log('禁止浏览压缩文件')
          }
          let [err, res] = await to(getFiles({ uuid: row.fileUuid }))
          if (!err) {
            this.coursewaresInfo.fileType = res.data.fileType
            this.coursewaresInfo.fileUuid = row.fileUuid
            this.coursewaresInfo.playFilePath = res.data.playFilePath
            this.coursewaresInfo.name = res.data.name
            this.scormDialog = true
          }
        } else if (row.type == 'pdf' || row.type == 'txt') {
          this.previewType = 'iframe'
          this.previewOptions = row.fileUuid
          // `${import.meta.env.VITE_BASE_API_PUB}/open/${row.fileUuid}/inline`
          cb()
        } else if (
          row.type == 'xls' ||
          row.type == 'xlsx' ||
          row.type == 'ppt' ||
          row.type == 'pptx' ||
          row.type == 'doc' ||
          row.type == 'docx'
        ) {
          this.previewType = 'office'
          this.previewOptions = row.fileUuid
          cb()
        } else {
          // 不支持预览
          this.$message.warning(this.$t('holder.pleaseDownloadPreview'))
        }
      },
      // 下载文件
      async downloadFile() {
        let data = this.$refs['wl-explorer-cpt'].self_data
        let checked = data.filter((v) => v._checked && !v.isFolder)
        if (checked.length == 0) {
          return this.$message.error(this.$t('holder.pleaseSelectDownloadFiles'))
        }
        let that = this
        this.uploadList = checked.map((v) => ({
          name: v.name,
          uuid: v.fileUuid,
          over: false,
          progress: 0,
        }))
        this.showProgressDialog = true
        this.uploadList.forEach(async (item, i) => {
          await (function () {
            return new Promise(function (resolve, reject) {
              let index = that.uploadList.findIndex((v) => v.uuid == item.uuid)
              let CancelToken = axios.CancelToken
              axios({
                url: import.meta.env.VITE_BASE_API_PUB + `/files/${item.uuid}/download`,
                method: 'GET',
                responseType: 'arraybuffer',
                timeout: 180000, // 三分钟超时
                headers: {
                  'Accept-Language': this.locale,
                  Authorization: 'Bearer ' + accountStore.token,
                },
                cancelToken: new CancelToken(function (c) {
                  that.$set(that.uploadList[index], 'cancelAxios', c)
                }),
                onDownloadProgress: function (e) {
                  if (e.lengthComputable) {
                    var rate = e.loaded / e.total
                    if (rate < 1) {
                      that.uploadList[index].progress = rate
                    } else {
                      that.uploadList[index].progress = 0.99
                    }
                  }
                },
              })
                .then((res) => {
                  if (res.status == 200) {
                    that.uploadList[index].progress = 1
                    toExport(res)
                  }
                  that.uploadList[index].over = true
                  resolve()
                })
                .catch(() => {
                  that.uploadList[index].over = true
                  reject()
                })
            })
          })()

          if (this.uploadList.every((v) => v.over)) {
            setTimeout(() => {
              this.showProgressDialog = false
            }, 800)
          }
        })
      },
      // 取消下载
      cancelDownload() {
        this.uploadList.forEach((item) => {
          if (
            (!!item.progress == false || item.progress < 1) &&
            item.cancelAxios &&
            item.cancelAxios instanceof Function
          ) {
            item.cancelAxios()
          }
        })
      },
      // 新建文件夹
      addFolder() {
        this.fade.folder = true
      },
      // 查找路径
      filterPath() {
        let path = ''
        if (this.path.id && (this.path.id + '').indexOf('p') < 0) {
          let route = this.all_folder_list.find((v) => v.id == this.path.id) || {}
          path = (route.path || '') + route.name
        } else if (this.path.id) {
          let route = this.all_folder_list.find((v) => v.id == this.path.id) || {}
          path = route.path || ''
        } else {
          let route = this.all_folder_list.find((v) => v.id === '') || {}
          path = route.path || ''
        }
        let replacePath = path.replace(new RegExp('^' + this.rootPath), '/')
        return replacePath.substr(0, 2) == '//' ? replacePath.substr(1) : replacePath
      },
    },
    created() {
      this.closeOtherLayout = closeOtherLayout
      this.getAllFolders()
    },
  }
</script>

<style scoped lang="scss">
  .file-container {
    .file-path {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 22px;
        margin-right: 10px;
      }
    }
    .dialogBox {
      display: flex;
      margin-bottom: 10px;
      .txt {
        position: relative;
        width: 30%;
        padding-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        &::after {
          content: ':';
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .process {
        width: 70%;
      }
    }
  }
</style>
