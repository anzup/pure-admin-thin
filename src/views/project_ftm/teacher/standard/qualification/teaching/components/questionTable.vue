<template>
  <!--TODO 未定义方法@radio-change-->
  <VxeTable
    ref="xTable"
    row-id="id"
    :loading="loading"
    :data="tableData"
    :height="tableHeight"
    :columns="tableColumns"
    v-model:form="form"
    :radio-config="{ checkRowKey: selectedRowKey }"
    @radio-change="selectEvent"
    @handlePageChange="handleCurrentChange"
  >
    <template #form>
      <el-form ref="form" :model="form" :inline="true" size="medium">
        <!-- 题库类型 -->
        <!-- <el-form-item :label="$t('table.questionBankMold')" prop="type">
              <el-select  v-model="form.type" :placeholder="$t('holder.pleaseSelect')" style="width:140px">
                  <el-option :label="$t('common.all')" :value="undefined"></el-option>
                  <el-option :label="item.name" :value="item.id" v-for="item in typeList" :key="item.index"></el-option>
              </el-select>
          </el-form-item> -->
        <!-- 题库属性 -->
        <el-form-item :label="$t('table.itemBankProperties')" prop="confidentialType">
          <el-select
            v-model="form.confidentialType"
            :placeholder="$t('holder.pleaseSelect')"
            style="width: 140px"
          >
            <el-option :label="$t('common.all')" :value="undefined" />
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in properties"
              :key="item.index"
            />
          </el-select>
        </el-form-item>
        <!-- 搜索 -->
        <el-form-item prop="searchKey">
          <el-input
            class="searchInput"
            :placeholder="$t('holder.pleaseEnterBankNameOrCreator')"
            suffix-icon="el-icon-search"
            v-model="form.searchKey"
            style="width: 250px"
          />
          <el-button size="medium" type="primary" @click="searchEvent">{{
            $t('button.query')
          }}</el-button>
          <el-button size="medium" type="primary" @click="resetEvent">{{
            $t('button.reset')
          }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #editor="{ row }">
      <div class="button-line">
        <span class="buttonEdit" @click="detailEvent(row)">{{ $t('button.details') }}</span>
      </div>
    </template>
  </VxeTable>
  <div class="dialog-footer">
    <el-button type="primary" plain size="medium" @click="cancelEvent">{{
      $t('button.cancel')
    }}</el-button>
    <el-button
      type="primary"
      size="medium"
      :disabled="records.length == 0"
      @click="cancelBindingEvent"
      >{{ $t('button.cancelBinding') }}</el-button
    >
    <el-button type="primary" size="medium" @click="saveEvent">{{
      $t('button.confirm')
    }}</el-button>
  </div>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getQuestionBanks } from '/@/api/ftm/teacher/examCenter'
  import {
    putCourseQualificationBinding,
    putCourseQualificationCancelBinding,
  } from '/@/api/ftm/teacher/qualification'
  import XEUtils from 'xe-utils'
  import to from 'await-to-js'
  const DefaultParams = {
    page: 1,
    size: 10,
    total: 0,
    sort: undefined,
    order: 'asc',
    name: undefined,
    propertyId: undefined,
    airplaneType: undefined,
    type: 'PUBLIC',
    confidentialType: undefined,
    searchKey: undefined,
  }
  export default {
    components: { VxeTable },
    data() {
      return {
        tableData: [],
        tableColumns: [
          { type: 'radio', width: 40 },
          { type: 'seq', width: 60, title: this.$t('common.serialNumber') },
          { field: 'name', title: this.$t('table.questionBankName'), minWidth: 100 },
          { field: 'creator.name', title: this.$t('table.creator'), minWidth: 120 },
          {
            field: 'type',
            title: this.$t('table.questionBankProperties'),
            formatter: this.formatType,
            width: 90,
          },
          { field: 'questionCount', title: this.$t('table.numberOfTestQuestions'), width: 90 },
          { title: this.$t('table.tableEdit'), width: 150, slots: { default: 'operate' } },
        ],
        form: XEUtils.clone(DefaultParams, true),
        loading: false,
        records: [],
        selectedRowKeys: [],
        properties: [
          { id: 'PUBLIC', name: this.$t('status.open') },
          { id: 'CONFIDENTIAL', name: this.$t('status.confidential') },
        ],
        typeList: [
          { id: 'PUBLIC', name: this.$t('table.publicQuestionBank') },
          { id: 'TEACHER', name: this.$t('table.teacherQuestionBank') },
        ],
      }
    },
    props: {
      id: [String, Number],
      defaultSelecteRows: {
        type: Array,
        default: () => [],
      },
      airplane: [String, Number],
    },
    computed: {
      windowHeight() {
        return window.innerHeight
      },
      tableHeight() {
        return this.windowHeight * 0.7
      },
      $xTable() {
        try {
          return this.$refs.xTable.$refs.xTable
        } catch (e) {
          return {}
        }
      },
      selectedRowKey() {
        if (this.selectedRowKeys.length > 0) {
          return this.selectedRowKeys[0]
        } else {
          return ''
        }
      },
    },
    mounted() {
      this.form.airplaneType = this.airplane
      DefaultParams.airplaneType = this.airplane
      this.records = this.defaultSelecteRows.map((id) => ({ id }))
      this.selectedRowKeys = this.defaultSelecteRows
      this.$xTable.setCheckboxRow(this.records, true)
      this.getQuestionBanks()
    },
    methods: {
      async getQuestionBanks() {
        this.loading = true
        let [err, res] = await to(getQuestionBanks(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.form.total = res.data.totalElements
          const checkedRadioRow = this.tableData.find((v) => this.selectedRowKey == v.id)
          this.$xTable.setRadioRow(checkedRadioRow)
        }
      },
      searchEvent() {
        this.form.page = 1
        this.getQuestionBanks()
      },
      selectEvent({ row }) {
        this.records = [row]
      },
      resetEvent() {
        this.form = XEUtils.clone(DefaultParams, true)
        this.getQuestionBanks()
      },
      cancelEvent() {
        this.$emit('handleEvent', { type: 'close' })
      },
      // 取消绑定
      cancelBindingEvent() {
        this.records = []
        this.$xTable.clearRadioRow()
      },
      detailEvent(row) {
        this.$emit('handleEvent', { type: 'detail', questionBankId: row.id })
      },
      async saveEvent() {
        // this.$emit('handleEvent', { type: 'save', records: this.records })
        let Api, params
        if (this.records.length > 0) {
          Api = putCourseQualificationBinding
          params = {
            id: this.id,
            questionBankId: this.records[0].id,
          }
        } else if (this.defaultSelecteRows.length > 0) {
          Api = putCourseQualificationCancelBinding
          params = {
            id: this.id,
          }
        }
        const [err, res] = await to(Api(params))
        if (!err && res.status == 200) {
          this.$message.success(this.$t('tip.setsuccessTip'))
          this.$emit('handleEvent', { type: 'save' })
        }
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getQuestionBanks()
      },
      formatType({ cellValue }) {
        return cellValue == 'PUBLIC'
          ? this.$t('table.publicQuestionBank')
          : this.$t('table.teacherQuestionBank')
      },
    },
  }
</script>

<style lang="scss" scoped>
  :deep(.dialog-footer) {
    margin-top: 20px;
    display: block;
    text-align: center;
  }
</style>
