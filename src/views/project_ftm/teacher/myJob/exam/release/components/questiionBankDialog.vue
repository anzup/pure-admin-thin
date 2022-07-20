<template>
  <el-dialog
    :title="$t('table.multipleChoiceQuestionBank')"
    top="10vh"
    v-model="isShow"
    :before-close="handleClose"
    center
    width="700px"
  >
    <VxeTable
      ref="xTable"
      row-id="id"
      :loading="loading"
      :data="tableData"
      :height="tableHeight"
      :columns="tableColumns"
      :tablePage="{ page: form.page, size: form.size, total }"
      :checkbox-config="{ highlight: true }"
      @checkbox="selectAllEvent"
      @handlePageChange="handleCurrentChange"
    >
      <template #form>
        <el-form ref="form" :model="form" :inline="true" size="medium">
          <el-form-item :label="$t('table.questionBankMold')" v-if="routeType != 'template'">
            <el-select
              v-model="form.type"
              :placeholder="$t('holder.pleaseSelect')"
              @change="typeChange"
              style="width: 140px"
            >
              <el-option :label="$t('common.all')" :value="undefined" />
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in typeList"
                :key="item.index"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="builtinRole == 'TRAINING_ADMIN' && routeType != 'template'"
            :label="$t('table.itemBankProperties')"
          >
            <el-select
              v-model="form.confidentialType"
              :disabled="getTypeValue"
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
          <el-form-item>
            <el-input
              class="searchInput"
              :placeholder="$t('holder.pleaseEnterBankNameOrCreator')"
              suffix-icon="el-icon-search"
              v-model="form.searchKey"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="getQuestionBanks">{{
              $t('button.query')
            }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="medium" type="primary" @click="resetData">{{
              $t('button.reset')
            }}</el-button>
          </el-form-item>
        </el-form>
      </template>
    </VxeTable>

    <template #footer>
      <el-button @click="handleClose" type="primary" plain size="medium">{{
        $t('button.cancel')
      }}</el-button>
      <el-button type="primary" size="medium" @click="handleSave">{{
        $t('button.confirm')
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import VxeTable from '/@/components/Table/index.vue'
  import { getQuestionBanks } from '/@/api/ftm/teacher/examCenter'
  import { deleteEmptyParams } from '/@/utils/index'
  import to from 'await-to-js'
  import { useFtmUserStore } from '/@/store/modules/ftmUser'
  const userStore = useFtmUserStore()
  export default {
    name: 'QuestiionBankDialog',
    components: { VxeTable },
    props: ['dialogVisible', 'defaultSelecteRows'],
    data() {
      return {
        isShow: false,
        selectedRowKeys: [] /*table选中keys*/,
        form: {
          page: 1,
          size: 10,
          sort: undefined,
          order: 'asc',
          name: undefined,
          propertyId: undefined,
          airplaneType: undefined,
          type: undefined,
          confidentialType: undefined,
          searchKey: undefined,
        },
        tableData: [],
        tableColumns: [
          { type: 'checkbox', width: 40 },
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
        ],
        records: [],
        total: 1,
        loading: false,
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
    computed: {
      userInfo() {
        return userStore.$state
      },
      builtinRole() {
        return this.userInfo.builtinRole
      },
      getTypeValue() {
        return this.form.type == 'TEACHER' ? true : false
      },
      tableHeight() {
        return window.innerHeight * 0.7
      },
      routeType() {
        return this.$route.meta.status
      },
    },
    watch: {
      dialogVisible(val) {
        this.isShow = val
        if (val) {
          this.$nextTick(() => {
            this.records = this.defaultSelecteRows
            this.selectedRowKeys = this.defaultSelecteRows.map((v) => v.id)
            this.$refs.xTable.setCheckboxRow(this.defaultSelecteRows, true)
          })
        }
      },
    },
    created() {
      this.getQuestionBanks()
    },
    methods: {
      typeChange() {
        // 教务员可选择
        if (this.builtinRole == 'TRAINING_ADMIN') {
          this.form['confidentialType'] = undefined
        } else {
          this.form['confidentialType'] = 'PUBLIC'
        }
      },
      selectAllEvent({ records, checked }) {
        if (checked) {
          // 添加未选择的列
          this.tableData.forEach((item) => {
            if (
              !!records.find((v) => v.id == item.id) == true &&
              this.records.findIndex((v) => v.id == item.id) < 0
            ) {
              this.records.push(item)
            }
          })
        } else {
          this.tableData.forEach((item, i) => {
            // 删除未返回的列
            if (
              !!records.find((v) => v.id == item.id) == false &&
              this.records.findIndex((v) => v.id == item.id) > -1
            ) {
              this.records.splice(i, 1)
            }
          })
        }
      },
      async getQuestionBanks() {
        this.form = deleteEmptyParams(this.form)
        this.loading = true
        /***
         * 教务员选择题库只能选择公共题库下的保密类型
         */
        this.form.type = this.$route.meta.status == 'template' ? 'PUBLIC' : undefined
        this.form.confidentialType = this.$route.meta.status == 'template' ? 'PUBLIC' : undefined
        let [err, res] = await to(getQuestionBanks(this.form))
        this.loading = false
        if (!err && res.status == 200) {
          this.tableData = res.data.content
          this.total = res.data.totalElements
          this.$refs.xTable.setCheckboxRow(
            this.tableData.filter((v) => this.selectedRowKeys.includes(v.id)),
            true,
          )
        }
      },
      handleCurrentChange({ page, size }) {
        this.form.page = page
        this.form.size = size
        this.getQuestionBanks()
      },
      handleClose() {
        this.$emit('questiionBankCancel', this.defaultSelecteRows)
      },
      handleSave() {
        this.$emit('questiionBankCancel', this.records)
      },
      resetData() {
        this.form.page = 1
        this.form.size = 10
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
