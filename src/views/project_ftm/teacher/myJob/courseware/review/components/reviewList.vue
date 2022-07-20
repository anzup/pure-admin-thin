<template>
  <VxeTable
    :toolbar-config="tableTools"
    :data="tableData"
    :loading="loading"
    :columns="tableColumns"
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
        <el-form-item :label="$t('button.status')">
          <el-select
            v-model="form.status"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 160px"
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
            :placeholder="$t('holder.pleaseEnterTheTitle')"
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
        <span
          class="buttonEdit"
          @click="reviewDetails(row.id)"
          v-permission="menuName + ':REVIEW_DETAILS'"
          >{{ $t('button.reviewDetails') }}</span
        >
        <span
          class="buttonDelete"
          v-if="row.status == 'PENDING'"
          @click="handleDeleteDetails(row)"
          >{{ $t('button.delete') }}</span
        >
      </div>
    </template>
  </VxeTable>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import XEUtils from 'xe-utils'
  import {
    getCoursewaresAirplaneTypes,
    getCoursewareApprovals,
    deleteCoursewareApprovals,
  } from '/@/api/ftm/teacher/courseware'
  import { deleteEmptyParams } from '/@/utils/index'
  import to from 'await-to-js'
  export default {
    data() {
      return {
        menuName: 'COURSEWARE_APROVAL_LIST',
        form: {
          page: 1,
          size: 10,
          total: 0,
          airplaneType: undefined,
          propertyId: undefined,
          status: undefined,
          searchKey: undefined,
          sort: 'status,finished',
          order: 'asc,asc',
        },
        tableTools: {
          enabled: false,
        },
        airplaneTypesAll: [],
        propertyList: [],
        systemTypeList: [],
        loading: false,
        tableData: [],
        tableColumns: [
          { type: 'checkbox', width: 40 },
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.discussCourseware'), minWidth: 150 },
          { field: 'creator.name', title: this.$t('table.coursewareAuthor'), minWidth: 150 },
          { field: 'airplaneTypes', title: this.$t('table.modelNumber'), minWidth: 90 },
          {
            field: 'createdDate',
            title: this.$t('table.startTime'),
            formatter: this.formatDate,
            width: 180,
          },
          {
            field: 'endDate',
            title: this.$t('table.endTime'),
            formatter: this.formatDate,
            width: 180,
          },
          {
            field: 'finished',
            title: this.$t('button.status'),
            formatter: this.formatReviewResults,
            width: 80,
          },
          { field: 'approverNum', title: this.$t('table.reviewersNumber'), width: 80 },
          {
            field: 'status',
            title: this.$t('table.reviewResults'),
            formatter: this.formatStatus,
            width: 80,
          },
          { title: this.$t('table.tableEdit'), width: 160, slots: { default: 'operate' } },
        ],
        statusList: [
          { id: 'PENDING', name: this.$t('status.inProgress') },
          { id: 'APPROVED', name: this.$t('status.notStarted') },
          { id: 'REJECTED', name: this.$t('status.examFinished') },
        ],
      }
    },
    components: { VxeTable },
    created() {
      this.getCoursewaresAirplaneTypes()
      this.getCoursewareApprovals()
    },
    activated() {
      this.getCoursewaresAirplaneTypes()
      this.getCoursewareApprovals()
    },
    methods: {
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getCoursewareApprovals()
      },
      getCoursewaresAirplaneTypes() {
        getCoursewaresAirplaneTypes().then((res) => {
          if (res.status == 200) {
            this.airplaneTypesAll = res.data
          }
        })
      },
      async getCoursewareApprovals() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        let [err, res] = await to(getCoursewareApprovals(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
        }
      },
      // 删除评审项
      async handleDeleteDetails(item) {
        this.$confirm(
          this.$t('tip.areYouSureYouWantToDeleteTheSelected'),
          this.$t('button.delete'),
          {
            type: 'warning',
            confirmButtonText: this.$t('button.confirm'),
            cancelButtonText: this.$t('button.cancel'),
          },
        )
          .then(async () => {
            this.loading = true
            let [err] = await to(deleteCoursewareApprovals({ id: item.id }))
            if (!err) {
              this.$message.success(this.$t('tip.delsuccessTip'))
              this.getCoursewareApprovals()
            } else {
              this.loading = false
            }
          })
          .catch()
      },
      reviewDetails(id) {
        this.$router.push({
          path: 'review/detail',
          query: {
            id: id,
          },
        })
      },
      formatDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      formatStatus({ cellValue }) {
        switch (cellValue) {
          case 'PENDING':
            return this.$t('status.inProgress')
          case 'APPROVED':
            return this.$t('common.approved')
          case 'REJECTED':
            return this.$t('common.rejected')
          case 'FINISHED':
            return this.$t('status.examFinished')
          default:
            return ''
        }
      },
      formatReviewResults({ cellValue }) {
        return cellValue ? this.$t('status.examFinished') : this.$t('status.inProgress')
      },
      seqMethod(row) {
        return (this.form.page - 1) * this.form.size + row.seq
      },
      search() {
        this.form.page = 1
        this.getCoursewareApprovals()
      },
    },
  }
</script>
<style scoped lang="scss"></style>
