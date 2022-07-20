<template>
  <VxeTable
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
    v-model:form="form"
    :toolbar-config="tableTools"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form ref="form" :model="form" inline size="medium">
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
        <el-form-item>
          <el-input
            :placeholder="$t('holder.pleaseInputCoursewareName')"
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
    <template #edit="{ row }">
      <div class="button-line">
        <span class="buttonEdit" @click="readMore(row)" v-permission="menuName + ':READ_MORE'">{{
          $t('button.readMore')
        }}</span>
        <span class="buttonEdit" @click="cancel(row.id)" v-permission="menuName + ':QUASH'">{{
          $t('button.revoke')
        }}</span>
      </div>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  import { deleteEmptyParams } from '/@/utils/index'
  import {
    getCoursewareAssignments,
    deleteCoursewareAssignmentsId,
  } from '/@/api/ftm/teacher/courseware'
  import to from 'await-to-js'
  export default {
    components: { VxeTable },
    data() {
      return {
        menuName: 'COURSEWARE_ASSIGNMENT',
        form: {
          // assigneeType: 'TEACHER',
          coursewareType: undefined,
          searchKey: undefined,
          page: 1,
          size: 10,
          total: 0,
          sort: 'createdDate',
          order: 'desc',
        },
        loading: false,
        tableData: [],
        tableTools: {
          enabled: false,
          slots: {
            buttons: 'left_tools',
          },
        },
        tableColumns: [
          { type: 'seq', width: '60', title: this.$t('common.serialNumber') },
          { field: 'courseware.name', title: this.$t('table.title'), minWidth: 120 },
          {
            field: 'courseware.type',
            title: this.$t('table.coursewareType'),
            formatter: this.formatType,
            width: 180,
          },
          { field: 'creator.name', title: this.$t('table.designator'), minWidth: 100 },
          {
            field: 'createdDate',
            title: this.$t('table.assignedTime'),
            formatter: this.formatDate,
            minWidth: 200,
          },
          { field: 'assigneesCount', title: this.$t('table.assigneesCount'), width: 90 },
          { field: 'finishedCount', title: this.$t('table.finishedCount'), width: 120 },
          { title: this.$t('table.tableEdit'), width: 180, slots: { default: 'operate' } },
        ],
        records: [],
        coursewareTypeList: [
          { id: 'PUBLIC', name: this.$t('table.openCourseware') },
          { id: 'THIRD_PARTY', name: this.$t('table.thirdPartyCourseware') },
          { id: 'SELF', name: this.$t('table.ownCourseware') },
        ],
      }
    },
    mounted() {
      this.getCoursewareAssignments()
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getCoursewareAssignments()
      },
      async getCoursewareAssignments() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        let [err, res] = await to(getCoursewareAssignments(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      readMore(row) {
        this.$router.push({
          path: 'record/details',
          query: {
            id: row.id,
            name: row.courseware.name,
            type: row.courseware.type,
          },
        })
      },
      cancel(id) {
        this.$confirm(this.$t('common.cancelData'), this.$t('tip.tip'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
        }).then(() => {
          deleteCoursewareAssignmentsId({ id: id }).then((res) => {
            if (res.status == 200) {
              if (parseInt(this.total / this.form.size) < this.form.page && this.form.page !== 1) {
                this.form.page = parseInt(this.total / this.form.size)
              }
              this.getCoursewareAssignments()
              this.$message.success(this.$t('tip.delsuccessTip'))
            }
          })
        })
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatType({ cellValue }) {
        if (this.coursewareTypeList.filter((v) => v.id == cellValue).length !== 0) {
          return this.coursewareTypeList.filter((v) => v.id == cellValue)[0].name
        }
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getCoursewareAssignments()
      },
    },
  }
</script>
