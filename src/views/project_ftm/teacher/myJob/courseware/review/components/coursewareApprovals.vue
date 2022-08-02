<template>
  <VxeTable
    :toolbar-config="tableTools"
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    :buttons="tableButtons"
    v-model:form="form"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form ref="form" :model="form" inline size="medium">
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
    <template #properties="{ row }"> {{ formatProperties(row.properties) }} </template>
  </VxeTable>

  <examine-dialog
    :examineVisible="examineVisible"
    :examineId="examineId"
    @beforeHideMethod="beforeHideMethod"
  />
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { Search } from '@element-plus/icons-vue'
  import XEUtils from 'xe-utils'
  import {
    getCoursewareProperties,
    getCoursewaresAirplaneTypes,
    getCoursewaresSystemTypes,
    getCoursewareApprovalRequests,
  } from '/@/api/ftm/teacher/courseware'
  import examineDialog from './examineDialog.vue'
  import { deleteEmptyParams } from '/@/utils/index'
  import { systemFormat } from './format'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  import { useRouter } from 'vue-router'
  import { useGo } from '/@/hooks/usePage'
  const userStore = useFtmUserStore()
  export default {
    components: { examineDialog, VxeTable, Search },
    data() {
      return {
        menuName: 'COURSEWARE_APROVAL_REQUEST_LIST',
        form: {
          page: 1,
          size: 10,
          total: 0,
          airplaneType: undefined,
          propertyId: undefined,
          systemType: undefined,
          status: undefined,
          searchKey: undefined,
          sort: 'status',
          order: 'asc',
          statusIN: 'PENDING,REJECTED',
        },
        airplaneTypesAll: [],
        propertyList: [],
        systemTypeList: [],
        loading: false,
        tableTools: {
          enabled: false,
        },
        tableData: [],
        tableColumns: [
          { type: 'checkbox', width: 40 },
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.discussCourseware'), minWidth: 120 },
          { field: 'creator.name', title: this.$t('table.coursewareAuthor'), minWidth: 90 },
          { field: 'airplaneTypes', title: this.$t('table.modelNumber'), minWidth: 180 },
          {
            field: 'systemTypes',
            title: this.$t('table.system'),
            formatter: this.systemFormat,
            minWidth: 160,
          },
          {
            field: 'properties',
            title: this.$t('table.attribute'),
            slots: { default: 'properties' },
            width: 200,
          },
          {
            field: 'createdDate',
            title: this.$t('table.startTime'),
            formatter: this.formatDate,
            width: 180,
          },
          {
            field: 'status',
            title: this.$t('table.applicationStatus'),
            formatter: this.formatStatus,
            width: 90,
          },
          { title: this.$t('table.tableEdit'), width: 200, slots: { default: 'operate' } },
        ],
        examineVisible: false,
        examineId: undefined,
      }
    },
    created() {
      this.getCoursewareProperties()
      this.getCoursewaresAirplaneTypes()
      this.getCoursewaresSystemTypes()
      this.getCoursewareApprovalRequests()
    },
    activated() {
      this.getCoursewareProperties()
      this.getCoursewaresAirplaneTypes()
      this.getCoursewaresSystemTypes()
      this.getCoursewareApprovalRequests()
    },
    setup() {
      const router = useRouter()
      const routerGo = useGo(router)
      return {
        routerGo,
      }
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getCoursewareApprovalRequests()
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
      async getCoursewareApprovalRequests() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        let [err, res] = await to(getCoursewareApprovalRequests(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      details(id) {
        this.routerGo(`review/coursewareDetail?id=${id}`)
      },
      examine(id) {
        this.examineVisible = true
        this.examineId = id
      },
      beforeHideMethod() {
        this.examineVisible = false
        this.getCoursewareApprovalRequests()
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatProperties(cellValue) {
        if (cellValue.length !== 0) {
          return cellValue.map((v) => v.name).toString()
        }
      },
      formatStatus({ cellValue }) {
        return cellValue === 'PENDING'
          ? this.$t('status.inProgress')
          : cellValue === 'APPROVED'
          ? this.$t('button.pass')
          : this.$t('button.reject')
      },
      systemFormat({ cellValue }) {
        return cellValue instanceof Array
          ? cellValue.map((v) => systemFormat.call(this, v)).join(',')
          : ''
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getCoursewareApprovalRequests()
      },
      tableButtons({ row }) {
        return [
          {
            name: this.$t('button.details'),
            visible: userStore.ContainsPermissions(this.menuName + ':DETAIL'),
            event: () => {
              this.details(row.id)
            },
          },
          {
            name: this.$t('button.examine'),
            disabled: row.status != 'PENDING',
            visible: userStore.ContainsPermissions(this.menuName + ':AUDIT'),
            event: () => {
              this.examine(row.id)
            },
          },
        ]
      },
    },
  }
</script>
<style scoped lang="scss">
  .buttonEdit.disabled {
    cursor: default;
    color: #ccc;
  }
</style>
