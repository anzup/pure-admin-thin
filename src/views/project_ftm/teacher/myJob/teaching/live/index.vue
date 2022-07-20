<template>
  <div class="container">
    <VxeTable
      :data="tableData"
      :loading="tableLoading"
      :columns="tableColumns"
      :toolbarConfig="tableToolbar"
      v-model:form="form"
      @handle-page-change="paginationEvent"
    >
      <template #form>
        <el-form inline class="tools_form" size="medium">
          <!-- 课号 -->
          <el-form-item :label="$t('table.CourseNumber')">
            <el-select
              v-model="form.courseNumber"
              clearable
              @change="changeFormData(...arguments, 'courseNumber')"
            >
              <el-option
                v-for="(item, index) in clazzs"
                :key="index"
                :label="item.courseNumber"
                :value="item.courseNumber"
              />
            </el-select>
          </el-form-item>
          <!-- 直播状态 -->
          <el-form-item :label="$t('table.LiveStatus')">
            <el-select v-model="form.status" class="sort-select" clearable>
              <el-option
                v-for="(item, index) in statusArray"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- 直播讲师 -->
          <el-form-item :label="$t('table.LiveTeacher')">
            <el-select v-model="form.userId" class="sort-select" clearable>
              <el-option
                v-for="(item, index) in teachers"
                :key="index"
                :label="item.name"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              class="searchInput"
              v-model="form.searchKey"
              :placeholder="$t('holder.PleaseEnterYourSearchKeyword')"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleSearch">{{
              $t('button.query')
            }}</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #tool_right>
        <el-button type="primary" size="mini" @click="toAddLive">{{
          $t('button.addLive')
        }}</el-button>
      </template>
      <template #edit="{ row }">
        <div class="button-line">
          <span
            class="buttonEdit"
            :style="{ color: row.status == 'FINISHED' ? '#ccc' : false }"
            @click="row.status == 'FINISHED' ? undefined : toLive(row)"
            >{{ $t('button.enterLive') }}</span
          >
          <span class="buttonEdit" @click="modify(row)">{{ $t('button.modify') }}</span>
          <span
            class="buttonEdit"
            :style="{ color: row.replayFiles.length ? '' : '#ccc' }"
            @click="seeRecord(row)"
            >{{ $t('button.view') }}</span
          >
          <span class="buttonDelete" @click="deleteItem(row)">{{ $t('button.delete') }}</span>
        </div>
      </template>
    </VxeTable>

    <!-- 录播列表 -->
    <el-dialog :title="$t('supplement.recordList')" v-model="recordVisible" width="800px" center>
      <div v-loading="downLoading" :element-loading-text="$t('status.downloading')">
        <VxeTable
          :data="recordData"
          :columns="recordColumns"
          v-model:form="form"
          @handle-page-change="paginationEvent"
        >
          <template #pager />
          <template #edit="{ row, rowIndex }">
            <div class="button-line">
              <span class="buttonEdit" @click="preview(row)">{{ $t('button.preview') }}</span>
              <span class="buttonEdit" @click="download(row, rowIndex)">{{
                $t('button.download')
              }}</span>
            </div>
          </template>
        </VxeTable>
      </div>
    </el-dialog>

    <!-- 录像弹框 -->
    <video-player-dialog
      :videoTitle="$t('supplement.video')"
      :videoURL="recordPreview"
      v-model:videoVisible="recordVideoVisible"
    />
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  import { getEmployees } from '/@/api/ftm/teacher/account'
  import { noFinishedClazzs } from '/@/api/ftm/teacher/studentTraining'
  import { getLives, delLives } from '/@/api/ftm/teacher/teachingCenter'
  import videoPlayerDialog from './components/videoPlayer.vue'
  import { formatTime } from '/@/utils/index'
  import axios from 'axios'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()

  export default {
    data() {
      return {
        form: {
          participantUserId: undefined,
          page: 1,
          size: 10,
          total: 0,
        },
        statusArray: [
          { id: 'BROADCASTING', name: this.$t('status.broadcasting') },
          { id: 'NOT_STARTED', name: this.$t('status.pending') },
          { id: 'FINISHED', name: this.$t('status.over') },
        ],
        teachers: [],
        clazzs: [],
        tableLoading: false,
        tableData: [],
        tableToolbar: {
          perfect: true,
          slots: {
            tools: 'tool_right',
          },
        },
        tableColumns: [
          { type: 'seq', width: 80, title: this.$t('common.serialNumber') },
          { field: 'name', minWidth: 200, title: this.$t('table.LiveName') },
          { field: 'courseNumber', width: 150, title: this.$t('table.CouseCode') },
          { field: 'user.name', width: 180, title: this.$t('table.LiveTeacher') },
          {
            field: 'startTime',
            width: 200,
            title: this.$t('table.Airtime'),
            formatter: this.dateFormat,
          },
          // { field: 'realStartDate', width: 200, title: this.$t('table.Airtime'), formatter: this.dateFormat },
          {
            field: 'finishDate',
            width: 200,
            title: this.$t('table.endTime'),
            formatter: this.dateFormat,
          },
          {
            field: 'audienceUsers',
            width: 80,
            title: this.$t('table.LiveNumber'),
            formatter: ({ cellValue }) => (cellValue instanceof Array ? cellValue.length : 0),
          },
          {
            field: 'record',
            width: 120,
            title: this.$t('table.WhetherRecorded'),
            formatter: ({ cellValue }) =>
              cellValue ? this.$t('common.yes') : this.$t('common.no'),
          },
          {
            field: 'status',
            width: 120,
            title: this.$t('table.LiveStatus'),
            formatter: this.statusFormat,
          },
          { minWidth: 290, title: this.$t('table.tableEdit'), slots: { default: 'operate' } },
        ],
        recordVisible: false,
        recordVideoVisible: false,
        recordItem: {},
        recordData: [],
        recordPreview: '',
        recordColumns: [
          {
            field: 'startTime',
            title: this.$t('table.VideoStartTime'),
            formatter: ({ cellValue }) => XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss'),
            minWidth: 160,
          },
          {
            field: 'endTime',
            title: this.$t('table.VideoEndTime'),
            formatter: ({ cellValue }) => XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss'),
            minWidth: 160,
          },
          {
            field: 'duration',
            title: this.$t('table.Duration'),
            formatter: ({ cellValue }) => formatTime.call(this, cellValue),
            minWidth: 90,
          },
          { title: this.$t('table.tableEdit'), slots: { default: 'operate' }, width: 180 },
        ],
        downLoading: false,
      }
    },
    components: {
      VxeTable,
      videoPlayerDialog,
    },
    computed: {
      userInfo() {
        return userStore.$state
      },
    },
    created() {
      this.form.participantUserId = this.userInfo.userId
      this.getList()
      // 筛选条件：班级课号、教员
      getEmployees({ size: 1000 }).then((res) => {
        this.teachers = this.teachers.concat(res.data.content)
      })
      noFinishedClazzs({ teacherUserId: this.userInfo.userId }).then((res) => {
        this.clazzs = this.clazzs.concat(res.data.content)
      })
    },
    methods: {
      async getList() {
        this.tableLoading = true
        let [err, res] = await to(getLives(this.form))
        this.tableLoading = false
        if (!err) {
          this.tableData = res.data.content
        }
      },
      // 分页
      paginationEvent({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getList()
      },
      // 格式化时间
      dateFormat({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      // 格式化状态
      statusFormat({ cellValue }) {
        switch (cellValue) {
          case 'BROADCASTING':
            return this.$t('status.broadcasting')
          case 'FINISHED':
            return this.$t('status.over')
          case 'NOT_STARTED':
            return this.$t('status.pending')
          default:
            return ''
        }
      },
      // 删除
      async deleteItem(row) {
        this.$confirm(this.$t('tip.areYouSureYouWantToDelete'), this.$t('tip.tip'), {
          type: 'error',
        }).then(async () => {
          let [err, res] = await to(delLives({ id: row.id }))
          if (!err) {
            this.$message.success(this.$t('tip.delsuccessTip'))
            this.getList()
          }
        })
      },
      // 查询
      handleSearch() {
        this.form.page = 1
        this.getList()
      },
      // 查看录像列表
      seeRecord(row) {
        if (row.replayFiles && row.replayFiles.length) {
          this.recordItem = row
          this.recordVisible = true
          this.recordData = row.replayFiles
        }
      },
      // 预览录像
      preview(item) {
        this.recordPreview = item.url
        this.recordVideoVisible = true
      },
      // 下载录像
      download(row, index) {
        let download_url = row.url.replace(/http/g, 'https')
        let download_name = this.recordItem.name + `-${index + 1}` + '.mp4'
        this.downLoading = true
        axios({
          url: download_url,
          method: 'get',
          responseType: 'blob',
          headers: {
            // 'Accept-Language': getLanguage(),
          },
        })
          .then((res) => {
            let url = window.URL.createObjectURL(new Blob([res.data]))
            // 生成一个a标签
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.download = download_name
            document.body.append(link)
            link.click()
            link.remove()
            this.downLoading = false
          })
          .catch(() => {
            this.$message.error(this.$t('status.downloadFailed'))
            this.downLoading = false
          })
      },
      toLive(row) {
        this.$router.push(`live/${row.id}`)
      },
      toAddLive() {
        this.$router.push('live/add')
      },
      modify(row) {
        this.$router.push({
          path: '/teachingCenter/liveTeaching/editLive',
          query: {
            id: row.id,
          },
        })
      },
      changeFormData(val, key) {
        if (val == '') {
          this.form[key] = undefined
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .container {
    :deep(.el-form-item) {
      margin-bottom: 10px;
    }
  }
</style>
