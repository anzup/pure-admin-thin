<template>
  <div class="w-full h-full !p-0 relative" @contextmenu.prevent.stop>
    <!-- 顶部操作栏 -->
    <div class="h-12 p-2 flex justify-between border-0 border-b border-gray-300 border-solid">
      <div class="flex">
        <el-button type="primary" @click="onAddFolder">{{ $t('buttons.newFolder') }}</el-button>
        <el-button type="primary" @click="showUploadfile = true"
          >{{ $t('buttons.clickUpload') }}
        </el-button>
        <el-button
          v-if="props.folderType === 'DOWNLOAD'"
          :disabled="selectFiles.length === 0"
          type="primary"
          @click="downloadFiles"
          >{{ $t('buttons.download') }}
        </el-button>
      </div>
      <div class="flex">
        <el-button :icon="Switch" type="primary" @click="toggleListType"
          >{{ $t('buttons.toggle') }}
        </el-button>
      </div>
    </div>
    <!-- 路径导航栏 -->
    <div
      :class="{ 'border-solid': !showList }"
      class="h-9 px-4 flex items-center border-0 border-b border-gray-300 text-sm"
      style="background-color: rgb(248, 248, 249)"
    >
      <!--type="primary"-->
      <el-button
        :disabled="breadcrumb.length === 1"
        :icon="ArrowLeft"
        circle
        size="small"
        @click="onGoBack"
      />

      <div class="flex px-4 cursor-pointer">
        <span v-show="breadcrumb.length === 1" class="mr-1 hover:text-system">/</span>
        <span
          v-for="(item, index) in breadcrumb"
          :key="index"
          class="mr-1 hover:text-system"
          @click="onJumpbreadcrumb(item, index)"
        >
          <span v-show="index !== 0">{{ item.name }}</span>
          <span v-show="index !== breadcrumb.length - 1">/</span>
        </span>
      </div>
    </div>
    <section class="f-main-container">
      <vxe-grid
        v-show="showList"
        ref="gridRef"
        :columns="gridColumns"
        v-bind="gridOptions"
        @checkboxChange="checkboxChange"
      >
        <template #listFileNameSlot="{ row }">
          <div
            class="w-full cursor-pointer"
            @click="onItemClick(row)"
            @contextmenu.prevent.stop="eventContextmenu($event, row)"
          >
            <slot name="listFileNameSlot">
              <SvgIcon :name="getSvgName(row)" class-name="list-icon mr-2" />
              <span>{{ row.name }}</span>
            </slot>
          </div>
        </template>
      </vxe-grid>
      <el-scrollbar v-show="!showList">
        <ul class="flex flex-wrap -mt-4 -ml-4 relative">
          <li
            v-for="(item, index) in gridOptions.data"
            :key="item.id"
            class="flex-shrink-0 flex-grow-0 w-24 ml-4 mt-4 relative text-center p-4 cursor-pointer select-none"
            @click="onItemClick(item)"
            @contextmenu.prevent.stop="eventContextmenu($event, item)"
          >
            <el-checkbox
              v-model="item.checked"
              class="!absolute left-2 top-0"
              @change="listItemCheck($event, item, index)"
              @click.stop
            />
            <SvgIcon :name="getSvgName(item)" class="text-6xl mt-1" />
            <div
              class="h-8 text-sm leading-4 text-333 overflow-ellipsis overflow-hidden mt-2 hover:text-system"
            >
              {{ item.name }}
            </div>
          </li>
        </ul>
      </el-scrollbar>
    </section>
    <AddFolder v-model="showAddfolder" :parent-uuid="parentUuid" @update-data="onRefreshList" />
    <AddFile v-model="showUploadfile" :folderUuid="parentUuid" @updateData="onRefreshList" />
    <Contextmenu ref="contextmenuRef">
      <ContextmenuItem @click="onDelete">{{ t('buttons.hsdelete') }}</ContextmenuItem>
      <ContextmenuItem @click="onModify">{{ t('buttons.edit') }}</ContextmenuItem>
    </Contextmenu>
    <Popover
      v-model="showPopover"
      :folderOrFile="selectFileOrFolder"
      :placement="placement"
      :virtual-ref="virtualRef"
    />
    <FilePreview
      v-model="showFilePreview"
      :file-uuid="selectFileOrFolder?.fileUuid || ''"
      :suffix="selectFileOrFolder?.suffix || ''"
    />
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, reactive, ref } from 'vue'
  import { VxeColumnProps, VxeGridInstance, VxeGridProps } from 'vxe-table'
  import { useI18n } from 'vue-i18n'
  import {
    deleteFileResources,
    deleteFolders,
    FileResources,
    Folder,
    FolderItem,
    getFolderDetail,
    getFolders,
    Resources,
  } from '/@/api/file'
  import AddFolder from './components/addFolder.vue'
  import AddFile from './components/addFile.vue'
  import to from 'await-to-js'
  //右键菜单
  import { Contextmenu, ContextmenuItem } from 'v-contextmenu'
  import { onClickOutside } from '@vueuse/core'
  import Popover from './components/popover.vue'
  import FilePreview from '/@/components/FilePreview/Index.vue'
  import { downloadFile } from '/@/utils/download'
  import { ArrowLeft, Switch } from '@element-plus/icons-vue'

  const _GB = 1024 * 1024 * 1024

  const { t } = useI18n()

  interface Props {
    folderType: 'DOWNLOAD' | 'READ_PREVIEW'
    showSeq?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    folderType: 'DOWNLOAD',
  })

  const gridOptions = reactive<VxeGridProps>({
    autoResize: true,
    height: 'auto',
    data: [],
    showOverflow: true,
  })
  const gridRef = $ref<VxeGridInstance>()

  const gridColumns = $computed<VxeColumnProps[]>(() => {
    // t('')
    return [
      {
        type: 'checkbox',
        width: 50,
      },
      {
        type: 'seq',
        title: t('state.seq'),
        width: 60,
        visible: props.showSeq,
      },
      {
        field: 'name',
        title: t('state.fileName'),
        slots: {
          default: 'listFileNameSlot',
        },
        align: 'left',
        headerAlign: 'center',
      },
      {
        field: 'lastModifiedDate',
        title: t('state.modifyDate'),
        formatter: 'formatDateTime',
      },
      {
        field: 'suffix',
        title: t('state.type'),
        formatter: ({ cellValue }: { cellValue: string }) =>
          cellValue ? cellValue.replace('.', '') : '-',
      },
      {
        field: 'size',
        title: t('state.size'),
        formatter: ({ cellValue }: { cellValue: number }) => {
          if (!cellValue && cellValue !== 0) return '-'
          if (cellValue < 1024) {
            // 1024以下显示字节
            return cellValue + 'B'
          }
          if (cellValue < 1024 * 1024) {
            let _kb = (cellValue / 1024).toFixed(2)
            return parseFloat(_kb) + 'KB'
          }
          if (cellValue < _GB) {
            // 1024*1024
            let _mb = (cellValue / (1024 * 1024)).toFixed(2)
            return parseFloat(_mb) + 'MB'
          }
          let _gb = (cellValue / _GB).toFixed(2)
          return parseFloat(_gb) + 'GB'
        },
      },
      {
        field: 'createdDate',
        title: t('state.creatDate'),
        formatter: 'formatDateTime',
      },
    ]
  })

  let showList = $ref(true)
  const toggleListType = () => {
    showList = !showList
  }

  const getSvgName = (item: FolderItem & Resources) => {
    if (breadcrumb.length === 1 || !item.fileUuid) {
      return 'svg-fileCenter-FOLDER'
    }

    let str = ''
    // 判断后缀名
    switch (item.suffix) {
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
      case '.bmp':
        str = 'IMAGE'
        break
      case '.zip':
      case '.rar':
      case '.7z':
        str = 'ZIP'
        break
      case '.avi':
      case '.mp4':
      case '.rmvb':
      case '.flv':
      case '.mov':
      case '.m2v':
      case '.mkv':
      case '.wmv':
        str = 'VIDEO'
        break
      case '.mp3':
      case '.wav':
      case '.wma':
        str = 'VIDEO'
        break
      case '.xls':
      case '.xlsx':
        str = 'EXCEL'
        break
      case '.doc':
      case '.docx':
      case '.text':
        str = 'WORD'
        break
      case '.pdf':
        str = 'PDF'
        break
      case '.ppt':
        str = 'PPT'
        break

      default:
        str = 'FILE'
        break
    }
    return 'svg-fileCenter-' + str
  }

  type Breadcrumb = Omit<Folder, 'folderListVOS'> & { name?: string }
  // 面包屑列表
  let breadcrumb = $ref<Breadcrumb[]>([])

  const parentUuid = $computed(() => breadcrumb.at(-1)?.parentUuid || '')

  // 获取页面根路径下的文件夹路径
  const getFolderList = async (): Promise<Folder> => {
    const [err, res] = await to(getFolders(props.folderType))
    if (!err) {
      gridOptions.data = res.data.folderListVOS
      return res.data
    }
  }

  let showAddfolder = $ref(false)
  const onAddFolder = () => {
    showAddfolder = true
  }

  const onRefreshList = () => {
    // 判断是不是在根目录下
    if (breadcrumb.length === 1) {
      getFolderList()
    } else {
      // 不是根目录时 请求 面包屑最后一个对象的详情
      getDetail(breadcrumb.at(-1).parentUuid)
    }
  }

  //获取文件夹里面的文件资源
  const getDetail = async (uuid: string) => {
    const [err, res] = await to(getFolderDetail(uuid))
    if (!err) gridOptions.data = [...res.data.folders, ...res.data.resources]
  }

  let showFilePreview = $ref(false)
  // item点击事件
  const onItemClick = async (val: FolderItem & Resources) => {
    const { id, uuid, path, name, fileUuid } = val
    // 判断是不是点击的文件夹,是的话请求详情,不是的话预览,是则像面包屑列表追加一个对象
    showPopover = false
    if (!fileUuid) {
      // 现请求数据
      try {
        await getDetail(uuid)
        breadcrumb.push({ parentId: id, parentUuid: uuid, path, name })
      } catch (error) {
        console.log(error)
      }
    } else {
      selectFileOrFolder = val
      showFilePreview = true
    }
  }

  let showPopover = $ref(false)
  let virtualRef = $ref<HTMLElement>()
  // 选中项删除
  const onDelete = () => {
    if (!selectFileOrFolder) return
    //  判断是文件夹还是文件
    const api = selectFileOrFolder.fileUuid ? deleteFileResources : deleteFolders
    api(selectFileOrFolder.uuid).then(() => {
      onRefreshList()
    })
  }
  // 选中项查看详情
  let placement = $ref('top')

  const onModify = () => {
    if (!selectFileOrFolder) return
    const { top, bottom } = virtualRef.getBoundingClientRect()
    if (top < 150) {
      placement = 'bottom'
    } else if (document.body.clientHeight - bottom < 150) {
      placement = 'top'
    }
    showPopover = true
  }

  // 面包屑点击事件
  const onJumpbreadcrumb = async (item: Breadcrumb, index: number) => {
    if (index === 0) {
      await getFolderList()
    } else {
      await getDetail(item.parentUuid)
    }
    breadcrumb.splice(index + 1, breadcrumb.length)
  }

  const onGoBack = async () => {
    if (breadcrumb.length == 1) return
    if (breadcrumb.length == 2) {
      await getFolderList()
    } else {
      await getDetail(breadcrumb.at(-2).parentUuid)
    }
    breadcrumb = breadcrumb.slice(0, breadcrumb.length - 1)
  }

  let showUploadfile = $ref(false)
  // 表格复选框点击事件
  const checkboxChange = (val) => {
    console.log(val, gridOptions.data)
  }
  const listItemCheck = (check, row, index) => {
    //  列表点击复选框设置表格选中
    gridRef.setCheckboxRow(row, check)
  }

  //处理右键菜单
  let contextmenuRef = $ref<any>()
  //右键选中的值
  let selectFileOrFolder = $ref<FolderItem & Resources>()

  const eventContextmenu = (e: PointerEvent, item: FolderItem & Resources) => {
    showPopover = false
    // selectEvent.value = val.event
    virtualRef = e.currentTarget as unknown as any
    selectFileOrFolder = item
    const positons = {
      top: e.y,
      left: e.x,
    }
    contextmenuRef.show(positons)
    nextTick(() => {
      eleRef.value = contextmenuRef?.contextmenuRef
    })
  }
  const eleRef = ref<HTMLElement>()

  const hidenContextmenu = () => {
    contextmenuRef.hide()
  }
  onClickOutside(eleRef, hidenContextmenu)

  const selectFiles = $computed<FileResources[]>(() =>
    gridOptions.data?.filter(
      (v: FileResources & FolderItem & { checked: boolean }) => v.fileUuid && v.checked,
    ),
  )
  //下载文件
  const downloadFiles = () => {
    selectFiles.forEach((v) => {
      downloadFile(v.fileUuid)
    })
  }

  onMounted(async () => {
    const res = await getFolderList()
    if (res) {
      const { parentId, parentUuid, path } = res
      breadcrumb.push({
        parentId,
        parentUuid,
        path,
      })
    }
  })
</script>

<style lang="scss" scoped>
  .f-main-container {
    height: calc(100% - 5rem);
  }

  .list-icon {
    font-size: 22px;
  }
</style>
