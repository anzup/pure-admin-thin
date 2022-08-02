<template>
  <div>
    <VxeTable
      :data="tableData"
      :loading="loading"
      :columns="tableColumns"
      :buttons="tableButtons"
      v-model:form="form"
      @handlePageChange="handleCurrentChange"
    >
      <template #form>
        <el-form ref="form" :model="form" :inline="true" size="medium">
          <el-form-item :label="$t('table.coursewareType')">
            <el-select
              v-model="form.coursewareType"
              :placeholder="$t('holder.pleaseSelect')"
              style="width: 200px"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in coursewareTypeList"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('button.status')">
            <el-select
              v-model="form.status"
              :placeholder="$t('holder.pleaseSelect')"
              style="width: 200px"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in statusList"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              class=""
              :placeholder="$t('holder.pleaseInputCoursewareName')"
              v-model="form.searchKey"
              style="width: 280px"
            >
              <template #suffix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
    </VxeTable>

    <component
      v-model:videoDialog="videoDialog"
      :is="componentName"
      :name="name"
      :playId="playId"
      :progress="progress"
      :fileType="fileType"
      :fileUuid="fileUuid"
      :playFilePath="playFilePath"
      @beforeHideMethod="beforeHideMethod"
    />
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import videoPlayer from '/@/views/project_ftm/student/myJob/myCourseware/list/components/videoPlayer.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { deleteEmptyParams, formatTime } from '/@/utils/index'
  import {
    getCoursewareAssignmentReadRecords,
    getCousewareAssignmentReadRecordDetail,
  } from '/@/api/ftm/student/courseware'
  import { isHaveFile } from '/@/api/ftm/student/file'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    components: {
      Search,
      VxeTable,
      videoPlayer,
    },
    data() {
      return {
        form: {
          page: 1,
          size: 10,
          total: 0,
          searchKey: undefined,
          coursewareType: undefined,
          status: undefined,
          sort: 'createdDate',
          order: 'desc',
        },
        loading: false,
        tableData: [],
        tableColumns: [
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'assignment.courseware.name', title: this.$t('table.title'), minWidth: 140 },
          {
            field: 'assignment.courseware.type',
            title: this.$t('table.coursewareType'),
            formatter: this.formatType,
            width: 90,
          },
          {
            field: 'assignment.courseware.creator.name',
            title: this.$t('table.publisher'),
            minWidth: 100,
          },
          { field: 'assignment.creator.name', title: this.$t('table.designator'), minWidth: 100 },
          {
            field: 'createdDate',
            title: this.$t('table.assignedTime'),
            formatter: this.formatDate,
            width: 180,
          },
          {
            field: 'remainTime',
            title: this.$t('table.remainingLearningTime'),
            formatter: this.valideTime,
            width: 200,
          },
          {
            field: 'status',
            title: this.$t('table.learningState'),
            formatter: this.formatStatus,
            width: 150,
          },
          {
            field: 'readDuration',
            title: this.$t('table.readingTime'),
            formatter: this.formatReadDuration,
            width: 150,
          },
          {
            field: 'lastReadTime',
            title: this.$t('table.lastReadTime'),
            formatter: this.formatDate,
            width: 180,
          },
          { title: this.$t('table.tableEdit'), width: 180, slots: { default: 'operate' } },
        ],
        coursewareTypeList: [
          { id: 'PUBLIC', name: this.$t('table.openCourseware') },
          { id: 'THIRD_PARTY', name: this.$t('table.thirdPartyCourseware') },
          { id: 'SELF', name: this.$t('table.ownCourseware') },
        ],
        statusList: [
          { id: 'NOT_STARTED', name: this.$t('button.notComplete') },
          { id: 'FINISHED_DELAYED', name: this.$t('status.finishedDelayed') },
          { id: 'FINISHED_IN_TIME', name: this.$t('status.finishedInTime') },
        ],
        componentName: '',
        videoDialog: false,
        playId: undefined,
        progress: '',
        fileUuid: '',
        fileType: '',
        playFilePath: '',
        name: '',
      }
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    watch: {
      '$route.path': {
        handler() {
          this.beforeHideMethod()
        },
      },
    },
    created() {
      this.getCoursewareAssignmentReadRecords()
      // let timer = setInterval(() => {
      //   if(this.userInfo.id){
      //     clearInterval(timer)

      //   }
      // }, 200);
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    // TODO 原缓存页面执行activated
    mounted() {
      if (this.$route.query.readId) {
        getCousewareAssignmentReadRecordDetail({ id: this.$route.query.readId }).then((res) => {
          if (res.status == 200) {
            this.playClick(
              res.data.assignment.courseware.id,
              res.data.assignment.courseware.fileUuid,
              res.data.assignment.courseware.fileType,
              res.data.assignment.courseware.name,
              res.data.assignment.courseware.playFilePath,
              res.data.assignment.progress,
            )

            let { path, query } = this.$route
            this.$router.replace({ path, query: { ...query, readId: '' } })
          }
        })
      }
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getCoursewareAssignmentReadRecords()
      },
      // 点击播放 先判断文件是否存在
      async playClick(id, fileUuid, fileType, name, playFilePath, progress) {
        let [fileErr, fileRes] = await to(isHaveFile({ uuid: fileUuid }))
        if (!fileErr && fileRes.status == 200) {
          if (!fileRes.data)
            return this.$message.error(this.$t('holder.ThisCoursewareHasBeenDeleted'))
          ;(this.componentName = 'videoPlayer'), (this.videoDialog = true)
          this.playId = id
          this.progress = progress
          this.fileUuid = fileUuid
          this.fileType = fileType
          this.playFilePath = playFilePath
          this.name = name
        }
      },
      beforeHideMethod() {
        this.componentName = ''
        this.videoDialog = false
        this.playId = undefined
        this.fileUuid = undefined
        this.fileType = undefined
        this.playFilePath = undefined
        this.name = undefined
      },
      async getCoursewareAssignmentReadRecords() {
        this.form = deleteEmptyParams(this.form)
        this.form.assigneeId = this.userInfo.userId
        this.loading = true
        let [err, res] = await to(getCoursewareAssignmentReadRecords(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      valideTime({ cellValue }) {
        return typeof cellValue == 'string' || (typeof cellValue == 'number' && cellValue > 0)
          ? this.formatReadDuration({ cellValue })
          : 0
      },
      formatType({ cellValue }) {
        if (this.coursewareTypeList.filter((v) => v.id == cellValue).length !== 0) {
          return this.coursewareTypeList.filter((v) => v.id == cellValue)[0].name
        }
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatStatus({ cellValue }) {
        if (cellValue == 'FINISHED_DELAYED') {
          return this.$t('status.finishedDelayed')
        } else if (cellValue == 'FINISHED_IN_TIME') {
          return this.$t('status.finishedInTime')
        } else {
          return this.$t('button.notComplete')
        }
      },
      formatReadDuration({ cellValue }) {
        return this.getDuration(cellValue)
      },
      getDuration(second) {
        return formatTime.call(this, second)
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.getCoursewareAssignmentReadRecords()
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.play'),
            event: () => {
              this.playClick(
                row.assignment.courseware.id,
                row.assignment.courseware.fileUuid,
                row.assignment.courseware.fileType,
                row.assignment.courseware.name,
                row.assignment.courseware.playFilePath,
                row.progress,
              )
            },
          },
          {
            name: this.$t('button.comment'),
            event: () => {
              this.routerGo(`task/detail?id=${row?.assignment?.courseware?.id || ''}`)
            },
          },
        ]
      },
    },
  }
</script>
