<template>
  <div class="container">
    <VxeTable
      ref="xTable"
      :data="tableData"
      :loading="loading"
      :columns="tableColumns"
      v-model:form="form"
      :toolbarConfig="tableTools"
      @checkbox="selectChangeEvent"
      @handlePageChange="handleCurrentChange"
    >
      <template #form>
        <el-form ref="form" :model="form" :inline="true" size="medium">
          <!-- 训练机型 -->
          <el-form-item :label="$t('table.trainingModel')">
            <el-select
              v-model="form.airplaneTypes"
              :placeholder="$t('holder.pleaseSelect')"
              clearable
            >
              <el-option
                :label="item"
                :value="item"
                v-for="item in airplaneTypesAll"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
          <!-- 课程分类 -->
          <el-form-item :label="$t('table.courseClassify')">
            <el-select
              v-model="form.courseClassifyId"
              :placeholder="$t('holder.pleaseSelect')"
              clearable
            >
              <el-option
                v-for="item in courseClassifyAll"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              :placeholder="$t('holder.teacherNameOrTeachingModelForInquiry')"
              suffix-icon="el-icon-search"
              v-model="form.searchKey"
              style="width: 280px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
      <template #right_tools>
        <!--TODO 按钮权限-->
        <!--v-permission="menuName + ':ADD'"-->
        <el-button size="mini" type="primary" @click="add">{{ $t('button.add') }}</el-button>

        <!--TODO 按钮权限-->
        <!--v-permission="menuName + ':BULK_DELETION'"-->
        <el-button
          size="mini"
          type="danger"
          @click="postCoursesBatchDelete"
          :disabled="records.length == 0"
          >{{ $t('button.batchDeletion') }}</el-button
        >
      </template>

      <template #edit="{ row }">
        <div class="button-line">
          <span class="buttonEdit" @click="edit(row.id)" v-permission="menuName + ':DETAIL'">{{
            $t('button.details')
          }}</span>
          <span class="buttonEdit" @click="modify(row.id)" v-permission="menuName + ':UPDATE'">{{
            $t('button.modify')
          }}</span>
          <span
            class="buttonDelete"
            @click="deleteCoursesId(row.id)"
            v-permission="menuName + ':DELETE'"
            >{{ $t('button.delete') }}</span
          >
        </div>
      </template>
    </VxeTable>

    <component
      :is="componentName"
      :id="id"
      :dialogVisible="dialogVisible"
      :courseClassifyList="courseClassifyAll"
      @cancel="cancel"
      @getData="getCourses"
    />
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import selectedView from '/@/views/project_ftm/teacher/components/SelectedView/index.vue'
  import courseConfig from './components/addCourseConfigDialog.vue'
  import courseConfigDetails from './components/details.vue'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  import { deleteEmptyParams } from '/@/utils/index'
  import {
    getCourses,
    postCoursesBatchDelete,
    deleteCoursesId,
    getAirplaneTypesAll,
  } from '/@/api/ftm/teacher/trainingPlan'
  import { getCourseClassifies } from '/@/api/ftm/teacher/configSettings'
  export default {
    data() {
      return {
        menuName: 'COURSE',
        form: {
          page: 1,
          size: 10,
          total: 0,
          sort: undefined,
          order: 'asc',
          searchKey: undefined,
          airplaneTypes: undefined,
          courseClassifyId: undefined,
        },
        loading: false,
        id: undefined,
        allAlign: null,
        records: [],
        dialogVisible: false,
        airplaneTypesAll: [],
        courseClassifyAll: [],
        componentName: '',
        tableData: [],
        tableTools: {
          perfect: true,
          slots: {
            tools: 'right_tools',
          },
        },
        tableColumns: [
          { type: 'checkbox', width: '40' },
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.courseName'), width: 200 }, // 课程名称
          { field: 'code', title: this.$t('table.courseNumber'), width: 200 }, // 课程编号
          { field: 'courseClassify.name', title: this.$t('table.courseClassify'), minWidth: 120 }, // 课程分类
          { field: 'airplaneTypes', title: this.$t('table.trainingModel'), minWidth: 200 }, // 训练机型
          {
            field: 'lastModifiedDate',
            title: this.$t('table.updateTime'),
            formatter: this.formatDate,
            width: 160,
          }, // 更新时间
          { title: this.$t('table.tableEdit'), width: 210, slots: { default: 'operate' } },
        ],
      }
    },
    components: {
      VxeTable,
      selectedView,
      courseConfig,
      courseConfigDetails,
    },
    computed: {
      xTable() {
        return this.$refs.xTable?.$refs?.xTable
      },
    },
    created() {
      this.getAirplaneTypesAll()
      this.getCourseClassifies()
    },
    // TODO 原缓存页面执行activated
    mounted() {
      this.getCourses()
    },
    methods: {
      // 机型下拉列表
      getAirplaneTypesAll() {
        getAirplaneTypesAll().then((res) => {
          if (res.status == 200) {
            this.airplaneTypesAll = res.data
          }
        })
      },
      // 课程类型列表
      async getCourseClassifies() {
        const [err, res] = await to(getCourseClassifies({ page: 1, size: 100 }))
        if (!err && res.status == 200) {
          this.courseClassifyAll = res.data.content
        }
      },
      selectChangeEvent({ records }) {
        this.records = XEUtils.map(records, (item) => item.id)
      },
      getClearAll() {
        this.xTable?.clearSelectEvent()
        this.records = []
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getCourses()
      },
      add() {
        this.dialogVisible = true
        this.componentName = 'courseConfig'
      },
      // 获取课程列表
      async getCourses() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        const [err, res] = await to(getCourses(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
          this.getClearAll()
        }
      },
      deleteCoursesId(id) {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteCoursesId({ id: id }).then((res) => {
            if (res.status == 200) {
              if (
                parseInt(this.form.total / this.form.size) < this.form.page &&
                this.form.page !== 1
              ) {
                this.form.page = parseInt(this.form.total / this.form.size)
              }
              this.getCourses()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      cancel() {
        this.dialogVisible = false
        this.id = undefined
      },
      modify(id) {
        this.id = id
        this.dialogVisible = true
        this.componentName = 'courseConfig'
      },
      edit(id) {
        this.id = id
        this.dialogVisible = true
        this.componentName = 'courseConfigDetails'
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      postCoursesBatchDelete() {
        this.$confirm(this.$t('common.deleteData'), this.$t('tip.tip'), { type: 'warning' })
          .then(() => {
            postCoursesBatchDelete({ ids: this.records }).then((res) => {
              if (res.status == 200) {
                this.getCourses()
                this.$message.success(this.$t('tip.delsuccessTip'))
              }
            })
          })
          .catch()
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getCourses()
      },
    },
  }
</script>

<style scoped lang="scss"></style>
