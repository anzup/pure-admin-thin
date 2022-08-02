<template>
  <VxeTable
    ref="xTable"
    :loading="tableLoading"
    :data="tableData"
    :columns="tableColumns"
    v-model:form="form"
    :toolbarConfig="tableTools"
    @checkbox="selectChangeEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #left_tools>
      <el-form ref="form" :model="form" inline class="componentsForm" size="medium">
        <el-form-item :label="$t('table.modelNumber')">
          <el-select
            v-model="form.airplaneType"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 140px"
            clearable
          >
            <el-option
              :label="item.key"
              :value="item.key"
              v-for="item in airplaneTypesAll"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.attribute')">
          <el-select
            v-model="form.propertyId"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 160px"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in propertyList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.system')">
          <el-select
            v-model="form.systemType"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 160px"
            clearable
          >
            <el-option
              :label="item.keyTranslation"
              :value="item.key"
              v-for="item in systemTypeList"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            class="searchInput"
            :placeholder="$t('holder.pleaseEnterTheTitle')"
            v-model="form.searchKey"
          >
            <template #suffix>
              <Search />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #properties="{ row }">
      <span>{{ formatProperties(row.properties) }}</span>
    </template>
  </VxeTable>

  <component
    :is="componentName"
    :videoDialog="videoDialog"
    :playId="playId"
    :fileType="fileType"
    :fileUuid="fileUuid"
    :playFilePath="playFilePath"
    :name="name"
    @beforeHideMethod="beforeHideMethod"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import videoPlayer from './components/videoPlayer.vue'
  import { Search } from '@element-plus/icons-vue'
  import {
    getCoursewares,
    getCoursewareProperties,
    getCoursewaresAirplaneTypes,
    getCoursewaresSystemTypes,
  } from '/@/api/ftm/student/courseware'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import selectedView from '/@/views/project_ftm/student/components/SelectedView/index.vue'
  import { deleteEmptyParams } from '/@/utils/index'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  import { useI18n } from 'vue-i18n'
  export default {
    props: ['type'],
    data() {
      return {
        records: [],
        airplaneTypesAll: [],
        propertyList: [],
        systemTypeList: [],
        tableData: [],
        tableLoading: false,
        tableTools: {
          enabled: true,
          slots: {
            buttons: 'left_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: '40' },
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.title'), minWidth: 280 },
          { field: 'airplaneTypes', title: this.$t('table.modelNumber'), minWidth: 120 },
          {
            field: 'systemTypes',
            title: this.$t('table.system'),
            formatter: this.formatSystem,
            width: 80,
          },
          {
            field: 'properties',
            title: this.$t('table.attribute'),
            formatter: this.formatProperties,
            slots: { default: 'properties' },
            width: 200,
          },
          { field: 'creator.name', title: this.$t('table.publisher'), minWidth: 90 },
          {
            field: 'createdDate',
            title: this.$t('table.releaseTime'),
            formatter: this.formatDate,
            width: 180,
          },
          { field: 'readCount', title: this.$t('table.readingsTotalNumber'), width: 100 },
        ],
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: undefined,
          order: 'asc',
          airplaneType: undefined,
          propertyId: undefined,
          systemType: undefined,
          searchKey: undefined,
          type: 'PUBLIC',
        },
        componentName: '',
        videoDialog: false,
        playId: undefined,
        fileUuid: '',
        fileType: '',
        playFilePath: '',
        name: '',
      }
    },
    computed: {
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
    },
    created() {
      sessionStorage.removeItem('ids')
      this.getCoursewareProperties()
      this.getCoursewaresAirplaneTypes()
      this.getCoursewaresSystemTypes()
    },
    components: {
      VxeTable,
      selectedView,
      videoPlayer,
      Search,
    },
    watch: {
      type: {
        immediate: true,
        handler(val) {
          this.refreshForm()
          this.form.type = val
          this.$nextTick(() => {
            this.getCoursewares()
          })
        },
      },
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
      selectChangeEvent({ records }) {
        this.records = XEUtils.map(records, (item) => item.id)
      },
      getClearAll() {
        this.xTable.clearSelectEvent()
        this.records = []
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getCoursewares()
      },
      refreshForm() {
        this.form.page = 1
        this.form.size = 10
        this.form.sort = undefined
        this.form.order = 'asc'
        this.form.airplaneType = undefined
        this.form.propertyId = undefined
        this.form.systemType = undefined
        this.form.searchKey = undefined
        this.form.type = ''
      },
      getCoursewareProperties() {
        const data = {
          page: 1,
          size: 10000,
          level: 0,
        }
        getCoursewareProperties(data).then((res) => {
          if (res.status == 200) {
            this.propertyList = res.data.content
          }
        })
      },
      getCoursewaresAirplaneTypes() {
        getCoursewaresAirplaneTypes().then((res) => {
          if (res.status == 200) {
            this.airplaneTypesAll = res.data
          }
        })
      },
      getCoursewaresSystemTypes() {
        getCoursewaresSystemTypes().then((res) => {
          if (res.status == 200) {
            this.systemTypeList = res.data
          }
        })
      },
      async getCoursewares() {
        this.tableLoading = true
        this.form = deleteEmptyParams(this.form)
        let [err, res] = await to(getCoursewares(this.form))
        this.tableLoading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
          this.getClearAll()
        }
      },
      playClick(id, fileUuid, fileType, name, playFilePath) {
        ;(this.componentName = 'videoPlayer'), (this.videoDialog = true)
        this.playId = id
        this.fileUuid = fileUuid
        this.fileType = fileType
        this.playFilePath = playFilePath
        this.name = name
      },
      details(id) {
        this.routerGo(`task/detail?id=${id}`)
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
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatSystem({ cellValue }) {
        if (this.systemTypeList.filter((v) => v.key == cellValue).length !== 0) {
          return this.systemTypeList.filter((v) => v.key == cellValue)[0].keyTranslation
        }
      },
      formatProperties(cellValue) {
        if (cellValue.length !== 0) {
          return cellValue.map((v) => v.name).toString()
        }
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.form.total = 0
        this.getCoursewares()
      },
    },
  }
</script>
